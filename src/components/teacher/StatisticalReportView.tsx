import React, { useMemo, useState } from 'react';
import { Activity, BarChart3, Download, FileSpreadsheet, Printer, Users } from 'lucide-react';
import { UserProfile, ProjectSubmission } from '../../types/schema';
import {
  calculateDescriptiveStats,
  calculatePairedTTest,
  calculateIndependentTTest,
  generateSPSSCSV,
  downloadCSV
} from '../../utils/statistics';

interface StatisticalReportViewProps {
  students: UserProfile[];
  submissions: ProjectSubmission[];
}

type NumericResult = ReturnType<typeof calculateDescriptiveStats>;

const validNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const formatNumber = (value: number | undefined, suffix = '') =>
  validNumber(value) ? `${value.toFixed(2)}${suffix}` : '—';

const formatP = (value: number | undefined) =>
  validNumber(value) ? value < 0.001 ? '< 0.001' : value.toFixed(4) : '—';

const describe = (values: number[]): NumericResult => calculateDescriptiveStats(values);

const testDecision = (result: ReturnType<typeof calculateIndependentTTest> | ReturnType<typeof calculatePairedTTest>) => {
  if (!result.df || result.df < 1) return 'بيانات غير كافية';
  return result.isSignificant ? 'دال إحصائياً عند 0.05' : 'غير دال إحصائياً عند 0.05';
};

