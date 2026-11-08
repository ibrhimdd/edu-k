// data/engagementScaleData.ts
// مقياس الانخراط في تعلم البرمجة
// إعداد الباحثة: خلود رشدي عبد اللطيف حمادة
// المشرف العام: أ. د. محمد رضون أبو حشيش
// المطور البرمجي: إبراهيم الخولي (جميع الحقوق محفوظة)

export interface EngagementQuestionItem {
  id: string;
  number: number; // 1 to 56
  dimensionId: 'cognitive' | 'behavioral' | 'emotional' | 'social';
  dimensionTitle: string;
  dimensionOrder: number;
  text: string;
  keywords?: string;
}

export interface EngagementDimensionMeta {
  id: 'cognitive' | 'behavioral' | 'emotional' | 'social';
  order: number;
  title: string;
  subtitle: string;
  description: string;
  startNumber: number;
  endNumber: number;
  itemCount: number;
  color: string;
  bgLight: string;
  borderColor: string;
  badgeBg: string;
}

export const ENGAGEMENT_SCALE_METADATA = {
  title: 'مقياس الانخراط في تعلم البرمجة',
  subtitle: 'أداة بحثية لقياس أبعاد الانخراط الأربعة لدى طلاب البرمجة بلغة بايثون في بيئة التعلم القائمة على المشروعات',
  researcher: 'الباحثة: خلود رشدي عبد اللطيف حمادة',
  supervisor: 'المشرف الأول: أ. د. سمير حقوف',
  coSupervisor: 'المشرف الثاني: أ. د. محمد رضون أبو حشيش',
  developer: 'جميع الحقوق محفوظة للمطور إبراهيم الخولي © 2026',
  purpose: 'يهدف هذا المقياس إلى التعرف على مدى انخراطك واندماجك أثناء دراسة لغة البايثون وتنفيذ مشروعك الإلكتروني عبر البيئة التعليمية وذلك لأغراض البحث العلمي فقط.',
  targetAudience: 'عزيزي الطالب / عزيزتي الطالبة',
  instructions: [
    'يرجى قراءة التعليمات التالية بدقة والتقيد بها.',
    'يهدف هذا المقياس إلى التعرف على مدى انخراطك واندماجك أثناء دراسة لغة البايثون وتنفيذ مشروعك الإلكتروني عبر البيئة التعليمية وذلك لأغراض البحث العلمي فقط.',
    'يتكون المقياس من أربع أبعاد رئيسية بواقع 56 عبارة مصاغة بدقة.',
    'يتم الإجابة عنها بدقة وموضوعية وفق تدرج ليكرت الخماسي: (موافق بشدة، موافق، محايد، معارض، معارض بشدة).',
    'لا توجد إجابة صحيحة وأخرى خاطئة، الإجابة الدقيقة تعبر عن تجربتك الحقيقية في دراسة لغة بايثون وإنجاز المشروعات.'
  ],
  totalItems: 56,
  maxRawScore: 280, // 56 * 5
  minRawScore: 56   // 56 * 1
};

export const LIKERT_OPTIONS = [
  { value: 5, label: 'موافق بشدة', shortLabel: 'موافق بشدة', color: 'bg-[#006D77] text-white hover:bg-[#E29578]' },
  { value: 4, label: 'موافق', shortLabel: 'موافق', color: 'bg-[#83C5BE] text-[#004D54] hover:bg-[#006D77] hover:text-white' },
  { value: 3, label: 'محايد', shortLabel: 'محايد', color: 'bg-[#EDF6F9] text-[#1F2937] border border-[#83C5BE] hover:bg-[#83C5BE]' },
  { value: 2, label: 'معارض', shortLabel: 'معارض', color: 'bg-[#E29578] text-[#91472F] hover:bg-[#E29578]' },
  { value: 1, label: 'معارض بشدة', shortLabel: 'معارض بشدة', color: 'bg-[#E29578] text-[#1F2937] hover:bg-[#91472F] hover:text-white' }
];

