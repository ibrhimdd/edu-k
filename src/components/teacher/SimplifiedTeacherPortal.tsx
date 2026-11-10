import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatisticalReportView } from './StatisticalReportView';
import { EngagementScaleView } from '../student/EngagementScaleView';
import { RubricViewer } from '../common/RubricViewer';
import { MonacoCodeEditor } from '../common/MonacoCodeEditor';
import { 
  Users, 
  User, 
  GraduationCap, 
  FolderGit2, 
  CheckCircle2, 
  Award, 
  Sparkles, 
  TrendingUp, 
  FileText, 
  BarChart3, 
  Search, 
  Filter, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  Scale, 
  X, 
  UserPlus, 
  FileSpreadsheet, 
  RefreshCw, 
  Edit3, 
  BookOpen, 
  Clock, 
  HelpCircle,
  Code2,
  Plus,
  Trash2,
  UserMinus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, ExperimentalGroup, TeamMemberRole, ProjectSubmission } from '../../types/schema';
import { isPlatformAdmin, canEditAcademicContent } from '../../lib/permissions';

export const SimplifiedTeacherPortal: React.FC = () => {
  const { 
    currentUser, 
    allUsers, 
    projects, 
    submissions, 
    teams, 
    createNewTeam,
    deleteTeam,
    updateStudentGroupAndRole,
    gradeSubmission,
    updateUser, 
    addNewStudent, 
    bulkAddStudents,
    resetAllDataToClean 
  } = useApp();

  const isAdmin = isPlatformAdmin(currentUser.role);
  const canEditResearch = canEditAcademicContent(currentUser.role);

  // Primary Tabs
  const [activeTab, setActiveTab] = useState<'students' | 'analytics' | 'engagement'>('students');

  // Filter & Search
  const [groupFilter, setGroupFilter] = useState<'all' | 'individual_group' | 'collaborative_group'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Student for Full Profile Modal
  const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(null);

  // Password visibility
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [copiedPassId, setCopiedPassId] = useState<string | null>(null);

  // Modals
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamCapacity, setNewTeamCapacity] = useState('4');
  const [teamMessage, setTeamMessage] = useState('');

  // Single Add Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('student123');
  const [group, setGroup] = useState<ExperimentalGroup>('individual_group');

  // Rubric Grading inside Profile Modal
  const [rubricScores, setRubricScores] = useState<Record<string, number>>({});
  const [teacherFeedback, setTeacherFeedback] = useState('');
  const [gradeSavedToast, setGradeSavedToast] = useState(false);

  // Filter student list (exclude teachers)
  const students = (allUsers || []).filter(u => u.role === 'student_individual' || u.role === 'student_collaborative');

  const filteredStudents = students.filter(s => {
    const matchesGroup = groupFilter === 'all' || s.experimentalGroup === groupFilter;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  // Calculate high-level summary metrics
  const studentsWithPre = students.filter(s => s.preTestScore !== undefined);
  const avgPre = studentsWithPre.length > 0
    ? Math.round(studentsWithPre.reduce((acc, s) => acc + (s.preTestScore || 0), 0) / studentsWithPre.length)
    : 0;

  const studentsWithPost = students.filter(s => s.postTestScore !== undefined);
  const avgPost = studentsWithPost.length > 0
    ? Math.round(studentsWithPost.reduce((acc, s) => acc + (s.postTestScore || 0), 0) / studentsWithPost.length)
    : 0;

  const avgProgress = students.length > 0
    ? Math.round(students.reduce((acc, s) => acc + s.progressPercentage, 0) / students.length)
    : 0;

  const studentsWithEngagement = students.filter(s => s.engagementScore?.percentage !== undefined);
  const avgEngagement = studentsWithEngagement.length > 0
    ? Math.round(studentsWithEngagement.reduce((acc, s) => acc + (s.engagementScore?.percentage || 0), 0) / studentsWithEngagement.length)
    : 85;

  const togglePassword = (id: string) => {
    setRevealedPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyPassword = (id: string, pass: string) => {
    navigator.clipboard.writeText(pass);
    setCopiedPassId(id);
    setTimeout(() => setCopiedPassId(null), 2000);
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    addNewStudent({
      name,
      email,
      password: password || 'student123',
      group
    });
    setName('');
    setEmail('');
    setPassword('student123');
    setShowAddStudentModal(false);
  };

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newTeamName.trim();
    const capacity = Number(newTeamCapacity);
    if (!cleanName || !Number.isInteger(capacity) || capacity < 1) {
      setTeamMessage('اكتب اسم المجموعة وحدد عددًا صحيحًا للطلاب.');
      return;
    }
    createNewTeam(cleanName, 'مجموعة تشاركية أنشأها المعلم', [], capacity);
    setNewTeamName('');
    setNewTeamCapacity('4');
    setTeamMessage('تم إنشاء المجموعة بنجاح. يمكنك الآن إضافة الطلاب إليها.');
  };

  const handleAssignStudent = (teamId: string, studentId: string) => {
    const team = teams.find(item => item.id === teamId);
    if (!team || !studentId) return;
    const currentCount = students.filter(student => student.teamId === teamId).length;
    const capacity = team.maxMembers || 4;
    const alreadyInTeam = students.some(student => student.id === studentId && student.teamId === teamId);
    if (!alreadyInTeam && currentCount >= capacity) {
      setTeamMessage('المجموعة وصلت إلى العدد المحدد من الطلاب.');
      return;
    }
    updateStudentGroupAndRole(studentId, 'collaborative_group', teamId);
    setTeamMessage('تم تحديث توزيع الطلاب بنجاح.');
  };

  const handleRemoveStudentFromTeam = (studentId: string) => {
    updateStudentGroupAndRole(studentId, 'collaborative_group');
    setTeamMessage('تم إخراج الطالب من المجموعة مع الاحتفاظ به ضمن المجموعة التشاركية.');
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkText.trim()) return;
    const lines = bulkText.trim().split('\n');
    const newStudentsList: { name: string; email: string; password?: string; group: ExperimentalGroup }[] = [];

    lines.forEach(line => {
      const parts = line.split(',').map(p => p.trim());
      if (parts.length >= 2) {
        const sName = parts[0];
        const sEmail = parts[1];
        const sGroup: ExperimentalGroup = (parts[2]?.includes('تشارك') || parts[2]?.includes('2') || parts[2]?.toLowerCase() === 'collab') 
          ? 'collaborative_group' 
          : 'individual_group';
        const sPass = parts[3] || 'student123';
        newStudentsList.push({ name: sName, email: sEmail, group: sGroup, password: sPass });
      }
    });

    if (newStudentsList.length > 0) {
      bulkAddStudents(newStudentsList);
      setShowBulkModal(false);
      setBulkText('');
    }
  };

  // Student submission (if exists)
  const studentSubmission = selectedStudent ? (
    selectedStudent.role === 'student_collaborative' && selectedStudent.teamId
      ? submissions.find(s => s.teamId === selectedStudent.teamId)
      : submissions.find(s => s.studentId === selectedStudent.id)
  ) : undefined;

  const handleSaveGrade = (submissionId: string) => {
    const scoresArray = Object.values(rubricScores) as number[];
    const sumPoints = scoresArray.reduce((a: number, b: number) => a + (Number(b) || 0), 0);
    const maxPossiblePoints = 7 * 4; // 28
    const calculatedTotalScore = Math.round((sumPoints / maxPossiblePoints) * 100);

    gradeSubmission(submissionId, rubricScores, calculatedTotalScore, teacherFeedback);
    setGradeSavedToast(true);
    setTimeout(() => setGradeSavedToast(false), 3000);

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (_) {}
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      
      {/* Teacher Welcome & Overview Bar */}
      <div className="bg-[#06383A] text-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#39878A]">
        <div className="flex flex-col justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#006D77]/40 text-white border border-[#39878A]/30">
                <GraduationCap className="w-3.5 h-3.5" />
                لوحة الأستاذ والمشرف الأكاديمي
              </span>
              <span className="text-xs text-[#F3B49A]">منصة EduCode البحثية</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              أهلاً بك، {currentUser.name} 🎓
            </h1>
            <p className="text-xs sm:text-sm text-[#F3B49A] max-w-2xl leading-relaxed">
              متابعة مباشرة لنتائج الطلاب في الامتحان القبلي والبعدي، ونسب إنجاز المقرر، ومقاييس الانخراط مع أدوات التحليل الإحصائي وتصدير SPSS.
            </p>
          </div>

          {/* Core Summary Metrics */}
          <div className="grid grid-cols-2 gap-2.5 bg-[#042F32] p-3 rounded-2xl border border-[#39878A] text-center">
            <div className="px-3 py-3 rounded-xl bg-[#06383A] border border-[#39878A] shadow-sm">
              <span className="block text-[11px] text-[#E5F4F3] font-semibold">إجمالي الطلاب</span>
              <span className="text-xl font-black text-white">{students.length}</span>
            </div>
            <div className="px-3 py-3 rounded-xl bg-[#06383A] border border-[#39878A] shadow-sm">
              <span className="block text-[11px] text-[#E5F4F3] font-semibold">متوسط القبلي</span>
              <span className="text-xl font-black text-white">{avgPre > 0 ? `${avgPre}%` : '--'}</span>
            </div>
            <div className="px-3 py-3 rounded-xl bg-[#06383A] border border-[#39878A] shadow-sm">
              <span className="block text-[11px] text-[#E5F4F3] font-semibold">متوسط البعدي</span>
              <span className="text-xl font-black text-white">{avgPost > 0 ? `${avgPost}%` : '--'}</span>
            </div>
            <div className="px-3 py-3 rounded-xl bg-[#06383A] border border-[#39878A] shadow-sm">
              <span className="block text-[11px] text-[#E5F4F3] font-semibold">متوسط الانخراط</span>
              <span className="text-xl font-black text-white">{avgEngagement}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Teacher Navigation Tabs */}
      <div className="bg-[#06383A] p-2 rounded-2xl border border-[#39878A] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          
          <button
            onClick={() => setActiveTab('students')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'students'
                ? 'bg-[#006D77] text-white shadow-xs'
                : 'text-[#F3B49A] hover:bg-[#0A4548]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>سجل وملفات الطلاب ({students.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-[#006D77] text-white shadow-xs'
                : 'text-[#F3B49A] hover:bg-[#0A4548]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>التحليل الإحصائي وتصدير SPSS</span>
          </button>

          <button
            onClick={() => setActiveTab('engagement')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'engagement'
                ? 'bg-[#006D77] text-white shadow-xs'
                : 'text-[#F3B49A] hover:bg-[#0A4548]'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>مقياس الانخراط والتحكيم (56 عبارة)</span>
          </button>

        </div>

        {/* Global Reset Action */}
{isAdmin && (
        <button
          onClick={() => setShowResetConfirm(true)}
          className="px-3 py-2 rounded-xl text-xs text-[#A24235] hover:bg-[#E29578] border border-[#E29578] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>إعادة ضبط البيانات</span>
        </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: STUDENTS DIRECTORY & PROFILES */}
      {/* ========================================================================= */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          
          {/* Action Bar: Search, Filters, and Add Students */}
          <div className="bg-[#06383A] p-5 rounded-2xl border border-[#39878A] shadow-md text-[#F2FAF9] flex flex-col justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#F3B49A] absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="البحث باسم الطالب أو البريد..."
                className="w-full pl-4 pr-10 py-2.5 bg-[#0A4548] border border-[#39878A] rounded-xl text-xs focus:outline-hidden focus:border-[#39878A] transition-colors"
              />
            </div>

            {/* Filter Buttons & Add Student */}
            <div className="flex flex-wrap items-center gap-2">
              
              <div className="bg-[#0A4548] p-1 rounded-xl border border-[#39878A] flex items-center gap-1 text-xs">
                <button
                  onClick={() => setGroupFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    groupFilter === 'all' ? 'bg-[#06383A] text-[#F2FAF9] shadow-2xs' : 'text-[#F3B49A]'
                  }`}
                >
                  الكل ({students.length})
                </button>
                <button
                  onClick={() => setGroupFilter('individual_group')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    groupFilter === 'individual_group' ? 'bg-[#06383A] text-[#F2FAF9] shadow-2xs' : 'text-[#F3B49A]'
                  }`}
                >
                  الفردية ({students.filter(s => s.experimentalGroup === 'individual_group').length})
                </button>
                <button
                  onClick={() => setGroupFilter('collaborative_group')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    groupFilter === 'collaborative_group' ? 'bg-[#06383A] text-[#F2FAF9] shadow-2xs' : 'text-[#F3B49A]'
                  }`}
                >
                  التشاركية ({students.filter(s => s.experimentalGroup === 'collaborative_group').length})
                </button>
              </div>

{isAdmin && (
              <button
                onClick={() => setShowAddStudentModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[#006D77] hover:bg-[#06383A] text-[#F2FAF9] font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>إضافة طالب</span>
              </button>
              )}

{isAdmin && (
              <button
                onClick={() => setShowBulkModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[#06383A] hover:bg-[#0A4548] border border-[#E29578]/50 text-[#F2FAF9] font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>استيراد قائمة</span>
              </button>
              )}

            </div>
          </div>

          {isAdmin && (
          <section className="bg-[#06383A] p-5 rounded-2xl border border-[#39878A] shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#F3B49A]" />
                  تنظيم المجموعات التشاركية
                </h2>
                <p className="text-xs text-[#D7ECEA] mt-1">أنشئ المجموعات وحدد سعتها، ثم وزّع الطلاب يدويًا وانقلهم بين المجموعات وقتما تريد.</p>
              </div>
              <span className="text-xs font-bold text-[#F3B49A]">{teams.length} مجموعة مسجلة</span>
            </div>

            <form onSubmit={handleCreateTeam} className="grid grid-cols-1 sm:grid-cols-[1fr_130px_auto] gap-2 bg-[#0A4548] p-3 rounded-xl border border-[#39878A]">
              <input
                value={newTeamName}
                onChange={e => setNewTeamName(e.target.value)}
                placeholder="اسم المجموعة، مثال: المجموعة التشاركية الأولى"
                className="min-w-0 px-3 py-2.5 rounded-lg bg-[#06383A] border border-[#39878A] text-white text-xs placeholder:text-[#A8C8C5] focus:outline-none focus:border-[#F3B49A]"
                required
              />
              <input
                type="number"
                min="1"
                max={Math.max(1, students.length)}
                value={newTeamCapacity}
                onChange={e => setNewTeamCapacity(e.target.value)}
                aria-label="العدد المحدد للطلاب"
                className="px-3 py-2.5 rounded-lg bg-[#06383A] border border-[#39878A] text-white text-xs focus:outline-none focus:border-[#F3B49A]"
                required
              />
              <button type="submit" className="px-4 py-2.5 rounded-lg bg-[#E29578] hover:bg-[#F3B49A] text-[#3B2520] font-extrabold text-xs flex items-center justify-center gap-1.5">
                <Plus className="w-4 h-4" /> إنشاء مجموعة
              </button>
            </form>

            {teamMessage && <p className="text-xs text-[#F3B49A] font-semibold">{teamMessage}</p>}

            {teams.length === 0 ? (
              <p className="text-xs text-[#D7ECEA] text-center py-4">لم يتم إنشاء مجموعات بعد.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {teams.map(team => {
                  const teamStudents = students.filter(student => student.teamId === team.id);
                  const capacity = team.maxMembers || 4;
                  const availableStudents = students.filter(student => student.experimentalGroup === 'collaborative_group' && student.teamId !== team.id);
                  return (
                    <div key={team.id} className="bg-[#0A4548] border border-[#39878A] rounded-xl p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-extrabold text-white text-sm">{team.name}</h3>
                          <p className="text-[11px] text-[#F3B49A] mt-1">{teamStudents.length} من {capacity} طالب</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('هل تريد حذف المجموعة؟ سيتم فك ارتباط الطلاب بها دون حذف حساباتهم.')) {
                              deleteTeam(team.id);
                              setTeamMessage('تم حذف المجموعة وفك ارتباط الطلاب بها.');
                            }
                          }}
                          className="p-2 rounded-lg text-[#F3B49A] hover:bg-[#06383A]"
                          title="حذف المجموعة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="h-2 bg-[#06383A] rounded-full overflow-hidden">
                        <div className="h-full bg-[#E29578] rounded-full" style={{ width: `${Math.min(100, (teamStudents.length / capacity) * 100)}%` }} />
                      </div>

                      <select
                        value=""
                        onChange={e => handleAssignStudent(team.id, e.target.value)}
                        disabled={teamStudents.length >= capacity || availableStudents.length === 0}
                        className="w-full px-3 py-2.5 rounded-lg bg-[#06383A] border border-[#39878A] text-white text-xs disabled:opacity-50"
                      >
                        <option value="">+ إضافة طالب أو نقله لهذه المجموعة</option>
                        {availableStudents.map(student => (
                          <option key={student.id} value={student.id}>{student.name}{student.teamId ? ' — نقل من مجموعة أخرى' : ' — بدون مجموعة'}</option>
                        ))}
                      </select>

                      <div className="space-y-2">
                        {teamStudents.length === 0 ? (
                          <p className="text-[11px] text-[#B9D6D3] text-center py-2">لا يوجد طلاب في هذه المجموعة حاليًا.</p>
                        ) : teamStudents.map(student => (
                          <div key={student.id} className="flex items-center justify-between gap-2 bg-[#06383A] rounded-lg px-3 py-2">
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white truncate">{student.name}</p>
                              <p className="text-[10px] text-[#B9D6D3] truncate">{student.email}</p>
                            </div>
                            <button type="button" onClick={() => handleRemoveStudentFromTeam(student.id)} className="p-2 rounded-lg text-[#F3B49A] hover:bg-[#0A4548]" title="إزالة من المجموعة">
                              <UserMinus className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          )}

          {/* Student Roster Table (4 Key Metrics Front & Center) */}
          <div className="bg-[#06383A] rounded-2xl border border-[#39878A] text-[#F2FAF9] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#0A4548] text-[#F3B49A] font-bold border-b border-[#39878A]">
                  <tr>
                    <th className="p-4">الطالب والمجموعة</th>
                    <th className="p-4 text-center">الامتحان القبلي</th>
                    <th className="p-4 text-center">الامتحان البعدي</th>
                    <th className="p-4 text-center">إنجاز المقرر والمشاريع</th>
                    <th className="p-4 text-center">نسبة الانخراط</th>
                    <th className="p-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#14575A]">
                  {filteredStudents.map(student => {
                    const isCollab = student.experimentalGroup === 'collaborative_group';
                    return (
                      <tr key={student.id} className="hover:bg-[#006D77] transition-colors">
                        
                        {/* Student Name & Avatar & Group */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={student.avatar} 
                              alt={student.name}
                              className="w-10 h-10 rounded-xl object-cover ring-1 ring-[#39878A] bg-[#0A4548]" 
                            />
                            <div>
                              <p className="font-extrabold text-white text-sm">{student.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                                  isCollab 
                                    ? 'bg-[#0A4548] text-[#F3B49A] border border-[#39878A]' 
                                    : 'bg-[#006D77] text-white border border-[#E29578]/50'
                                }`}>
                                  {isCollab ? <Users className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                  {isCollab ? 'المجموعة التشاركية' : 'المجموعة الفردية'}
                                </span>
                                <span className="text-[11px] text-[#F3B49A]">{student.email}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 1. Pre-Test Score */}
                        <td className="p-4 text-center">
                          {student.preTestScore !== undefined ? (
                            <div className="inline-block px-3 py-1.5 rounded-xl bg-[#0A4548] border border-[#39878A]">
                              <span className="text-sm font-black text-white">
                                {student.preTestScore}%
                              </span>
                              <span className="block text-[9px] text-[#F3B49A]">مكتمل</span>
                            </div>
                          ) : (
                            <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#0A4548] text-[#F3B49A] border border-[#39878A]">
                              لم يؤدّه بعد
                            </span>
                          )}
                        </td>

                        {/* 2. Post-Test Score */}
                        <td className="p-4 text-center">
                          {student.postTestScore !== undefined ? (
                            <div className="inline-block px-3 py-1.5 rounded-xl bg-[#006D77] border border-[#E29578]/50 shadow-xs">
                              <span className="text-sm font-black text-white">
                                {student.postTestScore}%
                              </span>
                              {student.preTestScore !== undefined && (
                                <span className="block text-[9px] text-[#F3B49A] font-bold">
                                  كسب: +{Math.max(0, student.postTestScore - student.preTestScore)}%
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#0A4548] text-[#F3B49A] border border-[#39878A]">
                              قيد الانتظار
                            </span>
                          )}
                        </td>

                        {/* 3. Course Progress Percentage */}
                        <td className="p-4 text-center">
                          <div className="inline-flex flex-col items-center gap-1">
                            <span className="font-extrabold text-xs text-white">
                              {student.progressPercentage}%
                            </span>
                            <div className="w-20 bg-[#0A4548] h-2 rounded-full overflow-hidden border border-[#39878A]">
                              <div 
                                className="bg-[#E29578] h-full rounded-full transition-all" 
                                style={{ width: `${student.progressPercentage}%` }}
                              ></div>
                            </div>
                            <span className="text-[10px] text-[#F3B49A]">
                              {student.completedProjectsCount} مشاريع
                            </span>
                          </div>
                        </td>

                        {/* 4. Engagement Percentage */}
                        <td className="p-4 text-center">
                          {student.engagementScore?.percentage ? (
                            <div className="inline-block px-3 py-1.5 rounded-xl bg-[#0A4548] border border-[#39878A]">
                              <span className="text-sm font-black text-[#F3B49A]">
                                {student.engagementScore.percentage}%
                              </span>
                              <span className="block text-[9px] text-[#F3B49A] font-semibold">
                                {student.engagementScore.level || 'مرتفع'}
                              </span>
                            </div>
                          ) : (
                            <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#0A4548] text-[#F3B49A] border border-[#39878A]">
                              غير مكتمل
                            </span>
                          )}
                        </td>

                        {/* Actions: View Profile Modal */}
                        <td className="p-4 text-center">
                          <button
                            onClick={() => {
                              setSelectedStudent(student);
                              setRubricScores(studentSubmission?.rubricScores || {});
                              setTeacherFeedback(studentSubmission?.teacherGeneralFeedback || '');
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-[#006D77] hover:bg-[#004D54] text-white font-bold text-xs transition-colors border border-[#E29578]/50 cursor-pointer"
                          >
                            عرض البروفايل
                          </button>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: STATISTICAL REPORT & SPSS EXPORT */}
      {/* ========================================================================= */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <StatisticalReportView 
            students={students} 
            submissions={submissions} 
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ENGAGEMENT SCALE & REFEREE MODE */}
      {/* ========================================================================= */}
      {activeTab === 'engagement' && (
        <div className="space-y-6">
          <EngagementScaleView 
            asRefereeMode={true} 
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* STUDENT FULL PROFILE & EVALUATION MODAL */}
      {/* ========================================================================= */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#06383A] rounded-3xl p-6 sm:p-8 max-w-3xl w-full border border-[#39878A] shadow-2xl text-[#F2FAF9] max-h-[90vh] overflow-y-auto space-y-6 animate-in zoom-in-95 text-right">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#39878A] pb-4">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedStudent.avatar} 
                  className="w-12 h-12 rounded-2xl ring-1 ring-[#39878A] bg-[#0A4548]" 
                />
                <div>
                  <h2 className="text-lg font-black text-white">{selectedStudent.name}</h2>
                  <p className="text-xs text-[#F3B49A]">{selectedStudent.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-2 rounded-xl text-[#F3B49A] hover:bg-[#0A4548] hover:text-[#F2FAF9] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 4 Metrics Highlight Cards */}
            <div className="grid grid-cols-2 gap-3">
              
              <div className="bg-[#0A4548] p-3.5 rounded-2xl border border-[#39878A] text-center">
                <span className="block text-[11px] text-[#F3B49A] font-bold">1. الامتحان القبلي</span>
                <span className="text-2xl font-black text-white">
                  {selectedStudent.preTestScore !== undefined ? `${selectedStudent.preTestScore}%` : 'لم يؤدّه'}
                </span>
              </div>

              <div className="bg-[#006D77] p-3.5 rounded-2xl border border-[#E29578]/50 text-center">
                <span className="block text-[11px] text-[#F3B49A] font-bold">2. الامتحان البعدي</span>
                <span className="text-2xl font-black text-white">
                  {selectedStudent.postTestScore !== undefined ? `${selectedStudent.postTestScore}%` : 'قيد الانتظار'}
                </span>
              </div>

              <div className="bg-[#0A4548] p-3.5 rounded-2xl border border-[#39878A] text-center">
                <span className="block text-[11px] text-[#F3B49A] font-bold">3. إنجاز المقرر</span>
                <span className="text-2xl font-black text-white">
                  {selectedStudent.progressPercentage}%
                </span>
              </div>

              <div className="bg-[#0A4548] p-3.5 rounded-2xl border border-[#39878A] text-center">
                <span className="block text-[11px] text-[#F3B49A] font-bold">4. نسبة الانخراط</span>
                <span className="text-2xl font-black text-[#F3B49A]">
                  {selectedStudent.engagementScore?.percentage ? `${selectedStudent.engagementScore.percentage}%` : '85%'}
                </span>
              </div>

            </div>

            {/* Engagement Dimensions Breakdown */}
            {selectedStudent.engagementScore && (
              <div className="bg-[#0A4548]/80 p-4 rounded-2xl border border-[#39878A] space-y-2">
                <h4 className="text-xs font-bold text-[#F3B49A]">تفصيل أبعاد مقياس الانخراط في تعلم البرمجة:</h4>
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="bg-[#06383A] p-2 rounded-xl border border-[#39878A]">
                    <span className="text-[10px] text-[#F3B49A] block">الانخراط المعرفي</span>
                    <span className="font-bold text-[#F3B49A]">{selectedStudent.engagementScore.cognitive || 80}%</span>
                  </div>
                  <div className="bg-[#06383A] p-2 rounded-xl border border-[#39878A]">
                    <span className="text-[10px] text-[#F3B49A] block">الانخراط السلوكي</span>
                    <span className="font-bold text-[#F3B49A]">{selectedStudent.engagementScore.behavioral || 82}%</span>
                  </div>
                  <div className="bg-[#06383A] p-2 rounded-xl border border-[#39878A]">
                    <span className="text-[10px] text-[#F3B49A] block">الانخراط الوجداني</span>
                    <span className="font-bold text-[#F3B49A]">{selectedStudent.engagementScore.emotional || 84}%</span>
                  </div>
                  <div className="bg-[#06383A] p-2 rounded-xl border border-[#39878A]">
                    <span className="text-[10px] text-[#F3B49A] block">الانخراط الاجتماعي</span>
                    <span className="font-bold text-[#F3B49A]">{selectedStudent.engagementScore.social || 78}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Student Project Submission Code & Rubric Evaluation */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-[#F2FAF9]" />
                  <span>المشروع البرمجي المسلّم وتقييم الـ Rubric</span>
                </h3>
                {studentSubmission && (
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-[#006D77] text-white border border-[#E29578]/50">
                    الدرجة الحالية: {studentSubmission.totalScore}/100
                  </span>
                )}
              </div>

              {studentSubmission ? (
                <div className="space-y-4">
                  {/* Code Viewer */}
                  <div className="border border-[#39878A] rounded-xl overflow-hidden bg-[#1E1E1E]">
                    <div className="bg-[#2D2D2D] px-3 py-1.5 text-xs text-[#F2FAF9] flex items-center justify-between">
                      <span className="font-mono text-[11px]">project_submission.py</span>
                      <span className="text-[10px] text-[#F3B49A]">تم التسليم: {new Date(studentSubmission.submittedAt).toLocaleDateString('ar-EG')}</span>
                    </div>
                    <pre className="p-4 text-xs font-mono text-[#F2FAF9] overflow-x-auto leading-relaxed" dir="ltr">
                      {studentSubmission.code}
                    </pre>
                  </div>

                  {/* Rubric Evaluation Component */}
                  <RubricViewer
                    scores={rubricScores}
                    onScoreChange={(critId, score) => setRubricScores(prev => ({ ...prev, [critId]: score }))}
                    editable={canEditResearch}
                  />

                  {/* Teacher Feedback Text */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white">
                      ملاحظات وتوجيهات الأستاذ المشرف:
                    </label>
                    <textarea
                      value={teacherFeedback}
                      onChange={e => setTeacherFeedback(e.target.value)}
                      readOnly={!canEditResearch}
                      rows={2}
                      placeholder="اكتب ملاحظاتك للطالب على مشروعه البرمجي..."
                      className="w-full p-3 rounded-xl border border-[#39878A] text-xs focus:outline-hidden focus:border-[#39878A]"
                    ></textarea>
                  </div>

                  {/* Save Grade Button */}
                  <div className="flex items-center justify-between pt-2">
                    {canEditResearch && gradeSavedToast && (
                      <span className="text-xs text-[#F2FAF9] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        تم رصد التقييم وحفظ الدرجات بنجاح!
                      </span>
                    )}
{canEditResearch && (
                    <button
                      type="button"
                      onClick={() => handleSaveGrade(studentSubmission.id)}
                      className="mr-auto px-6 py-2.5 rounded-xl bg-[#006D77] hover:bg-[#06383A] text-[#F2FAF9] font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Award className="w-4 h-4" />
                      <span>اعتماد ورصد تقييم المشروع</span>
                    </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-[#0A4548] p-6 rounded-2xl border border-dashed border-[#39878A] text-center space-y-1">
                  <FolderGit2 className="w-8 h-8 text-[#F3B49A] mx-auto" />
                  <p className="text-xs font-bold text-[#F3B49A]">لم يقم الطالب بتسليم مشروعه البرمجي حتى الآن.</p>
                  <p className="text-[11px] text-[#F3B49A]">سيظهر كوده وخوارزميته ونموذج التقييم هنا فور قيامه بالتسليم.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD SINGLE STUDENT MODAL */}
      {/* ========================================================================= */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#06383A] rounded-3xl p-6 max-w-md w-full border border-[#39878A] shadow-2xl text-[#F2FAF9] space-y-4 animate-in zoom-in-95 text-right">
            <div className="flex items-center justify-between border-b border-[#39878A] pb-3">
              <h3 className="text-base font-black text-white">إضافة طالب جديد للمنصة</h3>
              <button onClick={() => setShowAddStudentModal(false)} className="text-[#F3B49A] hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">اسم الطالب الرباعي</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="مثال: يوسف إبراهيم الشناوي"
                  className="w-full p-2.5 rounded-xl border border-[#39878A] focus:outline-hidden focus:border-[#39878A]"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">البريد الإلكتروني (لتسجيل الدخول)</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="youssef@student.edu"
                  className="w-full p-2.5 rounded-xl border border-[#39878A] focus:outline-hidden focus:border-[#39878A]"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">كلمة المرور</label>
                <input
                  type="text"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#39878A] focus:outline-hidden focus:border-[#39878A]"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">المجموعة التجريبية</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className={`p-2.5 rounded-xl border text-center font-bold cursor-pointer ${
                    group === 'individual_group' ? 'bg-[#006D77] text-white border-[#39878A]' : 'border-[#39878A]'
                  }`}>
                    <input
                      type="radio"
                      name="group"
                      checked={group === 'individual_group'}
                      onChange={() => setGroup('individual_group')}
                      className="hidden"
                    />
                    المجموعة 1 (فردي)
                  </label>
                  <label className={`p-2.5 rounded-xl border text-center font-bold cursor-pointer ${
                    group === 'collaborative_group' ? 'bg-[#0A4548] text-[#F3B49A] border-[#91472F]' : 'border-[#39878A]'
                  }`}>
                    <input
                      type="radio"
                      name="group"
                      checked={group === 'collaborative_group'}
                      onChange={() => setGroup('collaborative_group')}
                      className="hidden"
                    />
                    المجموعة 2 (تشاركي)
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-[#39878A] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 rounded-xl text-[#F3B49A] hover:bg-[#0A4548] cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#006D77] hover:bg-[#06383A] text-[#F2FAF9] font-bold cursor-pointer"
                >
                  حفظ وإضافة الطالب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BULK IMPORT MODAL */}
      {/* ========================================================================= */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#06383A] rounded-3xl p-6 max-w-lg w-full border border-[#39878A] shadow-2xl text-[#F2FAF9] space-y-4 animate-in zoom-in-95 text-right">
            <div className="flex items-center justify-between border-b border-[#39878A] pb-3">
              <h3 className="text-base font-black text-white">استيراد قائمة طلاب دفعة واحدة</h3>
              <button onClick={() => setShowBulkModal(false)} className="text-[#F3B49A] hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#F3B49A]">
              أدخل كل طالب في سطر مستقل بالصيغة: <br />
              <code className="bg-[#0A4548] px-1.5 py-0.5 rounded text-[11px] text-[#F3B49A]">الاسم, البريد, المجموعة (فردي أو تشاركي), كلمة المرور</code>
            </p>

            <textarea
              value={bulkText}
              onChange={e => setBulkText(e.target.value)}
              rows={6}
              placeholder={`محمد علي السعيد, mohamed.a@student.edu, فردي, student123\nنورة سلطان الكعبي, noura.s@student.edu, تشاركي, student123`}
              className="w-full p-3 rounded-xl border border-[#39878A] text-xs font-mono focus:outline-hidden focus:border-[#39878A]"
            ></textarea>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#39878A]">
              <button
                type="button"
                onClick={() => setShowBulkModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-[#F3B49A] hover:bg-[#0A4548] cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleBulkSubmit}
                className="px-5 py-2 rounded-xl bg-[#006D77] hover:bg-[#06383A] text-[#F2FAF9] font-bold text-xs cursor-pointer"
              >
                بدء الاستيراد
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* RESET CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#06383A] rounded-3xl p-6 max-w-sm w-full border border-[#39878A] shadow-2xl text-[#F2FAF9] text-center space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-[#E29578] text-[#A24235] mx-auto flex items-center justify-center">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-white">إعادة ضبط بيانات المنصة؟</h3>
            <p className="text-xs text-[#F3B49A]">
              سيتم استعادة الحسابات الافتراضية الأولية ومسح أي سجلات تجريبية مضافة.
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#F3B49A] hover:bg-[#0A4548] cursor-pointer"
              >
                تراجع
              </button>
              <button
                onClick={() => {
                  resetAllDataToClean();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#A24235] text-white hover:bg-[#863529] cursor-pointer"
              >
                نعم، إعادة الضبط
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
