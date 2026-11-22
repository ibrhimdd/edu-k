import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

function getAdminAuth() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not configured.');
  const serviceAccount = JSON.parse(raw);
  const app = getApps()[0] || initializeApp({
    credential: cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: String(serviceAccount.private_key || '').replace(/\\n/g, '\n')
    }),
    projectId: serviceAccount.project_id
  });
  return getAuth(app);
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed.' });
  }

  const diagnosticId = `fsdiag_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  try {
    const authorization = String(req.headers.authorization || '');
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
    if (!token) return res.status(401).json({ success: false, diagnosticId, error: 'Missing bearer token.' });

    const decoded = await getAdminAuth().verifyIdToken(token, true);
    const body = req.body || {};
    const report = {
      diagnosticId,
      receivedAt: new Date().toISOString(),
      uid: decoded.uid,
      email: decoded.email || null,
      operation: String(body.operation || 'unknown').slice(0, 80),
      projectId: String(body.projectId || '').slice(0, 160),
      documentId: String(body.documentId || '').slice(0, 220),
      existingDocument: body.existingDocument === true,
      userRole: String(body.userRole || '').slice(0, 80),
      firestoreDatabaseId: String(body.firestoreDatabaseId || '').slice(0, 180),
      error: {
        name: String(body.error?.name || '').slice(0, 200),
        code: String(body.error?.code || '').slice(0, 200),
        message: String(body.error?.message || '').slice(0, 3000),
        stack: String(body.error?.stack || '').slice(0, 8000),
        customData: body.error?.customData && typeof body.error.customData === 'object'
          ? body.error.customData
          : null
      },
      client: {
        userAgent: String(req.headers['user-agent'] || '').slice(0, 500),
        url: String(body.client?.url || '').slice(0, 500),
        timestamp: String(body.client?.timestamp || '').slice(0, 100)
      }
    };

    // This structured entry is available in the Vercel Function runtime logs.
    console.error('[FIRESTORE_CLIENT_DIAGNOSTIC]', JSON.stringify(report));
    return res.status(200).json({ success: true, diagnosticId, receivedAt: report.receivedAt });
  } catch (error: any) {
    console.error('[FIRESTORE_DIAGNOSTIC_ENDPOINT_FAILED]', diagnosticId, error?.code, error?.message, error?.stack);
    return res.status(500).json({
      success: false,
      diagnosticId,
      error: error?.message || 'Failed to record diagnostic report.'
    });
  }
}
