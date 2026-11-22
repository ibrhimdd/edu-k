import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const DATABASE_ID = 'ai-studio-4723f5ad-ff23-4f04-8eb3-f9b012a46710';
const TOTAL_ITEMS = 56;

function getAdminServices() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('إعدادات حفظ مقياس الانخراط غير مكتملة على الخادم.');
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

function calculateScores(responses: Record<string, number>) {
  const dimensions = {
    cognitive: { sum: 0 },
    behavioral: { sum: 0 },
    emotional: { sum: 0 },
    social: { sum: 0 }
  };
  for (let number = 1; number <= TOTAL_ITEMS; number++) {
    const value = responses[`eng_${number}`];
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      throw new Error('يرجى الإجابة عن جميع العبارات بإجابة صحيحة من 1 إلى 5.');
    }
    const key = number <= 14 ? 'cognitive' : number <= 28 ? 'behavioral' : number <= 42 ? 'emotional' : 'social';
    dimensions[key].sum += value;
  }
  const totalScore = Object.values(dimensions).reduce((sum, item) => sum + item.sum, 0);
  const percentage = Math.round((totalScore / (TOTAL_ITEMS * 5)) * 100);
  const level = percentage >= 85 ? 'مرتفع جداً' : percentage >= 70 ? 'مرتفع' : percentage >= 50 ? 'متوسط' : 'منخفض';
  return {
    cognitive: Math.round((dimensions.cognitive.sum / 70) * 100),
    behavioral: Math.round((dimensions.behavioral.sum / 70) * 100),
    emotional: Math.round((dimensions.emotional.sum / 70) * 100),
    social: Math.round((dimensions.social.sum / 70) * 100),
    totalScore,
    percentage,
    level,
    completedItemsCount: TOTAL_ITEMS,
    itemResponses: responses
  };
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
    if (profile.postTestScore === undefined && !profile.postTestSubmittedAt) {
      return res.status(403).json({ success: false, error: 'يجب إتمام الاختبار البعدي أولاً.' });
    }

    const input = req.body?.itemResponses;
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
      return res.status(400).json({ success: false, error: 'استجابات المقياس غير صحيحة.' });
    }
    const itemResponses: Record<string, number> = {};
    for (let number = 1; number <= TOTAL_ITEMS; number++) {
      const key = `eng_${number}`;
      const value = input[key];
      if (!Number.isInteger(value) || value < 1 || value > 5) {
        return res.status(400).json({ success: false, error: 'يجب الإجابة عن العبارات الـ56 قبل الحفظ.' });
      }
      itemResponses[key] = value;
    }

    const submittedAt = new Date().toISOString();
    const engagementScore = { ...calculateScores(itemResponses), submittedAt };
    const batch = db.batch();
    batch.update(profileRef, { engagementScore });
    batch.set(db.collection('engagement_logs').doc(decoded.uid), {
      userId: decoded.uid,
      studentName: String(profile.name || ''),
      studentEmail: String(profile.email || decoded.email || ''),
      type: 'engagement_scale',
      ...engagementScore
    });
    await batch.commit();
    return res.status(200).json({ success: true, engagementScore });
  } catch (error: any) {
    console.error('Engagement scale save failed:', error);
    const status = error?.code === 'auth/id-token-expired' || error?.code === 'auth/invalid-id-token' ? 401 : 500;
    return res.status(status).json({
      success: false,
      error: status === 401 ? 'انتهت جلسة الدخول. سجل الدخول مرة أخرى.' : error?.message || 'تعذر حفظ مقياس الانخراط. حاول مرة أخرى.'
    });
  }
}
