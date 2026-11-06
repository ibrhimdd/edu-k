// components/student/EngagementScaleView.tsx
import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ENGAGEMENT_SCALE_METADATA, 
  ENGAGEMENT_DIMENSIONS, 
  ENGAGEMENT_ITEMS, 
  LIKERT_OPTIONS, 
  calculateEngagementDimensionScores,
  EngagementQuestionItem
} from '../../data/engagementScaleData';
import { 
  FileCheck2, 
  BrainCircuit, 
  Activity, 
  HeartHandshake, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Award, 
  Printer, 
  Download, 
  Scale, 
  HelpCircle, 
  Check, 
  RefreshCw, 
  ChevronRight, 
  ChevronLeft, 
  Send, 
  FileSpreadsheet, 
  GraduationCap, 
  CheckSquare2, 
  ShieldCheck,
  BarChart3,
  BookmarkCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface EngagementScaleViewProps {
  onBackToDashboard?: () => void;
  asRefereeMode?: boolean;
}

export const EngagementScaleView: React.FC<EngagementScaleViewProps> = ({ 
  onBackToDashboard,
  asRefereeMode = false 
}) => {
  const { currentUser, saveEngagementSurvey } = useApp();

  // Mode: Student answering vs. Academic Referee / Jury Review
  const [viewMode, setViewMode] = useState<'student' | 'referee'>(asRefereeMode ? 'referee' : 'student');
  const [selectedDimensionFilter, setSelectedDimensionFilter] = useState<'all' | 'cognitive' | 'behavioral' | 'emotional' | 'social'>('all');
  
  // Search or filter by keyword
  const [searchFilter, setSearchFilter] = useState('');

  // Initial student responses from currentUser if already saved
  const [responses, setResponses] = useState<Record<string, number>>(() => {
    if (currentUser.engagementScore?.itemResponses) {
      return currentUser.engagementScore.itemResponses;
    }
    // Default mock response so users see an interactive ready state
    const initial: Record<string, number> = {};
    ENGAGEMENT_ITEMS.forEach((item, index) => {
      // Default to 4 or 5 for demonstration
      initial[item.id] = (index % 3 === 0) ? 5 : 4;
    });
    return initial;
  });

  // Referee evaluation state (الصياغة اللغوية والدقة العلمية والملاحظات)
  const [refereeData, setRefereeData] = useState<Record<string, { wording: 'appropriate' | 'inappropriate'; accuracy: 'accurate' | 'inaccurate'; notes: string }>>(() => {
    const init: Record<string, { wording: 'appropriate' | 'inappropriate'; accuracy: 'accurate' | 'inaccurate'; notes: string }> = {};
    ENGAGEMENT_ITEMS.forEach(item => {
      init[item.id] = {
        wording: 'appropriate',
        accuracy: 'accurate',
        notes: ''
      };
    });
    return init;
  });

  const [refereeName, setRefereeName] = useState('أ.د. محكّم أكاديمي / خبير مناهج وطرق تدريس');
  const [refereeAffiliation, setRefereeAffiliation] = useState('كلية التربية - قسم تكنولوجيا التعليم');

  const [isSaved, setIsSaved] = useState<boolean>(Boolean(currentUser.engagementScore?.submittedAt));
  const [saveToast, setSaveToast] = useState(false);

  // Filtered items
  const filteredItems = useMemo(() => {
    return ENGAGEMENT_ITEMS.filter(item => {
      const matchDim = selectedDimensionFilter === 'all' || item.dimensionId === selectedDimensionFilter;
      const matchQuery = !searchFilter.trim() || 
        item.text.toLowerCase().includes(searchFilter.toLowerCase()) || 
        item.number.toString() === searchFilter.trim();
      return matchDim && matchQuery;
    });
  }, [selectedDimensionFilter, searchFilter]);

  // Scores calculation
  const scoreStats = useMemo(() => {
    return calculateEngagementDimensionScores(responses);
  }, [responses]);

  const handleSelectOption = (itemId: string, value: number) => {
    setResponses(prev => ({
      ...prev,
      [itemId]: value
    }));
  };

  const handleQuickFill = (type: 'high' | 'balanced' | 'random') => {
    const newResponses: Record<string, number> = {};
    ENGAGEMENT_ITEMS.forEach((item, idx) => {
      if (type === 'high') {
        newResponses[item.id] = idx % 4 === 0 ? 4 : 5;
      } else if (type === 'balanced') {
        newResponses[item.id] = [4, 5, 4, 3, 5][idx % 5];
      } else {
        const vals = [3, 4, 5, 4, 5, 4];
        newResponses[item.id] = vals[idx % vals.length];
      }
    });
    setResponses(newResponses);
  };

  const handleSaveScale = () => {
    const calculated = calculateEngagementDimensionScores(responses);
    saveEngagementSurvey({
      cognitive: calculated.dimensions.cognitive.percentage,
      behavioral: calculated.dimensions.behavioral.percentage,
      emotional: calculated.dimensions.emotional.percentage,
      social: calculated.dimensions.social.percentage,
      totalScore: calculated.rawTotal,
      percentage: calculated.totalPercentage,
      level: calculated.level,
      completedItemsCount: calculated.totalAnswered,
      itemResponses: responses,
      submittedAt: new Date().toISOString()
    });

    setIsSaved(true);
    setSaveToast(true);
    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.6 }
    });
    setTimeout(() => setSaveToast(false), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  const answeredCount = Object.keys(responses).length;
  const progressPct = Math.round((answeredCount / ENGAGEMENT_SCALE_METADATA.totalItems) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      
      {/* Top Academic Research Banner */}
      <div className="bg-gradient-to-r from-[#006D77] via-[#006D77] to-[#006D77] text-white p-6 sm:p-8 rounded-3xl border border-[#83C5BE] shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1 rounded-full bg-[#91472F]/35 text-white border border-[#91472F]/50 font-bold flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-[#E29578]" />
                أداة قياس بحثية معتمدة
              </span>
              <span className="text-xs text-[#E29578]">منظومة القياس والتقويم الأكاديمي</span>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center bg-white p-1 rounded-2xl border border-[#83C5BE] text-xs">
              <button
                type="button"
                onClick={() => setViewMode('student')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'student' ? 'bg-[#006D77] text-white shadow-xs' : 'text-[#E29578] hover:text-white'
                }`}
              >
                <CheckSquare2 className="w-3.5 h-3.5" />
                <span>استجابة الطالب (ليكرت 1-5)</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('referee')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'referee' ? 'bg-[#91472F] text-white shadow-xs' : 'text-[#E29578] hover:text-white'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>تحكيم المقياس (للخبراء)</span>
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {ENGAGEMENT_SCALE_METADATA.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#E29578] max-w-3xl leading-relaxed">
              {ENGAGEMENT_SCALE_METADATA.subtitle}
            </p>
          </div>

          {/* Academic Attribution Tags */}
          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs border-t border-[#83C5BE]">
            <div className="flex items-center gap-2 text-[#E29578]">
              <span className="w-2 h-2 rounded-full bg-[#E29578]"></span>
              <strong>{ENGAGEMENT_SCALE_METADATA.researcher}</strong>
            </div>
            <div className="flex items-center gap-2 text-[#E29578]">
              <span className="w-2 h-2 rounded-full bg-[#E29578]/60"></span>
              <span>{ENGAGEMENT_SCALE_METADATA.supervisor}</span>
            </div>
            <div className="flex items-center gap-2 text-[#E29578]">
              <span className="w-2 h-2 rounded-full bg-[#84cc16]"></span>
              <span>تطوير وبرمجة: <strong>إبراهيم الخولي</strong> (جميع الحقوق محفوظة)</span>
            </div>
            <div className="flex items-center gap-2 text-[#E29578] mr-auto">
              <span>إجمالي العبارات: <strong>56 عبارة موزعة على 4 أبعاد</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Instructions Card */}
      <div className="bg-white p-6 rounded-3xl border border-[#83C5BE] text-[#006D77] shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#83C5BE] pb-3">
          <div className="flex items-center gap-2 text-[#004D54]">
            <HelpCircle className="w-5 h-5 text-[#E29578]" />
            <h2 className="font-extrabold text-sm sm:text-base">تعليمات المقياس للطلاب</h2>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#006D77] text-white border border-[#E29578]/50">
            {ENGAGEMENT_SCALE_METADATA.targetAudience}
          </span>
        </div>

        <ul className="text-xs text-[#006D77] space-y-2 leading-relaxed list-disc list-inside">
          {ENGAGEMENT_SCALE_METADATA.instructions.map((inst, i) => (
            <li key={i} className="text-[#1F2937]">{inst}</li>
          ))}
        </ul>

        {/* 4 Dimensions Quick Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-[#83C5BE]">
          {ENGAGEMENT_DIMENSIONS.map((dim) => {
            const dimScore = scoreStats.dimensions[dim.id];
            return (
              <div 
                key={dim.id}
                onClick={() => setSelectedDimensionFilter(dim.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer bg-[#EDF6F9] ${
                  selectedDimensionFilter === dim.id
                    ? 'border-[#E29578]/50 ring-2 ring-[#83C5BE] shadow-xs'
                    : 'border-[#83C5BE] hover:border-[#E29578]/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-extrabold text-[#004D54]">{dim.title.split(':')[1] || dim.title}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#E29578] border border-[#83C5BE] shadow-2xs">
                    14 عبارة
                  </span>
                </div>
                <p className="text-[10px] text-[#64748B] line-clamp-2 leading-tight mb-2">
                  {dim.description}
                </p>
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-[#64748B]">النسبة المحققة:</span>
                  <span className="text-[#004D54] font-black">{dimScore.percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Control Bar: Filter Tabs & Quick Actions */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#83C5BE] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Dimension Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs font-bold scrollbar-none">
          <button
            onClick={() => setSelectedDimensionFilter('all')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              selectedDimensionFilter === 'all'
                ? 'bg-[#006D77] text-white shadow-xs border border-[#E29578]/50'
                : 'text-[#E29578] hover:bg-[#006D77] hover:text-white'
            }`}
          >
            جميع الأبعاد (56)
          </button>
          {ENGAGEMENT_DIMENSIONS.map(d => (
            <button
              key={d.id}
              onClick={() => setSelectedDimensionFilter(d.id)}
              className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                selectedDimensionFilter === d.id
                  ? 'bg-[#006D77] text-white shadow-xs border border-[#E29578]/50'
                  : 'text-[#E29578] hover:bg-[#006D77] hover:text-white'
              }`}
            >
              <span>{d.title.split(':')[1] || d.title}</span>
              <span className="text-[10px] opacity-75">({d.itemCount})</span>
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 justify-end">
          {viewMode === 'student' && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickFill('balanced')}
                className="px-3 py-1.5 rounded-xl border border-[#E29578]/50 text-[11px] font-bold text-[#E29578] hover:bg-[#006D77] hover:text-white transition-colors cursor-pointer"
                title="تعبئة نموذجية سريعة للمعاينة"
              >
                تعبئة نموذجية
              </button>
              <button
                type="button"
                onClick={handleSaveScale}
                className="px-4 py-1.5 rounded-xl bg-[#006D77] hover:bg-white text-[#006D77] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer border border-[#E29578]/50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>حفظ واعتماد</span>
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handlePrint}
            className="p-2 rounded-xl border border-[#83C5BE] text-[#E29578] hover:bg-[#EDF6F9] hover:text-[#006D77] transition-colors cursor-pointer"
            title="طباعة الاستمارة"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress & Live Scores Banner */}
      <div className="bg-[#006D77] p-4 rounded-2xl border border-[#E29578]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white">تقدم الإجابة على المقياس:</span>
            <span className="font-bold text-[#E29578]">{answeredCount} من {ENGAGEMENT_SCALE_METADATA.totalItems} عبارة ({progressPct}%)</span>
          </div>
          <div className="w-full sm:w-64 bg-[#EDF6F9] h-2 rounded-full overflow-hidden border border-[#E29578]/50/30">
            <div 
              className="bg-[#E29578] h-full transition-all duration-500 rounded-full" 
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-center px-3 py-1 bg-[#EDF6F9] rounded-xl border border-[#83C5BE]">
            <span className="text-[10px] text-[#64748B] block font-bold">الدرجة الكلية</span>
            <strong className="text-sm font-black text-[#004D54]">{scoreStats.rawTotal} / 280</strong>
          </div>
          <div className="text-center px-3 py-1 bg-[#EDF6F9] rounded-xl border border-[#83C5BE]">
            <span className="text-[10px] text-[#64748B] block font-bold">النسبة المئوية</span>
            <strong className="text-sm font-black text-[#004D54]">{scoreStats.totalPercentage}%</strong>
          </div>
          <div className="text-center px-3 py-1 bg-[#EDF6F9] rounded-xl border border-[#83C5BE]">
            <span className="text-[10px] text-[#64748B] block font-bold">مستوى الانخراط</span>
            <strong className="text-xs font-black text-[#004D54]">{scoreStats.level}</strong>
          </div>
        </div>
      </div>

      {/* Referee Info Banner (if in referee mode) */}
      {viewMode === 'referee' && (
        <div className="bg-[#EDF6F9] p-4 sm:p-5 rounded-2xl border border-[#83C5BE] space-y-3 text-xs animate-in fade-in">
          <div className="flex items-center gap-2 text-[#91472F] font-bold">
            <GraduationCap className="w-4 h-4 text-[#91472F]" />
            <span>استمارة تحكيم المقياس بواسطة السادة الخبراء والمحكمين الأكاديميين</span>
          </div>
          <p className="text-[#91472F] leading-relaxed">
            يُرجى إبداء رأيكم الأكاديمي الموقر في مدى مناسبة الصياغة اللغوية والدقة العلمية لكل عبارة في قياس بُعد الانخراط المخصص لها، وتدوين أية مقترحات للتعديل أو الحذف أو الإضافة.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <input
              type="text"
              value={refereeName}
              onChange={(e) => setRefereeName(e.target.value)}
              placeholder="اسم المحكّم والدرجة العلمية"
              className="p-2.5 rounded-xl border border-[#83C5BE] bg-white text-xs font-bold"
            />
            <input
              type="text"
              value={refereeAffiliation}
              onChange={(e) => setRefereeAffiliation(e.target.value)}
              placeholder="الجامعة والكلية والقسم العلمي"
              className="p-2.5 rounded-xl border border-[#83C5BE] bg-white text-xs"
            />
          </div>
        </div>
      )}

      {/* Main Table / Cards List of 56 Questions */}
      <div className="bg-white rounded-3xl border border-[#83C5BE] shadow-md overflow-hidden">
        
        {/* Header Row */}
        <div className="bg-[#EDF6F9] px-6 py-4 border-b border-[#83C5BE] flex items-center justify-between text-xs font-bold text-[#E29578]">
          <div className="flex items-center gap-4">
            <span className="w-8 text-center">م</span>
            <span>العبارة البرمجية المستهدفة</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {viewMode === 'student' ? (
              <div className="flex items-center gap-4 text-center">
                <span className="w-16">موافق بشدة (5)</span>
                <span className="w-14">موافق (4)</span>
                <span className="w-14">محايد (3)</span>
                <span className="w-14">معارض (2)</span>
                <span className="w-16">معارض بشدة (1)</span>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <span>الصياغة اللغوية</span>
                <span>الدقة العلمية</span>
                <span className="w-36">الملاحظات والمقترحات</span>
              </div>
            )}
          </div>
        </div>

        {/* Question Items */}
        <div className="divide-y divide-[#004D54]">
          {filteredItems.map((item) => {
            const currentVal = responses[item.id] || 0;
            const refItem = refereeData[item.id] || { wording: 'appropriate', accuracy: 'accurate', notes: '' };

            return (
              <div 
                key={item.id} 
                className="p-4 sm:px-6 bg-white hover:bg-[#EDF6F9] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                {/* Item Number and Text */}
                <div className="flex items-start gap-3.5 flex-1 max-w-3xl">
                  <span className="w-7 h-7 rounded-xl bg-[#006D77] text-white font-black flex items-center justify-center shrink-0 mt-0.5 text-xs border border-[#E29578]/50/30">
                    {item.number}
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#006D77] text-white border border-[#E29578]/50/30">
                        {item.dimensionTitle.split(':')[1] || item.dimensionTitle}
                      </span>
                      {item.keywords && (
                        <span className="text-[10px] text-[#E29578]">
                          • {item.keywords}
                        </span>
                      )}
                    </div>
                    <p className="text-[#1F2937] font-bold leading-relaxed text-xs sm:text-sm">
                      {item.text}
                    </p>
                  </div>
                </div>

                {/* Response Controls (Student Mode: 5 Likert Buttons) */}
                {viewMode === 'student' ? (
                  <div className="flex items-center justify-between md:justify-end gap-1.5 sm:gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#83C5BE]">
                    {LIKERT_OPTIONS.map((opt) => {
                      const isSelected = currentVal === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleSelectOption(item.id, opt.value)}
                          className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer border ${
                            isSelected
                              ? `${opt.color} shadow-xs border-transparent scale-105`
                              : 'bg-[#EDF6F9] text-[#006D77] border-[#83C5BE] hover:bg-[#006D77] hover:text-white'
                          }`}
                          title={`${opt.label} (${opt.value})`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                          <span className="hidden lg:inline">{opt.label}</span>
                          <span className="lg:hidden">{opt.value}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  /* Referee Mode: Language, Scientific Accuracy, Notes */
                  <div className="flex flex-wrap items-center gap-3 shrink-0 pt-2 md:pt-0">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setRefereeData(prev => ({
                          ...prev,
                          [item.id]: { ...refItem, wording: 'appropriate' }
                        }))}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer border ${
                          refItem.wording === 'appropriate' ? 'bg-[#006D77] text-white border-[#83C5BE]' : 'bg-[#EDF6F9] text-[#E29578] border-[#83C5BE]'
                        }`}
                      >
                        صياغة مناسبة
                      </button>
                      <button
                        type="button"
                        onClick={() => setRefereeData(prev => ({
                          ...prev,
                          [item.id]: { ...refItem, wording: 'inappropriate' }
                        }))}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer border ${
                          refItem.wording === 'inappropriate' ? 'bg-[#9C382A] text-white border-[#9C382A]' : 'bg-[#EDF6F9] text-[#E29578] border-[#83C5BE]'
                        }`}
                      >
                        غير مناسبة
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setRefereeData(prev => ({
                          ...prev,
                          [item.id]: { ...refItem, accuracy: 'accurate' }
                        }))}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer border ${
                          refItem.accuracy === 'accurate' ? 'bg-[#006D77] text-white border-[#83C5BE]' : 'bg-[#EDF6F9] text-[#E29578] border-[#83C5BE]'
                        }`}
                      >
                        دقيقة علمياً
                      </button>
                      <button
                        type="button"
                        onClick={() => setRefereeData(prev => ({
                          ...prev,
                          [item.id]: { ...refItem, accuracy: 'inaccurate' }
                        }))}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer border ${
                          refItem.accuracy === 'inaccurate' ? 'bg-[#9C382A] text-white border-[#9C382A]' : 'bg-[#EDF6F9] text-[#E29578] border-[#83C5BE]'
                        }`}
                      >
                        غير دقيقة
                      </button>
                    </div>

                    <input
                      type="text"
                      value={refItem.notes}
                      onChange={(e) => {
                        const val = e.target.value;
                        setRefereeData(prev => ({
                          ...prev,
                          [item.id]: { ...refItem, notes: val }
                        }));
                      }}
                      placeholder="ملاحظات المحكّم..."
                      className="w-36 p-1.5 rounded-lg border border-[#83C5BE] bg-[#EDF6F9] text-[11px]"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Completion & Submission Action Banner */}
      <div className="bg-white p-6 rounded-3xl border border-[#83C5BE] text-[#006D77] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-[#004D54] flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-[#E29578]" />
            <span>اعتماد وحفظ استجابة مقياس الانخراط في تعلم البرمجة</span>
          </h3>
          <p className="text-xs text-[#64748B]">
            تُحفظ الاستجابات تلقائياً في السجل الأكاديمي لحسابك وتدخل في التحليلات الإحصائية للمقرر (SPSS).
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onBackToDashboard && (
            <button
              type="button"
              onClick={onBackToDashboard}
              className="px-4 py-2.5 rounded-2xl border border-[#83C5BE] text-xs font-bold text-[#E29578] hover:bg-[#EDF6F9] hover:text-[#006D77] transition-colors cursor-pointer"
            >
              العودة للوحة التعليمية
            </button>
          )}

          <button
            type="button"
            onClick={handleSaveScale}
            className="px-6 py-2.5 rounded-2xl bg-[#006D77] hover:bg-white text-[#006D77] text-xs font-black transition-all shadow-md shadow-[#004D54]/20 flex items-center gap-2 cursor-pointer border border-[#E29578]/50"
          >
            <CheckCircle2 className="w-4 h-4 text-[#E29578]" />
            <span>حفظ واعتماد المقياس نهائياً</span>
          </button>
        </div>
      </div>

      {/* Save Success Toast */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-white text-[#006D77] text-xs font-bold py-3 px-5 rounded-2xl shadow-2xl border border-[#83C5BE] flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="font-extrabold">تم حفظ واعتماد استجابتك لمقياس الانخراط بنجاح!</p>
            <p className="text-[10px] text-[#E29578]">الدرجة الكلية: {scoreStats.rawTotal} من 280 ({scoreStats.totalPercentage}%) • المستوى: {scoreStats.level}</p>
          </div>
        </div>
      )}

    </div>
  );
};
