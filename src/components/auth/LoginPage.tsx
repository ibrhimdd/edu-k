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
    <div className="min-h-screen bg-[#0e1b14] text-white flex flex-col justify-between selection:bg-[#355834] selection:text-[#355834]" dir="rtl">
      
      {/* Top Academic Ribbon */}
      <div className="bg-[#14281d] text-[#c2a878] text-xs py-2 px-4 sm:px-8 border-b border-[#355834] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-[#355834] text-white px-2 py-0.5 rounded font-bold text-[11px] border border-[#c2a878]/50">
            EduCode PBL Portal
          </span>
          <span className="font-semibold hidden sm:inline text-white/90">
            بوابة الدخول إلى منصة التعلم الإلكترونية القائمة على المشروعات
          </span>
        </div>
        <div className="text-[11px] text-[#c2a878] flex items-center gap-2">
          <GraduationCap className="w-3.5 h-3.5 text-[#c2a878]" />
          <span>المشرف العام: د. محمد رضوان أبو حشيش</span>
        </div>
      </div>

      {/* Main Authentication Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Platform Branding & Highlights */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#14281d] via-[#14281d] to-[#0e1b14] rounded-3xl p-6 sm:p-8 text-white border border-[#355834] shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#355834]/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#c2a878]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#355834] to-[#6e633d] text-white flex items-center justify-center font-black shadow-lg shadow-[#355834]/30 border border-[#c2a878]/30">
                  <Code2 className="w-7 h-7 text-[#c2a878]" />
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight text-white">منصة EduCode البرمجية</h1>
                  <span className="text-[11px] text-[#c2a878] font-semibold block">بيئة المشروعات والذكاء الاصطناعي</span>
                </div>
              </div>

              {/* Research & Platform Statement */}
              <div className="space-y-3 pt-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0e1b14] border border-[#c2a878]/50 text-[#c2a878] text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-[#c2a878]" />
                  <span>نظام التعلم القائم على المشروعات (PBL)</span>
                </div>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                  أهلاً بك في البيئة التفاعلية لدراسة البرمجة وتنمية مهارات التفكير الحسابي، وحل المشكلات عبر بيئات التعلم الفردي والتعلم التشاركي.
                </p>
              </div>

              {/* Feature Pills */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2.5 text-xs text-white/90 bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <Terminal className="w-4 h-4 text-[#c2a878] shrink-0" />
                  <span>محرر أكواد حي (Python / JavaScript) مع تنفيذ فوري</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-white/90 bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <Cpu className="w-4 h-4 text-[#c2a878] shrink-0" />
                  <span>معلم سقراطي بالذكاء الاصطناعي يقدم التوجيه دون كشف الحل</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-white/90 bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <Users className="w-4 h-4 text-[#c2a878] shrink-0" />
                  <span>مجموعات تشاركية بأدوار متخصصة (محلل، مصمم، مبرمج، مختبر)</span>
                </div>
              </div>
            </div>

            {/* Bottom Citation & Arch Button */}
            <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-[#c2a878]">
              <span>إشراف: د. محمد رضوان أبو حشيش • تطوير: إبراهيم الخولي</span>
              {onOpenArchitecture && (
                <button
                  type="button"
                  onClick={onOpenArchitecture}
                  className="text-white hover:text-[#c2a878] font-bold underline transition-colors cursor-pointer"
                >
                  مخطط النظام ↗
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Authentication Card */}
          <div className="lg:col-span-7 bg-[#14281d] rounded-3xl p-6 sm:p-8 border border-[#355834] shadow-xl flex flex-col justify-center space-y-6 text-white">
            
            {/* Mode Switcher Tabs */}
            <div className="flex items-center p-1 bg-[#0e1b14] rounded-2xl border border-[#355834]">
              <button
                type="button"
                onClick={() => { setActiveMode('login'); setLoginError(null); }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeMode === 'login'
                    ? 'bg-[#355834] text-white shadow-sm border border-[#6e633d]'
                    : 'text-[#c2a878] hover:text-white'
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
                    ? 'bg-[#355834] text-white shadow-sm border border-[#6e633d]'
                    : 'text-[#c2a878] hover:text-white'
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
                  <h2 className="text-lg font-black text-white">تسجيل الدخول إلى حسابك</h2>
                  <p className="text-xs text-[#c2a878]">
                    أدخل البريد الإلكتروني وكلمة المرور الخاصة بك للوصول إلى لوحة التعلم
                  </p>
                </div>

                {loginSuccess ? (
                  <div className="p-6 bg-[#0e1b14] rounded-2xl border border-[#355834] text-center space-y-2">
                    <CheckCircle2 className="w-12 h-12 text-[#c2a878] mx-auto animate-bounce" />
                    <h3 className="font-extrabold text-base text-white">تم التحقق وتسجيل الدخول بنجاح!</h3>
                    <p className="text-xs text-[#355834]/80">جاري فتح بيئة التعلم ولوحة التحكم...</p>
                  </div>
                ) : (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    {loginError && (
                      <div className="p-3.5 bg-red-950/60 border border-red-800 rounded-2xl flex items-center gap-2.5 text-xs text-red-200 font-bold">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-300" />
                        <span>{loginError}</span>
                      </div>
                    )}

                    {/* Email / Username Input */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-white">
                        البريد الإلكتروني أو اسم المستخدم:
                      </label>
                      <input
                        type="text"
                        required
                        value={loginEmailOrName}
                        onChange={(e) => setLoginEmailOrName(e.target.value)}
                        placeholder="ibrahimAlkhooly@gmail.com أو اسم الطالب"
                        className="w-full px-4 py-3 rounded-xl border border-[#355834] bg-[#0e1b14] focus:border-[#c2a878] focus:outline-none focus:ring-2 focus:ring-[#355834]/40 text-xs text-white font-medium"
                      />
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-white">
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
                          className="w-full px-4 py-3 pr-10 rounded-xl border border-[#355834] bg-[#0e1b14] focus:border-[#c2a878] focus:outline-none focus:ring-2 focus:ring-[#355834]/40 text-xs text-white font-mono font-bold"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c2a878] hover:text-white transition-colors cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-[#355834] hover:bg-[#6e633d] text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-md shadow-[#355834]/30 transition-all cursor-pointer border border-[#6e633d]"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>تسجيل الدخول إلى المنصة</span>
                    </button>
                  </form>
                )}

                {/* Quick Credentials Box for Easy Access / Review */}
                <div className="pt-2 border-t border-[#355834] space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span className="flex items-center gap-1.5 text-[#c2a878]">
                      <Shield className="w-4 h-4 text-[#c2a878]" />
                      بيانات الحسابات المعتمدة للدخول السريع:
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    
                    {/* Developer & Admin Account */}
                    <div className="p-3 rounded-2xl bg-[#0e1b14] border border-[#355834] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-[#c2a878] text-[11px] flex items-center gap-1">
                          <GraduationCap className="w-3.5 h-3.5 text-[#c2a878]" />
                          إبراهيم الخولي (المطور والباحث)
                        </span>
                        <button
                          type="button"
                          onClick={() => handleFillCredentials('ibrahimAlkhooly@gmail.com', 'DrIbrahim@2026')}
                          className="text-[10px] font-bold text-white bg-[#355834] px-2 py-0.5 rounded-md border border-[#c2a878]/50 hover:bg-[#14281d] transition-colors cursor-pointer"
                        >
                          تعبئة الحساب
                        </button>
                      </div>
                      <div className="text-[10px] text-white/80 space-y-0.5">
                        <div>البريد: <code className="font-bold text-white">ibrahimAlkhooly@gmail.com</code></div>
                        <div className="flex items-center justify-between">
                          <span>الباسوورد: <code className="font-bold text-[#c2a878]">DrIbrahim@2026</code></span>
                          <button
                            type="button"
                            onClick={() => copyText('DrIbrahim@2026', 'dr_pass')}
                            className="text-[#c2a878] hover:text-white"
                            title="نسخ كلمة المرور"
                          >
                            {copiedKey === 'dr_pass' ? <Check className="w-3 h-3 text-[#c2a878]" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Student Sample Account */}
                    <div className="p-3 rounded-2xl bg-[#0e1b14] border border-[#355834] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-[#c2a878] text-[11px] flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-[#c2a878]" />
                          سارة أحمد (طالب فردي)
                        </span>
                        <button
                          type="button"
                          onClick={() => handleFillCredentials('sara.ahmed@student.edu.eg', 'student123')}
                          className="text-[10px] font-bold text-white bg-[#355834] px-2 py-0.5 rounded-md border border-[#c2a878]/50 hover:bg-[#14281d] transition-colors cursor-pointer"
                        >
                          تعبئة الحساب
                        </button>
                      </div>
                      <div className="text-[10px] text-white/80 space-y-0.5">
                        <div>البريد: <code className="font-bold text-white">sara.ahmed@student.edu.eg</code></div>
                        <div className="flex items-center justify-between">
                          <span>الباسوورد: <code className="font-bold text-[#c2a878]">student123</code></span>
                          <button
                            type="button"
                            onClick={() => copyText('student123', 'student_pass')}
                            className="text-[#c2a878] hover:text-white"
                            title="نسخ كلمة المرور"
                          >
                            {copiedKey === 'student_pass' ? <Check className="w-3 h-3 text-[#c2a878]" /> : <Copy className="w-3 h-3" />}
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
                  <h2 className="text-lg font-black text-white">إنشاء حساب طالب أو معلم جديد</h2>
                  <p className="text-xs text-[#c2a878]">
                    انضم إلى منصة التعلم وحدد نمط تعلمك (فردي أو تشاركي)
                  </p>
                </div>

                {regSuccess ? (
                  <div className="p-6 bg-[#0e1b14] rounded-2xl border border-[#355834] text-center space-y-2">
                    <CheckCircle2 className="w-12 h-12 text-[#c2a878] mx-auto animate-bounce" />
                    <h3 className="font-extrabold text-base text-white">تم إنشاء الحساب بنجاح!</h3>
                    <p className="text-xs text-[#355834]/80">جاري إعداد مساحتك التعليمية وتسجيل الدخول...</p>
                  </div>
                ) : (
                  <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-white">الاسم الكامل:</label>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="مثال: أحمد عبد الله"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#355834] bg-[#0e1b14] focus:border-[#c2a878] focus:outline-none focus:ring-2 focus:ring-[#355834]/40 text-xs text-white font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-white">البريد الإلكتروني:</label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="ahmed@student.edu.eg"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#355834] bg-[#0e1b14] focus:border-[#c2a878] focus:outline-none focus:ring-2 focus:ring-[#355834]/40 text-xs text-white font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-white">كلمة المرور (Password):</label>
                      <div className="relative">
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="كلمة مرور الحساب (افتراضي: student123)"
                          className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-[#355834] bg-[#0e1b14] focus:border-[#c2a878] focus:outline-none focus:ring-2 focus:ring-[#355834]/40 text-xs text-white font-mono font-bold"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c2a878] hover:text-white transition-colors cursor-pointer"
                        >
                          {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-white">نوع الحساب / نمط التعلم:</label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setRegRole('student_individual')}
                          className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                            regRole === 'student_individual'
                              ? 'bg-[#355834] border-[#6e633d] text-white font-bold ring-1 ring-[#c2a878]'
                              : 'bg-[#0e1b14] border-[#355834] text-[#c2a878]'
                          }`}
                        >
                          <User className="w-4 h-4 mx-auto mb-1 text-[#c2a878]" />
                          <span className="text-[11px] block">طالب فردي</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setRegRole('student_collaborative')}
                          className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                            regRole === 'student_collaborative'
                              ? 'bg-[#355834] border-[#6e633d] text-white font-bold ring-1 ring-[#c2a878]'
                              : 'bg-[#0e1b14] border-[#355834] text-[#c2a878]'
                          }`}
                        >
                          <Users className="w-4 h-4 mx-auto mb-1 text-[#c2a878]" />
                          <span className="text-[11px] block">طالب تشاركي</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setRegRole('teacher_admin')}
                          className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                            regRole === 'teacher_admin'
                              ? 'bg-[#6e633d] border-[#c2a878] text-white font-bold ring-1 ring-[#c2a878]'
                              : 'bg-[#0e1b14] border-[#355834] text-[#c2a878]'
                          }`}
                        >
                          <GraduationCap className="w-4 h-4 mx-auto mb-1 text-[#c2a878]" />
                          <span className="text-[11px] block">معلم / باحث</span>
                        </button>
                      </div>
                    </div>

                    {regRole === 'student_collaborative' && (
                      <div className="space-y-1 p-2.5 bg-[#0e1b14] rounded-xl border border-[#355834]">
                        <label className="block text-[11px] font-bold text-[#c2a878]">الدور التشاركي في الفريق:</label>
                        <select
                          value={regTeamRole}
                          onChange={(e) => setRegTeamRole(e.target.value as TeamMemberRole)}
                          className="w-full p-2 bg-[#14281d] text-white rounded-lg border border-[#355834] text-xs font-bold"
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
                      className="w-full py-3 rounded-xl bg-[#355834] hover:bg-[#6e633d] text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-md shadow-[#355834]/30 transition-all cursor-pointer border border-[#6e633d]"
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
      <div className="bg-[#14281d] border-t border-[#355834] py-4 px-4 text-center text-xs text-[#c2a878]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-[#f3f4f6]">
            <strong>منصة التعلم الإلكترونية القائمة على المشروعات (EduCode PBL)</strong> • جميع الحقوق محفوظة للدفلبر إبراهيم الخولي © 2026
          </span>
          <span className="text-[11px] text-[#c2a878] font-bold">
            المشرف العام: د. محمد رضوان أبو حشيش
          </span>
        </div>
      </div>

    </div>
  );
};
