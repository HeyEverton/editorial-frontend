import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ThemeToggle, { ThemeMode } from './ThemeToggle';

interface MainLayoutProps {
  children: React.ReactNode;
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
  onLogout: () => void;
  userName?: string;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDarkMode: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  activeScreen, 
  setActiveScreen, 
  onLogout,
  userName,
  themeMode,
  setThemeMode,
  isDarkMode
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className={`flex h-screen w-screen overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-elite-black text-white dark' : 'bg-[#fcfcfc] text-[#1a1a1a]'}`}>
      {/* Sidebar Desktop */}
      <div className="hidden md:flex h-full">
        <Sidebar 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed} 
          activeScreen={activeScreen} 
          setActiveScreen={setActiveScreen}
          onLogout={onLogout}
          userName={userName}
        />
      </div>

      {/* Drawer Menu Mobile (Hamburguer) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-xs bg-white dark:bg-elite-dark h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
            <Sidebar 
              isCollapsed={false} 
              setIsCollapsed={() => {}} 
              activeScreen={activeScreen} 
              setActiveScreen={(screen) => {
                setActiveScreen(screen);
                setMobileMenuOpen(false);
              }}
              onLogout={() => {
                onLogout();
                setMobileMenuOpen(false);
              }}
              userName={userName}
              onCloseMobile={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}
      
      <main className="flex-1 flex flex-col overflow-hidden h-screen relative">
        {/* Global Header */}
        <header className={`no-print h-16 border-b flex items-center justify-between px-4 sm:px-8 z-40 transition-colors duration-500 ${isDarkMode ? 'bg-elite-black border-white/10' : 'bg-white border-gray-100'}`}>
            {/* Botão Hamburguer no Mobile */}
            <div className="flex items-center gap-3 md:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 -ml-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded transition-colors"
                aria-label="Abrir menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="serif text-base font-bold italic tracking-tight">Arquitetura Editorial</h1>
            </div>

            <div className="ml-auto flex items-center gap-4">
              <ThemeToggle themeMode={themeMode} setThemeMode={setThemeMode} isDarkMode={isDarkMode} />
            </div>
        </header>

        <div className="flex-1 overflow-auto">
            {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
