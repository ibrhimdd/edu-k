import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const DATABASE_ID = 'ai-studio-4723f5ad-ff23-4f04-8eb3-f9b012a46710';

function getAdminServices() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('إعدادات حفظ نتائج الاختبارات غير مكتملة على الخادم.');
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
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed.' });
  try {
    const authorization = String(req.headers.authorization || '');
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
    if (!token) return res.status(401).json({ success: false, error: 'يلزم تسجيل الدخول أولاً.' });

    const { auth, db } = getAdminServices();
    const decoded = await auth.verifyIdToken(token, true);
    const profileRef = db.collection('users').doc(decoded.uid);
    const profileSnapshot = await profileRef.get();
    if (!profileSnapshot.exists) return res.status(404).json({ success: false, error: 'ملف الطالب غير موجود.' });
    const profile = profileSnapshot.data()!;
    if (!['student_individual', 'student_collaborative'].includes(profile.role) || profile.status !== 'active') {
      return res.status(403).json({ success: false, error: 'هذه العملية متاحة للطلاب المسجلين فقط.' });
    }

    const type = req.body?.type;
    const score = Number(req.body?.score);
    const answers = req.body?.answers;
    const correctAnswers = Number(req.body?.correctAnswers);
    const totalQuestions = Number(req.body?.totalQuestions);
    if (!['pre_test', 'post_test'].includes(type)
      || !Number.isInteger(score) || score < 0 || score > 100
      || !answers || typeof answers !== 'object' || Array.isArray(answers)
      || !Number.isInteger(correctAnswers) || correctAnswers < 0
      || !Number.isInteger(totalQuestions) || totalQuestions < 1 || correctAnswers > totalQuestions) {
      return res.status(400).json({ success: false, error: 'بيانات نتيجة الاختبار غير مكتملة أو غير صحيحة.' });
    }

    const submittedAt = new Date().toISOString();
    const resultRef = db.collection('assessment_results').doc(decoded.uid + '_' + type);
    const batch = db.batch();
    batch.set(resultRef, {
      userId: decoded.uid,
      studentName: String(profile.name || ''),
      studentEmail: String(profile.email || decoded.email || ''),
      type,
      score,
      correctAnswers,
      totalQuestions,
      answers,
      submittedAt
    });
    const profileUpdate: Record<string, any> = type === 'pre_test'
      ? { preTestScore: score, preTestAnswers: answers, preTestSubmittedAt: submittedAt }
      : { postTestScore: score, postTestAnswers: answers, postTestSubmittedAt: submittedAt };
    batch.update(profileRef, profileUpdate);
    await batch.commit();

    return res.status(200).json({ success: true, score, submittedAt });
  } catch (error: any) {
    console.error('Assessment result save failed:', error);
    const status = error?.code === 'auth/id-token-expired' || error?.code === 'auth/invalid-id-token' ? 401 : 500;
    return res.status(status).json({
      success: false,
      error: status === 401 ? 'انتهت جلسة الدخول. سجل الدخول مرة أخرى.' : 'تعذر حفظ نتيجة الاختبار. حاول مرة أخرى.'
    });
  }
}
