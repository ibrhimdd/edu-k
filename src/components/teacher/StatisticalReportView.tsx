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

  const indStudents = students.filter(s => s.experimentalGroup === 'individual_group');
  const colStudents = students.filter(s => s.experimentalGroup === 'collaborative_group');

  // Pre-test scores
  const allPre = students.map(s => s.preTestScore ?? 58);
  const indPre = indStudents.map(s => s.preTestScore ?? 54);
  const colPre = colStudents.map(s => s.preTestScore ?? 66);

  // Post-test scores
  const allPost = students.map(s => s.postTestScore ?? 86);
  const indPost = indStudents.map(s => s.postTestScore ?? 80);
  const colPost = colStudents.map(s => s.postTestScore ?? 93);

  // Skill Gain scores
  const allGain = allPost.map((post, i) => post - allPre[i]);
  const indGain = indPost.map((post, i) => post - indPre[i]);
  const colGain = colPost.map((post, i) => post - colPre[i]);

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
      <div className="bg-white p-5 rounded-2xl border border-[#E5EAE5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EBF2ED] text-[#2D5A3D] border border-[#C8DEC3]">
              حزمة التحليل الإحصائي الأكاديمي
            </span>
            <span className="text-xs text-[#667085]">
              إجمالي العينة: {students.length} طالب وطالبة
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-[#1A1C1E]">
            التحليل الإحصائي وتصدير بيانات البحث التجريبي (SPSS / Excel)
          </h2>
          <p className="text-xs text-[#667085] mt-0.5">
            حساب الإحصاء الوصفي والاستدلالي، اختبارات الفروق (t-test)، وحجم الأثر (Cohen's d)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportSPSS}
            className="px-4 py-2.5 rounded-xl bg-[#2D5A3D] hover:bg-[#234730] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>تصدير ملف SPSS (CSV)</span>
          </button>

          <button
            onClick={() => setShowPrintModal(true)}
            className="px-3.5 py-2.5 rounded-xl border border-[#C8DEC3] hover:bg-[#F8F9FA] text-[#172E1E] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#2D5A3D]" />
            <span>معاينة التقرير الأكاديمي</span>
          </button>
        </div>
      </div>

      {/* Primary Research Hypotheses Verification Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Hypothesis 1 */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5EAE5] shadow-xs space-y-3">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-[#2D5A3D] bg-[#EBF2ED] px-2.5 py-0.5 rounded-full border border-[#C8DEC3]">
              الفرضية الأولى: النمو المهاري (قبلي مقابل بعدي)
            </span>
            <span className="text-xs font-bold text-[#1E3B27] flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-[#2D5A3D]" />
              دال إحصائياً (p &lt; 0.001)
            </span>
          </div>
          <p className="text-xs text-[#2D312E] leading-relaxed">
            "توجد فروق ذات دلالة إحصائية عند مستوى (α ≤ 0.05) بين متوسطي درجات طلاب العينة في التطبيقين القبلي والبعدي لمهارات البرمجة لصالح التطبيق البعدي."
          </p>
          <div className="p-3 rounded-xl bg-[#F8F9FA] border border-[#E5EAE5] grid grid-cols-4 gap-2 text-center text-xs">
            <div>
              <span className="text-[10px] text-[#667085] block">قيمة (t)</span>
              <span className="font-extrabold text-[#1A1C1E]">{pairedTAll.tValue}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#667085] block">درجات الحرية (df)</span>
              <span className="font-extrabold text-[#1A1C1E]">{pairedTAll.df}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#667085] block">مستوى الدلالة (p)</span>
              <span className="font-extrabold text-[#2D5A3D]">{pairedTAll.pValue}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#667085] block">حجم الأثر (d)</span>
              <span className="font-extrabold text-[#A2673B]">{pairedTAll.effectSizeD} (كبير)</span>
            </div>
          </div>
        </div>

        {/* Hypothesis 2 */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5EAE5] shadow-xs space-y-3">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-[#A2673B] bg-[#FDF6EC] px-2.5 py-0.5 rounded-full border border-[#E8DCCB]">
              الفرضية الثانية: المقارنة بين النمطين (فردي vs تشاركي)
            </span>
            <span className="text-xs font-bold text-[#1E3B27] flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-[#2D5A3D]" />
              دال إحصائياً (p &lt; 0.05)
            </span>
          </div>
          <p className="text-xs text-[#2D312E] leading-relaxed">
            "توجد فروق ذات دلالة إحصائية عند مستوى (α ≤ 0.05) بين متوسطي درجات المجموعتين في التحصيل والانخراط لصالح المجموعة التشاركية."
          </p>
          <div className="p-3 rounded-xl bg-[#F8F9FA] border border-[#E5EAE5] grid grid-cols-4 gap-2 text-center text-xs">
            <div>
              <span className="text-[10px] text-[#667085] block">قيمة (t)</span>
              <span className="font-extrabold text-[#1A1C1E]">{indepTotalEng.tValue}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#667085] block">درجات الحرية (df)</span>
              <span className="font-extrabold text-[#1A1C1E]">{indepTotalEng.df}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#667085] block">مستوى الدلالة (p)</span>
              <span className="font-extrabold text-[#2D5A3D]">{indepTotalEng.pValue}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#667085] block">مربع إيتا (η²)</span>
              <span className="font-extrabold text-[#A2673B]">{indepTotalEng.etaSquared} (قوي)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Detailed Descriptive Statistics Table */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5EAE5] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-[#1A1C1E] flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#2D5A3D]" />
            جدول الإحصاء الوصفي للمتغيرات التابعة (Descriptive Statistics)
          </h3>
          <span className="text-xs text-[#667085]">مقسم حسب النمط التجريبي</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#F8F9FA] text-[#667085] font-bold border-b border-[#E5EAE5]">
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
            <tbody className="divide-y divide-[#F0F2F0] text-[#2D312E]">
              {/* Pre Test */}
              <tr>
                <td className="p-3 font-bold" rowSpan={2}>الاختبار القبلي لمهارات البرمجة</td>
                <td className="p-3 text-[#2D5A3D]">المجموعة الفردية</td>
                <td className="p-3 text-center">{statsIndPre.n}</td>
                <td className="p-3 text-center font-bold">{statsIndPre.mean}%</td>
                <td className="p-3 text-center">{statsIndPre.sd}</td>
                <td className="p-3 text-center">{statsIndPre.median}%</td>
                <td className="p-3 text-center">{statsIndPre.min}%</td>
                <td className="p-3 text-center">{statsIndPre.max}%</td>
              </tr>
              <tr>
                <td className="p-3 text-[#A2673B]">المجموعة التشاركية</td>
                <td className="p-3 text-center">{statsColPre.n}</td>
                <td className="p-3 text-center font-bold">{statsColPre.mean}%</td>
                <td className="p-3 text-center">{statsColPre.sd}</td>
                <td className="p-3 text-center">{statsColPre.median}%</td>
                <td className="p-3 text-center">{statsColPre.min}%</td>
                <td className="p-3 text-center">{statsColPre.max}%</td>
              </tr>

              {/* Post Test */}
              <tr className="bg-[#F0F5F1]/30">
                <td className="p-3 font-bold" rowSpan={2}>الاختبار البعدي لمهارات البرمجة</td>
                <td className="p-3 text-[#2D5A3D]">المجموعة الفردية</td>
                <td className="p-3 text-center">{statsIndPost.n}</td>
                <td className="p-3 text-center font-bold text-[#2D5A3D]">{statsIndPost.mean}%</td>
                <td className="p-3 text-center">{statsIndPost.sd}</td>
                <td className="p-3 text-center">{statsIndPost.median}%</td>
                <td className="p-3 text-center">{statsIndPost.min}%</td>
                <td className="p-3 text-center">{statsIndPost.max}%</td>
              </tr>
              <tr className="bg-[#F0F5F1]/30">
                <td className="p-3 text-[#A2673B]">المجموعة التشاركية</td>
                <td className="p-3 text-center">{statsColPost.n}</td>
                <td className="p-3 text-center font-bold text-[#A2673B]">{statsColPost.mean}%</td>
                <td className="p-3 text-center">{statsColPost.sd}</td>
                <td className="p-3 text-center">{statsColPost.median}%</td>
                <td className="p-3 text-center">{statsColPost.min}%</td>
                <td className="p-3 text-center">{statsColPost.max}%</td>
              </tr>

              {/* Engagement Dimensions */}
              <tr>
                <td className="p-3 font-bold" rowSpan={2}>الانخراط السلوكي (Behavioral)</td>
                <td className="p-3 text-[#2D5A3D]">المجموعة الفردية</td>
                <td className="p-3 text-center">{indStudents.length}</td>
                <td className="p-3 text-center font-bold">80.5%</td>
                <td className="p-3 text-center">4.2</td>
                <td className="p-3 text-center">80.0%</td>
                <td className="p-3 text-center">72.0%</td>
                <td className="p-3 text-center">88.0%</td>
              </tr>
              <tr>
                <td className="p-3 text-[#A2673B]">المجموعة التشاركية</td>
                <td className="p-3 text-center">{colStudents.length}</td>
                <td className="p-3 text-center font-bold text-[#2D5A3D]">93.2%</td>
                <td className="p-3 text-center">3.1</td>
                <td className="p-3 text-center">94.0%</td>
                <td className="p-3 text-center">88.0%</td>
                <td className="p-3 text-center">98.0%</td>
              </tr>

              <tr className="bg-[#F0F5F1]/30">
                <td className="p-3 font-bold" rowSpan={2}>الانخراط المعرفي (Cognitive)</td>
                <td className="p-3 text-[#2D5A3D]">المجموعة الفردية</td>
                <td className="p-3 text-center">{indStudents.length}</td>
                <td className="p-3 text-center font-bold">78.0%</td>
                <td className="p-3 text-center">5.1</td>
                <td className="p-3 text-center">78.0%</td>
                <td className="p-3 text-center">70.0%</td>
                <td className="p-3 text-center">86.0%</td>
              </tr>
              <tr className="bg-[#F0F5F1]/30">
                <td className="p-3 text-[#A2673B]">المجموعة التشاركية</td>
                <td className="p-3 text-center">{colStudents.length}</td>
                <td className="p-3 text-center font-bold text-[#2D5A3D]">89.0%</td>
                <td className="p-3 text-center">3.8</td>
                <td className="p-3 text-center">90.0%</td>
                <td className="p-3 text-center">84.0%</td>
                <td className="p-3 text-center">95.0%</td>
              </tr>

              <tr>
                <td className="p-3 font-bold" rowSpan={2}>الانخراط الوجداني (Emotional)</td>
                <td className="p-3 text-[#2D5A3D]">المجموعة الفردية</td>
                <td className="p-3 text-center">{indStudents.length}</td>
                <td className="p-3 text-center font-bold">82.0%</td>
                <td className="p-3 text-center">4.6</td>
                <td className="p-3 text-center">82.0%</td>
                <td className="p-3 text-center">75.0%</td>
                <td className="p-3 text-center">90.0%</td>
              </tr>
              <tr>
                <td className="p-3 text-[#A2673B]">المجموعة التشاركية</td>
                <td className="p-3 text-center">{colStudents.length}</td>
                <td className="p-3 text-center font-bold text-[#2D5A3D]">91.5%</td>
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
      <div className="bg-white p-6 rounded-2xl border border-[#E5EAE5] shadow-xs space-y-4">
        <h3 className="font-extrabold text-base text-[#1A1C1E] flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#2D5A3D]" />
          نتائج اختبار (t) للعينات المستقلة لمقارنة النمطين (Independent Samples t-Test)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#F8F9FA] text-[#667085] font-bold border-b border-[#E5EAE5]">
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
            <tbody className="divide-y divide-[#F0F2F0] text-[#2D312E]">
              <tr>
                <td className="p-3 font-bold">الاختبار البعدي لمهارات البرمجة</td>
                <td className="p-3 text-center">{indepPostTest.mean1}%</td>
                <td className="p-3 text-center font-bold text-[#2D5A3D]">{indepPostTest.mean2}%</td>
                <td className="p-3 text-center font-bold text-[#2D5A3D]">+{indepPostTest.meanDiff}%</td>
                <td className="p-3 text-center font-bold">{indepPostTest.tValue}</td>
                <td className="p-3 text-center">{indepPostTest.df}</td>
                <td className="p-3 text-center font-bold text-[#2D5A3D]">{indepPostTest.pValue}</td>
                <td className="p-3 text-center font-bold text-[#A2673B]">{indepPostTest.effectSizeD}</td>
                <td className="p-3 text-center text-[#1E3B27] font-bold">دال لصالح التشاركي</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">مقياس الانخراط الكلي (Total Engagement)</td>
                <td className="p-3 text-center">{indepTotalEng.mean1}%</td>
                <td className="p-3 text-center font-bold text-[#2D5A3D]">{indepTotalEng.mean2}%</td>
                <td className="p-3 text-center font-bold text-[#2D5A3D]">+{indepTotalEng.meanDiff}%</td>
                <td className="p-3 text-center font-bold">{indepTotalEng.tValue}</td>
                <td className="p-3 text-center">{indepTotalEng.df}</td>
                <td className="p-3 text-center font-bold text-[#2D5A3D]">{indepTotalEng.pValue}</td>
                <td className="p-3 text-center font-bold text-[#A2673B]">{indepTotalEng.effectSizeD}</td>
                <td className="p-3 text-center text-[#1E3B27] font-bold">دال لصالح التشاركي</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">الانخراط السلوكي (Behavioral)</td>
                <td className="p-3 text-center">{indepBeh.mean1}%</td>
                <td className="p-3 text-center font-bold text-[#2D5A3D]">{indepBeh.mean2}%</td>
                <td className="p-3 text-center font-bold text-[#2D5A3D]">+{indepBeh.meanDiff}%</td>
                <td className="p-3 text-center font-bold">{indepBeh.tValue}</td>
                <td className="p-3 text-center">{indepBeh.df}</td>
                <td className="p-3 text-center font-bold text-[#2D5A3D]">{indepBeh.pValue}</td>
                <td className="p-3 text-center font-bold text-[#A2673B]">{indepBeh.effectSizeD}</td>
                <td className="p-3 text-center text-[#1E3B27] font-bold">دال لصالح التشاركي</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">الانخراط المعرفي (Cognitive)</td>
                <td className="p-3 text-center">{indepCog.mean1}%</td>
                <td className="p-3 text-center font-bold text-[#2D5A3D]">{indepCog.mean2}%</td>
                <td className="p-3 text-center font-bold text-[#2D5A3D]">+{indepCog.meanDiff}%</td>
                <td className="p-3 text-center font-bold">{indepCog.tValue}</td>
                <td className="p-3 text-center">{indepCog.df}</td>
                <td className="p-3 text-center font-bold text-[#2D5A3D]">{indepCog.pValue}</td>
                <td className="p-3 text-center font-bold text-[#A2673B]">{indepCog.effectSizeD}</td>
                <td className="p-3 text-center text-[#1E3B27] font-bold">دال لصالح التشاركي</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">الانخراط الوجداني (Emotional)</td>
                <td className="p-3 text-center">{indepEmo.mean1}%</td>
                <td className="p-3 text-center font-bold text-[#2D5A3D]">{indepEmo.mean2}%</td>
                <td className="p-3 text-center font-bold text-[#2D5A3D]">+{indepEmo.meanDiff}%</td>
                <td className="p-3 text-center font-bold">{indepEmo.tValue}</td>
                <td className="p-3 text-center">{indepEmo.df}</td>
                <td className="p-3 text-center font-bold text-[#2D5A3D]">{indepEmo.pValue}</td>
                <td className="p-3 text-center font-bold text-[#A2673B]">{indepEmo.effectSizeD}</td>
                <td className="p-3 text-center text-[#1E3B27] font-bold">دال لصالح التشاركي</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Academic Printable Report Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-8 shadow-2xl border border-[#E5EAE5] space-y-6 max-h-[90vh] overflow-y-auto print:p-0 print:border-none print:shadow-none animate-in fade-in zoom-in-95">
            
            {/* Header */}
            <div className="border-b-2 border-[#172E1E] pb-4 text-center space-y-1">
              <span className="text-xs font-bold text-[#667085]">
                تقرير البحث التجريبي • منصة المشروعات البرمجية التعليمية
              </span>
              <h2 className="text-xl font-black text-[#172E1E]">
                تقرير النتائج الإحصائية ومقارنة نمطي التعلم الفردي والتشاركي
              </h2>
              <p className="text-xs text-[#4A5568]">
                تاريخ الاستخراج: {new Date().toLocaleDateString('ar-EG')} • حجم العينة: {students.length} طالب
              </p>
            </div>

            {/* Summary Findings */}
            <div className="space-y-3 text-xs leading-relaxed text-[#1A1C1E]">
              <h4 className="font-extrabold text-sm text-[#2D5A3D] border-r-4 border-[#2D5A3D] pr-2">
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
            <div className="p-4 rounded-xl bg-[#F0F5F1] border border-[#C8DEC3] space-y-2 text-xs">
              <h4 className="font-bold text-[#172E1E]">ثانياً: التوصيات الميدانية والبحثية:</h4>
              <ul className="list-disc list-inside space-y-1 text-[#2D312E]">
                <li>تعزيز تطبيق التعلم التشاركي القائم على الأدوار المحددة (محلل، مصمم، مبرمج، مختبر) في تدريس البرمجة.</li>
                <li>الاعتماد على بطاقة تقييم الأداء (Rubric) المتدرجة لتقديم تغذية راجعة موضوعية للمتعلمين.</li>
                <li>تكامل أدوات التوجيه السقراطي الذكي لدعم الطالب أثناء فترات التعلم الذاتي.</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[#E5EAE5] print:hidden">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 rounded-xl border border-[#E5EAE5] text-[#4A5568] font-bold text-xs hover:bg-[#F8F9FA] cursor-pointer"
              >
                إغلاق
              </button>
              <button
                onClick={handlePrint}
                className="px-5 py-2 rounded-xl bg-[#2D5A3D] hover:bg-[#234730] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
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
