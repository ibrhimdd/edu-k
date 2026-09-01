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
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#1C2E24] via-[#172E1E] to-[#122417] text-white border border-[#2D5A3D] p-8 sm:p-12 shadow-xl">
        
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#2D5A3D]/20 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#A2673B]/15 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2D5A3D]/40 border border-[#48825C] text-[#A3D9B1] text-xs font-bold backdrop-blur-md shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#86E49E]" />
            <span>بيئة التعلم الإلكترونية القائمة على المشروعات (EduCode PBL)</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight sm:leading-snug text-white">
            تعلّم البرمجة وحل المشكلات الواقعية
            <br />
            <span className="text-[#86E49E]">بمنهجية المشروعات المتكاملة والذكاء الاصطناعي</span>
          </h1>

          <p className="text-sm sm:text-base text-[#D0E2D5] max-w-2xl mx-auto leading-relaxed">
            منصة تعليمية متطورة تدعم نمطي <strong>التعلم الفردي الذاتي</strong> و<strong>التعلم التشاركي القائم على الأدوار</strong>، مع محرر أكواد متقدم (Python / JS)، اختبارات آلية، تقييم موضوعي موحد (Rubric)، ومعلم سقراطي ذكي.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={() => {
                setSelectedProjectId('project_1');
                setActiveTab('projects');
              }}
              className="px-6 py-3.5 rounded-2xl bg-[#86E49E] hover:bg-[#72D68C] text-[#112417] font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#86E49E]/20 transition-all hover:scale-102 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>ابدأ البرمجة وإنجاز المشروعات</span>
            </button>

            <button
              onClick={() => setActiveTab('units')}
              className="px-5 py-3.5 rounded-2xl bg-[#284234] hover:bg-[#345543] text-white border border-[#48825C] font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#A3D9B1]" />
              <span>تصفح الوحدات التعليمية</span>
            </button>

            <button
              onClick={onOpenTour}
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer backdrop-blur-xs"
            >
              <Compass className="w-4 h-4 text-[#E8DCCB]" />
              <span>دليل وجولة المنصة</span>
            </button>
          </div>

          {/* Current User Bar indicator */}
          <div className="pt-4 flex items-center justify-center gap-2 text-xs text-[#A3D9B1]">
            <span>مرحباً بك، <strong>{currentUser.name}</strong></span>
            <span>•</span>
            <button 
              onClick={onOpenAuth}
              className="underline font-bold hover:text-white transition-colors cursor-pointer"
            >
              تبديل أو تسجيل حساب آخر
            </button>
          </div>

        </div>
      </section>

      {/* 2. LIVE PLATFORM METRICS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E5EAE5] shadow-xs text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-[#EBF2ED] text-[#2D5A3D] flex items-center justify-center mx-auto mb-2 font-bold">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#1A1C1E]">4 مشروعات</div>
          <p className="text-xs text-[#667085]">برمجية تطبيقية واقعية متدرجة</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5EAE5] shadow-xs text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-[#EBF2ED] text-[#2D5A3D] flex items-center justify-center mx-auto mb-2 font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#1A1C1E]">4 وحدات</div>
          <p className="text-xs text-[#667085]">شاملة للأصول البرمجية والخوارزميات</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5EAE5] shadow-xs text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-[#FDF6EC] text-[#A2673B] flex items-center justify-center mx-auto mb-2 font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#1A1C1E]">7 معايير Rubric</div>
          <p className="text-xs text-[#667085]">تقييم علمي بـ 4 مستويات إتقان</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5EAE5] shadow-xs text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-[#F0F5F1] text-[#2D5A3D] flex items-center justify-center mx-auto mb-2 font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#1A1C1E]">معلم سقراطي AI</div>
          <p className="text-xs text-[#667085]">توجيه وتلميحات دون إعطاء الحل المباشر</p>
        </div>
      </section>

      {/* 3. PRACTICAL REAL-WORLD PROJECTS SHOWCASE */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5EAE5] pb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#1A1C1E] flex items-center gap-2">
              <Code2 className="w-5 h-5 text-[#2D5A3D]" />
              المشروعات البرمجية التطبيقية (Projects Curriculum)
            </h2>
            <p className="text-xs text-[#667085]">
              مشروعات عملية تهدف لتنمية التفكير الحسابي ومهارات البرمجة الفعلية
            </p>
          </div>
          
          <button
            onClick={() => setActiveTab('projects')}
            className="text-xs font-bold text-[#2D5A3D] hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>فتح بيئة البرمجة</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj, idx) => {
            return (
              <div 
                key={proj.id}
                className="bg-white rounded-2xl border border-[#E5EAE5] p-5 hover:border-[#86E49E] hover:shadow-md transition-all space-y-3.5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#EBF2ED] text-[#2D5A3D] border border-[#C8DEC3]">
                      مشروع {idx + 1}
                    </span>
                    <span className="text-[11px] font-bold text-[#667085]">
                      {(proj.language || 'JavaScript').toUpperCase()} • {proj.difficulty || 'مستوى مبتدئ'}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-[#1A1C1E]">
                    {proj.title}
                  </h3>

                  <p className="text-xs text-[#4A5568] leading-relaxed line-clamp-2">
                    {proj.subtitle}
                  </p>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-[#F0F2F0]">
                  <div className="flex items-center justify-between text-xs text-[#667085]">
                    <span>عدد حالات الاختبار: <strong>{proj.testCases?.length || 0} حالات</strong></span>
                    <span>المدة المقدرة: <strong>{proj.estimatedHours || 3} ساعات</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLaunchProject(proj.id)}
                      className="flex-1 py-2.5 rounded-xl bg-[#2D5A3D] hover:bg-[#234730] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Terminal className="w-3.5 h-3.5" />
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
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5EAE5] shadow-xs space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-xs font-bold text-[#2D5A3D] bg-[#EBF2ED] px-3 py-1 rounded-full border border-[#C8DEC3]">
            النموذج البيداغوجي المعتمد
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#1A1C1E]">
            دورة إنجاز المشروع البرمجي في 7 خطوات متتالية
          </h2>
          <p className="text-xs text-[#667085]">
            تدرج منهجي ينقل الطالب من مجرد كتابة الكود إلى فهم وتحليل المشكلة وتصميم الخوارزميات واختبارها
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#E5EAE5] space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-[#2D5A3D] text-white text-xs font-bold flex items-center justify-center">1</span>
            <h4 className="font-extrabold text-xs text-[#1A1C1E]">وصف المشكلة</h4>
            <p className="text-[11px] text-[#4A5568] leading-relaxed">استيعاب السيناريو الحقيقي، الشروط، والمتطلبات البرمجية المحددة.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#E5EAE5] space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-[#2D5A3D] text-white text-xs font-bold flex items-center justify-center">2</span>
            <h4 className="font-extrabold text-xs text-[#1A1C1E]">تحليل المشكلة</h4>
            <p className="text-[11px] text-[#4A5568] leading-relaxed">تفكيك المسألة وتحديد المدخلات والعمليات الحسابية والمخرجات.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#E5EAE5] space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-[#2D5A3D] text-white text-xs font-bold flex items-center justify-center">3</span>
            <h4 className="font-extrabold text-xs text-[#1A1C1E]">تصميم الحل</h4>
            <p className="text-[11px] text-[#4A5568] leading-relaxed">رسم الخوارزمية، المخطط الانسيابي وشبه الكود (Pseudocode).</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#E5EAE5] space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-[#2D5A3D] text-white text-xs font-bold flex items-center justify-center">4</span>
            <h4 className="font-extrabold text-xs text-[#1A1C1E]">كتابة الكود</h4>
            <p className="text-[11px] text-[#4A5568] leading-relaxed">البرمجة بلغة Python/JS عبر محرر Monaco Editor المتقدم.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#E5EAE5] space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-[#2D5A3D] text-white text-xs font-bold flex items-center justify-center">5</span>
            <h4 className="font-extrabold text-xs text-[#1A1C1E]">اختبار البرنامج</h4>
            <p className="text-[11px] text-[#4A5568] leading-relaxed">تشغيل حالات اختبار آلية وتصحيح الأخطاء المنطقية والتركيبية.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#E5EAE5] space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-[#2D5A3D] text-white text-xs font-bold flex items-center justify-center">6</span>
            <h4 className="font-extrabold text-xs text-[#1A1C1E]">تسليم المشروع</h4>
            <p className="text-[11px] text-[#4A5568] leading-relaxed">رفع النسخة النهائية مع كافة التقارير ليقوم المعلم بمراجعتها.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F0F5F1] border border-[#C8DEC3] space-y-1.5 col-span-1 sm:col-span-2">
            <span className="w-6 h-6 rounded-full bg-[#2D5A3D] text-white text-xs font-bold flex items-center justify-center">7</span>
            <h4 className="font-extrabold text-xs text-[#172E1E]">التقييم والتغذية الراجعة الموضوعية (Rubric)</h4>
            <p className="text-[11px] text-[#4A5568] leading-relaxed">تلقي التقييم وفق 7 معايير علمية دقيقة مع ملاحظات تفصيلية على أسطر الكود.</p>
          </div>
        </div>
      </section>

      {/* 5. TWO EXPERIMENTAL PATHWAYS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Individual Pathway Card */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5EAE5] shadow-xs space-y-4 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF2ED] text-[#2D5A3D] flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#2D5A3D] bg-[#F0F5F1] px-2 py-0.5 rounded-full border border-[#C8DEC3]">
                المسار الفردي الذاتي
              </span>
              <h3 className="font-black text-base text-[#1A1C1E] mt-0.5">التعلم القائم على المشروعات الفردي</h3>
            </div>
          </div>

          <p className="text-xs text-[#4A5568] leading-relaxed">
            يمر الطالب بجميع خطوات المشروع بنفسه، مما ينمي مهارات حل المشكلات الفردية والتصحيح الذاتي للأخطاء.
          </p>

          <ul className="space-y-1.5 text-xs text-[#2D312E]">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2D5A3D]" />
              <span>مساحة عمل خاصة لحل المشكلة وتحليلها خطوة بخطوة.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2D5A3D]" />
              <span>مساعد سقراطي ذكي يقدم التلميحات الموجهة.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2D5A3D]" />
              <span>محرر كود واختبارات فورية لحساب النتائج.</span>
            </li>
          </ul>

          <button
            onClick={() => {
              switchRoleQuick('student_individual');
              setActiveTab('projects');
            }}
            className="w-full py-2.5 rounded-xl bg-[#F0F5F1] hover:bg-[#E2EBE4] border border-[#C8DEC3] text-[#172E1E] font-bold text-xs transition-all cursor-pointer"
          >
            تجربة نمط التعلم الفردي
          </button>
        </div>

        {/* Collaborative Pathway Card */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5EAE5] shadow-xs space-y-4 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FDF6EC] text-[#A2673B] flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#A2673B] bg-[#FDF6EC] px-2 py-0.5 rounded-full border border-[#E8DCCB]">
                المسار التشاركي القائم على الأدوار
              </span>
              <h3 className="font-black text-base text-[#1A1C1E] mt-0.5">التعلم القائم على المشروعات التشاركي</h3>
            </div>
          </div>

          <p className="text-xs text-[#4A5568] leading-relaxed">
            يعمل الطلاب في فرق عمل متناسقة مع توزيع الأدوار المحددة (محلل، مصمم، مبرمج، مختبر وموثق).
          </p>

          <ul className="space-y-1.5 text-xs text-[#2D312E]">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#A2673B]" />
              <span>غرفة مناقشة وشات تفاعلي فوري بين أعضاء الفريق.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#A2673B]" />
              <span>لوحة مهام تفاعلية لتوزيع المهام وإدارتها.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#A2673B]" />
              <span>تسليم مشترك للمشروع وتقييم أداء كل عضو ودوره.</span>
            </li>
          </ul>

          <button
            onClick={() => {
              switchRoleQuick('student_collaborative');
              setActiveTab('projects');
            }}
            className="w-full py-2.5 rounded-xl bg-[#FDF6EC] hover:bg-[#F7EBD9] border border-[#E8DCCB] text-[#4A2E18] font-bold text-xs transition-all cursor-pointer"
          >
            تجربة نمط التعلم التشاركي
          </button>
        </div>

      </section>

      {/* 6. TEACHER & RESEARCHER SUITE SHORTCUT */}
      <section className="bg-gradient-to-r from-[#172E1E] to-[#2D5A3D] text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-right">
          <span className="text-xs font-bold text-[#A3D9B1] bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
            لوحة المعلم والباحث
          </span>
          <h3 className="text-xl font-black">
            منظومة التقييم والتحليل الإحصائي الأكاديمي (SPSS Export)
          </h3>
          <p className="text-xs text-[#D0E2D5] max-w-xl">
            متابعة إنجاز الطلاب، تقييم بطاقة الـ Rubric، رصد مؤشرات الانخراط، وحساب اختبارات الفروق (t-test) مع تصدير البيانات بنقرة زر.
          </p>
        </div>

        <button
          onClick={() => {
            switchRoleQuick('teacher_admin');
            setActiveTab('dashboard');
          }}
          className="px-6 py-3 rounded-2xl bg-white hover:bg-[#F8F9FA] text-[#172E1E] font-black text-xs sm:text-sm shrink-0 shadow-md transition-all hover:scale-102 cursor-pointer flex items-center gap-2"
        >
          <GraduationCap className="w-4 h-4 text-[#2D5A3D]" />
          <span>الدخول كمعلم / باحث</span>
        </button>
      </section>

    </div>
  );
};
