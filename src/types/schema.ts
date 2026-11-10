// types/schema.ts
// Comprehensive TypeScript schema matching the proposed Firestore Architecture for Educational Project-Based Learning

export type UserRole = 'student_individual' | 'student_collaborative' | 'teacher_admin';
export type TeamMemberRole = 'analyst' | 'designer' | 'coder' | 'tester';
export type ExperimentalGroup = 'individual_group' | 'collaborative_group';
export type SubmissionStatus = 'not_started' | 'in_progress' | 'submitted' | 'evaluated' | 'revision_requested';

export interface EngagementScoreData {
  behavioral: number;
  cognitive: number;
  emotional: number;
  social?: number;
  collaborative?: number;
  totalScore?: number;
  percentage?: number;
  level?: 'مرتفع جداً' | 'مرتفع' | 'متوسط' | 'منخفض';
  completedItemsCount?: number;
  itemResponses?: Record<string, number>;
  submittedAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  role: UserRole;
  experimentalGroup: ExperimentalGroup;
  teamId?: string; // For collaborative students
  teamRole?: TeamMemberRole; // Role in group: analyst, designer, coder, tester
  joinedAt: string;
  status: 'active' | 'inactive';
  progressPercentage: number;
  completedProjectsCount: number;
  completedActivitiesCount: number;
  preTestScore?: number;
  postTestScore?: number;
  engagementScore?: EngagementScoreData;
}

export interface TeamGroup {
  id: string;
  name: string; // e.g. "المجموعة (أ) - فريق الخوارزميات"
  description: string;
  memberIds: string[];
  maxMembers?: number;
  members: {
    userId: string;
    name: string;
    avatar: string;
    role: TeamMemberRole;
    assignedTaskCount: number;
    completedTaskCount: number;
  }[];
  currentProjectId: string;
  progressPercentage: number;
  completedTasksCount: number;
  totalTasksCount: number;
  createdAt: string;
}

export interface UnitVideoItem {
  id: string; // YouTube Video ID
  title: string;
  duration?: string;
  description?: string;
}

export interface LearningUnitLesson {
  title: string;
  subtitle?: string;
  content: string;
  keyPoints?: string[];
  codeSnippet?: string;
  ruleCard?: {
    title: string;
    items: string[];
  };
  videoId?: string; // YouTube Video ID specific to this lesson
  videoTitle?: string;
  videoDuration?: string;
}

export interface LearningUnit {
  id: string;
  order: number;
  title: string;
  description: string;
  iconName: string;
  estimatedMinutes: number;
  shortSummary: string;
  curriculumDivision?: string; // e.g. "الوحدة الأولى من المقرر"
  bookReference?: {
    unitName: string;
    pages: string;
    bookTitle: string;
  };
  textbookLessons?: LearningUnitLesson[];
  videoUrl: string;
  videoTitle: string;
  unitVideos?: UnitVideoItem[];
  codeExample: {
    language: string;
    code: string;
    explanation: string;
  };
  practiceActivity: {
    instruction: string;
    starterCode: string;
    solutionCode: string;
    hints: string[];
  };
  quiz: {
    id: string;
    question: string;
    options: string[];
    correctOptionIndex: number;
    explanation: string;
  }[];
  relatedProjectId: string;
}

export interface RubricCriterion {
  id: string;
  title: string;
  weight: number; // e.g. 15%
  description: string;
  levels: {
    score: number; // 1 to 4 or 0 to 10
    label: string; // ممتاز, جيد جداً, مقبول, يحتاج تحسين
    description: string;
  }[];
}

export interface ProjectDefinition {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  problemStatement: string;
  objectives: string[];
  targetSkills: string[];
  executionSteps: {
    stepNumber: number;
    title: string;
    description: string;
    recommendedRole?: TeamMemberRole; // For collaborative mode
  }[];
  learningResources: {
    title: string;
    type: 'video' | 'article' | 'doc' | 'code';
    url: string;
  }[];
  requirements: string[];
  starterCode: string;
  sampleSolution: string;
  language?: string;
  difficulty?: string;
  estimatedHours?: number;
  testCases: {
    id: string;
    name: string;
    input: string;
    expectedOutput: string;
    description: string;
  }[];
  rubricCriteria: RubricCriterion[];
}

export interface ProjectSubmission {
  id: string;
  projectId: string;
  studentId: string;
  studentName: string;
  teamId?: string;
  experimentalGroup: ExperimentalGroup;
  code: string;
  problemAnalysisText?: string;
  solutionDesignText?: string;
  testReportText?: string;
  status: SubmissionStatus;
  submittedAt?: string;
  evaluatedAt?: string;
  evaluatorId?: string;
  rubricScores?: Record<string, number>; // criterionId -> score
  totalScore?: number;
  maxScore?: number;
  teacherGeneralFeedback?: string;
  codeLineComments?: {
    lineNumber: number;
    comment: string;
    authorName: string;
    createdAt: string;
  }[];
}

export interface TeamDiscussionMessage {
  id: string;
  teamId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: TeamMemberRole;
  content: string;
  createdAt: string;
  attachments?: {
    name: string;
    type: string;
    url: string;
    size: string;
  }[];
}

export interface TeamTask {
  id: string;
  teamId: string;
  projectId: string;
  title: string;
  description: string;
  assignedToUserId: string;
  assignedToName: string;
  assignedRole: TeamMemberRole;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}

export interface EngagementMetric {
  userId: string;
  date: string;
  loginCount: number;
  timeSpentMinutes: number;
  codeRunCount: number;
  submissionsCount: number;
  discussionMessagesCount: number;
  activitiesCompletedCount: number;
  selfAssessmentResponses?: {
    surveyType: 'cognitive' | 'emotional' | 'behavioral';
    questionId: string;
    rating: number; // 1-5 Likert scale
  }[];
}

export interface AssessmentQuestion {
  id: string;
  type: 'pre_test' | 'post_test';
  unitId?: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  skillTested: string;
}
