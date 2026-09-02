// components/common/AuthModal.tsx
import React, { useState } from 'react';
import { 
  X, 
  UserCheck, 
  UserPlus, 
  LogIn, 
  GraduationCap, 
  Users, 
  User, 
  CheckCircle2, 
  Sparkles,
  Shield,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole, ExperimentalGroup, TeamMemberRole } from '../../types/schema';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login'
}) => {
  const { allUsers, loginWithCredentials, registerNewUser, currentUser } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);

  // Login State
  const [loginIdentifier, setLoginIdentifier] = useState(currentUser?.email || 'ibrahimAlkhooly@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [copiedDoctorPass, setCopiedDoctorPass] = useState(false);

  // Registration Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('student_individual');
  const [teamRole, setTeamRole] = useState<TeamMemberRole>('coder');
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginIdentifier.trim()) {
      setLoginError('يرجى إدخال البريد الإلكتروني أو اسم المستخدم.');
      return;
    }
    if (!loginPassword.trim()) {
      setLoginError('يرجى إدخال كلمة المرور.');
      return;
    }

    const result = loginWithCredentials(loginIdentifier, loginPassword);
    if (result.success) {
      setLoginSuccess(true);
      setTimeout(() => {
        setLoginSuccess(false);
        onClose();
      }, 700);
    } else {
      setLoginError(result.message || 'بيانات الدخول غير صحيحة');
    }
  };

  const handleSelectAccountForLogin = (userEmail: string, userDefaultPass?: string) => {
    setLoginIdentifier(userEmail);
    if (userDefaultPass) {
      setLoginPassword(userDefaultPass);
    } else {
      setLoginPassword('');
    }
    setLoginError(null);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    const group: ExperimentalGroup = role === 'student_collaborative' 
      ? 'collaborative_group' 
      : 'individual_group';

    registerNewUser(
      fullName.trim(),
      email.trim(),
      role,
      group,
      role === 'student_collaborative' ? teamRole : undefined,
      regPassword.trim() || (role === 'teacher_admin' ? 'teacher123' : 'student123')
    );

    setRegisteredSuccess(true);
    setTimeout(() => {
      setRegisteredSuccess(false);
      onClose();
    }, 1200);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDoctorPass(true);
    setTimeout(() => setCopiedDoctorPass(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#111C14]/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#C8DEC3] space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5EAE5] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#EBF2ED] border border-[#C8DEC3] flex items-center justify-center text-[#2D5A3D]">
              {mode === 'login' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#1A1C1E]">
                {mode === 'login' ? 'تسجيل الدخول إلى المنصة' : 'إنشاء حساب طالب أو معلم جديد'}
              </h2>
              <p className="text-[11px] text-[#667085]">
                {mode === 'login' 
                  ? 'أدخل بيانات المرور الخاصة بحسابك للوصول إلى بيئة التعلم' 
                  : 'أدخل بياناتك وكلمة المرور للانضمام إلى منصة التعلم'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#667085] hover:bg-[#F8F9FA] hover:text-[#1A1C1E] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="flex items-center p-1 bg-[#F0F2F0] rounded-xl">
          <button
            type="button"
            onClick={() => { setMode('login'); setLoginError(null); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-[#172E1E] shadow-xs'
                : 'text-[#667085] hover:text-[#172E1E]'
            }`}
          >
            تسجيل الدخول بالباسوورد
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setLoginError(null); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-[#172E1E] shadow-xs'
                : 'text-[#667085] hover:text-[#172E1E]'
            }`}
          >
            تسجيل مستخدم جديد
          </button>
        </div>

        {/* LOGIN MODE */}
        {mode === 'login' && (
          <div className="space-y-4">
            {loginSuccess ? (
              <div className="p-6 bg-[#EBF2ED] rounded-2xl border border-[#86E49E] text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#2D5A3D] mx-auto animate-bounce" />
                <h3 className="font-extrabold text-sm text-[#172E1E]">تم التحقق وتسجيل الدخول بنجاح!</h3>
                <p className="text-xs text-[#4A5568]">جاري توجيهك إلى لوحة التحكم...</p>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                {loginError && (
                  <div className="p-3 bg-[#FDF2F2] border border-[#F8D7DA] rounded-xl flex items-center gap-2 text-xs text-[#9C382A] font-semibold">
                    <AlertCircle className="w-4 h-4 shrink-0 text-[#9C382A]" />
                    <span>{loginError}</span>
                  </div>
                )}

                {/* Teacher Credentials Quick Box */}
                <div className="p-3.5 bg-[#F0F5F1] rounded-2xl border border-[#C8DEC3] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#172E1E]">
                      <Shield className="w-4 h-4 text-[#2D5A3D]" />
                      <span>بيانات حساب المشرف والأستاذ د. إبراهيم:</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectAccountForLogin('ibrahimAlkhooly@gmail.com', 'DrIbrahim@2026')}
                      className="text-[11px] font-bold text-[#2D5A3D] hover:underline cursor-pointer bg-white px-2 py-0.5 rounded-lg border border-[#C8DEC3]"
                    >
                      تعبئة تلقائية للبيانات
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-white/80 p-2 rounded-lg border border-[#E5EAE5]">
                      <span className="text-[#667085] block">البريد:</span>
                      <code className="font-mono font-bold text-[#172E1E]">ibrahimAlkhooly@gmail.com</code>
                    </div>
                    <div className="bg-white/80 p-2 rounded-lg border border-[#E5EAE5] flex items-center justify-between">
                      <div>
                        <span className="text-[#667085] block">كلمة المرور:</span>
                        <code className="font-mono font-bold text-[#2D5A3D]">DrIbrahim@2026</code>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('DrIbrahim@2026')}
                        className="p-1 text-[#667085] hover:text-[#172E1E] transition-colors"
                        title="نسخ كلمة المرور"
                      >
                        {copiedDoctorPass ? <Check className="w-3.5 h-3.5 text-[#2D5A3D]" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#1A1C1E]">
                    البريد الإلكتروني أو اسم المستخدم:
                  </label>
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="مثال: ibrahimAlkhooly@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#C8DEC3] bg-[#F8F9FA] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D5A3D]/20 text-xs font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[#1A1C1E]">
                      كلمة المرور (Password):
                    </label>
                    <span className="text-[10px] text-[#667085]">
                      (للمعلم: DrIbrahim@2026 | للطلاب: student123)
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-[#C8DEC3] bg-[#F8F9FA] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D5A3D]/20 text-xs font-medium font-mono"
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
                  className="w-full py-2.5 rounded-xl bg-[#2D5A3D] hover:bg-[#234730] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>دخول إلى الحساب</span>
                </button>

                {/* Available Accounts Quick List */}
                {allUsers.length > 0 && (
                  <div className="pt-2 border-t border-[#E5EAE5] space-y-2">
                    <div className="text-[11px] font-bold text-[#667085]">
                      أو اختر حساباً مسجلاً لتعبئة بياناته:
                    </div>
                    <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                      {allUsers.map((user) => {
                        const isCurrent = user.id === currentUser.id;
                        const isTeacher = user.role === 'teacher_admin';
                        return (
                          <div
                            key={user.id}
                            onClick={() => handleSelectAccountForLogin(user.email, user.password || (isTeacher ? 'DrIbrahim@2026' : 'student123'))}
                            className={`p-2 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer text-xs ${
                              loginIdentifier.toLowerCase() === user.email.toLowerCase()
                                ? 'bg-[#EBF2ED] border-[#86E49E]'
                                : 'bg-[#F8F9FA] hover:bg-[#F0F5F1] border-[#E5EAE5]'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-7 h-7 rounded-full border border-white"
                              />
                              <div>
                                <span className="font-bold text-xs text-[#1A1C1E] block">{user.name}</span>
                                <span className="text-[10px] text-[#667085] block">{user.email}</span>
                              </div>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              isTeacher ? 'bg-[#FDF2F2] text-[#9C382A] border-[#F8D7DA]' : 'bg-[#F0F5F1] text-[#2D5A3D] border-[#C8DEC3]'
                            }`}>
                              {isTeacher ? 'معلم / باحث' : 'طالب'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        )}

        {/* REGISTER MODE */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            {registeredSuccess ? (
              <div className="p-6 bg-[#EBF2ED] rounded-2xl border border-[#86E49E] text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#2D5A3D] mx-auto animate-bounce" />
                <h3 className="font-extrabold text-sm text-[#172E1E]">تم إنشاء الحساب وتسجيل الدخول بنجاح!</h3>
                <p className="text-xs text-[#4A5568]">جاري نقلك إلى بيئة التعلم الخاصة بك...</p>
              </div>
            ) : (
              <>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#1A1C1E]">الاسم الكامل:</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="مثال: أحمد محمد عبد الله"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#C8DEC3] bg-[#F8F9FA] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D5A3D]/20 text-xs font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#1A1C1E]">البريد الإلكتروني / الرقم الأكاديمي:</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@educode.edu.eg"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#C8DEC3] bg-[#F8F9FA] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D5A3D]/20 text-xs font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#1A1C1E]">كلمة المرور (Password):</label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="كلمة مرور الحساب (افتراضي: student123)"
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-[#C8DEC3] bg-[#F8F9FA] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D5A3D]/20 text-xs font-medium font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085] hover:text-[#1A1C1E] transition-colors cursor-pointer"
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#1A1C1E]">نوع الحساب / النمط التعليمي:</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('student_individual')}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        role === 'student_individual'
                          ? 'bg-[#EBF2ED] border-[#2D5A3D] text-[#172E1E] font-bold shadow-2xs'
                          : 'bg-[#F8F9FA] border-[#E5EAE5] text-[#667085]'
                      }`}
                    >
                      <User className="w-4 h-4 mx-auto mb-1 text-[#2D5A3D]" />
                      <span className="text-[11px] block">طالب فردي</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('student_collaborative')}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        role === 'student_collaborative'
                          ? 'bg-[#FDF6EC] border-[#A2673B] text-[#4A2E18] font-bold shadow-2xs'
                          : 'bg-[#F8F9FA] border-[#E5EAE5] text-[#667085]'
                      }`}
                    >
                      <Users className="w-4 h-4 mx-auto mb-1 text-[#A2673B]" />
                      <span className="text-[11px] block">طالب تشاركي</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('teacher_admin')}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        role === 'teacher_admin'
                          ? 'bg-[#FDF2F2] border-[#9C382A] text-[#9C382A] font-bold shadow-2xs'
                          : 'bg-[#F8F9FA] border-[#E5EAE5] text-[#667085]'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4 mx-auto mb-1 text-[#9C382A]" />
                      <span className="text-[11px] block">معلم ومشرف</span>
                    </button>
                  </div>
                </div>

                {/* Collaborative Team Role Selection */}
                {role === 'student_collaborative' && (
                  <div className="space-y-1.5 p-3 rounded-xl bg-[#FDF6EC] border border-[#F4E3CB]">
                    <label className="block text-[11px] font-bold text-[#4A2E18]">
                      اختر دورك المفضل داخل الفريق:
                    </label>
                    <select
                      value={teamRole}
                      onChange={(e) => setTeamRole(e.target.value as TeamMemberRole)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E8DCCB] text-xs font-bold text-[#1A1C1E] focus:outline-none"
                    >
                      <option value="analyst">محلل المشكلة (Problem Analyst)</option>
                      <option value="designer">مصمم الخوارزمية (Algorithm Designer)</option>
                      <option value="coder">كاتب الكود (Lead Programmer)</option>
                      <option value="tester">المختبر والموثق (Tester & QA)</option>
                    </select>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="px-4 py-2.5 rounded-xl border border-[#E5EAE5] text-xs font-bold text-[#667085] hover:bg-[#F8F9FA] cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#2D5A3D] hover:bg-[#234730] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>تأكيد الحساب والدخول</span>
                  </button>
                </div>
              </>
            )}
          </form>
        )}

      </div>
    </div>
  );
};