export const ENGAGEMENT_DIMENSIONS: EngagementDimensionMeta[] = [
  {
    id: 'cognitive',
    order: 1,
    title: 'البعد الأول: الانخراط المعرفي',
    subtitle: 'Cognitive Engagement',
    description: 'بذل الجهد الذهني والعمق المفاهيمي، التفكير المنطقي، التجريد، تتبع تدفق البيانات وتصحيح الأخطاء المنطقية الخفية في بايثون.',
    startNumber: 1,
    endNumber: 14,
    itemCount: 14,
    color: '#006D77',
    bgLight: '#EDF6F9',
    borderColor: '#83C5BE',
    badgeBg: '#006D77'
  },
  {
    id: 'behavioral',
    order: 2,
    title: 'البعد الثاني: الانخراط السلوكي',
    subtitle: 'Behavioral Engagement',
    description: 'المواظبة والاستمرارية، تسليم المهام في مواعيدها، تتبع التوجيهات، توثيق الكود (#)، فحص واختبار البرنامج (Debugging)، وتنسيق واجهات GUI.',
    startNumber: 15,
    endNumber: 28,
    itemCount: 14,
    color: '#004D54',
    bgLight: '#EDF6F9',
    borderColor: '#83C5BE',
    badgeBg: '#83C5BE'
  },
  {
    id: 'emotional',
    order: 3,
    title: 'البعد الثالث: الانخراط العاطفي والوجداني',
    subtitle: 'Emotional / Affective Engagement',
    description: 'مشاعر الحماس والمتعة والشغف أثناء البرمجة بالبايثون، الرضا الأكاديمي، الفضول المعرفي، والتعامل مع الأخطاء كتحديات محفزة.',
    startNumber: 29,
    endNumber: 42,
    itemCount: 14,
    color: '#91472F',
    bgLight: '#EDF6F9',
    borderColor: '#83C5BE',
    badgeBg: '#E29578'
  },
  {
    id: 'social',
    order: 4,
    title: 'البعد الرابع: الانخراط الاجتماعي والتشاركي',
    subtitle: 'Social / Collaborative Engagement',
    description: 'التفاعل مع الزملاء، تبادل ونقد الأكواد البرمجية، عقد جلسات العصف الذهني، دمج وتكامل أجزاء المشروع، والاستفادة من التغذية الراجعة التشاركية.',
    startNumber: 43,
    endNumber: 56,
    itemCount: 14,
    color: '#006D77',
    bgLight: '#EDF6F9',
    borderColor: '#83C5BE',
    badgeBg: '#E29578'
  }
];

