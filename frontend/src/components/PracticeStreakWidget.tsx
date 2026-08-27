import React from 'react';
import type { PracticeStreakDto } from '../services/practiceLogApi';

interface PracticeStreakWidgetProps {
  streak: PracticeStreakDto;
}

export const PracticeStreakWidget: React.FC<PracticeStreakWidgetProps> = ({ streak }) => {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white/80 backdrop-blur-md border border-[#dfa38f]/30 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-rose-500 text-white flex items-center justify-center text-2xl shadow-md animate-bounce">
            🔥
          </div>
          <div>
            <h3 className="font-display-sm text-xl font-bold text-[#4a372e]">
              {streak.currentStreakDays}-Day Streak!
            </h3>
            <p className="text-xs text-[#8b7368]">
              Personal Best: <span className="font-semibold text-[#6a564d]">{streak.longestStreakDays} Days</span>
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-[#8b7368] font-medium">Total Time</span>
          <p className="font-bold text-lg text-[#4a372e]">{streak.totalPracticeMinutes} Mins</p>
        </div>
      </div>

      {/* Sun - Sat Day Breakdown */}
      <div className="pt-3 border-t border-[#dfa38f]/20">
        <div className="grid grid-cols-7 gap-2 text-center">
          {dayNames.map((name, index) => {
            const isCompleted = streak.weeklyDays[index];

            return (
              <div key={name} className="space-y-1">
                <span className="text-[10px] font-bold text-[#8b7368] uppercase">{name}</span>
                <div
                  className={`w-9 h-9 rounded-xl mx-auto flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                    isCompleted
                      ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-emerald-200'
                      : 'bg-gray-100 text-gray-400 border border-gray-200'
                  }`}
                >
                  {isCompleted ? '✓' : '•'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
