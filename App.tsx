import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import MainLayout from './components/MainLayout';
import Home from './components/Home';
import CreateProject from './components/CreateProject';
import Settings from './components/Settings';
import Profile from './components/Profile';
import { logout, isAuthenticated, verifyToken, getCurrentUser, User } from './services/authService';

const App: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const [activeScreen, setActiveScreen] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (authenticated) {
      verifyToken()
        .then(res => {
          setUser(res.user);
        })
        .catch(() => {
          setAuthenticated(false);
          setUser(null);
        });
    }
  }, [authenticated]);

  const handleLoginSuccess = () => {
    setAuthenticated(true);
    setActiveScreen('home');
  };

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setUser(null);
    setActiveScreen('home');
  };

  if (!authenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <Home />;
      case 'criar':
        return <CreateProject />;
      case 'configuracoes':
        return <Settings />;
      case 'perfil':
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <MainLayout 
      activeScreen={activeScreen} 
      setActiveScreen={setActiveScreen} 
      onLogout={handleLogout}
      userName={user?.nome || "CURADOR DIGITAL"}
      isDarkMode={isDarkMode}
      setIsDarkMode={setIsDarkMode}
    >
      {renderScreen()}
    </MainLayout>
  );
};

export default App;
