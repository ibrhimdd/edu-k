import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BookOpen, 
  FolderGit2, 
  CheckCircle2, 
  Lock, 
  ArrowLeft, 
  ArrowRight,
  Sparkles, 
  Award, 
  FileCheck2, 
  Activity, 
  Code2, 
  Users, 
  User, 
  Layers, 
  Play, 
  RotateCcw,
  CheckCircle,
  HelpCircle,
  Clock,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LearningUnitsView } from './LearningUnitsView';
import { IndividualProjectWorkspace } from './IndividualProjectWorkspace';
import { CollaborativeProjectWorkspace } from './CollaborativeProjectWorkspace';
import { EngagementScaleView } from './EngagementScaleView';

export const SimplifiedStudentPortal: React.FC = () => {
  const { 
    currentUser, 
    prePostQuestions, 
    saveAssessmentResult, 
    saveEngagementSurvey 
  } = useApp();

  const isCollaborative = currentUser.role === 'student_collaborative';
  const hasCompletedPreTest = currentUser.preTestScore !== undefined;
  const hasCompletedPostTest = currentUser.postTestScore !== undefined;

  // Active step: 
  // Step 1: Pre-test (if not completed, forcibly active)
  // Step 2: Content & Projects
  // Step 3: Post-test & Engagement Scale
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(
    !hasCompletedPreTest ? 1 : (hasCompletedPostTest ? 3 : 2)
  );

  // Sub-tab inside Step 2 (Units vs Project)
  const [step2SubTab, setStep2SubTab] = useState<'units' | 'project'>('units');

  // Sub-tab inside Step 3 (Post-Test vs Engagement Scale)
  const [step3SubTab, setStep3SubTab] = useState<'post_test' | 'engagement'>('post_test');

  // Pre-test state
  const [preAnswers, setPreAnswers] = useState<Record<string, number>>({});
  const [preSubmittedModal, setPreSubmittedModal] = useState<{ score: number } | null>(null);

  // Post-test state
  const [postAnswers, setPostAnswers] = useState<Record<string, number>>({});
  const [postSubmittedModal, setPostSubmittedModal] = useState<{ score: number } | null>(null);

  // Filter questions for pre/post test
  const testQuestions = prePostQuestions;

  // Handle Pre-Test Submission
  const handlePreTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(preAnswers).length < testQuestions.length) {
      if (!confirm(`لقد أجبت عن ${Object.keys(preAnswers).length} من أصل ${testQuestions.length} سؤالاً. هل تود تسليم الاختبار الآن؟`)) {
        return;
      }
    }

    let correct = 0;
    testQuestions.forEach(q => {
      if (preAnswers[q.id] === q.correctOptionIndex) {
        correct++;
      }
    });

    const calculatedScore = Math.round((correct / testQuestions.length) * 100);
    saveAssessmentResult('pre_test', calculatedScore);

    // Trigger celebration
    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (_) {}

    setPreSubmittedModal({ score: calculatedScore });
  };

  // Handle Post-Test Submission
  const handlePostTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(postAnswers).length < testQuestions.length) {
      if (!confirm(`لقد أجبت عن ${Object.keys(postAnswers).length} من أصل ${testQuestions.length} سؤالاً. هل تود تسليم الاختبار البعدي الآن؟`)) {
        return;
      }
    }

    let correct = 0;
    testQuestions.forEach(q => {
      if (postAnswers[q.id] === q.correctOptionIndex) {
        correct++;
      }
    });

    const calculatedScore = Math.round((correct / testQuestions.length) * 100);
    saveAssessmentResult('post_test', calculatedScore);

    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    } catch (_) {}

    setPostSubmittedModal({ score: calculatedScore });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-200">
      
      {/* Top Pedagogical Progress Tracker (3 Clean Steps) */}
      <div className="bg-white rounded-2xl p-5 border border-[#83C5BE] shadow-xs text-[#006D77]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#83C5BE]">
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                isCollaborative 
                  ? 'bg-[#006D77] text-[#E29578] border-[#83C5BE]' 
                  : 'bg-[#006D77] text-white border-[#83C5BE]'
              }`}>
                {isCollaborative ? 'المجموعة التشاركية' : 'المجموعة الفردية'}
              </span>
              <span className="text-xs text-[#E29578]">مقرر مهارات البرمجة بلغة بايثون</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#004D54] mt-1">
              مرحباً بك يا {currentUser.name} 👋
            </h1>
          </div>

          {/* Quick Score Badges if taken */}
          <div className="flex items-center gap-3">
            {hasCompletedPreTest && (
              <div className="bg-[#EDF6F9] px-3.5 py-2 rounded-xl border border-[#83C5BE] text-center">
                <span className="block text-[11px] text-[#E29578] font-semibold">الامتحان القبلي</span>
                <span className="text-sm font-black text-[#004D54]">{currentUser.preTestScore}%</span>
              </div>
            )}
            {hasCompletedPostTest && (
              <div className="bg-[#EDF6F9] px-3.5 py-2 rounded-xl border border-[#83C5BE] text-center">
                <span className="block text-[11px] text-[#E29578] font-semibold">الامتحان البعدي</span>
                <span className="text-sm font-black text-[#004D54]">{currentUser.postTestScore}%</span>
              </div>
            )}
            {currentUser.engagementScore?.percentage && (
              <div className="bg-[#EDF6F9] px-3.5 py-2 rounded-xl border border-[#83C5BE] text-center">
                <span className="block text-[11px] text-[#E29578] font-semibold">الانخراط في التعلم</span>
                <span className="text-sm font-black text-white">{currentUser.engagementScore.percentage}%</span>
              </div>
            )}
          </div>
        </div>

        {/* 3 Step Stepper */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
          
          {/* STEP 1 */}
          <button
            onClick={() => setCurrentStep(1)}
            className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer flex items-center justify-between ${
              currentStep === 1
                ? 'bg-[#006D77] text-white border-[#83C5BE] shadow-sm'
                : hasCompletedPreTest
                  ? 'bg-[#EDF6F9] border-[#83C5BE] text-[#E29578] hover:bg-[#006D77]/30'
                  : 'bg-[#EDF6F9] border-[#83C5BE] text-[#006D77]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${
                currentStep === 1 
                  ? 'bg-white text-[#0b101b]' 
                  : hasCompletedPreTest 
                    ? 'bg-[#006D77] text-white' 
                    : 'bg-[#EDF6F9] text-[#E29578] border border-[#83C5BE]'
              }`}>
                {hasCompletedPreTest ? <CheckCircle className="w-4 h-4" /> : '1'}
              </div>
              <div>
                <div className="font-bold text-xs">المرحلة الأولى: الامتحان القبلي</div>
                <div className={`text-[11px] ${currentStep === 1 ? 'text-[#E29578]' : 'text-[#006D77]/70'}`}>
                  {hasCompletedPreTest ? `مكتمل (الدرجة: ${currentUser.preTestScore}%)` : 'إلزامي للبدء في المنصة'}
                </div>
              </div>
            </div>
            {hasCompletedPreTest && currentStep !== 1 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#006D77] text-white border border-[#83C5BE]">تم الإنجاز</span>
            )}
          </button>

          {/* STEP 2 */}
          <button
            onClick={() => {
              if (hasCompletedPreTest) setCurrentStep(2);
            }}
            disabled={!hasCompletedPreTest}
            className={`p-3.5 rounded-xl border text-right transition-all flex items-center justify-between ${
              !hasCompletedPreTest
                ? 'bg-[#EDF6F9]/50 border-[#83C5BE]/40 text-[#2D3748] font-medium opacity-60 cursor-not-allowed'
                : currentStep === 2
                  ? 'bg-[#006D77] text-[#006D77] border-[#83C5BE] shadow-sm cursor-pointer'
                  : 'bg-[#EDF6F9] border-[#83C5BE] text-[#006D77] hover:bg-[#006D77]/30 cursor-pointer'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${
                !hasCompletedPreTest
                  ? 'bg-[#EDF6F9] text-[#2D3748] font-medium'
                  : currentStep === 2
                    ? 'bg-white text-[#0b101b]'
                    : 'bg-[#006D77] text-[#006D77]'
              }`}>
                {!hasCompletedPreTest ? <Lock className="w-4 h-4" /> : '2'}
              </div>
              <div>
                <div className="font-bold text-xs">المرحلة الثانية: المحتوى والمشاريع</div>
                <div className={`text-[11px] ${currentStep === 2 ? 'text-[#E29578]' : 'text-[#006D77]/70'}`}>
                  {!hasCompletedPreTest ? 'مقفل حتى إنجاز الامتحان القبلي' : 'دراسة الوحدات وتنفيذ المشروع'}
                </div>
              </div>
            </div>
            {!hasCompletedPreTest && <Lock className="w-4 h-4 text-[#2D3748] font-medium" />}
          </button>

          {/* STEP 3 */}
          <button
            onClick={() => {
              if (hasCompletedPreTest) setCurrentStep(3);
            }}
            disabled={!hasCompletedPreTest}
            className={`p-3.5 rounded-xl border text-right transition-all flex items-center justify-between ${
              !hasCompletedPreTest
                ? 'bg-[#EDF6F9]/50 border-[#83C5BE]/40 text-[#2D3748] font-medium opacity-60 cursor-not-allowed'
                : currentStep === 3
                  ? 'bg-[#006D77] text-[#006D77] border-[#83C5BE] shadow-sm cursor-pointer'
                  : 'bg-[#EDF6F9] border-[#83C5BE] text-[#006D77] hover:bg-[#006D77]/30 cursor-pointer'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${
                !hasCompletedPreTest
                  ? 'bg-[#E29578]/40 text-[#2D3748]'
                  : currentStep === 3
                    ? 'bg-white text-[#0b101b]'
                    : hasCompletedPostTest
                      ? 'bg-[#006D77] text-[#006D77]'
                      : 'bg-[#006D77] text-[#006D77]'
              }`}>
                {!hasCompletedPreTest ? <Lock className="w-4 h-4" /> : hasCompletedPostTest ? <CheckCircle className="w-4 h-4" /> : '3'}
              </div>
              <div>
                <div className="font-bold text-xs">المرحلة الثالثة: البعدي والانخراط</div>
                <div className={`text-[11px] ${currentStep === 3 ? 'text-[#E29578]' : 'text-[#94a3b8]'}`}>
                  {hasCompletedPostTest ? `مكتمل (الدرجة: ${currentUser.postTestScore}%)` : 'الامتحان البعدي + مقياس الانخراط'}
                </div>
              </div>
            </div>
            {hasCompletedPostTest && currentStep !== 3 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#006D77] text-white">تم الإنجاز</span>
            )}
          </button>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: PRE-TEST VIEW (الامتحان القبلي) */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <div className="space-y-6">
          
          {/* Informational Guidance Banner */}
          <div className="bg-[#006D77] border border-[#E29578]/50 rounded-2xl p-5 text-white space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-[#006D77]">
              <HelpCircle className="w-5 h-5 text-[#006D77]" />
              <span>الامتحان القبلي في مقرر بايثون (إلزامي للبدء في المنصة)</span>
            </div>
            <p className="text-xs text-[#cbd5e1] leading-relaxed">
              عزيزي الطالب، يهدف هذا الاختبار إلى قياس معلوماتك وخبراتك السابقة في لغة بايثون ومفاهيم البرمجة قبل دراسة محتوى المقرر والمشاريع.
              يرجى الإجابة عن كافة الأسئلة بدقة وموضوعية. بمجرد تسليم الاختبار، سيتم رصد درجاتك للدكتور وفتح وحدات المقرر والمشاريع البرمجية لك مباشرة.
            </p>
            {hasCompletedPreTest && (
              <div className="pt-2 flex items-center justify-between border-t border-[#E29578]/50">
                <span className="text-xs font-bold text-[#006D77]">
                  لقد أديت هذا الاختبار مسبقاً وحصلت على: {currentUser.preTestScore}%
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-1.5 rounded-lg bg-[#006D77] text-white text-xs font-bold hover:bg-[#E29578] flex items-center gap-1.5 cursor-pointer"
                >
                  <span>متابعة دراسة المحتوى والمشاريع</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Pre-Test Questions Form */}
          <form onSubmit={handlePreTestSubmit} className="space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-[#83C5BE] shadow-xs space-y-6 text-[#006D77]">
              
              <div className="flex items-center justify-between border-b border-[#83C5BE] pb-4">
                <div>
                  <h2 className="text-base font-extrabold text-[#004D54]">
                    أسئلة الاختبار القبلي ({testQuestions.length} سؤالاً)
                  </h2>
                  <p className="text-xs text-[#94a3b8] mt-0.5">
                    اختر الإجابة الصحيحة لكل سؤال من الخيارات المتاحة أدناه.
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-[#E29578]/40 rounded-full border border-[#83C5BE] text-[#006D77]">
                  تمت الإجابة عن: {Object.keys(preAnswers).length} / {testQuestions.length}
                </span>
              </div>

              <div className="space-y-6">
                {testQuestions.map((q, idx) => (
                  <div 
                    key={q.id} 
                    className={`p-4 rounded-xl border transition-all ${
                      preAnswers[q.id] !== undefined
                        ? 'bg-[#006D77] border-[#E29578]/50'
                        : 'bg-white border-[#83C5BE]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="text-xs sm:text-sm font-bold text-[#004D54] leading-relaxed">
                        <span className="inline-block w-6 h-6 rounded-full bg-[#006D77] text-white text-center leading-6 font-bold text-xs ml-2">
                          {idx + 1}
                        </span>
                        {q.question}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#E29578]/40 text-[#94a3b8] font-semibold whitespace-nowrap">
                        {q.skillTested}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 mr-8">
                      {q.options.map((opt, optIdx) => (
                        <label
                          key={optIdx}
                          className={`p-3 rounded-lg border text-xs flex items-center gap-2.5 transition-all cursor-pointer ${
                            preAnswers[q.id] === optIdx
                              ? 'bg-[#006D77] text-white border-[#83C5BE] font-bold shadow-2xs'
                              : 'bg-white border-[#83C5BE] text-[#1F2937] hover:bg-[#E29578]/40'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`pre_${q.id}`}
                            checked={preAnswers[q.id] === optIdx}
                            onChange={() => setPreAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                            className="hidden"
                          />
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            preAnswers[q.id] === optIdx ? 'border-white bg-white' : 'border-[#98A2B3]'
                          }`}>
                            {preAnswers[q.id] === optIdx && (
                              <span className="w-2 h-2 rounded-full bg-[#006D77]"></span>
                            )}
                          </span>
                          <span className="leading-snug">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-[#83C5BE] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-[#94a3b8]">
                  {Object.keys(preAnswers).length === testQuestions.length ? (
                    <span className="text-[#006D77] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      أحسنت! تمت الإجابة عن جميع الأسئلة. يمكنك تسليم الاختبار الآن.
                    </span>
                  ) : (
                    <span>متبقي {testQuestions.length - Object.keys(preAnswers).length} سؤالاً للإجابة عنها بالكامل.</span>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#006D77] hover:bg-white text-white hover:text-[#004D54] font-bold text-xs sm:text-sm transition-all shadow-md shadow-[#004D54]/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>تسليم نتيجة الاختبار القبلي</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>

            </div>
          </form>

        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: LEARNING CONTENT & PROJECTS (الوحدات والمشاريع) */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <div className="space-y-6">
          
          {/* Sub-Navigation: Units vs Project */}
          <div className="bg-white p-2 rounded-2xl border border-[#83C5BE] shadow-md flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStep2SubTab('units')}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                  step2SubTab === 'units'
                    ? 'bg-[#006D77] text-white shadow-xs border border-[#83C5BE]'
                    : 'text-[#E29578] hover:text-white hover:bg-[#006D77]/40'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>1. وحدات المقرر التعليمية (8 وحدات)</span>
              </button>

              <button
                onClick={() => setStep2SubTab('project')}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                  step2SubTab === 'project'
                    ? 'bg-[#006D77] text-white shadow-xs border border-[#83C5BE]'
                    : 'text-[#E29578] hover:text-white hover:bg-[#006D77]/40'
                }`}
              >
                <FolderGit2 className="w-4 h-4" />
                <span>2. المشروع البرمجي العملي</span>
                {isCollaborative && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#059669] text-white font-bold">تشاركي</span>
                )}
              </button>
            </div>

            {/* Direct Link to Step 3 */}
            <button
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 rounded-xl bg-[#006D77] hover:bg-[#E29578] text-white font-bold text-xs transition-colors flex items-center gap-1.5 border border-[#83C5BE] cursor-pointer"
            >
              <span>جاهز للاختبار البعدي؟ الانتقال للمرحلة 3</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sub-View Render */}
          {step2SubTab === 'units' ? (
            <div className="space-y-4">
              <LearningUnitsView />
            </div>
          ) : (
            <div className="space-y-4">
              {isCollaborative ? (
                <CollaborativeProjectWorkspace />
              ) : (
                <IndividualProjectWorkspace />
              )}
            </div>
          )}

          {/* Next Step Callout */}
          <div className="bg-white p-6 rounded-2xl border border-[#83C5BE] shadow-xs flex flex-col sm:flex-row text-[#006D77] items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-sm text-[#004D54]">
                هل أتممت دراسة الوحدات وتنفيذ مشروعك البرمجي؟
              </h3>
              <p className="text-xs text-[#94a3b8] mt-1">
                يمكنك الآن الانتقال إلى المرحلة الأخيرة لأداء الاختبار البعدي ومقياس الانخراط لرصد الكسب في التعلم.
              </p>
            </div>

            <button
              onClick={() => setCurrentStep(3)}
              className="px-6 py-3 rounded-xl bg-[#006D77] hover:bg-white text-[#006D77] font-bold text-xs sm:text-sm transition-all shadow-md shadow-[#004D54]/20 flex items-center gap-2 cursor-pointer shrink-0"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>الانتقال إلى الاختبار البعدي ومقياس الانخراط</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: POST-TEST & ENGAGEMENT SCALE (البعدي والانخراط) */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <div className="space-y-6">
          
          {/* Sub-Tabs for Step 3 */}
          <div className="bg-white p-2 rounded-2xl border border-[#83C5BE] shadow-md flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStep3SubTab('post_test')}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                  step3SubTab === 'post_test'
                    ? 'bg-[#006D77] text-white shadow-xs border border-[#83C5BE]'
                    : 'text-[#E29578] hover:text-white hover:bg-[#006D77]/40'
                }`}
              >
                <FileCheck2 className="w-4 h-4" />
                <span>الامتحان البعدي في بايثون</span>
                {hasCompletedPostTest && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#059669] text-white font-bold">
                    {currentUser.postTestScore}%
                  </span>
                )}
              </button>

              <button
                onClick={() => setStep3SubTab('engagement')}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                  step3SubTab === 'engagement'
                    ? 'bg-[#006D77] text-white shadow-xs border border-[#83C5BE]'
                    : 'text-[#E29578] hover:text-white hover:bg-[#006D77]/40'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>مقياس الانخراط في تعلم البرمجة (56 عبارة)</span>
              </button>
            </div>

            <button
              onClick={() => setCurrentStep(2)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#E29578] hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>العودة للمحتوى والمشاريع</span>
            </button>
          </div>

          {/* RENDER STEP 3 CONTENT */}
          {step3SubTab === 'post_test' ? (
            <div className="space-y-6">
              
              {/* Educational Comparison Header if completed */}
              {hasCompletedPostTest && (
                <div className="bg-gradient-to-r from-[#006D77] to-[#006D77] text-white p-6 rounded-2xl border border-[#83C5BE] shadow-md space-y-4">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#006D77]" />
                    <h3 className="font-extrabold text-base">
                      تقرير الكسب الأكاديمي النهائي للطالب
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-2">
                    <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs border border-white/10">
                      <span className="block text-[11px] text-[#E29578]">الاختبار القبلي</span>
                      <span className="text-xl font-black text-white">{currentUser.preTestScore}%</span>
                    </div>
                    <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs border border-white/10">
                      <span className="block text-[11px] text-[#E29578]">الاختبار البعدي</span>
                      <span className="text-xl font-black text-white">{currentUser.postTestScore}%</span>
                    </div>
                    <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs border border-white/10">
                      <span className="block text-[11px] text-[#E29578]">مقدار الكسب والتحسن</span>
                      <span className="text-xl font-black text-white">
                        +{Math.max(0, (currentUser.postTestScore || 0) - (currentUser.preTestScore || 0))}%
                      </span>
                    </div>
                    <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs border border-white/10">
                      <span className="block text-[11px] text-[#E29578]">نسبة إنجاز المقرر</span>
                      <span className="text-xl font-black text-white">{currentUser.progressPercentage}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Post-test Form */}
              <form onSubmit={handlePostTestSubmit} className="space-y-4">
                <div className="bg-white p-6 rounded-2xl border border-[#83C5BE] shadow-xs space-y-6 text-[#006D77]">
                  
                  <div className="flex items-center justify-between border-b border-[#83C5BE] pb-4">
                    <div>
                      <h2 className="text-base font-extrabold text-[#004D54]">
                        أسئلة الاختبار البعدي في لغة بايثون ({testQuestions.length} سؤالاً)
                      </h2>
                      <p className="text-xs text-[#94a3b8] mt-0.5">
                        أجب عن الأسئلة لقياس ما اكتسبته بعد إتمام دراسة الوحدات والمشاريع البرمجية.
                      </p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 bg-[#E29578]/40 rounded-full border border-[#83C5BE] text-[#006D77]">
                      تمت الإجابة عن: {Object.keys(postAnswers).length} / {testQuestions.length}
                    </span>
                  </div>

                  <div className="space-y-6">
                    {testQuestions.map((q, idx) => (
                      <div 
                        key={q.id} 
                        className={`p-4 rounded-xl border transition-all ${
                          postAnswers[q.id] !== undefined
                            ? 'bg-[#006D77] border-[#E29578]/50'
                            : 'bg-white border-[#83C5BE]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <h3 className="text-xs sm:text-sm font-bold text-[#004D54] leading-relaxed">
                            <span className="inline-block w-6 h-6 rounded-full bg-[#006D77] text-white text-center leading-6 font-bold text-xs ml-2">
                              {idx + 1}
                            </span>
                            {q.question}
                          </h3>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#E29578]/40 text-[#94a3b8] font-semibold whitespace-nowrap">
                            {q.skillTested}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 mr-8">
                          {q.options.map((opt, optIdx) => (
                            <label
                              key={optIdx}
                              className={`p-3 rounded-lg border text-xs flex items-center gap-2.5 transition-all cursor-pointer ${
                                postAnswers[q.id] === optIdx
                                  ? 'bg-[#006D77] text-white border-[#83C5BE] font-bold shadow-2xs'
                                  : 'bg-white border-[#83C5BE] text-[#e2e8f0] hover:bg-[#E29578]/40'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`post_${q.id}`}
                                checked={postAnswers[q.id] === optIdx}
                                onChange={() => setPostAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                                className="hidden"
                              />
                              <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                postAnswers[q.id] === optIdx ? 'border-white bg-white' : 'border-[#98A2B3]'
                              }`}>
                                {postAnswers[q.id] === optIdx && (
                                  <span className="w-2 h-2 rounded-full bg-[#006D77]"></span>
                                )}
                              </span>
                              <span className="leading-snug">{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Submit Post-test Button */}
                  <div className="pt-4 border-t border-[#83C5BE] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-[#94a3b8]">
                      {Object.keys(postAnswers).length === testQuestions.length ? (
                        <span className="text-[#006D77] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          أحسنت! تمت الإجابة عن كافة أسئلة الاختبار البعدي.
                        </span>
                      ) : (
                        <span>متبقي {testQuestions.length - Object.keys(postAnswers).length} سؤالاً.</span>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#006D77] hover:bg-white text-[#006D77] font-bold text-xs sm:text-sm transition-all shadow-md shadow-[#004D54]/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FileCheck2 className="w-4 h-4" />
                      <span>تسليم نتيجة الاختبار البعدي</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </form>

            </div>
          ) : (
            <div className="space-y-4">
              <EngagementScaleView />
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* PRE-TEST SUBMITTED CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {preSubmittedModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#83C5BE] shadow-2xl text-[#006D77] text-center space-y-5 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-[#006D77] text-white mx-auto flex items-center justify-center">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-[#004D54]">
                تهانينا يا {currentUser.name}! 🎉
              </h3>
              <p className="text-xs text-[#94a3b8]">
                تم تسليم الاختبار القبلي بنجاح ورصد درجتك في سجلات الأستاذ المشرف.
              </p>
            </div>

            <div className="bg-[#E29578]/40 p-4 rounded-2xl border border-[#83C5BE]">
              <span className="block text-xs text-[#94a3b8] font-bold">درجتك في الاختبار القبلي</span>
              <span className="text-4xl font-black text-[#006D77]">{preSubmittedModal.score}%</span>
            </div>

            <div className="bg-[#006D77] p-3.5 rounded-xl border border-[#E29578]/50 text-right space-y-1 text-xs text-[#006D77]">
              <div className="font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>تم فتح المحتوى التعليمي والمشاريع!</span>
              </div>
              <p className="text-[11px] text-[#cbd5e1]">
                يمكنك الآن الانتقال لدراسة وحدات مقرر بايثون والبدء في تنفيذ مشروعك البرمجي.
              </p>
            </div>

            <button
              onClick={() => {
                setPreSubmittedModal(null);
                setCurrentStep(2);
              }}
              className="w-full py-3 rounded-xl bg-[#006D77] hover:bg-white text-[#006D77] font-bold text-sm transition-all shadow-md shadow-[#004D54]/20 cursor-pointer"
            >
              الانتقال لدراسة المحتوى والمشاريع البرمجية
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* POST-TEST SUBMITTED CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {postSubmittedModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#83C5BE] shadow-2xl text-[#006D77] text-center space-y-5 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-[#006D77] text-white mx-auto flex items-center justify-center">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-[#004D54]">
                بارك الله في جهودك يا {currentUser.name}! 🌟
              </h3>
              <p className="text-xs text-[#94a3b8]">
                تم تسليم الاختبار البعدي بنجاح ورصد درجاتك للدكتور.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#E29578]/40 p-3 rounded-xl border border-[#83C5BE]">
                <span className="block text-[11px] text-[#94a3b8]">الاختبار القبلي</span>
                <span className="text-xl font-black text-[#94a3b8]">{currentUser.preTestScore}%</span>
              </div>
              <div className="bg-[#006D77] p-3 rounded-xl border border-[#E29578]/50">
                <span className="block text-[11px] text-[#006D77] font-bold">الاختبار البعدي</span>
                <span className="text-xl font-black text-[#006D77]">{postSubmittedModal.score}%</span>
              </div>
            </div>

            <button
              onClick={() => {
                setPostSubmittedModal(null);
                setStep3SubTab('engagement');
              }}
              className="w-full py-3 rounded-xl bg-[#006D77] hover:bg-white text-[#006D77] font-bold text-sm transition-all shadow-md shadow-[#004D54]/20 cursor-pointer"
            >
              استكمال مقياس الانخراط في تعلم البرمجة
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
