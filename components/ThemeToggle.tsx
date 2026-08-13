import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeToggleProps {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDarkMode: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ themeMode, setThemeMode, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const options: { mode: ThemeMode; label: string; icon: (active: boolean) => React.ReactNode }[] = [
    {
      mode: 'light',
      label: 'Light',
      icon: (active: boolean) => <Sun size={16} className={active ? 'text-black dark:text-white' : 'text-gray-400 dark:text-white/50'} />
    },
    {
      mode: 'dark',
      label: 'Dark',
      icon: (active: boolean) => <Moon size={16} className={active ? 'text-black dark:text-white' : 'text-gray-400 dark:text-white/50'} />
    },
    {
      mode: 'system',
      label: 'System',
      icon: (active: boolean) => <Monitor size={16} className={active ? 'text-black dark:text-white' : 'text-gray-400 dark:text-white/50'} />
    }
  ];

  const getTriggerIcon = () => {
    if (themeMode === 'system') {
      return <Monitor size={18} className="text-gray-700 dark:text-white" />;
    }
    if (isDarkMode) {
      return <Moon size={18} className="text-white" />;
    }
    return <Sun size={18} className="text-gray-700" />;
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Botão Trigger Redondo inspirado na imagem */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 flex items-center justify-center transition-all focus:outline-none ring-1 ring-black/5 dark:ring-white/10 shadow-sm"
        aria-label="Selecionar Tema"
        title="Alternar Tema (Light / Dark / System)"
      >
        {getTriggerIcon()}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="space-y-1">
            {options.map((option) => {
              const isActive = themeMode === option.mode;
              return (
                <button
                  key={option.mode}
                  onClick={() => {
                    setThemeMode(option.mode);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all ${
                    isActive
                      ? 'bg-gray-100 text-black dark:bg-white/10 dark:text-white font-bold'
                      : 'text-gray-600 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/5 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {option.icon(isActive)}
                    <span>{option.label}</span>
                  </div>
                  {isActive && <Check size={14} className="text-black dark:text-white" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
