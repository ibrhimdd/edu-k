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
    <div className="bg-[#14281d] rounded-xl border border-[#355834] overflow-hidden shadow-xs">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#14281d] to-[#14281d] text-white p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#355834]/40 border border-[#6e633d] text-[#c2a878]">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base">بطاقة تقييم المنتجات البرمجية (Rubric)</h3>
            <p className="text-xs text-[#c2a878]">معايير التقييم الأكاديمية الشاملة لمنتجات المشروعات الإلكترونية</p>
          </div>
        </div>

        {totalScore !== undefined && (
          <div className="flex items-center gap-2 bg-[#14281d]/60 border border-[#355834] px-3.5 py-1.5 rounded-xl">
            <Star className="w-4 h-4 text-[#E6B34A] fill-[#E6B34A]" />
            <span className="text-xs text-[#c2a878]">الدرجة الكلية:</span>
            <span className="text-base font-extrabold text-[#F5DE98]">{totalScore} / 100</span>
          </div>
        )}
      </div>

      {/* Criteria Table / List */}
      <div className="divide-y divide-[#F0F2F0]">
        {(criteria || []).map((criterion, idx) => {
          const currentScore = selectedScores[criterion.id] || 0;
          return (
            <div key={criterion.id} className="p-4 sm:p-5 hover:bg-[#0e1b14]/80 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#355834] text-white text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <h4 className="font-bold text-white text-sm">{criterion.title}</h4>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#F0F4F1] text-[#355834]/80 font-semibold border border-[#355834]">
                    الوزن: {criterion.weight}%
                  </span>
                </div>

                {currentScore > 0 && (
                  <span className="text-xs font-bold text-white bg-[#355834] px-2.5 py-1 rounded-lg border border-[#c2a878]">
                    الدرجة المرصودة: {currentScore} من 4
                  </span>
                )}
              </div>

              <p className="text-xs text-[#c2a878] mb-3 leading-relaxed">{criterion.description}</p>

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
                          ? 'bg-[#355834] border-[#355834] ring-2 ring-[#355834]/20 shadow-xs'
                          : 'bg-[#14281d] border-[#355834] hover:border-[#c2a878]'
                      } ${isEditable ? 'cursor-pointer hover:bg-[#355834]' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`font-bold ${isSelected ? 'text-[#14281d]' : 'text-white'}`}>
                          {lvl.label}
                        </span>
                        {isSelected && <CheckCircle className="w-4 h-4 text-[#355834]" />}
                      </div>
                      <p className="text-[11px] text-[#355834]/80 leading-normal">{lvl.description}</p>
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
