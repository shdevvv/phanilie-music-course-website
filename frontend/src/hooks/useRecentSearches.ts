import { useState, useEffect } from 'react';

const RECENT_SEARCHES_KEY = 'phanilie_recent_searches';
const MAX_RECENT_SEARCHES = 5;

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch {
      setRecentSearches([]);
    }
  }, []);

  const addRecentSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;

    setRecentSearches(prev => {
      // Remove duplicates and add to beginning, capped at MAX_RECENT_SEARCHES
      const updated = [trimmed, ...prev.filter(t => t.toLowerCase() !== trimmed.toLowerCase())].slice(0, MAX_RECENT_SEARCHES);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {
        // Ignore quota errors
      }
      return updated;
    });
  };

  const clearRecentSearches = () => {
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // Ignore
    }
    setRecentSearches([]);
  };

  return { recentSearches, addRecentSearch, clearRecentSearches };
}
