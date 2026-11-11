// context/AppContext.tsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, deleteUser as deleteFirebaseUser } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { isFirebaseConfigured, requireFirebase } from '../lib/firebase';
import { isPlatformAdmin, canEditAcademicContent } from '../lib/permissions';
import { 
  UserProfile, 
  LearningUnit, 
  ProjectDefinition, 
  ProjectSubmission, 
  TeamGroup, 
  TeamDiscussionMessage, 
  TeamTask, 
  AssessmentQuestion,
  UserRole,
  ExperimentalGroup,
  TeamMemberRole,
  EngagementScoreData
} from '../types/schema';
import { 
  INITIAL_USERS, 
  INITIAL_UNITS, 
  INITIAL_PROJECTS, 
  INITIAL_SUBMISSIONS, 
  INITIAL_TEAMS, 
  INITIAL_DISCUSSIONS, 
  INITIAL_TASKS,
  PRE_POST_TEST_QUESTIONS
} from '../data/mockData';

interface AppContextType {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  units: LearningUnit[];
  projects: ProjectDefinition[];
  submissions: ProjectSubmission[];
  teams: TeamGroup[];
  discussions: TeamDiscussionMessage[];
  tasks: TeamTask[];
  prePostQuestions: AssessmentQuestion[];
  activeTab: string;
  selectedProjectId: string;
  selectedUnitId: string;
  isAuthenticated: boolean;
  
  // Actions
  setActiveTab: (tab: string) => void;
  setSelectedProjectId: (projectId: string) => void;
  setSelectedUnitId: (unitId: string) => void;
  switchUser: (userId: string) => void;
  switchRoleQuick: (role: UserRole) => void;
  loginWithCredentials: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  registerNewUser: (
    name: string, 
    email: string, 
    role: UserRole, 
    group: ExperimentalGroup, 
    teamRole?: TeamMemberRole,
    password?: string
  ) => Promise<void>;
  
  // Teacher Management Actions
  addNewStudent: (student: {
    name: string;
    email: string;
    password?: string;
    studentIdNum?: string;
    group: ExperimentalGroup;
    teamId?: string;
    teamRole?: TeamMemberRole;
  }) => Promise<void>;
  bulkAddStudents: (studentsList: Array<{
    name: string;
    email: string;
    password?: string;
    studentIdNum?: string;
    group: ExperimentalGroup;
    teamRole?: TeamMemberRole;
  }>) => Promise<{ count: number; failed: string[] }>;
  addNewTeacher: (teacher: {
    name: string;
    email: string;
    password?: string;
    title?: string;
  }) => void;
  deleteUser: (userId: string) => Promise<void>;
  updateUser: (userId: string, updatedData: Partial<UserProfile>) => void;
  deleteTeam: (teamId: string) => void;
  resetAllDataToClean: () => void;
  
  // Project & Submission Actions
  saveSubmissionDraft: (projectId: string, code: string, analysis?: string, design?: string, testReport?: string) => void;
  submitProjectForReview: (projectId: string, code: string, analysis?: string, design?: string, testReport?: string) => void;
  gradeSubmission: (
    submissionId: string, 
    rubricScores: Record<string, number>, 
    totalScore: number, 
    teacherFeedback: string,
    lineComments?: { lineNumber: number; comment: string; authorName: string; createdAt: string }[]
  ) => void;
  
  // Collaborative Actions
  sendMessage: (content: string, attachments?: { name: string; type: string; url: string; size: string }[]) => void;
  addTask: (title: string, description: string, assignedToUserId: string, priority: 'low' | 'medium' | 'high', dueDate: string) => void;
  updateTaskStatus: (taskId: string, status: 'todo' | 'in_progress' | 'review' | 'done') => void;
  updateStudentGroupAndRole: (studentId: string, group: ExperimentalGroup, teamId?: string, teamRole?: TeamMemberRole) => void;
  createNewTeam: (teamName: string, description: string, memberIds: string[], maxMembers?: number) => void;
  
