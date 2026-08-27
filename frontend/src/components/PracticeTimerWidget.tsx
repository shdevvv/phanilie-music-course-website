import React from 'react';
import { usePracticeTimer } from '../hooks/usePracticeTimer';

interface PracticeTimerWidgetProps {
  onSaveSession: (minutes: number) => void;
}

export const PracticeTimerWidget: React.FC<PracticeTimerWidgetProps> = ({ onSaveSession }) => {
  const { formattedTime, isRunning, minutes, startTimer, pauseTimer, resetTimer } = usePracticeTimer();

  return (
    <div className="bg-white/80 backdrop-blur-md border border-[#dfa38f]/30 rounded-2xl p-6 shadow-xl space-y-4 text-center">
      <div className="space-y-1">
        <span className="inline-block px-3 py-1 rounded-full bg-[#dfa38f]/15 text-[#8a6858] text-[10px] font-bold uppercase tracking-wider border border-[#dfa38f]/20">
          Live Practice Timer
        </span>
        <h3 className="font-display-sm text-lg font-bold text-[#4a372e]">Stopwatch Session</h3>
      </div>

      <div className="py-4 bg-gradient-to-br from-[#ffe5db]/40 to-[#dfa38f]/10 rounded-2xl border border-[#dfa38f]/20">
        <span className="font-mono text-4xl md:text-5xl font-bold text-[#4a372e] tracking-wider">
          {formattedTime}
        </span>
      </div>

      <div className="flex items-center justify-center gap-3">
        {!isRunning ? (
          <button
            type="button"
            onClick={startTimer}
            style={{ backgroundImage: 'linear-gradient(135deg, #dfa38f 0%, #ab7e66 100%)' }}
            className="px-6 py-2.5 rounded-xl text-white text-xs font-bold uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-lg">play_arrow</span>
            Start
          </button>
        ) : (
          <button
            type="button"
            onClick={pauseTimer}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-lg">pause</span>
            Pause
          </button>
        )}

        <button
          type="button"
          onClick={resetTimer}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-[#6a564d] text-xs font-bold border border-[#dfa38f]/30 transition-all cursor-pointer"
        >
          Reset
        </button>

        <button
          type="button"
          onClick={() => onSaveSession(minutes)}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-lg">check_circle</span>
          Save Log
        </button>
      </div>
    </div>
  );
};
