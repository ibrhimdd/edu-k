// data/firestoreSchemaJson.ts
// Complete Firestore Database Schema (JSON Representation & Rules) matching the PDF specifications

export const FIRESTORE_COLLECTIONS_METADATA = [
  { name: 'users', path: '/users/{userId}', description: 'بيانات الطلاب والمعلمين والمجموعات التجريبية والأدوار ونسب الإنجاز' },
  { name: 'groups', path: '/groups/{groupId}', description: 'المجموعات التجريبية التشاركية، الأعضاء وتوزيع المهام ونسب التقدم' },
  { name: 'units', path: '/units/{unitId}', description: 'الوحدات التعليمية السبع المتسلسلة (شرح، فيديو، مثال، نشاط، اختبار قصير)' },
  { name: 'projects', path: '/projects/{projectId}', description: 'المشروعات البرمجية الإلكترونية الأربعة المتدرجة وقوالبها ومعايير Rubric' },
  { name: 'submissions', path: '/submissions/{submissionId}', description: 'تسليمات المشروعات وأكواد الطلاب ودرجات الـ Rubric وملاحظات المعلم' },
  { name: 'team_discussions', path: '/team_discussions/{messageId}', description: 'سجل غرف الحوار والمناقشات الحية ومشاركة الملفات للفريق' },
  { name: 'team_tasks', path: '/team_tasks/{taskId}', description: 'لوحة مهام الفريق التشاركي (To Do, In Progress, Done)' },
  { name: 'engagement_logs', path: '/engagement_logs/{logId}', description: 'سجلات تتبع أبعاد الانخراط في التعلم (سلوكي، معرفي، وجداني)' }
];

