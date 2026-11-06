// components/student/StudentDashboard.tsx
import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BookOpen, 
  FolderGit2, 
  CheckCircle2, 
  Clock, 
  Award, 
  Users, 
  User, 
  ArrowLeft, 
  Sparkles, 
  FileText, 
  AlertCircle,
  TrendingUp,
  Star,
  ChevronLeft
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { 
    currentUser, 
    projects, 
    units, 
    submissions, 
    getCurrentTeam, 
    setActiveTab, 
    setSelectedProjectId,
    setSelectedUnitId 
  } = useApp();

  const isCollaborative = currentUser.role === 'student_collaborative';
  const team = getCurrentTeam();
  const currentProject = projects.find(p => p.id === (team?.currentProjectId || 'project_3')) || projects[0];

  const roleTitles: Record<string, { title: string; desc: string; icon: string }> = {
    analyst: { title: 'محلل المشكلة (Problem Analyst)', desc: 'مسؤول عن قراءة المشكلة، تحديد المدخلات والمخرجات، وصياغة الشروط.', icon: '🔍' },
    designer: { title: 'مصمم الحل (Solution Designer)', desc: 'مسؤول عن بناء الخوارزمية، المخططات الانسيابية، وهيكلة الدوال.', icon: '📐' },
    coder: { title: 'كاتب الكود (Lead Programmer)', desc: 'مسؤول عن كتابة الكود البرمجي في محرر Monaco Editor وتطبيق القواعد.', icon: '💻' },
    tester: { title: 'المختبر والتوثيق (Tester & Documenter)', desc: 'مسؤول عن تجهيز حالات الاختبار، التأكد من خلو الكود من الأخطاء، وكتابة التوثيق.', icon: '🧪' }
  };

  const currentRoleInfo = currentUser.teamRole ? roleTitles[currentUser.teamRole] : undefined;

  // Filter student submissions
  const userSubmissions = submissions.filter(s => 
    isCollaborative && currentUser.teamId ? s.teamId === currentUser.teamId : s.studentId === currentUser.id
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Hero Welcome & Identity Banner */}
      <div className="bg-gradient-to-r from-[#006D77] via-[#006D77] to-[#006D77] text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-[#83C5BE] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#059669]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                isCollaborative 
                  ? 'bg-[#91472F]/30 text-[#E29578] border border-[#91472F]/40' 
                  : 'bg-[#006D77]/40 text-white border border-[#83C5BE]/50'
              }`}>
                {isCollaborative ? <Users className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                {isCollaborative ? 'المجموعة التجريبية الثانية (التعلم التشاركي)' : 'المجموعة التجريبية الأولى (التعلم الفردي)'}
              </span>
              <span className="text-xs text-[#E29578]">الفصل الدراسي الأول</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              مرحباً بك، {currentUser.name} 👋
            </h1>
            <p className="text-sm text-[#E29578] max-w-2xl leading-relaxed">
              أنت في بيئة التعلم القائمة على المشروعات لتعليم البرمجة. تقدم خطوة بخطوة من خلال دراسة الوحدات وتنفيذ المشروعات العملية.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setSelectedProjectId(currentProject.id);
                setActiveTab('projects');
              }}
              className="px-5 py-3 rounded-xl bg-[#006D77] hover:bg-white text-[#006D77] font-bold text-sm transition-all shadow-md shadow-[#006D77]/40 flex items-center gap-2 cursor-pointer"
            >
              <FolderGit2 className="w-4 h-4" />
              <span>متابعة {isCollaborative ? 'مشروع المجموعة' : 'مشروعي الحالي'}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('units')}
              className="px-4 py-3 rounded-xl bg-white hover:bg-white text-[#006D77] font-semibold text-sm border border-[#83C5BE] transition-all flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>الوحدات التعليمية</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Metrics Dashboard (Matching PDF Section 8) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Progress % */}
        <div className="bg-white p-5 rounded-xl border border-[#83C5BE] shadow-md text-[#006D77]">
          <div className="flex items-center justify-between text-[#E29578] text-xs font-semibold mb-2">
            <span>التقدم في المقرر</span>
            <TrendingUp className="w-4 h-4 text-[#006D77]" />
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-black text-[#004D54]">{currentUser.progressPercentage}%</span>
            <span className="text-xs text-[#E29578]">من إجمالي الأنشطة</span>
          </div>
          <div className="w-full bg-[#006D77] rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-[#006D77] h-full rounded-full transition-all duration-500"
              style={{ width: `${currentUser.progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Current Project */}
        <div className="bg-white p-5 rounded-xl border border-[#83C5BE] shadow-md text-[#006D77]">
          <div className="flex items-center justify-between text-[#E29578] text-xs font-semibold mb-2">
            <span>المشروع الحالي</span>
            <FolderGit2 className="w-4 h-4 text-[#006D77]" />
          </div>
          <p className="text-base font-bold text-[#004D54] line-clamp-1 mb-1">{currentProject.title.split(':')[1] || currentProject.title}</p>
          <p className="text-xs text-[#E29578] line-clamp-1">{currentProject.subtitle}</p>
          <div className="mt-2 text-xs font-bold text-[#006D77] hover:text-white flex items-center gap-1 cursor-pointer" onClick={() => { setSelectedProjectId(currentProject.id); setActiveTab('projects'); }}>
            <span>بدء التنفيذ في المحرر</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Completed Projects */}
        <div className="bg-white p-5 rounded-xl border border-[#83C5BE] shadow-md text-[#006D77]">
          <div className="flex items-center justify-between text-[#E29578] text-xs font-semibold mb-2">
            <span>المشروعات المنجزة</span>
            <CheckCircle2 className="w-4 h-4 text-[#cbd5e1]" />
          </div>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-3xl font-black text-[#004D54]">{currentUser.completedProjectsCount}</span>
            <span className="text-[#E29578] font-bold text-base">/ 4</span>
          </div>
          <p className="text-xs text-[#E29578]">تم تسليم وتقييم {currentUser.completedProjectsCount} مشروعات</p>
        </div>

        {/* Completed Activities */}
        <div className="bg-white p-5 rounded-xl border border-[#83C5BE] shadow-md text-[#006D77]">
          <div className="flex items-center justify-between text-[#E29578] text-xs font-semibold mb-2">
            <span>الأنشطة المكتملة</span>
            <BookOpen className="w-4 h-4 text-[#91472F]" />
          </div>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-3xl font-black text-[#004D54]">{currentUser.completedActivitiesCount}</span>
            <span className="text-[#E29578] font-bold text-base">/ 10</span>
          </div>
          <p className="text-xs text-[#E29578]">تم إنهاء التدريبات والاختبارات القصيرة</p>
        </div>

      </div>

      {/* Collaborative Team Stats Box (When Collaborative) */}
      {isCollaborative && team && (
        <div className="bg-gradient-to-r from-[#EDF6F9] to-[#EDF6F9] border border-[#83C5BE] rounded-2xl p-5 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#83C5BE]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#91472F] text-white flex items-center justify-center font-bold text-lg shadow-md shadow-[#91472F]/20">
                👥
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-base text-[#91472F]">{team.name}</h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#83C5BE] text-[#91472F] font-bold">
                    تقدم الفريق: {team.progressPercentage}%
                  </span>
                </div>
                <p className="text-xs text-[#91472F] mt-0.5">{team.description}</p>
              </div>
            </div>

            {currentRoleInfo && (
              <div className="bg-white px-4 py-2.5 rounded-xl border border-[#83C5BE] shadow-md text-[#006D77] flex items-center gap-3">
                <span className="text-2xl">{currentRoleInfo.icon}</span>
                <div>
                  <p className="text-xs text-[#E29578]">دورك الحالي في المشروع:</p>
                  <p className="text-sm font-extrabold text-[#91472F]">{currentRoleInfo.title}</p>
                </div>
              </div>
            )}
          </div>

          {/* Team Members List & Roles */}
          <div className="mt-4">
            <p className="text-xs font-bold text-[#91472F] mb-3">أعضاء الفريق وتوزيع الأدوار:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(team.members || []).map(member => (
                <div key={member.userId} className="bg-white p-3 rounded-xl border border-[#83C5BE] shadow-2xs flex items-center gap-2.5">
                  <img src={member.avatar} className="w-9 h-9 rounded-lg object-cover ring-1 ring-[#83C5BE]" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#004D54] truncate">{member.name}</p>
                    <span className="text-[11px] text-[#91472F] font-semibold">
                      {roleTitles[member.role]?.title.split('(')[0]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sequential Learning Path & Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: 4 E-Projects Progression */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-[#004D54]">المشروعات البرمجية الإلكترونية (قلب البيئة)</h2>
              <p className="text-xs text-[#E29578]">المشروعات المتدرجة لتطبيق المفاهيم البرمجية عملياً</p>
            </div>
            <button 
              onClick={() => setActiveTab('projects')}
              className="text-xs font-bold text-[#006D77] hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <span>فتح مساحة العمل</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((proj, idx) => {
              const sub = userSubmissions.find(s => s.projectId === proj.id);
              const isDone = sub?.status === 'evaluated';
              const isCurrent = proj.id === currentProject.id;

              return (
                <div 
                  key={proj.id}
                  onClick={() => {
                    setSelectedProjectId(proj.id);
                    setActiveTab('projects');
                  }}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                    isDone 
                      ? 'bg-[#006D77]/60 border-[#E29578]/50 hover:border-[#E29578]/50' 
                      : isCurrent
                      ? 'bg-[#006D77] border-[#83C5BE] ring-2 ring-[#004D54]/20 shadow-sm'
                      : 'bg-white border-[#83C5BE] text-[#006D77] hover:border-[#E29578]/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center ${
                      isDone ? 'bg-[#006D77] text-white' : isCurrent ? 'bg-[#059669] text-white' : 'bg-[#006D77] text-white'
                    }`}>
                      {proj.order}
                    </span>

                    {isDone ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#006D77] bg-[#E29578] px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" /> مكتمل ({sub?.totalScore}%)
                      </span>
                    ) : isCurrent ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-white bg-[#006D77] px-2 py-0.5 rounded-full border border-[#E29578]/50">
                        <Sparkles className="w-3.5 h-3.5" /> جاري العمل
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">قيد الانتظار</span>
                    )}
                  </div>

                  <h3 className={`font-bold text-sm mb-1 transition-colors ${isDone || isCurrent ? "text-white group-hover:text-[#E29578]" : "text-[#004D54] group-hover:text-[#006D77]"}`}>
                    {proj.title}
                  </h3>
                  <p className="text-xs text-[#E29578] line-clamp-2 mb-3">{proj.problemStatement}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {proj.targetSkills.slice(0, 2).map((skill, sIdx) => (
                      <span key={sIdx} className="text-[10px] px-2 py-0.5 rounded bg-[#EDF6F9] text-[#006D77] font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Student Portfolio & Learning Units Quick Access */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-[#004D54]">سجل الإنجاز والتغذية الراجعة</h2>
            <span className="text-xs text-[#E29578]">Portfolio</span>
          </div>

          <div className="bg-white rounded-2xl border border-[#83C5BE] p-4 divide-y divide-[#004D54] shadow-md text-[#006D77] shadow-xs">
            {userSubmissions.length === 0 ? (
              <div className="text-center py-8 text-[#E29578] text-xs">
                لم يتم رصد تسليمات حتى الآن. ابدأ بتنفيذ المشروع الأول.
              </div>
            ) : (
              userSubmissions.map(sub => {
                const p = projects.find(proj => proj.id === sub.projectId);
                return (
                  <div key={sub.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-[#004D54]">{p?.title.split(':')[0]}</span>
                      {sub.totalScore !== undefined && (
                        <span className="text-xs font-bold text-white bg-[#006D77] px-2 py-0.5 rounded border border-[#E29578]/50">
                          {sub.totalScore} / 100
                        </span>
                      )}
                    </div>

                    {sub.teacherGeneralFeedback && (
                      <div className="bg-[#EDF6F9] p-2.5 rounded-lg border border-[#83C5BE] text-[11px] text-[#006D77]/80 mt-1.5 leading-relaxed">
                        <span className="font-bold text-[#006D77] block mb-0.5">ملاحظات المعلم:</span>
                        {sub.teacherGeneralFeedback}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Unit Jump */}
          <div className="bg-gradient-to-br from-[#006D77] to-[#006D77] text-white rounded-2xl p-5 shadow-sm border border-[#83C5BE]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#006D77]">وحدات المقرر (7 وحدات)</span>
              <BookOpen className="w-4 h-4 text-[#006D77]" />
            </div>
            <p className="text-xs text-[#006D77] mb-3">
              استعرض الدروس والشروحات والفيديوهات التوضيحية والأنشطة التدريبية لكل وحدة.
            </p>
            <button
              onClick={() => setActiveTab('units')}
              className="w-full py-2.5 bg-[#006D77] hover:bg-white text-[#006D77] font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>فتح قائمة الوحدات السبع</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
