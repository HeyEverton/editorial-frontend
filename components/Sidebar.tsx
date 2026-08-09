import React from 'react';
import { useAbility } from '../context/AbilityContext';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
  onLogout: () => void;
  userName?: string;
  onCloseMobile?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed, 
  setIsCollapsed, 
  activeScreen, 
  setActiveScreen,
  onLogout,
  userName = "CURADOR DIGITAL",
  onCloseMobile
}) => {
  const ability = useAbility();

  const menuItems = [
    { id: 'home', label: 'HOME', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { id: 'criar', label: 'CRIAR', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    )},
  ];

  if (ability.can('list', 'users') || ability.can('read', 'users') || ability.can('manage', 'all')) {
    menuItems.push({
      id: 'usuarios',
      label: 'USUÁRIOS',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    });
  }

  if (ability.can('read', 'analytics') || ability.can('list', 'analytics') || ability.can('manage', 'all')) {
    menuItems.push({
      id: 'analytics',
      label: 'ANALYTICS',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    });
  }

  if (ability.can('list', 'roles') || ability.can('manage', 'all')) {
    menuItems.push({
      id: 'perfis',
      label: 'PERFIS',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    });
  }

  if (ability.can('list', 'permission') || ability.can('manage', 'all')) {
    menuItems.push({
      id: 'permissoes',
      label: 'PERMISSÕES',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    });
  }

  const bottomItems = [
    { id: 'configuracoes', label: 'CONFIGURAÇÕES', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )},
    { id: 'sair', label: 'SAIR', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    )},
  ];

  return (
    <div 
      className={`no-print h-screen border-r flex flex-col transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isCollapsed ? 'w-20' : 'w-full md:w-72'} ${activeScreen === 'perfil' ? '' : 'bg-[#f5f5f5] dark:bg-elite-dark border-gray-100 dark:border-white/5'}`}
      style={{
        backgroundColor: activeScreen === 'perfil' ? (document.documentElement.classList.contains('dark') ? '#0d0d0d' : '#f5f5f5') : undefined
      }}
    >
      {/* Header / Logo */}
      <div className="p-8 pb-12 flex items-center justify-between overflow-hidden">
        {!isCollapsed && (
          <div className="animate-in fade-in duration-300">
            <h1 className="serif text-xl font-bold italic leading-tight tracking-tight">Arquitetura Editorial</h1>
            <p className="text-[8px] font-bold text-gray-400 tracking-[0.4em] uppercase">THE DIGITAL CURATOR</p>
          </div>
        )}
        {isCollapsed && (
             <div className="flex justify-center w-full animate-in fade-in duration-300">
                <span className="serif text-2xl font-black italic">A</span>
             </div>
        )}
        {onCloseMobile && (
          <button 
            onClick={onCloseMobile}
            className="p-2 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 rounded transition-colors"
            title="Fechar menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-4 space-y-2">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveScreen(item.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 group relative ${activeScreen === item.id ? 'bg-white dark:bg-white/5 shadow-sm' : 'hover:bg-white/60 dark:hover:bg-white/5'}`}
          >
            <div className={`transition-transform duration-200 group-hover:scale-110 ${activeScreen === item.id ? 'text-black dark:text-white' : 'text-gray-400 group-hover:text-black dark:group-hover:text-white'}`}>
              {item.icon}
            </div>
            {!isCollapsed && (
              <span className={`text-[10px] font-bold tracking-[0.2em] animate-in fade-in slide-in-from-left-2 duration-200 ${activeScreen === item.id ? 'text-black dark:text-white' : 'text-gray-400 group-hover:text-black dark:group-hover:text-white'}`}>
                {item.label}
              </span>
            )}
            {!isCollapsed && activeScreen === item.id && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-l bg-black dark:bg-white animate-in fade-in duration-200" />
            )}
          </button>
        ))}
      </div>

      {/* Footer Navigation */}
      <div className="p-4 border-t border-gray-100/50 dark:border-white/5 space-y-2">
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center gap-4 p-4 text-gray-400 hover:text-black dark:hover:text-white transition-all duration-200 rounded-xl hover:bg-white/40 dark:hover:bg-white/5 group"
          title={isCollapsed ? "Expandir" : "Recolher"}
        >
          <div className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </div>
          {!isCollapsed && <span className="text-[10px] font-bold tracking-[0.2em] animate-in fade-in duration-200">RECOLHER</span>}
        </button>

        <div className="h-px bg-gray-100 dark:bg-white/5 my-2" />

        {bottomItems.map(item => (
          <button
            key={item.id}
            onClick={() => {
              if (item.id === 'sair') onLogout();
              else setActiveScreen(item.id);
            }}
            className={`w-full flex items-center gap-4 p-4 transition-all group ${activeScreen === item.id ? 'bg-white dark:bg-white/5 shadow-sm' : 'hover:bg-white/50 dark:hover:bg-white/5'}`}
          >
            <div className={`${activeScreen === item.id ? 'text-black dark:text-white' : 'text-gray-400 group-hover:text-black dark:group-hover:text-white'}`}>
              {item.icon}
            </div>
            {!isCollapsed && (
              <span className={`text-[10px] font-bold tracking-[0.2em] animate-in fade-in slide-in-from-left-4 duration-300 ${activeScreen === item.id ? 'text-black dark:text-white' : 'text-gray-400 group-hover:text-black dark:group-hover:text-white'}`}>
                {item.label}
              </span>
            )}
          </button>
        ))}

        {/* User Profile Info */}
        <button 
            onClick={() => setActiveScreen('perfil')}
            className={`w-full mt-4 flex items-center gap-4 p-3 border border-transparent transition-all hover:bg-white/50 dark:hover:bg-white/5 ${activeScreen === 'perfil' ? 'bg-white dark:bg-white/10 border-gray-100 dark:border-white/10' : ''}`}
        >
            <div className="w-8 h-8 bg-gray-200 dark:bg-white/10 flex items-center justify-center overflow-hidden">
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
            </div>
            {!isCollapsed && (
                <div className="text-left overflow-hidden animate-in fade-in slide-in-from-left-4 duration-500">
                    <p className="text-[9px] font-black tracking-widest text-black dark:text-white truncate">{userName}</p>
                    <p className="text-[7px] font-bold text-gray-400 tracking-widest uppercase">VERSÃO 2.4.0</p>
                </div>
            )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
