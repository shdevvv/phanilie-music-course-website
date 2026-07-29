import { useState, useRef, useEffect } from 'react';
import { countries } from './countriesData';

interface SearchableCountryDropdownProps {
  value: string;
  onChange: (country: string) => void;
  label?: string;
  className?: string;
}

export default function SearchableCountryDropdown({
  value,
  onChange,
  label = "Country / Region",
  className = ""
}: SearchableCountryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = countries.filter(country =>
    country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div ref={containerRef} className={`space-y-1 relative text-left ${className}`}>
      {label && (
        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7368] ml-1">
          {label}
        </label>
      )}
      
      {/* Trigger Button */}
      <div 
        onClick={() => {
          setIsOpen(!isOpen);
          setSearchQuery('');
        }}
        className="w-full bg-white border border-[#dfa38f]/30 rounded-xl px-4 py-3 text-xs text-[#5a4740] cursor-pointer flex justify-between items-center transition-all select-none hover:border-[#dfa38f]/60"
      >
        <span>{value || 'Select country...'}</span>
        <span className="material-symbols-outlined text-[#8b7368] text-base select-none transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}>
          expand_more
        </span>
      </div>

      {/* Dropdown Menu Overlay */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-1.5 bg-white border border-[#dfa38f]/35 shadow-2xl rounded-xl p-2 z-50 animate-in fade-in slide-in-from-top-1.5 duration-200">
          {/* Search Input Box */}
          <div className="relative mb-2">
            <input
              type="text"
              placeholder="Search country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full bg-[#fbf5f1]/60 border border-[#dfa38f]/20 rounded-lg pl-9 pr-3 py-2 text-xs text-[#5a4740] placeholder-[#ab7e66]/40 focus:outline-none focus:ring-1 focus:ring-[#dfa38f]"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[#8b7368]/50 text-sm select-none">
              search
            </span>
          </div>

          {/* List Options */}
          <div className="max-h-56 overflow-y-auto custom-scrollbar flex flex-col gap-0.5">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => {
                const isSelected = country === value;
                return (
                  <button
                    key={country}
                    type="button"
                    onClick={() => {
                      onChange(country);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer border-none flex items-center justify-between ${
                      isSelected 
                        ? 'bg-[#dfa38f]/15 text-[#856758] font-bold' 
                        : 'bg-transparent text-[#5a4740] hover:bg-[#dfa38f]/10'
                    }`}
                  >
                    <span>{country}</span>
                    {isSelected && (
                      <span className="material-symbols-outlined text-sm font-bold text-[#856758] select-none">
                        check
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <span className="text-[10px] text-[#8b7368]/60 p-3 italic text-center block">
                No countries found
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
