// components/student/AssessmentsView.tsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileCheck2, 
  HelpCircle, 
  CheckCircle2, 
  Award, 
  Sparkles, 
  HeartHandshake, 
  BrainCircuit, 
  Activity,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ENGAGEMENT_SURVEY_QUESTIONS } from '../../data/mockData';

export const AssessmentsView: React.FC = () => {
  const { 
    currentUser, 
    prePostQuestions, 
    saveAssessmentResult, 
    saveEngagementSurvey 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pre' | 'post' | 'engagement'>('pre');
  
  // Test State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isTestSubmitted, setIsTestSubmitted] = useState<boolean>(false);
  const [scoreResult, setScoreResult] = useState<number | null>(null);

  // Engagement Survey State (1-5 Likert scale)
  const [surveyRatings, setSurveyRatings] = useState<Record<string, number>>({
    eng_beh_1: 4,
    eng_beh_2: 5,
    eng_cog_1: 4,
    eng_cog_2: 4,
    eng_emo_1: 5,
    eng_emo_2: 4
  });
  const [surveySubmitted, setSurveySubmitted] = useState(false);

  const handleTestSubmit = (type: 'pre_test' | 'post_test') => {
    let correctCount = 0;
    prePostQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / prePostQuestions.length) * 100);
    setScoreResult(calculatedScore);
    setIsTestSubmitted(true);
    saveAssessmentResult(type === 'pre_test' ? 'pre_test' : 'post_test', calculatedScore);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handleSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Calculate average dimensions
    const beh = Math.round(((surveyRatings.eng_beh_1 + surveyRatings.eng_beh_2) / 10) * 100);
    const cog = Math.round(((surveyRatings.eng_cog_1 + surveyRatings.eng_cog_2) / 10) * 100);
    const emo = Math.round(((surveyRatings.eng_emo_1 + surveyRatings.eng_emo_2) / 10) * 100);

    saveEngagementSurvey({ behavioral: beh, cognitive: cog, emotional: emo });
    setSurveySubmitted(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5EAE5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EBF2ED] text-[#2D5A3D] font-bold border border-[#C8DEC3]">
              وحدة التقويم والقياس الأكاديمي
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A1C1E]">
            الاختبارات القبلية والبعدية ومقياس الانخراط
          </h1>
          <p className="text-xs text-[#667085] mt-0.5">
            قياس تحصيل المهارات البرمجية وأبعاد الانخراط السلوكي، المعرفي، والوجداني في التعلم
          </p>
        </div>

        {/* Current Student Scores Badge */}
        <div className="flex items-center gap-3 bg-[#F8F9FA] p-2.5 rounded-xl border border-[#E5EAE5] text-xs">
          <div>
            <span className="text-[#667085] block text-[10px]">الاختبار القبلي:</span>
            <span className="font-bold text-[#1A1C1E]">{currentUser.preTestScore || '--'}%</span>
          </div>
          <div className="h-6 w-px bg-[#E5EAE5]"></div>
          <div>
            <span className="text-[#667085] block text-[10px]">الاختبار البعدي:</span>
            <span className="font-bold text-[#2D5A3D]">{currentUser.postTestScore || '--'}%</span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="bg-white p-2 rounded-2xl border border-[#E5EAE5] shadow-xs flex flex-wrap items-center gap-1 text-xs font-semibold">
        <button
          onClick={() => {
            setActiveTab('pre');
            setIsTestSubmitted(false);
            setSelectedAnswers({});
            setScoreResult(null);
          }}
          className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'pre' ? 'bg-[#2D5A3D] text-white shadow-xs' : 'text-[#4A5568] hover:bg-[#F8F9FA]'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>أ. الاختبار القبلي (Pre-test)</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('post');
            setIsTestSubmitted(false);
            setSelectedAnswers({});
            setScoreResult(null);
          }}
          className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'post' ? 'bg-[#2D5A3D] text-white shadow-xs' : 'text-[#4A5568] hover:bg-[#F8F9FA]'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>ج. الاختبار البعدي (Post-test)</span>
        </button>

        <button
          onClick={() => setActiveTab('engagement')}
          className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'engagement' ? 'bg-[#2D5A3D] text-white shadow-xs' : 'text-[#4A5568] hover:bg-[#F8F9FA]'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>مقياس الانخراط في التعلم (3 أبعاد)</span>
        </button>
      </div>

      {/* Pre / Post Test Component */}
      {(activeTab === 'pre' || activeTab === 'post') && (
        <div className="bg-white p-6 rounded-2xl border border-[#E5EAE5] space-y-6 shadow-xs">
          <div className="border-b border-[#F0F2F0] pb-4">
            <h2 className="text-lg font-extrabold text-[#1A1C1E]">
              {activeTab === 'pre' ? 'الاختبار القبلي لمهارات البرمجة' : 'الاختبار البعدي لمهارات البرمجة'}
            </h2>
            <p className="text-xs text-[#667085] mt-1">
              {activeTab === 'pre' 
                ? 'يهدف هذا الاختبار لقياس مستواك المعرفي والمهاري في البرمجة قبل البدء في دراسة وحدات ومشروعات البيئة.'
                : 'يهدف هذا الاختبار لقياس التحسن ومقدار نمو مهاراتك البرمجية بعد إتمام المشروعات الإلكترونية.'}
            </p>
          </div>

          <div className="space-y-4">
            {prePostQuestions.map((q, idx) => {
              const selected = selectedAnswers[q.id];
              return (
                <div key={q.id} className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E5EAE5] text-xs space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#2D5A3D] text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <p className="font-bold text-[#1A1C1E] text-sm">{q.question}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#E5EAE5] text-[#244630] font-medium shrink-0">
                      {q.skillTested}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-8">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = selected === oIdx;
                      const isCorrect = q.correctOptionIndex === oIdx;

                      let style = 'bg-white border-[#E5EAE5] text-[#4A5568] hover:border-[#2D5A3D]';
                      if (isTestSubmitted) {
                        if (isCorrect) style = 'bg-[#EBF2ED] border-[#2D5A3D] text-[#1E3B27] font-bold';
                        else if (isSelected && !isCorrect) style = 'bg-[#FDF2F2] border-[#F8B4B4] text-[#9B1C1C]';
                      } else if (isSelected) {
                        style = 'bg-[#EBF2ED] border-[#2D5A3D] text-[#172E1E] font-bold ring-1 ring-[#2D5A3D]';
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => !isTestSubmitted && setSelectedAnswers(prev => ({ ...prev, [q.id]: oIdx }))}
                          className={`p-3 rounded-lg border text-right text-xs transition-all cursor-pointer ${style}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submission and Result */}
          <div className="pt-4 border-t border-[#F0F2F0] flex flex-wrap items-center justify-between gap-4">
            {!isTestSubmitted ? (
              <button
                onClick={() => handleTestSubmit(activeTab === 'pre' ? 'pre_test' : 'post_test')}
                disabled={Object.keys(selectedAnswers).length < prePostQuestions.length}
                className="px-6 py-3 rounded-xl bg-[#2D5A3D] hover:bg-[#234730] text-white font-black text-xs transition-all shadow-md shadow-[#2D5A3D]/20 disabled:opacity-50 cursor-pointer"
              >
                تسليم الإجابات ورصد الدرجة
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-[#EBF2ED] border border-[#C8DEC3] p-4 rounded-xl text-xs font-bold text-[#1E3B27]">
                <CheckCircle2 className="w-5 h-5 text-[#2D5A3D]" />
                <span>تم رصد نتيجتك بنجاح: {scoreResult}%</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Engagement Survey Component */}
      {activeTab === 'engagement' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E5EAE5] space-y-6 shadow-xs">
          <div className="border-b border-[#F0F2F0] pb-4">
            <h2 className="text-lg font-extrabold text-[#1A1C1E]">مقياس الانخراط في التعلم الإلكتروني</h2>
            <p className="text-xs text-[#667085] mt-1">
              مقياس ليكرت الخماسي لتقييم أبعاد الانخراط في بيئة التعلم القائمة على المشروعات (سلوكي، معرفي، وجداني).
            </p>
          </div>

          <form onSubmit={handleSurveySubmit} className="space-y-4">
            {ENGAGEMENT_SURVEY_QUESTIONS.map((item, idx) => (
              <div key={item.id} className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E5EAE5] space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1A1C1E]">
                    {idx + 1}. {item.question}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EBF2ED] text-[#2D5A3D] font-bold border border-[#C8DEC3]">
                    البعد: {item.dimension}
                  </span>
                </div>

                {/* 5-point Likert buttons */}
                <div className="grid grid-cols-5 gap-1.5 text-center">
                  {[
                    { val: 1, label: 'أعارض بشدة' },
                    { val: 2, label: 'أعارض' },
                    { val: 3, label: 'محايد' },
                    { val: 4, label: 'أوافق' },
                    { val: 5, label: 'أوافق بشدة' }
                  ].map(lvl => (
                    <button
                      key={lvl.val}
                      type="button"
                      onClick={() => setSurveyRatings(prev => ({ ...prev, [item.id]: lvl.val }))}
                      className={`p-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        surveyRatings[item.id] === lvl.val
                          ? 'bg-[#2D5A3D] text-white border-[#2D5A3D] shadow-2xs font-bold'
                          : 'bg-white border-[#E5EAE5] text-[#4A5568] hover:bg-[#F8F9FA]'
                      }`}
                    >
                      <span className="block text-xs font-black">{lvl.val}</span>
                      <span className="text-[10px] hidden sm:block">{lvl.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="pt-3 flex items-center justify-between">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#2D5A3D] hover:bg-[#234730] text-white font-bold text-xs transition-colors shadow-md shadow-[#2D5A3D]/20 cursor-pointer"
              >
                حفظ نتائج مقياس الانخراط
              </button>

              {surveySubmitted && (
                <span className="text-xs font-bold text-[#2D5A3D] flex items-center gap-1 bg-[#EBF2ED] px-3 py-1.5 rounded-lg border border-[#C8DEC3]">
                  <CheckCircle2 className="w-4 h-4" />
                  تم حفظ إجاباتك بنجاح في سجلات البحث.
                </span>
              )}
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
