import React from 'react';
import type { UserBadgeDto } from '../services/badgeApi';

interface BadgeCelebrationModalProps {
  badge: UserBadgeDto | null;
  onClose: () => void;
}

export const BadgeCelebrationModal: React.FC<BadgeCelebrationModalProps> = ({ badge, onClose }) => {
  if (!badge) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-gradient-to-br from-[#ffe5db] via-[#fff8f6] to-[#ffd89b]/40 border-2 border-[#dfa38f] rounded-3xl p-8 shadow-2xl text-center space-y-6">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-300 via-rose-400 to-[#dfa38f] text-white flex items-center justify-center text-5xl mx-auto shadow-2xl animate-bounce">
          {badge.iconUrl || '🏆'}
        </div>

        <div className="space-y-2">
          <span className="px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase tracking-widest border border-amber-200 shadow-xs">
            🎉 Badge Unlocked!
          </span>
          <h2 className="font-display-lg text-2xl font-bold text-[#4a372e]">{badge.name}</h2>
          <p className="text-xs text-[#8b7368] leading-relaxed max-w-xs mx-auto">{badge.description}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{ backgroundImage: 'linear-gradient(135deg, #dfa38f 0%, #ab7e66 100%)' }}
          className="w-full py-3.5 rounded-xl text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
        >
          Awesome! Continue Learning
        </button>
      </div>
    </div>
  );
};
