// components/auth/LoginPage.tsx
import React, { useState } from 'react';
import { 
  Code2, 
  Sparkles, 
  Shield, 
  KeyRound, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Copy, 
  Check, 
  UserPlus, 
  LogIn, 
  User, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Terminal, 
  Cpu, 
  Layers,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole, ExperimentalGroup, TeamMemberRole } from '../../types/schema';

interface LoginPageProps {
  onOpenArchitecture?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onOpenArchitecture }) => {
  const { allUsers, loginWithCredentials, registerNewUser } = useApp();
  const [activeMode, setActiveMode] = useState<'login' | 'register'>('login');

  // Login Form State
  const [loginEmailOrName, setLoginEmailOrName] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regRole, setRegRole] = useState<UserRole>('student_individual');
  const [regTeamRole, setRegTeamRole] = useState<TeamMemberRole>('coder');
  const [regSuccess, setRegSuccess] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginEmailOrName.trim()) {
      setLoginError('يرجى إدخال البريد الإلكتروني أو اسم المستخدم.');
      return;
    }
    if (!loginPassword.trim()) {
      setLoginError('يرجى إدخال كلمة المرور.');
      return;
    }

    const res = loginWithCredentials(loginEmailOrName, loginPassword);
    if (res.success) {
      setLoginSuccess(true);
    } else {
      setLoginError(res.message || 'بيانات الدخول غير صحيحة، يرجى المحاولة مجدداً.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) return;

    const group: ExperimentalGroup = 
      regRole === 'student_collaborative' ? 'collaborative_group' : 'individual_group';

    registerNewUser(
      regName.trim(),
      regEmail.trim(),
      regRole,
      group,
      regRole === 'student_collaborative' ? regTeamRole : undefined,
      regPassword.trim() || (regRole === 'teacher_admin' ? 'teacher123' : 'student123')
    );

    setRegSuccess(true);
  };

  const handleFillCredentials = (email: string, pass: string) => {
    setLoginEmailOrName(email);
    setLoginPassword(pass);
    setLoginError(null);
  };

  const copyText = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F4F7F4] text-[#1E2E23] flex flex-col justify-between selection:bg-[#2D5A3D] selection:text-white" dir="rtl">
      
      {/* Top Academic Ribbon */}
      <div className="bg-[#172E1E] text-[#D8E6DC] text-xs py-2 px-4 sm:px-8 border-b border-[#24452F] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-[#2D5A3D] text-[#86E49E] px-2 py-0.5 rounded font-bold text-[11px] border border-[#3E7450]">
            EduCode PBL Portal
          </span>
          <span className="font-semibold hidden sm:inline">
            بوابة الدخول إلى منصة التعلم الإلكترونية القائمة على المشروعات
          </span>
        </div>
        <div className="text-[11px] text-[#A3C4AF] flex items-center gap-2">
          <GraduationCap className="w-3.5 h-3.5 text-[#86E49E]" />
          <span>المشرف العام: د. إبراهيم الخولي</span>
        </div>
      </div>

      {/* Main Authentication Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Platform Branding & Highlights */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#1C2E24] via-[#172E1E] to-[#112015] rounded-3xl p-6 sm:p-8 text-white border border-[#2D5A3D] shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#2D5A3D]/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#A2673B]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2D5A3D] to-[#86E49E] text-[#112417] flex items-center justify-center font-black shadow-lg shadow-[#86E49E]/20">
                  <Code2 className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight text-white">منصة EduCode البرمجية</h1>
                  <span className="text-[11px] text-[#A3D9B1] font-semibold block">بيئة المشروعات والذكاء الاصطناعي</span>
                </div>
              </div>

              {/* Research & Platform Statement */}
              <div className="space-y-3 pt-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2D5A3D]/50 border border-[#48825C] text-[#86E49E] text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>نظام التعلم القائم على المشروعات (PBL)</span>
                </div>
                <p className="text-xs sm:text-sm text-[#D0E2D5] leading-relaxed">
                  أهلاً بك في البيئة التفاعلية لدراسة البرمجة وتنمية مهارات التفكير الحسابي، وحل المشكلات عبر بيئات التعلم الفردي والتعلم التشاركي.
                </p>
              </div>

              {/* Feature Pills */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2.5 text-xs text-[#E1EFE4] bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <Terminal className="w-4 h-4 text-[#86E49E] shrink-0" />
                  <span>محرر أكواد حي (Python / JavaScript) مع تنفيذ فوري</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#E1EFE4] bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <Cpu className="w-4 h-4 text-[#86E49E] shrink-0" />
                  <span>معلم سقراطي بالذكاء الاصطناعي يقدم التوجيه دون كشف الحل</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#E1EFE4] bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <Users className="w-4 h-4 text-[#86E49E] shrink-0" />
                  <span>مجموعات تشاركية بأدوار متخصصة (محلل، مصمم، مبرمج، مختبر)</span>
                </div>
              </div>
            </div>

            {/* Bottom Citation & Arch Button */}
            <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-[#A3C4AF]">
              <span>إشراف وإعداد: د. إبراهيم الخولي</span>
              {onOpenArchitecture && (
                <button
                  type="button"
                  onClick={onOpenArchitecture}
                  className="text-white hover:text-[#86E49E] font-bold underline transition-colors cursor-pointer"
                >
                  مخطط النظام ↗
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Authentication Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#C8DEC3] shadow-xl flex flex-col justify-center space-y-6">
            
            {/* Mode Switcher Tabs */}
            <div className="flex items-center p-1 bg-[#F0F4F1] rounded-2xl">
              <button
                type="button"
                onClick={() => { setActiveMode('login'); setLoginError(null); }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeMode === 'login'
                    ? 'bg-white text-[#172E1E] shadow-sm'
                    : 'text-[#667085] hover:text-[#172E1E]'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>تسجيل الدخول</span>
              </button>
              <button
                type="button"
                onClick={() => { setActiveMode('register'); setLoginError(null); }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeMode === 'register'
                    ? 'bg-white text-[#172E1E] shadow-sm'
                    : 'text-[#667085] hover:text-[#172E1E]'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>حساب جديد</span>
              </button>
            </div>

            {/* TAB 1: LOGIN FORM */}
            {activeMode === 'login' && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-black text-[#172E1E]">تسجيل الدخول إلى حسابك</h2>
                  <p className="text-xs text-[#667085]">
                    أدخل البريد الإلكتروني وكلمة المرور الخاصة بك للوصول إلى لوحة التعلم
                  </p>
                </div>

                {loginSuccess ? (
                  <div className="p-6 bg-[#EBF2ED] rounded-2xl border border-[#86E49E] text-center space-y-2">
                    <CheckCircle2 className="w-12 h-12 text-[#2D5A3D] mx-auto animate-bounce" />
                    <h3 className="font-extrabold text-base text-[#172E1E]">تم التحقق وتسجيل الدخول بنجاح!</h3>
                    <p className="text-xs text-[#4A5568]">جاري فتح بيئة التعلم ولوحة التحكم...</p>
                  </div>
                ) : (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    {loginError && (
                      <div className="p-3.5 bg-[#FDF2F2] border border-[#F8D7DA] rounded-2xl flex items-center gap-2.5 text-xs text-[#9C382A] font-bold">
                        <AlertCircle className="w-4 h-4 shrink-0 text-[#9C382A]" />
                        <span>{loginError}</span>
                      </div>
                    )}

                    {/* Email / Username Input */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#1A1C1E]">
                        البريد الإلكتروني أو اسم المستخدم:
                      </label>
                      <input
                        type="text"
                        required
                        value={loginEmailOrName}
                        onChange={(e) => setLoginEmailOrName(e.target.value)}
                        placeholder="ibrahimAlkhooly@gmail.com أو اسم الطالب"
                        className="w-full px-4 py-3 rounded-xl border border-[#C8DEC3] bg-[#F8F9FA] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D5A3D]/25 text-xs font-medium"
                      />
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-[#1A1C1E]">
                          كلمة المرور (Password):
                        </label>
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-4 py-3 pr-10 rounded-xl border border-[#C8DEC3] bg-[#F8F9FA] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D5A3D]/25 text-xs font-mono font-bold"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085] hover:text-[#172E1E] transition-colors cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-[#2D5A3D] hover:bg-[#234730] text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-md shadow-[#2D5A3D]/20 transition-all cursor-pointer"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>تسجيل الدخول إلى المنصة</span>
                    </button>
                  </form>
                )}

                {/* Quick Credentials Box for Easy Access / Review */}
                <div className="pt-2 border-t border-[#E5EAE5] space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-[#172E1E]">
                    <span className="flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-[#2D5A3D]" />
                      بيانات الحسابات المعتمدة للدخول السريع:
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    
                    {/* Dr. Ibrahim Account */}
                    <div className="p-3 rounded-2xl bg-[#F0F5F1] border border-[#C8DEC3] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-[#172E1E] text-[11px] flex items-center gap-1">
                          <GraduationCap className="w-3.5 h-3.5 text-[#2D5A3D]" />
                          د. إبراهيم (أستاذ المقرر)
                        </span>
                        <button
                          type="button"
                          onClick={() => handleFillCredentials('ibrahimAlkhooly@gmail.com', 'DrIbrahim@2026')}
                          className="text-[10px] font-bold text-[#2D5A3D] bg-white px-2 py-0.5 rounded-md border border-[#C8DEC3] hover:bg-[#2D5A3D] hover:text-white transition-colors cursor-pointer"
                        >
                          تعبئة الحساب
                        </button>
                      </div>
                      <div className="text-[10px] text-[#4A5568] space-y-0.5">
                        <div>البريد: <code className="font-bold text-[#172E1E]">ibrahimAlkhooly@gmail.com</code></div>
                        <div className="flex items-center justify-between">
                          <span>الباسوورد: <code className="font-bold text-[#2D5A3D]">DrIbrahim@2026</code></span>
                          <button
                            type="button"
                            onClick={() => copyText('DrIbrahim@2026', 'dr_pass')}
                            className="text-[#667085] hover:text-[#172E1E]"
                            title="نسخ كلمة المرور"
                          >
                            {copiedKey === 'dr_pass' ? <Check className="w-3 h-3 text-[#2D5A3D]" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Student Sample Account */}
                    <div className="p-3 rounded-2xl bg-[#FDF6EC] border border-[#F4E3CB] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-[#4A2E18] text-[11px] flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-[#A2673B]" />
                          سارة أحمد (طالب فردي)
                        </span>
                        <button
                          type="button"
                          onClick={() => handleFillCredentials('sara.ahmed@student.edu.eg', 'student123')}
                          className="text-[10px] font-bold text-[#A2673B] bg-white px-2 py-0.5 rounded-md border border-[#F4E3CB] hover:bg-[#A2673B] hover:text-white transition-colors cursor-pointer"
                        >
                          تعبئة الحساب
                        </button>
                      </div>
                      <div className="text-[10px] text-[#4A5568] space-y-0.5">
                        <div>البريد: <code className="font-bold text-[#172E1E]">sara.ahmed@student.edu.eg</code></div>
                        <div className="flex items-center justify-between">
                          <span>الباسوورد: <code className="font-bold text-[#A2673B]">student123</code></span>
                          <button
                            type="button"
                            onClick={() => copyText('student123', 'student_pass')}
                            className="text-[#667085] hover:text-[#172E1E]"
                            title="نسخ كلمة المرور"
                          >
                            {copiedKey === 'student_pass' ? <Check className="w-3 h-3 text-[#2D5A3D]" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: REGISTRATION FORM */}
            {activeMode === 'register' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-black text-[#172E1E]">إنشاء حساب طالب أو معلم جديد</h2>
                  <p className="text-xs text-[#667085]">
                    انضم إلى منصة التعلم وحدد نمط تعلمك (فردي أو تشاركي)
                  </p>
                </div>

                {regSuccess ? (
                  <div className="p-6 bg-[#EBF2ED] rounded-2xl border border-[#86E49E] text-center space-y-2">
                    <CheckCircle2 className="w-12 h-12 text-[#2D5A3D] mx-auto animate-bounce" />
                    <h3 className="font-extrabold text-base text-[#172E1E]">تم إنشاء الحساب بنجاح!</h3>
                    <p className="text-xs text-[#4A5568]">جاري إعداد مساحتك التعليمية وتسجيل الدخول...</p>
                  </div>
                ) : (
                  <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-[#1A1C1E]">الاسم الكامل:</label>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="مثال: أحمد عبد الله"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#C8DEC3] bg-[#F8F9FA] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D5A3D]/25 text-xs font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-[#1A1C1E]">البريد الإلكتروني:</label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="ahmed@student.edu.eg"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#C8DEC3] bg-[#F8F9FA] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D5A3D]/25 text-xs font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-[#1A1C1E]">كلمة المرور (Password):</label>
                      <div className="relative">
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="كلمة مرور الحساب (افتراضي: student123)"
                          className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-[#C8DEC3] bg-[#F8F9FA] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D5A3D]/25 text-xs font-mono font-bold"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085] hover:text-[#172E1E] transition-colors cursor-pointer"
                        >
                          {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-[#1A1C1E]">نوع الحساب / نمط التعلم:</label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setRegRole('student_individual')}
                          className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                            regRole === 'student_individual'
                              ? 'bg-[#EBF2ED] border-[#2D5A3D] text-[#172E1E] font-bold ring-1 ring-[#2D5A3D]'
                              : 'bg-[#F8F9FA] border-[#E5EAE5] text-[#667085]'
                          }`}
                        >
                          <User className="w-4 h-4 mx-auto mb-1 text-[#2D5A3D]" />
                          <span className="text-[11px] block">طالب فردي</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setRegRole('student_collaborative')}
                          className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                            regRole === 'student_collaborative'
                              ? 'bg-[#FDF6EC] border-[#A2673B] text-[#4A2E18] font-bold ring-1 ring-[#A2673B]'
                              : 'bg-[#F8F9FA] border-[#E5EAE5] text-[#667085]'
                          }`}
                        >
                          <Users className="w-4 h-4 mx-auto mb-1 text-[#A2673B]" />
                          <span className="text-[11px] block">طالب تشاركي</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setRegRole('teacher_admin')}
                          className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                            regRole === 'teacher_admin'
                              ? 'bg-[#FDF2F0] border-[#9C382A] text-[#9C382A] font-bold ring-1 ring-[#9C382A]'
                              : 'bg-[#F8F9FA] border-[#E5EAE5] text-[#667085]'
                          }`}
                        >
                          <GraduationCap className="w-4 h-4 mx-auto mb-1 text-[#9C382A]" />
                          <span className="text-[11px] block">معلم / باحث</span>
                        </button>
                      </div>
                    </div>

                    {regRole === 'student_collaborative' && (
                      <div className="space-y-1 p-2.5 bg-[#FDF6EC] rounded-xl border border-[#F4E3CB]">
                        <label className="block text-[11px] font-bold text-[#4A2E18]">الدور التشاركي في الفريق:</label>
                        <select
                          value={regTeamRole}
                          onChange={(e) => setRegTeamRole(e.target.value as TeamMemberRole)}
                          className="w-full p-2 bg-white rounded-lg border border-[#F4E3CB] text-xs font-bold"
                        >
                          <option value="analyst">محلل المشكلة (Problem Analyst)</option>
                          <option value="designer">مصمم الخوارزمية (Algorithm Designer)</option>
                          <option value="coder">كاتب الكود (Lead Programmer)</option>
                          <option value="tester">المختبر والتوثيق (Tester & QA)</option>
                        </select>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-[#2D5A3D] hover:bg-[#234730] text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-md shadow-[#2D5A3D]/20 transition-all cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>إنشاء الحساب ودخول المنصة</span>
                    </button>
                  </form>
                )}
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-[#E5EAE5] py-4 px-4 text-center text-xs text-[#667085]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            <strong>منصة التعلم الإلكترونية القائمة على المشروعات (EduCode PBL)</strong> • جميع الحقوق محفوظة 2026
          </span>
          <span className="text-[11px] text-[#8FA897]">
            بيئة مخصصة لتنمية مهارات التفكير الحاسوبي والبرمجة التشاركية والفردية
          </span>
        </div>
      </div>

    </div>
  );
};