export const ENGAGEMENT_ITEMS: EngagementQuestionItem[] = [
  // ==========================================
  // البعد الأول: الانخراط المعرفي (1 - 14)
  // ==========================================
  {
    id: 'eng_1',
    number: 1,
    dimensionId: 'cognitive',
    dimensionTitle: 'البعد الأول: الانخراط المعرفي',
    dimensionOrder: 1,
    text: 'أبذل جهداً عقلياً مكثفاً لفهم طريقة عمل الدوال والمكتبات البرمجية المختلفة في لغة البايثون.',
    keywords: 'الدوال والمكتبات، الجهد العقلي'
  },
  {
    id: 'eng_2',
    number: 2,
    dimensionId: 'cognitive',
    dimensionTitle: 'البعد الأول: الانخراط المعرفي',
    dimensionOrder: 1,
    text: 'عندما يظهر لي خطأ في كود البايثون أثناء تنفيذ المشروع، أبحث بجدية عن سبب المشكلة وكيفية حلها.',
    keywords: 'تصحيح الأخطاء، الجدية في الحل'
  },
  {
    id: 'eng_3',
    number: 3,
    dimensionId: 'cognitive',
    dimensionTitle: 'البعد الأول: الانخراط المعرفي',
    dimensionOrder: 1,
    text: 'أحاول الربط بين المفاهيم البرمجية للبايثون وبين كيفية توظيفها عملياً في مشروعي الإلكتروني.',
    keywords: 'الربط المفاهيمي، التوظيف العملي'
  },
  {
    id: 'eng_4',
    number: 4,
    dimensionId: 'cognitive',
    dimensionTitle: 'البعد الأول: الانخراط المعرفي',
    dimensionOrder: 1,
    text: 'أحرص على تجربة وإعادة كتابة الأكواد (Refactoring) لأجعل كود البايثون الخاص بمشروعي أكثر كفاءة واختصاراً.',
    keywords: 'إعادة الهيكلة Refactoring، كفاءة الكود'
  },
  {
    id: 'eng_5',
    number: 5,
    dimensionId: 'cognitive',
    dimensionTitle: 'البعد الأول: الانخراط المعرفي',
    dimensionOrder: 1,
    text: 'أستخدم مهارات التفكير المنطقي لتتبع تسلسل تنفيذ الأوامر البرمجية (مثل الجمل الشرطية وحلقات التكرار).',
    keywords: 'التفكير المنطقي، الجمل الشرطية والتكرار'
  },
  {
    id: 'eng_6',
    number: 6,
    dimensionId: 'cognitive',
    dimensionTitle: 'البعد الأول: الانخراط المعرفي',
    dimensionOrder: 1,
    text: 'أهتم بفهم الأخطاء المنطقية الخفية في لغة بايثون التي تجعل البرنامج يعمل ولكن يعطي مخرجات غير صحيحة.',
    keywords: 'الأخطاء المنطقية الخفية Logic Errors'
  },
  {
    id: 'eng_7',
    number: 7,
    dimensionId: 'cognitive',
    dimensionTitle: 'البعد الأول: الانخراط المعرفي',
    dimensionOrder: 1,
    text: 'أحرص على دراسة وتعديل الأكواد الجاهزة المتاحة في مصادر البيئة لفهم آلية عملها بدلاً من مجرد نسخها ولصقها.',
    keywords: 'فهم الأكواد الجاهزة، تجنب النسخ العشوائي'
  },
  {
    id: 'eng_8',
    number: 8,
    dimensionId: 'cognitive',
    dimensionTitle: 'البعد الأول: الانخراط المعرفي',
    dimensionOrder: 1,
    text: 'أحرص على تتبع مسار تدفق البيانات (Data Flow) بين الدوال البرمجية المختلفة في البايثون لضمان عدم حدوث تضارب.',
    keywords: 'تدفق البيانات Data Flow'
  },
  {
    id: 'eng_9',
    number: 9,
    dimensionId: 'cognitive',
    dimensionTitle: 'البعد الأول: الانخراط المعرفي',
    dimensionOrder: 1,
    text: 'أقوم بإنشاء مخططات ذهنية أو رسوم تدفقية (Flowcharts) لمنطق المشروع قبل البدء الفعلي في كتابة الكود.',
    keywords: 'مخططات سير العمليات Flowcharts'
  },
  {
    id: 'eng_10',
    number: 10,
    dimensionId: 'cognitive',
    dimensionTitle: 'البعد الأول: الانخراط المعرفي',
    dimensionOrder: 1,
    text: 'أقارن باستمرار بين الكود الذي قمت بكتابته وبين المعايير القياسية العالمية لكتابة كود بايثون نظيف (مثل PEP 8).',
    keywords: 'معايير PEP 8، كود بايثون النظيف'
  },
  {
    id: 'eng_11',
    number: 11,
    dimensionId: 'cognitive',
    dimensionTitle: 'البعد الأول: الانخراط المعرفي',
    dimensionOrder: 1,
    text: 'أهتم بمعرفة واكتشاف أسباب توقف البرنامج المفاجئ (Runtime Errors) أثناء اختبار المشروع والعمل على معالجتها برمجياً.',
    keywords: 'أخطاء التشغيل Runtime Errors'
  },
  {
    id: 'eng_12',
    number: 12,
    dimensionId: 'cognitive',
    dimensionTitle: 'البعد الأول: الانخراط المعرفي',
    dimensionOrder: 1,
    text: 'أفكر في السيناريوهات المختلفة التي قد يتصرف بها مستخدم مشروعي البرمجي، وأصمم واجهات (Tkinter) لتلبي احتياجاته.',
    keywords: 'واجهات Tkinter، تجربة المستخدم'
  },
  {
    id: 'eng_13',
    number: 13,
    dimensionId: 'cognitive',
    dimensionTitle: 'البعد الأول: الانخراط المعرفي',
    dimensionOrder: 1,
    text: 'أبحث عن حلول برمجية متنوعة لتبسيط العمليات المعقدة داخل أكواد المشروع.',
    keywords: 'تبسيط العمليات، حلول برمجية مبتكرة'
  },
  {
    id: 'eng_14',
    number: 14,
    dimensionId: 'cognitive',
    dimensionTitle: 'البعد الأول: الانخراط المعرفي',
    dimensionOrder: 1,
    text: 'أحرص على تحليل المنطق البرمجي المتبع في بناء المشروع لضمان عمل كافة أجزائه بكفاءة.',
    keywords: 'تحليل المنطق البرمجي، كفاءة الأجزاء'
  },

  // ==========================================
  // البعد الثاني: الانخراط السلوكي (15 - 28)
  // ==========================================
  {
    id: 'eng_15',
    number: 15,
    dimensionId: 'behavioral',
    dimensionTitle: 'البعد الثاني: الانخراط السلوكي',
    dimensionOrder: 2,
    text: 'ألتزم بإنهاء وتسليم المهام البرمجية الخاصة بمشروع البايثون في المواعيد المحددة عبر البيئة.',
    keywords: 'الالتزام بمواعيد التسليم'
  },
  {
    id: 'eng_16',
    number: 16,
    dimensionId: 'behavioral',
    dimensionTitle: 'البعد الثاني: الانخراط السلوكي',
    dimensionOrder: 2,
    text: 'أستثمر وقتاً كافياً داخل بيئة التعلم الإلكترونية لتجربة وتطوير أكواد البايثون الخاصة بمشروعي.',
    keywords: 'استثمار الوقت في التعلم'
  },
  {
    id: 'eng_17',
    number: 17,
    dimensionId: 'behavioral',
    dimensionTitle: 'البعد الثاني: الانخراط السلوكي',
    dimensionOrder: 2,
    text: 'أتابع بانتظام التوجيهات والخطوات البرمجية المتاحة عبر البيئة التعليمية.',
    keywords: 'متابعة التوجيهات والخطوات'
  },
  {
    id: 'eng_18',
    number: 18,
    dimensionId: 'behavioral',
    dimensionTitle: 'البعد الثاني: الانخراط السلوكي',
    dimensionOrder: 2,
    text: 'أقوم بتوثيق كودي البرمجي أولاً بأول باستخدام التعليقات والوسوم (# Comments) لسهولة مراجعته لاحقاً.',
    keywords: 'توثيق الكود بالتعليقات #'
  },
  {
    id: 'eng_19',
    number: 19,
    dimensionId: 'behavioral',
    dimensionTitle: 'البعد الثاني: الانخراط السلوكي',
    dimensionOrder: 2,
    text: 'أحرص على تجربة الكود البرمجي واختباره (Debugging) بشكل مستمر بعد كتابة كل دالة جديدة لضمان عدم تراكم الأخطاء.',
    keywords: 'تنقيح الأخطاء المستمر Debugging'
  },
  {
    id: 'eng_20',
    number: 20,
    dimensionId: 'behavioral',
    dimensionTitle: 'البعد الثاني: الانخراط السلوكي',
    dimensionOrder: 2,
    text: 'أخصص وقتاً كافياً لتنظيم وتنسيق المظهر الجمالي لواجهات المشروع الإلكتروني (GUI) ولا أكتفي فقط بالجانب البرمجي البحت.',
    keywords: 'تنسيق واجهات GUI الجمالية'
  },
  {
    id: 'eng_21',
    number: 21,
    dimensionId: 'behavioral',
    dimensionTitle: 'البعد الثاني: الانخراط السلوكي',
    dimensionOrder: 2,
    text: 'أقوم بإنشاء نسخ احتياطية بانتظام من ملفات مشروع البايثون لحمايتها من الفقدان أو التلف أثناء العمل بالبيئة.',
    keywords: 'النسخ الاحتياطي وحفظ الملفات'
  },
  {
    id: 'eng_22',
    number: 22,
    dimensionId: 'behavioral',
    dimensionTitle: 'البعد الثاني: الانخراط السلوكي',
    dimensionOrder: 2,
    text: 'أحرص على قراءة وفهم رسائل التحذير (Warnings) التي تظهر في بيئة التطوير الإلكترونية، ولا أتجاوزها إلا بعد التأكد من سلامتها.',
    keywords: 'فحص رسائل التحذير Warnings'
  },
  {
    id: 'eng_23',
    number: 23,
    dimensionId: 'behavioral',
    dimensionTitle: 'البعد الثاني: الانخراط السلوكي',
    dimensionOrder: 2,
    text: 'أقوم بجدولة وتوزيع أوقات العمل على مراحل المشروع (التحليل، التصميم، البرمجة، الاختبار) وفق الخطة الزمنية المقترحة.',
    keywords: 'جدولة مراحل دورة حياة المشروع'
  },
  {
    id: 'eng_24',
    number: 24,
    dimensionId: 'behavioral',
    dimensionTitle: 'البعد الثاني: الانخراط السلوكي',
    dimensionOrder: 2,
    text: 'أعيد اختبار كود البايثون بالكامل بعد إضافة أي ميزة أو زر جديد لواجهة المستخدم للتأكد من عدم تأثر الأجزاء السابقة.',
    keywords: 'اختبار الانحدار والتأكد من السلامة'
  },
  {
    id: 'eng_25',
    number: 25,
    dimensionId: 'behavioral',
    dimensionTitle: 'البعد الثاني: الانخراط السلوكي',
    dimensionOrder: 2,
    text: 'أحرص على رفع وتحديث ملفات المشروع وأكواد البايثون (مثل ملفات .py) بانتظام على منصة العمل المحددة بالبيئة.',
    keywords: 'رفع وتحديث الملفات البرمجية .py'
  },
  {
    id: 'eng_26',
    number: 26,
    dimensionId: 'behavioral',
    dimensionTitle: 'البعد الثاني: الانخراط السلوكي',
    dimensionOrder: 2,
    text: 'أستعين بقائمة المراجعة (Checklist) المتاحة بالبيئة للتأكد من استيفاء مشروعي البرمجي لجميع المعايير المطلوبة.',
    keywords: 'قائمة المعايير Checklist'
  },
  {
    id: 'eng_27',
    number: 27,
    dimensionId: 'behavioral',
    dimensionTitle: 'البعد الثاني: الانخراط السلوكي',
    dimensionOrder: 2,
    text: 'أبادر بطرح أسئلة برمجية محددة ودقيقة داخل قنوات البيئة عندما تواجهني نقطة غامضة في لغة البايثون.',
    keywords: 'طرح الأسئلة والمبادرة'
  },
  {
    id: 'eng_28',
    number: 28,
    dimensionId: 'behavioral',
    dimensionTitle: 'البعد الثاني: الانخراط السلوكي',
    dimensionOrder: 2,
    text: 'أشارك بفاعلية في تقييم المشروعات البرمجية الأخرى المعروضة بالبيئة للاستفادة من أساليبهم في التكويد والتصميم.',
    keywords: 'تقييم مشروعات الأقران والاستفادة'
  },

  // ==========================================
  // البعد الثالث: الانخراط العاطفي والوجداني (29 - 42)
  // ==========================================
  {
    id: 'eng_29',
    number: 29,
    dimensionId: 'emotional',
    dimensionTitle: 'البعد الثالث: الانخراط العاطفي والوجداني',
    dimensionOrder: 3,
    text: 'أشعر بحماس كبير أثناء تصميم وتنفيذ مشروعي الإلكتروني باستخدام لغة البايثون.',
    keywords: 'الحماس للتنفيذ والتصميم'
  },
  {
    id: 'eng_30',
    number: 30,
    dimensionId: 'emotional',
    dimensionTitle: 'البعد الثالث: الانخراط العاطفي والوجداني',
    dimensionOrder: 3,
    text: 'أشعر بالفخر والرضا الأكاديمي عندما أنجح في كتابة كود بايثون يعمل بشكل صحيح وبدون أخطاء.',
    keywords: 'الفخر والرضا الأكاديمي'
  },
  {
    id: 'eng_31',
    number: 31,
    dimensionId: 'emotional',
    dimensionTitle: 'البعد الثالث: الانخراط العاطفي والوجداني',
    dimensionOrder: 3,
    text: 'لا أشعر بالملل أو الإحباط حتى وإن قضيت وقتاً طويلاً في تعديل وتطوير مشروعي البرمجي داخل البيئة.',
    keywords: 'الصبر ومقاومة الإحباط'
  },
  {
    id: 'eng_32',
    number: 32,
    dimensionId: 'emotional',
    dimensionTitle: 'البعد الثالث: الانخراط العاطفي والوجداني',
    dimensionOrder: 3,
    text: 'أجد متعة حقيقية في رؤية واجهة البرنامج أو المشروع الإلكتروني وهي تعمل بنجاح بعد كتابة الأكواد.',
    keywords: 'متعة رؤية البرنامج يعمل'
  },
  {
    id: 'eng_33',
    number: 33,
    dimensionId: 'emotional',
    dimensionTitle: 'البعد الثالث: الانخراط العاطفي والوجداني',
    dimensionOrder: 3,
    text: 'أتعامل مع ظهور رسائل الخطأ البرمجية في بيئة البايثون كنوع من التحدي المثير وليس كمصدر للإحباط أو العجز.',
    keywords: 'النظر للأخطاء كتحدٍ مثير'
  },
  {
    id: 'eng_34',
    number: 34,
    dimensionId: 'emotional',
    dimensionTitle: 'البعد الثالث: الانخراط العاطفي والوجداني',
    dimensionOrder: 3,
    text: 'يتملكني الفضول المعرفي لاستكشاف مكتبات وأدوات جديدة في بايثون لم تتضمنها متطلبات المشروع الأساسية.',
    keywords: 'الفضول المعرفي والمبادرة'
  },
  {
    id: 'eng_35',
    number: 35,
    dimensionId: 'emotional',
    dimensionTitle: 'البعد الثالث: الانخراط العاطفي والوجداني',
    dimensionOrder: 3,
    text: 'أشعر بالارتياح والاطمئنان أثناء استخدام أدوات بيئة التعلم والتنقل بين مكوناتها.',
    keywords: 'الارتياح والاطمئنان في البيئة'
  },
  {
    id: 'eng_36',
    number: 36,
    dimensionId: 'emotional',
    dimensionTitle: 'البعد الثالث: الانخراط العاطفي والوجداني',
    dimensionOrder: 3,
    text: 'يتملكني شعور بالإنجاز عندما أتمكن من تخصيص وتعديل سمات الألوان والخطوط داخل واجهة مشروعي (GUI) لتظهر بشكل احترافي.',
    keywords: 'الشعور بالإنجاز في تصميم الواجهات'
  },
  {
    id: 'eng_37',
    number: 37,
    dimensionId: 'emotional',
    dimensionTitle: 'البعد الثالث: الانخراط العاطفي والوجداني',
    dimensionOrder: 3,
    text: 'أشعر بالرضا والشغف عندما أتمكن من قراءة وفهم أكواد البايثون المعقدة.',
    keywords: 'الشغف بقراءة الأكواد المعقدة'
  },
  {
    id: 'eng_38',
    number: 38,
    dimensionId: 'emotional',
    dimensionTitle: 'البعد الثالث: الانخراط العاطفي والوجداني',
    dimensionOrder: 3,
    text: 'أحرص على تقديم الدعم والمساعدة لزملائي بالبيئة في حل المشكلات البرمجية التي تواجههم.',
    keywords: 'مساعدة ودعم الزملاء'
  },
  {
    id: 'eng_39',
    number: 39,
    dimensionId: 'emotional',
    dimensionTitle: 'البعد الثالث: الانخراط العاطفي والوجداني',
    dimensionOrder: 3,
    text: 'أشعر بشغف كبير يدفعني لتطوير مشروعي الإلكتروني بالبايثون ليتجاوز مجرد كونه متطلباً دراسياً إلزامياً.',
    keywords: 'الشغف المتجاوز للإلزام'
  },
  {
    id: 'eng_40',
    number: 40,
    dimensionId: 'emotional',
    dimensionTitle: 'البعد الثالث: الانخراط العاطفي والوجداني',
    dimensionOrder: 3,
    text: 'يتملكني شعور بالسعادة والارتياح كلما تمكنت من بناء تطبيق برمجي متكامل باستخدام البايثون.',
    keywords: 'السعادة بإنجاز تطبيق متكامل'
  },
  {
    id: 'eng_41',
    number: 41,
    dimensionId: 'emotional',
    dimensionTitle: 'البعد الثالث: الانخراط العاطفي والوجداني',
    dimensionOrder: 3,
    text: 'أتطلع دائماً لمعرفة تقييم زملائي ومشرفي للمشروع البرمجي الذي بذلت فيه جهداً داخل البيئة.',
    keywords: 'التطلع للتقييم والتغذية الراجعة'
  },
  {
    id: 'eng_42',
    number: 42,
    dimensionId: 'emotional',
    dimensionTitle: 'البعد الثالث: الانخراط العاطفي والوجداني',
    dimensionOrder: 3,
    text: 'أبقى مستمتعاً ومستغرقاً بالعمل البرمجي داخل البيئة حتى وإن تطلب المشروع جهداً إضافياً خارج ساعات الدراسة الرسمية.',
    keywords: 'الاستغراق والتدفق في العمل'
  },

  // ==========================================
  // البعد الرابع: الانخراط الاجتماعي والتشاركي (43 - 56)
  // ==========================================
  {
    id: 'eng_43',
    number: 43,
    dimensionId: 'social',
    dimensionTitle: 'البعد الرابع: الانخراط الاجتماعي والتشاركي',
    dimensionOrder: 4,
    text: 'أشارك بفاعلية في مناقشة الأفكار البرمجية وتوزيع المهام مع زملائي لإنتاج مشروع البايثون.',
    keywords: 'مناقشة الأفكار وتوزيع المهام'
  },
  {
    id: 'eng_44',
    number: 44,
    dimensionId: 'social',
    dimensionTitle: 'البعد الرابع: الانخراط الاجتماعي والتشاركي',
    dimensionOrder: 4,
    text: 'أستعين بآراء ومقترحات زملائي داخل البيئة لتطوير وتحسين جودة كود البايثون الخاص بي.',
    keywords: 'الاستعانة بمقترحات الزملاء'
  },
  {
    id: 'eng_45',
    number: 45,
    dimensionId: 'social',
    dimensionTitle: 'البعد الرابع: الانخراط الاجتماعي والتشاركي',
    dimensionOrder: 4,
    text: 'أحرص على تقديم نقد برمجي بنّاء ومقترحات تحسينية لأكواد زملائي المنشورة في قنوات التواصل.',
    keywords: 'تقديم نقد برمجي بنّاء'
  },
  {
    id: 'eng_46',
    number: 46,
    dimensionId: 'social',
    dimensionTitle: 'البعد الرابع: الانخراط الاجتماعي والتشاركي',
    dimensionOrder: 4,
    text: 'أعمل بمرونة لتوفيق وجهات النظر البرمجية المختلفة بيني وبين أفراد مجموعتي لضمان وحدة بناء المشروع.',
    keywords: 'المرونة وتوفيق وجهات النظر'
  },
  {
    id: 'eng_47',
    number: 47,
    dimensionId: 'social',
    dimensionTitle: 'البعد الرابع: الانخراط الاجتماعي والتشاركي',
    dimensionOrder: 4,
    text: 'ألتزم بتقديم تقارير دورية واضحة لزملائي بالمجموعة حول ما أنجزته من أكواد برمجية.',
    keywords: 'التقارير الدورية والإفصاح'
  },
  {
    id: 'eng_48',
    number: 48,
    dimensionId: 'social',
    dimensionTitle: 'البعد الرابع: الانخراط الاجتماعي والتشاركي',
    dimensionOrder: 4,
    text: 'أبادر بتنظيم جلسات عمل افتراضية مع أفراد مجموعتي لمراجعة كود المشروع واكتشاف الأخطاء معاً.',
    keywords: 'جلسات العمل الافتراضية والمراجعة'
  },
  {
    id: 'eng_49',
    number: 49,
    dimensionId: 'social',
    dimensionTitle: 'البعد الرابع: الانخراط الاجتماعي والتشاركي',
    dimensionOrder: 4,
    text: 'أشارك زملائي في العصف الذهني واقتراح أفكار إبداعية للمشروع الإلكتروني قبل البدء في كتابة الأكواد.',
    keywords: 'العصف الذهني التشاركي'
  },
  {
    id: 'eng_50',
    number: 50,
    dimensionId: 'social',
    dimensionTitle: 'البعد الرابع: الانخراط الاجتماعي والتشاركي',
    dimensionOrder: 4,
    text: 'أساهم في حل النزاعات أو وجهات النظر المختلفة بين أفراد المجموعة حول آلية تنفيذ المشروع البرمجي.',
    keywords: 'فض النزاعات وتوحيد الرؤية'
  },
  {
    id: 'eng_51',
    number: 51,
    dimensionId: 'social',
    dimensionTitle: 'البعد الرابع: الانخراط الاجتماعي والتشاركي',
    dimensionOrder: 4,
    text: 'أساهم بفاعلية في دمج وتجميع الأجزاء البرمجية التي كتبها زملائي لتكوين ملف مشروع متكامل.',
    keywords: 'دمج وتكامل الأجزاء البرمجية'
  },
  {
    id: 'eng_52',
    number: 52,
    dimensionId: 'social',
    dimensionTitle: 'البعد الرابع: الانخراط الاجتماعي والتشاركي',
    dimensionOrder: 4,
    text: 'أشعر بالارتياح عند تبادل الأفكار البرمجية مع الآخرين للوصول إلى أفضل حل للمشروع.',
    keywords: 'الارتياح لتبادل الأفكار'
  },
  {
    id: 'eng_53',
    number: 53,
    dimensionId: 'social',
    dimensionTitle: 'البعد الرابع: الانخراط الاجتماعي والتشاركي',
    dimensionOrder: 4,
    text: 'أستفيد من التغذية الراجعة المقدمة من زملائي لتطوير مهاراتي البرمجية.',
    keywords: 'الاستفادة من تغذية الأقران'
  },
  {
    id: 'eng_54',
    number: 54,
    dimensionId: 'social',
    dimensionTitle: 'البعد الرابع: الانخراط الاجتماعي والتشاركي',
    dimensionOrder: 4,
    text: 'أحرص على متابعة المناقشات البرمجية التشاركية داخل البيئة لتقييم مستواي وتطويره.',
    keywords: 'متابعة النقاشات وتطوير المستوى'
  },
  {
    id: 'eng_55',
    number: 55,
    dimensionId: 'social',
    dimensionTitle: 'البعد الرابع: الانخراط الاجتماعي والتشاركي',
    dimensionOrder: 4,
    text: 'أشعر بالمتعة أثناء تجاوز الصعوبات البرمجية بالتعاون والتفكير الجماعي مع أفراد المجموعة.',
    keywords: 'متعة التفكير الجماعي المشترك'
  },
  {
    id: 'eng_56',
    number: 56,
    dimensionId: 'social',
    dimensionTitle: 'البعد الرابع: الانخراط الاجتماعي والتشاركي',
    dimensionOrder: 4,
    text: 'أحرص على التنسيق مع زملائي لاتخاذ القرارات البرمجية المناسبة التي تخدم إنجاز المشروع.',
    keywords: 'التنسيق واتخاذ القرارات الجماعية'
  }
];

