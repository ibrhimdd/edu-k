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
import { EngagementScaleView } from './EngagementScaleView';

export const AssessmentsView: React.FC = () => {
  const { 
    currentUser, 
    prePostQuestions, 
    saveAssessmentResult 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pre' | 'post' | 'engagement'>('pre');
  
  // Test State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isTestSubmitted, setIsTestSubmitted] = useState<boolean>(false);
  const [scoreResult, setScoreResult] = useState<number | null>(null);

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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#83C5BE] shadow-md flex flex-col text-[#006D77] sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#006D77] text-white font-bold border border-[#f59e0b]/50">
              وحدة التقويم والقياس الأكاديمي
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            الاختبارات القبلية والبعدية ومقياس الانخراط
          </h1>
          <p className="text-xs text-[#E29578] mt-0.5">
            قياس تحصيل المهارات البرمجية وأبعاد الانخراط السلوكي، المعرفي، والوجداني في التعلم
          </p>
        </div>

        {/* Current Student Scores Badge */}
        <div className="flex items-center gap-3 bg-[#EDF6F9] p-2.5 rounded-xl border border-[#83C5BE] text-xs">
          <div>
            <span className="text-[#E29578] block text-[10px]">الاختبار القبلي:</span>
            <span className="font-bold text-white">{currentUser.preTestScore || '--'}%</span>
          </div>
          <div className="h-6 w-px bg-[#E5EAE5]"></div>
          <div>
            <span className="text-[#E29578] block text-[10px]">الاختبار البعدي:</span>
            <span className="font-bold text-white">{currentUser.postTestScore || '--'}%</span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="bg-white p-2 rounded-2xl border border-[#83C5BE] shadow-md flex flex-wrap items-center gap-1 text-xs font-semibold">
        <button
          onClick={() => {
            setActiveTab('pre');
            setIsTestSubmitted(false);
            setSelectedAnswers({});
            setScoreResult(null);
          }}
          className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'pre' ? 'bg-[#006D77] text-white shadow-xs' : 'text-[#E29578] hover:text-white hover:bg-[#006D77]/40'
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
            activeTab === 'post' ? 'bg-[#006D77] text-white shadow-xs' : 'text-[#E29578] hover:text-white hover:bg-[#006D77]/40'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>ج. الاختبار البعدي (Post-test)</span>
        </button>

        <button
          onClick={() => setActiveTab('engagement')}
          className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'engagement' ? 'bg-[#006D77] text-white shadow-xs' : 'text-[#E29578] hover:text-white hover:bg-[#006D77]/40'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>مقياس الانخراط في تعلم البرمجة (56 عبارة - 4 أبعاد)</span>
        </button>
      </div>

      {/* Pre / Post Test Component */}
      {(activeTab === 'pre' || activeTab === 'post') && (
        <div className="bg-white p-6 rounded-2xl border border-[#83C5BE] space-y-6 shadow-md text-[#006D77]">
          <div className="border-b border-[#83C5BE] pb-4">
            <h2 className="text-lg font-extrabold text-white">
              {activeTab === 'pre' ? 'الاختبار القبلي لمهارات البرمجة' : 'الاختبار البعدي لمهارات البرمجة'}
            </h2>
            <p className="text-xs text-[#E29578] mt-1">
              {activeTab === 'pre' 
                ? 'يهدف هذا الاختبار لقياس مستواك المعرفي والمهاري في البرمجة قبل البدء في دراسة وحدات ومشروعات البيئة.'
                : 'يهدف هذا الاختبار لقياس التحسن ومقدار نمو مهاراتك البرمجية بعد إتمام المشروعات الإلكترونية.'}
            </p>
          </div>

          <div className="space-y-4">
            {prePostQuestions.map((q, idx) => {
              const selected = selectedAnswers[q.id];
              return (
                <div key={q.id} className="p-4 rounded-xl bg-[#EDF6F9] border border-[#83C5BE] text-[#006D77] text-xs space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#006D77] text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <p className="font-bold text-white text-sm">{q.question}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#EDF6F9] text-[#E29578] border border-[#83C5BE] font-medium shrink-0">
                      {q.skillTested}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-8">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = selected === oIdx;
                      const isCorrect = q.correctOptionIndex === oIdx;

                      let style = 'bg-white border-[#83C5BE] text-[#f3f4f6] hover:border-[#f59e0b]/50 hover:bg-[#006D77]/40';
                      if (isTestSubmitted) {
                        if (isCorrect) style = 'bg-[#006D77] border-[#84cc16] text-[#006D77] font-bold';
                        else if (isSelected && !isCorrect) style = 'bg-red-950/70 border-red-500 text-red-200';
                      } else if (isSelected) {
                        style = 'bg-[#006D77] border-[#f59e0b]/50 text-[#006D77] font-bold ring-1 ring-[#c2a878]';
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
          <div className="pt-4 border-t border-[#83C5BE] flex flex-wrap items-center justify-between gap-4">
            {!isTestSubmitted ? (
              <button
                onClick={() => handleTestSubmit(activeTab === 'pre' ? 'pre_test' : 'post_test')}
                disabled={Object.keys(selectedAnswers).length < prePostQuestions.length}
                className="px-6 py-3 rounded-xl bg-[#006D77] hover:bg-[#E29578] text-white font-black text-xs transition-all shadow-md shadow-[#355834]/20 disabled:opacity-50 cursor-pointer border border-[#f59e0b]/50"
              >
                تسليم الإجابات ورصد الدرجة
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-[#006D77] border border-[#f59e0b]/50 p-4 rounded-xl text-xs font-bold text-white">
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span>تم رصد نتيجتك بنجاح: {scoreResult}%</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Engagement Survey Component (Full 56 items scale) */}
      {activeTab === 'engagement' && (
        <EngagementScaleView />
      )}

    </div>
  );
};
