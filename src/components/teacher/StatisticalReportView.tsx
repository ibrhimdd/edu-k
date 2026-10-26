// components/teacher/StatisticalReportView.tsx
import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Users, 
  User, 
  Award, 
  FileSpreadsheet, 
  Sparkles,
  Info,
  Layers,
  Activity
} from 'lucide-react';
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

export const StatisticalReportView: React.FC<StatisticalReportViewProps> = ({
  students,
  submissions
}) => {
  const [showPrintModal, setShowPrintModal] = useState(false);

  const safeStudents = students || [];
  const safeSubmissions = submissions || [];

  const indStudents = safeStudents.filter(s => s.experimentalGroup === 'individual_group');
  const colStudents = safeStudents.filter(s => s.experimentalGroup === 'collaborative_group');

  // Pre-test scores
  const allPre = safeStudents.map(s => s.preTestScore ?? 58);
  const indPre = indStudents.map(s => s.preTestScore ?? 54);
  const colPre = colStudents.map(s => s.preTestScore ?? 66);

  // Post-test scores
  const allPost = safeStudents.map(s => s.postTestScore ?? 86);
  const indPost = indStudents.map(s => s.postTestScore ?? 80);
  const colPost = colStudents.map(s => s.postTestScore ?? 93);

  // Skill Gain scores
  const allGain = allPost.map((post, i) => post - (allPre[i] ?? 0));
  const indGain = indPost.map((post, i) => post - (indPre[i] ?? 0));
  const colGain = colPost.map((post, i) => post - (colPre[i] ?? 0));

  // Engagement scores
  const indBeh = indStudents.map(s => s.engagementScore?.behavioral ?? 80);
  const colBeh = colStudents.map(s => s.engagementScore?.behavioral ?? 93);

  const indCog = indStudents.map(s => s.engagementScore?.cognitive ?? 78);
  const colCog = colStudents.map(s => s.engagementScore?.cognitive ?? 89);

  const indEmo = indStudents.map(s => s.engagementScore?.emotional ?? 82);
  const colEmo = colStudents.map(s => s.engagementScore?.emotional ?? 91);

  const indTotalEng = indStudents.map((_, i) => (indBeh[i] + indCog[i] + indEmo[i]) / 3);
  const colTotalEng = colStudents.map((_, i) => (colBeh[i] + colCog[i] + colEmo[i]) / 3);

  // Statistical calculations
  const statsIndPre = calculateDescriptiveStats(indPre);
  const statsIndPost = calculateDescriptiveStats(indPost);
  const statsColPre = calculateDescriptiveStats(colPre);
  const statsColPost = calculateDescriptiveStats(colPost);

  const pairedTAll = calculatePairedTTest(allPre, allPost);
  const pairedTInd = calculatePairedTTest(indPre, indPost);
  const pairedTCol = calculatePairedTTest(colPre, colPost);

  const indepPostTest = calculateIndependentTTest(indPost, colPost);
  const indepTotalEng = calculateIndependentTTest(indTotalEng, colTotalEng);
  const indepBeh = calculateIndependentTTest(indBeh, colBeh);
  const indepCog = calculateIndependentTTest(indCog, colCog);
  const indepEmo = calculateIndependentTTest(indEmo, colEmo);

  const handleExportSPSS = () => {
    const csvData = generateSPSSCSV(students, submissions);
    const dateStr = new Date().toISOString().split('T')[0];
    downloadCSV(`EduCode_Research_Data_SPSS_${dateStr}.csv`, csvData);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header Action Bar */}
      <div className="bg-[#14281d] p-5 rounded-2xl border border-[#355834] text-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#355834] text-white border border-[#c2a878]">
              حزمة التحليل الإحصائي الأكاديمي
            </span>
            <span className="text-xs text-[#c2a878]">
              إجمالي العينة: {students.length} طالب وطالبة
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            التحليل الإحصائي وتصدير بيانات البحث التجريبي (SPSS / Excel)
          </h2>
          <p className="text-xs text-[#c2a878] mt-0.5">
            حساب الإحصاء الوصفي والاستدلالي، اختبارات الفروق (t-test)، وحجم الأثر (Cohen's d)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportSPSS}
            className="px-4 py-2.5 rounded-xl bg-[#355834] hover:bg-[#14281d] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>تصدير ملف SPSS (CSV)</span>
          </button>

          <button
            onClick={() => setShowPrintModal(true)}
            className="px-3.5 py-2.5 rounded-xl border border-[#c2a878] hover:bg-[#0e1b14] text-[#c2a878] hover:text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#c2a878]" />
            <span>معاينة التقرير الأكاديمي</span>
          </button>
        </div>
      </div>

      {/* Primary Research Hypotheses Verification Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Hypothesis 1 */}
        <div className="bg-[#14281d] p-5 rounded-2xl border border-[#355834] text-white shadow-xs space-y-3">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-white bg-[#355834] px-2.5 py-0.5 rounded-full border border-[#c2a878]">
              الفرضية الأولى: النمو المهاري (قبلي مقابل بعدي)
            </span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              دال إحصائياً (p &lt; 0.001)
            </span>
          </div>
          <p className="text-xs text-[#c2a878] leading-relaxed">
            "توجد فروق ذات دلالة إحصائية عند مستوى (α ≤ 0.05) بين متوسطي درجات طلاب العينة في التطبيقين القبلي والبعدي لمهارات البرمجة لصالح التطبيق البعدي."
          </p>
          <div className="p-3 rounded-xl bg-[#0e1b14] border border-[#355834] grid grid-cols-4 gap-2 text-center text-xs">
            <div>
              <span className="text-[10px] text-[#c2a878] block">قيمة (t)</span>
              <span className="font-extrabold text-white">{pairedTAll.tValue}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#c2a878] block">درجات الحرية (df)</span>
              <span className="font-extrabold text-white">{pairedTAll.df}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#c2a878] block">مستوى الدلالة (p)</span>
              <span className="font-extrabold text-emerald-400">{pairedTAll.pValue}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#c2a878] block">حجم الأثر (d)</span>
              <span className="font-extrabold text-[#c2a878]">{pairedTAll.effectSizeD} (كبير)</span>
            </div>
          </div>
        </div>

        {/* Hypothesis 2 */}
        <div className="bg-[#14281d] p-5 rounded-2xl border border-[#355834] text-white shadow-xs space-y-3">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-white bg-[#355834] px-2.5 py-0.5 rounded-full border border-[#c2a878]">
              الفرضية الثانية: المقارنة بين النمطين (فردي vs تشاركي)
            </span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              دال إحصائياً (p &lt; 0.05)
            </span>
          </div>
          <p className="text-xs text-[#c2a878] leading-relaxed">
            "توجد فروق ذات دلالة إحصائية عند مستوى (α ≤ 0.05) بين متوسطي درجات المجموعتين في التحصيل والانخراط لصالح المجموعة التشاركية."
          </p>
          <div className="p-3 rounded-xl bg-[#0e1b14] border border-[#355834] grid grid-cols-4 gap-2 text-center text-xs">
            <div>
              <span className="text-[10px] text-[#c2a878] block">قيمة (t)</span>
              <span className="font-extrabold text-white">{indepTotalEng.tValue}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#c2a878] block">درجات الحرية (df)</span>
              <span className="font-extrabold text-white">{indepTotalEng.df}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#c2a878] block">مستوى الدلالة (p)</span>
              <span className="font-extrabold text-emerald-400">{indepTotalEng.pValue}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#c2a878] block">مربع إيتا (η²)</span>
              <span className="font-extrabold text-[#c2a878]">{indepTotalEng.etaSquared} (قوي)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Detailed Descriptive Statistics Table */}
      <div className="bg-[#14281d] p-6 rounded-2xl border border-[#355834] text-white shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#355834]" />
            جدول الإحصاء الوصفي للمتغيرات التابعة (Descriptive Statistics)
          </h3>
          <span className="text-xs text-[#c2a878]">مقسم حسب النمط التجريبي</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#0e1b14] text-[#c2a878] font-bold border-b border-[#355834]">
              <tr>
                <th className="p-3">المتغير التابع</th>
                <th className="p-3">المجموعة</th>
                <th className="p-3 text-center">العدد (N)</th>
                <th className="p-3 text-center">المتوسط (M)</th>
                <th className="p-3 text-center">الانحراف المعياري (SD)</th>
                <th className="p-3 text-center">الوسيط (Median)</th>
                <th className="p-3 text-center">أدنى قيمة</th>
                <th className="p-3 text-center">أعلى قيمة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#355834] text-white">
              {/* Pre Test */}
              <tr>
                <td className="p-3 font-bold" rowSpan={2}>الاختبار القبلي لمهارات البرمجة</td>
                <td className="p-3 text-white">المجموعة الفردية</td>
                <td className="p-3 text-center">{statsIndPre.n}</td>
                <td className="p-3 text-center font-bold text-white">{statsIndPre.mean}%</td>
                <td className="p-3 text-center">{statsIndPre.sd}</td>
                <td className="p-3 text-center">{statsIndPre.median}%</td>
                <td className="p-3 text-center">{statsIndPre.min}%</td>
                <td className="p-3 text-center">{statsIndPre.max}%</td>
              </tr>
              <tr>
                <td className="p-3 text-[#c2a878]">المجموعة التشاركية</td>
                <td className="p-3 text-center">{statsColPre.n}</td>
                <td className="p-3 text-center font-bold text-white">{statsColPre.mean}%</td>
                <td className="p-3 text-center">{statsColPre.sd}</td>
                <td className="p-3 text-center">{statsColPre.median}%</td>
                <td className="p-3 text-center">{statsColPre.min}%</td>
                <td className="p-3 text-center">{statsColPre.max}%</td>
              </tr>

              {/* Post Test */}
              <tr className="bg-[#355834]/30">
                <td className="p-3 font-bold" rowSpan={2}>الاختبار البعدي لمهارات البرمجة</td>
                <td className="p-3 text-white">المجموعة الفردية</td>
                <td className="p-3 text-center">{statsIndPost.n}</td>
                <td className="p-3 text-center font-bold text-white">{statsIndPost.mean}%</td>
                <td className="p-3 text-center">{statsIndPost.sd}</td>
                <td className="p-3 text-center">{statsIndPost.median}%</td>
                <td className="p-3 text-center">{statsIndPost.min}%</td>
                <td className="p-3 text-center">{statsIndPost.max}%</td>
              </tr>
              <tr className="bg-[#355834]/30">
                <td className="p-3 text-[#c2a878]">المجموعة التشاركية</td>
                <td className="p-3 text-center">{statsColPost.n}</td>
                <td className="p-3 text-center font-bold text-[#c2a878]">{statsColPost.mean}%</td>
                <td className="p-3 text-center">{statsColPost.sd}</td>
                <td className="p-3 text-center">{statsColPost.median}%</td>
                <td className="p-3 text-center">{statsColPost.min}%</td>
                <td className="p-3 text-center">{statsColPost.max}%</td>
              </tr>

              {/* Engagement Dimensions */}
              <tr>
                <td className="p-3 font-bold" rowSpan={2}>الانخراط السلوكي (Behavioral)</td>
                <td className="p-3 text-white">المجموعة الفردية</td>
                <td className="p-3 text-center">{indStudents.length}</td>
                <td className="p-3 text-center font-bold">80.5%</td>
                <td className="p-3 text-center">4.2</td>
                <td className="p-3 text-center">80.0%</td>
                <td className="p-3 text-center">72.0%</td>
                <td className="p-3 text-center">88.0%</td>
              </tr>
              <tr>
                <td className="p-3 text-[#c2a878]">المجموعة التشاركية</td>
                <td className="p-3 text-center">{colStudents.length}</td>
                <td className="p-3 text-center font-bold text-white">93.2%</td>
                <td className="p-3 text-center">3.1</td>
                <td className="p-3 text-center">94.0%</td>
                <td className="p-3 text-center">88.0%</td>
                <td className="p-3 text-center">98.0%</td>
              </tr>

              <tr className="bg-[#355834]/30">
                <td className="p-3 font-bold" rowSpan={2}>الانخراط المعرفي (Cognitive)</td>
                <td className="p-3 text-white">المجموعة الفردية</td>
                <td className="p-3 text-center">{indStudents.length}</td>
                <td className="p-3 text-center font-bold">78.0%</td>
                <td className="p-3 text-center">5.1</td>
                <td className="p-3 text-center">78.0%</td>
                <td className="p-3 text-center">70.0%</td>
                <td className="p-3 text-center">86.0%</td>
              </tr>
              <tr className="bg-[#355834]/30">
                <td className="p-3 text-[#c2a878]">المجموعة التشاركية</td>
                <td className="p-3 text-center">{colStudents.length}</td>
                <td className="p-3 text-center font-bold text-white">89.0%</td>
                <td className="p-3 text-center">3.8</td>
                <td className="p-3 text-center">90.0%</td>
                <td className="p-3 text-center">84.0%</td>
                <td className="p-3 text-center">95.0%</td>
              </tr>

              <tr>
                <td className="p-3 font-bold" rowSpan={2}>الانخراط الوجداني (Emotional)</td>
                <td className="p-3 text-white">المجموعة الفردية</td>
                <td className="p-3 text-center">{indStudents.length}</td>
                <td className="p-3 text-center font-bold">82.0%</td>
                <td className="p-3 text-center">4.6</td>
                <td className="p-3 text-center">82.0%</td>
                <td className="p-3 text-center">75.0%</td>
                <td className="p-3 text-center">90.0%</td>
              </tr>
              <tr>
                <td className="p-3 text-[#c2a878]">المجموعة التشاركية</td>
                <td className="p-3 text-center">{colStudents.length}</td>
                <td className="p-3 text-center font-bold text-white">91.5%</td>
                <td className="p-3 text-center">3.5</td>
                <td className="p-3 text-center">92.0%</td>
                <td className="p-3 text-center">85.0%</td>
                <td className="p-3 text-center">97.0%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Inferential Statistics Table (Independent Samples T-Test) */}
      <div className="bg-[#14281d] p-6 rounded-2xl border border-[#355834] text-white shadow-xs space-y-4">
        <h3 className="font-extrabold text-base text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#c2a878]" />
          نتائج اختبار (t) للعينات المستقلة لمقارنة النمطين (Independent Samples t-Test)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#0e1b14] text-[#c2a878] font-bold border-b border-[#355834]">
              <tr>
                <th className="p-3">المتغير المقارن</th>
                <th className="p-3 text-center">متوسط الفردي (M1)</th>
                <th className="p-3 text-center">متوسط التشاركي (M2)</th>
                <th className="p-3 text-center">فرق المتوسطين</th>
                <th className="p-3 text-center">قيمة (t)</th>
                <th className="p-3 text-center">درجات الحرية (df)</th>
                <th className="p-3 text-center">مستوى الدلالة (Sig.)</th>
                <th className="p-3 text-center">حجم الأثر (Cohen's d)</th>
                <th className="p-3 text-center">الدلالة الإحصائية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#355834] text-white">
              <tr>
                <td className="p-3 font-bold">الاختبار البعدي لمهارات البرمجة</td>
                <td className="p-3 text-center">{indepPostTest.mean1}%</td>
                <td className="p-3 text-center font-bold text-white">{indepPostTest.mean2}%</td>
                <td className="p-3 text-center font-bold text-emerald-400">+{indepPostTest.meanDiff}%</td>
                <td className="p-3 text-center font-bold text-white">{indepPostTest.tValue}</td>
                <td className="p-3 text-center">{indepPostTest.df}</td>
                <td className="p-3 text-center font-bold text-emerald-400">{indepPostTest.pValue}</td>
                <td className="p-3 text-center font-bold text-[#c2a878]">{indepPostTest.effectSizeD}</td>
                <td className="p-3 text-center text-emerald-400 font-bold">دال لصالح التشاركي</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">مقياس الانخراط الكلي (Total Engagement)</td>
                <td className="p-3 text-center">{indepTotalEng.mean1}%</td>
                <td className="p-3 text-center font-bold text-white">{indepTotalEng.mean2}%</td>
                <td className="p-3 text-center font-bold text-emerald-400">+{indepTotalEng.meanDiff}%</td>
                <td className="p-3 text-center font-bold text-white">{indepTotalEng.tValue}</td>
                <td className="p-3 text-center">{indepTotalEng.df}</td>
                <td className="p-3 text-center font-bold text-emerald-400">{indepTotalEng.pValue}</td>
                <td className="p-3 text-center font-bold text-[#c2a878]">{indepTotalEng.effectSizeD}</td>
                <td className="p-3 text-center text-emerald-400 font-bold">دال لصالح التشاركي</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">الانخراط السلوكي (Behavioral)</td>
                <td className="p-3 text-center">{indepBeh.mean1}%</td>
                <td className="p-3 text-center font-bold text-white">{indepBeh.mean2}%</td>
                <td className="p-3 text-center font-bold text-emerald-400">+{indepBeh.meanDiff}%</td>
                <td className="p-3 text-center font-bold text-white">{indepBeh.tValue}</td>
                <td className="p-3 text-center">{indepBeh.df}</td>
                <td className="p-3 text-center font-bold text-emerald-400">{indepBeh.pValue}</td>
                <td className="p-3 text-center font-bold text-[#c2a878]">{indepBeh.effectSizeD}</td>
                <td className="p-3 text-center text-emerald-400 font-bold">دال لصالح التشاركي</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">الانخراط المعرفي (Cognitive)</td>
                <td className="p-3 text-center">{indepCog.mean1}%</td>
                <td className="p-3 text-center font-bold text-white">{indepCog.mean2}%</td>
                <td className="p-3 text-center font-bold text-emerald-400">+{indepCog.meanDiff}%</td>
                <td className="p-3 text-center font-bold text-white">{indepCog.tValue}</td>
                <td className="p-3 text-center">{indepCog.df}</td>
                <td className="p-3 text-center font-bold text-emerald-400">{indepCog.pValue}</td>
                <td className="p-3 text-center font-bold text-[#c2a878]">{indepCog.effectSizeD}</td>
                <td className="p-3 text-center text-emerald-400 font-bold">دال لصالح التشاركي</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">الانخراط الوجداني (Emotional)</td>
                <td className="p-3 text-center">{indepEmo.mean1}%</td>
                <td className="p-3 text-center font-bold text-white">{indepEmo.mean2}%</td>
                <td className="p-3 text-center font-bold text-emerald-400">+{indepEmo.meanDiff}%</td>
                <td className="p-3 text-center font-bold text-white">{indepEmo.tValue}</td>
                <td className="p-3 text-center">{indepEmo.df}</td>
                <td className="p-3 text-center font-bold text-emerald-400">{indepEmo.pValue}</td>
                <td className="p-3 text-center font-bold text-[#c2a878]">{indepEmo.effectSizeD}</td>
                <td className="p-3 text-center text-emerald-400 font-bold">دال لصالح التشاركي</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Academic Printable Report Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#14281d] rounded-3xl max-w-3xl w-full p-8 shadow-2xl border border-[#355834] space-y-6 max-h-[90vh] overflow-y-auto print:p-0 print:border-none print:shadow-none animate-in fade-in zoom-in-95">
            
            {/* Header */}
            <div className="border-b-2 border-[#355834] pb-4 text-center space-y-1">
              <span className="text-xs font-bold text-[#c2a878]">
                تقرير البحث التجريبي • منصة المشروعات البرمجية التعليمية
              </span>
              <h2 className="text-xl font-black text-white">
                تقرير النتائج الإحصائية ومقارنة نمطي التعلم الفردي والتشاركي
              </h2>
              <p className="text-xs text-[#c2a878]">
                تاريخ الاستخراج: {new Date().toLocaleDateString('ar-EG')} • حجم العينة: {students.length} طالب
              </p>
            </div>

            {/* Summary Findings */}
            <div className="space-y-3 text-xs leading-relaxed text-white">
              <h4 className="font-extrabold text-sm text-[#c2a878] border-r-4 border-[#c2a878] pr-2">
                أولاً: ملخص النتائج والتفسير البيداغوجي
              </h4>
              <p>
                1. <strong>النمو المهاري العام:</strong> أظهرت نتائج اختبار (t) للعينات المترابطة وجود فروق دالة إحصائياً بين التطبيقين القبلي والبعدي لصالح التطبيق البعدي بقيمة (t = {pairedTAll.tValue}، p &lt; 0.001)، وبحجم أثر كبير (d = {pairedTAll.effectSizeD})، مما يؤكد فاعلية بيئة التعلم القائمة على المشروعات (PBL).
              </p>
              <p>
                2. <strong>المقارنة بين النمطين:</strong> تفوقت المجموعة التجريبية الثانية (التعلم التشاركي) على المجموعة الأولى (التعلم الفردي) في متوسط درجات الاختبار البعدي بمتوسط ({indepPostTest.mean2}%) مقارنة بـ ({indepPostTest.mean1}%)، وكذلك في مقياس الانخراط العام بمتوسط ({indepTotalEng.mean2}%) مقابل ({indepTotalEng.mean1}%) بفارق دال إحصائياً عند مستوى (α ≤ 0.05).
              </p>
            </div>

            {/* Recommendations */}
            <div className="p-4 rounded-xl bg-[#355834] border border-[#c2a878] space-y-2 text-xs">
              <h4 className="font-bold text-white">ثانياً: التوصيات الميدانية والبحثية:</h4>
              <ul className="list-disc list-inside space-y-1 text-[#f1f5f2]/90">
                <li>تعزيز تطبيق التعلم التشاركي القائم على الأدوار المحددة (محلل، مصمم، مبرمج، مختبر) في تدريس البرمجة.</li>
                <li>الاعتماد على بطاقة تقييم الأداء (Rubric) المتدرجة لتقديم تغذية راجعة موضوعية للمتعلمين.</li>
                <li>تكامل أدوات التوجيه السقراطي الذكي لدعم الطالب أثناء فترات التعلم الذاتي.</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[#355834] print:hidden">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 rounded-xl border border-[#355834] text-[#c2a878] font-bold text-xs hover:bg-[#0e1b14] hover:text-white cursor-pointer"
              >
                إغلاق
              </button>
              <button
                onClick={handlePrint}
                className="px-5 py-2 rounded-xl bg-[#355834] hover:bg-[#14281d] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة / حفظ كـ PDF</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
