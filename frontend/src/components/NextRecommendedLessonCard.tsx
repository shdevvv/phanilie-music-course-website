import React from 'react';
import type { RecommendedLessonDto } from '../services/dashboardApi';

interface NextRecommendedLessonCardProps {
  recommendedLesson: RecommendedLessonDto;
  onNavigate: (view: 'home' | 'dashboard' | 'library' | 'courses' | 'sessions' | 'forums') => void;
}

export const NextRecommendedLessonCard: React.FC<NextRecommendedLessonCardProps> = ({ recommendedLesson, onNavigate }) => {
  return (
    <div className="bg-gradient-to-br from-white via-white to-[#ffe5db]/50 border border-[#dfa38f]/40 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <span className="px-3 py-1 rounded-full bg-[#dfa38f]/20 text-[#854d38] text-[10px] font-extrabold uppercase tracking-wider border border-[#dfa38f]/30">
          🎯 Next Recommended Lesson
        </span>
        <span className="text-xs text-[#8b7368] font-bold">
          Level {recommendedLesson.levelNumber} &bull; {recommendedLesson.durationMinutes} Mins
        </span>
      </div>

      <div className="space-y-1">
        <h3 className="font-display-sm text-xl font-bold text-[#4a372e]">{recommendedLesson.lessonTitle}</h3>
        <p className="text-xs text-[#8b7368] font-medium">{recommendedLesson.topicTitle}</p>
      </div>

      <button
        type="button"
        onClick={() => onNavigate('courses')}
        style={{ backgroundImage: 'linear-gradient(135deg, #dfa38f 0%, #ab7e66 100%)' }}
        className="w-full py-3 rounded-xl text-white text-xs font-bold uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-lg">play_circle</span>
        Resume Pathway Learning
      </button>
    </div>
  );
};
