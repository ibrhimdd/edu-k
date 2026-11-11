import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import {
  ENGAGEMENT_ITEMS,
  calculateEngagementDimensionScores
} from '../../src/data/engagementScaleData';

const DATABASE_ID = 'ai-studio-4723f5ad-ff23-4f04-8eb3-f9b012a46710';

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
  return {
    auth: getAuth(app),
    db: getFirestore(app, DATABASE_ID)
  };
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed.' });
  }

  try {
    const authorization = String(req.headers.authorization || '');
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
    if (!token) {
      return res.status(401).json({ success: false, error: 'يلزم تسجيل الدخول أولاً.' });
    }

    const { auth, db } = getAdminServices();
    const decoded = await auth.verifyIdToken(token, true);
    const profileRef = db.collection('users').doc(decoded.uid);
    const profileSnapshot = await profileRef.get();

    if (!profileSnapshot.exists) {
      return res.status(404).json({ success: false, error: 'ملف الطالب غير موجود.' });
    }

    const profile = profileSnapshot.data()!;
    if (!['student_individual', 'student_collaborative'].includes(profile.role) || profile.status !== 'active') {
      return res.status(403).json({ success: false, error: 'هذه العملية متاحة للطلاب النشطين فقط.' });
    }

    const answers = req.body?.answers;
    if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
      return res.status(400).json({ success: false, error: 'استجابات المقياس غير صالحة.' });
    }

    const allowedIds = new Set(ENGAGEMENT_ITEMS.map(item => item.id));
    const answerKeys = Object.keys(answers);
    const hasAllItems = answerKeys.length === ENGAGEMENT_ITEMS.length
      && ENGAGEMENT_ITEMS.every(item => Object.prototype.hasOwnProperty.call(answers, item.id));
    const hasValidValues = answerKeys.every(key =>
      allowedIds.has(key)
      && Number.isInteger(answers[key])
      && answers[key] >= 1
      && answers[key] <= 5
    );

    if (!hasAllItems || !hasValidValues) {
      return res.status(400).json({
        success: false,
        error: 'يجب إرسال إجابة صحيحة من 1 إلى 5 لكل عبارة من العبارات الـ 56.'
      });
    }

    // Recalculate all dimensions on the trusted server from the official instrument.
    const calculated = calculateEngagementDimensionScores(answers);
    const submittedAt = new Date().toISOString();
    const engagementScore = {
      cognitive: calculated.dimensions.cognitive.percentage,
      behavioral: calculated.dimensions.behavioral.percentage,
      emotional: calculated.dimensions.emotional.percentage,
      social: calculated.dimensions.social.percentage,
      totalScore: calculated.rawTotal,
      percentage: calculated.totalPercentage,
      level: calculated.level,
      completedItemsCount: calculated.totalAnswered,
      itemResponses: answers,
      submittedAt
    };

    const resultRef = db.collection('engagement_results').doc();
    const batch = db.batch();
    batch.set(resultRef, {
      userId: decoded.uid,
      experimentalGroup: profile.experimentalGroup || (
        profile.role === 'student_collaborative' ? 'collaborative_group' : 'individual_group'
      ),
      instrumentVersion: 'engagement-scale-56-v1',
      totalItems: ENGAGEMENT_ITEMS.length,
      answers,
      scores: {
        cognitive: engagementScore.cognitive,
        behavioral: engagementScore.behavioral,
        emotional: engagementScore.emotional,
        social: engagementScore.social,
        totalScore: engagementScore.totalScore,
        percentage: engagementScore.percentage,
        level: engagementScore.level
      },
      submittedAt
    });
    batch.update(profileRef, { engagementScore });
    await batch.commit();

    return res.status(200).json({
      success: true,
      recordId: resultRef.id,
      engagementScore
    });
  } catch (error: any) {
    console.error('Engagement scale save failed:', error);
    const status = error?.code === 'auth/id-token-expired' || error?.code === 'auth/invalid-id-token' ? 401 : 500;
    return res.status(status).json({
      success: false,
      error: status === 401
        ? 'انتهت جلسة الدخول. سجل الدخول مرة أخرى.'
        : 'تعذر حفظ استجابات مقياس الانخراط. حاول مرة أخرى.'
    });
  }
}
