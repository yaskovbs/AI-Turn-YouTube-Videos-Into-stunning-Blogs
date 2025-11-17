import React, { useState, useEffect, useRef } from 'react';
import { MOON_ICON, SUN_ICON } from '../constants.tsx';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeSelectorProps {
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onThemeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getThemeIcon = (theme: ThemeMode) => {
    switch (theme) {
      case 'light':
        return SUN_ICON;
      case 'dark':
        return MOON_ICON;
      case 'system':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  const getThemeLabel = (theme: ThemeMode) => {
    switch (theme) {
      case 'light':
        return 'בהיר';
      case 'dark':
        return 'כהה';
      case 'system':
        return 'מערכת';
    }
  };

  const handleThemeSelect = (theme: ThemeMode) => {
    onThemeChange(theme);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle theme selector"
        className="p-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
        data-testid="theme-selector-button"
      >
        {getThemeIcon(currentTheme)}
        <span className="text-sm hidden md:inline">{getThemeLabel(currentTheme)}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
          {(['light', 'dark', 'system'] as ThemeMode[]).map((theme) => (
            <button
              key={theme}
              onClick={() => handleThemeSelect(theme)}
              className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-700 transition-colors ${
                currentTheme === theme ? 'bg-gray-700 text-purple-400' : 'text-gray-300'
              }`}
              data-testid={`theme-option-${theme}`}
            >
              {getThemeIcon(theme)}
              <span className="font-semibold">{getThemeLabel(theme)}</span>
              {currentTheme === theme && (
                <svg className="w-4 h-4 mr-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
