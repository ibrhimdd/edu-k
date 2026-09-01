// components/Header.tsx
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Code2, 
  Users, 
  User, 
  GraduationCap, 
  Database, 
  Bell, 
  ChevronDown, 
  CheckCircle2, 
  Sparkles,
  LayoutDashboard,
  BookOpen,
  FolderGit2,
  FileCheck2,
  ShieldCheck,
  Compass,
  Home,
  UserPlus,
  LogIn,
  Layers,
  BarChart3
} from 'lucide-react';

interface HeaderProps {
  onOpenArchitectureModal: () => void;
  onOpenTourModal?: () => void;
  onOpenAuthModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenArchitectureModal,
  onOpenTourModal,
  onOpenAuthModal 
}) => {
  const { 
    currentUser, 
    allUsers, 
    switchUser, 
    activeTab, 
    setActiveTab,
    getCurrentTeam
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showAnnouncements, setShowAnnouncements] = useState(false);

  const currentTeam = getCurrentTeam();

  const getRoleBadge = () => {
    if (currentUser.role === 'teacher_admin') {
      return {
        label: 'معلم ومشرف أكاديمي',
        color: 'bg-[#FDF2F0] text-[#9C382A] border-[#F4CCC7]',
        icon: <GraduationCap className="w-3.5 h-3.5 text-[#9C382A]" />
      };
    }
    if (currentUser.role === 'student_individual') {
      return {
        label: 'طالب المسار الفردي',
        color: 'bg-[#EBF2ED] text-[#2D5A3D] border-[#C8DEC3]',
        icon: <User className="w-3.5 h-3.5 text-[#2D5A3D]" />
      };
    }
    const roleLabels: Record<string, string> = {
      analyst: 'محلل المشكلة',
      designer: 'مصمم الحل',
      coder: 'كاتب الكود',
      tester: 'المختبر والتوثيق'
    };
    const roleName = currentUser.teamRole ? roleLabels[currentUser.teamRole] : 'عضو فريق';
    return {
      label: `طالب تشاركي • ${roleName}`,
      color: 'bg-[#FDF6EC] text-[#9C6644] border-[#F4E3CB]',
      icon: <Users className="w-3.5 h-3.5 text-[#9C6644]" />
    };
  };

  const badge = getRoleBadge();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[#E5EAE5] shadow-xs">
      {/* Top Academic & Portal Access Bar */}
      <div className="bg-[#1C2E24] text-[#E8F0EA] text-xs py-1.5 px-4 sm:px-8 border-b border-[#2A4335] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-[#2D5A3D]/50 text-[#86E49E] border border-[#3D704F]">
            EduCode Platform
          </span>
          <span className="text-[#C5D9CB] hidden sm:inline font-medium">
            منصة التعلم الإلكترونية القائمة على المشروعات لتنمية مهارات البرمجة
          </span>
        </div>

        {/* Quick Auth & Role Switcher */}
        <div className="flex items-center gap-2">
          {onOpenAuthModal && (
            <button
              onClick={onOpenAuthModal}
              className="px-2.5 py-0.5 rounded bg-[#2D5A3D] hover:bg-[#3D704F] text-[#E8F0EA] text-xs font-bold transition-all flex items-center gap-1 border border-[#48825C] cursor-pointer"
            >
              <UserPlus className="w-3 h-3" />
              <span>تسجيل / تبديل حساب</span>
            </button>
          )}

          <div className="hidden md:flex items-center gap-1.5">
            {allUsers.slice(0, 4).map(u => (
              <button
                key={u.id}
                onClick={() => switchUser(u.id)}
                className={`px-2.5 py-0.5 rounded transition-all text-xs flex items-center gap-1 cursor-pointer ${
                  currentUser.id === u.id
                    ? u.role === 'teacher_admin'
                      ? 'bg-[#B24C3D] text-white font-bold shadow-xs'
                      : u.role === 'student_individual'
                        ? 'bg-[#2D5A3D] text-white font-bold shadow-xs'
                        : 'bg-[#A2673B] text-white font-bold shadow-xs'
                    : 'bg-[#284234] text-[#C5D9CB] hover:bg-[#345543]'
                }`}
                title={`التبديل إلى ${u.name}`}
              >
                {u.role === 'teacher_admin' ? (
                  <GraduationCap className="w-3 h-3" />
                ) : u.role === 'student_individual' ? (
                  <User className="w-3 h-3" />
                ) : (
                  <Users className="w-3 h-3" />
                )}
                <span className="truncate max-w-[110px]">{u.name.split(' ')[0]} {u.name.split(' ')[1] || ''}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => setActiveTab('home')}
            title="الذهاب إلى الشاشة الرئيسية"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1E402B] to-[#2D5A3D] text-white flex items-center justify-center shadow-md shadow-[#2D5A3D]/20">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[#1A1C1E] text-lg tracking-tight">منصة EduCode البرمجية</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#EBF2ED] text-[#2D5A3D] font-bold border border-[#C8DEC3] uppercase">
                  PBL System
                </span>
              </div>
              <p className="text-[11px] text-[#667085] font-medium hidden sm:block">بيئة التعلم الإلكترونية القائمة على المشروعات</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            
            {/* 1. Main Home Screen Tab */}
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-[#EBF2ED] text-[#2D5A3D] shadow-2xs'
                  : 'text-[#4A5568] hover:text-[#1A1C1E] hover:bg-[#F0F4F1]'
              }`}
            >
              <Home className="w-4 h-4" />
              الرئيسية
            </button>

            {/* 2. Dashboard Tab */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#EBF2ED] text-[#2D5A3D] shadow-2xs'
                  : 'text-[#4A5568] hover:text-[#1A1C1E] hover:bg-[#F0F4F1]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              {currentUser.role === 'teacher_admin' ? 'لوحة المعلم' : 'لوحتي التعليمية'}
            </button>

            {currentUser.role !== 'teacher_admin' && (
              <>
                <button
                  onClick={() => setActiveTab('units')}
                  className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'units'
                      ? 'bg-[#EBF2ED] text-[#2D5A3D] shadow-2xs'
                      : 'text-[#4A5568] hover:text-[#1A1C1E] hover:bg-[#F0F4F1]'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  وحدات التعلم (4)
                </button>

                <button
                  onClick={() => setActiveTab('projects')}
                  className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'projects'
                      ? 'bg-[#EBF2ED] text-[#2D5A3D] shadow-2xs'
                      : 'text-[#4A5568] hover:text-[#1A1C1E] hover:bg-[#F0F4F1]'
                  }`}
                >
                  <FolderGit2 className="w-4 h-4" />
                  {currentUser.role === 'student_collaborative' ? 'مشروع الفريق التشاركي' : 'بيئة البرمجة والمشروع'}
                </button>

                <button
                  onClick={() => setActiveTab('assessments')}
                  className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'assessments'
                      ? 'bg-[#EBF2ED] text-[#2D5A3D] shadow-2xs'
                      : 'text-[#4A5568] hover:text-[#1A1C1E] hover:bg-[#F0F4F1]'
                  }`}
                >
                  <FileCheck2 className="w-4 h-4" />
                  الاختبارات والتقييم
                </button>
              </>
            )}

            {currentUser.role === 'teacher_admin' && (
              <>
                <button
                  onClick={() => setActiveTab('teacher_students')}
                  className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'teacher_students'
                      ? 'bg-[#EBF2ED] text-[#2D5A3D] shadow-2xs'
                      : 'text-[#4A5568] hover:text-[#1A1C1E] hover:bg-[#F0F4F1]'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  إدارة المجموعات
                </button>

                <button
                  onClick={() => setActiveTab('teacher_grading')}
                  className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'teacher_grading'
                      ? 'bg-[#EBF2ED] text-[#2D5A3D] shadow-2xs'
                      : 'text-[#4A5568] hover:text-[#1A1C1E] hover:bg-[#F0F4F1]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  تقييم المشروعات (Rubric)
                </button>

                <button
                  onClick={() => setActiveTab('teacher_analytics')}
                  className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'teacher_analytics'
                      ? 'bg-[#EBF2ED] text-[#2D5A3D] shadow-2xs'
                      : 'text-[#4A5568] hover:text-[#1A1C1E] hover:bg-[#F0F4F1]'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  التحليل الإحصائي و SPSS
                </button>
              </>
            )}
          </nav>

          {/* Right Action Tools & Profile */}
          <div className="flex items-center gap-2.5">
            
            {/* Tour & Demo Guide Button */}
            {onOpenTourModal && (
              <button
                onClick={onOpenTourModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EBF2ED] hover:bg-[#DCE7DF] text-[#172E1E] border border-[#C8DEC3] text-xs font-bold transition-all shadow-2xs cursor-pointer"
                title="جولة استكشاف المنصة والتصميم التجريبي"
              >
                <Compass className="w-3.5 h-3.5 text-[#2D5A3D]" />
                <span className="hidden sm:inline">جولة المنصة</span>
              </button>
            )}

            {/* Architecture Spec Button */}
            <button
              onClick={onOpenArchitectureModal}
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D5E0D5] text-[#2D312E] hover:bg-[#F0F4F1] text-xs font-semibold transition-all shadow-2xs cursor-pointer"
              title="عرض مخطط بنية النظام وهيكل Firestore"
            >
              <Database className="w-3.5 h-3.5 text-[#2D5A3D]" />
              هيكل النظام
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowAnnouncements(!showAnnouncements)}
                className="relative p-2 text-[#4A5568] hover:text-[#1A1C1E] hover:bg-[#F0F4F1] rounded-xl transition-colors cursor-pointer"
                title="الإعلانات والتنبيهات"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#B24C3D] rounded-full ring-2 ring-white"></span>
              </button>

              {showAnnouncements && (
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#E5EAE5] py-3 px-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between border-b border-[#F0F2F0] pb-2 mb-2">
                    <span className="font-bold text-sm text-[#1A1C1E]">الإعلانات والتنبيهات المعتمدة</span>
                    <span className="text-[11px] text-[#2D5A3D] font-medium">جديد اليوم</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-[#EBF2ED] rounded-xl border border-[#C8DEC3]">
                      <p className="font-bold text-[#2D5A3D]">📢 متاح الآن: تسليم المشروع البرمجي الثاني</p>
                      <p className="text-[#4A5568] mt-0.5 text-[11px]">مشروع محول وحدات القياس أصبح متاحاً للتسليم والتقييم عبر الـ Rubric.</p>
                    </div>
                    <div className="p-2.5 bg-[#F8F9FA] rounded-xl border border-[#E5EAE5]">
                      <p className="font-bold text-[#2D312E]">💡 تلميح: المعلم السقراطي AI</p>
                      <p className="text-[#667085] mt-0.5 text-[11px]">يمكنك الاستعانة بمساعد الذكاء الاصطناعي لفحص كودك واقتراح تلميحات توجيهية.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-[#F0F4F1] border border-[#E5EAE5] transition-colors cursor-pointer"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-xl object-cover ring-1 ring-[#D5E0D5]"
                />
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-extrabold text-[#1A1C1E] leading-tight">{currentUser.name}</p>
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full border text-[10px] font-bold mt-0.5 ${badge.color}`}>
                    {badge.icon}
                    {badge.label}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#E5EAE5] py-2 z-50 animate-in fade-in">
                  <div className="px-4 py-3 border-b border-[#F0F2F0]">
                    <p className="text-[11px] text-[#667085]">مسجل الدخول حالياً:</p>
                    <p className="text-sm font-black text-[#1A1C1E]">{currentUser.name}</p>
                    <p className="text-xs text-[#667085]">{currentUser.email}</p>
                    {currentTeam && (
                      <p className="text-xs text-[#2D5A3D] font-bold mt-1 bg-[#EBF2ED] px-2 py-0.5 rounded-lg inline-block">
                        {currentTeam.name}
                      </p>
                    )}
                  </div>

                  <div className="py-2">
                    <div className="px-4 py-1 text-[10px] font-bold text-[#8FA897] uppercase tracking-wider">
                      تبديل الحساب أو إنشاء حساب جديد
                    </div>

                    {onOpenAuthModal && (
                      <button
                        onClick={() => {
                          onOpenAuthModal();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-right text-xs font-bold text-[#2D5A3D] hover:bg-[#EBF2ED] flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>تسجيل حساب طالب أو معلم جديد</span>
                      </button>
                    )}

                    {allUsers.map(user => (
                      <button
                        key={user.id}
                        onClick={() => {
                          switchUser(user.id);
                          setIsUserMenuOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-right text-xs flex items-center justify-between hover:bg-[#F0F4F1] transition-colors cursor-pointer ${
                          user.id === currentUser.id ? 'bg-[#EBF2ED] font-bold text-[#2D5A3D]' : 'text-[#2D312E]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img src={user.avatar} className="w-6 h-6 rounded-lg object-cover" />
                          <span className="truncate max-w-[120px]">{user.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {user.role === 'teacher_admin' ? 'معلم' : user.role === 'student_individual' ? 'فردي' : 'تشاركي'}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-[#F0F2F0] pt-1 mt-1">
                    <button
                      onClick={() => {
                        onOpenArchitectureModal();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-right text-xs text-[#2D312E] hover:bg-[#F0F4F1] flex items-center gap-2 cursor-pointer"
                    >
                      <Database className="w-3.5 h-3.5 text-[#2D5A3D]" />
                      عرض مخطط بنية النظام و Firestore
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center justify-between overflow-x-auto py-2 border-t border-[#F0F2F0] gap-1 text-xs font-bold scrollbar-none">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === 'home' ? 'bg-[#EBF2ED] text-[#2D5A3D]' : 'text-[#667085]'
            }`}
          >
            الرئيسية
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-[#EBF2ED] text-[#2D5A3D]' : 'text-[#667085]'
            }`}
          >
            لوحتي
          </button>
          {currentUser.role !== 'teacher_admin' ? (
            <>
              <button
                onClick={() => setActiveTab('units')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
                  activeTab === 'units' ? 'bg-[#EBF2ED] text-[#2D5A3D]' : 'text-[#667085]'
                }`}
              >
                الوحدات
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
                  activeTab === 'projects' ? 'bg-[#EBF2ED] text-[#2D5A3D]' : 'text-[#667085]'
                }`}
              >
                المشروع
              </button>
              <button
                onClick={() => setActiveTab('assessments')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
                  activeTab === 'assessments' ? 'bg-[#EBF2ED] text-[#2D5A3D]' : 'text-[#667085]'
                }`}
              >
                التقييم
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('teacher_students')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
                  activeTab === 'teacher_students' ? 'bg-[#EBF2ED] text-[#2D5A3D]' : 'text-[#667085]'
                }`}
              >
                الفرق
              </button>
              <button
                onClick={() => setActiveTab('teacher_grading')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
                  activeTab === 'teacher_grading' ? 'bg-[#EBF2ED] text-[#2D5A3D]' : 'text-[#667085]'
                }`}
              >
                الـ Rubric
              </button>
              <button
                onClick={() => setActiveTab('teacher_analytics')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
                  activeTab === 'teacher_analytics' ? 'bg-[#EBF2ED] text-[#2D5A3D]' : 'text-[#667085]'
                }`}
              >
                الإحصاء
              </button>
            </>
          )}
        </div>

      </div>
    </header>
  );
};
