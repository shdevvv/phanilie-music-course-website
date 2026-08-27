import React from 'react';
import type { SearchResponse, SearchResultItem } from '../services/searchApi';
import { SearchResultCategoryGroup } from './SearchResultCategoryGroup';

interface SearchDropdownOverlayProps {
  query: string;
  isLoading: boolean;
  results: SearchResponse | null;
  selectedIndex: number;
  recentSearches: string[];
  onSelectRecentSearch: (term: string) => void;
  onClearRecentSearches: () => void;
  onSelectItem: (item: SearchResultItem) => void;
  onSelectCategorySuggestion: (category: string) => void;
}

export const SearchDropdownOverlay: React.FC<SearchDropdownOverlayProps> = ({
  query,
  isLoading,
  results,
  selectedIndex,
  recentSearches,
  onSelectRecentSearch,
  onClearRecentSearches,
  onSelectItem,
  onSelectCategorySuggestion,
}) => {
  const trimmedQuery = query.trim();
  const isQueryTooShort = trimmedQuery.length < 2;

  // Compute total items for keyboard index mapping
  const lessons = results?.lessons || [];
  const covers = results?.covers || [];
  const sheetMusic = results?.sheetMusic || [];
  const totalCount = lessons.length + covers.length + sheetMusic.length;

  const popularCategories = [
    { label: 'Gospel Chords', icon: 'music_note' },
    { label: 'Beethoven Arrangements', icon: 'library_music' },
    { label: 'Jazz Piano Re-Harmonization', icon: 'piano' },
    { label: 'Beginner Sheet Music', icon: 'description' },
  ];

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-[#dfa38f]/30 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      {/* State 1: Input too short / Empty Input State (Recent Searches + Popular Categories) */}
      {isQueryTooShort && (
        <div className="p-4 space-y-4">
          {recentSearches.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b7368] flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">history</span>
                  Recent Searches
                </span>
                <button
                  type="button"
                  onClick={onClearRecentSearches}
                  className="text-[10px] text-[#ab7e66] hover:text-[#4a372e] underline cursor-pointer"
                >
                  Clear history
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map((term, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => onSelectRecentSearch(term)}
                    className="px-3 py-1.5 rounded-full bg-[#dfa38f]/10 hover:bg-[#dfa38f]/25 border border-[#dfa38f]/20 text-[#5a4740] text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs text-[#ab7e66]">search</span>
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b7368] flex items-center gap-1 px-1">
              <span className="material-symbols-outlined text-xs">auto_awesome</span>
              Popular Categories
            </span>
            <div className="grid grid-cols-2 gap-2">
              {popularCategories.map((cat, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => onSelectCategorySuggestion(cat.label)}
                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#ffe5db]/40 to-white hover:from-[#ffe5db] border border-[#dfa38f]/20 text-[#5a4740] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer text-left"
                >
                  <span className="material-symbols-outlined text-sm text-[#ab7e66]">{cat.icon}</span>
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* State 2: Loading Indicator */}
      {!isQueryTooShort && isLoading && (
        <div className="p-8 text-center space-y-2">
          <div className="w-6 h-6 border-2 border-[#dfa38f] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#8b7368]">Searching catalog for &quot;{trimmedQuery}&quot;...</p>
        </div>
      )}

      {/* State 3: Active Results */}
      {!isQueryTooShort && !isLoading && results && totalCount > 0 && (
        <div className="p-2 max-h-[70vh] overflow-y-auto space-y-2">
          <SearchResultCategoryGroup
            title="Video Lessons"
            icon="play_circle"
            items={lessons}
            selectedIndex={selectedIndex}
            globalStartIndex={0}
            onSelectItem={onSelectItem}
          />
          <SearchResultCategoryGroup
            title="Performance Covers"
            icon="music_video"
            items={covers}
            selectedIndex={selectedIndex}
            globalStartIndex={lessons.length}
            onSelectItem={onSelectItem}
          />
          <SearchResultCategoryGroup
            title="Sheet Music Arrangements"
            icon="description"
            items={sheetMusic}
            selectedIndex={selectedIndex}
            globalStartIndex={lessons.length + covers.length}
            onSelectItem={onSelectItem}
          />
        </div>
      )}

      {/* State 4: No Results Found */}
      {!isQueryTooShort && !isLoading && results && totalCount === 0 && (
        <div className="p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#dfa38f]/15 text-[#ab7e66] flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-2xl">search_off</span>
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[#4a372e]">No matching music content found</h4>
            <p className="text-xs text-[#8b7368]">
              We couldn&apos;t find any lessons, covers, or sheets matching &quot;{trimmedQuery}&quot;.
            </p>
          </div>

          <div className="pt-2 border-t border-[#dfa38f]/20 text-left space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b7368]">Try searching:</span>
            <div className="flex flex-wrap gap-1.5">
              {popularCategories.map((cat, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectCategorySuggestion(cat.label)}
                  className="px-2.5 py-1 rounded-lg bg-[#dfa38f]/10 text-[#5a4740] text-xs font-medium hover:bg-[#dfa38f]/20 transition-all cursor-pointer"
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
