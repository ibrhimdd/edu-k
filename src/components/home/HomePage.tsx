// components/home/HomePage.tsx
import React from 'react';
import { 
  Code2, 
  Sparkles, 
  Layers, 
  Award, 
  Users, 
  User, 
  GraduationCap, 
  BookOpen, 
  Play, 
  PlayCircle,
  Video,
  ExternalLink,
  CheckCircle2, 
  FileCode2, 
  BarChart3, 
  Compass, 
  ArrowLeft, 
  Terminal, 
  CheckCircle, 
  ShieldCheck, 
  Cpu, 
  HelpCircle,
  FolderGit2,
  ListOrdered
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HomePageProps {
  onOpenTour: () => void;
  onOpenAuth: () => void;
  onOpenArch: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenTour,
  onOpenAuth,
  onOpenArch
}) => {
  const { 
    currentUser, 
    projects, 
    units, 
    setSelectedProjectId, 
    setSelectedUnitId, 
    setActiveTab, 
    switchRoleQuick 
  } = useApp();

  const handleLaunchProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setActiveTab('projects');
  };

  const handleOpenUnit = (unitId: string) => {
    setSelectedUnitId(unitId);
    setActiveTab('units');
  };

  return (
    <div className="space-y-10 pb-12">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#006D77] via-[#004D54]/40 to-[#006D77] text-white border border-[#83C5BE] p-8 sm:p-12 shadow-xl">
        
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#059669]/25 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#006D77]/10 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EDF6F9] border border-[#E29578]/50/50 text-[#E29578] text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#E29578]" />
            <span>بيئة التعلم الإلكترونية القائمة على المشروعات (EduCode PBL)</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight sm:leading-snug text-white">
            تعلّم البرمجة وحل المشكلات الواقعية
            <br />
            <span className="text-[#E29578]">بمنهجية المشروعات المتكاملة والذكاء الاصطناعي</span>
          </h1>

          <p className="text-sm sm:text-base text-white/90 max-w-2xl mx-auto leading-relaxed">
            منصة تعليمية متطورة تدعم نمطي <strong>التعلم الفردي الذاتي</strong> و<strong>التعلم التشاركي القائم على الأدوار</strong>، مع محرر أكواد متقدم (Python / JS)، اختبارات آلية، تقييم موضوعي موحد (Rubric)، ومعلم سقراطي ذكي.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={() => {
                setSelectedProjectId('project_1');
                setActiveTab('projects');
              }}
              className="px-6 py-3.5 rounded-2xl bg-[#006D77] hover:bg-[#E29578] text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#10b981]/25 transition-all hover:scale-102 cursor-pointer border border-[#34d399]/40"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>ابدأ البرمجة وإنجاز المشروعات</span>
            </button>

            <button
              onClick={() => setActiveTab('units')}
              className="px-5 py-3.5 rounded-2xl bg-[#EDF6F9] hover:bg-[#006D77] text-[#E29578] hover:text-[#006D77] border border-[#83C5BE] font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#E29578]" />
              <span>تصفح الوحدات التعليمية</span>
            </button>

            <button
              onClick={onOpenTour}
              className="px-5 py-3.5 rounded-2xl bg-white hover:bg-[#006D77] text-[#006D77] border border-[#E29578]/50/40 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#E29578]" />
              <span>دليل وجولة المنصة</span>
            </button>
          </div>

          {/* Current User Bar indicator */}
          <div className="pt-4 flex items-center justify-center gap-2 text-xs text-[#E29578]">
            <span>مرحباً بك، <strong className="text-white">{currentUser.name}</strong></span>
            <span>•</span>
            <button 
              onClick={onOpenAuth}
              className="underline font-bold text-[#E29578] hover:text-white transition-colors cursor-pointer"
            >
              إدارة الحسابات
            </button>
          </div>

        </div>
      </section>

      {/* 2. LIVE PLATFORM METRICS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#83C5BE] shadow-md text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-[#006D77] text-[#E29578] flex items-center justify-center mx-auto mb-2 font-bold border border-[#83C5BE]">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#006D77]">4 مشروعات</div>
          <p className="text-xs text-[#1F2937] font-semibold">برمجية تطبيقية واقعية متدرجة</p>
        </div>

        <div 
          onClick={() => setActiveTab('units')}
          className="bg-white p-5 rounded-2xl border border-[#83C5BE] hover:border-[#E29578]/50 transition-colors shadow-md text-center space-y-1 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-[#006D77] text-[#E29578] flex items-center justify-center mx-auto mb-2 font-bold border border-[#83C5BE]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#006D77]">{units?.length || 7} وحدات</div>
          <p className="text-xs text-[#1F2937] font-semibold">مع دورة مرئية تطبيقية (82 درساً)</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#83C5BE] shadow-md text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-[#006D77] text-[#E29578] flex items-center justify-center mx-auto mb-2 font-bold border border-[#83C5BE]">
            <Award className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#006D77]">7 معايير Rubric</div>
          <p className="text-xs text-[#1F2937] font-semibold">تقييم علمي بـ 4 مستويات إتقان</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#83C5BE] shadow-md text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-[#006D77] text-[#E29578] flex items-center justify-center mx-auto mb-2 font-bold border border-[#83C5BE]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#006D77]">معلم سقراطي AI</div>
          <p className="text-xs text-[#1F2937] font-semibold">توجيه وتلميحات دون إعطاء الحل المباشر</p>
        </div>
      </section>

      {/* Featured Video Course Banner */}
      <section className="bg-gradient-to-r from-[#006D77] via-[#004D54] to-[#006D77] rounded-3xl p-6 sm:p-7 border border-[#83C5BE] text-white shadow-lg shadow-[#006D77]/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#EDF6F9] text-[#006D77] flex items-center justify-center shrink-0 shadow-lg shadow-black/20 border border-[#E29578]/50/40">
              <PlayCircle className="w-7 h-7 sm:w-8 sm:h-8 text-[#E29578]" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EDF6F9] text-[#91472F] border border-[#E29578]/50/40">
                  دورة مرئية معتمدة مدمجة
                </span>
                <span className="text-xs text-white/90">
                  تطبيق عملي خطوة بخطوة لكل درس
                </span>
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                دورة تعلم لغة البرمجة بايثون من البداية
              </h3>
              <p className="text-xs text-white/90 max-w-xl leading-relaxed">
                سلسلة فيديوهات شاملة (82 درساً) مرتبطة مباشرة بمحتوى المقرر: من تحميل بيئة IDLE وجملة الطباعة والتعليقات، إلى الجمل الشرطية وحلقات التكرار والقوائم والدوال والمشروعات.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0 flex-wrap">
            <button
              onClick={() => setActiveTab('units')}
              className="px-4 py-2.5 rounded-xl bg-[#EDF6F9] hover:bg-white text-[#E29578] hover:text-[#006D77] border border-[#E29578]/50/60 font-extrabold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Video className="w-4 h-4 text-[#E29578]" />
              <span>مشاهدة الفيديوهات بالوحدات</span>
            </button>
            <a
              href="https://www.youtube.com/watch?v=-1-RegdBsGo&list=PLB6BdpR28cia04a7VTzRDFckmMB6Aq7Ak"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#EDF6F9] hover:bg-white border border-[#E29578]/50/40 text-[#E29578] hover:text-[#006D77] font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#E29578]" />
              <span>قائمة يوتيوب الكاملة</span>
            </a>
          </div>
        </div>
      </section>

      {/* 3. PRACTICAL REAL-WORLD PROJECTS SHOWCASE */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#83C5BE] pb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#004D54] flex items-center gap-2">
              <Code2 className="w-5 h-5 text-[#E29578]" />
              المشروعات البرمجية التطبيقية (Projects Curriculum)
            </h2>
            <p className="text-xs text-[#64748B]">
              مشروعات عملية تهدف لتنمية التفكير الحسابي ومهارات البرمجة الفعلية
            </p>
          </div>
          
          <button
            onClick={() => setActiveTab('projects')}
            className="text-xs font-bold text-[#E29578] hover:text-white flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>فتح بيئة البرمجة</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(projects || []).map((proj, idx) => {
            return (
              <div 
                key={proj.id}
                className="bg-white rounded-2xl border border-[#83C5BE] p-5 hover:border-[#E29578]/50 hover:shadow-lg transition-all space-y-3.5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#006D77] text-white border border-[#83C5BE]">
                      مشروع {idx + 1}
                    </span>
                    <span className="text-[11px] font-bold text-[#E29578]">
                      {(proj.language || 'JavaScript').toUpperCase()} • {proj.difficulty || 'مستوى مبتدئ'}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-[#004D54]">
                    {proj.title}
                  </h3>

                  <p className="text-xs text-[#006D77] leading-relaxed line-clamp-2">
                    {proj.subtitle}
                  </p>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-[#83C5BE]">
                  <div className="flex items-center justify-between text-xs text-[#E29578]">
                    <span>عدد حالات الاختبار: <strong className="text-[#004D54]">{proj.testCases?.length || 0} حالات</strong></span>
                    <span>المدة المقدرة: <strong className="text-[#004D54]">{proj.estimatedHours || 3} ساعات</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLaunchProject(proj.id)}
                      className="flex-1 py-2.5 rounded-xl bg-[#006D77] hover:bg-[#004D54] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#E29578]/50/50"
                    >
                      <Terminal className="w-3.5 h-3.5 text-[#E29578]" />
                      <span>بدء البرمجة في المحرر</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. LEARNING METHODOLOGY (7-STEP PBL CYCLE) */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#83C5BE] shadow-md space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-xs font-bold text-white bg-[#006D77] px-3 py-1 rounded-full border border-[#E29578]/50/50">
            النموذج البيداغوجي المعتمد
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#004D54]">
            دورة إنجاز المشروع البرمجي في 7 خطوات متتالية
          </h2>
          <p className="text-xs text-[#64748B]">
            تدرج منهجي ينقل الطالب من مجرد كتابة الكود إلى فهم وتحليل المشكلة وتصميم الخوارزميات واختبارها
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-[#EDF6F9] border border-[#83C5BE] space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-[#006D77] text-white text-xs font-bold flex items-center justify-center border border-[#E29578]/50/50">1</span>
            <h4 className="font-extrabold text-xs text-[#004D54]">وصف المشكلة</h4>
            <p className="text-[11px] text-[#006D77] leading-relaxed">استيعاب السيناريو الحقيقي، الشروط، والمتطلبات البرمجية المحددة.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#EDF6F9] border border-[#83C5BE] space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-[#006D77] text-white text-xs font-bold flex items-center justify-center border border-[#E29578]/50/50">2</span>
            <h4 className="font-extrabold text-xs text-[#004D54]">تحليل المشكلة</h4>
            <p className="text-[11px] text-[#006D77] leading-relaxed">تفكيك المسألة وتحديد المدخلات والعمليات الحسابية والمخرجات.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#EDF6F9] border border-[#83C5BE] space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-[#006D77] text-white text-xs font-bold flex items-center justify-center border border-[#E29578]/50/50">3</span>
            <h4 className="font-extrabold text-xs text-[#004D54]">تصميم الحل</h4>
            <p className="text-[11px] text-[#006D77] leading-relaxed">رسم الخوارزمية، المخطط الانسيابي وشبه الكود (Pseudocode).</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#EDF6F9] border border-[#83C5BE] space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-[#006D77] text-white text-xs font-bold flex items-center justify-center border border-[#E29578]/50/50">4</span>
            <h4 className="font-extrabold text-xs text-[#004D54]">كتابة الكود</h4>
            <p className="text-[11px] text-[#006D77] leading-relaxed">البرمجة بلغة Python/JS عبر محرر Monaco Editor المتقدم.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#EDF6F9] border border-[#83C5BE] space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-[#006D77] text-white text-xs font-bold flex items-center justify-center border border-[#E29578]/50/50">5</span>
            <h4 className="font-extrabold text-xs text-[#004D54]">اختبار البرنامج</h4>
            <p className="text-[11px] text-[#006D77] leading-relaxed">تشغيل حالات اختبار آلية وتصحيح الأخطاء المنطقية والتركيبية.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#EDF6F9] border border-[#83C5BE] space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-[#006D77] text-white text-xs font-bold flex items-center justify-center border border-[#E29578]/50/50">6</span>
            <h4 className="font-extrabold text-xs text-[#004D54]">تسليم المشروع</h4>
            <p className="text-[11px] text-[#006D77] leading-relaxed">رفع النسخة النهائية مع كافة التقارير ليقوم المعلم بمراجعتها.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#EDF6F9] border border-[#E29578]/50 space-y-1.5 col-span-1 sm:col-span-2">
            <span className="w-6 h-6 rounded-full bg-[#006D77] text-white text-xs font-bold flex items-center justify-center border border-[#E29578]/50/50">7</span>
            <h4 className="font-extrabold text-xs text-[#004D54]">التقييم والتغذية الراجعة الموضوعية (Rubric)</h4>
            <p className="text-[11px] text-[#006D77] leading-relaxed">تلقي التقييم وفق 7 معايير علمية دقيقة مع ملاحظات تفصيلية على أسطر الكود.</p>
          </div>
        </div>
      </section>

      {/* 5. TWO EXPERIMENTAL PATHWAYS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Individual Pathway Card */}
        <div className="bg-white p-6 rounded-3xl border border-[#83C5BE] shadow-md space-y-4 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#006D77] text-[#E29578] flex items-center justify-center border border-[#E29578]/50/40">
              <User className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-white bg-[#006D77] px-2 py-0.5 rounded-full border border-[#E29578]/50/40">
                المسار الفردي الذاتي
              </span>
              <h3 className="font-black text-base text-[#004D54] mt-0.5">التعلم القائم على المشروعات الفردي</h3>
            </div>
          </div>

          <p className="text-xs text-[#006D77] leading-relaxed">
            يمر الطالب بجميع خطوات المشروع بنفسه، مما ينمي مهارات حل المشكلات الفردية والتصحيح الذاتي للأخطاء.
          </p>

          <ul className="space-y-1.5 text-xs text-[#006D77]">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#E29578]" />
              <span>مساحة عمل خاصة لحل المشكلة وتحليلها خطوة بخطوة.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#E29578]" />
              <span>مساعد سقراطي ذكي يقدم التلميحات الموجهة.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#E29578]" />
              <span>محرر كود واختبارات فورية لحساب النتائج.</span>
            </li>
          </ul>

          <button
            onClick={() => {
              switchRoleQuick('student_individual');
              setActiveTab('projects');
            }}
            className="w-full py-2.5 rounded-xl bg-[#006D77] hover:bg-white border border-[#E29578]/50/50 text-[#006D77] font-bold text-xs transition-all cursor-pointer"
          >
            تصفح نمط التعلم الفردي
          </button>
        </div>

        {/* Collaborative Pathway Card */}
        <div className="bg-white p-6 rounded-3xl border border-[#83C5BE] shadow-md space-y-4 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#006D77] text-[#E29578] flex items-center justify-center border border-[#E29578]/50/40">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#E29578] bg-[#006D77] px-2 py-0.5 rounded-full border border-[#E29578]/50/40">
                المسار التشاركي القائم على الأدوار
              </span>
              <h3 className="font-black text-base text-[#004D54] mt-0.5">التعلم القائم على المشروعات التشاركي</h3>
            </div>
          </div>

          <p className="text-xs text-[#006D77] leading-relaxed">
            يعمل الطلاب في فرق عمل متناسقة مع توزيع الأدوار المحددة (محلل، مصمم، مبرمج، مختبر وموثق).
          </p>

          <ul className="space-y-1.5 text-xs text-[#006D77]">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#E29578]" />
              <span>غرفة مناقشة وشات تفاعلي فوري بين أعضاء الفريق.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#E29578]" />
              <span>لوحة مهام تفاعلية لتوزيع المهام وإدارتها.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#E29578]" />
              <span>تسليم مشترك للمشروع وتقييم أداء كل عضو ودوره.</span>
            </li>
          </ul>

          <button
            onClick={() => {
              switchRoleQuick('student_collaborative');
              setActiveTab('projects');
            }}
            className="w-full py-2.5 rounded-xl bg-[#006D77] hover:bg-white border border-[#E29578]/50/50 text-[#006D77] font-bold text-xs transition-all cursor-pointer"
          >
            تصفح نمط التعلم التشاركي
          </button>
        </div>

      </section>

      {/* 6. TEACHER & RESEARCHER SUITE SHORTCUT */}
      <section className="bg-gradient-to-r from-[#006D77] via-[#004D54] to-[#006D77] text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-[#83C5BE] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-right">
          <span className="text-xs font-bold text-[#E29578] bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
            لوحة المعلم والباحث
          </span>
          <h3 className="text-xl font-black text-white">
            منظومة التقييم والتحليل الإحصائي الأكاديمي (SPSS Export)
          </h3>
          <p className="text-xs text-white/90 max-w-xl">
            متابعة إنجاز الطلاب، تقييم بطاقة الـ Rubric، رصد مؤشرات الانخراط، وحساب اختبارات الفروق (t-test) مع تصدير البيانات بنقرة زر.
          </p>
        </div>

        <button
          onClick={() => {
            switchRoleQuick('teacher_admin');
            setActiveTab('dashboard');
          }}
          className="px-6 py-3 rounded-2xl bg-[#E29578] hover:bg-[#91472F] text-white font-black text-xs sm:text-sm shrink-0 shadow-md transition-all hover:scale-102 cursor-pointer flex items-center gap-2"
        >
          <GraduationCap className="w-4 h-4 text-white" />
          <span>الدخول كمعلم / باحث</span>
        </button>
      </section>

      {/* 7. ACADEMIC SUPERVISION & DEVELOPER CREDITS */}
      <section className="bg-white rounded-3xl p-6 border border-[#83C5BE] shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#1F2937]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#006D77] flex items-center justify-center text-white border border-[#E29578]/50/30">
            <GraduationCap className="w-5 h-5 text-[#E29578]" />
          </div>
          <div>
            <span className="text-[10px] text-[#E29578] font-bold block">الإشراف الأكاديمي والبحثي:</span>
            <strong className="text-[#004D54] text-sm">المشرف العام: د. محمد رضوان أبو حشيش</strong>
          </div>
        </div>

        <div className="flex items-center gap-3 text-center sm:text-left">
          <div>
            <span className="text-[10px] text-[#E29578] font-bold block">التطوير والبرمجة:</span>
            <span className="text-[#1F2937] font-bold">جميع الحقوق محفوظة للدفلبر <strong className="text-[#91472F]">إبراهيم الخولي</strong> © 2026</span>
          </div>
        </div>
      </section>

    </div>
  );
};
