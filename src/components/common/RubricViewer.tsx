// components/common/RubricViewer.tsx
import React from 'react';
import { RubricCriterion } from '../../types/schema';
import { Award, CheckCircle, Info, Star } from 'lucide-react';

interface RubricViewerProps {
  criteria: RubricCriterion[];
  selectedScores?: Record<string, number>;
  onScoreSelect?: (criterionId: string, score: number) => void;
  isEditable?: boolean;
  totalScore?: number;
}

export const RubricViewer: React.FC<RubricViewerProps> = ({
  criteria,
  selectedScores = {},
  onScoreSelect,
  isEditable = false,
  totalScore
}) => {
  return (
    <div className="bg-white rounded-xl border border-[#83C5BE] overflow-hidden shadow-xs">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#006D77] to-[#006D77] text-white p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#006D77]/40 border border-[#83C5BE] text-[#E29578]">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base">بطاقة تقييم المنتجات البرمجية (Rubric)</h3>
            <p className="text-xs text-[#E29578]">معايير التقييم الأكاديمية الشاملة لمنتجات المشروعات الإلكترونية</p>
          </div>
        </div>

        {totalScore !== undefined && (
          <div className="flex items-center gap-2 bg-white/60 border border-[#83C5BE] px-3.5 py-1.5 rounded-xl">
            <Star className="w-4 h-4 text-[#E29578] fill-[#E29578]" />
            <span className="text-xs text-[#E29578]">الدرجة الكلية:</span>
            <span className="text-base font-extrabold text-[#E29578]">{totalScore} / 100</span>
          </div>
        )}
      </div>

      {/* Criteria Table / List */}
      <div className="divide-y divide-[#EDF6F9]">
        {(criteria || []).map((criterion, idx) => {
          const currentScore = selectedScores[criterion.id] || 0;
          return (
            <div key={criterion.id} className="p-4 sm:p-5 hover:bg-[#EDF6F9]/80 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#006D77] text-white text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <h4 className="font-bold text-white text-sm">{criterion.title}</h4>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#EDF6F9] text-[#006D77]/80 font-semibold border border-[#83C5BE]">
                    الوزن: {criterion.weight}%
                  </span>
                </div>

                {currentScore > 0 && (
                  <span className="text-xs font-bold text-white bg-[#006D77] px-2.5 py-1 rounded-lg border border-[#E29578]/50">
                    الدرجة المرصودة: {currentScore} من 4
                  </span>
                )}
              </div>

              <p className="text-xs text-[#E29578] mb-3 leading-relaxed">{criterion.description}</p>

              {/* Levels Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {(criterion.levels || []).map(lvl => {
                  const isSelected = currentScore === lvl.score;
                  return (
                    <div
                      key={lvl.score}
                      onClick={() => isEditable && onScoreSelect && onScoreSelect(criterion.id, lvl.score)}
                      className={`p-3 rounded-lg border text-xs transition-all ${
                        isSelected
                          ? 'bg-[#006D77] border-[#83C5BE] ring-2 ring-[#004D54]/20 shadow-xs'
                          : 'bg-white border-[#83C5BE] hover:border-[#E29578]/50'
                      } ${isEditable ? 'cursor-pointer hover:bg-[#006D77]' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`font-bold ${isSelected ? 'text-white' : 'text-white'}`}>
                          {lvl.label}
                        </span>
                        {isSelected && <CheckCircle className="w-4 h-4 text-[#006D77]" />}
                      </div>
                      <p className="text-[11px] text-[#006D77]/80 leading-normal">{lvl.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