export const FIRESTORE_DATABASE_SCHEMA = {
  version: "1.0.0",
  databaseName: "educode_pbl_db",
  collections: {
    users: {
      description: "سجل المستخدمين (الطلاب والمعلمون مع تحديد المجموعة التجريبية والدور)",
      fields: {
        id: "string (UID من Firebase Auth)",
        name: "string (اسم الطالب أو المعلم الرباعي)",
        email: "string (البريد الإلكتروني)",
        role: "enum: 'student_individual' | 'student_collaborative' | 'teacher_admin'",
        experimentalGroup: "enum: 'individual_group' | 'collaborative_group'",
        teamId: "string | null (معرف الفريق للمجموعة التشاركية)",
        teamRole: "enum | null: 'analyst' | 'designer' | 'coder' | 'tester'",
        joinedAt: "timestamp (تاريخ الانضمام للبيئة)",
        status: "string ('active' | 'inactive')",
        progressPercentage: "number (0-100)",
        completedProjectsCount: "number (0-4)",
        completedActivitiesCount: "number (0-10)",
        preTestScore: "number (درجة الاختبار القبلي)",
        postTestScore: "number (درجة الاختبار البعدي)",
        engagementScore: {
          behavioral: "number (0-100)",
          cognitive: "number (0-100)",
          emotional: "number (0-100)"
        }
      }
    },
    groups: {
      description: "المجموعات التجريبية التشاركية (الفرق والأعضاء وتوزيع المهام)",
      fields: {
        id: "string (معرف الفريق)",
        name: "string (اسم المجموعة مثلاً: المجموعة أ)",
        description: "string (وصف الفريق)",
        memberIds: "array<string> (معرفات الأعضاء)",
        members: "array<object> ({ userId, name, role, assignedTasks, completedTasks })",
        currentProjectId: "string (معرف المشروع الحالي)",
        progressPercentage: "number (نسبة تقدم المجموعة %)",
        completedTasksCount: "number (المهام المكتملة)",
        totalTasksCount: "number (إجمالي المهام)",
        createdAt: "timestamp"
      }
    },
    units: {
      description: "الوحدات التعليمية السبع المتسلسلة لمقرر البرمجة",
      fields: {
        id: "string (unit_1 to unit_7)",
        order: "number (1-7)",
        title: "string (اسم الوحدة مثلاً: المتغيرات وأنواع البيانات)",
        description: "string (شرح مفصل للوحدة)",
        shortSummary: "string (شرح مختصر)",
        videoUrl: "string (رابط العرض التوضيحي/الفيديو)",
        videoTitle: "string (عنوان العرض)",
        codeExample: "object ({ language, code, explanation })",
        practiceActivity: "object ({ instruction, starterCode, solutionCode, hints })",
        quiz: "array<object> ({ id, question, options, correctOptionIndex, explanation })",
        relatedProjectId: "string (المشروع المرتبط بالوحدة)"
      }
    },
    projects: {
      description: "المشروعات البرمجية الإلكترونية المتدرجة (قلب البيئة)",
      fields: {
        id: "string (project_1 to project_4)",
        order: "number (1-4)",
        title: "string (اسم المشروع مثلاً: برنامج حساب درجات الطلاب)",
        subtitle: "string (المهارات المستهدفة)",
        problemStatement: "string (المشكلة المطلوب حلها)",
        objectives: "array<string> (أهداف المشروع)",
        targetSkills: "array<string> (المهارات البرمجية المستهدفة)",
        executionSteps: "array<object> ({ stepNumber, title, description, recommendedRole })",
        learningResources: "array<object> ({ title, type, url })",
        requirements: "array<string> (متطلبات المشروع)",
        starterCode: "string (القالب البرمجي الأولي)",
        sampleSolution: "string (الحل النموذجي المرجعي)",
        testCases: "array<object> ({ id, name, input, expectedOutput, description })",
        rubricCriteria: "array<object> ({ id, title, weight, description, levels })"
      }
    },
    submissions: {
      description: "تسليمات المشروعات البرمجية من الطلاب أو الفرق",
      fields: {
        id: "string (معرف التسليم)",
        projectId: "string (معرف المشروع)",
        studentId: "string (معرف الطالب أو قائد الفريق)",
        studentName: "string (اسم الطالب)",
        teamId: "string | null (معرف الفريق للنمط التشاركي)",
        experimentalGroup: "enum: 'individual_group' | 'collaborative_group'",
        code: "string (الكود المكتوب في Monaco Editor)",
        problemAnalysisText: "string (نص تحليل المشكلة)",
        solutionDesignText: "string (نص تصميم الحل والخوارزمية)",
        testReportText: "string (تقرير اختبار البرنامج)",
        status: "enum: 'not_started' | 'in_progress' | 'submitted' | 'evaluated' | 'revision_requested'",
        submittedAt: "timestamp",
        evaluatedAt: "timestamp | null",
        evaluatorId: "string | null",
        rubricScores: "map<criterionId, number> (درجات معايير التقييم)",
        totalScore: "number (الدرجة الإجمالية من 100)",
        maxScore: "number (100)",
        teacherGeneralFeedback: "string (التغذية الراجعة العامة من المعلم)",
        codeLineComments: "array<object> ({ lineNumber, comment, authorName, createdAt })"
      }
    },
    team_discussions: {
      description: "سجل محادثات ونقاشات المجموعة التشاركية ومشاركة الملفات",
      fields: {
        id: "string",
        teamId: "string",
        senderId: "string",
        senderName: "string",
        senderAvatar: "string",
        senderRole: "enum: 'analyst' | 'designer' | 'coder' | 'tester'",
        content: "string",
        createdAt: "timestamp",
        attachments: "array<object> ({ name, type, url, size })"
      }
    },
    team_tasks: {
      description: "لوحة مهام الفريق التشاركي لمتابعة إنجاز كل عضو",
      fields: {
        id: "string",
        teamId: "string",
        projectId: "string",
        title: "string",
        description: "string",
        assignedToUserId: "string",
        assignedToName: "string",
        assignedRole: "enum: 'analyst' | 'designer' | 'coder' | 'tester'",
        status: "enum: 'todo' | 'in_progress' | 'review' | 'done'",
        priority: "enum: 'low' | 'medium' | 'high'",
        dueDate: "string"
      }
    },
    engagement_logs: {
      description: "بيانات تتبع الانخراط السلوكي والمعرفي والوجداني",
      fields: {
        userId: "string",
        date: "string (YYYY-MM-DD)",
        loginCount: "number",
        timeSpentMinutes: "number",
        codeRunCount: "number",
        submissionsCount: "number",
        discussionMessagesCount: "number",
        activitiesCompletedCount: "number",
        selfAssessmentResponses: "array<object> ({ surveyType, questionId, rating })"
      }
    }
  }
};

