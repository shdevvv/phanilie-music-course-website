import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { useRecentSearches } from '../hooks/useRecentSearches';
import { fetchSearchResults } from '../services/searchApi';
import type { SearchResponse, SearchResultItem } from '../services/searchApi';
import { SearchDropdownOverlay } from './SearchDropdownOverlay';

interface GlobalSearchInputProps {
  onNavigate?: (view: any) => void;
}

export const GlobalSearchInput: React.FC<GlobalSearchInputProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { recentSearches, addRecentSearch, clearRecentSearches } = useRecentSearches();

  // Trigger search API when debounced term updates
  useEffect(() => {
    const trimmed = debouncedSearchTerm.trim();
    if (trimmed.length < 2) {
      setResults(null);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    fetchSearchResults(trimmed)
      .then((data) => {
        if (isMounted) {
          setResults(data);
          setIsLoading(false);
          setSelectedIndex(-1);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [debouncedSearchTerm]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Compute total result items for keyboard navigation
  const allItems: SearchResultItem[] = results
    ? [...results.lessons, ...results.covers, ...results.sheetMusic]
    : [];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && e.key === 'ArrowDown') {
      setIsOpen(true);
      return;
    }

    if (e.key === 'Escape') {
      setIsOpen(false);
      setIsMobileModalOpen(false);
      return;
    }

    if (allItems.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < allItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : allItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < allItems.length) {
        handleSelectItem(allItems[selectedIndex]);
      } else if (searchTerm.trim().length >= 2) {
        addRecentSearch(searchTerm.trim());
      }
    }
  };

  const handleSelectItem = (item: SearchResultItem) => {
    addRecentSearch(item.title);
    setIsOpen(false);
    setIsMobileModalOpen(false);

    if (onNavigate) {
      if (item.category === 'Lesson') {
        onNavigate('courses');
      } else if (item.category === 'Performance Cover' || item.category === 'Sheet Music') {
        onNavigate('covers-sheets');
      }
    } else {
      window.location.href = item.routeUrl;
    }
  };

  const handleSelectRecentSearch = (term: string) => {
    setSearchTerm(term);
    setIsOpen(true);
  };

  const handleSelectCategorySuggestion = (category: string) => {
    setSearchTerm(category);
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xs md:max-w-md">
      {/* Desktop Search Bar */}
      <div className="hidden md:flex items-center relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search lessons, covers, sheet music..."
          className="w-full bg-white/70 backdrop-blur-md border border-[#dfa38f]/30 rounded-full py-2 pl-10 pr-9 text-xs text-[#5a4740] placeholder-[#ab7e66]/50 focus:outline-none focus:ring-2 focus:ring-[#dfa38f]/50 focus:border-[#dfa38f] transition-all shadow-sm"
        />
        <span className="material-symbols-outlined absolute left-3 text-sm text-[#ab7e66] pointer-events-none">
          search
        </span>
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setResults(null);
              setIsOpen(false);
            }}
            className="absolute right-3 text-xs text-[#ab7e66] hover:text-[#4a372e] cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        )}
      </div>

      {/* Desktop Dropdown */}
      {isOpen && (
        <div className="hidden md:block">
          <SearchDropdownOverlay
            query={searchTerm}
            isLoading={isLoading}
            results={results}
            selectedIndex={selectedIndex}
            recentSearches={recentSearches}
            onSelectRecentSearch={handleSelectRecentSearch}
            onClearRecentSearches={clearRecentSearches}
            onSelectItem={handleSelectItem}
            onSelectCategorySuggestion={handleSelectCategorySuggestion}
          />
        </div>
      )}

      {/* Mobile Search Button Trigger */}
      <div className="flex md:hidden">
        <button
          type="button"
          onClick={() => setIsMobileModalOpen(true)}
          className="w-9 h-9 rounded-full bg-white/80 border border-[#dfa38f]/30 flex items-center justify-center text-[#6a564d] hover:bg-[#dfa38f]/10 transition-all cursor-pointer"
          aria-label="Open Search"
        >
          <span className="material-symbols-outlined text-lg">search</span>
        </button>
      </div>

      {/* Mobile Full-Screen Search Overlay Modal */}
      {isMobileModalOpen && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#ffe5db] to-[#cbb2a6] p-4 flex flex-col space-y-4 md:hidden animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <div className="relative flex-grow flex items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                placeholder="Search lessons, covers, sheet music..."
                className="w-full bg-white border border-[#dfa38f]/40 rounded-full py-2.5 pl-10 pr-9 text-xs text-[#5a4740] focus:outline-none focus:ring-2 focus:ring-[#dfa38f]"
              />
              <span className="material-symbols-outlined absolute left-3 text-sm text-[#ab7e66]">
                search
              </span>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 text-xs text-[#ab7e66]"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsMobileModalOpen(false)}
              className="px-3 py-2 text-xs font-bold text-[#6a564d] hover:text-[#4a372e] cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="flex-grow overflow-y-auto relative">
            <SearchDropdownOverlay
              query={searchTerm}
              isLoading={isLoading}
              results={results}
              selectedIndex={selectedIndex}
              recentSearches={recentSearches}
              onSelectRecentSearch={handleSelectRecentSearch}
              onClearRecentSearches={clearRecentSearches}
              onSelectItem={handleSelectItem}
              onSelectCategorySuggestion={handleSelectCategorySuggestion}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default GlobalSearchInput;
