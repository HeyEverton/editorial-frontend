import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';

interface MainLayoutProps {
  children: React.ReactNode;
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
  onLogout: () => void;
  userName?: string;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  activeScreen, 
  setActiveScreen, 
  onLogout,
  userName,
  isDarkMode,
  setIsDarkMode
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`flex h-screen w-screen overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-elite-black text-white dark' : 'bg-[#fcfcfc] text-[#1a1a1a]'}`}>
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        activeScreen={activeScreen} 
        setActiveScreen={setActiveScreen}
        onLogout={onLogout}
        userName={userName}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden h-screen relative">
        {/* Global Header */}
        <header className={`no-print h-16 border-b flex items-center justify-end px-8 z-50 transition-colors duration-500 ${isDarkMode ? 'bg-elite-black border-white/10' : 'bg-white border-gray-100'}`}>
            <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        </header>

        <div className="flex-1 overflow-auto">
            {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
