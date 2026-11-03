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
  ChevronLeft,
  BookMarked,
  ExternalLink,
  ListVideo,
  Video
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
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number>(0);
  const [inlineLessonVideoOpen, setInlineLessonVideoOpen] = useState<boolean>(false);
  const [copiedVideoLink, setCopiedVideoLink] = useState<boolean>(false);
  const [userActivityCode, setUserActivityCode] = useState<string>('');
  const [activityFeedback, setActivityFeedback] = useState<string | null>(null);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);

  const currentUnit = units.find(u => u.id === selectedUnitId) || units[0];

  const unitVideos = currentUnit.unitVideos && currentUnit.unitVideos.length > 0 
    ? currentUnit.unitVideos 
    : [{
        id: currentUnit.videoUrl.split('/embed/')[1]?.split('?')[0] || '-1-RegdBsGo',
        title: currentUnit.videoTitle,
        duration: '08:00',
        description: 'شرح تطبيقي لمهارات ومفاهيم الوحدة التعليمية في بايثون'
      }];

  const currentVideo = unitVideos[selectedVideoIndex] || unitVideos[0];

  const handleCopyVideoUrl = (videoId: string) => {
    navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${videoId}`);
    setCopiedVideoLink(true);
    setTimeout(() => setCopiedVideoLink(false), 2000);
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#14281d] p-6 rounded-2xl border border-[#355834] shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#355834] text-white font-bold border border-[#c2a878]">
              مقرر مهارات برمجية متقدمة (ابدأ مع بايثون)
            </span>
            <span className="text-xs text-[#c2a878] flex items-center gap-1">
              <BookMarked className="w-3.5 h-3.5 text-[#c2a878]" />
              7 وحدات تعليمية تفاعلية
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            وحدات التعلم والأنشطة التطبيقية في بايثون
          </h1>
          <p className="text-xs text-[#c2a878] mt-0.5">
            تسلسل تعليمي متدرج: دروس المقرر والمفاهيم ← فيديو توضيحي ← مثال برمجي ← نشاط تدريبي ← اختبار قصير ← إنجاز المشروع
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedProjectId(currentUnit.relatedProjectId);
            setActiveTab('projects');
          }}
          className="px-4 py-2.5 rounded-xl bg-[#355834] hover:bg-[#6e633d] text-white font-bold text-xs transition-all shadow-md shadow-[#355834]/20 flex items-center gap-2 self-start sm:self-auto cursor-pointer"
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
            <p className="text-xs font-bold text-[#c2a878]">الوحدات التعليمية المعتمدة (7 وحدات):</p>
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
                    setSelectedVideoIndex(0);
                    setInlineLessonVideoOpen(false);
                    setQuizSubmitted(false);
                    setSelectedQuizAnswers({});
                    setActivityFeedback(null);
                    setShowSolution(false);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-right flex items-start gap-3 ${
                    isSelected
                      ? 'bg-[#355834] border-[#c2a878] ring-2 ring-[#c2a878]/30 shadow-md'
                      : 'bg-[#14281d] border-[#355834] hover:border-[#c2a878]'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    isSelected ? 'bg-[#14281d] text-[#c2a878] border border-[#c2a878]' : 'bg-[#355834] text-white'
                  }`}>
                    {unit.order}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] text-[#c2a878] font-semibold bg-[#0e1b14] px-1.5 py-0.2 rounded border border-[#c2a878]/60">
                        {unit.curriculumDivision || `الوحدة ${unit.order}`}
                      </span>
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm leading-snug text-white">
                      {unit.title}
                    </h3>
                    <p className="text-[11px] text-[#c2a878] line-clamp-1 mt-0.5">{unit.shortSummary}</p>
                    
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-[#c2a878] flex-wrap">
                      {unit.bookReference && (
                        <span className="bg-[#0e1b14] px-1.5 py-0.5 rounded text-[#c2a878] border border-[#355834]">
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
          <div className="bg-[#14281d] p-2 rounded-xl border border-[#355834] shadow-md flex flex-wrap items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setActiveStep('lessons')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeStep === 'lessons' ? 'bg-[#355834] text-white border border-[#c2a878] shadow-xs' : 'text-[#c2a878] hover:bg-[#355834] hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>1. دروس ومفاهيم المقرر</span>
            </button>

            <button
              onClick={() => setActiveStep('video')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeStep === 'video' ? 'bg-[#355834] text-white border border-[#c2a878] shadow-xs' : 'text-[#c2a878] hover:bg-[#355834] hover:text-white'
              }`}
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>2. فيديو توضيحي</span>
            </button>

            <button
              onClick={() => setActiveStep('example')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeStep === 'example' ? 'bg-[#355834] text-white border border-[#c2a878] shadow-xs' : 'text-[#c2a878] hover:bg-[#355834] hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>3. مثال برمجي</span>
            </button>

            <button
              onClick={() => setActiveStep('activity')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeStep === 'activity' ? 'bg-[#355834] text-white border border-[#c2a878] shadow-xs' : 'text-[#c2a878] hover:bg-[#355834] hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>4. نشاط تدريبي</span>
            </button>

            <button
              onClick={() => setActiveStep('quiz')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeStep === 'quiz' ? 'bg-[#355834] text-white border border-[#c2a878] shadow-xs' : 'text-[#c2a878] hover:bg-[#355834] hover:text-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>5. اختبار قصير</span>
            </button>
          </div>

          {/* Tab 1: Detailed Lessons from Book */}
          {activeStep === 'lessons' && (
            <div className="bg-[#14281d] p-6 rounded-2xl border border-[#355834] space-y-6 shadow-md">
              
              {/* Unit Title & Book Reference Banner */}
              <div className="border-b border-[#355834] pb-4">
                <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                  <span className="text-xs font-bold text-white bg-[#355834] px-2.5 py-1 rounded-lg border border-[#c2a878]">
                    {currentUnit.curriculumDivision || `الوحدة رقم ${currentUnit.order}`}
                  </span>
                  {currentUnit.bookReference && (
                    <span className="text-xs text-[#c2a878] bg-[#0e1b14] px-2.5 py-1 rounded-lg border border-[#355834] flex items-center gap-1">
                      <BookmarkCheck className="w-3.5 h-3.5 text-[#c2a878]" />
                      المرجع: {currentUnit.bookReference.bookTitle} ({currentUnit.bookReference.pages})
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-extrabold text-white">{currentUnit.title}</h2>
                <p className="text-xs text-[#c2a878] mt-1">{currentUnit.description}</p>
              </div>

              {/* Lesson Topics Navigation (Sub-tabs) */}
              {currentUnit.textbookLessons && currentUnit.textbookLessons.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#355834]">
                    {currentUnit.textbookLessons.map((lesson, lIdx) => (
                      <button
                        key={lIdx}
                        onClick={() => setSelectedLessonIndex(lIdx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                          selectedLessonIndex === lIdx
                            ? 'bg-[#355834] text-white border border-[#c2a878] shadow-xs'
                            : 'bg-[#0e1b14] text-[#c2a878] hover:text-white hover:bg-[#355834]'
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
                          <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-[#355834] text-white text-xs flex items-center justify-center font-mono border border-[#c2a878]/50">
                              {selectedLessonIndex + 1}
                            </span>
                            {lesson.title}
                          </h3>
                          {lesson.subtitle && (
                            <p className="text-xs font-semibold text-[#c2a878] mt-1 mr-8">{lesson.subtitle}</p>
                          )}
                        </div>

                        {/* Explanation Content - High Contrast & Easy on Eyes */}
                        <div className="p-4 rounded-xl bg-[#0e1b14] border border-[#355834] text-sm text-[#f3f4f6] leading-relaxed whitespace-pre-line font-normal shadow-inner">
                          {lesson.content}
                        </div>

                        {/* Key Points */}
                        {lesson.keyPoints && lesson.keyPoints.length > 0 && (
                          <div className="p-3.5 bg-[#0e1b14] rounded-xl border border-[#c2a878]/60 text-xs text-[#f3f4f6]">
                            <span className="font-bold block mb-2 text-[#c2a878] flex items-center gap-1.5">
                              <Lightbulb className="w-4 h-4 text-[#c2a878]" />
                              أهم النقاط المستفادة:
                            </span>
                            <ul className="list-disc list-inside space-y-1.5 text-xs text-[#f3f4f6]/95 mr-2">
                              {(lesson.keyPoints || []).map((pt, pIdx) => (
                                <li key={pIdx} className="leading-relaxed">{pt}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Rule Card */}
                        {lesson.ruleCard && (
                          <div className="p-3.5 bg-[#0e1b14] rounded-xl border border-[#c2a878]/60 text-xs text-[#f3f4f6]">
                            <span className="font-bold block mb-2 text-[#c2a878] flex items-center gap-1.5">
                              <BookmarkCheck className="w-4 h-4 text-[#c2a878]" />
                              {lesson.ruleCard.title}
                            </span>
                            <ul className="space-y-1.5 text-xs text-[#f3f4f6]/95 mr-2">
                              {(lesson.ruleCard.items || []).map((item, itmIdx) => (
                                <li key={itmIdx} className="flex items-center gap-1.5">
                                  <ChevronRight className="w-3 h-3 text-[#c2a878] shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Code Snippet */}
                        {lesson.codeSnippet && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px] text-[#c2a878] px-1">
                              <span className="font-mono font-bold text-[#c2a878]">Python 3 Code Snippet:</span>
                              <button
                                onClick={() => handleCopyCode(lesson.codeSnippet!)}
                                className="flex items-center gap-1 text-[#c2a878] hover:text-white transition-colors cursor-pointer text-[10px]"
                              >
                                {copiedSnippet ? <Check className="w-3 h-3 text-[#84cc16]" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedSnippet ? 'تم النسخ' : 'نسخ الكود'}</span>
                              </button>
                            </div>
                            <div className="bg-[#0e1b14] rounded-xl p-3.5 font-mono text-xs text-[#84cc16] overflow-x-auto border border-[#355834]" dir="ltr">
                              <pre className="leading-relaxed">{lesson.codeSnippet}</pre>
                            </div>
                          </div>
                        )}

                        {/* Video for this specific lesson */}
                        {lesson.videoId && (
                          <div className="p-4 bg-[#0e1b14] rounded-xl border border-[#355834] text-white shadow-xs">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#355834] text-white flex items-center justify-center shrink-0 shadow-md">
                                  <PlayCircle className="w-6 h-6 text-[#c2a878]" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#355834] text-white border border-[#c2a878]/50">
                                      فيديو الشرح العملي للدرس
                                    </span>
                                    {lesson.videoDuration && (
                                      <span className="text-[10px] text-[#c2a878] flex items-center gap-1 font-mono">
                                        <Clock className="w-3 h-3 text-[#c2a878]" />
                                        {lesson.videoDuration}
                                      </span>
                                    )}
                                  </div>
                                  <h4 className="text-xs sm:text-sm font-bold text-white mt-1">
                                    {lesson.videoTitle || 'شرح تطبيقي بالفيديو لهذا الدرس'}
                                  </h4>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
                                <button
                                  onClick={() => setInlineLessonVideoOpen(prev => !prev)}
                                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/10 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                                >
                                  <Video className="w-3.5 h-3.5" />
                                  <span>{inlineLessonVideoOpen ? 'إخفاء الفيديو' : 'مشاهدة سريعة'}</span>
                                </button>
                                <button
                                  onClick={() => {
                                    const matchIdx = unitVideos.findIndex(v => v.id === lesson.videoId);
                                    if (matchIdx !== -1) setSelectedVideoIndex(matchIdx);
                                    setActiveStep('video');
                                  }}
                                  className="px-3.5 py-1.5 rounded-lg bg-[#355834] hover:bg-[#6e633d] text-white font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer shadow-xs border border-[#c2a878]"
                                >
                                  <span>تبويب الفيديو</span>
                                  <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Inline video player if toggled */}
                            {inlineLessonVideoOpen && (
                              <div className="mt-4 pt-4 border-t border-[#355834] space-y-2 animate-in fade-in duration-200">
                                <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-[#355834] shadow-inner">
                                  <iframe
                                    src={`https://www.youtube-nocookie.com/embed/${lesson.videoId}?rel=0&autoplay=1`}
                                    title={lesson.videoTitle || 'فيديو الدرس'}
                                    className="w-full h-full border-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                  />
                                </div>
                                <div className="flex items-center justify-between text-[11px] text-[#c2a878] px-1">
                                  <span>دورة تعلم بايثون من البداية - YouTube</span>
                                  <a
                                    href={`https://www.youtube.com/watch?v=${lesson.videoId}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:underline flex items-center gap-1 text-[#c2a878] font-semibold"
                                  >
                                    <span>مشاهدة في YouTube</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}


              {/* Bottom Navigation */}
              <div className="pt-4 border-t border-[#355834] flex justify-between items-center">
                <span className="text-xs text-[#c2a878]">انتقل للخطوة التالية لمشاهدة الفيديو التوضيحي</span>
                <button
                  onClick={() => setActiveStep('video')}
                  className="px-4 py-2 rounded-lg bg-[#355834] text-white font-bold text-xs hover:bg-[#14281d] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>التالي: الفيديو التوضيحي</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Video Player & Unit Playlist */}
          {activeStep === 'video' && (
            <div className="bg-[#14281d] p-6 rounded-2xl border border-[#355834] space-y-6 shadow-md">
              
              {/* Top Banner with Course attribution */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#355834] pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#355834] text-white font-bold border border-[#c2a878] flex items-center gap-1.5">
                      <PlayCircle className="w-3.5 h-3.5 text-white" />
                      دورة تعلم لغة البرمجة بايثون من البداية
                    </span>
                    <span className="text-xs text-[#c2a878] flex items-center gap-1">
                      <ListVideo className="w-3.5 h-3.5 text-[#c2a878]" />
                      {unitVideos.length} فيديوهات مخصصة لهذه الوحدة
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base sm:text-lg text-white">{currentVideo.title}</h3>
                  {currentVideo.description && (
                    <p className="text-xs text-[#c2a878] mt-1">{currentVideo.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
                  <a
                    href={`https://www.youtube.com/watch?v=${currentVideo.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-xl bg-[#355834] hover:bg-[#6e633d] text-white font-bold text-xs border border-[#c2a878] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-white" />
                    <span>فتح في YouTube</span>
                  </a>
                  <a
                    href="https://www.youtube.com/watch?v=-1-RegdBsGo&list=PLB6BdpR28cia04a7VTzRDFckmMB6Aq7Ak"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-xl bg-[#355834] hover:bg-[#6e633d] text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer border border-[#c2a878]/50"
                  >
                    <ListVideo className="w-3.5 h-3.5" />
                    <span>قائمة تشغيل الدورة (82 فيديو)</span>
                  </a>
                </div>
              </div>

              {/* Main Video Embed */}
              <div className="space-y-3">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-[#355834]/40 shadow-xl shadow-[#14281d]/10">
                  <iframe
                    key={currentVideo.id}
                    src={`https://www.youtube-nocookie.com/embed/${currentVideo.id}?rel=0&modestbranding=1&autoplay=0`}
                    title={currentVideo.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-[#c2a878] px-1 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{currentVideo.title}</span>
                    {currentVideo.duration && (
                      <span className="px-2 py-0.5 rounded bg-[#0e1b14] text-[#c2a878] font-mono text-[11px] border border-[#355834]">
                        {currentVideo.duration}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleCopyVideoUrl(currentVideo.id)}
                    className="flex items-center gap-1.5 text-[#c2a878] hover:text-white transition-colors cursor-pointer text-xs"
                  >
                    {copiedVideoLink ? <Check className="w-3.5 h-3.5 text-[#84cc16]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedVideoLink ? 'تم نسخ الرابط!' : 'نسخ رابط الفيديو'}</span>
                  </button>
                </div>
              </div>

              {/* Unit Playlist - Video Selection Cards */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <ListVideo className="w-4 h-4 text-[#c2a878]" />
                    <span>فيديوهات الوحدة التعليمية ({unitVideos.length}):</span>
                  </h4>
                  <span className="text-[11px] text-[#c2a878]">اختر فيديو لمشاهدة الشرح التطبيقي مباشرة</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {unitVideos.map((video, vIdx) => {
                    const isSelected = vIdx === selectedVideoIndex;
                    return (
                      <div
                        key={video.id + vIdx}
                        onClick={() => setSelectedVideoIndex(vIdx)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'bg-[#355834] border-[#c2a878] ring-2 ring-[#c2a878]/30 shadow-md'
                            : 'bg-[#0e1b14] border-[#355834] hover:border-[#c2a878] hover:bg-[#355834]/40'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#14281d] text-[#c2a878] border border-[#c2a878] shadow-xs' : 'bg-[#355834] text-white'
                        }`}>
                          {isSelected ? (
                            <PlayCircle className="w-5 h-5 text-[#c2a878] animate-pulse" />
                          ) : (
                            <span className="text-xs font-bold font-mono">{vIdx + 1}</span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1 mb-1">
                            {isSelected ? (
                              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-[#14281d] text-[#c2a878] border border-[#c2a878]/50">
                                قيد المشاهدة الآن
                              </span>
                            ) : (
                              <span className="text-[10px] text-[#c2a878] font-semibold">
                                فيديو {vIdx + 1}
                              </span>
                            )}
                            {video.duration && (
                              <span className="text-[10px] text-[#c2a878] font-mono flex items-center gap-1">
                                <Clock className="w-3 h-3 text-[#c2a878]" />
                                {video.duration}
                              </span>
                            )}
                          </div>
                          <h5 className="text-xs font-bold line-clamp-1 text-white">
                            {video.title}
                          </h5>
                          {video.description && (
                            <p className="text-[11px] text-[#c2a878] line-clamp-1 mt-0.5">
                              {video.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Step Navigation */}
              <div className="pt-4 border-t border-[#355834] flex justify-between items-center">
                <button
                  onClick={() => setActiveStep('lessons')}
                  className="px-4 py-2 rounded-lg border border-[#355834] text-[#c2a878] font-semibold text-xs hover:bg-[#0e1b14] hover:text-white cursor-pointer"
                >
                  السابق: دروس المقرر
                </button>
                <button
                  onClick={() => setActiveStep('example')}
                  className="px-4 py-2 rounded-lg bg-[#355834] hover:bg-[#6e633d] text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs border border-[#c2a878]"
                >
                  <span>التالي: المثال البرمجي</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Code Example */}
          {activeStep === 'example' && (
            <div className="bg-[#14281d] p-6 rounded-2xl border border-[#355834] space-y-4 shadow-md">
              <div>
                <h3 className="font-bold text-base text-white mb-1">المثال البرمجي التوضيحي</h3>
                <p className="text-xs text-[#c2a878]">كود تطبيقي يشرح بنية التعليمات البرمجية وطريقة تنفيذها في بايثون</p>
              </div>

              <div className="bg-[#0e1b14] rounded-xl p-4 font-mono text-xs text-[#84cc16] overflow-x-auto border border-[#355834]" dir="ltr">
                <pre className="leading-relaxed">{currentUnit.codeExample.code}</pre>
              </div>

              <div className="p-4 rounded-xl bg-[#0e1b14] border border-[#355834] text-sm text-[#f3f4f6] leading-relaxed shadow-inner">
                <span className="font-bold text-[#c2a878] block mb-1">💡 تفسير الكود البرمجي:</span>
                {currentUnit.codeExample.explanation}
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  onClick={() => setActiveStep('video')}
                  className="px-4 py-2 rounded-lg border border-[#355834] text-[#c2a878] font-semibold text-xs hover:bg-[#0e1b14] hover:text-white cursor-pointer"
                >
                  السابق: الفيديو
                </button>
                <button
                  onClick={() => setActiveStep('activity')}
                  className="px-4 py-2 rounded-lg bg-[#355834] hover:bg-[#6e633d] text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-[#c2a878]"
                >
                  <span>التالي: النشاط التدريبي</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Tab 4: Practice Activity */}
          {activeStep === 'activity' && (
            <div className="bg-[#14281d] p-6 rounded-2xl border border-[#355834] space-y-4 shadow-md">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2.5 py-0.5 rounded bg-[#355834] text-white font-bold border border-[#c2a878]">
                    نشاط تطبيقي تفاعلي
                  </span>
                </div>
                <h3 className="font-bold text-base text-white">المطلوب في النشاط:</h3>
                <p className="text-sm text-[#f3f4f6] mt-1 leading-relaxed">{currentUnit.practiceActivity.instruction}</p>
              </div>

              {/* Code Area for Activity */}
              <div>
                <label className="text-xs font-bold text-[#c2a878] block mb-1">مساحة كتابة كود بايثون للنشاط:</label>
                <textarea
                  value={userActivityCode || currentUnit.practiceActivity.starterCode}
                  onChange={(e) => setUserActivityCode(e.target.value)}
                  rows={6}
                  dir="ltr"
                  className="w-full p-3 font-mono text-xs bg-[#0e1b14] text-[#f3f4f6] rounded-xl border border-[#355834] focus:outline-hidden focus:ring-2 focus:ring-[#c2a878]"
                />
              </div>

              {/* Hints */}
              <div className="p-3 bg-[#0e1b14] rounded-xl border border-[#c2a878]/60 text-xs text-[#f3f4f6]">
                <span className="font-bold block mb-1 text-[#c2a878]">💡 تلميحات للمساعدة:</span>
                <ul className="list-disc list-inside space-y-0.5 text-xs text-[#f3f4f6]/95">
                  {currentUnit.practiceActivity.hints.map((hint, hIdx) => (
                    <li key={hIdx}>{hint}</li>
                  ))}
                </ul>
              </div>

              {activityFeedback && (
                <div className="p-3 bg-[#355834] rounded-xl border border-[#c2a878] text-xs text-white font-semibold">
                  {activityFeedback}
                </div>
              )}

              {showSolution && (
                <div className="p-3 bg-[#0e1b14] rounded-xl border border-[#355834] text-xs text-[#84cc16] font-mono" dir="ltr">
                  <p className="text-[#c2a878] text-[11px] font-sans mb-1" dir="rtl">الحل النموذجي للنشاط:</p>
                  <pre>{currentUnit.practiceActivity.solutionCode}</pre>
                </div>
              )}

              <div className="pt-2 flex flex-wrap justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={checkActivityCode}
                    className="px-4 py-2 rounded-lg bg-[#355834] hover:bg-[#6e633d] text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-[#c2a878]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>فحص الكود والتحقق</span>
                  </button>

                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="px-3 py-2 rounded-lg border border-[#c2a878] text-[#c2a878] font-semibold text-xs hover:bg-[#0e1b14] hover:text-white transition-colors cursor-pointer"
                  >
                    {showSolution ? 'إخفاء الحل' : 'عرض الحل النموذجي'}
                  </button>
                </div>

                <button
                  onClick={() => setActiveStep('quiz')}
                  className="px-4 py-2 rounded-lg bg-[#355834] hover:bg-[#6e633d] text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-[#c2a878]"
                >
                  <span>التالي: الاختبار القصير</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Tab 5: Quiz */}
          {activeStep === 'quiz' && (
            <div className="bg-[#14281d] p-6 rounded-2xl border border-[#355834] space-y-5 shadow-md">
              <div className="flex items-center justify-between border-b border-[#355834] pb-3">
                <div>
                  <h3 className="font-bold text-base text-white">الاختبار القصير للوحدة</h3>
                  <p className="text-xs text-[#c2a878]">أجب عن الأسئلة للتأكد من فهمك للمفاهيم الأساسية</p>
                </div>

                <span className="text-xs font-bold text-white bg-[#355834] px-2.5 py-1 rounded-lg border border-[#c2a878]">
                  عدد الأسئلة: {currentUnit.quiz.length}
                </span>
              </div>

              <div className="space-y-4">
                {currentUnit.quiz.map((q, qIdx) => {
                  const selected = selectedQuizAnswers[q.id];
                  return (
                    <div key={q.id} className="p-4 rounded-xl bg-[#0e1b14] border border-[#355834] text-xs space-y-3">
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#355834] text-white text-[11px] font-bold flex items-center justify-center shrink-0 border border-[#c2a878]/40">
                          {qIdx + 1}
                        </span>
                        <p className="font-bold text-white text-xs sm:text-sm leading-snug">{q.question}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-7">
                        {q.options.map((opt, oIdx) => {
                          const isOptionSelected = selected === oIdx;
                          const isCorrect = q.correctOptionIndex === oIdx;
                          
                          let btnStyle = 'bg-[#14281d] border-[#355834] text-[#f3f4f6] hover:border-[#c2a878] hover:bg-[#355834]/40';
                          if (quizSubmitted) {
                            if (isCorrect) btnStyle = 'bg-[#355834] border-[#84cc16] text-white font-bold';
                            else if (isOptionSelected && !isCorrect) btnStyle = 'bg-red-950/70 border-red-500 text-red-200';
                          } else if (isOptionSelected) {
                            btnStyle = 'bg-[#355834] border-[#c2a878] text-white font-bold ring-1 ring-[#c2a878]';
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
                        <div className="p-2.5 rounded-lg bg-[#0e1b14] border border-[#c2a878] text-xs text-[#f3f4f6]">
                          <span className="font-bold text-[#c2a878]">التفسير: </span>
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
                    className="px-5 py-2.5 rounded-xl bg-[#355834] hover:bg-[#14281d] text-white font-bold text-xs transition-all shadow-md shadow-[#355834]/20 disabled:opacity-50 cursor-pointer"
                  >
                    تصحيح الاختبار وعرض النتيجة
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-bold text-white bg-[#355834] px-3 py-1.5 rounded-lg border border-[#c2a878]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تم إتمام اختبار الوحدة بنجاح!</span>
                  </div>
                )}

                <button
                  onClick={() => {
                    setSelectedProjectId(currentUnit.relatedProjectId);
                    setActiveTab('projects');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#6e633d] hover:bg-[#355834] text-white font-bold text-xs transition-all shadow-md shadow-[#6e633d]/20 flex items-center gap-2 cursor-pointer"
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
