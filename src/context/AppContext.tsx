// context/AppContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
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
  loginWithCredentials: (emailOrName: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
  registerNewUser: (
    name: string, 
    email: string, 
    role: UserRole, 
    group: ExperimentalGroup, 
    teamRole?: TeamMemberRole,
    password?: string
  ) => void;
  
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
  createNewTeam: (teamName: string, description: string, memberIds: string[]) => void;
  
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
  const [users, setUsers] = useState<UserProfile[]>(() => {
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

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_current_user`);
    return saved || 'user_doctor_ibrahim'; // Default to Doctor / Academic Supervisor
  });

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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(`${LOCAL_STORAGE_KEY}_is_authenticated`) === 'true';
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_current_user`, currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_is_authenticated`, 'true');
    } else {
      localStorage.removeItem(`${LOCAL_STORAGE_KEY}_is_authenticated`);
    }
  }, [isAuthenticated]);

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

  const switchUser = (userId: string) => {
    const found = users.find(u => u.id === userId);
    if (found) {
      setCurrentUserId(userId);
      setIsAuthenticated(true);
      setActiveTab('dashboard');
    }
  };

  const switchRoleQuick = (role: UserRole) => {
    const target = users.find(u => u.role === role);
    if (target) {
      setCurrentUserId(target.id);
      setIsAuthenticated(true);
      setActiveTab('dashboard');
    }
  };

  const loginWithCredentials = (emailOrName: string, passwordInput: string): { success: boolean; message?: string } => {
    const rawInput = emailOrName.trim();
    const cleanEmailInput = rawInput.toLowerCase();
    const normInput = normalizeArabicText(rawInput);
    const cleanPassword = passwordInput.trim();

    if (!rawInput) {
      return {
        success: false,
        message: 'يرجى إدخال البريد الإلكتروني أو اسم المستخدم.'
      };
    }

    if (!cleanPassword) {
      return {
        success: false,
        message: 'يرجى إدخال كلمة المرور.'
      };
    }

    const isEmailFormat = cleanEmailInput.includes('@');

    // Find all matching candidate users
    const candidates = users.filter(u => {
      const userEmail = (u.email || '').trim().toLowerCase();
      const userId = (u.id || '').trim().toLowerCase();
      const userNameNorm = normalizeArabicText(u.name || '');

      // 1. Exact Email match
      if (userEmail === cleanEmailInput) return true;

      // 2. Exact ID match
      if (userId === cleanEmailInput) return true;

      // 3. Exact Normalized Name match
      if (userNameNorm === normInput) return true;

      // 4. Substring Name match (only if input is not an email)
      if (!isEmailFormat && normInput.length >= 2) {
        if (userNameNorm.includes(normInput) || normInput.includes(userNameNorm)) {
          return true;
        }
      }

      return false;
    });

    if (candidates.length === 0) {
      return {
        success: false,
        message: 'عفواً، البريد الإلكتروني أو اسم المستخدم غير مسجل في النظام.'
      };
    }

    // Match candidate with password, prioritizing most recently added/updated users
    const matchedUser = [...candidates].reverse().find(u => {
      const expectedPass = (u.password || (u.role === 'teacher_admin' ? 'DrIbrahim@2026' : 'student123')).trim();
      return expectedPass === cleanPassword;
    });

    if (!matchedUser) {
      return {
        success: false,
        message: 'كلمة المرور غير صحيحة، يرجى التأكد من كلمة المرور والمحاولة مجدداً.'
      };
    }

    setCurrentUserId(matchedUser.id);
    setIsAuthenticated(true);

    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_current_user`, matchedUser.id);
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_is_authenticated`, 'true');
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    setActiveTab(matchedUser.role === 'teacher_admin' ? 'teacher_dashboard' : 'dashboard');
    return {
      success: true
    };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_is_authenticated`);
    setActiveTab('home');
  };

  const registerNewUser = (
    name: string,
    email: string,
    role: UserRole,
    group: ExperimentalGroup,
    teamRole?: TeamMemberRole,
    password?: string
  ) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPassword = (password && password.trim().length > 0)
      ? password.trim()
      : (role === 'teacher_admin' ? 'DrIbrahim@2026' : 'student123');

    // Check if user already exists by email
    const existingIndex = users.findIndex(u => (u.email || '').trim().toLowerCase() === cleanEmail);

    let activeId = '';
    let updatedUsers: UserProfile[] = [];

    if (existingIndex !== -1) {
      // Update existing user with updated password and attributes
      const existing = users[existingIndex];
      activeId = existing.id;
      const updatedUser: UserProfile = {
        ...existing,
        name: cleanName || existing.name,
        password: cleanPassword,
        role: role || existing.role,
        experimentalGroup: group || existing.experimentalGroup,
        teamRole: role === 'student_collaborative' ? (teamRole || existing.teamRole || 'coder') : undefined
      };

      updatedUsers = [...users];
      updatedUsers[existingIndex] = updatedUser;
    } else {
      // Create fresh user account
      const newId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      activeId = newId;
      const avatarSeeds = ['Felix', 'Aneka', 'Mittens', 'Callie', 'Garfield', 'Tiger', 'Shadow', 'Oliver'];
      const randomSeed = avatarSeeds[Math.floor(Math.random() * avatarSeeds.length)] + '_' + Date.now();
      
      const newUser: UserProfile = {
        id: newId,
        name: cleanName,
        email: cleanEmail,
        password: cleanPassword,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(randomSeed)}`,
        role,
        experimentalGroup: group,
        teamId: role === 'student_collaborative' ? undefined : undefined,
        teamRole: role === 'student_collaborative' ? (teamRole || 'coder') : undefined,
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

      // Add to front so newly created user takes precedence in lookups
      updatedUsers = [newUser, ...users];
    }

    setUsers(updatedUsers);
    setCurrentUserId(activeId);
    setIsAuthenticated(true);

    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_users`, JSON.stringify(updatedUsers));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_current_user`, activeId);
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_is_authenticated`, 'true');
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    setActiveTab(role === 'teacher_admin' ? 'teacher_dashboard' : 'dashboard');
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
    setUsers(prev => prev.map(u => {
      if (u.id === studentId) {
        return {
          ...u,
          experimentalGroup: group,
          role: group === 'individual_group' ? 'student_individual' : 'student_collaborative',
          teamId: group === 'collaborative_group' ? (teamId || 'team_a') : undefined,
          teamRole: group === 'collaborative_group' ? (teamRole || 'coder') : undefined
        };
      }
      return u;
    }));
  };

  const createNewTeam = (teamName: string, description: string, memberIds: string[]) => {
    const teamId = `team_${Date.now()}`;
    const newTeam: TeamGroup = {
      id: teamId,
      name: teamName,
      description,
      memberIds,
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
