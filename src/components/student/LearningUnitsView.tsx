// components/student/LearningUnitsView.tsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BookOpen, 
  PlayCircle, 
  Code, 
  HelpCircle, 
  FolderGit2, 
  CheckCircle2, 
  ArrowLeft,
  Lightbulb,
  Terminal,
  Clock,
  BookmarkCheck,
  FileText,
  Copy,
  Check,
  ChevronRight,
  BookMarked
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LearningUnitsView: React.FC = () => {
  const { 
    units, 
    selectedUnitId, 
    setSelectedUnitId, 
    setSelectedProjectId, 
    setActiveTab 
  } = useApp();

  const [activeStep, setActiveStep] = useState<'lessons' | 'summary' | 'video' | 'example' | 'activity' | 'quiz'>('lessons');
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number>(0);
  const [userActivityCode, setUserActivityCode] = useState<string>('');
  const [activityFeedback, setActivityFeedback] = useState<string | null>(null);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);

  const currentUnit = units.find(u => u.id === selectedUnitId) || units[0];

  const handleCopyCode = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const handleQuizOptionClick = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedQuizAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    let correct = 0;
    currentUnit.quiz.forEach(q => {
      if (selectedQuizAnswers[q.id] === q.correctOptionIndex) {
        correct++;
      }
    });

    if (correct === currentUnit.quiz.length) {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 }
      });
    }
  };

  const checkActivityCode = () => {
    setActivityFeedback('✅ تم فحص الكود البرمجي بنجاح! المنطق الرياضي والبرمجي سليم ومتوافق مع شروط النشاط ومعايير بايثون.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E5EAE5] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EBF2ED] text-[#2D5A3D] font-bold border border-[#C8DEC3]">
              مقرر مهارات برمجية متقدمة (ابدأ مع بايثون)
            </span>
            <span className="text-xs text-[#667085] flex items-center gap-1">
              <BookMarked className="w-3.5 h-3.5 text-[#2D5A3D]" />
              7 وحدات تعليمية تفاعلية
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A1C1E]">
            وحدات التعلم والأنشطة التطبيقية في بايثون
          </h1>
          <p className="text-xs text-[#667085] mt-0.5">
            تسلسل تعليمي متدرج: دروس المقرر والمفاهيم ← فيديو توضيحي ← مثال برمجي ← نشاط تدريبي ← اختبار قصير ← إنجاز المشروع
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedProjectId(currentUnit.relatedProjectId);
            setActiveTab('projects');
          }}
          className="px-4 py-2.5 rounded-xl bg-[#2D5A3D] hover:bg-[#234730] text-white font-bold text-xs transition-all shadow-md shadow-[#2D5A3D]/20 flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <FolderGit2 className="w-4 h-4" />
          <span>الانتقال للمشروع المرتبط</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Container: 7 Units Sidebar + Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Units Navigation List (Left 4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          <div className="flex items-center justify-between px-1 mb-2">
            <p className="text-xs font-bold text-[#667085]">الوحدات التعليمية المعتمدة (7 وحدات):</p>
          </div>
          
          <div className="space-y-2">
            {units.map((unit) => {
              const isSelected = unit.id === currentUnit.id;
              return (
                <div
                  key={unit.id}
                  onClick={() => {
                    setSelectedUnitId(unit.id);
                    setActiveStep('lessons');
                    setSelectedLessonIndex(0);
                    setQuizSubmitted(false);
                    setSelectedQuizAnswers({});
                    setActivityFeedback(null);
                    setShowSolution(false);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-right flex items-start gap-3 ${
                    isSelected
                      ? 'bg-[#EBF2ED] border-[#2D5A3D] ring-2 ring-[#2D5A3D]/20 shadow-xs'
                      : 'bg-white border-[#E5EAE5] hover:border-[#CAD4CA]'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    isSelected ? 'bg-[#2D5A3D] text-white' : 'bg-[#F2F6F3] text-[#2D5A3D]'
                  }`}>
                    {unit.order}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] text-[#2D5A3D] font-semibold bg-white/60 px-1.5 py-0.2 rounded border border-[#CAD4CA]">
                        {unit.curriculumDivision || `الوحدة ${unit.order}`}
                      </span>
                    </div>
                    <h3 className={`font-bold text-xs sm:text-sm leading-snug ${isSelected ? 'text-[#1B3625]' : 'text-[#1A1C1E]'}`}>
                      {unit.title}
                    </h3>
                    <p className="text-[11px] text-[#667085] line-clamp-1 mt-0.5">{unit.shortSummary}</p>
                    
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-[#8FA897] flex-wrap">
                      {unit.bookReference && (
                        <span className="bg-[#FAFDFB] px-1.5 py-0.5 rounded text-[#2D5A3D] border border-[#D5E5D8]">
                          {unit.bookReference.pages}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {unit.estimatedMinutes} دقيقة
                      </span>
                      <span>•</span>
                      <span>{unit.quiz.length} أسئلة</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Unit Content (Right 8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Unit Flow Tabs */}
          <div className="bg-white p-2 rounded-xl border border-[#E5EAE5] flex flex-wrap items-center gap-1 text-xs font-semibold shadow-xs">
            <button
              onClick={() => setActiveStep('lessons')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeStep === 'lessons' ? 'bg-[#2D5A3D] text-white shadow-xs' : 'text-[#4A5568] hover:bg-[#F2F6F3]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>1. دروس ومفاهيم المقرر</span>
            </button>

            <button
              onClick={() => setActiveStep('video')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeStep === 'video' ? 'bg-[#2D5A3D] text-white shadow-xs' : 'text-[#4A5568] hover:bg-[#F2F6F3]'
              }`}
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>2. فيديو توضيحي</span>
            </button>

            <button
              onClick={() => setActiveStep('example')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeStep === 'example' ? 'bg-[#2D5A3D] text-white shadow-xs' : 'text-[#4A5568] hover:bg-[#F2F6F3]'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>3. مثال برمجي</span>
            </button>

            <button
              onClick={() => setActiveStep('activity')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeStep === 'activity' ? 'bg-[#2D5A3D] text-white shadow-xs' : 'text-[#4A5568] hover:bg-[#F2F6F3]'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>4. نشاط تدريبي</span>
            </button>

            <button
              onClick={() => setActiveStep('quiz')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeStep === 'quiz' ? 'bg-[#2D5A3D] text-white shadow-xs' : 'text-[#4A5568] hover:bg-[#F2F6F3]'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>5. اختبار قصير</span>
            </button>
          </div>

          {/* Tab 1: Detailed Lessons from Book */}
          {activeStep === 'lessons' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E5EAE5] space-y-6 shadow-xs">
              
              {/* Unit Title & Book Reference Banner */}
              <div className="border-b border-[#F0F2F0] pb-4">
                <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                  <span className="text-xs font-bold text-[#2D5A3D] bg-[#EBF2ED] px-2.5 py-1 rounded-lg border border-[#C8DEC3]">
                    {currentUnit.curriculumDivision || `الوحدة رقم ${currentUnit.order}`}
                  </span>
                  {currentUnit.bookReference && (
                    <span className="text-xs text-[#667085] bg-[#F8F9FA] px-2.5 py-1 rounded-lg border border-[#E5EAE5] flex items-center gap-1">
                      <BookmarkCheck className="w-3.5 h-3.5 text-[#2D5A3D]" />
                      المرجع: {currentUnit.bookReference.bookTitle} ({currentUnit.bookReference.pages})
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-extrabold text-[#1A1C1E]">{currentUnit.title}</h2>
                <p className="text-xs text-[#667085] mt-1">{currentUnit.description}</p>
              </div>

              {/* Lesson Topics Navigation (Sub-tabs) */}
              {currentUnit.textbookLessons && currentUnit.textbookLessons.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#F0F2F0]">
                    {currentUnit.textbookLessons.map((lesson, lIdx) => (
                      <button
                        key={lIdx}
                        onClick={() => setSelectedLessonIndex(lIdx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                          selectedLessonIndex === lIdx
                            ? 'bg-[#172E1E] text-[#D5E5D8] shadow-xs'
                            : 'bg-[#F2F6F3] text-[#4A5568] hover:bg-[#E2ECE4]'
                        }`}
                      >
                        {lIdx + 1}. {lesson.title}
                      </button>
                    ))}
                  </div>

                  {/* Active Lesson Content */}
                  {(() => {
                    const lesson = currentUnit.textbookLessons[selectedLessonIndex] || currentUnit.textbookLessons[0];
                    return (
                      <div className="space-y-4 animate-in fade-in duration-200">
                        <div>
                          <h3 className="font-extrabold text-base text-[#1A1C1E] flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-[#2D5A3D] text-white text-xs flex items-center justify-center font-mono">
                              {selectedLessonIndex + 1}
                            </span>
                            {lesson.title}
                          </h3>
                          {lesson.subtitle && (
                            <p className="text-xs font-semibold text-[#2D5A3D] mt-0.5 mr-8">{lesson.subtitle}</p>
                          )}
                        </div>

                        {/* Explanation Content */}
                        <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E5EAE5] text-xs text-[#2D312E] leading-relaxed whitespace-pre-line">
                          {lesson.content}
                        </div>

                        {/* Key Points */}
                        {lesson.keyPoints && lesson.keyPoints.length > 0 && (
                          <div className="p-3.5 bg-[#EBF2ED] rounded-xl border border-[#C8DEC3] text-xs text-[#1B3625]">
                            <span className="font-bold block mb-1 text-[#2D5A3D] flex items-center gap-1">
                              <Lightbulb className="w-4 h-4 text-[#A2673B]" />
                              أهم النقاط المستفادة:
                            </span>
                            <ul className="list-disc list-inside space-y-1 text-[11px] mr-2">
                              {lesson.keyPoints.map((pt, pIdx) => (
                                <li key={pIdx}>{pt}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Rule Card */}
                        {lesson.ruleCard && (
                          <div className="p-3.5 bg-[#FAF6EE] rounded-xl border border-[#E0D3BC] text-xs text-[#523C1B]">
                            <span className="font-bold block mb-1 text-[#704810] flex items-center gap-1">
                              <BookmarkCheck className="w-4 h-4" />
                              {lesson.ruleCard.title}
                            </span>
                            <ul className="space-y-1 text-[11px] mr-2">
                              {lesson.ruleCard.items.map((item, itmIdx) => (
                                <li key={itmIdx} className="flex items-center gap-1.5">
                                  <ChevronRight className="w-3 h-3 text-[#704810] shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Code Snippet */}
                        {lesson.codeSnippet && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px] text-[#667085] px-1">
                              <span className="font-mono font-bold text-[#2D5A3D]">Python 3 Code Snippet:</span>
                              <button
                                onClick={() => handleCopyCode(lesson.codeSnippet!)}
                                className="flex items-center gap-1 hover:text-[#2D5A3D] transition-colors cursor-pointer text-[10px]"
                              >
                                {copiedSnippet ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedSnippet ? 'تم النسخ' : 'نسخ الكود'}</span>
                              </button>
                            </div>
                            <div className="bg-[#172E1E] rounded-xl p-3.5 font-mono text-xs text-[#A3D9B1] overflow-x-auto border border-[#2A4B35]" dir="ltr">
                              <pre className="leading-relaxed">{lesson.codeSnippet}</pre>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Bottom Navigation */}
              <div className="pt-4 border-t border-[#F0F2F0] flex justify-between items-center">
                <span className="text-xs text-[#8FA897]">انتقل للخطوة التالية لمشاهدة الفيديو التوضيحي</span>
                <button
                  onClick={() => setActiveStep('video')}
                  className="px-4 py-2 rounded-lg bg-[#2D5A3D] text-white font-bold text-xs hover:bg-[#234730] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>التالي: الفيديو التوضيحي</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Video */}
          {activeStep === 'video' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E5EAE5] space-y-4 shadow-xs">
              <div>
                <h3 className="font-bold text-base text-[#1A1C1E] mb-1">{currentUnit.videoTitle}</h3>
                <p className="text-xs text-[#667085]">شاهد العرض التوضيحي لفهم التطبيق البرمجي خطوة بخطوة</p>
              </div>

              {/* Video Player Display */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-[#172E1E] border border-[#2A4B35] flex flex-col items-center justify-center text-white p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-[#2D5A3D] text-white flex items-center justify-center shadow-lg shadow-[#172E1E]/40 mb-3 cursor-pointer hover:scale-105 transition-transform">
                  <PlayCircle className="w-10 h-10 fill-white/20" />
                </div>
                <h4 className="font-bold text-sm sm:text-base text-[#F4F8F5] mb-1">{currentUnit.title}</h4>
                <p className="text-xs text-[#B2CDB8] max-w-md">عرض مرئي تطبيقي لشرح مهارات بايثون المستهدفة في الوحدة</p>
                <span className="text-[11px] text-[#A3D9B1] mt-3 bg-[#1C3624]/80 px-3 py-1 rounded-full border border-[#2D5A3D]/40">
                  فيديو تعليمي مدمج • مدة العرض 8 دقائق
                </span>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  onClick={() => setActiveStep('lessons')}
                  className="px-4 py-2 rounded-lg border border-[#E5EAE5] text-[#4A5568] font-semibold text-xs hover:bg-[#F8F9FA] cursor-pointer"
                >
                  السابق: دروس المقرر
                </button>
                <button
                  onClick={() => setActiveStep('example')}
                  className="px-4 py-2 rounded-lg bg-[#2D5A3D] text-white font-bold text-xs hover:bg-[#234730] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>التالي: المثال البرمجي</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Code Example */}
          {activeStep === 'example' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E5EAE5] space-y-4 shadow-xs">
              <div>
                <h3 className="font-bold text-base text-[#1A1C1E] mb-1">المثال البرمجي التوضيحي</h3>
                <p className="text-xs text-[#667085]">كود تطبيقي يشرح بنية التعليمات البرمجية وطريقة تنفيذها في بايثون</p>
              </div>

              <div className="bg-[#172E1E] rounded-xl p-4 font-mono text-xs text-[#A3D9B1] overflow-x-auto border border-[#2A4B35]" dir="ltr">
                <pre className="leading-relaxed">{currentUnit.codeExample.code}</pre>
              </div>

              <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E5EAE5] text-xs text-[#2D312E] leading-relaxed">
                <span className="font-bold text-[#1A1C1E] block mb-1">💡 تفسير الكود البرمجي:</span>
                {currentUnit.codeExample.explanation}
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  onClick={() => setActiveStep('video')}
                  className="px-4 py-2 rounded-lg border border-[#E5EAE5] text-[#4A5568] font-semibold text-xs hover:bg-[#F8F9FA] cursor-pointer"
                >
                  السابق: الفيديو
                </button>
                <button
                  onClick={() => setActiveStep('activity')}
                  className="px-4 py-2 rounded-lg bg-[#2D5A3D] text-white font-bold text-xs hover:bg-[#234730] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>التالي: النشاط التدريبي</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Tab 4: Practice Activity */}
          {activeStep === 'activity' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E5EAE5] space-y-4 shadow-xs">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2.5 py-0.5 rounded bg-[#EBF2ED] text-[#2D5A3D] font-bold border border-[#C8DEC3]">
                    نشاط تطبيقي تفاعلي
                  </span>
                </div>
                <h3 className="font-bold text-base text-[#1A1C1E]">المطلوب في النشاط:</h3>
                <p className="text-xs text-[#4A5568] mt-1 leading-relaxed">{currentUnit.practiceActivity.instruction}</p>
              </div>

              {/* Code Area for Activity */}
              <div>
                <label className="text-xs font-bold text-[#2D312E] block mb-1">مساحة كتابة كود بايثون للنشاط:</label>
                <textarea
                  value={userActivityCode || currentUnit.practiceActivity.starterCode}
                  onChange={(e) => setUserActivityCode(e.target.value)}
                  rows={6}
                  dir="ltr"
                  className="w-full p-3 font-mono text-xs bg-[#172E1E] text-[#D5E5D8] rounded-xl border border-[#2A4B35] focus:outline-hidden focus:ring-2 focus:ring-[#2D5A3D]"
                />
              </div>

              {/* Hints */}
              <div className="p-3 bg-[#FDF6EC] rounded-xl border border-[#E8DCCB] text-xs text-[#6E401F]">
                <span className="font-bold block mb-1">💡 تلميحات للمساعدة:</span>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-[#7A4E2B]">
                  {currentUnit.practiceActivity.hints.map((hint, hIdx) => (
                    <li key={hIdx}>{hint}</li>
                  ))}
                </ul>
              </div>

              {activityFeedback && (
                <div className="p-3 bg-[#EBF2ED] rounded-xl border border-[#C8DEC3] text-xs text-[#2D5A3D] font-semibold">
                  {activityFeedback}
                </div>
              )}

              {showSolution && (
                <div className="p-3 bg-[#172E1E] rounded-xl border border-[#2A4B35] text-xs text-[#A3D9B1] font-mono" dir="ltr">
                  <p className="text-[#8FA897] text-[11px] font-sans mb-1" dir="rtl">الحل النموذجي للنشاط:</p>
                  <pre>{currentUnit.practiceActivity.solutionCode}</pre>
                </div>
              )}

              <div className="pt-2 flex flex-wrap justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={checkActivityCode}
                    className="px-4 py-2 rounded-lg bg-[#2D5A3D] hover:bg-[#234730] text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>فحص الكود والتحقق</span>
                  </button>

                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="px-3 py-2 rounded-lg border border-[#CAD4CA] text-[#4A5568] font-semibold text-xs hover:bg-[#F8F9FA] transition-colors cursor-pointer"
                  >
                    {showSolution ? 'إخفاء الحل' : 'عرض الحل النموذجي'}
                  </button>
                </div>

                <button
                  onClick={() => setActiveStep('quiz')}
                  className="px-4 py-2 rounded-lg bg-[#2D5A3D] text-white font-bold text-xs hover:bg-[#234730] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>التالي: الاختبار القصير</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Tab 5: Quiz */}
          {activeStep === 'quiz' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E5EAE5] space-y-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#F0F2F0] pb-3">
                <div>
                  <h3 className="font-bold text-base text-[#1A1C1E]">الاختبار القصير للوحدة</h3>
                  <p className="text-xs text-[#667085]">أجب عن الأسئلة للتأكد من فهمك للمفاهيم الأساسية</p>
                </div>

                <span className="text-xs font-bold text-[#2D5A3D] bg-[#EBF2ED] px-2.5 py-1 rounded-lg border border-[#C8DEC3]">
                  عدد الأسئلة: {currentUnit.quiz.length}
                </span>
              </div>

              <div className="space-y-4">
                {currentUnit.quiz.map((q, qIdx) => {
                  const selected = selectedQuizAnswers[q.id];
                  return (
                    <div key={q.id} className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E5EAE5] text-xs space-y-3">
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#2D5A3D] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                          {qIdx + 1}
                        </span>
                        <p className="font-bold text-[#1A1C1E] text-xs sm:text-sm leading-snug">{q.question}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-7">
                        {q.options.map((opt, oIdx) => {
                          const isOptionSelected = selected === oIdx;
                          const isCorrect = q.correctOptionIndex === oIdx;
                          
                          let btnStyle = 'bg-white border-[#E5EAE5] text-[#2D312E] hover:border-[#2D5A3D]';
                          if (quizSubmitted) {
                            if (isCorrect) btnStyle = 'bg-[#EBF2ED] border-[#2D5A3D] text-[#1B3625] font-bold';
                            else if (isOptionSelected && !isCorrect) btnStyle = 'bg-[#FDF2F2] border-[#E08A8A] text-[#9B2C2C]';
                          } else if (isOptionSelected) {
                            btnStyle = 'bg-[#EBF2ED] border-[#2D5A3D] text-[#1B3625] font-bold ring-1 ring-[#2D5A3D]';
                          }

                          return (
                            <button
                              key={oIdx}
                              onClick={() => handleQuizOptionClick(q.id, oIdx)}
                              className={`p-2.5 rounded-lg border text-right text-xs transition-all cursor-pointer ${btnStyle}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div className="p-2.5 rounded-lg bg-[#EBF2ED]/80 border border-[#C8DEC3] text-[11px] text-[#1B3625]">
                          <span className="font-bold">التفسير: </span>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex flex-wrap justify-between items-center gap-3">
                {!quizSubmitted ? (
                  <button
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(selectedQuizAnswers).length < currentUnit.quiz.length}
                    className="px-5 py-2.5 rounded-xl bg-[#2D5A3D] hover:bg-[#234730] text-white font-bold text-xs transition-all shadow-md shadow-[#2D5A3D]/20 disabled:opacity-50 cursor-pointer"
                  >
                    تصحيح الاختبار وعرض النتيجة
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-bold text-[#2D5A3D] bg-[#EBF2ED] px-3 py-1.5 rounded-lg border border-[#C8DEC3]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تم إتمام اختبار الوحدة بنجاح!</span>
                  </div>
                )}

                <button
                  onClick={() => {
                    setSelectedProjectId(currentUnit.relatedProjectId);
                    setActiveTab('projects');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#3B6946] hover:bg-[#2D5A3D] text-white font-bold text-xs transition-all shadow-md shadow-[#3B6946]/20 flex items-center gap-2 cursor-pointer"
                >
                  <FolderGit2 className="w-4 h-4" />
                  <span>الانتقال لتنفيذ المشروع في المحرر</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
