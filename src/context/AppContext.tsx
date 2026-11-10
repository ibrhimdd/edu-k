// context/AppContext.tsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, deleteUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { isFirebaseConfigured, requireFirebase } from '../lib/firebase';
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
  }) => void;
  bulkAddStudents: (studentsList: Array<{
    name: string;
    email: string;
    password?: string;
    studentIdNum?: string;
    group: ExperimentalGroup;
    teamRole?: TeamMemberRole;
  }>) => { count: number };
  addNewTeacher: (teacher: {
    name: string;
    email: string;
    password?: string;
    title?: string;
  }) => void;
  deleteUser: (userId: string) => void;
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
  saveAssessmentResult: (type: 'pre_test' | 'post_test', score: number) => void;
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
  /* Legacy local user records are intentionally not loaded: they contain demo credentials.
  const [legacyUsers, setLegacyUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_users`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Deduplicate by clean email (preserving latest modified user)
          const seenEmails = new Set<string>();
          const deduped: UserProfile[] = [];
          
          for (let i = parsed.length - 1; i >= 0; i--) {
            const u = parsed[i];
            if (u && u.email) {
              const cleanEmail = u.email.trim().toLowerCase();
              if (!seenEmails.has(cleanEmail)) {
                seenEmails.add(cleanEmail);
                deduped.unshift(u);
              }
            } else if (u) {
              deduped.unshift(u);
            }
          }

          return deduped.map((u) => {
            if (!u.password) {
              return { 
                ...u, 
                password: u.role === 'teacher_admin' ? 'DrIbrahim@2026' : 'student123' 
              };
            }
            return u;
          });
        }
      } catch (e) {
        return INITIAL_USERS;
      }
    }
    return INITIAL_USERS;
  });
  */

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
      if (firebaseUser && provisioningUidRef.current === firebaseUser.uid) return;
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
        setUsers([profile]);
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
      const { auth } = requireFirebase();
      await signInWithEmailAndPassword(auth, cleanEmailInput, cleanPassword);
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
        teamRole: role === 'student_collaborative' ? (teamRole || 'coder') : undefined,
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
        try { await deleteUser(createdCredential.user); } catch (cleanupError) {
          console.error('Could not clean up orphan Firebase Auth user:', cleanupError);
        }
      }
      throw error;
    }
  };

  const addNewStudent = (student: {
    name: string;
    email: string;
    password?: string;
    studentIdNum?: string;
    group: ExperimentalGroup;
    teamId?: string;
    teamRole?: TeamMemberRole;
  }) => {
    const newId = `student_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const role: UserRole = student.group === 'collaborative_group' ? 'student_collaborative' : 'student_individual';
    const avatarSeeds = ['StudentA', 'Alex', 'Jordan', 'Taylor', 'Morgan', 'Sam', 'Chris', 'Casey'];
    const randomSeed = avatarSeeds[Math.floor(Math.random() * avatarSeeds.length)] + '_' + Date.now();

    const newStudent: UserProfile = {
      id: newId,
      name: student.name,
      email: student.email,
      password: student.password?.trim() || 'student123',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(randomSeed)}`,
      role,
      experimentalGroup: student.group,
      teamId: student.teamId,
      teamRole: student.group === 'collaborative_group' ? (student.teamRole || 'coder') : undefined,
      joinedAt: new Date().toISOString().split('T')[0],
      status: 'active',
      progressPercentage: 0,
      completedProjectsCount: 0,
      completedActivitiesCount: 0,
      preTestScore: undefined,
      postTestScore: undefined,
      engagementScore: {
        behavioral: 80,
        cognitive: 80,
        emotional: 80
      }
    };

    setUsers(prev => [...prev, newStudent]);

    // If assigned to a team, update the team members list
    if (student.teamId) {
      setTeams(prevTeams => prevTeams.map(t => {
        if (t.id === student.teamId) {
          const updatedMemberIds = t.memberIds.includes(newId) ? t.memberIds : [...t.memberIds, newId];
          const newMemberObj = {
            userId: newId,
            name: student.name,
            avatar: newStudent.avatar,
            role: student.teamRole || 'coder',
            assignedTaskCount: 0,
            completedTaskCount: 0
          };
          return {
            ...t,
            memberIds: updatedMemberIds,
            members: [...t.members.filter(m => m.userId !== newId), newMemberObj]
          };
        }
        return t;
      }));
    }
  };

  const bulkAddStudents = (studentsList: Array<{
    name: string;
    email: string;
    password?: string;
    studentIdNum?: string;
    group: ExperimentalGroup;
    teamRole?: TeamMemberRole;
  }>) => {
    let count = 0;
    const newStudents: UserProfile[] = [];

    studentsList.forEach((s, idx) => {
      if (!s.name || !s.email) return;
      const newId = `student_bulk_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 5)}`;
      const role: UserRole = s.group === 'collaborative_group' ? 'student_collaborative' : 'student_individual';
      const newStudent: UserProfile = {
        id: newId,
        name: s.name,
        email: s.email,
        password: s.password?.trim() || 'student123',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(s.name + '_' + idx)}`,
        role,
        experimentalGroup: s.group,
        teamRole: s.group === 'collaborative_group' ? (s.teamRole || 'coder') : undefined,
        joinedAt: new Date().toISOString().split('T')[0],
        status: 'active',
        progressPercentage: 0,
        completedProjectsCount: 0,
        completedActivitiesCount: 0,
        preTestScore: undefined,
        postTestScore: undefined,
        engagementScore: {
          behavioral: 80,
          cognitive: 80,
          emotional: 80
        }
      };
      newStudents.push(newStudent);
      count++;
    });

    if (newStudents.length > 0) {
      setUsers(prev => [...prev, ...newStudents]);
    }

    return { count };
  };

  const addNewTeacher = (teacher: {
    name: string;
    email: string;
    password?: string;
    title?: string;
  }) => {
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

  const deleteUser = (userId: string) => {
    // Prevent deleting the main doctor
    if (userId === 'user_doctor_ibrahim') return;

    setUsers(prev => prev.filter(u => u.id !== userId));

    // Also remove from any teams
    setTeams(prevTeams => prevTeams.map(t => ({
      ...t,
      memberIds: t.memberIds.filter(id => id !== userId),
      members: t.members.filter(m => m.userId !== userId)
    })));

    // If current user is deleted, switch back to Doctor
    if (currentUserId === userId) {
      setCurrentUserId('user_doctor_ibrahim');
    }
  };

  const updateUser = (userId: string, updatedData: Partial<UserProfile>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedData } : u));
  };

  const deleteTeam = (teamId: string) => {
    setTeams(prev => prev.filter(t => t.id !== teamId));
    // Clear teamId for affected users
    setUsers(prev => prev.map(u => u.teamId === teamId ? { ...u, teamId: undefined } : u));
  };

  const resetAllDataToClean = () => {
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

  const saveSubmissionDraft = (projectId: string, code: string, analysis?: string, design?: string, testReport?: string) => {
    const isCollab = currentUser.role === 'student_collaborative';
    const teamId = currentUser.teamId;

    setSubmissions(prev => {
      const existingIdx = prev.findIndex(s => 
        s.projectId === projectId && (isCollab && teamId ? s.teamId === teamId : s.studentId === currentUser.id)
      );

      const updatedObj: ProjectSubmission = {
        id: existingIdx >= 0 ? prev[existingIdx].id : `sub_${Date.now()}`,
        projectId,
        studentId: currentUser.id,
        studentName: isCollab ? (getCurrentTeam()?.name || currentUser.name) : currentUser.name,
        teamId: isCollab ? teamId : undefined,
        experimentalGroup: currentUser.experimentalGroup,
        code,
        problemAnalysisText: analysis || prev[existingIdx]?.problemAnalysisText || '',
        solutionDesignText: design || prev[existingIdx]?.solutionDesignText || '',
        testReportText: testReport || prev[existingIdx]?.testReportText || '',
        status: 'in_progress',
        submittedAt: prev[existingIdx]?.submittedAt
      };

      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = { ...copy[existingIdx], ...updatedObj };
        return copy;
      }
      return [...prev, updatedObj];
    });
  };

  const submitProjectForReview = (projectId: string, code: string, analysis?: string, design?: string, testReport?: string) => {
    const isCollab = currentUser.role === 'student_collaborative';
    const teamId = currentUser.teamId;

    setSubmissions(prev => {
      const existingIdx = prev.findIndex(s => 
        s.projectId === projectId && (isCollab && teamId ? s.teamId === teamId : s.studentId === currentUser.id)
      );

      const submittedObj: ProjectSubmission = {
        id: existingIdx >= 0 ? prev[existingIdx].id : `sub_${Date.now()}`,
        projectId,
        studentId: currentUser.id,
        studentName: isCollab ? (getCurrentTeam()?.name || currentUser.name) : currentUser.name,
        teamId: isCollab ? teamId : undefined,
        experimentalGroup: currentUser.experimentalGroup,
        code,
        problemAnalysisText: analysis || (existingIdx >= 0 ? prev[existingIdx].problemAnalysisText : ''),
        solutionDesignText: design || (existingIdx >= 0 ? prev[existingIdx].solutionDesignText : ''),
        testReportText: testReport || (existingIdx >= 0 ? prev[existingIdx].testReportText : ''),
        status: 'submitted',
        submittedAt: new Date().toISOString()
      };

      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = { ...copy[existingIdx], ...submittedObj };
        return copy;
      }
      return [...prev, submittedObj];
    });

    // Update user stats
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
    setSubmissions(prev => prev.map(s => {
      if (s.id === submissionId) {
        return {
          ...s,
          status: 'evaluated',
          evaluatedAt: new Date().toISOString(),
          evaluatorId: currentUser.id,
          rubricScores,
          totalScore,
          maxScore: 100,
          teacherGeneralFeedback: teacherFeedback,
          codeLineComments: lineComments
        };
      }
      return s;
    }));
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

  const saveAssessmentResult = (type: 'pre_test' | 'post_test', score: number) => {
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          [type === 'pre_test' ? 'preTestScore' : 'postTestScore']: score
        };
      }
      return u;
    }));
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
