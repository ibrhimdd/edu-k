import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const DATABASE_ID = 'ai-studio-4723f5ad-ff23-4f04-8eb3-f9b012a46710';
const TOTAL_ITEMS = 56;
const ALLOWED_ROLES = ['platform_admin', 'academic_supervisor', 'researcher', 'teacher_admin'];

function getAdminServices() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('إعدادات خدمة التحكيم غير مكتملة على الخادم.');
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

async function authorize(req: any) {
  const authorization = String(req.headers.authorization || '');
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  if (!token) throw Object.assign(new Error('يلزم تسجيل الدخول بحساب محكّم مخوّل.'), { status: 401 });
  const { auth, db } = getAdminServices();
  const decoded = await auth.verifyIdToken(token, true);
  const profileSnapshot = await db.collection('users').doc(decoded.uid).get();
  if (!profileSnapshot.exists) throw Object.assign(new Error('ملف المستخدم غير موجود.'), { status: 404 });
  const profile = profileSnapshot.data()!;
  if (!ALLOWED_ROLES.includes(profile.role)) {
    throw Object.assign(new Error('صلاحية التحكيم متاحة للحسابات الأكاديمية والإدارية المعتمدة فقط.'), { status: 403 });
  }
  return { uid: decoded.uid, profile, db };
}

export default async function handler(req: any, res: any) {
  if (!['GET', 'POST'].includes(req.method)) {
    return res.status(405).json({ success: false, error: 'Method not allowed.' });
  }
  try {
    const { uid, profile, db } = await authorize(req);
    const evaluationRef = db.collection('referee_evaluations').doc(uid);

    if (req.method === 'GET') {
      const snapshot = await evaluationRef.get();
      return res.status(200).json({ success: true, evaluation: snapshot.exists ? snapshot.data() : null });
    }

    const refereeName = String(req.body?.refereeName || '').trim();
    const refereeAffiliation = String(req.body?.refereeAffiliation || '').trim();
    const input = req.body?.items;
    if (refereeName.length < 3 || refereeName.length > 180) {
      return res.status(400).json({ success: false, error: 'اسم المحكّم مطلوب (3 إلى 180 حرفاً).' });
    }
    if (refereeAffiliation.length < 3 || refereeAffiliation.length > 240) {
      return res.status(400).json({ success: false, error: 'جهة العمل مطلوبة (3 إلى 240 حرفاً).' });
    }
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
      return res.status(400).json({ success: false, error: 'بيانات التحكيم غير صحيحة.' });
    }

    const items: Record<string, { wording: 'appropriate' | 'inappropriate'; accuracy: 'accurate' | 'inaccurate'; notes: string }> = {};
    for (let number = 1; number <= TOTAL_ITEMS; number++) {
      const key = `eng_${number}`;
      const item = input[key];
      if (!item || !['appropriate', 'inappropriate'].includes(item.wording) ||
          !['accurate', 'inaccurate'].includes(item.accuracy)) {
        return res.status(400).json({ success: false, error: `يجب استكمال تقييم الصياغة والدقة للعبارة رقم ${number}.` });
      }
      items[key] = {
        wording: item.wording,
        accuracy: item.accuracy,
        notes: String(item.notes || '').slice(0, 1200)
      };
    }

    const submittedAt = new Date().toISOString();
    const evaluation = {
      reviewerId: uid,
      refereeName,
      refereeAffiliation,
      reviewerRole: profile.role,
      items,
      completedItemsCount: TOTAL_ITEMS,
      submittedAt,
      updatedAt: submittedAt
    };
    await evaluationRef.set(evaluation, { merge: true });
    return res.status(200).json({ success: true, evaluation });
  } catch (error: any) {
    const status = error?.status || (
      error?.code === 'auth/id-token-expired' || error?.code === 'auth/invalid-id-token' ? 401 : 500
    );
    console.error('Referee evaluation request failed:', error);
    return res.status(status).json({
      success: false,
      error: status === 401 ? 'انتهت جلسة الدخول. سجل الدخول مرة أخرى.' : error?.message || 'تعذر تنفيذ طلب التحكيم.'
    });
  }
}
