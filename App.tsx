import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import MainLayout from './components/MainLayout';
import Home from './components/Home';
import CreateProject from './components/CreateProject';
import Settings from './components/Settings';
import Profile from './components/Profile';
// @ts-ignore
import ArquiteturaEditorialV16 from './components/ArquiteturaEditorialV16';
import { logout, isAuthenticated, verifyToken, getCurrentUser, User } from './services/authService';

const EliteApp: React.FC<{
  user: User | null;
  setUser: (user: User | null) => void;
  authenticated: boolean;
  setAuthenticated: (auth: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
}> = ({ user, setUser, authenticated, setAuthenticated, isDarkMode, setIsDarkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setUser(null);
    navigate('/');
  };

  // Sync activeScreen with URL
  const getActiveScreen = () => {
    const path = location.pathname.split('/').pop() || 'home';
    return path === 'elite' ? 'home' : path;
  };

  const activeScreen = getActiveScreen();

  const setActiveScreen = (screen: string) => {
    if (screen === 'sair') {
      handleLogout();
    } else {
      navigate(`/elite/${screen}`);
    }
  };

  if (!authenticated) {
    return <Navigate to="/elite/auth/login" replace />;
  }

  return (
    <MainLayout 
      activeScreen={activeScreen} 
      setActiveScreen={setActiveScreen} 
      onLogout={handleLogout}
      userName={user?.nome || "CURADOR DIGITAL"}
      isDarkMode={isDarkMode}
      setIsDarkMode={setIsDarkMode}
    >
      <Routes>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="criar" element={<CreateProject />} />
        <Route path="configuracoes" element={<Settings />} />
        <Route path="perfil" element={<Profile />} />
        <Route path="*" element={<Navigate to="home" replace />} />
      </Routes>
    </MainLayout>
  );
};

import Checkout from './components/Checkout';

const App: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
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
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ArquiteturaEditorialV16 />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route 
          path="/elite/auth/login" 
          element={
            authenticated ? 
            <Navigate to="/elite" replace /> : 
            <Login onLoginSuccess={handleLoginSuccess} />
          } 
        />
        <Route 
          path="/elite/*" 
          element={
            <EliteApp 
              user={user} 
              setUser={setUser} 
              authenticated={authenticated} 
              setAuthenticated={setAuthenticated}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
            />
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};


export default App;
