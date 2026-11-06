// components/student/CollaborativeProjectWorkspace.tsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MonacoCodeEditor } from '../common/MonacoCodeEditor';
import { RubricViewer } from '../common/RubricViewer';
import { AITutorWidget } from '../common/AITutorWidget';
import { 
  Users, 
  MessageSquare, 
  CheckSquare, 
  FileCode2, 
  Send, 
  Paperclip, 
  Plus, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  FolderGit2,
  Clock,
  Layers,
  ArrowLeft,
  ChevronDown,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CollaborativeProjectWorkspace: React.FC = () => {
  const { 
    currentUser, 
    projects, 
    selectedProjectId, 
    setSelectedProjectId, 
    teams,
    getCurrentTeam, 
    discussions, 
    sendMessage, 
    tasks, 
    addTask, 
    updateTaskStatus, 
    submissions, 
    submitProjectForReview, 
    saveSubmissionDraft 
  } = useApp();

  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0];
  const team = getCurrentTeam() || (teams && teams[0]);

  const [activeMainTab, setActiveMainTab] = useState<'workspace' | 'chat' | 'tasks' | 'rubric'>('workspace');
  const [chatInput, setChatInput] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  // Submissions for this team
  const teamSubmission = submissions.find(s => s.projectId === currentProject.id && s.teamId === team?.id);
  const [code, setCode] = useState<string>(teamSubmission?.code || currentProject.starterCode);
  const [analysisText, setAnalysisText] = useState<string>(teamSubmission?.problemAnalysisText || '');
  const [designText, setDesignText] = useState<string>(teamSubmission?.solutionDesignText || '');
  const [testReportText, setTestReportText] = useState<string>(teamSubmission?.testReportText || '');

  const teamDiscussions = discussions.filter(d => d.teamId === team?.id);
  const teamTasks = tasks.filter(t => t.teamId === team?.id);

  const roleBadgeMap: Record<string, { label: string; color: string }> = {
    analyst: { label: 'محلل المشكلة', color: 'bg-[#EDF6F9] text-[#91472F] border border-[#83C5BE]' },
    designer: { label: 'مصمم الحل', color: 'bg-[#006D77] text-white border border-[#E29578]/50' },
    coder: { label: 'كاتب الكود', color: 'bg-white text-[#006D77] font-extrabold border border-[#83C5BE]' },
    tester: { label: 'المختبر والتوثيق', color: 'bg-[#006D77] text-[#006D77] border border-[#E29578]/50' }
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendMessage(chatInput);
    setChatInput('');
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !newTaskAssignee) return;
    addTask(newTaskTitle, 'مهمة مسندة ضمن مراحل المشروع التشاركي', newTaskAssignee, newTaskPriority, '2026-09-05');
    setNewTaskTitle('');
    setShowAddTaskModal(false);
  };

  const handleTeamSubmit = () => {
    if (window.confirm('هل أنت متأكد من تسليم مشروع الفريق للاعتماد والتقييم من قبل المعلم؟')) {
      submitProjectForReview(currentProject.id, code, analysisText, designText, testReportText);
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 }
      });
      setActiveMainTab('rubric');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Team Top Header */}
      <div className="bg-gradient-to-r from-[#006D77] via-[#006D77] to-[#006D77] text-white p-6 rounded-2xl border border-[#83C5BE] shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/60 text-[#E29578] border border-[#83C5BE] font-bold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#006D77]" />
                المجموعة التجريبية الثانية: مشروع المجموعة التشاركي
              </span>
              <span className="text-xs text-[#E29578]">{team?.name || 'فريق العمل'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              {currentProject.title}
            </h1>
            <p className="text-xs text-[#E29578] mt-1 max-w-2xl">{currentProject.problemStatement}</p>
          </div>

          {/* Project Switcher */}
          <div className="flex items-center gap-1.5 bg-white/60 p-1.5 rounded-xl border border-[#83C5BE] shrink-0">
            {projects.map(p => {
              const isCurr = p.id === currentProject.id;
              const sub = submissions.find(s => s.projectId === p.id && s.teamId === team?.id);
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    isCurr ? 'bg-[#006D77] text-white shadow-xs' : 'text-[#E29578] hover:bg-white'
                  }`}
                >
                  <span>مشروع {p.order}</span>
                  {sub?.status === 'evaluated' && <CheckCircle2 className="w-3.5 h-3.5 text-[#006D77]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Team Members Bar */}
        <div className="mt-5 pt-4 border-t border-[#83C5BE]/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[#E29578] font-semibold">أعضاء الفريق وتوزيع المسؤوليات:</span>
            {(team?.members || []).map(m => {
              const isMe = m.userId === currentUser.id;
              return (
                <div 
                  key={m.userId} 
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${
                    isMe ? 'bg-[#006D77]/60 border-[#83C5BE] text-white font-bold ring-1 ring-[#004D54]/40' : 'bg-white/60 border-[#83C5BE] text-[#E29578]'
                  }`}
                >
                  <img src={m.avatar} className="w-5 h-5 rounded-md object-cover" />
                  <span>{m.name} {isMe && '(أنت)'}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${roleBadgeMap[m.role]?.color || 'bg-white text-[#E29578]'}`}>
                    {roleBadgeMap[m.role]?.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#E29578]">إنجاز المهام:</span>
            <span className="font-bold text-[#FFDDD2]">{team?.completedTasksCount} من {team?.totalTasksCount} مكتملة</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-[#83C5BE] shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveMainTab('workspace')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
              activeMainTab === 'workspace' ? 'bg-[#006D77] text-white shadow-xs' : 'text-[#E29578] hover:bg-[#EDF6F9]'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            <span>مساحة العمل المشتركة والمحرر</span>
          </button>

          <button
            onClick={() => setActiveMainTab('chat')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
              activeMainTab === 'chat' ? 'bg-[#006D77] text-white shadow-xs' : 'text-[#E29578] hover:bg-[#EDF6F9]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>منتدى النقاش والمحادثة الحية</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#006D77] text-white font-bold border border-[#E29578]/50">
              {teamDiscussions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveMainTab('tasks')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
              activeMainTab === 'tasks' ? 'bg-[#006D77] text-white shadow-xs' : 'text-[#E29578] hover:bg-[#EDF6F9]'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>لوحة توزيع المهام وإنجاز الأعضاء</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#EDF6F9] text-white font-bold border border-[#83C5BE]">
              {teamTasks.length}
            </span>
          </button>

          <button
            onClick={() => setActiveMainTab('rubric')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
              activeMainTab === 'rubric' ? 'bg-[#006D77] text-white shadow-xs' : 'text-[#E29578] hover:bg-[#EDF6F9]'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>التقييم والتغذية الراجعة (Rubric)</span>
          </button>
        </div>

        {/* Team Submit Action */}
        <button
          onClick={handleTeamSubmit}
          className="px-4 py-2 rounded-xl bg-[#006D77] hover:bg-white text-[#006D77] font-bold text-xs transition-all shadow-md shadow-[#004D54]/30 flex items-center gap-1.5 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>تسليم المشروع كفريق</span>
        </button>
      </div>

      {/* Tab 1: Collaborative Code Workspace */}
      {activeMainTab === 'workspace' && (
        <div className="space-y-6">
          
          {/* Collaborative Roles Sections (Analyst, Designer, Coder, Tester) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Analyst Section */}
            <div className="bg-white p-4 rounded-xl border border-[#83C5BE] text-[#006D77] shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#91472F] bg-[#EDF6F9] px-2 py-0.5 rounded border border-[#83C5BE]">
                  🔍 قسم محلل المشكلة (أحمد)
                </span>
              </div>
              <p className="text-[11px] text-[#E29578]">تحليل المدخلات والمخرجات والشروط المطلوبة:</p>
              <textarea
                value={analysisText}
                onChange={(e) => {
                  setAnalysisText(e.target.value);
                  saveSubmissionDraft(currentProject.id, code, e.target.value, designText, testReportText);
                }}
                rows={4}
                placeholder="تحليل المشكلة والشروط..."
                className="w-full p-2.5 text-xs bg-[#EDF6F9] border border-[#83C5BE] rounded-lg focus:ring-1 focus:ring-[#91472F]"
              />
            </div>

            {/* Designer Section */}
            <div className="bg-white p-4 rounded-xl border border-[#83C5BE] text-[#006D77] shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white bg-[#006D77] px-2 py-0.5 rounded border border-[#E29578]/50">
                  📐 قسم مصممة الحل (سارة)
                </span>
              </div>
              <p className="text-[11px] text-[#E29578]">تصميم الخوارزمية وتسلسل الخطوات:</p>
              <textarea
                value={designText}
                onChange={(e) => {
                  setDesignText(e.target.value);
                  saveSubmissionDraft(currentProject.id, code, analysisText, e.target.value, testReportText);
                }}
                rows={4}
                placeholder="الخوارزمية وشبه الكود..."
                className="w-full p-2.5 text-xs bg-[#EDF6F9] border border-[#83C5BE] rounded-lg focus:ring-1 focus:ring-[#004D54]"
              />
            </div>

            {/* Tester Section */}
            <div className="bg-white p-4 rounded-xl border border-[#83C5BE] text-[#006D77] shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white bg-[#006D77] px-2 py-0.5 rounded border border-[#E29578]/50">
                  🧪 قسم المختبر والتوثيق (ندى)
                </span>
              </div>
              <p className="text-[11px] text-[#E29578]">سجل حالات الاختبار والتوثيق:</p>
              <textarea
                value={testReportText}
                onChange={(e) => {
                  setTestReportText(e.target.value);
                  saveSubmissionDraft(currentProject.id, code, analysisText, designText, e.target.value);
                }}
                rows={4}
                placeholder="تقرير حالات الاختبار..."
                className="w-full p-2.5 text-xs bg-[#EDF6F9] border border-[#83C5BE] rounded-lg focus:ring-1 focus:ring-[#004D54]"
              />
            </div>

          </div>

          {/* Programmer Monaco Editor Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white bg-[#006D77] px-2.5 py-1 rounded-lg border border-[#E29578]/50">
                  💻 مساحة كتابة الكود المشتركة (المبرمج: محمد)
                </span>
                <span className="text-xs text-[#E29578]">محرر Monaco Editor المدمج مع تشغيل فوري للاختبارات</span>
              </div>
            </div>

            <MonacoCodeEditor
              initialCode={code}
              starterCode={currentProject.starterCode}
              testCases={currentProject.testCases}
              onCodeChange={(newCode) => {
                setCode(newCode);
                saveSubmissionDraft(currentProject.id, newCode, analysisText, designText, testReportText);
              }}
            />
          </div>

        </div>
      )}

      {/* Tab 2: Live Team Chat & Discussion Forum */}
      {activeMainTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Messages Feed (3 Cols) */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-[#83C5BE] text-[#006D77] shadow-xs flex flex-col h-[520px]">
            <div className="p-4 border-b border-[#83C5BE] flex items-center justify-between bg-[#EDF6F9] rounded-t-2xl">
              <div>
                <h3 className="font-bold text-sm text-white">منتدى المناقشات وغرفة حوار الفريق</h3>
                <p className="text-[11px] text-[#E29578]">تبادل الآراء، الاستفسارات، وتنسيق خطوات تنفيذ المشروع</p>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#006D77] text-white font-bold border border-[#E29578]/50">
                ● نشط الآن
              </span>
            </div>

            {/* Chat List */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {teamDiscussions.map(msg => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div key={msg.id} className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <img src={msg.senderAvatar} className="w-8 h-8 rounded-lg object-cover ring-1 ring-[#EDF6F9] shrink-0" />
                    <div className={`max-w-lg rounded-2xl p-3 text-xs leading-relaxed ${
                      isMe ? 'bg-[#006D77] text-white rounded-tl-xs' : 'bg-[#EDF6F9] text-white rounded-tr-xs'
                    }`}>
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className={`font-bold ${isMe ? 'text-[#E29578]' : 'text-white'}`}>{msg.senderName}</span>
                        <span className={`text-[10px] ${isMe ? 'text-[#006D77]' : 'text-[#E29578]'}`}>
                          {roleBadgeMap[msg.senderRole]?.label}
                        </span>
                      </div>
                      <p>{msg.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Send Form */}
            <form onSubmit={handleSendChatMessage} className="p-3 border-t border-[#83C5BE] flex items-center gap-2 bg-[#EDF6F9] rounded-b-2xl">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="اكتب رسالتك لأعضاء الفريق..."
                className="flex-1 px-4 py-2.5 text-xs bg-white rounded-xl border border-[#83C5BE] focus:outline-hidden focus:ring-2 focus:ring-[#004D54]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#006D77] hover:bg-white text-[#006D77] font-bold text-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>إرسال</span>
              </button>
            </form>
          </div>

          {/* Shared Files & Team Guidelines (1 Col) */}
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-[#83C5BE] text-[#006D77] shadow-xs space-y-3">
              <h3 className="font-bold text-xs text-white flex items-center gap-1.5">
                <Paperclip className="w-4 h-4 text-[#006D77]" />
                الملفات والمصادر المشتركة
              </h3>
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-[#EDF6F9] rounded-lg border border-[#83C5BE] flex items-center justify-between">
                  <span className="font-medium text-white truncate">مخطط_الخوارزمية_المشروع3.pdf</span>
                  <span className="text-[10px] text-[#006D77] font-bold cursor-pointer hover:underline">تحميل</span>
                </div>
                <div className="p-2 bg-[#EDF6F9] rounded-lg border border-[#83C5BE] flex items-center justify-between">
                  <span className="font-medium text-white truncate">بيانات_الاختبارات_التجريبية.json</span>
                  <span className="text-[10px] text-[#006D77] font-bold cursor-pointer hover:underline">تحميل</span>
                </div>
              </div>
            </div>

            <div className="bg-[#006D77] p-4 rounded-xl border border-[#E29578]/50 text-xs text-white space-y-1">
              <h4 className="font-bold">💡 إرشادات التعلم التشاركي:</h4>
              <p className="text-[11px] leading-relaxed text-white">
                الحوار الفعال وتنسيق الأدوار بين المحلل والمصمم والمبرمج والمختبر يرفع من جودة المنتج البرمجي وفق معايير الـ Rubric.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* Tab 3: Team Task Board (Kanban & Task Distribution) */}
      {activeMainTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-white">لوحة توزيع المهام ومتابعة إنجاز الأعضاء</h3>
              <p className="text-xs text-[#E29578]">تتبع تقدم مهام المشروع البرمجي حسب الأدوار ومراحل الإنجاز</p>
            </div>

            <button
              onClick={() => setShowAddTaskModal(true)}
              className="px-4 py-2 rounded-xl bg-[#006D77] hover:bg-white text-[#006D77] font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة مهمة جديدة</span>
            </button>
          </div>

          {/* Kanban Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Column 1: Todo */}
            <div className="bg-[#EDF6F9] p-4 rounded-2xl border border-[#83C5BE] space-y-3">
              <div className="flex items-center justify-between font-bold text-xs text-white pb-2 border-b border-[#83C5BE]">
                <span>قيد الانتظار (To Do)</span>
                <span className="px-2 py-0.5 rounded-full bg-[#EDF6F9] text-white text-[11px] font-bold">
                  {teamTasks.filter(t => t.status === 'todo').length}
                </span>
              </div>
              <div className="space-y-2">
                {teamTasks.filter(t => t.status === 'todo').map(task => (
                  <div key={task.id} className="bg-white p-3 rounded-xl border border-[#83C5BE] shadow-2xs space-y-2">
                    <h4 className="font-bold text-xs text-white">{task.title}</h4>
                    <div className="flex items-center justify-between text-[11px] text-[#E29578]">
                      <span className="font-medium text-[#006D77]">{task.assignedToName}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${roleBadgeMap[task.assignedRole]?.color || 'bg-[#EDF6F9] text-[#006D77]/80'}`}>
                        {roleBadgeMap[task.assignedRole]?.label}
                      </span>
                    </div>
                    <button
                      onClick={() => updateTaskStatus(task.id, 'in_progress')}
                      className="w-full py-1 rounded bg-[#006D77] hover:bg-[#E29578] text-white text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      بدء التنفيذ ←
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: In Progress */}
            <div className="bg-[#006D77] p-4 rounded-2xl border border-[#E29578]/50 space-y-3">
              <div className="flex items-center justify-between font-bold text-xs text-white pb-2 border-b border-[#E29578]/50">
                <span>جاري العمل (In Progress)</span>
                <span className="px-2 py-0.5 rounded-full bg-[#E29578] text-white text-[11px] font-bold">
                  {teamTasks.filter(t => t.status === 'in_progress').length}
                </span>
              </div>
              <div className="space-y-2">
                {teamTasks.filter(t => t.status === 'in_progress').map(task => (
                  <div key={task.id} className="bg-white p-3 rounded-xl border border-[#E29578]/50 shadow-2xs space-y-2">
                    <h4 className="font-bold text-xs text-white">{task.title}</h4>
                    <div className="flex items-center justify-between text-[11px] text-[#E29578]">
                      <span className="font-medium text-[#006D77]">{task.assignedToName}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${roleBadgeMap[task.assignedRole]?.color || 'bg-[#EDF6F9] text-[#006D77]/80'}`}>
                        {roleBadgeMap[task.assignedRole]?.label}
                      </span>
                    </div>
                    <button
                      onClick={() => updateTaskStatus(task.id, 'done')}
                      className="w-full py-1 rounded bg-[#006D77] hover:bg-white text-[#006D77] text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      إتمام المهمة ✓
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Done */}
            <div className="bg-[#006D77] p-4 rounded-2xl border border-[#E29578]/50 space-y-3">
              <div className="flex items-center justify-between font-bold text-xs text-white pb-2 border-b border-[#E29578]/50">
                <span>المكتملة (Done)</span>
                <span className="px-2 py-0.5 rounded-full bg-[#E29578] text-white text-[11px] font-bold">
                  {teamTasks.filter(t => t.status === 'done').length}
                </span>
              </div>
              <div className="space-y-2">
                {teamTasks.filter(t => t.status === 'done').map(task => (
                  <div key={task.id} className="bg-white p-3 rounded-xl border border-[#E29578]/50 shadow-2xs space-y-1.5 opacity-90">
                    <div className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#006D77] shrink-0 mt-0.5" />
                      <h4 className="font-bold text-xs line-through text-[#E29578]">{task.title}</h4>
                    </div>
                    <p className="text-[11px] text-[#006D77] font-semibold pr-5">أنجزها: {task.assignedToName}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 4: Contribution Metrics */}
            <div className="bg-white p-4 rounded-2xl border border-[#83C5BE] space-y-3 shadow-xs">
              <h4 className="font-bold text-xs text-white pb-2 border-b border-[#83C5BE]">
                مؤشرات مساهمة الأعضاء
              </h4>
              <div className="space-y-3 text-xs">
                {(team?.members || []).map(m => (
                  <div key={m.userId} className="space-y-1">
                    <div className="flex items-center justify-between text-[#006D77]/80">
                      <span className="font-medium text-white">{m.name}</span>
                      <span className="font-bold text-[#006D77]">{m.completedTaskCount} مهام</span>
                    </div>
                    <div className="w-full bg-[#EDF6F9] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#006D77] h-full rounded-full" style={{ width: `${(m.completedTaskCount / (m.assignedTaskCount || 1)) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab 4: Rubric Evaluation & Team Feedback */}
      {activeMainTab === 'rubric' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#83C5BE] text-[#006D77] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#83C5BE] pb-4">
              <div>
                <span className="text-xs font-bold text-white bg-[#006D77] px-2.5 py-1 rounded-lg border border-[#E29578]/50">
                  تقييم المشروع التشاركي
                </span>
                <h2 className="text-lg font-extrabold text-white mt-2">
                  بطاقة تقييم منتج الفريق (Rubric) والتغذية الراجعة
                </h2>
                <p className="text-xs text-[#E29578] mt-0.5">
                  رصد أداء الفريق ككل في إتقان معايير البرمجة السبعة والتنسيق الجماعي.
                </p>
              </div>

              {teamSubmission?.totalScore !== undefined ? (
                <div className="bg-[#006D77] border border-[#E29578]/50 p-3 rounded-xl text-center shrink-0">
                  <span className="text-xs text-white block font-bold">درجة الفريق:</span>
                  <span className="text-2xl font-black text-[#006D77]">{teamSubmission.totalScore} / 100</span>
                </div>
              ) : (
                <div className="bg-[#EDF6F9] border border-[#FFDDD2] p-3 rounded-xl text-center shrink-0">
                  <span className="text-xs text-[#7A5416] block font-bold">حالة التسليم:</span>
                  <span className="text-xs font-bold text-[#91472F]">
                    {teamSubmission?.status === 'submitted' ? 'تم الرفع وبانتظار تقييم المعلم' : 'قيد التطوير'}
                  </span>
                </div>
              )}
            </div>

            {teamSubmission?.teacherGeneralFeedback && (
              <div className="p-4 rounded-xl bg-[#006D77]/80 border border-[#E29578]/50 text-xs text-white space-y-1">
                <h3 className="font-bold text-white flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-[#006D77]" />
                  ملاحظات وتوجيهات المعلم للفريق:
                </h3>
                <p className="leading-relaxed text-white">{teamSubmission.teacherGeneralFeedback}</p>
              </div>
            )}
          </div>

          <RubricViewer
            criteria={currentProject.rubricCriteria}
            selectedScores={teamSubmission?.rubricScores || {}}
            totalScore={teamSubmission?.totalScore}
            isEditable={false}
          />
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 bg-white/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#83C5BE] space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-base text-white">إسناد مهمة جديدة لعضو في الفريق</h3>
            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-white block mb-1">عنوان المهمة:</label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="مثال: تحليل شروط الدرجات الكسرية"
                  className="w-full p-2.5 rounded-lg border border-[#83C5BE] focus:ring-2 focus:ring-[#004D54]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-white block mb-1">إسناد إلى العضو:</label>
                <select
                  value={newTaskAssignee}
                  onChange={(e) => setNewTaskAssignee(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#83C5BE] focus:ring-2 focus:ring-[#004D54]"
                  required
                >
                  <option value="">اختر عضو الفريق...</option>
                  {(team?.members || []).map(m => (
                    <option key={m.userId} value={m.userId}>
                      {m.name} ({roleBadgeMap[m.role]?.label})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-white block mb-1">مستوى الأولوية:</label>
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg border border-[#83C5BE]"
                >
                  <option value="low">منخفضة</option>
                  <option value="medium">متوسطة</option>
                  <option value="high">عالية</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#83C5BE] text-[#006D77]/80 font-semibold cursor-pointer hover:bg-[#EDF6F9]"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#006D77] text-white font-bold hover:bg-[#E29578] cursor-pointer"
                >
                  إضافة المهمة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Socratic AI Tutor */}
      <AITutorWidget 
        currentProject={currentProject} 
        currentCode={code} 
        studentRole={currentUser.teamRole}
        experimentalGroup="collaborative" 
      />

    </div>
  );
};
