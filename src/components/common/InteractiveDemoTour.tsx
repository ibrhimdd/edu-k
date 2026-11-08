// components/common/InteractiveDemoTour.tsx
import React, { useState } from 'react';
import { 
  Compass, 
  X, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Users, 
  User, 
  GraduationCap, 
  Code2, 
  Award, 
  BarChart3,
  HelpCircle,
  FileCheck2,
  Play
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface InteractiveDemoTourProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InteractiveDemoTour: React.FC<InteractiveDemoTourProps> = ({
  isOpen,
  onClose
}) => {
  const { switchRoleQuick, setActiveTab } = useApp();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const tourSteps = [
    {
      title: 'مرحباً بك في منصة المشروعات البرمجية التعليمية',
      subtitle: 'الرؤية البيداغوجية والتصميم التجريبي للبحث',
      icon: Sparkles,
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-white">
          <p>
            تعتمد المنصة على منهجية <strong>التعلم القائم على المشروعات (PBL)</strong> لتعليم وتنمية مهارات البرمجة، مع توفير بيئة تجريبية تقارن بين نمطين:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-[#EDF6F9] text-[#004D54] border border-[#E29578]/50 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#006D77]">
                <User className="w-4 h-4" />
                المجموعة التجريبية الأولى (فردي)
              </div>
              <p className="text-[11px] text-[#006D77]/80">
                يعمل الطالب بمفرده عبر الخطوات السبع لإنجاز المشروع، وبناء الخوارزميات واختبار الكود ذاتياً.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#EDF6F9] border border-[#83C5BE] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#004D54]">
                <Users className="w-4 h-4 text-[#006D77]" />
                المجموعة التجريبية الثانية (تشاركي)
              </div>
              <p className="text-[11px] text-[#006D77]/80">
                يعمل الطلاب في فرق عمل مع توزيع الأدوار المحددة (محلل، مصمم، مبرمج، مختبر وموثق) مع لوحة مهام ومحادثة تفاعلية.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'دورة تنفيذ المشروع البرمجي (7 خطوات)',
      subtitle: 'تدرج بيداغوجي محكم لحل المشكلات',
      icon: Code2,
      content: (
        <div className="space-y-2.5 text-xs text-white">
          <p>
            يمر كل مشروع إلكتروني بسلسلة من 7 مراحل متتالية تنمي التفكير الحسابي والمنطقي:
          </p>
          <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
            <div className="p-2 rounded-lg bg-[#EDF6F9] border border-[#83C5BE] text-[#004D54] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#006D77] text-white font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
              <div><strong className="text-[#004D54]">وصف المشكلة:</strong> قراءة المتطلبات والشروط والهدف النهائي.</div>
            </div>
            <div className="p-2 rounded-lg bg-[#EDF6F9] border border-[#83C5BE] text-[#004D54] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#006D77] text-white font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
              <div><strong className="text-[#004D54]">تحليل المشكلة:</strong> تحديد المدخلات، العمليات، والمخرجات بدقة.</div>
            </div>
            <div className="p-2 rounded-lg bg-[#EDF6F9] border border-[#83C5BE] text-[#004D54] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#006D77] text-white font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
              <div><strong className="text-[#004D54]">تصميم الحل:</strong> صياغة الخوارزمية وشبه الكود (Pseudocode).</div>
            </div>
            <div className="p-2 rounded-lg bg-[#EDF6F9] border border-[#83C5BE] text-[#004D54] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#006D77] text-white font-bold text-[10px] flex items-center justify-center shrink-0">4</span>
              <div><strong className="text-[#004D54]">كتابة الكود:</strong> استخدام محرر Monaco Editor المتقدم.</div>
            </div>
            <div className="p-2 rounded-lg bg-[#EDF6F9] border border-[#83C5BE] text-[#004D54] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#006D77] text-white font-bold text-[10px] flex items-center justify-center shrink-0">5</span>
              <div><strong className="text-[#004D54]">اختبار البرنامج:</strong> تشغيل حالات اختبار آلية تفاعلية.</div>
            </div>
            <div className="p-2 rounded-lg bg-[#EDF6F9] border border-[#83C5BE] text-[#004D54] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#006D77] text-white font-bold text-[10px] flex items-center justify-center shrink-0">6</span>
              <div><strong className="text-[#004D54]">رفع المشروع:</strong> تسليم النسخة النهائية لتقييم المعلم.</div>
            </div>
            <div className="p-2 rounded-lg bg-[#EDF6F9] border border-[#83C5BE] text-[#004D54] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#006D77] text-white font-bold text-[10px] flex items-center justify-center shrink-0">7</span>
              <div><strong className="text-[#004D54]">التغذية الراجعة:</strong> مراجعة بطاقة الـ Rubric وملاحظات المعلم.</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'بطاقة تقييم الأداء البرمجي (Rubric)',
      subtitle: '7 معايير علمية بـ 4 مستويات إتقان',
      icon: Award,
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-white">
          <p>
            تخضع جميع مشروعات الطلاب الفردية والتشاركية لتقييم موضوعي موحد عبر 7 معايير رئيسية:
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 bg-[#EDF6F9] text-[#004D54] rounded-lg border border-[#E29578]/50">🔍 تحليل المشكلة (15%)</div>
            <div className="p-2 bg-[#EDF6F9] text-[#004D54] rounded-lg border border-[#E29578]/50">📐 تصميم الخوارزمية (15%)</div>
            <div className="p-2 bg-[#EDF6F9] text-[#004D54] rounded-lg border border-[#E29578]/50">💻 صحة بناء الكود Syntax (15%)</div>
            <div className="p-2 bg-[#EDF6F9] text-[#004D54] rounded-lg border border-[#E29578]/50">🎯 صحة النتائج والمخرجات (20%)</div>
            <div className="p-2 bg-[#EDF6F9] text-[#004D54] rounded-lg border border-[#E29578]/50">⚡ كفاءة الكود ونظافته (10%)</div>
            <div className="p-2 bg-[#EDF6F9] text-[#004D54] rounded-lg border border-[#E29578]/50">🧪 حالات الاختبار الشاملة (15%)</div>
            <div className="p-2 bg-[#EDF6F9] text-[#004D54] rounded-lg border border-[#E29578]/50 col-span-2">📝 التوثيق والتعليقات البرمجية (10%)</div>
          </div>
        </div>
      )
    },
    {
      title: 'أدوات القياس والانخراط والتحليل الإحصائي (SPSS)',
      subtitle: 'بيانات بحثية جاهزة للتصدير والتحليل الأكاديمي',
      icon: BarChart3,
      content: (
        <div className="space-y-3 text-xs text-white">
          <p>
            تتضمن المنصة منظومة متكاملة لخدمة الباحث والمعلم:
          </p>
          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-[#EDF6F9] border border-[#83C5BE] text-[#004D54]">
              <span className="font-bold text-[#006D77] block">📋 الاختبار القبلي والبعدي:</span>
              <span className="text-[11px] text-[#006D77]/80">رصد درجة نمو المهارات البرمجية وحساب حجم الأثر (Effect Size).</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#EDF6F9] border border-[#83C5BE] text-[#004D54]">
              <span className="font-bold text-[#006D77] block">📈 مقياس الانخراط (3 أبعاد):</span>
              <span className="text-[11px] text-[#006D77]/80">قياس الانخراط السلوكي، المعرفي، والوجداني عبر مقياس ليكرت الخماسي.</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#EDF6F9] text-[#004D54] border border-[#E29578]/50">
              <span className="font-bold text-[#004D54] block">📊 تصدير البيانات بصيغة SPSS / Excel:</span>
              <span className="text-[11px] text-[#006D77]/80">تنزيل جدول البيانات البحثية المتكامل بنقرة زر مع حساب اختبارات الفروق (t-test).</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'جرّب الآن واستكشف المنصة بالأدوار المختلفة',
      subtitle: 'اختر الدور الذي ترغب في تجربته فوراً',
      icon: Compass,
      content: (
        <div className="space-y-4 text-xs text-white">
          <p>يمكنك التبديل بين الأدوار في أي وقت من القائمة العلوية:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              onClick={() => {
                switchRoleQuick('student_individual');
                setActiveTab('projects');
                onClose();
              }}
              className="p-3 rounded-xl bg-[#EDF6F9] hover:bg-[#EDF6F9] text-[#004D54] border border-[#E29578]/50 text-center space-y-1 transition-all cursor-pointer"
            >
              <User className="w-5 h-5 mx-auto text-[#006D77]" />
              <span className="font-black text-xs block text-[#004D54]">طالب (فردي)</span>
              <span className="text-[10px] text-[#91472F]">مشروعي والخطوات الـ 7</span>
            </button>

            <button
              onClick={() => {
                switchRoleQuick('student_collaborative');
                setActiveTab('projects');
                onClose();
              }}
              className="p-3 rounded-xl bg-[#EDF6F9] hover:bg-[#83C5BE] border border-[#83C5BE] text-[#004D54] text-center space-y-1 transition-all cursor-pointer"
            >
              <Users className="w-5 h-5 mx-auto text-[#006D77]" />
              <span className="font-black text-xs block text-[#004D54]">طالب (تشاركي)</span>
              <span className="text-[10px] text-[#91472F]">الأدوار وغرفة الفريق</span>
            </button>

            <button
              onClick={() => {
                switchRoleQuick('teacher_admin');
                setActiveTab('dashboard');
                onClose();
              }}
              className="p-3 rounded-xl bg-[#EDF6F9] hover:bg-[#83C5BE] text-[#004D54] border border-[#83C5BE] text-center space-y-1 transition-all cursor-pointer"
            >
              <GraduationCap className="w-5 h-5 mx-auto text-[#006D77]" />
              <span className="font-black text-xs block text-[#004D54]">معلم وباحث</span>
              <span className="text-[10px] text-[#91472F]">التقييم والتحليل الإحصائي</span>
            </button>
          </div>
        </div>
      )
    }
  ];

  const currentStep = tourSteps[currentStepIndex];
  const StepIcon = currentStep.icon;

  return (
    <div className="fixed inset-0 z-50 bg-[#003F46]/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#004D54] rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-[#83C5BE] text-white space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#83C5BE]/70 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#EDF6F9] text-[#004D54] border border-[#E29578]/50 flex items-center justify-center">
              <StepIcon className="w-5 h-5 text-[#006D77]" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#004D54] bg-[#EDF6F9] px-2 py-0.5 rounded-full border border-[#E29578]/50">
                خطوة {currentStepIndex + 1} من {tourSteps.length}
              </span>
              <h2 className="text-base font-extrabold text-white mt-0.5">
                {currentStep.title}
              </h2>
              <p className="text-[11px] text-[#FFD2C2]">{currentStep.subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#FFD2C2] hover:bg-[#006D77] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Body */}
        <div className="min-h-[240px]">
          {currentStep.content}
        </div>

        {/* Footer Navigation */}
        <div className="flex flex-col gap-3 pt-3 border-t border-[#83C5BE]">
          <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {tourSteps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStepIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentStepIndex
                    ? 'w-6 bg-[#E29578]'
                    : 'w-2 bg-[#83C5BE] hover:bg-[#E29578]'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStepIndex > 0 && (
              <button
                onClick={() => setCurrentStepIndex(prev => prev - 1)}
                className="px-3.5 py-2 rounded-xl border border-[#83C5BE] text-white hover:bg-[#006D77] font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>السابق</span>
              </button>
            )}

            {currentStepIndex < tourSteps.length - 1 ? (
              <button
                onClick={() => setCurrentStepIndex(prev => prev + 1)}
                className="px-4 py-2 rounded-xl bg-[#E29578] hover:bg-[#83C5BE] text-[#003F46] font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
              >
                <span>التالي</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-[#E29578] hover:bg-[#83C5BE] text-[#003F46] font-black text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>ابدأ التجربة الآن</span>
              </button>
            )}
          </div>
          </div>
          <p className="text-center text-[11px] text-[#BFE8E5]">تطوير: <span className="font-extrabold text-[#FFD2C2]">إبراهيم الخولي</span></p>
        </div>

      </div>
    </div>
  );
};
