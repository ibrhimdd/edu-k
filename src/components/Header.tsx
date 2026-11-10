// components/Header.tsx
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Code2, 
  Users, 
  User, 
  GraduationCap, 
  Bell, 
  ChevronDown, 
  LayoutDashboard,
  Home,
  UserPlus, 
  LogOut, 
  Scale,
  Compass,
  CheckCircle2
} from 'lucide-react';

interface HeaderProps {
  onOpenArchitectureModal?: () => void;
  onOpenTourModal?: () => void;
  onOpenAuthModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenTourModal,
  onOpenAuthModal 
}) => {
  const { 
    currentUser, 
    logout,
    activeTab, 
    setActiveTab,
    getCurrentTeam
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showAnnouncements, setShowAnnouncements] = useState(false);

  const currentTeam = getCurrentTeam();

  const getRoleBadge = () => {
    if (currentUser.role === 'platform_admin') {
      return {
        label: 'مدير المنصة',
        color: 'bg-[#9C382A]/20 text-[#fca5a5] border-[#9C382A]/40',
        icon: <GraduationCap className="w-3.5 h-3.5 text-[#fca5a5]" />
      };
    }
    if (currentUser.role === 'academic_supervisor') {
      return {
        label: 'مشرف أكاديمي — قراءة فقط',
        color: 'bg-[#006D77]/15 text-[#006D77] border-[#83C5BE]',
        icon: <GraduationCap className="w-3.5 h-3.5 text-[#006D77]" />
      };
    }
    if (currentUser.role === 'researcher') {
      return {
        label: 'باحث — تحرير المحتوى البحثي',
        color: 'bg-[#006D77]/15 text-[#006D77] border-[#83C5BE]',
        icon: <GraduationCap className="w-3.5 h-3.5 text-[#006D77]" />
      };
    }
    if (currentUser.role === 'teacher_admin') {
      return {
        label: 'دور قديم — يحتاج ترقية',
        color: 'bg-[#9C382A]/20 text-[#fca5a5] border-[#9C382A]/40',
        icon: <GraduationCap className="w-3.5 h-3.5 text-[#fca5a5]" />
      };
    }
    if (currentUser.role === 'student_individual') {
      return {
        label: 'طالب المسار الفردي',
        color: 'bg-[#006D77] text-white border-[#E29578]/50',
        icon: <User className="w-3.5 h-3.5 text-[#004D54]" />
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
      color: 'bg-[#059669]/30 text-[#E29578] border-[#E29578]/50',
      icon: <Users className="w-3.5 h-3.5 text-[#004D54]" />
    };
  };

  const badge = getRoleBadge();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#83C5BE] shadow-xl w-full">
      {/* Main App Bar - Solid Dark Green, 100% Opaque for Zero Background Bleed */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none transition-transform active:scale-98" 
            onClick={() => setActiveTab('home')}
            title="الذهاب إلى الشاشة الرئيسية"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#10b981] to-[#0ea5e9] text-white flex items-center justify-center shadow-md shadow-black/40 border border-[#E29578]/40">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[#006D77] text-base sm:text-lg tracking-tight">منصة GitHub البرمجية</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#006D77] text-white font-bold border border-[#E29578]/50 uppercase tracking-wider">
                  PBL System
                </span>
              </div>
              <p className="text-[11px] text-[#E29578] font-medium hidden sm:block">بيئة التعلم الإلكترونية القائمة على المشروعات</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            
            {/* 1. Main Home Screen Tab */}
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-[#EDF6F9] text-[#004D54] shadow-xs border border-[#83C5BE]'
                  : 'text-[#004D54] hover:text-[#004D54] hover:bg-[#EDF6F9] border border-transparent'
              }`}
            >
              <Home className="w-4 h-4 text-[#004D54]" />
              <span>الرئيسية</span>
            </button>

            {/* 2. Main Platform Portal */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#EDF6F9] text-[#004D54] shadow-xs border border-[#83C5BE]'
                  : 'text-[#004D54] hover:text-[#004D54] hover:bg-[#EDF6F9] border border-transparent'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-[#004D54]" />
              <span>{['platform_admin', 'academic_supervisor', 'researcher', 'teacher_admin'].includes(currentUser.role) ? 'لوحة التحكم الأكاديمية' : 'مسار التعلم والمشاريع'}</span>
            </button>

            {/* 3. Engagement Scale / Referee Mode */}
            <button
              onClick={() => setActiveTab('engagement_scale')}
              className={`px-3.5 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'engagement_scale'
                  ? 'bg-[#EDF6F9] text-[#004D54] shadow-xs border border-[#83C5BE]'
                  : 'text-[#004D54] hover:text-[#004D54] hover:bg-[#EDF6F9] border border-transparent'
              }`}
            >
              <Scale className="w-4 h-4 text-[#004D54]" />
              <span>{['platform_admin', 'academic_supervisor', 'researcher', 'teacher_admin'].includes(currentUser.role) ? 'مقياس الانخراط والتحكيم (56)' : 'مقياس الانخراط في التعلم'}</span>
            </button>
          </nav>

          {/* Right Action Tools & Profile */}
          <div className="flex items-center gap-2.5">
            
            {/* Tour & Demo Guide Button */}
            {onOpenTourModal && (
              <button
                onClick={onOpenTourModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EDF6F9] hover:bg-[#006D77] text-[#004D54] hover:text-white border border-[#83C5BE] text-xs font-bold transition-all shadow-xs cursor-pointer"
                title="دليل استكشاف المنصة"
              >
                <Compass className="w-3.5 h-3.5 text-[#004D54]" />
                <span className="hidden sm:inline">دليل المنصة</span>
              </button>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowAnnouncements(!showAnnouncements)}
                className="relative p-2 text-[#E29578] hover:text-white hover:bg-[#006D77] rounded-xl border border-transparent hover:border-[#83C5BE] transition-colors cursor-pointer"
                title="الإعلانات والتنبيهات"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E29578] rounded-full ring-2 ring-[#006D77]"></span>
              </button>

              {showAnnouncements && (
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-[#83C5BE] py-3 px-4 z-50 animate-in fade-in slide-in-from-top-2 text-[#006D77]">
                  <div className="flex items-center justify-between border-b border-[#83C5BE] pb-2 mb-2">
                    <span className="font-bold text-sm text-[#006D77]">الإعلانات والتنبيهات المعتمدة</span>
                    <span className="text-[11px] text-[#E29578] font-semibold bg-[#EDF6F9] px-2 py-0.5 rounded-full border border-[#83C5BE]">إشعارات النظام</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-[#EDF6F9] rounded-xl border border-[#83C5BE]">
                      <p className="font-bold text-[#E29578]">📢 متاح الآن: تسليم المشروع البرمجي الثاني</p>
                      <p className="text-[#006D77] mt-1 text-[11px] leading-relaxed">مشروع محول وحدات القياس أصبح متاحاً للتسليم والتقييم عبر الـ Rubric.</p>
                    </div>
                    <div className="p-2.5 bg-[#EDF6F9] rounded-xl border border-[#83C5BE]">
                      <p className="font-bold text-[#004D54]">💡 تلميح: المعلم السقراطي AI</p>
                      <p className="text-[#006D77] mt-1 text-[11px] leading-relaxed">يمكنك الاستعانة بمساعد الذكاء الاصطناعي لفحص كودك واقتراح تلميحات توجيهية دون كشف الحل النهائي.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-2xl bg-[#EDF6F9] hover:bg-[#006D77] border border-[#83C5BE] transition-all cursor-pointer shadow-xs"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-xl object-cover ring-1 ring-[#83C5BE]/60"
                />
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-extrabold text-[#006D77] leading-tight">{currentUser.name}</p>
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full border text-[10px] font-bold mt-0.5 ${badge.color}`}>
                    {badge.icon}
                    {badge.label}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-[#004D54]" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-[#83C5BE] py-2 z-50 animate-in fade-in text-[#006D77] divide-y divide-[#004D54]">
                  {/* Current User Card */}
                  <div className="px-4 py-3 space-y-1">
                    <p className="text-[11px] text-[#E29578] font-bold">الحساب الحالي:</p>
                    <p className="text-sm font-black text-[#006D77]">{currentUser.name}</p>
                    <p className="text-xs text-[#E29578] font-mono">{currentUser.email}</p>
                    {currentTeam && (
                      <p className="text-xs text-[#E29578] font-bold mt-1.5 bg-[#EDF6F9] px-2 py-0.5 rounded-lg inline-block border border-[#83C5BE]">
                        الفريق: {currentTeam.name}
                      </p>
                    )}
                  </div>

                  {/* Account Actions */}
                  <div className="py-2 space-y-1">
                    {onOpenAuthModal && (
                      <button
                        onClick={() => {
                          onOpenAuthModal();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-right text-xs font-bold text-[#E29578] hover:bg-[#EDF6F9] hover:text-[#004D54] flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5 text-[#004D54]" />
                        <span>تسجيل حساب مستخدم جديد</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-right text-xs text-[#f87171] hover:bg-[#9C382A]/20 hover:text-white font-bold flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>تسجيل الخروج (Logout)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center justify-between overflow-x-auto py-2.5 border-t border-[#83C5BE] gap-1.5 text-xs font-bold scrollbar-none">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
              activeTab === 'home' 
                ? 'bg-[#EDF6F9] text-[#004D54] border border-[#83C5BE]' 
                : 'text-[#004D54] hover:bg-[#EDF6F9] hover:text-[#004D54]'
            }`}
          >
            الرئيسية
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
              activeTab === 'dashboard' 
                ? 'bg-[#EDF6F9] text-[#004D54] border border-[#83C5BE]' 
                : 'text-[#004D54] hover:bg-[#EDF6F9] hover:text-[#004D54]'
            }`}
          >
            {['platform_admin', 'academic_supervisor', 'researcher', 'teacher_admin'].includes(currentUser.role) ? 'لوحة التحكم الأكاديمية' : 'مسار التعلم'}
          </button>
          <button
            onClick={() => setActiveTab('engagement_scale')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
              activeTab === 'engagement_scale' 
                ? 'bg-[#EDF6F9] text-[#004D54] border border-[#83C5BE]' 
                : 'text-[#004D54] hover:bg-[#EDF6F9] hover:text-[#004D54]'
            }`}
          >
            {['platform_admin', 'academic_supervisor', 'researcher', 'teacher_admin'].includes(currentUser.role) ? 'مقياس الانخراط والتحكيم' : 'مقياس الانخراط'}
          </button>
        </div>

      </div>
    </header>
  );
};
