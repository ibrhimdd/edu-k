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
  LogOut,
  Layers,
  BarChart3,
  Scale
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
    logout,
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
        color: 'bg-[#355834] text-white border-[#c2a878]',
        icon: <User className="w-3.5 h-3.5 text-[#355834]" />
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
    <header className="sticky top-0 z-40 bg-[#14281d]/95 backdrop-blur border-b border-[#355834] shadow-md">
      {/* Top Academic & Portal Access Bar */}
      <div className="bg-[#0e1b14] text-white text-xs py-1.5 px-4 sm:px-8 border-b border-[#355834] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-[#355834]/50 text-white border border-[#6e633d]">
            EduCode Platform
          </span>
          <span className="text-[#355834] hidden sm:inline font-medium">
            منصة التعلم الإلكترونية القائمة على المشروعات لتنمية مهارات البرمجة
          </span>
        </div>

        {/* Quick Auth & Role Switcher */}
        <div className="flex items-center gap-2">
          {onOpenAuthModal && (
            <button
              onClick={onOpenAuthModal}
              className="px-2.5 py-0.5 rounded bg-[#355834] hover:bg-[#6e633d] text-white text-xs font-bold transition-all flex items-center gap-1 border border-[#6e633d] cursor-pointer"
            >
              <UserPlus className="w-3 h-3" />
              <span>تسجيل / تبديل حساب</span>
            </button>
          )}

          <div className="hidden md:flex items-center gap-1.5">
            {(allUsers || []).slice(0, 4).map(u => (
              <button
                key={u.id}
                onClick={() => switchUser(u.id)}
                className={`px-2.5 py-0.5 rounded transition-all text-xs flex items-center gap-1 cursor-pointer ${
                  currentUser.id === u.id
                    ? u.role === 'teacher_admin'
                      ? 'bg-[#B24C3D] text-white font-bold shadow-xs'
                      : u.role === 'student_individual'
                        ? 'bg-[#355834] text-white font-bold shadow-xs'
                        : 'bg-[#A2673B] text-white font-bold shadow-xs'
                    : 'bg-[#355834]/40 text-white hover:bg-[#355834]'
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#355834] to-[#6e633d] text-white flex items-center justify-center shadow-md shadow-[#355834]/30 border border-[#c2a878]/30">
              <Code2 className="w-6 h-6 text-[#355834]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-lg tracking-tight">منصة EduCode البرمجية</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#355834] text-white font-bold border border-[#c2a878] uppercase">
                  PBL System
                </span>
              </div>
              <p className="text-[11px] text-[#c2a878] font-medium hidden sm:block">بيئة التعلم الإلكترونية القائمة على المشروعات</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            
            {/* 1. Main Home Screen Tab */}
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-[#355834] text-white shadow-xs border border-[#6e633d]'
                  : 'text-[#c2a878] hover:text-white hover:bg-[#355834]/40'
              }`}
            >
              <Home className="w-4 h-4 text-[#c2a878]" />
              الرئيسية
            </button>

            {/* 2. Main Platform Portal */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#355834] text-white shadow-xs border border-[#6e633d]'
                  : 'text-[#c2a878] hover:text-white hover:bg-[#355834]/40'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-[#c2a878]" />
              <span>{currentUser.role === 'teacher_admin' ? 'لوحة تحكم الأستاذ (سجل الطلاب)' : 'مسار التعلم والمشاريع'}</span>
            </button>

            {/* 3. Engagement Scale / Referee Mode */}
            <button
              onClick={() => setActiveTab('engagement_scale')}
              className={`px-3.5 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'engagement_scale'
                  ? 'bg-[#355834] text-white shadow-xs border border-[#6e633d]'
                  : 'text-[#c2a878] hover:text-white hover:bg-[#355834]/40'
              }`}
            >
              <Scale className="w-4 h-4 text-[#c2a878]" />
              <span>{currentUser.role === 'teacher_admin' ? 'مقياس الانخراط والتحكيم (56)' : 'مقياس الانخراط في التعلم'}</span>
            </button>
          </nav>

          {/* Right Action Tools & Profile */}
          <div className="flex items-center gap-2.5">
            
            {/* Tour & Demo Guide Button */}
            {onOpenTourModal && (
              <button
                onClick={onOpenTourModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#355834]/50 hover:bg-[#355834] text-white border border-[#c2a878] text-xs font-bold transition-all shadow-xs cursor-pointer"
                title="جولة استكشاف المنصة والتصميم التجريبي"
              >
                <Compass className="w-3.5 h-3.5 text-[#c2a878]" />
                <span className="hidden sm:inline">جولة المنصة</span>
              </button>
            )}

            {/* Architecture Spec Button */}
            <button
              onClick={onOpenArchitectureModal}
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#355834] text-[#355834] hover:bg-[#355834]/50 text-xs font-semibold transition-all shadow-xs cursor-pointer"
              title="عرض مخطط بنية النظام وهيكل Firestore"
            >
              <Database className="w-3.5 h-3.5 text-[#c2a878]" />
              هيكل النظام
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowAnnouncements(!showAnnouncements)}
                className="relative p-2 text-[#c2a878] hover:text-white hover:bg-[#355834] rounded-xl transition-colors cursor-pointer"
                title="الإعلانات والتنبيهات"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#c2a878] rounded-full ring-2 ring-[#14281d]"></span>
              </button>

              {showAnnouncements && (
                <div className="absolute left-0 mt-2 w-80 bg-[#14281d] rounded-2xl shadow-2xl border border-[#355834] py-3 px-4 z-50 animate-in fade-in slide-in-from-top-2 text-[#355834]">
                  <div className="flex items-center justify-between border-b border-[#355834] pb-2 mb-2">
                    <span className="font-bold text-sm text-white">الإعلانات والتنبيهات المعتمدة</span>
                    <span className="text-[11px] text-[#c2a878] font-medium">جديد اليوم</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-[#0e1b14] rounded-xl border border-[#355834]">
                      <p className="font-bold text-[#c2a878]">📢 متاح الآن: تسليم المشروع البرمجي الثاني</p>
                      <p className="text-[#355834]/80 mt-0.5 text-[11px]">مشروع محول وحدات القياس أصبح متاحاً للتسليم والتقييم عبر الـ Rubric.</p>
                    </div>
                    <div className="p-2.5 bg-[#0e1b14] rounded-xl border border-[#355834]">
                      <p className="font-bold text-white">💡 تلميح: المعلم السقراطي AI</p>
                      <p className="text-[#355834]/80 mt-0.5 text-[11px]">يمكنك الاستعانة بمساعد الذكاء الاصطناعي لفحص كودك واقتراح تلميحات توجيهية.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-[#355834] border border-[#355834] transition-colors cursor-pointer"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-xl object-cover ring-1 ring-[#c2a878]"
                />
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-extrabold text-white leading-tight">{currentUser.name}</p>
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full border text-[10px] font-bold mt-0.5 ${badge.color}`}>
                    {badge.icon}
                    {badge.label}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-[#c2a878]" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-[#14281d] rounded-2xl shadow-2xl border border-[#355834] py-2 z-50 animate-in fade-in text-[#355834]">
                  <div className="px-4 py-3 border-b border-[#355834]">
                    <p className="text-[11px] text-[#c2a878]">مسجل الدخول حالياً:</p>
                    <p className="text-sm font-black text-white">{currentUser.name}</p>
                    <p className="text-xs text-[#355834]/80">{currentUser.email}</p>
                    {currentTeam && (
                      <p className="text-xs text-[#c2a878] font-bold mt-1 bg-[#355834] px-2 py-0.5 rounded-lg inline-block border border-[#6e633d]">
                        {currentTeam.name}
                      </p>
                    )}
                  </div>

                  <div className="py-2">
                    <div className="px-4 py-1 text-[10px] font-bold text-[#c2a878] uppercase tracking-wider">
                      تبديل الحساب أو إنشاء حساب جديد
                    </div>

                    {onOpenAuthModal && (
                      <button
                        onClick={() => {
                          onOpenAuthModal();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-right text-xs font-bold text-[#c2a878] hover:bg-[#355834] hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>تسجيل حساب طالب أو معلم جديد</span>
                      </button>
                    )}

                    {(allUsers || []).map(user => (
                      <button
                        key={user.id}
                        onClick={() => {
                          switchUser(user.id);
                          setIsUserMenuOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-right text-xs flex items-center justify-between hover:bg-[#F0F4F1] transition-colors cursor-pointer ${
                          user.id === currentUser.id ? 'bg-[#355834] font-bold text-[#355834]' : 'text-[#2D312E]'
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

                  <div className="border-t border-[#F0F2F0] pt-1 mt-1 space-y-1">
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-right text-xs text-[#9C382A] hover:bg-[#FDF2F2] font-bold flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>تسجيل الخروج (Logout)</span>
                    </button>

                    <button
                      onClick={() => {
                        onOpenArchitectureModal();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-right text-xs text-[#2D312E] hover:bg-[#F0F4F1] flex items-center gap-2 cursor-pointer"
                    >
                      <Database className="w-3.5 h-3.5 text-[#355834]" />
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
              activeTab === 'home' ? 'bg-[#355834] text-white' : 'text-[#667085]'
            }`}
          >
            الرئيسية
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-[#355834] text-white' : 'text-[#667085]'
            }`}
          >
            {currentUser.role === 'teacher_admin' ? 'لوحة تحكم الأستاذ' : 'مسار التعلم'}
          </button>
          <button
            onClick={() => setActiveTab('engagement_scale')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === 'engagement_scale' ? 'bg-[#355834] text-white' : 'text-[#667085]'
            }`}
          >
            {currentUser.role === 'teacher_admin' ? 'مقياس الانخراط والتحكيم' : 'مقياس الانخراط'}
          </button>
        </div>

      </div>
    </header>
  );
};
