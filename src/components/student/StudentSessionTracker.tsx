import { useEffect } from 'react';
import { collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { requireFirebase } from '../../lib/firebase';
import { useApp } from '../../context/AppContext';

// Records foreground usage time only; background tabs are not counted.
export const StudentSessionTracker: React.FC = () => {
  const { currentUser, isAuthenticated } = useApp();

  useEffect(() => {
    if (!isAuthenticated || !currentUser?.id || !['student_individual', 'student_collaborative'].includes(currentUser.role)) return;

    let disposed = false;
    let activeSeconds = 0;
    let lastHeartbeat = Date.now();
    let sessionRef: ReturnType<typeof doc> | null = null;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const flush = async (closing = false) => {
      if (!sessionRef || disposed && !closing) return;
      const now = new Date();
      try {
        await updateDoc(sessionRef, {
          lastSeenAt: now.toISOString(),
          durationSeconds: activeSeconds,
          ...(closing ? { logoutAt: now.toISOString(), sessionStatus: 'closed' } : {})
        });
      } catch (error) {
        console.warn('Unable to update student session record:', error);
      }
    };

    const start = async () => {
      try {
        const { db } = requireFirebase();
        sessionRef = doc(collection(db, 'engagement_logs'));
        const now = new Date();
        await setDoc(sessionRef, {
          userId: currentUser.id,
          studentName: currentUser.name,
          eventType: 'session',
          sessionStatus: 'active',
          loginAt: now.toISOString(),
          lastSeenAt: now.toISOString(),
          durationSeconds: 0,
          createdAt: now.toISOString()
        });
        if (disposed) {
          await flush(true);
          return;
        }
        lastHeartbeat = Date.now();
        intervalId = setInterval(() => {
          if (document.visibilityState !== 'visible') {
            lastHeartbeat = Date.now();
            return;
          }
          const nowMs = Date.now();
          activeSeconds += Math.max(0, Math.round((nowMs - lastHeartbeat) / 1000));
          lastHeartbeat = nowMs;
          void flush(false);
        }, 30000);
      } catch (error) {
        console.warn('Unable to start student session tracking:', error);
      }
    };

    const handleVisibility = () => { lastHeartbeat = Date.now(); };
    document.addEventListener('visibilitychange', handleVisibility);
    void start();

    return () => {
      disposed = true;
      if (intervalId) clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (sessionRef) void flush(true);
    };
  }, [currentUser?.id, currentUser?.name, currentUser?.role, isAuthenticated]);

  return null;
};