export const StatisticalReportView: React.FC<StatisticalReportViewProps> = ({ students, submissions }) => {
  const [showPrintModal, setShowPrintModal] = useState(false);

  const safeStudents = students || [];
  const safeSubmissions = submissions || [];

  const individual = useMemo(
    () => safeStudents.filter(student => student.experimentalGroup === 'individual_group'),
    [safeStudents]
  );
  const collaborative = useMemo(
    () => safeStudents.filter(student => student.experimentalGroup === 'collaborative_group'),
    [safeStudents]
  );

  const values = (group: UserProfile[], selector: (student: UserProfile) => unknown) =>
    group.map(selector).filter(validNumber);

  const individualPre = values(individual, student => student.preTestScore);
  const collaborativePre = values(collaborative, student => student.preTestScore);
  const individualPost = values(individual, student => student.postTestScore);
  const collaborativePost = values(collaborative, student => student.postTestScore);

  const individualEngagement = values(individual, student => student.engagementScore?.percentage);
  const collaborativeEngagement = values(collaborative, student => student.engagementScore?.percentage);
  // This is a separate research variable; include only explicitly recorded scores.
  const individualCollaborativeEngagement = values(individual, student => student.engagementScore?.collaborative);
  const collaborativeCollaborativeEngagement = values(collaborative, student => student.engagementScore?.collaborative);

  const individualBehavioral = values(individual, student => student.engagementScore?.behavioral);
  const collaborativeBehavioral = values(collaborative, student => student.engagementScore?.behavioral);
  const individualCognitive = values(individual, student => student.engagementScore?.cognitive);
  const collaborativeCognitive = values(collaborative, student => student.engagementScore?.cognitive);
  const individualEmotional = values(individual, student => student.engagementScore?.emotional);
  const collaborativeEmotional = values(collaborative, student => student.engagementScore?.emotional);

  // Keep each student's pre/post scores paired by their own ID.
  const pairedStudents = safeStudents.filter(student =>
    validNumber(student.preTestScore) && validNumber(student.postTestScore)
  );
  const pairedAll = calculatePairedTTest(
    pairedStudents.map(student => student.preTestScore as number),
    pairedStudents.map(student => student.postTestScore as number)
  );
  const pairedIndividualStudents = individual.filter(student =>
    validNumber(student.preTestScore) && validNumber(student.postTestScore)
  );
  const pairedCollaborativeStudents = collaborative.filter(student =>
    validNumber(student.preTestScore) && validNumber(student.postTestScore)
  );
  const pairedIndividual = calculatePairedTTest(
    pairedIndividualStudents.map(student => student.preTestScore as number),
    pairedIndividualStudents.map(student => student.postTestScore as number)
  );
  const pairedCollaborative = calculatePairedTTest(
    pairedCollaborativeStudents.map(student => student.preTestScore as number),
    pairedCollaborativeStudents.map(student => student.postTestScore as number)
  );

  const independentTests = [
    { label: 'الاختبار البعدي للتحصيل المعرفي', result: calculateIndependentTTest(individualPost, collaborativePost), n1: individualPost.length, n2: collaborativePost.length },
    { label: 'الانخراط الكلي', result: calculateIndependentTTest(individualEngagement, collaborativeEngagement), n1: individualEngagement.length, n2: collaborativeEngagement.length },
    { label: 'الانخراط التشاركي', result: calculateIndependentTTest(individualCollaborativeEngagement, collaborativeCollaborativeEngagement), n1: individualCollaborativeEngagement.length, n2: collaborativeCollaborativeEngagement.length },
    { label: 'الانخراط السلوكي', result: calculateIndependentTTest(individualBehavioral, collaborativeBehavioral), n1: individualBehavioral.length, n2: collaborativeBehavioral.length },
    { label: 'الانخراط المعرفي', result: calculateIndependentTTest(individualCognitive, collaborativeCognitive), n1: individualCognitive.length, n2: collaborativeCognitive.length },
    { label: 'الانخراط الوجداني', result: calculateIndependentTTest(individualEmotional, collaborativeEmotional), n1: individualEmotional.length, n2: collaborativeEmotional.length }
  ];

  const descriptiveRows = [
    { label: 'الاختبار القبلي للتحصيل المعرفي', ind: describe(individualPre), col: describe(collaborativePre) },
    { label: 'الاختبار البعدي للتحصيل المعرفي', ind: describe(individualPost), col: describe(collaborativePost) },
    { label: 'الانخراط الكلي', ind: describe(individualEngagement), col: describe(collaborativeEngagement) },
    { label: 'الانخراط التشاركي', ind: describe(individualCollaborativeEngagement), col: describe(collaborativeCollaborativeEngagement) },
    { label: 'الانخراط السلوكي', ind: describe(individualBehavioral), col: describe(collaborativeBehavioral) },
    { label: 'الانخراط المعرفي', ind: describe(individualCognitive), col: describe(collaborativeCognitive) },
    { label: 'الانخراط الوجداني', ind: describe(individualEmotional), col: describe(collaborativeEmotional) }
  ];

  const completedPre = safeStudents.filter(student => validNumber(student.preTestScore)).length;
  const completedPost = safeStudents.filter(student => validNumber(student.postTestScore)).length;
  const completedEngagement = safeStudents.filter(student => validNumber(student.engagementScore?.percentage)).length;
  const evaluatedSubmissions = safeSubmissions.filter(submission =>
    submission.status === 'evaluated' && validNumber(submission.totalScore)
  ).length;

  const handleExportSPSS = () => {
    const csvData = generateSPSSCSV(safeStudents, safeSubmissions);
    const dateStr = new Date().toISOString().split('T')[0];
    downloadCSV(`EduCode_Research_Data_${dateStr}.csv`, csvData);
  };

  const StatCell: React.FC<{ stats: NumericResult }> = ({ stats }) => (
    <>
      <td className="p-3 text-center">{stats.n || '—'}</td>
      <td className="p-3 text-center font-bold">{stats.n ? formatNumber(stats.mean) : '—'}</td>
      <td className="p-3 text-center">{stats.n ? formatNumber(stats.sd) : '—'}</td>
      <td className="p-3 text-center">{stats.n ? formatNumber(stats.median) : '—'}</td>
    </>
  );

  return (
    <section className="space-y-5" dir="rtl">
      <div className="rounded-3xl bg-[#06383A] text-white p-5 sm:p-6 border border-[#39878A] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#BDE7E1] text-xs font-bold mb-2">
            <BarChart3 className="w-4 h-4" /> التحليل الإحصائي لبحث تعليم البرمجة
          </div>
          <h2 className="text-xl sm:text-2xl font-black">مقارنة التعلم الفردي والتشاركي</h2>
          <p className="text-xs text-[#D7ECEA] mt-1">تعرض هذه الصفحة القيم المسجلة فعلياً فقط، وتترك القياسات غير المنفذة فارغة.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleExportSPSS} className="px-4 py-2.5 rounded-xl bg-[#83C5BE] text-[#06383A] font-bold text-xs flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4" /> تصدير CSV للتحليل
          </button>
          <button onClick={() => setShowPrintModal(true)} className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-xs flex items-center gap-2">
            <Printer className="w-4 h-4" /> معاينة التقرير
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: 'إجمالي الطلاب', value: safeStudents.length, icon: Users },
          { label: 'اختبار قبلي مكتمل', value: `${completedPre}/${safeStudents.length}`, icon: Activity },
          { label: 'اختبار بعدي مكتمل', value: `${completedPost}/${safeStudents.length}`, icon: Activity },
          { label: 'مقياس انخراط مكتمل', value: `${completedEngagement}/${safeStudents.length}`, icon: Activity },
          { label: 'مشروعات تم تقييمها', value: evaluatedSubmissions, icon: BarChart3 }
        ].map(item => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="bg-white rounded-2xl border border-[#D7E8E8] p-4">
              <Icon className="w-4 h-4 text-[#087E83] mb-2" />
              <div className="text-xl font-black text-[#064B50]">{item.value}</div>
              <div className="text-[11px] text-slate-500 mt-1">{item.label}</div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-[#D7E8E8] p-4 sm:p-5 space-y-3">
        <h3 className="font-black text-[#064B50]">الإحصاءات الوصفية حسب المجموعة</h3>
        <p className="text-[11px] text-slate-500">N = عدد الحالات التي تحتوي على قيمة فعلية للمتغير. لا يتم تعويض البيانات المفقودة بمتوسطات أو قيم افتراضية.</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-xs text-right">
            <thead className="bg-[#06383A] text-white">
              <tr>
                <th className="p-3">المتغير</th>
                <th className="p-3" colSpan={4}>المجموعة الفردية</th>
                <th className="p-3" colSpan={4}>المجموعة التشاركية</th>
              </tr>
              <tr className="bg-[#0A555A] text-[#D7ECEA]">
                <th className="p-2"> </th>
                {['N','M','SD','Median','N','M','SD','Median'].map((label, index) => <th key={index} className="p-2 text-center">{label}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {descriptiveRows.map(row => (
                <tr key={row.label}>
                  <td className="p-3 font-bold">{row.label}</td>
                  <StatCell stats={row.ind} />
                  <StatCell stats={row.col} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#D7E8E8] p-4 sm:p-5 space-y-3">
        <h3 className="font-black text-[#064B50]">اختبارات الفروق بين المجموعتين</h3>
        <p className="text-[11px] text-slate-500">يعرض القرار الإحصائي فقط عندما يتوفر حجم عينة صالح (حالتان على الأقل في كل مجموعة). الاختبار الحالي يستخدم دالة p-value التقريبية الموجودة في المشروع، لذلك يجب التحقق النهائي ببرنامج إحصائي متخصص قبل اعتماد النتائج في الرسالة.</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-xs text-right">
            <thead className="bg-[#06383A] text-white">
              <tr>
                <th className="p-3">المتغير</th>
                <th className="p-3 text-center">N الفردي</th>
                <th className="p-3 text-center">N التشاركي</th>
                <th className="p-3 text-center">M الفردي</th>
                <th className="p-3 text-center">M التشاركي</th>
                <th className="p-3 text-center">t</th>
                <th className="p-3 text-center">df</th>
                <th className="p-3 text-center">p</th>
                <th className="p-3">القرار</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {independentTests.map(row => (
                <tr key={row.label}>
                  <td className="p-3 font-bold">{row.label}</td>
                  <td className="p-3 text-center">{row.n1 || '—'}</td>
                  <td className="p-3 text-center">{row.n2 || '—'}</td>
                  <td className="p-3 text-center">{row.result.df ? formatNumber(row.result.mean1) : '—'}</td>
                  <td className="p-3 text-center">{row.result.df ? formatNumber(row.result.mean2) : '—'}</td>
                  <td className="p-3 text-center">{row.result.df ? formatNumber(row.result.tValue) : '—'}</td>
                  <td className="p-3 text-center">{row.result.df || '—'}</td>
                  <td className="p-3 text-center">{row.result.df ? formatP(row.result.pValue) : '—'}</td>
                  <td className="p-3">{testDecision(row.result)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#D7E8E8] p-4 sm:p-5 space-y-3">
        <h3 className="font-black text-[#064B50]">مقارنة القياس القبلي والبعدي داخل كل مجموعة</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { label: 'كل الطلاب ذوي القياسين', result: pairedAll, n: pairedStudents.length },
            { label: 'المجموعة الفردية', result: pairedIndividual, n: pairedIndividualStudents.length },
            { label: 'المجموعة التشاركية', result: pairedCollaborative, n: pairedCollaborativeStudents.length }
          ].map(item => (
            <div key={item.label} className="rounded-xl bg-[#F4FAFA] border border-[#D7E8E8] p-4">
              <div className="font-bold text-[#064B50] text-sm">{item.label}</div>
              <div className="text-[11px] text-slate-500 mt-1">الحالات المزدوجة: {item.n}</div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div><span className="text-slate-500 block">قيمة t</span><b>{item.n >= 2 ? formatNumber(item.result.tValue) : '—'}</b></div>
                <div><span className="text-slate-500 block">p</span><b>{item.n >= 2 ? formatP(item.result.pValue) : '—'}</b></div>
                <div><span className="text-slate-500 block">فرق المتوسط</span><b>{item.n >= 2 ? formatNumber(item.result.meanDiff) : '—'}</b></div>
                <div><span className="text-slate-500 block">حجم الأثر d</span><b>{item.n >= 2 ? formatNumber(item.result.effectSizeD) : '—'}</b></div>
              </div>
              <div className="text-[11px] font-bold text-[#087E83] mt-3">{item.n >= 2 ? testDecision(item.result) : 'لا تتوفر بيانات مزدوجة كافية'}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900 leading-relaxed">
        <strong>تنبيه منهجي:</strong> هذه لوحة متابعة وتحليل أولي للبيانات المسجلة. لا تعني الدلالة الإحصائية وحدها ثبوت السببية أو قبول/رفض فروض البحث نهائياً. يجب مراجعة تصميم الدراسة، افتراضات الاختبارات، القيم المتطرفة، والبيانات المفقودة قبل اعتماد النتائج.
      </div>

      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4">
            <h3 className="font-black text-[#064B50]">معاينة التقرير البحثي</h3>
            <p className="text-sm text-slate-600">سيتم طباعة المؤشرات والجداول المعروضة حالياً، باستخدام البيانات المسجلة فقط.</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-slate-50 rounded-lg p-3">إجمالي الطلاب: <b>{safeStudents.length}</b></div>
              <div className="bg-slate-50 rounded-lg p-3">القياسات القبلية: <b>{completedPre}</b></div>
              <div className="bg-slate-50 rounded-lg p-3">القياسات البعدية: <b>{completedPost}</b></div>
              <div className="bg-slate-50 rounded-lg p-3">مقاييس الانخراط: <b>{completedEngagement}</b></div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowPrintModal(false)} className="px-4 py-2 rounded-lg border text-slate-600 text-sm">إغلاق</button>
              <button onClick={() => window.print()} className="px-4 py-2 rounded-lg bg-[#087E83] text-white text-sm flex items-center gap-2"><Printer className="w-4 h-4" /> طباعة</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
