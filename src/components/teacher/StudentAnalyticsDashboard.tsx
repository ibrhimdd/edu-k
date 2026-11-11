import React, { useEffect, useMemo, useState } from 'react';
import { Activity, BookOpen, CalendarClock, CheckCircle2, Clock3, Code2, FileText, Gauge, LogIn, LogOut, Target, TrendingUp, Users, XCircle } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { requireFirebase } from '../../lib/firebase';
import { ProjectDefinition, ProjectSubmission, UserProfile } from '../../types/schema';

type SessionRecord = {
  id: string;
  userId: string;
  sessionId?: string;
  eventType?: string;
  loginAt?: string;
  logoutAt?: string;
  lastSeenAt?: string;
  durationSeconds?: number;
  createdAt?: string;
};

type Props = {
  student: UserProfile;
  projects: ProjectDefinition[];
  submissions: ProjectSubmission[];
};

const pct = (value?: number) => Math.max(0, Math.min(100, Number(value) || 0));
const dateLabel = (value?: string) => value ? new Date(value).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' }) : '—';
const durationLabel = (seconds: number) => {
  const safe = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  return hours ? `${hours} س ${minutes} د` : `${minutes} دقيقة`;
};

export const StudentAnalyticsDashboard: React.FC<Props> = ({ student, projects, submissions }) => {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionsError, setSessionsError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const { db } = requireFirebase();
        const snapshot = await getDocs(collection(db, 'engagement_logs'));
        const rows = snapshot.docs
          .map(item => ({ id: item.id, ...item.data() } as SessionRecord))
          .filter(item => item.userId === student.id && (item.eventType === 'session' || !!item.loginAt))
          .sort((a, b) => (b.loginAt || '').localeCompare(a.loginAt || ''));
        if (active) setSessions(rows);
      } catch (error) {
        if (active) setSessionsError('تعذر تحميل سجل الجلسات من قاعدة البيانات.');
      } finally {
        if (active) setSessionsLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [student.id]);

  const studentSubmissions = useMemo(() => submissions.filter(item =>
    student.role === 'student_collaborative' && student.teamId
      ? item.teamId === student.teamId
      : item.studentId === student.id
  ), [submissions, student.id, student.role, student.teamId]);

  const orderedProjects = useMemo(() => [...projects].sort((a, b) => a.order - b.order).slice(0, 4), [projects]);
  const completedProjects = orderedProjects.filter(project => studentSubmissions.some(item =>
    item.projectId === project.id && ['submitted', 'evaluated', 'revision_requested'].includes(item.status)
  )).length;
  const submittedCount = studentSubmissions.filter(item => ['submitted', 'evaluated', 'revision_requested'].includes(item.status)).length;
  const averageProjectScore = studentSubmissions.filter(item => item.totalScore !== undefined)
    .reduce((sum, item, _, arr) => sum + (Number(item.totalScore) || 0) / arr.length, 0);

  const totalSeconds = sessions.reduce((sum, item) => sum + Math.max(0, Number(item.durationSeconds) || 0), 0);
  const latestSession = sessions[0];
  const avgSessionSeconds = sessions.length ? totalSeconds / sessions.length : 0;
  const completedLessons = Number(student.completedActivitiesCount) || 0;
  const engagement = student.engagementScore;
  const pre = student.preTestScore;
  const post = student.postTestScore;
  const gain = pre !== undefined && post !== undefined ? post - pre : undefined;
  const dimensions = [
    { label: 'المعرفي', value: engagement?.cognitive },
    { label: 'السلوكي', value: engagement?.behavioral },
    { label: 'الوجداني', value: engagement?.emotional },
    { label: 'الاجتماعي', value: engagement?.social }
  ].filter(item => item.value !== undefined);

  return (
    <section className="space-y-5" dir="rtl">
      <div className="rounded-3xl p-5 sm:p-6 text-white bg-gradient-to-l from-[#06383A] via-[#07545A] to-[#006D77] border border-[#39878A] shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs text-[#BDE7E1] font-bold mb-2"><Activity className="w-4 h-4" /> الملف التحليلي للطالب</div>
            <h3 className="text-xl sm:text-2xl font-black">{student.name}</h3>
            <p className="text-xs text-[#D7ECEA] mt-1">{student.email} · {student.experimentalGroup === 'collaborative_group' ? 'المجموعة التشاركية' : 'المجموعة الفردية'}</p>
          </div>
          <div className="text-left">
            <div className="text-xs text-[#BDE7E1]">التقييم العام للتقدم</div>
            <div className="text-4xl font-black">{pct(student.progressPercentage)}<span className="text-lg">%</span></div>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mt-5">
          {[
            { label: 'القبلي', value: pre === undefined ? '—' : `${pre}%`, icon: Target },
            { label: 'البعدي', value: post === undefined ? '—' : `${post}%`, icon: TrendingUp },
            { label: 'المشروعات المسلّمة', value: `${completedProjects}/${orderedProjects.length}`, icon: Code2 },
            { label: 'الانخراط', value: engagement?.percentage === undefined ? 'غير مسجل' : `${engagement.percentage}%`, icon: Users }
          ].map((item, index) => {
            const Icon = item.icon;
            return <div key={item.label} className="rounded-2xl bg-white/10 border border-white/15 p-3">
              <div className="flex items-center justify-between text-[#D7ECEA] text-[11px]"><span>{item.label}</span><Icon className="w-4 h-4" /></div>
              <div className="text-xl font-black mt-1">{item.value}</div>
            </div>;
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-[#D7E8E8] p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4"><h4 className="font-black text-[#064B50] flex items-center gap-2"><TrendingUp className="w-4 h-4" /> مقارنة الاختبار القبلي والبعدي</h4><span className="text-[10px] text-slate-500">من 100</span></div>
          <div className="space-y-4">
            {[{ label: 'الاختبار القبلي', value: pre, color: '#E29578' }, { label: 'الاختبار البعدي', value: post, color: '#006D77' }].map(row =>
              <div key={row.label}>
                <div className="flex justify-between text-xs mb-1.5"><span className="font-bold text-slate-700">{row.label}</span><b className="text-[#064B50]">{row.value === undefined ? 'لم يؤدَّ بعد' : `${row.value}%`}</b></div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: `${pct(row.value)}%`, background: row.color }} /></div>
              </div>
            )}
          </div>
          <div className="mt-4 rounded-xl bg-[#EDF6F9] p-3 flex items-center justify-between">
            <span className="text-xs font-bold text-[#315B60]">مقدار التحسن بين الاختبارين</span>
            <strong className={gain === undefined ? 'text-slate-500' : gain >= 0 ? 'text-emerald-700' : 'text-rose-700'}>{gain === undefined ? 'غير متاح' : `${gain > 0 ? '+' : ''}${gain} نقطة`}</strong>
          </div>
          {gain !== undefined && <p className="text-[11px] text-slate-500 mt-2">المقارنة وصفية بين النتيجتين المسجلتين، وليست وحدها دليلًا على سبب التحسن.</p>}
        </div>

        <div className="bg-white rounded-2xl border border-[#D7E8E8] p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4"><h4 className="font-black text-[#064B50] flex items-center gap-2"><Gauge className="w-4 h-4" /> تحليل الانخراط</h4><span className="text-[10px] text-slate-500">{engagement?.level || 'لا يوجد تصنيف'}</span></div>
          {dimensions.length ? <div className="space-y-3">
            {dimensions.map(item => <div key={item.label}>
              <div className="flex justify-between text-xs mb-1"><span className="font-semibold text-slate-700">{item.label}</span><b className="text-[#006D77]">{pct(item.value)}%</b></div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-l from-[#006D77] to-[#83C5BE] rounded-full" style={{ width: `${pct(item.value)}%` }} /></div>
            </div>)}
          </div> : <div className="rounded-xl bg-slate-50 p-5 text-center text-xs text-slate-500">لم تُسجل استجابات مقياس الانخراط لهذا الطالب بعد.</div>}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="bg-[#EDF6F9] rounded-xl p-3"><span className="text-[10px] text-slate-500 block">عدد عبارات المقياس</span><b className="text-[#064B50]">{engagement?.completedItemsCount ?? '—'}</b></div>
            <div className="bg-[#EDF6F9] rounded-xl p-3"><span className="text-[10px] text-slate-500 block">تاريخ آخر استجابة</span><b className="text-[11px] text-[#064B50]">{dateLabel(engagement?.submittedAt)}</b></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#D7E8E8] p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-4"><h4 className="font-black text-[#064B50] flex items-center gap-2"><BookOpen className="w-4 h-4" /> التقدم في المحتوى التعليمي</h4><b className="text-[#006D77]">{pct(student.progressPercentage)}%</b></div>
        <div className="h-4 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-l from-[#006D77] via-[#2D9293] to-[#83C5BE] rounded-full" style={{ width: `${pct(student.progressPercentage)}%` }} /></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
          <div className="rounded-xl bg-[#EDF6F9] p-3"><span className="text-[10px] text-slate-500 block">أنشطة مكتملة</span><b className="text-lg text-[#064B50]">{completedLessons}</b></div>
          <div className="rounded-xl bg-[#EDF6F9] p-3"><span className="text-[10px] text-slate-500 block">مشروعات مكتملة وفق الملف</span><b className="text-lg text-[#064B50]">{student.completedProjectsCount || 0}</b></div>
          <div className="rounded-xl bg-[#EDF6F9] p-3 col-span-2 sm:col-span-1"><span className="text-[10px] text-slate-500 block">آخر تحديث للملف</span><b className="text-[11px] text-[#064B50]">{dateLabel(student.postTestSubmittedAt || student.preTestSubmittedAt)}</b></div>
        </div>
        <p className="text-[10px] text-slate-500 mt-3">نسبة المحتوى والأنشطة مأخوذة من حقول التقدم المحفوظة في ملف الطالب؛ تفاصيل كل درس لا تظهر إلا إذا كانت أحداث فتح/إكمال الدروس مسجلة.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#D7E8E8] p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-4"><h4 className="font-black text-[#064B50] flex items-center gap-2"><Code2 className="w-4 h-4" /> سجل المشروعات الأربعة</h4><span className="text-xs font-bold text-[#006D77]">{completedProjects} من {orderedProjects.length} مسلّم</span></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {orderedProjects.map((project, index) => {
            const submission = studentSubmissions.find(item => item.projectId === project.id);
            const submitted = !!submission && ['submitted', 'evaluated'].includes(submission.status);
            const evaluated = submission?.status === 'evaluated' || submission?.totalScore !== undefined;
            return <div key={project.id} className="rounded-2xl border border-slate-200 p-4 bg-gradient-to-br from-white to-slate-50">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2"><span className="w-8 h-8 rounded-xl bg-[#EDF6F9] text-[#006D77] font-black flex items-center justify-center text-sm">{index + 1}</span><div><h5 className="font-extrabold text-slate-800 text-sm">{project.title}</h5><p className="text-[10px] text-slate-500 mt-1">{project.difficulty || 'مشروع تطبيقي'}</p></div></div>
                <span className={submitted ? 'text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full' : 'text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded-full'}>{submitted ? 'تم التسليم' : submission ? 'مسودة / قيد التنفيذ' : 'لم يُسلّم'}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-600">
                <span>{submission?.submittedAt ? `تاريخ التسليم: ${dateLabel(submission.submittedAt)}` : 'لا يوجد تاريخ تسليم'}</span>
                {evaluated ? <b className="text-[#006D77]">الدرجة: {submission?.totalScore ?? '—'}/100</b> : <span className="text-slate-400">لم يُقيّم بعد</span>}
              </div>
              {submission?.teacherGeneralFeedback && <p className="mt-2 p-2 rounded-lg bg-[#EDF6F9] text-[11px] text-[#315B60]">ملاحظة المشرف: {submission.teacherGeneralFeedback}</p>}
            </div>;
          })}
        </div>
        <div className="mt-3 text-[11px] text-slate-500">عدد التسليمات المسجلة: {submittedCount} · متوسط درجات المشروعات المقيمة: {studentSubmissions.some(item => item.totalScore !== undefined) ? `${Math.round(averageProjectScore)}%` : 'لا توجد درجات مرصودة بعد'}</div>
      </div>

      <div className="bg-white rounded-2xl border border-[#D7E8E8] p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3"><h4 className="font-black text-[#064B50] flex items-center gap-2"><CalendarClock className="w-4 h-4" /> سجل الحضور والجلسات</h4><span className="text-[10px] text-slate-500">سجل فعلي من المنصة</span></div>
        {sessionsLoading ? <p className="text-xs text-slate-500 py-4 text-center">جارٍ تحميل سجل الجلسات...</p> : sessionsError ? <p className="text-xs text-rose-700 py-4 text-center">{sessionsError}</p> : sessions.length ? <>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
            <div className="rounded-xl bg-[#EDF6F9] p-3"><span className="text-[10px] text-slate-500 block">عدد الجلسات</span><b className="text-lg text-[#064B50]">{sessions.length}</b></div>
            <div className="rounded-xl bg-[#EDF6F9] p-3"><span className="text-[10px] text-slate-500 block">إجمالي الوقت</span><b className="text-lg text-[#064B50]">{durationLabel(totalSeconds)}</b></div>
            <div className="rounded-xl bg-[#EDF6F9] p-3"><span className="text-[10px] text-slate-500 block">متوسط الجلسة</span><b className="text-lg text-[#064B50]">{durationLabel(avgSessionSeconds)}</b></div>
            <div className="rounded-xl bg-[#EDF6F9] p-3"><span className="text-[10px] text-slate-500 block">آخر دخول</span><b className="text-[11px] text-[#064B50]">{dateLabel(latestSession?.loginAt)}</b></div><div className="rounded-xl bg-amber-50 border border-amber-100 p-3"><span className="text-[10px] text-amber-700 block">نسبة الحضور</span><b className="text-[11px] text-amber-900">تحتاج جدولًا دراسيًا</b></div>
          </div>
          <div className="overflow-x-auto"><table className="w-full text-right text-xs"><thead className="text-slate-500 border-b"><tr><th className="p-2">تاريخ الدخول</th><th className="p-2">تاريخ الخروج</th><th className="p-2">المدة</th><th className="p-2">الحالة</th></tr></thead><tbody className="divide-y">{sessions.slice(0, 12).map(item => <tr key={item.id}><td className="p-2 text-slate-700">{dateLabel(item.loginAt)}</td><td className="p-2 text-slate-700">{dateLabel(item.logoutAt || item.lastSeenAt)}</td><td className="p-2 font-bold text-[#006D77]">{durationLabel(item.durationSeconds || 0)}</td><td className="p-2">{item.logoutAt ? 'خرج' : 'آخر نبضة مسجلة'}</td></tr>)}</tbody></table></div>
        </> : <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-center"><Clock3 className="w-6 h-6 text-amber-600 mx-auto mb-2" /><p className="text-xs font-bold text-amber-900">لا توجد جلسات محفوظة لهذا الطالب حتى الآن.</p><p className="text-[11px] text-amber-800 mt-1">سيظهر وقت الدخول والخروج وإجمالي مدة الاستخدام بعد تفعيل تسجيل الجلسات. لا تتوفر بيانات تاريخية قبل التفعيل.</p></div>}
      </div>
    </section>
  );
};