// Helper calculations for engagement scores
export function calculateEngagementDimensionScores(responses: Record<string, number>) {
  let cogSum = 0, cogCount = 0;
  let behSum = 0, behCount = 0;
  let emoSum = 0, emoCount = 0;
  let socSum = 0, socCount = 0;

  ENGAGEMENT_ITEMS.forEach(item => {
    const val = responses[item.id] || responses[`eng_${item.number}`] || 0;
    if (val > 0) {
      if (item.dimensionId === 'cognitive') {
        cogSum += val;
        cogCount++;
      } else if (item.dimensionId === 'behavioral') {
        behSum += val;
        behCount++;
      } else if (item.dimensionId === 'emotional') {
        emoSum += val;
        emoCount++;
      } else if (item.dimensionId === 'social') {
        socSum += val;
        socCount++;
      }
    }
  });

  const totalAnswered = cogCount + behCount + emoCount + socCount;
  const rawTotal = cogSum + behSum + emoSum + socSum;

  // Max score per dimension is 14 * 5 = 70 points
  const cogPct = cogCount > 0 ? Math.round((cogSum / (cogCount * 5)) * 100) : 0;
  const behPct = behCount > 0 ? Math.round((behSum / (behCount * 5)) * 100) : 0;
  const emoPct = emoCount > 0 ? Math.round((emoSum / (emoCount * 5)) * 100) : 0;
  const socPct = socCount > 0 ? Math.round((socSum / (socCount * 5)) * 100) : 0;

  const totalPct = totalAnswered > 0 ? Math.round((rawTotal / (totalAnswered * 5)) * 100) : 0;

  let level: 'مرتفع جداً' | 'مرتفع' | 'متوسط' | 'منخفض' = 'متوسط';
  if (totalPct >= 85) level = 'مرتفع جداً';
  else if (totalPct >= 70) level = 'مرتفع';
  else if (totalPct >= 50) level = 'متوسط';
  else level = 'منخفض';

  return {
    rawTotal,
    maxPossible: 56 * 5,
    totalAnswered,
    totalPercentage: totalPct,
    level,
    dimensions: {
      cognitive: {
        raw: cogSum,
        max: 14 * 5,
        percentage: cogPct,
        answeredCount: cogCount
      },
      behavioral: {
        raw: behSum,
        max: 14 * 5,
        percentage: behPct,
        answeredCount: behCount
      },
      emotional: {
        raw: emoSum,
        max: 14 * 5,
        percentage: emoPct,
        answeredCount: emoCount
      },
      social: {
        raw: socSum,
        max: 14 * 5,
        percentage: socPct,
        answeredCount: socCount
      }
    }
  };
}
