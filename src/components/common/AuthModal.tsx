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
  BookOpen,
  ArrowRight
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
  const { allUsers, switchUser, registerNewUser, currentUser } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);

  // Registration Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('student_individual');
  const [teamRole, setTeamRole] = useState<TeamMemberRole>('coder');
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  if (!isOpen) return null;

  const handleQuickLogin = (userId: string) => {
    switchUser(userId);
    onClose();
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
      role === 'student_collaborative' ? teamRole : undefined
    );

    setRegisteredSuccess(true);
    setTimeout(() => {
      setRegisteredSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#111C14]/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#C8DEC3] space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
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
                  ? 'اختر حسابك المعتمد أو قم بالتبديل السريع' 
                  : 'أدخل بياناتك للانضمام إلى منصة التعلم القائمة على المشروعات'}
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
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-[#172E1E] shadow-xs'
                : 'text-[#667085] hover:text-[#172E1E]'
            }`}
          >
            الدخول بالحسابات المتاحة
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
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
            <div className="text-xs text-[#667085]">الحسابات المسجلة في النظام:</div>
            
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {allUsers.map((user) => {
                const isCurrent = user.id === currentUser.id;
                const isTeacher = user.role === 'teacher_admin';
                const isCollab = user.role === 'student_collaborative';

                return (
                  <button
                    key={user.id}
                    onClick={() => handleQuickLogin(user.id)}
                    className={`w-full p-3 rounded-2xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                      isCurrent
                        ? 'bg-[#EBF2ED] border-[#86E49E] ring-2 ring-[#2D5A3D]/20'
                        : 'bg-[#F8F9FA] hover:bg-[#F0F5F1] border-[#E5EAE5]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full border border-white shadow-2xs"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#1A1C1E]">{user.name}</span>
                          {isCurrent && (
                            <span className="text-[10px] bg-[#2D5A3D] text-white px-1.5 py-0.2 rounded font-bold">
                              الحالي
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#667085] block">{user.email}</span>
                      </div>
                    </div>

                    <div className="text-left">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isTeacher
                          ? 'bg-[#FDF2F2] text-[#9C382A] border-[#F8D7DA]'
                          : isCollab
                            ? 'bg-[#FDF6EC] text-[#9C6644] border-[#F4E3CB]'
                            : 'bg-[#F0F5F1] text-[#2D5A3D] border-[#C8DEC3]'
                      }`}>
                        {isTeacher 
                          ? 'معلم وباحث' 
                          : isCollab 
                            ? `تشاركي (${user.teamRole || 'عضو'})` 
                            : 'طالب فردي'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setMode('register')}
                className="text-xs font-bold text-[#2D5A3D] hover:underline"
              >
                + إنشاء حساب طالب أو معلم باسم جديد
              </button>
            </div>
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
