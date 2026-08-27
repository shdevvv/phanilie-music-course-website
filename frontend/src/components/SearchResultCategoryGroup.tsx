import React from 'react';
import type { SearchResultItem } from '../services/searchApi';

interface SearchResultCategoryGroupProps {
  title: string;
  icon: string;
  items: SearchResultItem[];
  selectedIndex: number;
  globalStartIndex: number;
  onSelectItem: (item: SearchResultItem) => void;
}

export const SearchResultCategoryGroup: React.FC<SearchResultCategoryGroupProps> = ({
  title,
  icon,
  items,
  selectedIndex,
  globalStartIndex,
  onSelectItem,
}) => {
  if (items.length === 0) return null;

  return (
    <div className="space-y-1 py-1">
      <div className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#ab7e66]/90">
        <span className="material-symbols-outlined text-xs">{icon}</span>
        <span>{title} ({items.length})</span>
      </div>
      <div className="space-y-0.5">
        {items.map((item, idx) => {
          const itemGlobalIndex = globalStartIndex + idx;
          const isSelected = selectedIndex === itemGlobalIndex;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectItem(item)}
              className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-[#dfa38f]/20 border border-[#dfa38f]/40 shadow-sm'
                  : 'hover:bg-[#dfa38f]/10 border border-transparent'
              }`}
            >
              <img
                src={item.thumbnailUrl}
                alt={item.title}
                className="w-10 h-10 rounded-lg object-cover border border-[#dfa38f]/20 shrink-0 bg-white/50"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/pianogrand.jpg';
                }}
              />
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-semibold text-[#4a372e] truncate">{item.title}</h4>
                </div>
                <p className="text-[10px] text-[#8b7368] truncate">{item.subtitle}</p>
              </div>
              <div className="text-right shrink-0 flex flex-col items-end gap-0.5">
                <span className="inline-block px-2 py-0.5 rounded-full bg-[#dfa38f]/15 text-[#8a6858] text-[9px] font-bold tracking-wide border border-[#dfa38f]/20">
                  {item.badgeText}
                </span>
                {item.priceOrDuration && (
                  <span className="text-[10px] font-bold text-[#5a4740]">
                    {item.priceOrDuration}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