  // Assessment & Engagement
  saveAssessmentResult: (type: 'pre_test' | 'post_test', score: number, answers: Record<string, number>, correctAnswers: number, totalQuestions: number) => Promise<void>;
  saveEngagementSurvey: (scores: EngagementScoreData) => void;
  saveStudentEngagementResponses: (studentId: string, scores: EngagementScoreData) => void;
  
  // Helper getters
  getCurrentProject: () => ProjectDefinition;
  getCurrentUnit: () => LearningUnit;
  getCurrentTeam: () => TeamGroup | undefined;
  getCurrentUserSubmission: (projectId: string) => ProjectSubmission | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'educode_pbl_state_v3';

export const normalizeArabicText = (text: string): string => {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[\u064B-\u065F\u0670]/g, '') // remove tashkeel
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/\s+/g, ' ');
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state or use initial defaults
  const [users, setUsers] = useState<UserProfile[]>([]);

  const [currentUserId, setCurrentUserId] = useState<string>('');

  const [units, setUnits] = useState<LearningUnit[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_units`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If stored units contain old placeholder videos or lack unitVideos, upgrade to fresh INITIAL_UNITS
          const hasOldVideo = parsed.some((u: any) => !u.unitVideos || (u.videoUrl && u.videoUrl.includes('dQw4w9WgXcQ')));
          if (!hasOldVideo) {
            return parsed;
          }
        }
      } catch (e) {}
    }
    return INITIAL_UNITS;
  });

  const [projects, setProjects] = useState<ProjectDefinition[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_projects`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_PROJECTS;
  });

  const [submissions, setSubmissions] = useState<ProjectSubmission[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_submissions`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return INITIAL_SUBMISSIONS;
  });

  const [teams, setTeams] = useState<TeamGroup[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_teams`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_TEAMS;
  });

  const [discussions, setDiscussions] = useState<TeamDiscussionMessage[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_discussions`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return INITIAL_DISCUSSIONS;
  });

  const [tasks, setTasks] = useState<TeamTask[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_tasks`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return INITIAL_TASKS;
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('project_1');
  const [selectedUnitId, setSelectedUnitId] = useState<string>('unit_1');

  // Authentication state - Require login when opening site (default false unless authenticated)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const provisioningUidRef = useRef<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    // Remove the old local account cache, which stored plaintext demo passwords.
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_users`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_current_user`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_is_authenticated`);
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      return;
    }
    const { auth, db } = requireFirebase();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && provisioningUidRef.current) return;
      if (!firebaseUser) {
        setUsers([]);
        setCurrentUserId('');
        setIsAuthenticated(false);
        return;
      }
      try {
        const profileSnapshot = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (!profileSnapshot.exists()) {
          await signOut(auth);
          setUsers([]);
          setCurrentUserId('');
          setIsAuthenticated(false);
          return;
        }
        const profile = { id: firebaseUser.uid, ...profileSnapshot.data() } as UserProfile;
        if (profile.status !== 'active') {
          await signOut(auth);
          setUsers([]);
          setCurrentUserId('');
          setIsAuthenticated(false);
          return;
        }
        // Platform admins, academic supervisors, and researchers can view
        // the student directory. Firestore rules enforce this as read-only
        // access for supervisors/researchers.
        const canViewAllStudents = [
          'platform_admin',
          'academic_supervisor',
          'researcher'
        ].includes(profile.role);

        if (canViewAllStudents) {
          const usersSnapshot = await getDocs(collection(db, 'users'));
          setUsers(usersSnapshot.docs.map(userDoc => ({
            id: userDoc.id,
            ...userDoc.data()
          } as UserProfile)));

          // Load real project submissions for the staff dashboard from Firestore.
          const submissionsSnapshot = await getDocs(collection(db, 'submissions'));
          if (!submissionsSnapshot.empty) {
            setSubmissions(submissionsSnapshot.docs.map(submissionDoc => ({
              id: submissionDoc.id,
              ...submissionDoc.data()
            } as ProjectSubmission)));
          }
        } else {
          setUsers([profile]);
          // Students can read their own submissions and submissions for their team.
          const ownSubmissions = await getDocs(query(
            collection(db, 'submissions'),
            where('studentId', '==', firebaseUser.uid)
          ));
          const loadedSubmissions = new Map<string, ProjectSubmission>();
          ownSubmissions.docs.forEach(submissionDoc => loadedSubmissions.set(submissionDoc.id, {
            id: submissionDoc.id,
            ...submissionDoc.data()
          } as ProjectSubmission));
          if (profile.teamId) {
            const teamSubmissions = await getDocs(query(
              collection(db, 'submissions'),
              where('teamId', '==', profile.teamId)
            ));
            teamSubmissions.docs.forEach(submissionDoc => loadedSubmissions.set(submissionDoc.id, {
              id: submissionDoc.id,
              ...submissionDoc.data()
            } as ProjectSubmission));
          }
          if (loadedSubmissions.size) setSubmissions(Array.from(loadedSubmissions.values()));
        }
        setCurrentUserId(firebaseUser.uid);
        setIsAuthenticated(true);
        setActiveTab(profile.role === 'platform_admin' || profile.role === 'researcher' ? 'teacher_dashboard' : 'dashboard');
      } catch (error) {
        console.error('Unable to load Firebase user profile:', error);
        await signOut(auth);
        setUsers([]);
        setCurrentUserId('');
        setIsAuthenticated(false);
      }
    });
    return unsubscribe;
  }, []);





  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_submissions`, JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_discussions`, JSON.stringify(discussions));
  }, [discussions]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_tasks`, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_teams`, JSON.stringify(teams));
  }, [teams]);

  const currentUser = users.find(u => u.id === currentUserId) || users[0] || INITIAL_USERS[0];

  const switchUser = (_userId: string) => {
    // Local/demo account switching is disabled; Firebase Authentication owns the session.
  };

  const switchRoleQuick = (_role: UserRole) => {
    // Role switching is disabled because it bypasses Firebase Authentication.
  };

  const loginWithCredentials = async (email: string, passwordInput: string): Promise<{ success: boolean; message?: string }> => {
    const cleanEmailInput = email.trim().toLowerCase();
    const cleanPassword = passwordInput;

    if (!cleanEmailInput) {
      return {
        success: false,
        message: 'يرجى إدخال البريد الإلكتروني.'
      };
    }

    if (!cleanPassword) {
      return {
        success: false,
        message: 'يرجى إدخال كلمة المرور.'
      };
    }

    try {
      const { auth, db } = requireFirebase();
      const credential = await signInWithEmailAndPassword(auth, cleanEmailInput, cleanPassword);
      const profileSnapshot = await getDoc(doc(db, 'users', credential.user.uid));
      if (!profileSnapshot.exists()) {
        await signOut(auth);
        return { success: false, message: 'تم التحقق من كلمة المرور، لكن الحساب غير مهيأ داخل المنصة. تواصل مع مدير المنصة.' };
      }
      const profile = profileSnapshot.data();
      if (profile.status !== 'active') {
        await signOut(auth);
        return { success: false, message: 'هذا الحساب غير نشط. تواصل مع مدير المنصة.' };
      }
      return { success: true };
    } catch (error: any) {
      const code = error?.code as string | undefined;
      const messages: Record<string, string> = {
        'auth/invalid-email': 'صيغة البريد الإلكتروني غير صحيحة.',
        'auth/user-disabled': 'هذا الحساب موقوف. تواصل مع مدير المنصة.',
        'auth/user-not-found': 'لا يوجد حساب بهذا البريد الإلكتروني.',
        'auth/wrong-password': 'كلمة المرور غير صحيحة.',
        'auth/invalid-credential': 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
        'auth/too-many-requests': 'محاولات كثيرة. انتظر قليلًا ثم حاول مرة أخرى.'
      };
      return { success: false, message: messages[code || ''] || 'تعذر تسجيل الدخول. تحقق من الاتصال وإعدادات Firebase.' };
    }
  };

  const logout = async () => {
    try {
      const { auth } = requireFirebase();
      await signOut(auth);
    } finally {
      setIsAuthenticated(false);
      setUsers([]);
      setCurrentUserId('');
      setActiveTab('home');
    }
  };

  const registerNewUser = async (
    name: string,
    email: string,
    role: UserRole,
    group: ExperimentalGroup,
    teamRole?: TeamMemberRole,
    password?: string
  ): Promise<void> => {
    if (role !== 'student_individual' && role !== 'student_collaborative') {
      throw new Error('إنشاء حسابات الموظفين يتم من خلال مدير المنصة فقط.');
    }
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPassword = password || '';
    if (!cleanName || !cleanEmail || cleanPassword.length < 6) {
      throw new Error('أدخل الاسم والبريد وكلمة مرور لا تقل عن 6 أحرف.');
    }
    const { auth, db } = requireFirebase();
    let createdCredential: Awaited<ReturnType<typeof createUserWithEmailAndPassword>> | null = null;
    try {
      provisioningUidRef.current = 'pending';
      createdCredential = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      const uid = createdCredential.user.uid;
      provisioningUidRef.current = uid;
      const avatar = 'https://api.dicebear.com/7.x/bottts/svg?seed=' + encodeURIComponent(cleanName);
      const profile: Omit<UserProfile, 'id'> = {
        name: cleanName,
        email: cleanEmail,
        avatar,
        role,
        experimentalGroup: group,
        ...(role === 'student_collaborative' ? { teamRole: teamRole || 'coder' } : {}),
        joinedAt: new Date().toISOString().slice(0, 10),
        status: 'active',
        progressPercentage: 0,
        completedProjectsCount: 0,
        completedActivitiesCount: 0,
        engagementScore: { behavioral: 0, cognitive: 0, emotional: 0 }
      };
      await setDoc(doc(db, 'users', uid), profile);
      provisioningUidRef.current = null;
      setUsers([ { id: uid, ...profile } as UserProfile ]);
      setCurrentUserId(uid);
      setIsAuthenticated(true);
      setActiveTab('dashboard');
    } catch (error) {
      provisioningUidRef.current = null;
      if (createdCredential?.user) {
        try { await deleteFirebaseUser(createdCredential.user); } catch (cleanupError) {
          console.error('Could not clean up orphan Firebase Auth user:', cleanupError);
        }
      }
      throw error;
    }
  };

  const createStudentsThroughAdminApi = async (students: Array<{
    name: string;
    email: string;
    password?: string;
    studentIdNum?: string;
    group: ExperimentalGroup;
    teamId?: string;
    teamRole?: TeamMemberRole;
  }>): Promise<{ created: UserProfile[]; failed: string[] }> => {
    if (!isPlatformAdmin(currentUser?.role)) throw new Error('غير مصرح لك بإنشاء حسابات الطلاب.');
    const { auth } = requireFirebase();
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) throw new Error('انتهت جلسة الدخول. سجل الدخول مرة أخرى.');
    const idToken = await firebaseUser.getIdToken();
    const response = await fetch('/api/admin/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
      body: JSON.stringify({ students })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.success) throw new Error(result.error || 'تعذر إنشاء حسابات الطلاب.');
    return { created: (result.created || []) as UserProfile[], failed: (result.failed || []) as string[] };
  };

  const addNewStudent = async (student: {
    name: string;
    email: string;
    password?: string;
    studentIdNum?: string;
    group: ExperimentalGroup;
    teamId?: string;
    teamRole?: TeamMemberRole;
  }): Promise<void> => {
    const result = await createStudentsThroughAdminApi([student]);
    const newStudent = result.created[0];
    if (!newStudent) throw new Error(result.failed[0] || 'لم يتم إنشاء حساب الطالب.');
    setUsers(prev => [...prev.filter(user => user.id !== newStudent.id), newStudent]);
    if (student.teamId) {
      setTeams(prevTeams => prevTeams.map(team => {
        if (team.id !== student.teamId) return team;
        const member = {
          userId: newStudent.id, name: newStudent.name, avatar: newStudent.avatar,
          role: student.teamRole || 'coder', assignedTaskCount: 0, completedTaskCount: 0
        };
        return {
          ...team,
          memberIds: team.memberIds.includes(newStudent.id) ? team.memberIds : [...team.memberIds, newStudent.id],
          members: [...team.members.filter(item => item.userId !== newStudent.id), member]
        };
      }));
    }
  };

  const bulkAddStudents = async (studentsList: Array<{
    name: string;
    email: string;
    password?: string;
    studentIdNum?: string;
    group: ExperimentalGroup;
    teamRole?: TeamMemberRole;
  }>): Promise<{ count: number; failed: string[] }> => {
    if (!studentsList.length) return { count: 0, failed: [] };
    const result = await createStudentsThroughAdminApi(studentsList);
    if (result.created.length) {
      setUsers(prev => {
        const byId = new Map(prev.map(user => [user.id, user]));
        result.created.forEach(user => byId.set(user.id, user));
        return Array.from(byId.values());
      });
    }
    return { count: result.created.length, failed: result.failed };
  };

  const addNewTeacher = (teacher: {
    name: string;
    email: string;
    password?: string;
    title?: string;
  }) => {
    if (!isPlatformAdmin(currentUser?.role)) return;
    const newId = `teacher_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newTeacherObj: UserProfile = {
      id: newId,
      name: teacher.name,
      email: teacher.email,
      password: teacher.password?.trim() || 'teacher123',
      avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80`,
      role: 'teacher_admin',
      experimentalGroup: 'collaborative_group',
      joinedAt: new Date().toISOString().split('T')[0],
      status: 'active',
      progressPercentage: 100,
      completedProjectsCount: 4,
      completedActivitiesCount: 10,
      preTestScore: 100,
      postTestScore: 100
    };

    setUsers(prev => [...prev, newTeacherObj]);
  };

  const deleteUser = async (userId: string): Promise<void> => {
    if (!isPlatformAdmin(currentUser?.role)) throw new Error('غير مصرح لك بحذف الطلاب.');
    const target = users.find(user => user.id === userId);
    if (!target || !['student_individual', 'student_collaborative'].includes(target.role)) {
      throw new Error('الطالب المطلوب حذفه غير موجود.');
    }
    const { auth } = requireFirebase();
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) throw new Error('انتهت جلسة الدخول. سجل الدخول مرة أخرى.');
    const idToken = await firebaseUser.getIdToken();
    const response = await fetch('/api/admin/students', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
      body: JSON.stringify({ studentId: userId })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.success) throw new Error(result.error || 'تعذر حذف حساب الطالب.');

    setUsers(prev => prev.filter(user => user.id !== userId));
    setTeams(prevTeams => prevTeams.map(team => ({
      ...team,
      memberIds: team.memberIds.filter(id => id !== userId),
      members: team.members.filter(member => member.userId !== userId)
    })));
  };

  const updateUser = (userId: string, updatedData: Partial<UserProfile>) => {
    if (!isPlatformAdmin(currentUser?.role)) return;
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedData } : u));
  };

  const deleteTeam = (teamId: string) => {
    if (!isPlatformAdmin(currentUser?.role)) return;
    setTeams(prev => prev.filter(t => t.id !== teamId));
    // Clear teamId for affected users
    setUsers(prev => prev.map(u => u.teamId === teamId ? { ...u, teamId: undefined } : u));
  };

  const resetAllDataToClean = () => {
    if (!isPlatformAdmin(currentUser?.role)) return;
    setUsers(INITIAL_USERS);
    setCurrentUserId('user_doctor_ibrahim');
    setSubmissions(INITIAL_SUBMISSIONS);
    setTeams(INITIAL_TEAMS);
    setDiscussions(INITIAL_DISCUSSIONS);
    setTasks(INITIAL_TASKS);
    setActiveTab('home');
  };

  const getCurrentProject = () => {
    return projects.find(p => p.id === selectedProjectId) || projects[0];
  };

  const getCurrentUnit = () => {
    return units.find(u => u.id === selectedUnitId) || units[0];
  };

  const getCurrentTeam = () => {
    if (!currentUser?.teamId) {
      if (currentUser?.role === 'student_collaborative') {
        return (teams || [])[0];
      }
      return undefined;
    }
    return (teams || []).find(t => t.id === currentUser.teamId) || (currentUser.role === 'student_collaborative' ? (teams || [])[0] : undefined);
  };

  const getCurrentUserSubmission = (projectId: string) => {
    if (currentUser.role === 'student_collaborative' && currentUser.teamId) {
      return submissions.find(s => s.projectId === projectId && s.teamId === currentUser.teamId);
    }
    return submissions.find(s => s.projectId === projectId && s.studentId === currentUser.id);
  };

  const persistSubmissionRecord = async (submission: ProjectSubmission) => {
    try {
      const { db } = requireFirebase();
      await setDoc(doc(db, 'submissions', submission.id), submission, { merge: true });
    } catch (error) {
      console.error('Unable to persist project submission to Firestore:', error);
    }
  };

  const saveSubmissionDraft = (projectId: string, code: string, analysis?: string, design?: string, testReport?: string) => {
    const isCollab = currentUser.role === 'student_collaborative';
    const teamId = currentUser.teamId;
    const existing = submissions.find(s =>
      s.projectId === projectId && (isCollab && teamId ? s.teamId === teamId : s.studentId === currentUser.id)
    );
    const updatedObj: ProjectSubmission = {
      id: existing?.id || `sub_${Date.now()}_${currentUser.id}`,
      projectId,
      studentId: currentUser.id,
      studentName: isCollab ? (getCurrentTeam()?.name || currentUser.name) : currentUser.name,
      teamId: isCollab ? teamId : undefined,
      experimentalGroup: currentUser.experimentalGroup,
      code,
      problemAnalysisText: analysis || existing?.problemAnalysisText || '',
      solutionDesignText: design || existing?.solutionDesignText || '',
      testReportText: testReport || existing?.testReportText || '',
      status: 'in_progress',
      submittedAt: existing?.submittedAt
    };
    setSubmissions(prev => [...prev.filter(item => item.id !== updatedObj.id), updatedObj]);
    void persistSubmissionRecord(updatedObj);
  };

  const submitProjectForReview = (projectId: string, code: string, analysis?: string, design?: string, testReport?: string) => {
    const isCollab = currentUser.role === 'student_collaborative';
    const teamId = currentUser.teamId;
    const existing = submissions.find(s =>
      s.projectId === projectId && (isCollab && teamId ? s.teamId === teamId : s.studentId === currentUser.id)
    );
    const submittedObj: ProjectSubmission = {
      id: existing?.id || `sub_${Date.now()}_${currentUser.id}`,
      projectId,
      studentId: currentUser.id,
      studentName: isCollab ? (getCurrentTeam()?.name || currentUser.name) : currentUser.name,
      teamId: isCollab ? teamId : undefined,
      experimentalGroup: currentUser.experimentalGroup,
      code,
      problemAnalysisText: analysis || existing?.problemAnalysisText || '',
      solutionDesignText: design || existing?.solutionDesignText || '',
      testReportText: testReport || existing?.testReportText || '',
      status: 'submitted',
      submittedAt: new Date().toISOString()
    };
    setSubmissions(prev => [...prev.filter(item => item.id !== submittedObj.id), submittedObj]);
    void persistSubmissionRecord(submittedObj);

    // Update local progress counters for the student and their collaborative teammates.
    setUsers(prevUsers => prevUsers.map(u => {
      if (u.id === currentUser.id || (isCollab && u.teamId === teamId)) {
        return {
          ...u,
          progressPercentage: Math.min(100, u.progressPercentage + 15),
          completedProjectsCount: Math.min(4, u.completedProjectsCount + 1)
        };
      }
      return u;
    }));
  };

  const gradeSubmission = (
    submissionId: string,
    rubricScores: Record<string, number>,
    totalScore: number,
    teacherFeedback: string,
    lineComments: { lineNumber: number; comment: string; authorName: string; createdAt: string }[] = []
  ) => {
    if (!canEditAcademicContent(currentUser?.role)) return;
    const existing = submissions.find(item => item.id === submissionId);
    if (!existing) return;
    const updated: ProjectSubmission = {
      ...existing,
      status: 'evaluated',
      evaluatedAt: new Date().toISOString(),
      evaluatorId: currentUser.id,
      rubricScores,
      totalScore,
      maxScore: 100,
      teacherGeneralFeedback: teacherFeedback,
      codeLineComments: lineComments
    };
    setSubmissions(prev => prev.map(item => item.id === submissionId ? updated : item));
    // Firestore rules currently reserve submission grading writes for platform admins.
    if (isPlatformAdmin(currentUser?.role)) void persistSubmissionRecord(updated);
  };

  const sendMessage = (content: string, attachments?: { name: string; type: string; url: string; size: string }[]) => {
    if (!currentUser.teamId) return;
    const newMsg: TeamDiscussionMessage = {
      id: `msg_${Date.now()}`,
      teamId: currentUser.teamId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderRole: currentUser.teamRole || 'coder',
      content,
      createdAt: new Date().toISOString(),
      attachments
    };
    setDiscussions(prev => [...prev, newMsg]);
  };

  const addTask = (title: string, description: string, assignedToUserId: string, priority: 'low' | 'medium' | 'high', dueDate: string) => {
    if (!currentUser.teamId) return;
    const assignee = users.find(u => u.id === assignedToUserId);
    const newTask: TeamTask = {
      id: `task_${Date.now()}`,
      teamId: currentUser.teamId,
      projectId: selectedProjectId,
      title,
      description,
      assignedToUserId,
      assignedToName: assignee ? assignee.name : 'عضو الفريق',
      assignedRole: assignee?.teamRole || 'coder',
      status: 'todo',
      priority,
      dueDate
    };
    setTasks(prev => [...prev, newTask]);

    // update team counts
    setTeams(prevTeams => prevTeams.map(t => {
      if (t.id === currentUser.teamId) {
        return {
          ...t,
          totalTasksCount: t.totalTasksCount + 1
        };
      }
      return t;
    }));
  };

  const updateTaskStatus = (taskId: string, status: 'todo' | 'in_progress' | 'review' | 'done') => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
    
    // Recalculate team progress
    if (currentUser.teamId) {
      setTimeout(() => {
        setTeams(prevTeams => prevTeams.map(t => {
          if (t.id === currentUser.teamId) {
            const teamTasks = tasks.map(tk => tk.id === taskId ? { ...tk, status } : tk).filter(tk => tk.teamId === t.id);
            const doneCount = teamTasks.filter(tk => tk.status === 'done').length;
            const progress = teamTasks.length > 0 ? Math.round((doneCount / teamTasks.length) * 100) : 0;
            return {
              ...t,
              completedTasksCount: doneCount,
              progressPercentage: progress
            };
          }
          return t;
        }));
      }, 50);
    }
  };

  const updateStudentGroupAndRole = (studentId: string, group: ExperimentalGroup, teamId?: string, teamRole?: TeamMemberRole) => {
    if (!isPlatformAdmin(currentUser?.role)) return;
    const student = users.find(u => u.id === studentId);
    if (!student) return;

    setUsers(prev => prev.map(u => u.id === studentId ? {
      ...u,
      experimentalGroup: group,
      role: group === 'individual_group' ? 'student_individual' : 'student_collaborative',
      teamId: group === 'collaborative_group' ? teamId : undefined,
      teamRole: group === 'collaborative_group' ? (teamRole || u.teamRole || 'coder') : undefined
    } : u));

    setTeams(prevTeams => prevTeams.map(team => {
      const removeFromTeam = team.id !== teamId || group !== 'collaborative_group';
      const memberIds = removeFromTeam
        ? team.memberIds.filter(id => id !== studentId)
        : (team.memberIds.includes(studentId) ? team.memberIds : [...team.memberIds, studentId]);
      const members = removeFromTeam
        ? team.members.filter(member => member.userId !== studentId)
        : [
            ...team.members.filter(member => member.userId !== studentId),
            {
              userId: studentId,
              name: student.name,
              avatar: student.avatar,
              role: teamRole || student.teamRole || 'coder',
              assignedTaskCount: 0,
              completedTaskCount: 0
            }
          ];
      return { ...team, memberIds, members };
    }));
  };

  const createNewTeam = (teamName: string, description: string, memberIds: string[], maxMembers?: number) => {
    if (!isPlatformAdmin(currentUser?.role)) return;
    const teamId = `team_${Date.now()}`;
    const newTeam: TeamGroup = {
      id: teamId,
      name: teamName,
      description,
      memberIds,
      maxMembers,
      members: memberIds.map(id => {
        const u = users.find(user => user.id === id);
        return {
          userId: id,
          name: u ? u.name : 'طالب',
          avatar: u ? u.avatar : '',
          role: u?.teamRole || 'coder',
          assignedTaskCount: 0,
          completedTaskCount: 0
        };
      }),
      currentProjectId: 'project_1',
      progressPercentage: 0,
      completedTasksCount: 0,
      totalTasksCount: 0,
      createdAt: new Date().toISOString()
    };

    setTeams(prev => [...prev, newTeam]);
    // update users
    setUsers(prev => prev.map(u => memberIds.includes(u.id) ? { ...u, teamId, role: 'student_collaborative', experimentalGroup: 'collaborative_group' } : u));
  };

  const saveAssessmentResult = async (
    type: 'pre_test' | 'post_test',
    score: number,
    answers: Record<string, number>,
    correctAnswers: number,
    totalQuestions: number
  ): Promise<void> => {
    if (!currentUser?.id) throw new Error('تعذر تحديد حساب الطالب الحالي.');
    const { auth } = requireFirebase();
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) throw new Error('انتهت جلسة الدخول. سجل الدخول مرة أخرى.');
    const idToken = await firebaseUser.getIdToken();
    const response = await fetch('/api/student/assessment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
      body: JSON.stringify({ type, score, answers, correctAnswers, totalQuestions })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.success) throw new Error(result.error || 'تعذر حفظ نتيجة الاختبار.');

    setUsers(prev => prev.map(user => user.id === currentUser.id
      ? {
          ...user,
          [type === 'pre_test' ? 'preTestScore' : 'postTestScore']: score,
          [type === 'pre_test' ? 'preTestAnswers' : 'postTestAnswers']: answers
        }
      : user
    ));
  };

  const saveEngagementSurvey = (scores: EngagementScoreData) => {
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          engagementScore: scores
        };
      }
      return u;
    }));
  };

  const saveStudentEngagementResponses = (studentId: string, scores: EngagementScoreData) => {
    setUsers(prev => prev.map(u => {
      if (u.id === studentId) {
        return {
          ...u,
          engagementScore: scores
        };
      }
      return u;
    }));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      allUsers: users,
      units,
      projects,
      submissions,
      teams,
      discussions,
      tasks,
      prePostQuestions: PRE_POST_TEST_QUESTIONS,
      activeTab,
      selectedProjectId,
      selectedUnitId,
      isAuthenticated,
      setActiveTab,
      setSelectedProjectId,
      setSelectedUnitId,
      switchUser,
      switchRoleQuick,
      loginWithCredentials,
      logout,
      registerNewUser,
      addNewStudent,
      bulkAddStudents,
      addNewTeacher,
      deleteUser,
      updateUser,
      deleteTeam,
      resetAllDataToClean,
      saveSubmissionDraft,
      submitProjectForReview,
      gradeSubmission,
      sendMessage,
      addTask,
      updateTaskStatus,
      updateStudentGroupAndRole,
      createNewTeam,
      saveAssessmentResult,
      saveEngagementSurvey,
      saveStudentEngagementResponses,
      getCurrentProject,
      getCurrentUnit,
      getCurrentTeam,
      getCurrentUserSubmission
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