export const FIRESTORE_SECURITY_RULES = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // دوال مساعدة للتحقق من الصلاحيات
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isTeacher() {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'teacher_admin';
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isTeamMember(teamId) {
      return isAuthenticated() && 
        request.auth.uid in get(/databases/$(database)/documents/groups/$(teamId)).data.memberIds;
    }

    // جدول المستخدمين
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId) || isTeacher();
    }

    // المجموعات التشاركية
    match /groups/{groupId} {
      allow read: if isAuthenticated();
      allow create, update: if isTeacher() || (isAuthenticated() && isTeamMember(groupId));
      allow delete: if isTeacher();
    }

    // الوحدات التعليمية والمشروعات (للقراءة العامة للطلاب والكتابة للمعلم فقط)
    match /units/{unitId} {
      allow read: if isAuthenticated();
      allow write: if isTeacher();
    }
    
    match /projects/{projectId} {
      allow read: if isAuthenticated();
      allow write: if isTeacher();
    }

    // تسليمات المشروعات
    match /submissions/{submissionId} {
      allow read: if isAuthenticated() && (
        resource.data.studentId == request.auth.uid || 
        (resource.data.teamId != null && isTeamMember(resource.data.teamId)) ||
        isTeacher()
      );
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && (
        resource.data.studentId == request.auth.uid || 
        (resource.data.teamId != null && isTeamMember(resource.data.teamId)) ||
        isTeacher()
      );
      allow delete: if isTeacher();
    }

    // نقاشات المجموعات
    match /team_discussions/{messageId} {
      allow read, create: if isAuthenticated() && (
        isTeamMember(request.resource.data.teamId) || isTeacher()
      );
      allow update, delete: if isTeacher() || isOwner(resource.data.senderId);
    }

    // مهام المجموعات
    match /team_tasks/{taskId} {
      allow read, write: if isAuthenticated() && (
        isTeamMember(resource.data.teamId) || isTeacher()
      );
    }

    // سجلات الانخراط
    match /engagement_logs/{logId} {
      allow read: if isAuthenticated() && (resource.data.userId == request.auth.uid || isTeacher());
      allow create, update: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
    }
  }
}`;

export const DIRECTORY_STRUCTURE_DOC = `
# هيكل شجرة المجلدات المقترح لتطبيق المنصة (Project Directory Structure)

educode-pbl-platform/
├── public/
│   └── assets/                     # الأيقونات والصور التعليمية
├── src/
│   ├── components/
│   │   ├── common/                 # المكونات العامة المشتركة
│   │   │   ├── MonacoCodeEditor.tsx  # محرر Monaco Editor مع مشغل الكود والـ Console
│   │   │   ├── RubricViewer.tsx      # بطاقة تقييم المنتج البرمجي (Rubric)
│   │   │   ├── ProgressBar.tsx       # مؤشرات الإنجاز والنسب المئوية
│   │   │   └── Modal.tsx             # النوافذ المنبثقة التفاعلية
│   │   ├── student/                # مكونات واجهة الطالب
│   │   │   ├── StudentDashboard.tsx  # لوحة تحكم الطالب (فردي / تشاركي)
│   │   │   ├── LearningUnitsView.tsx # الوحدات التعليمية السبع والأنشطة
│   │   │   ├── IndividualProjectWorkspace.tsx # مساحة تنفيذ المشروع الفردي (خطوات 1-7)
│   │   │   ├── CollaborativeProjectWorkspace.tsx # مساحة مشروع المجموعة مع الدردشة والمهام
│   │   │   ├── TeamChatPanel.tsx     # منتدى النقاش ومشاركة الملفات للفريق
│   │   │   ├── TeamTaskBoard.tsx     # لوحة توزيع المهام ومتابعة إنجاز الأعضاء
│   │   │   └── AssessmentsView.tsx   # الاختبار القبلي والبعدي ومقياس الانخراط
│   │   ├── teacher/                # مكونات واجهة المعلم الشاملة
│   │   │   ├── TeacherDashboard.tsx  # لوحة تحكم المعلم المركزية
│   │   │   ├── StudentManagement.tsx # تقسيم الطلاب وتوزيع المجموعات والأدوار
│   │   │   ├── SubmissionsGrading.tsx# تقييم المشاريع وفق Rubric والتعليق على الكود
│   │   │   ├── RealtimeMonitoring.tsx# متابعة نسب الإنجاز والمتعثرين
│   │   │   ├── ContentManagement.tsx # إدارة وتعديل الوحدات والمشروعات
│   │   │   └── EngagementAnalytics.tsx # تحليلات الانخراط (سلوكي، معرفي، وجداني)
│   │   └── docs/
│   │       └── ArchitectureViewerModal.tsx # استعراض مواصفات الـ Firestore والـ Architecture
│   ├── context/
│   │   └── AppContext.tsx          # سياق التطبيق وإدارة الحالة ومحاكاة Firestore الحية
│   ├── data/
│   │   ├── mockData.ts             # البيانات الأولية الشاملة (7 وحدات، 4 مشروعات، الطلاب، الفرق)
│   │   └── firestoreSchemaJson.ts  # مواصفات الـ Schema وقواعد الأمان Firestore
│   ├── types/
│   │   └── schema.ts               # تعريفات TypeScript الكاملة للمنصة
│   ├── App.tsx                     # نقطة الربط والتوجيه الأساسية
│   ├── main.tsx                    # نقطة الانطلاق لتطبيق React
│   └── index.css                   # تنسيقات Tailwind CSS وخط Cairo
├── firestore.rules                 # قواعد أمان Firestore
├── package.json
├── tsconfig.json
└── vite.config.ts
`;
