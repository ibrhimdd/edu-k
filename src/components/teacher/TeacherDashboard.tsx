// components/teacher/TeacherDashboard.tsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RubricViewer } from '../common/RubricViewer';
import { MonacoCodeEditor } from '../common/MonacoCodeEditor';
import { StatisticalReportView } from './StatisticalReportView';
import { EngagementScaleView } from '../student/EngagementScaleView';
import { 
  Users, 
  User, 
  GraduationCap, 
  FolderGit2, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  Sparkles, 
  MessageSquare, 
  TrendingUp, 
  FileText, 
  Plus, 
  Send, 
  BookOpen, 
  Filter,
  BarChart3,
  Search,
  Check,
  Edit3,
  Trash2,
  Upload,
  UserPlus,
  RefreshCw,
  X,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Layers,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Scale
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, ExperimentalGroup, TeamMemberRole, UserRole } from '../../types/schema';

export const TeacherDashboard: React.FC = () => {
  const { 
    currentUser,
    allUsers, 
    projects, 
    submissions, 
    teams, 
    gradeSubmission, 
    updateStudentGroupAndRole,
    createNewTeam,
    addNewStudent,
    bulkAddStudents,
    addNewTeacher,
    deleteUser,
    updateUser,
    deleteTeam,
    resetAllDataToClean
  } = useApp();

  const [activeTeacherTab, setActiveTeacherTab] = useState<'students' | 'grading' | 'teams' | 'analytics' | 'engagement'>('students');
  
  // Grading Modal / State
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string>(submissions[0]?.id || '');
  const [currentRubricScores, setCurrentRubricScores] = useState<Record<string, number>>({});
  const [teacherFeedbackText, setTeacherFeedbackText] = useState<string>('');
  const [lineCommentText, setLineCommentText] = useState<string>('');
  const [lineCommentNum, setLineCommentNum] = useState<number>(1);
  const [addedLineComments, setAddedLineComments] = useState<{ lineNumber: number; comment: string; authorName: string; createdAt: string }[]>([]);
  const [gradeSavedToast, setGradeSavedToast] = useState<boolean>(false);

  // Filter students
  const [groupFilter, setGroupFilter] = useState<'all' | 'individual_group' | 'collaborative_group' | 'teacher_admin'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [showNewTeamModal, setShowNewTeamModal] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  // Password visibility and copying states
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [copiedPassUserId, setCopiedPassUserId] = useState<string | null>(null);

  // Single Student Form State
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentPassword, setNewStudentPassword] = useState('');
  const [newStudentIdNum, setNewStudentIdNum] = useState('');
  const [newStudentGroup, setNewStudentGroup] = useState<ExperimentalGroup>('individual_group');
  const [newStudentTeamId, setNewStudentTeamId] = useState<string>('');
  const [newStudentTeamRole, setNewStudentTeamRole] = useState<TeamMemberRole>('coder');

  // Bulk Import State
  const [bulkText, setBulkText] = useState('');
  const [bulkImportSuccessCount, setBulkImportSuccessCount] = useState<number | null>(null);

  // Teacher Form State
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherPassword, setNewTeacherPassword] = useState('');
  const [newTeacherTitle, setNewTeacherTitle] = useState('أستاذ مساعد / مشرف مشارك');

  // Edit User State
  const [editUserName, setEditUserName] = useState('');
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserPassword, setEditUserPassword] = useState('');
  const [editUserGroup, setEditUserGroup] = useState<ExperimentalGroup>('individual_group');
  const [editUserTeamRole, setEditUserTeamRole] = useState<TeamMemberRole>('coder');
  const [editUserTeamId, setEditUserTeamId] = useState<string>('');

  // New Team Modal State
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDesc, setNewTeamDesc] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  const selectedSubmission = submissions.find(s => s.id === selectedSubmissionId);
  const submissionProject = projects.find(p => p.id === selectedSubmission?.projectId) || projects[0];

  // Initialize grading state when selecting a submission
  const handleSelectSubmission = (subId: string) => {
    setSelectedSubmissionId(subId);
    const sub = submissions.find(s => s.id === subId);
    if (sub) {
      setCurrentRubricScores(sub.rubricScores || {
        rubric_analysis: 4,
        rubric_design: 4,
        rubric_code_syntax: 4,
        rubric_correctness: 4,
        rubric_quality: 3,
        rubric_testing: 4,
        rubric_documentation: 3
      });
      setTeacherFeedbackText(sub.teacherGeneralFeedback || '');
      setAddedLineComments(sub.codeLineComments || []);
    }
  };

  const handleRubricScoreSelect = (criterionId: string, score: number) => {
    setCurrentRubricScores(prev => ({ ...prev, [criterionId]: score }));
  };

  const calculateTotalCalculatedScore = () => {
    let total = 0;
    submissionProject.rubricCriteria.forEach(c => {
      const score = currentRubricScores[c.id] || 0;
      const weighted = (score / 4) * c.weight;
      total += weighted;
    });
    return Math.round(total);
  };

  const handleSaveGrade = () => {
    if (!selectedSubmission) return;
    const finalScore = calculateTotalCalculatedScore();
    gradeSubmission(
      selectedSubmission.id,
      currentRubricScores,
      finalScore,
      teacherFeedbackText,
      addedLineComments
    );

    setGradeSavedToast(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    setTimeout(() => setGradeSavedToast(false), 3000);
  };

  const handleAddLineComment = () => {
    if (!lineCommentText.trim()) return;
    setAddedLineComments(prev => [
      ...prev,
      {
        lineNumber: lineCommentNum,
        comment: lineCommentText,
        authorName: currentUser.name,
        createdAt: new Date().toISOString()
      }
    ]);
    setLineCommentText('');
  };

  const handleCreateTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim() || selectedMemberIds.length === 0) return;
    createNewTeam(newTeamName, newTeamDesc, selectedMemberIds);
    setNewTeamName('');
    setNewTeamDesc('');
    setSelectedMemberIds([]);
    setShowNewTeamModal(false);
  };

  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentEmail.trim()) return;
    addNewStudent({
      name: newStudentName.trim(),
      email: newStudentEmail.trim(),
      password: newStudentPassword.trim() || 'student123',
      studentIdNum: newStudentIdNum.trim(),
      group: newStudentGroup,
      teamId: newStudentGroup === 'collaborative_group' ? newStudentTeamId : undefined,
      teamRole: newStudentGroup === 'collaborative_group' ? newStudentTeamRole : undefined
    });
    setNewStudentName('');
    setNewStudentEmail('');
    setNewStudentPassword('');
    setNewStudentIdNum('');
    setShowAddStudentModal(false);
  };

  const handleBulkImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkText.trim()) return;

    // Parse lines: Format: Name, Email, Group (individual / collaborative), Role, Password
    const lines = bulkText.split('\n').filter(l => l.trim().length > 0);
    const parsedList: Array<{
      name: string;
      email: string;
      password?: string;
      group: ExperimentalGroup;
      teamRole?: TeamMemberRole;
    }> = [];

    lines.forEach(line => {
      const parts = line.split(',').map(p => p.trim());
      if (parts.length >= 2) {
        const name = parts[0];
        const email = parts[1];
        const rawGroup = parts[2]?.toLowerCase() || '';
        const group: ExperimentalGroup = (rawGroup.includes('تشاركي') || rawGroup.includes('collab') || rawGroup === '2') 
          ? 'collaborative_group' 
          : 'individual_group';
        
        let teamRole: TeamMemberRole = 'coder';
        let customPassword = 'student123';

        if (parts.length >= 4) {
          const rawRoleOrPass = parts[3]?.toLowerCase() || '';
          if (rawRoleOrPass.includes('محلل') || rawRoleOrPass.includes('analyst')) teamRole = 'analyst';
          else if (rawRoleOrPass.includes('مصمم') || rawRoleOrPass.includes('design')) teamRole = 'designer';
          else if (rawRoleOrPass.includes('مختبر') || rawRoleOrPass.includes('test')) teamRole = 'tester';
          else if (rawRoleOrPass.includes('مبرمج') || rawRoleOrPass.includes('coder')) teamRole = 'coder';
          else customPassword = parts[3];
        }

        if (parts.length >= 5 && parts[4]) {
          customPassword = parts[4].trim();
        }

        parsedList.push({ name, email, group, teamRole, password: customPassword });
      }
    });

    if (parsedList.length > 0) {
      const res = bulkAddStudents(parsedList);
      setBulkImportSuccessCount(res.count);
      setTimeout(() => {
        setBulkImportSuccessCount(null);
        setBulkText('');
        setShowBulkImportModal(false);
      }, 1500);
    }
  };

  const loadSampleBulkTemplate = () => {
    setBulkText(
`أحمد مصطفى محمود, ahmed.mustafa@university.edu.eg, فردي, coder, pass1234
سارة عبد العزيز, sara.aziz@university.edu.eg, فردي, designer, pass1234
محمد خالد الشريف, mohamed.khaled@university.edu.eg, تشاركي, analyst, pass1234
فاطمة إبراهيم العلي, fatima.ali@university.edu.eg, تشاركي, designer, pass1234
يوسف حسن الدوسري, yousef.hassan@university.edu.eg, تشاركي, coder, pass1234
مريم عبد الرحمن, maryam.abdelrahman@university.edu.eg, تشاركي, tester, pass1234`
    );
  };

  const handleAddTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName.trim() || !newTeacherEmail.trim()) return;
    addNewTeacher({
      name: newTeacherName.trim(),
      email: newTeacherEmail.trim(),
      password: newTeacherPassword.trim() || 'teacher123',
      title: newTeacherTitle.trim()
    });
    setNewTeacherName('');
    setNewTeacherEmail('');
    setNewTeacherPassword('');
    setShowAddTeacherModal(false);
  };

  const handleOpenEditUser = (user: UserProfile) => {
    setEditingUser(user);
    setEditUserName(user.name);
    setEditUserEmail(user.email);
    setEditUserPassword(user.password || (user.role === 'teacher_admin' ? 'DrIbrahim@2026' : 'student123'));
    setEditUserGroup(user.experimentalGroup);
    setEditUserTeamRole(user.teamRole || 'coder');
    setEditUserTeamId(user.teamId || '');
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    updateUser(editingUser.id, {
      name: editUserName.trim(),
      email: editUserEmail.trim(),
      password: editUserPassword.trim(),
      experimentalGroup: editUserGroup,
      teamRole: editUserGroup === 'collaborative_group' ? editUserTeamRole : undefined,
      teamId: editUserGroup === 'collaborative_group' ? (editUserTeamId || undefined) : undefined,
      role: editingUser.role === 'teacher_admin' ? 'teacher_admin' : (editUserGroup === 'collaborative_group' ? 'student_collaborative' : 'student_individual')
    });

    setEditingUser(null);
  };

  const toggleRevealPassword = (userId: string) => {
    setRevealedPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const copyUserPassword = (userId: string, pass: string) => {
    navigator.clipboard.writeText(pass);
    setCopiedPassUserId(userId);
    setTimeout(() => {
      setCopiedPassUserId(null);
    }, 2000);
  };

  // Filtered lists
  const students = allUsers.filter(u => u.role !== 'teacher_admin');
  const teachers = allUsers.filter(u => u.role === 'teacher_admin');

  const filteredUsers = allUsers.filter(u => {
    const matchGroup = groupFilter === 'all' 
      ? true 
      : groupFilter === 'teacher_admin' 
        ? u.role === 'teacher_admin' 
        : u.experimentalGroup === groupFilter && u.role !== 'teacher_admin';
    const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchGroup && matchSearch;
  });

  const strugglingStudents = students.filter(s => s.progressPercentage < 40 || (s.preTestScore && s.preTestScore < 50));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Teacher Main Header Banner */}
      <div className="bg-gradient-to-r from-[#14281d] via-[#14281d] to-[#14281d] text-white p-6 rounded-3xl border border-[#83C5BE] shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1 rounded-full bg-[#A2673B]/30 text-[#F0D5C0] border border-[#C27D38]/40 font-bold flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-[#F4CCC7]" />
                لوحة تحكم الأستاذ والمشرف الأكاديمي
              </span>
              <span className="text-xs text-[#E29578] font-medium">إدارة التجربة البحثية والطلاب الحقيقيين</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              منظومة إدارة وتقييم مشروعات بايثون البحثية
            </h1>
            <p className="text-xs text-[#E29578] max-w-2xl leading-relaxed">
              تحكم كامل في تسجيل وتوزيع الطلاب بين المجموعتين (الفردية والتشاركية)، إدارة الفرق، مراجعة الكود، وتقييم المخرجات وفق بطاقة Rubric المعتمدة.
            </p>
          </div>

          {/* Metrics summary */}
          <div className="flex items-center gap-3 bg-white/80 p-2.5 rounded-2xl border border-[#83C5BE] backdrop-blur-xs">
            <div className="px-3.5 py-1 text-center">
              <span className="text-[#E29578] text-[10px] block font-bold">الطلاب المسجلون</span>
              <span className="text-lg font-black text-white">{students.length}</span>
            </div>
            <div className="h-8 w-px bg-white"></div>
            <div className="px-3.5 py-1 text-center">
              <span className="text-[#E29578] text-[10px] block font-bold">الفرق التشاركية</span>
              <span className="text-lg font-black text-[#F4CCC7]">{teams.length}</span>
            </div>
            <div className="h-8 w-px bg-white"></div>
            <div className="px-3.5 py-1 text-center">
              <span className="text-[#E29578] text-[10px] block font-bold">التسليمات</span>
              <span className="text-lg font-black text-[#006D77]">{submissions.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-white p-2 rounded-2xl border border-[#83C5BE] shadow-xs flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveTeacherTab('students')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTeacherTab === 'students' ? 'bg-[#006D77] text-white shadow-xs' : 'text-[#E29578] hover:bg-[#006D77]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>إدارة الحسابات والطلاب ({students.length})</span>
          </button>

          <button
            onClick={() => setActiveTeacherTab('grading')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTeacherTab === 'grading' ? 'bg-[#006D77] text-white shadow-xs' : 'text-[#E29578] hover:bg-[#006D77]'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>تقييم المشروعات بـ Rubric ({submissions.length})</span>
          </button>

          <button
            onClick={() => setActiveTeacherTab('teams')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTeacherTab === 'teams' ? 'bg-[#006D77] text-white shadow-xs' : 'text-[#E29578] hover:bg-[#006D77]'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>متابعة الفرق التشاركية ({teams.length})</span>
          </button>

          <button
            onClick={() => setActiveTeacherTab('analytics')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTeacherTab === 'analytics' ? 'bg-[#006D77] text-white shadow-xs' : 'text-[#E29578] hover:bg-[#006D77]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>التحليل الإحصائي و SPSS</span>
          </button>

          <button
            onClick={() => setActiveTeacherTab('engagement')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTeacherTab === 'engagement' ? 'bg-[#006D77] text-white shadow-xs' : 'text-[#E29578] hover:bg-[#006D77]'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>مقياس الانخراط والتحكيم (56 عبارة)</span>
          </button>
        </div>

        {/* Global Quick Action: Reset Data */}
        <button
          onClick={() => setShowResetConfirmModal(true)}
          className="px-3 py-2 rounded-xl text-[11px] text-[#A24235] hover:bg-[#FDF2F0] border border-[#F4CCC7] flex items-center gap-1.5 transition-colors cursor-pointer"
          title="تفريغ المنصة وإعادة التهيئة"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>إعادة تعيين المنصة</span>
        </button>
      </div>

      {/* TAB 1: STUDENTS & USERS DIRECTORY (PRIMARY FOR ONBOARDING) */}
      {activeTeacherTab === 'students' && (
        <div className="bg-white p-6 rounded-3xl border border-[#83C5BE] text-[#006D77] space-y-6 shadow-xs">
          
          {/* Action Bar & Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#83C5BE] pb-5">
            <div>
              <h2 className="text-lg font-black text-white">دليل الحسابات وإدارة المجموعتين التجريبيتين</h2>
              <p className="text-xs text-[#E29578] mt-0.5">
                إضافة الطلاب والأساتذة، وتوزيع الطلاب بين المجموعة الفردية (1) والمجموعة التشاركية (2).
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowAddStudentModal(true)}
                className="px-3.5 py-2 rounded-xl bg-[#006D77] hover:bg-white text-[#006D77] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ إضافة طالب جديد</span>
              </button>

              <button
                onClick={() => setShowBulkImportModal(true)}
                className="px-3.5 py-2 rounded-xl bg-[#006D77] hover:bg-[#006D77] text-white border border-[#f59e0b]/50 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#006D77]" />
                <span>+ استيراد طلاب جماعي</span>
              </button>

              <button
                onClick={() => setShowAddTeacherModal(true)}
                className="px-3.5 py-2 rounded-xl bg-[#FDF2F0] hover:bg-[#F9E2DF] text-[#9C382A] border border-[#F4CCC7] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-[#9C382A]" />
                <span>+ إضافة أستاذ / مشرف</span>
              </button>
            </div>
          </div>

          {/* Filters and Search Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#EDF6F9] p-3 rounded-2xl border border-[#83C5BE]">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute right-3 top-2.5 text-[#E29578]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="بحث بالاسم أو البريد..."
                  className="pr-8 pl-3 py-1.5 text-xs rounded-xl border border-[#83C5BE] bg-white focus:outline-none focus:ring-2 focus:ring-[#355834]/20 w-48 sm:w-64"
                />
              </div>

              <select
                value={groupFilter}
                onChange={(e) => setGroupFilter(e.target.value as any)}
                className="p-1.5 text-xs rounded-xl border border-[#83C5BE] bg-white text-[#006D77] font-medium"
              >
                <option value="all">كافة الحسابات ({allUsers.length})</option>
                <option value="individual_group">المجموعة 1 (الفردي)</option>
                <option value="collaborative_group">المجموعة 2 (التشاركي)</option>
                <option value="teacher_admin">الأساتذة والمشرفون</option>
              </select>
            </div>

            <div className="text-xs text-[#E29578] font-medium">
              يتم عرض <strong>{filteredUsers.length}</strong> حساب
            </div>
          </div>

          {/* Students Directory Table / Empty State */}
          {students.length === 0 && groupFilter !== 'teacher_admin' ? (
            <div className="p-12 text-center bg-[#EDF6F9] rounded-3xl border-2 border-dashed border-[#f59e0b]/50 space-y-4">
              <div className="w-16 h-16 bg-[#006D77] rounded-full flex items-center justify-center mx-auto text-white">
                <Users className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base font-black text-white">لا يوجد طلاب مسجلون حتى الآن</h3>
                <p className="text-xs text-[#E29578] leading-relaxed">
                  المنصة جاهزة لبدء تجربتك التعليمية والبحثية باستخدام بيانات حقيقية. يمكنك إضافة الطلاب فرادى أو استيراد قائمة كاملة دفعة واحدة.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setShowAddStudentModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#006D77] hover:bg-white text-[#006D77] font-black text-xs transition-all shadow-md shadow-[#355834]/20 flex items-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>إضافة أول طالب</span>
                </button>
                <button
                  onClick={() => {
                    loadSampleBulkTemplate();
                    setShowBulkImportModal(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#F0F4F1] border border-[#83C5BE] text-[#006D77] font-black text-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>استيراد قائمة نموذجية جاهزة (6 طلاب)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto border border-[#83C5BE] rounded-2xl shadow-2xs">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#EDF6F9] text-[#E29578] font-bold border-b border-[#83C5BE]">
                  <tr>
                    <th className="p-3.5">المستخدم</th>
                    <th className="p-3.5">النوع / المجموعة التجريبية</th>
                    <th className="p-3.5">كلمة المرور (الدخول)</th>
                    <th className="p-3.5">الفريق والدور</th>
                    <th className="p-3.5">التقدم الإجمالي</th>
                    <th className="p-3.5">الدرجات (قبلي / بعدي)</th>
                    <th className="p-3.5 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F2F0] text-[#006D77]">
                  {filteredUsers.map(user => {
                    const isTeacher = user.role === 'teacher_admin';
                    const isCollab = user.experimentalGroup === 'collaborative_group';
                    const userTeam = teams.find(t => t.id === user.teamId);
                    const userPass = user.password || (isTeacher ? 'DrIbrahim@2026' : 'student123');
                    const isRevealed = !!revealedPasswords[user.id];

                    return (
                      <tr key={user.id} className="hover:bg-[#EDF6F9]/80 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <img src={user.avatar} className="w-9 h-9 rounded-xl object-cover ring-1 ring-[#E5EAE5]" />
                            <div>
                              <p className="font-extrabold text-white">{user.name}</p>
                              <p className="text-[11px] text-[#E29578]">{user.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5">
                          {isTeacher ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FDF2F0] text-[#9C382A] border border-[#F4CCC7]">
                              <GraduationCap className="w-3.5 h-3.5" />
                              أستاذ ومشرف أكاديمي
                            </span>
                          ) : (
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              isCollab
                                ? 'bg-[#FDF6EC] text-[#6E401F] border border-[#E8DCCB]'
                                : 'bg-[#006D77] text-white border border-[#f59e0b]/50'
                            }`}>
                              {isCollab ? <Users className="w-3 h-3" /> : <User className="w-3 h-3" />}
                              {isCollab ? 'المجموعة 2 (تشاركي)' : 'المجموعة 1 (فردي)'}
                            </span>
                          )}
                        </td>

                        <td className="p-3.5">
                          <div className="inline-flex items-center gap-1.5 bg-[#EDF6F9] px-2.5 py-1.5 rounded-xl border border-[#83C5BE]">
                            <KeyRound className="w-3.5 h-3.5 text-[#006D77]" />
                            <span className="font-mono text-xs font-bold text-white">
                              {isRevealed ? userPass : '••••••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleRevealPassword(user.id)}
                              className="p-1 text-[#E29578] hover:text-white transition-colors cursor-pointer"
                              title={isRevealed ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                            >
                              {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => copyUserPassword(user.id, userPass)}
                              className="p-1 text-[#E29578] hover:text-[#006D77] transition-colors cursor-pointer"
                              title="نسخ كلمة المرور"
                            >
                              {copiedPassUserId === user.id ? (
                                <Check className="w-3.5 h-3.5 text-[#006D77]" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        <td className="p-3.5">
                          {isTeacher ? (
                            <span className="text-[#E29578] font-medium">هيئة التدريس</span>
                          ) : isCollab ? (
                            <div className="space-y-0.5">
                              <span className="font-bold text-[#4A2E18] block">{userTeam?.name || 'لم يُعين بفريق'}</span>
                              <span className="text-[10px] text-[#7A4E2B] font-semibold">
                                الدور: {user.teamRole === 'analyst' ? 'محلل' : user.teamRole === 'designer' ? 'مصمم' : user.teamRole === 'coder' ? 'مبرمج' : 'مختبر'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[#E29578] font-medium">مسار فردي مستقل</span>
                          )}
                        </td>

                        <td className="p-3.5">
                          {isTeacher ? (
                            <span className="text-[#E29578] font-bold">100% (مشرف)</span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">{user.progressPercentage}%</span>
                              <div className="w-16 bg-[#EDF6F9] h-2 rounded-full overflow-hidden border border-[#83C5BE]">
                                <div className="bg-[#f59e0b] h-full rounded-full" style={{ width: `${user.progressPercentage}%` }}></div>
                              </div>
                            </div>
                          )}
                        </td>

                        <td className="p-3.5">
                          {isTeacher ? (
                            <span className="text-[#E29578]">--</span>
                          ) : (
                            <div className="text-[11px] space-x-1.5 space-x-reverse">
                              <span>قبلي: <strong className="text-white">{user.preTestScore !== undefined ? `${user.preTestScore}%` : 'لم يختبر'}</strong></span>
                              <span>•</span>
                              <span>بعدي: <strong className="text-[#E29578]">{user.postTestScore !== undefined ? `${user.postTestScore}%` : 'لم يختبر'}</strong></span>
                            </div>
                          )}
                        </td>

                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditUser(user)}
                              className="p-1.5 rounded-lg text-[#E29578] hover:text-white hover:bg-[#006D77] transition-colors cursor-pointer"
                              title="تعديل بيانات الحساب وكلمة المرور"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            {!isTeacher && (
                              <button
                                onClick={() => {
                                  const newGroup = user.experimentalGroup === 'individual_group' ? 'collaborative_group' : 'individual_group';
                                  updateStudentGroupAndRole(user.id, newGroup, newGroup === 'collaborative_group' ? teams[0]?.id : undefined);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-[#F0F4F1] hover:bg-[#006D77] text-white font-bold text-[11px] transition-colors cursor-pointer"
                                title="تبديل النمط التجريبي بين فردي وتشاركي"
                              >
                                تبديل النمط
                              </button>
                            )}

                            {user.id !== 'user_doctor_ibrahim' && (
                              <button
                                onClick={() => {
                                  if (confirm(`هل أنت متأكد من حذف حساب (${user.name}) نهائياً؟`)) {
                                    deleteUser(user.id);
                                  }
                                }}
                                className="p-1 rounded-lg text-[#C54A3B] hover:bg-[#FDF2F0] transition-colors cursor-pointer"
                                title="حذف الحساب"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SUBMISSIONS & RUBRIC GRADING */}
      {activeTeacherTab === 'grading' && (
        <div>
          {submissions.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-[#83C5BE] text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 bg-[#006D77] rounded-full flex items-center justify-center mx-auto text-white">
                <Award className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base font-black text-white">لا توجد تسليمات مشروعات حتى الآن</h3>
                <p className="text-xs text-[#E29578] leading-relaxed">
                  عندما يقوم الطلاب بتنفيذ المشروعات البرمجية في لغة بايثون وضغط زر التسليم، ستظهر جميع التسليمات هنا مباشرة لتقييمها ببطاقة Rubric مع إمكانية كتابة ملاحظات على سطور الكود.
                </p>
              </div>
              <button
                onClick={() => setActiveTeacherTab('students')}
                className="px-5 py-2.5 rounded-xl bg-[#006D77] hover:bg-white text-[#006D77] font-black text-xs transition-all cursor-pointer"
              >
                العودة لإدارة الطلاب
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Submissions List Sidebar */}
              <div className="lg:col-span-4 space-y-2">
                <h3 className="text-xs font-bold text-[#E29578] px-1 mb-2">تسليمات المشروعات الواردة للتقييم:</h3>
                <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
                  {submissions.map(sub => {
                    const isSelected = sub.id === selectedSubmissionId;
                    const p = projects.find(proj => proj.id === sub.projectId);
                    return (
                      <div
                        key={sub.id}
                        onClick={() => handleSelectSubmission(sub.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer text-right space-y-1.5 ${
                          isSelected
                            ? 'bg-[#006D77] border-[#83C5BE] ring-2 ring-[#355834]/20 shadow-xs'
                            : 'bg-white border-[#83C5BE] hover:border-[#f59e0b]/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white">{sub.studentName}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            sub.experimentalGroup === 'collaborative_group' 
                              ? 'bg-[#FDF6EC] text-[#6E401F] border border-[#E8DCCB]' 
                              : 'bg-[#006D77] text-white border border-[#f59e0b]/50'
                          }`}>
                            {sub.experimentalGroup === 'collaborative_group' ? 'تشاركي' : 'فردي'}
                          </span>
                        </div>

                        <p className="text-xs text-[#006D77]/80 font-semibold">{p?.title}</p>

                        <div className="flex items-center justify-between pt-1 text-[11px]">
                          <span className="text-[#E29578]">
                            {sub.status === 'evaluated' ? `الدرجة: ${sub.totalScore}%` : 'بانتظار التقييم'}
                          </span>
                          {sub.status === 'evaluated' ? (
                            <span className="text-[#006D77] font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> مقيم
                            </span>
                          ) : (
                            <span className="text-[#A2673B] font-bold">تسليم جديد</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submission Details & Rubric Matrix */}
              <div className="lg:col-span-8 space-y-6">
                {selectedSubmission ? (
                  <div className="space-y-6">
                    
                    {/* Submission Header Card */}
                    <div className="bg-white p-5 rounded-2xl border border-[#83C5BE] shadow-md text-[#006D77] space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#83C5BE] pb-3">
                        <div>
                          <h3 className="font-bold text-base text-white">{submissionProject.title}</h3>
                          <p className="text-xs text-[#E29578]">
                            الطالب / الفريق: <strong>{selectedSubmission.studentName}</strong> • {selectedSubmission.experimentalGroup === 'collaborative_group' ? 'المجموعة التشاركية' : 'المجموعة الفردية'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black px-3 py-1 bg-[#006D77] text-white rounded-xl border border-[#f59e0b]/50">
                            الدرجة المحتسبة: {calculateTotalCalculatedScore()} / 100
                          </span>
                        </div>
                      </div>

                      {/* Code Review Editor */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white block">كود بايثون المقدم للفحص:</label>
                        <div className="h-64 rounded-xl overflow-hidden border border-[#83C5BE]">
                          <MonacoCodeEditor
                            value={selectedSubmission.code}
                            onChange={() => {}}
                            readOnly={true}
                          />
                        </div>
                      </div>

                      {/* Line Comments Section */}
                      <div className="space-y-2 pt-2 border-t border-[#83C5BE]">
                        <label className="text-xs font-bold text-white flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-[#006D77]" />
                          إضافة تعليق توجيهي على سطر محدد في كود بايثون:
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={1}
                            value={lineCommentNum}
                            onChange={(e) => setLineCommentNum(parseInt(e.target.value) || 1)}
                            className="w-20 p-2 text-xs rounded-xl border border-[#83C5BE] bg-[#EDF6F9] text-center font-bold"
                            placeholder="السطر"
                          />
                          <input
                            type="text"
                            value={lineCommentText}
                            onChange={(e) => setLineCommentText(e.target.value)}
                            placeholder="اكتب توجيهك السقراطي للطالب على هذا السطر..."
                            className="flex-1 p-2 text-xs rounded-xl border border-[#83C5BE] bg-[#EDF6F9]"
                          />
                          <button
                            type="button"
                            onClick={handleAddLineComment}
                            className="px-3.5 py-2 rounded-xl bg-[#006D77] text-white text-xs font-bold hover:bg-[#E29578] transition-colors cursor-pointer"
                          >
                            إضافة
                          </button>
                        </div>

                        {addedLineComments.length > 0 && (
                          <div className="space-y-1 pt-1">
                            {addedLineComments.map((c, i) => (
                              <div key={i} className="p-2 rounded-lg bg-[#EDF6F9] border border-[#83C5BE] text-xs flex items-center justify-between">
                                <span>السطر {c.lineNumber}: <strong>{c.comment}</strong></span>
                                <span className="text-[10px] text-[#E29578]">{c.authorName}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Teacher General Feedback */}
                    <div className="bg-white p-5 rounded-2xl border border-[#83C5BE] shadow-md text-[#006D77] space-y-2">
                      <label className="text-xs font-bold text-white block">
                        التغذية الراجعة العامة والتوجيه السقراطي:
                      </label>
                      <textarea
                        value={teacherFeedbackText}
                        onChange={(e) => setTeacherFeedbackText(e.target.value)}
                        rows={3}
                        placeholder="اكتب تغذيتك الراجعة الشاملة هنا..."
                        className="w-full p-3 text-xs bg-[#EDF6F9] border border-[#83C5BE] rounded-xl focus:ring-2 focus:ring-[#355834]"
                      />
                    </div>

                    {/* Interactive Rubric Grading Matrix */}
                    <RubricViewer
                      criteria={submissionProject.rubricCriteria}
                      selectedScores={currentRubricScores}
                      onScoreSelect={handleRubricScoreSelect}
                      isEditable={true}
                      totalScore={calculateTotalCalculatedScore()}
                    />

                    {/* Save Grade Action */}
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={handleSaveGrade}
                        className="px-8 py-3 rounded-2xl bg-[#006D77] hover:bg-white text-[#006D77] font-black text-xs transition-all shadow-lg shadow-[#355834]/25 flex items-center gap-2 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>حفظ واعتماد تقييم الـ Rubric والتغذية الراجعة</span>
                      </button>
                    </div>

                  </div>
                ) : (
                  <div className="bg-white p-12 rounded-3xl border border-[#83C5BE] text-center text-[#E29578] text-xs">
                    اختر تسليماً من القائمة الجانبية لبدء الفحص والتقييم.
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      )}

      {/* TAB 3: COLLABORATIVE TEAMS MONITORING */}
      {activeTeacherTab === 'teams' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#83C5BE] shadow-xs">
            <div>
              <h2 className="text-lg font-black text-white">متابعة فرق العمل التشاركي</h2>
              <p className="text-xs text-[#E29578]">تكوين الفرق وتوزيع الأدوار ومتابعة المهام المنجزة</p>
            </div>

            <button
              onClick={() => setShowNewTeamModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-[#006D77] hover:bg-white text-[#006D77] font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>إنشاء مجموعة تشاركية جديدة</span>
            </button>
          </div>

          {teams.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-[#83C5BE] text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 bg-[#FDF6EC] rounded-full flex items-center justify-center mx-auto text-[#A2673B]">
                <FolderGit2 className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base font-black text-white">لا توجد فرق تشاركية منشأة حتى الآن</h3>
                <p className="text-xs text-[#E29578] leading-relaxed">
                  يمكنك إنشاء مجموعات وفرق عمل تشاركية وتعيين طلاب المجموعة التشاركية (2) فيها وتوزيع أدوارهم (المحلل، المصمم، المبرمج، المختبر).
                </p>
              </div>
              <button
                onClick={() => setShowNewTeamModal(true)}
                className="px-5 py-2.5 rounded-xl bg-[#006D77] hover:bg-white text-[#006D77] font-black text-xs transition-all cursor-pointer"
              >
                + إنشاء أول فريق تشاركي
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teams.map(team => (
                <div key={team.id} className="bg-white p-6 rounded-3xl border border-[#83C5BE] text-[#006D77] shadow-xs space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-black text-base text-white">{team.name}</h3>
                      <p className="text-xs text-[#E29578] mt-0.5">{team.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#4A2E18] bg-[#FDF6EC] px-2.5 py-1 rounded-full border border-[#E8DCCB]">
                        تقدم الفريق: {team.progressPercentage}%
                      </span>
                      <button
                        onClick={() => {
                          if (confirm(`هل أنت متأكد من حذف الفريق (${team.name})؟`)) {
                            deleteTeam(team.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="حذف الفريق"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-[#006D77]">أعضاء الفريق والمهام المنجزة:</h4>
                    <div className="space-y-2">
                      {(team.members || []).map(m => (
                        <div key={m.userId} className="p-2.5 rounded-xl bg-[#EDF6F9] border border-[#83C5BE] flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <img src={m.avatar} className="w-7 h-7 rounded-lg object-cover ring-1 ring-[#E5EAE5]" />
                            <div>
                              <p className="font-bold text-white">{m.name}</p>
                              <span className="text-[10px] text-[#A2673B] font-bold">
                                الدور: {m.role === 'analyst' ? 'محلل المشكلة' : m.role === 'designer' ? 'مصمم الحل' : m.role === 'coder' ? 'كاتب الكود' : 'المختبر والتوثيق'}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-[#E29578] text-[11px]">المهام: </span>
                            <strong className="text-[#006D77]">{m.completedTaskCount} من {m.assignedTaskCount}</strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-[#E29578] border-t border-[#83C5BE]">
                    <span>إجمالي مهام الفريق: {team.totalTasksCount}</span>
                    <span className="text-[#006D77] font-bold">المكتملة: {team.completedTasksCount}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ENGAGEMENT & ASSESSMENT STATISTICAL SUITE (SPSS) */}
      {activeTeacherTab === 'analytics' && (
        <StatisticalReportView students={students} submissions={submissions} />
      )}

      {/* TAB 5: ENGAGEMENT SCALE & REFEREE REVIEW */}
      {activeTeacherTab === 'engagement' && (
        <EngagementScaleView asRefereeMode={true} />
      )}

      {/* Grade Saved Toast */}
      {gradeSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-white text-[#006D77] text-xs font-bold py-2.5 px-4 rounded-2xl shadow-xl border border-[#83C5BE] flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-[#006D77]" />
          <span>تم اعتماد ورصد درجات تقييم الـ Rubric والتغذية الراجعة بنجاح.</span>
        </div>
      )}

      {/* MODAL 1: ADD SINGLE STUDENT */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-white/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#f59e0b]/50 space-y-4 animate-in fade-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between border-b border-[#83C5BE] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#006D77] flex items-center justify-center text-white">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-white">إضافة طالب جديد للمقرر</h3>
                  <p className="text-[11px] text-[#E29578]">أدخل بيانات الطالب لتضمينه في التجربة التعليمية</p>
                </div>
              </div>
              <button onClick={() => setShowAddStudentModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStudentSubmit} className="space-y-3.5">
              <div>
                <label className="font-bold text-white block mb-1">اسم الطالب الكامل:</label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="مثال: يوسف أحمد العتيبي"
                  className="w-full p-2.5 rounded-xl border border-[#83C5BE] bg-[#EDF6F9] focus:bg-white focus:ring-2 focus:ring-[#355834]/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-white block mb-1">البريد الإلكتروني / الأكاديمي:</label>
                  <input
                    type="email"
                    required
                    value={newStudentEmail}
                    onChange={(e) => setNewStudentEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full p-2.5 rounded-xl border border-[#83C5BE] bg-[#EDF6F9] focus:bg-white focus:ring-2 focus:ring-[#355834]/20"
                  />
                </div>
                <div>
                  <label className="font-bold text-white block mb-1">الرقم الأكاديمي / القومي:</label>
                  <input
                    type="text"
                    value={newStudentIdNum}
                    onChange={(e) => setNewStudentIdNum(e.target.value)}
                    placeholder="442001928"
                    className="w-full p-2.5 rounded-xl border border-[#83C5BE] bg-[#EDF6F9] focus:bg-white focus:ring-2 focus:ring-[#355834]/20"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-white block mb-1">
                  كلمة المرور لتسجيل الدخول (اختياري - افتراضي: student123):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={newStudentPassword}
                    onChange={(e) => setNewStudentPassword(e.target.value)}
                    placeholder="student123"
                    className="w-full p-2.5 pr-9 rounded-xl border border-[#83C5BE] bg-[#EDF6F9] focus:bg-white focus:ring-2 focus:ring-[#355834]/20 font-mono text-xs"
                  />
                  <KeyRound className="w-4 h-4 text-[#E29578] absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="font-bold text-white block mb-1">المجموعة التجريبية (نمط التعلم):</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewStudentGroup('individual_group')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      newStudentGroup === 'individual_group'
                        ? 'bg-[#006D77] border-[#83C5BE] text-white font-bold shadow-2xs'
                        : 'bg-[#EDF6F9] border-[#83C5BE] text-[#E29578]'
                    }`}
                  >
                    <User className="w-4 h-4 mx-auto mb-1 text-[#006D77]" />
                    <span className="text-[11px] block">المجموعة 1 (فردي)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewStudentGroup('collaborative_group')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      newStudentGroup === 'collaborative_group'
                        ? 'bg-[#FDF6EC] border-[#A2673B] text-[#4A2E18] font-bold shadow-2xs'
                        : 'bg-[#EDF6F9] border-[#83C5BE] text-[#E29578]'
                    }`}
                  >
                    <Users className="w-4 h-4 mx-auto mb-1 text-[#A2673B]" />
                    <span className="text-[11px] block">المجموعة 2 (تشاركي)</span>
                  </button>
                </div>
              </div>

              {newStudentGroup === 'collaborative_group' && (
                <div className="space-y-3 p-3 bg-[#FDF6EC] rounded-2xl border border-[#F4E3CB]">
                  <div>
                    <label className="font-bold text-[#4A2E18] block mb-1">الدور المخصص في الفريق:</label>
                    <select
                      value={newStudentTeamRole}
                      onChange={(e) => setNewStudentTeamRole(e.target.value as TeamMemberRole)}
                      className="w-full p-2 rounded-xl bg-white border border-[#E8DCCB] text-xs font-bold"
                    >
                      <option value="analyst">محلل المشكلة (Problem Analyst)</option>
                      <option value="designer">مصمم الخوارزمية (Algorithm Designer)</option>
                      <option value="coder">كاتب الكود (Lead Programmer)</option>
                      <option value="tester">المختبر والتوثيق (Tester & QA)</option>
                    </select>
                  </div>

                  {teams.length > 0 && (
                    <div>
                      <label className="font-bold text-[#4A2E18] block mb-1">تعيين في فريق موجود (اختياري):</label>
                      <select
                        value={newStudentTeamId}
                        onChange={(e) => setNewStudentTeamId(e.target.value)}
                        className="w-full p-2 rounded-xl bg-white border border-[#E8DCCB] text-xs font-bold"
                      >
                        <option value="">-- بدون فريق حالياً --</option>
                        {teams.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#83C5BE]">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#83C5BE] text-[#E29578] font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#006D77] hover:bg-white text-[#006D77] font-black cursor-pointer shadow-md shadow-[#355834]/20"
                >
                  حفظ وتسجيل الطالب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: BULK IMPORT STUDENTS */}
      {showBulkImportModal && (
        <div className="fixed inset-0 z-50 bg-white/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-[#f59e0b]/50 space-y-4 animate-in fade-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between border-b border-[#83C5BE] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#006D77] flex items-center justify-center text-white">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-white">استيراد قائمة طلاب جماعية (Excel / CSV)</h3>
                  <p className="text-[11px] text-[#E29578]">الصق قائمة الطلاب مفصولة بفواصل للإضافة الفورية</p>
                </div>
              </div>
              <button onClick={() => setShowBulkImportModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {bulkImportSuccessCount !== null ? (
              <div className="p-8 text-center bg-[#006D77] rounded-2xl border border-[#83C5BE] space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#006D77] mx-auto animate-bounce" />
                <h4 className="font-black text-sm text-white">تم استيراد {bulkImportSuccessCount} طالب بنجاح!</h4>
                <p className="text-xs text-[#006D77]/80">تمت إضافة الطلاب إلى دليل المنصة وتوزيعهم وتعيين كلمات المرور.</p>
              </div>
            ) : (
              <form onSubmit={handleBulkImportSubmit} className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-white">
                    بيانات الطلاب (الاسم, البريد, المجموعة, الدور, كلمة المرور [اختياري]):
                  </label>
                  <button
                    type="button"
                    onClick={loadSampleBulkTemplate}
                    className="text-[11px] font-bold text-[#006D77] hover:underline cursor-pointer"
                  >
                    تعبئة نموذج تجريبي جاهز
                  </button>
                </div>

                <textarea
                  rows={7}
                  required
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  placeholder={`أحمد مصطفى, ahmed@uni.edu, فردي, coder, pass123\nسارة عبد العزيز, sara@uni.edu, تشاركي, designer, pass456\nمحمد خالد, mohamed@uni.edu, تشاركي, coder, pass789`}
                  className="w-full p-3 rounded-xl border border-[#83C5BE] bg-[#EDF6F9] focus:bg-white focus:ring-2 focus:ring-[#355834]/20 font-mono text-[11px]"
                />

                <div className="bg-[#F0F4F1] p-3 rounded-xl border border-[#f59e0b]/50 text-[11px] text-white space-y-1">
                  <p className="font-bold flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-[#006D77]" />
                    صيغة السطور المقبولة:
                  </p>
                  <p>• <code>الاسم, البريد@النطاق, فردي, [الدور], [كلمة_المرور]</code></p>
                  <p>• <code>الاسم, البريد@النطاق, تشاركي, [محلل/مصمم/مبرمج/مختبر], [كلمة_المرور]</code></p>
                  <p className="text-[#E29578]">* إذا تركت كلمة المرور فارغة، فسيتم تعيين <code>student123</code> تلقائياً.</p>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#83C5BE]">
                  <button
                    type="button"
                    onClick={() => setShowBulkImportModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#83C5BE] text-[#E29578] font-bold cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#006D77] hover:bg-white text-[#006D77] font-black cursor-pointer shadow-md shadow-[#355834]/20"
                  >
                    بدء الاستيراد والإضافة
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: ADD NEW TEACHER / INSTRUCTOR */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 z-50 bg-white/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#f59e0b]/50 space-y-4 animate-in fade-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between border-b border-[#83C5BE] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FDF2F0] flex items-center justify-center text-[#9C382A]">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-white">إضافة أستاذ أو مشرف مساعد</h3>
                  <p className="text-[11px] text-[#E29578]">صلاحيات الإشراف وتقييم المشروعات</p>
                </div>
              </div>
              <button onClick={() => setShowAddTeacherModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTeacherSubmit} className="space-y-3.5">
              <div>
                <label className="font-bold text-white block mb-1">اسم الأستاذ / المشرف:</label>
                <input
                  type="text"
                  required
                  value={newTeacherName}
                  onChange={(e) => setNewTeacherName(e.target.value)}
                  placeholder="مثال: د. محمد سامي الشريف"
                  className="w-full p-2.5 rounded-xl border border-[#83C5BE] bg-[#EDF6F9] focus:bg-white focus:ring-2 focus:ring-[#355834]/20"
                />
              </div>

              <div>
                <label className="font-bold text-white block mb-1">البريد الإلكتروني الجامعي:</label>
                <input
                  type="email"
                  required
                  value={newTeacherEmail}
                  onChange={(e) => setNewTeacherEmail(e.target.value)}
                  placeholder="instructor@university.edu"
                  className="w-full p-2.5 rounded-xl border border-[#83C5BE] bg-[#EDF6F9] focus:bg-white focus:ring-2 focus:ring-[#355834]/20"
                />
              </div>

              <div>
                <label className="font-bold text-white block mb-1">المسمى الأكاديمي / القسم:</label>
                <input
                  type="text"
                  value={newTeacherTitle}
                  onChange={(e) => setNewTeacherTitle(e.target.value)}
                  placeholder="مثال: أستاذ مساعد - قسم تكنولوجيا التعليم"
                  className="w-full p-2.5 rounded-xl border border-[#83C5BE] bg-[#EDF6F9] focus:bg-white focus:ring-2 focus:ring-[#355834]/20"
                />
              </div>

              <div>
                <label className="font-bold text-white block mb-1">
                  كلمة المرور لتسجيل الدخول (افتراضي: teacher123):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={newTeacherPassword}
                    onChange={(e) => setNewTeacherPassword(e.target.value)}
                    placeholder="teacher123"
                    className="w-full p-2.5 pr-9 rounded-xl border border-[#83C5BE] bg-[#EDF6F9] focus:bg-white focus:ring-2 focus:ring-[#355834]/20 font-mono text-xs"
                  />
                  <KeyRound className="w-4 h-4 text-[#E29578] absolute left-3 top-3" />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#83C5BE]">
                <button
                  type="button"
                  onClick={() => setShowAddTeacherModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#83C5BE] text-[#E29578] font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#9C382A] hover:bg-[#852E22] text-white font-black cursor-pointer shadow-md shadow-[#9C382A]/20"
                >
                  حفظ الحساب الأكاديمي
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-white/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#f59e0b]/50 space-y-4 animate-in fade-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between border-b border-[#83C5BE] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#006D77] flex items-center justify-center text-white">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-white">تعديل بيانات الحساب وكلمة المرور</h3>
                  <p className="text-[11px] text-[#E29578]">تحديث معلومات المستخدم أو تعيين كلمة مرور جديدة</p>
                </div>
              </div>
              <button onClick={() => setEditingUser(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-3.5">
              <div>
                <label className="font-bold text-white block mb-1">الاسم الكامل:</label>
                <input
                  type="text"
                  required
                  value={editUserName}
                  onChange={(e) => setEditUserName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#83C5BE] bg-[#EDF6F9] focus:bg-white focus:ring-2 focus:ring-[#355834]/20"
                />
              </div>

              <div>
                <label className="font-bold text-white block mb-1">البريد الإلكتروني:</label>
                <input
                  type="email"
                  required
                  value={editUserEmail}
                  onChange={(e) => setEditUserEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#83C5BE] bg-[#EDF6F9] focus:bg-white focus:ring-2 focus:ring-[#355834]/20"
                />
              </div>

              <div>
                <label className="font-bold text-white block mb-1">كلمة المرور الجديدة (Login Password):</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={editUserPassword}
                    onChange={(e) => setEditUserPassword(e.target.value)}
                    className="w-full p-2.5 pr-9 rounded-xl border border-[#83C5BE] bg-[#EDF6F9] focus:bg-white focus:ring-2 focus:ring-[#355834]/20 font-mono font-bold text-xs"
                  />
                  <KeyRound className="w-4 h-4 text-[#E29578] absolute left-3 top-3" />
                </div>
                <p className="text-[10px] text-[#E29578] mt-1">يستطيع الطالب أو الأستاذ الدخول بهذا الباسوورد فوراً.</p>
              </div>

              {editingUser.role !== 'teacher_admin' && (
                <div>
                  <label className="font-bold text-white block mb-1">المجموعة التجريبية:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setEditUserGroup('individual_group')}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        editUserGroup === 'individual_group'
                          ? 'bg-[#006D77] border-[#83C5BE] text-white font-bold shadow-2xs'
                          : 'bg-[#EDF6F9] border-[#83C5BE] text-[#E29578]'
                      }`}
                    >
                      <User className="w-4 h-4 mx-auto mb-1 text-[#006D77]" />
                      <span className="text-[11px] block">المجموعة 1 (فردي)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditUserGroup('collaborative_group')}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        editUserGroup === 'collaborative_group'
                          ? 'bg-[#FDF6EC] border-[#A2673B] text-[#4A2E18] font-bold shadow-2xs'
                          : 'bg-[#EDF6F9] border-[#83C5BE] text-[#E29578]'
                      }`}
                    >
                      <Users className="w-4 h-4 mx-auto mb-1 text-[#A2673B]" />
                      <span className="text-[11px] block">المجموعة 2 (تشاركي)</span>
                    </button>
                  </div>
                </div>
              )}

              {editingUser.role !== 'teacher_admin' && editUserGroup === 'collaborative_group' && (
                <div className="space-y-3 p-3 bg-[#FDF6EC] rounded-2xl border border-[#F4E3CB]">
                  <div>
                    <label className="font-bold text-[#4A2E18] block mb-1">الدور المخصص في الفريق:</label>
                    <select
                      value={editUserTeamRole}
                      onChange={(e) => setEditUserTeamRole(e.target.value as TeamMemberRole)}
                      className="w-full p-2 rounded-xl bg-white border border-[#E8DCCB] text-xs font-bold"
                    >
                      <option value="analyst">محلل المشكلة (Problem Analyst)</option>
                      <option value="designer">مصمم الخوارزمية (Algorithm Designer)</option>
                      <option value="coder">كاتب الكود (Lead Programmer)</option>
                      <option value="tester">المختبر والتوثيق (Tester & QA)</option>
                    </select>
                  </div>

                  {teams.length > 0 && (
                    <div>
                      <label className="font-bold text-[#4A2E18] block mb-1">الفريق:</label>
                      <select
                        value={editUserTeamId}
                        onChange={(e) => setEditUserTeamId(e.target.value)}
                        className="w-full p-2 rounded-xl bg-white border border-[#E8DCCB] text-xs font-bold"
                      >
                        <option value="">-- بدون فريق --</option>
                        {teams.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#83C5BE]">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#83C5BE] text-[#E29578] font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#006D77] hover:bg-white text-[#006D77] font-black cursor-pointer shadow-md shadow-[#355834]/20"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: CREATE TEAM MODAL */}
      {showNewTeamModal && (
        <div className="fixed inset-0 z-50 bg-white/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#83C5BE] space-y-4 animate-in fade-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between border-b border-[#83C5BE] pb-3">
              <div>
                <h3 className="font-black text-sm text-white">إنشاء مجموعة تشاركية جديدة</h3>
                <p className="text-[11px] text-[#E29578]">تجميع طلاب المجموعة التشاركية في فريق عمل</p>
              </div>
              <button onClick={() => setShowNewTeamModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTeamSubmit} className="space-y-3.5">
              <div>
                <label className="font-bold text-[#006D77] block mb-1">اسم المجموعة:</label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="مثال: المجموعة (أ) - فريق الخوارزميات الذكية"
                  className="w-full p-2.5 rounded-xl border border-[#83C5BE] bg-[#EDF6F9]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#006D77] block mb-1">وصف المجموعة والهدف:</label>
                <input
                  type="text"
                  value={newTeamDesc}
                  onChange={(e) => setNewTeamDesc(e.target.value)}
                  placeholder="العمل التشاركي في مشروعات بايثون وتوزيع الأدوار"
                  className="w-full p-2.5 rounded-xl border border-[#83C5BE] bg-[#EDF6F9]"
                />
              </div>

              <div>
                <label className="font-bold text-[#006D77] block mb-1">اختيار الطلاب للمجموعة:</label>
                {students.length === 0 ? (
                  <p className="text-[#E29578] p-2 bg-[#EDF6F9] rounded-xl text-center">لا يوجد طلاب مسجلون بعد. قم بإضافة الطلاب أولاً.</p>
                ) : (
                  <div className="space-y-1 max-h-44 overflow-y-auto border border-[#83C5BE] p-2 rounded-xl">
                    {students.map(s => {
                      const isSelected = selectedMemberIds.includes(s.id);
                      return (
                        <div
                          key={s.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedMemberIds(selectedMemberIds.filter(id => id !== s.id));
                            } else {
                              setSelectedMemberIds([...selectedMemberIds, s.id]);
                            }
                          }}
                          className={`p-2 rounded-xl cursor-pointer flex items-center justify-between transition-colors ${
                            isSelected ? 'bg-[#006D77] text-white font-bold ring-1 ring-[#355834]/20' : 'hover:bg-[#EDF6F9] text-[#006D77]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <img src={s.avatar} className="w-6 h-6 rounded-md object-cover" />
                            <span>{s.name}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#006D77]" />}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#83C5BE]">
                <button
                  type="button"
                  onClick={() => setShowNewTeamModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#83C5BE] text-[#006D77]/80 font-semibold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={selectedMemberIds.length === 0}
                  className="px-6 py-2.5 rounded-xl bg-[#006D77] hover:bg-white disabled:bg-slate-300 text-[#006D77] font-bold cursor-pointer"
                >
                  إنشاء الفريق
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: RESET CONFIRMATION */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 bg-white/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#F4CCC7] space-y-4 animate-in fade-in zoom-in-95 text-xs">
            <div className="w-12 h-12 bg-[#FDF2F0] rounded-2xl flex items-center justify-center text-[#9C382A] mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="font-black text-sm text-white">إعادة تعيين المنصة بالكامل</h3>
              <p className="text-xs text-[#E29578] leading-relaxed">
                سيتم مسح كافة حسابات الطلاب والتسليمات والفرق والمحادثات والعودة إلى نقطة البداية بحساب الدكتور المشرف فقط. هل أنت متأكد؟
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(false)}
                className="px-5 py-2.5 rounded-xl border border-[#83C5BE] text-[#E29578] font-bold cursor-pointer"
              >
                إلغاء والتراجع
              </button>
              <button
                type="button"
                onClick={() => {
                  resetAllDataToClean();
                  setShowResetConfirmModal(false);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#9C382A] hover:bg-[#852E22] text-white font-black cursor-pointer shadow-md shadow-[#9C382A]/20"
              >
                نعم، تفريغ المنصة
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
