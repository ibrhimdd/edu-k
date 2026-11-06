// components/common/AITutorWidget.tsx
import React, { useState } from 'react';
import { 
  Sparkles, 
  Bot, 
  HelpCircle, 
  Bug, 
  Award, 
  Cpu, 
  Send, 
  X, 
  Minimize2, 
  Maximize2,
  RefreshCw,
  Copy,
  Check,
  Volume2
} from 'lucide-react';
import { ProjectDefinition } from '../../types/schema';

interface AITutorWidgetProps {
  currentProject: ProjectDefinition;
  currentCode: string;
  studentRole?: string;
  experimentalGroup?: 'individual' | 'collaborative';
}

export const AITutorWidget: React.FC<AITutorWidgetProps> = ({
  currentProject,
  currentCode,
  studentRole = 'مبرمج',
  experimentalGroup = 'individual'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<'hint' | 'debug' | 'rubric' | 'explain'>('hint');
  const [userQuery, setUserQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const quickQuestions: Record<string, string[]> = {
    hint: [
      "كيف أبدأ التفكير في بناء الحل لهذا المشروع؟",
      "ما هي أفضل بنية بيانات مناسبة للمتطلبات؟",
      "كيف أربط بين المدخلات والشروط المطلوبة؟"
    ],
    debug: [
      "هل توجد أخطاء منطقية أو شروط ناقصة في الكود؟",
      "لماذا قد يفشل الكود مع القيم الحدية أو الصفرية؟",
      "كيف أتأكد من خلو الكود من التكرارات غير اللازمة؟"
    ],
    rubric: [
      "كيف أضمن الحصول على درجة كاملة في معيار صحة الكود؟",
      "ما هي شروط كتابة تعليقات توثيقية احترافية؟",
      "هل تصميم الخوارزمية يغطي جميع الشروط السبعة؟"
    ],
    explain: [
      "اشرح لي فكرة الخوارزمية بخطوات مبسطة كأنني مبتدئ.",
      "ما هو تسلسل تدفق البيانات (Data Flow) في هذا البرنامج؟",
      "كيف تساعدني المصفوفات والكائنات في تنظيم هذا الحل؟"
    ]
  };

  const handleAskAI = async (customText?: string) => {
    const questionToAsk = customText || userQuery;
    setIsLoading(true);
    setResponseMessage(null);

    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: activeMode,
          projectTitle: currentProject.title,
          problemStatement: currentProject.problemStatement,
          code: currentCode,
          userQuestion: questionToAsk,
          studentRole,
          experimentalGroup
        })
      });

      const data = await res.json();
      if (data.response) {
        setResponseMessage(data.response);
      } else if (data.fallback) {
        setResponseMessage(data.fallback);
      } else {
        setResponseMessage("💡 تلميح تعليمي: ابدأ بتحديد المتغيرات الأساسية وراجع شروط الحساب خطوة بخطوة.");
      }
    } catch (err) {
      // Offline fallback
      setResponseMessage("💡 **توجيه سقراطي:** راجع صياغة المتغيرات والشروط الحسابية، وتأكد من اختبار كافة الحالات الواردة في وصف المشروع.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!responseMessage) return;
    navigator.clipboard.writeText(responseMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!responseMessage || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const cleanText = responseMessage.replace(/[*#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ar-SA';
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            if (!responseMessage) handleAskAI();
          }}
          className="fixed bottom-6 left-6 z-40 bg-[#006D77] hover:bg-white text-[#006D77] p-3.5 rounded-2xl shadow-xl shadow-[#004D54]/30 border border-[#83C5BE]/40 flex items-center gap-2.5 transition-all transform hover:scale-105 cursor-pointer animate-in fade-in"
          title="المساعد البرمجي الذكي"
        >
          <div className="relative">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#006D77] rounded-full animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#006D77] rounded-full"></span>
          </div>
          <span className="text-xs font-black tracking-wide">الموجه الذكي (AI Tutor)</span>
          <span className="text-[10px] bg-white text-[#E29578] px-2 py-0.5 rounded-full border border-[#83C5BE]">
            دعم فوري
          </span>
        </button>
      )}

      {/* Floating Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 left-6 z-50 w-[95vw] sm:w-[460px] bg-white rounded-2xl shadow-2xl border border-[#83C5BE] text-[#006D77] flex flex-col max-h-[85vh] animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#006D77] to-[#006D77] text-white rounded-t-2xl border-b border-[#83C5BE] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#006D77] border border-[#83C5BE]/30 flex items-center justify-center">
                <Bot className="w-5 h-5 text-[#006D77]" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                  الموجه البرمجي السقراطي
                  <span className="text-[10px] font-normal px-2 py-0.2 rounded-full bg-[#006D77]/40 text-white border border-[#83C5BE]/30">
                    Gemini AI 3.7
                  </span>
                </h3>
                <p className="text-[10px] text-[#E29578]">توجيهات وتلميحات مبنية على معايير الـ Rubric</p>
              </div>
            </div>

            <button
              onClick={() => {
                if (isSpeaking) window.speechSynthesis.cancel();
                setIsOpen(false);
              }}
              className="p-1.5 rounded-lg text-[#E29578] hover:bg-[#006D77] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mode Selector Tabs */}
          <div className="p-2 bg-[#EDF6F9] border-b border-[#83C5BE] grid grid-cols-4 gap-1 text-[11px] font-bold">
            <button
              onClick={() => {
                setActiveMode('hint');
                handleAskAI();
              }}
              className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                activeMode === 'hint'
                  ? 'bg-[#006D77] text-white shadow-2xs'
                  : 'text-[#E29578] hover:bg-[#EDF6F9]'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>تلميح</span>
            </button>

            <button
              onClick={() => {
                setActiveMode('debug');
                handleAskAI();
              }}
              className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                activeMode === 'debug'
                  ? 'bg-[#006D77] text-white shadow-2xs'
                  : 'text-[#E29578] hover:bg-[#EDF6F9]'
              }`}
            >
              <Bug className="w-3.5 h-3.5" />
              <span>فحص الكود</span>
            </button>

            <button
              onClick={() => {
                setActiveMode('rubric');
                handleAskAI();
              }}
              className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                activeMode === 'rubric'
                  ? 'bg-[#006D77] text-white shadow-2xs'
                  : 'text-[#E29578] hover:bg-[#EDF6F9]'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>الـ Rubric</span>
            </button>

            <button
              onClick={() => {
                setActiveMode('explain');
                handleAskAI();
              }}
              className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                activeMode === 'explain'
                  ? 'bg-[#006D77] text-white shadow-2xs'
                  : 'text-[#E29578] hover:bg-[#EDF6F9]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>الخوارزمية</span>
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="p-3 bg-[#006D77] border-b border-[#83C5BE]">
            <p className="text-[10px] font-bold text-[#006D77] mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              أسئلة مقترحة سريعة:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {quickQuestions[activeMode].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskAI(q)}
                  className="text-[10px] text-right bg-white text-[#006D77] border border-[#E29578]/50 hover:border-[#83C5BE] hover:bg-[#006D77] px-2.5 py-1 rounded-md transition-all cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Response Body */}
          <div className="p-4 flex-1 overflow-y-auto space-y-3 text-xs min-h-[160px] max-h-[300px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-2 text-[#006D77]">
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span className="text-xs font-bold">جاري تحليل الكود وصياغة التوجيه السقراطي...</span>
              </div>
            ) : responseMessage ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-[#83C5BE]">
                  <span className="text-[10px] font-bold text-[#E29578]">
                    إرشادات الموجه لمشروع: {currentProject.title}
                  </span>
                  <div className="flex items-center gap-1">
                    {'speechSynthesis' in window && (
                      <button
                        onClick={handleSpeak}
                        className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                          isSpeaking ? 'text-white bg-[#006D77]' : 'text-[#E29578] hover:text-white'
                        }`}
                        title="قراءة صوتية"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={handleCopy}
                      className="p-1 rounded text-xs text-[#E29578] hover:text-white transition-colors cursor-pointer"
                      title="نسخ النص"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-[#006D77]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#EDF6F9] border border-[#83C5BE] text-[#006D77] whitespace-pre-wrap leading-relaxed font-sans text-xs">
                  {responseMessage}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-[#E29578] text-xs">
                انقر على أحد الأسئلة المقترحة أو اكتب سؤالك بالأسفل لبدء التوجيه.
              </div>
            )}
          </div>

          {/* User Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (userQuery.trim()) {
                handleAskAI();
                setUserQuery('');
              }
            }}
            className="p-3 bg-[#EDF6F9] rounded-b-2xl border-t border-[#83C5BE] flex items-center gap-2"
          >
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="اكتب سؤالك أو استفسارك للموجه الذكي..."
              className="flex-1 px-3 py-2 text-xs bg-white rounded-xl border border-[#83C5BE] focus:outline-hidden focus:ring-2 focus:ring-[#004D54]"
            />
            <button
              type="submit"
              disabled={isLoading || !userQuery.trim()}
              className="px-4 py-2 bg-[#006D77] hover:bg-white text-[#006D77] rounded-xl font-bold text-xs flex items-center gap-1.5 disabled:opacity-50 transition-colors cursor-pointer shrink-0 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>إرسال</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
};
