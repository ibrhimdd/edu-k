import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const DATABASE_ID = 'ai-studio-4723f5ad-ff23-4f04-8eb3-f9b012a46710';

function getAdminServices() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('إعدادات إنشاء الحسابات غير مكتملة على الخادم.');
  const serviceAccount = JSON.parse(raw);
  const app = getApps()[0] || initializeApp({
    credential: cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: String(serviceAccount.private_key || '').replace(/\\n/g, '\n')
    }),
    projectId: serviceAccount.project_id
  });
  return { auth: getAuth(app), db: getFirestore(app, DATABASE_ID) };
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST' && req.method !== 'DELETE') return res.status(405).json({ success: false, error: 'Method not allowed.' });
  try {
    const authorization = String(req.headers.authorization || '');
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
    if (!token) return res.status(401).json({ success: false, error: 'يلزم تسجيل الدخول أولاً.' });

    const { auth, db } = getAdminServices();
    const decoded = await auth.verifyIdToken(token, true);
    const adminSnapshot = await db.collection('users').doc(decoded.uid).get();
    if (!adminSnapshot.exists || adminSnapshot.data()?.role !== 'platform_admin' || adminSnapshot.data()?.status !== 'active') {
      return res.status(403).json({ success: false, error: 'هذه العملية متاحة لمدير المنصة فقط.' });
    }

    if (req.method === 'DELETE') {
      const studentId = String(req.body?.studentId || '').trim();
      if (!studentId || studentId === decoded.uid) {
        return res.status(400).json({ success: false, error: 'معرّف الطالب غير صالح.' });
      }
      const studentRef = db.collection('users').doc(studentId);
      const studentSnapshot = await studentRef.get();
      if (!studentSnapshot.exists) {
        return res.status(404).json({ success: false, error: 'الطالب غير موجود.' });
      }
      const studentRole = studentSnapshot.data()?.role;
      if (studentRole !== 'student_individual' && studentRole !== 'student_collaborative') {
        return res.status(403).json({ success: false, error: 'يمكن حذف حسابات الطلاب فقط من هذه الصفحة.' });
      }

      // Delete the Firebase Authentication account first, then its profile.
      // Historical assessment/submission records are intentionally retained.
      await auth.deleteUser(studentId);
      await studentRef.delete();
      return res.status(200).json({ success: true, deletedId: studentId });
    }

    const students = Array.isArray(req.body?.students) ? req.body.students : [];
    if (!students.length || students.length > 50) {
      return res.status(400).json({ success: false, error: 'أرسل من 1 إلى 50 طالبًا في الطلب الواحد.' });
    }

    const created: any[] = [];
    const failed: string[] = [];
    for (const input of students) {
      const name = String(input?.name || '').trim();
      const email = String(input?.email || '').trim().toLowerCase();
      const password = String(input?.password || '');
      const group = input?.group === 'collaborative_group' ? 'collaborative_group' : 'individual_group';
      if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 6) {
        failed.push(email || name || 'بيانات غير مكتملة');
        continue;
      }
      let uid: string | null = null;
      try {
        const userRecord = await auth.createUser({ email, password, displayName: name, disabled: false });
        uid = userRecord.uid;
        const profile = {
          name,
          email,
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=' + encodeURIComponent(name),
          role: group === 'collaborative_group' ? 'student_collaborative' : 'student_individual',
          experimentalGroup: group,
          ...(group === 'collaborative_group' ? { teamRole: input.teamRole || 'coder' } : {}),
          ...(input.teamId ? { teamId: String(input.teamId) } : {}),
          ...(input.studentIdNum ? { studentIdNum: String(input.studentIdNum) } : {}),
          joinedAt: new Date().toISOString().slice(0, 10),
          status: 'active',
          progressPercentage: 0,
          completedProjectsCount: 0,
          completedActivitiesCount: 0,
          engagementScore: { behavioral: 0, cognitive: 0, emotional: 0 }
        };
        await db.collection('users').doc(uid).set(profile);
        created.push({ id: uid, ...profile });
      } catch (error: any) {
        if (uid) {
          try { await auth.deleteUser(uid); } catch (rollbackError) { console.error('Auth rollback failed:', rollbackError); }
        }
        failed.push(email + ': ' + (error?.code === 'auth/email-already-exists' ? 'البريد مستخدم بالفعل' : 'فشل إنشاء الحساب'));
      }
    }
    return res.status(200).json({ success: true, created, failed });
  } catch (error: any) {
    console.error('Admin student provisioning failed:', error);
    const status = error?.code === 'auth/id-token-expired' || error?.code === 'auth/invalid-id-token' ? 401 : 500;
    return res.status(status).json({ success: false, error: status === 401 ? 'انتهت جلسة الدخول. سجل الدخول مرة أخرى.' : 'حدث خطأ أثناء إنشاء الحسابات على الخادم.' });
  }
}
