// components/student/IndividualProjectWorkspace.tsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MonacoCodeEditor } from '../common/MonacoCodeEditor';
import { RubricViewer } from '../common/RubricViewer';
import { AITutorWidget } from '../common/AITutorWidget';
import { 
  FolderGit2, 
  FileText, 
  Code2, 
  Play, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight,
  BookOpen,
  Award,
  AlertCircle,
  HelpCircle,
  Clock,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const IndividualProjectWorkspace: React.FC = () => {
  const { 
    projects, 
    selectedProjectId, 
    setSelectedProjectId, 
    currentUser, 
    getCurrentUserSubmission,
    saveSubmissionDraft,
    submitProjectForReview,
    setActiveTab
  } = useApp();

  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0];
  const submission = getCurrentUserSubmission(currentProject.id);

  const [activeStepIndex, setActiveStepIndex] = useState<number>(1);
  const [code, setCode] = useState<string>(submission?.code || currentProject.starterCode);
  const [analysisText, setAnalysisText] = useState<string>(submission?.problemAnalysisText || '');
  const [designText, setDesignText] = useState<string>(submission?.solutionDesignText || '');
  const [testReportText, setTestReportText] = useState<string>(submission?.testReportText || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const handleSaveDraft = () => {
    saveSubmissionDraft(currentProject.id, code, analysisText, designText, testReportText);
    setSaveToast('تم حفظ المسودة بنجاح.');
    setTimeout(() => setSaveToast(null), 2500);
  };

  const handleSubmit = () => {
    if (!code.trim()) {
      alert('يرجى كتابة الكود البرمجي قبل رفع المشروع.');
      return;
    }

    if (window.confirm('هل أنت متأكد من رغبتك في رفع المشروع للتقييم النهائي؟')) {
      setIsSubmitting(true);
      submitProjectForReview(currentProject.id, code, analysisText, designText, testReportText);
      setIsSubmitting(false);

      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });

      setActiveStepIndex(7); // Jump to Feedback step
    }
  };

  const isEvaluated = submission?.status === 'evaluated';
  const isSubmitted = submission?.status === 'submitted' || isEvaluated;

  const stepsList = [
    { num: 1, title: '1. وصف المشكلة', icon: FileText },
    { num: 2, title: '2. تحليل المشكلة', icon: Layers },
    { num: 3, title: '3. تصميم الحل', icon: Sparkles },
    { num: 4, title: '4. كتابة الكود', icon: Code2 },
    { num: 5, title: '5. اختبار البرنامج', icon: Play },
    { num: 6, title: '6. رفع المشروع', icon: Send },
    { num: 7, title: '7. التغذية الراجعة', icon: Award }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Project Banner & Project Selector */}
      <div className="bg-white p-5 rounded-2xl border border-[#83C5BE] shadow-md text-[#006D77] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#006D77] text-white font-bold border border-[#E29578]/50">
              نمط التعلم الفردي • مشروعي
            </span>
            <span className="text-xs text-[#91472F]">المشروع رقم {currentProject.order} من 4</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#004D54]">
            {currentProject.title}
          </h1>
          <p className="text-xs text-[#91472F] mt-0.5">{currentProject.subtitle}</p>
        </div>

        {/* Project Selector Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {projects.map(p => {
            const isCurr = p.id === currentProject.id;
            const sub = getCurrentUserSubmission(p.id);
            const isDone = sub?.status === 'evaluated';
            return (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedProjectId(p.id);
                  const newSub = getCurrentUserSubmission(p.id);
                  setCode(newSub?.code || p.starterCode);
                  setAnalysisText(newSub?.problemAnalysisText || '');
                  setDesignText(newSub?.solutionDesignText || '');
                  setTestReportText(newSub?.testReportText || '');
                  setActiveStepIndex(1);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isCurr
                    ? 'bg-[#006D77] text-white shadow-sm'
                    : 'bg-[#EDF6F9] text-[#E29578] hover:bg-[#EDF6F9]'
                }`}
              >
                <span>مشروع {p.order}</span>
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-[#006D77]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sequential Steps Navigation Bar (Steps 1 to 7) */}
      <div className="bg-white p-2 rounded-2xl border border-[#83C5BE] shadow-md overflow-x-auto">
        <div className="flex items-center gap-1 min-w-[720px]">
          {stepsList.map(step => {
            const isActive = activeStepIndex === step.num;
            const isPast = activeStepIndex > step.num || (step.num === 6 && isSubmitted);
            const StepIcon = step.icon;
            return (
              <button
                key={step.num}
                onClick={() => setActiveStepIndex(step.num)}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#006D77] text-white shadow-xs'
                    : isPast
                    ? 'bg-[#006D77] text-white hover:bg-[#006D77]'
                    : 'text-[#E29578] hover:text-white hover:bg-[#006D77]/40'
                }`}
              >
                <StepIcon className="w-4 h-4 shrink-0" />
                <span className="truncate">{step.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Content Display */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* Step 1: Problem Description & Objectives */}
        {activeStepIndex === 1 && (
          <div className="bg-white p-6 rounded-2xl border border-[#83C5BE] text-[#006D77] space-y-6 shadow-xs">
            <div>
              <span className="text-xs font-bold text-white bg-[#006D77] px-2.5 py-1 rounded-lg border border-[#E29578]/50">
                الخطوة الأولى
              </span>
              <h2 className="text-lg font-extrabold text-[#004D54] mt-2">1. قراءة وفهم وصف المشكلة البرمجية</h2>
              <p className="text-xs text-[#E29578] mt-1">
                اقرأ المشكلة بعناية وتعرف على الأهداف والمهارات البرمجية المستهدفة قبل البدء في كتابة الكود.
              </p>
            </div>

            {/* Problem Statement Box */}
            <div className="p-5 rounded-xl bg-white text-[#E29578] space-y-2 border border-[#83C5BE]">
              <h3 className="font-bold text-sm text-[#006D77]">نص المشكلة المطلوب حلها:</h3>
              <p className="text-xs leading-relaxed text-[#E29578]">{currentProject.problemStatement}</p>
            </div>

            {/* Objectives & Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#006D77] border border-[#E29578]/50 space-y-2">
                <h3 className="font-bold text-xs text-[#004D54] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#006D77]" />
                  أهداف المشروع:
                </h3>
                <ul className="space-y-1.5 text-xs text-[#006D77]/80 list-disc list-inside">
                  {(currentProject.objectives || []).map((obj, oIdx) => (
                    <li key={oIdx}>{obj}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#EDF6F9] border border-[#83C5BE] space-y-2">
                <h3 className="font-bold text-xs text-[#91472F] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#91472F]" />
                  المهارات البرمجية المستهدفة:
                </h3>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(currentProject.targetSkills || []).map((skill, sIdx) => (
                    <span key={sIdx} className="text-xs px-2.5 py-1 rounded-lg bg-white border border-[#83C5BE] text-[#91472F] font-semibold shadow-2xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="p-4 rounded-xl bg-[#EDF6F9] border border-[#83C5BE] space-y-2">
              <h3 className="font-bold text-xs text-[#004D54]">شروط ومتطلبات الإنجاز:</h3>
              <ul className="space-y-1.5 text-xs text-[#E29578] list-disc list-inside">
                {(currentProject.requirements || []).map((req, rIdx) => (
                  <li key={rIdx}>{req}</li>
                ))}
              </ul>
            </div>

            {/* Step Navigation */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveStepIndex(2)}
                className="px-5 py-2.5 rounded-xl bg-[#006D77] hover:bg-white text-white hover:text-[#004D54] font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>الانتقال للخطوة 2: تحليل المشكلة</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Problem Analysis */}
        {activeStepIndex === 2 && (
          <div className="bg-white p-6 rounded-2xl border border-[#83C5BE] text-[#006D77] space-y-5 shadow-xs">
            <div>
              <span className="text-xs font-bold text-white bg-[#006D77] px-2.5 py-1 rounded-lg border border-[#E29578]/50">
                الخطوة الثانية
              </span>
              <h2 className="text-lg font-extrabold text-[#004D54] mt-2">2. تحليل المشكلة وتحديد المدخلات والمخرجات</h2>
              <p className="text-xs text-[#E29578] mt-1">
                سجل هنا تحليلك الدقيق للمشكلة البرمجية، ما هي البيانات المدخلة المطلوبة وما هي المخرجات المتوقعة؟
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-[#004D54] block mb-2">
                سجل تحليلك للمشكلة (المدخلات، العمليات، والمخرجات):
              </label>
              <textarea
                value={analysisText}
                onChange={(e) => setAnalysisText(e.target.value)}
                placeholder="اكتب هنا: المدخلات هي... والعمليات المطلوبة هي... والمخرجات النهائية هي..."
                rows={7}
                className="w-full p-4 text-xs bg-[#EDF6F9] text-[#006D77] rounded-xl border border-[#83C5BE] focus:outline-hidden focus:ring-2 focus:ring-[#004D54]"
              />
            </div>

            <div className="p-4 rounded-xl bg-[#006D77] border border-[#E29578]/50 text-xs text-white">
              <span className="font-bold block mb-1">💡 معيار تقييم التحليل في الـ Rubric:</span>
              يتم تقييم دقة تحديد المعطيات وحالات الحافة والقيود بدرجة وزنها 15% من التقييم الإجمالي.
            </div>

            <div className="pt-2 flex justify-between">
              <button
                onClick={() => setActiveStepIndex(1)}
                className="px-4 py-2 rounded-xl border border-[#83C5BE] text-[#006D77]/80 font-semibold text-xs hover:bg-[#EDF6F9] cursor-pointer"
              >
                العودة لوصف المشكلة
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveDraft}
                  className="px-4 py-2 rounded-xl bg-[#EDF6F9] hover:bg-[#83C5BE] text-[#004D54] font-bold text-xs cursor-pointer"
                >
                  حفظ المسودة
                </button>
                <button
                  onClick={() => {
                    handleSaveDraft();
                    setActiveStepIndex(3);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#006D77] hover:bg-white text-[#006D77] font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>الانتقال للخطوة 3: تصميم الحل</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Solution Design */}
        {activeStepIndex === 3 && (
          <div className="bg-white p-6 rounded-2xl border border-[#83C5BE] text-[#006D77] space-y-5 shadow-xs">
            <div>
              <span className="text-xs font-bold text-white bg-[#006D77] px-2.5 py-1 rounded-lg border border-[#E29578]/50">
                الخطوة الثالثة
              </span>
              <h2 className="text-lg font-extrabold text-[#004D54] mt-2">3. تصميم الحل والخوارزمية (Algorithm & Flow)</h2>
              <p className="text-xs text-[#E29578] mt-1">
                صمم تسلسل خطوات الحل المنطقية وشبه الكود (Pseudocode) قبل كتابة الكود الفعلي.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-[#004D54] block mb-2">
                خطوات الخوارزمية المنطقية:
              </label>
              <textarea
                value={designText}
                onChange={(e) => setDesignText(e.target.value)}
                placeholder="1. الخطوة الأولى: ...&#10;2. الخطوة الثانية: ...&#10;3. الخطوة الثالثة: ..."
                rows={7}
                className="w-full p-4 text-xs bg-[#EDF6F9] text-[#006D77] rounded-xl border border-[#83C5BE] focus:outline-hidden focus:ring-2 focus:ring-[#004D54]"
              />
            </div>

            <div className="pt-2 flex justify-between">
              <button
                onClick={() => setActiveStepIndex(2)}
                className="px-4 py-2 rounded-xl border border-[#83C5BE] text-[#006D77]/80 font-semibold text-xs hover:bg-[#EDF6F9] cursor-pointer"
              >
                السابق: تحليل المشكلة
              </button>
              <button
                onClick={() => {
                  handleSaveDraft();
                  setActiveStepIndex(4);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#006D77] hover:bg-white text-[#006D77] font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>الانتقال للخطوة 4: كتابة الكود في Monaco Editor</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Code Writing with Monaco Editor */}
        {activeStepIndex === 4 && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-[#83C5BE] text-[#006D77] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white bg-[#006D77] px-2 py-0.5 rounded border border-[#E29578]/50">
                  الخطوة الرابعة
                </span>
                <h2 className="text-base font-bold text-[#004D54] mt-1">4. كتابة الكود البرمجي في محرر Monaco Editor</h2>
                <p className="text-xs text-[#E29578]">قم بكتابة وتطوير الدالة المطلوبة مع تطبيق القواعد النحوية والتسميات المعبرة.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveDraft}
                  className="px-3 py-1.5 rounded-lg bg-[#EDF6F9] hover:bg-[#83C5BE] text-[#004D54] text-xs font-bold transition-colors cursor-pointer"
                >
                  حفظ المسودة
                </button>
                <button
                  onClick={() => {
                    handleSaveDraft();
                    setActiveStepIndex(5);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#006D77] hover:bg-white text-[#006D77] font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>الانتقال للخطوة 5: الاختبار</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Monaco Editor Component */}
            <MonacoCodeEditor
              initialCode={code}
              starterCode={currentProject.starterCode}
              testCases={currentProject.testCases}
              onCodeChange={(newCode) => setCode(newCode)}
            />
          </div>
        )}

        {/* Step 5: Testing & Debugging */}
        {activeStepIndex === 5 && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-[#83C5BE] shadow-md text-[#006D77] space-y-4">
              <div>
                <span className="text-xs font-bold text-white bg-[#006D77] px-2.5 py-1 rounded-lg border border-[#E29578]/50">
                  الخطوة الخامسة
                </span>
                <h2 className="text-lg font-extrabold text-[#004D54] mt-2">5. اختبار البرنامج وتغطية حالات الاختبار</h2>
                <p className="text-xs text-[#E29578] mt-1">
                  قم بتشغيل البرنامج واختباره بقيم متعددة وحالات شاذة للتحقق من صحته.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-[#004D54] block mb-2">
                  تقرير نتائج الاختبارات والملاحظات:
                </label>
                <textarea
                  value={testReportText}
                  onChange={(e) => setTestReportText(e.target.value)}
                  placeholder="سجل هنا نتائج اختبار البرنامج بقيم مدخلات مختلفة مثل: الدرجات العادية، الدرجات الكسرية، والقيم الحدودية..."
                  rows={4}
                  className="w-full p-3 text-xs bg-[#EDF6F9] text-[#006D77] rounded-xl border border-[#83C5BE] focus:outline-hidden focus:ring-2 focus:ring-[#004D54]"
                />
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  onClick={() => setActiveStepIndex(4)}
                  className="px-4 py-2 rounded-xl border border-[#83C5BE] text-[#006D77]/80 font-semibold text-xs hover:bg-[#EDF6F9] cursor-pointer"
                >
                  العودة لتعديل الكود
                </button>
                <button
                  onClick={() => {
                    handleSaveDraft();
                    setActiveStepIndex(6);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#006D77] hover:bg-white text-[#006D77] font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>الانتقال للخطوة 6: رفع وتسليم المشروع</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Monaco Editor with quick test buttons */}
            <MonacoCodeEditor
              initialCode={code}
              starterCode={currentProject.starterCode}
              testCases={currentProject.testCases}
              onCodeChange={(newCode) => setCode(newCode)}
            />
          </div>
        )}

        {/* Step 6: Project Submission */}
        {activeStepIndex === 6 && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#83C5BE] text-[#006D77] space-y-6 shadow-xs">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#006D77] text-white flex items-center justify-center mx-auto mb-2 border border-[#E29578]/50">
                <Send className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-extrabold text-[#004D54]">6. رفع وتسليم المشروع البرمجي</h2>
              <p className="text-xs text-[#E29578] leading-relaxed">
                تأكد من اكتمال الكود، تحليل المشكلة، وتصميم الخوارزمية قبل الرفع. سيتم توثيق وقت وتاريخ الإرسال لقياس مؤشرات الانخراط السلوكي.
              </p>
            </div>

            {/* Submission Summary Card */}
            <div className="bg-[#EDF6F9] rounded-xl p-5 border border-[#83C5BE] space-y-3 text-xs">
              <h3 className="font-bold text-[#004D54] text-sm border-b border-[#83C5BE] pb-2">
                ملخص بيانات التسليم:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[#006D77]/80">
                <div><strong className="text-[#004D54]">اسم الطالب:</strong> {currentUser.name}</div>
                <div><strong className="text-[#004D54]">المجموعة:</strong> {currentUser.role === 'student_individual' ? 'المجموعة الفردية' : 'المجموعة التشاركية'}</div>
                <div><strong className="text-[#004D54]">المشروع:</strong> {currentProject.title}</div>
                <div><strong className="text-[#004D54]">حالة التسليم:</strong> {submission?.status === 'evaluated' ? 'تم التقييم بنجاح' : submission?.status === 'submitted' ? 'تم الرفع وبانتظار التقييم' : 'مسودة'}</div>
              </div>

              {submission?.submittedAt && (
                <div className="text-[#006D77] font-semibold pt-1">
                  تاريخ ووقت آخر إرسال: {new Date(submission.submittedAt).toLocaleString('ar-EG')}
                </div>
              )}
            </div>

            {/* Submit Action */}
            <div className="text-center pt-2">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3.5 rounded-xl bg-[#006D77] hover:bg-white text-[#006D77] font-black text-sm transition-all shadow-lg shadow-[#004D54]/30 flex items-center gap-2 mx-auto disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitted ? 'إعادة رفع وتحديث تسليم المشروع' : 'رفع المشروع للاعتماد والتقييم'}</span>
              </button>
            </div>

            <div className="pt-4 border-t border-[#83C5BE] flex justify-between">
              <button
                onClick={() => setActiveStepIndex(5)}
                className="px-4 py-2 rounded-xl border border-[#83C5BE] text-[#006D77]/80 font-semibold text-xs hover:bg-[#EDF6F9] cursor-pointer"
              >
                السابق: الاختبار
              </button>
              <button
                onClick={() => setActiveStepIndex(7)}
                className="px-4 py-2 rounded-xl bg-white text-[#006D77] font-bold text-xs hover:bg-white cursor-pointer"
              >
                الانتقال لبطاقة التقييم والتغذية الراجعة
              </button>
            </div>
          </div>
        )}

        {/* Step 7: Feedback & Rubric Evaluation */}
        {activeStepIndex === 7 && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#83C5BE] text-[#006D77] shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#83C5BE] pb-4">
                <div>
                  <span className="text-xs font-bold text-white bg-[#006D77] px-2.5 py-1 rounded-lg border border-[#E29578]/50">
                    الخطوة السابعة
                  </span>
                  <h2 className="text-lg font-extrabold text-[#004D54] mt-2">7. التغذية الراجعة وبطاقة التقييم (Rubric)</h2>
                  <p className="text-xs text-[#E29578] mt-0.5">
                    الاطلاع على تقييم المعلم لمنتجك البرمجي وفق المعايير السبعة المحددة والملاحظات على الكود.
                  </p>
                </div>

                {submission?.totalScore !== undefined ? (
                  <div className="bg-[#006D77] border border-[#E29578]/50 p-3 rounded-xl text-center shrink-0">
                    <span className="text-xs text-[#004D54] block font-bold">الدرجة الممنوحة:</span>
                    <span className="text-2xl font-black text-[#006D77]">{submission.totalScore} / 100</span>
                  </div>
                ) : (
                  <div className="bg-[#EDF6F9] border border-[#E29578] p-3 rounded-xl text-center shrink-0">
                    <span className="text-xs text-[#91472F] block font-bold">حالة التقييم:</span>
                    <span className="text-xs font-bold text-[#91472F]">بانتظار رصد درجات المعلم</span>
                  </div>
                )}
              </div>

              {/* Teacher General Feedback Box */}
              {submission?.teacherGeneralFeedback ? (
                <div className="p-4 rounded-xl bg-[#006D77]/80 border border-[#E29578]/50 text-xs text-white space-y-1">
                  <h3 className="font-bold text-white flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-[#006D77]" />
                    ملاحظات وتوجيهات المعلم:
                  </h3>
                  <p className="leading-relaxed text-white">{submission.teacherGeneralFeedback}</p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#EDF6F9] border border-[#83C5BE] text-xs text-[#E29578] text-center">
                  لم يتم إضافة تعليقات عامة من المعلم بعد.
                </div>
              )}

              {/* Line comments if any */}
              {submission?.codeLineComments && submission.codeLineComments.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#004D54]">ملاحظات المعلم على أسطر الكود:</h4>
                  {submission.codeLineComments.map((comment, cIdx) => (
                    <div key={cIdx} className="p-3 bg-[#EDF6F9] rounded-lg border border-[#E29578] text-xs text-[#91472F]">
                      <span className="font-bold ml-2">السطر {comment.lineNumber}:</span>
                      {comment.comment}
                      <span className="text-[10px] text-[#91472F] block mt-0.5">بواسطة: {comment.authorName}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Rubric Matrix */}
            <RubricViewer
              criteria={currentProject.rubricCriteria}
              selectedScores={submission?.rubricScores || {}}
              totalScore={submission?.totalScore}
              isEditable={false}
            />

            {/* Next Project Action */}
            <div className="p-6 bg-gradient-to-r from-[#006D77] to-[#006D77] text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-base">جاهز للمشروع التالي؟</h3>
                <p className="text-xs text-white/90">واصل تقدمك في المقرر وطبق المهارات البرمجية التالية.</p>
              </div>

              {currentProject.order < 4 && (
                <button
                  onClick={() => {
                    const nextProj = projects.find(p => p.order === currentProject.order + 1);
                    if (nextProj) {
                      setSelectedProjectId(nextProj.id);
                      setActiveStepIndex(1);
                    }
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#006D77] hover:bg-[#E29578] text-white font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>الانتقال للمشروع {currentProject.order + 1}</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Floating Socratic AI Tutor */}
      <AITutorWidget 
        currentProject={currentProject} 
        currentCode={code} 
        experimentalGroup="individual" 
      />

      {/* Save Toast */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-white text-[#006D77] text-xs font-bold py-2.5 px-4 rounded-xl shadow-xl border border-[#83C5BE] flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-[#006D77]" />
          <span>{saveToast}</span>
        </div>
      )}

    </div>
  );
};
