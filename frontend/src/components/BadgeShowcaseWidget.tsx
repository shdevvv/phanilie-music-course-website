import React from 'react';
import type { UserBadgeDto } from '../services/badgeApi';

interface BadgeShowcaseWidgetProps {
  badges: UserBadgeDto[];
}

export const BadgeShowcaseWidget: React.FC<BadgeShowcaseWidgetProps> = ({ badges }) => {
  return (
    <div className="bg-white/80 backdrop-blur-md border border-[#dfa38f]/30 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-[#dfa38f]/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#dfa38f] to-[#ab7e66] text-white flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-xl">military_tech</span>
          </div>
          <div>
            <h3 className="font-display-sm text-lg font-bold text-[#4a372e]">Achievement Badges</h3>
            <p className="text-xs text-[#8b7368]">Track your milestone progress & unlocked rewards</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-[#dfa38f]/15 text-[#8a6858] text-[11px] font-bold">
          {badges.filter((b) => b.isUnlocked).length} / {badges.length} Unlocked
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.badgeId}
            className={`relative p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
              badge.isUnlocked
                ? 'bg-gradient-to-br from-white via-white to-[#ffe5db]/40 border-[#dfa38f]/50 shadow-md scale-[1.01]'
                : 'bg-gray-50/70 border-gray-200 opacity-80'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-3xl ${badge.isUnlocked ? 'grayscale-0' : 'grayscale opacity-60'}`}>
                  {badge.iconUrl}
                </span>
                {badge.isUnlocked ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold uppercase tracking-wider border border-emerald-200">
                    Unlocked
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 text-[9px] font-bold uppercase tracking-wider">
                    Locked
                  </span>
                )}
              </div>

              <div>
                <h4 className="font-bold text-xs text-[#4a372e]">{badge.name}</h4>
                <p className="text-[10px] text-[#8b7368] line-clamp-2 mt-0.5">{badge.description}</p>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-[#dfa38f]/10 space-y-1">
              <div className="flex justify-between text-[10px] text-[#8b7368] font-semibold">
                <span>Progress</span>
                <span>
                  {badge.currentValue} / {badge.targetValue}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#dfa38f] to-[#ab7e66] rounded-full transition-all duration-500"
                  style={{ width: `${badge.progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
