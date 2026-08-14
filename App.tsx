import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import MainLayout from './components/MainLayout';
import Home from './components/Home';
import CreateProject from './components/CreateProject';
import Settings from './components/Settings';
import Profile from './components/Profile';
import { RolesManagement } from './components/admin/RolesManagement';
import { PermissionsManagement } from './components/admin/PermissionsManagement';
import { UsersManagement } from './components/admin/UsersManagement';
import { AnalyticsDashboard } from './components/admin/AnalyticsDashboard';
import { AbilityProvider } from './context/AbilityContext';
// @ts-ignore
import ArquiteturaEditorialV16 from './components/ArquiteturaEditorialV16';
import Checkout from './components/Checkout';
import { logout, isAuthenticated, verifyToken, User } from './services/authService';

import { ThemeMode } from './components/ThemeToggle';

const isAdminUser = (user: User | null): boolean => {
  if (!user) return false;
  if (user.isSystemAdmin) return true;
  const roleName = (user.role || '').toLowerCase();
  return roleName.includes('admin');
};

const ProtectedRoute: React.FC<{
  user: User | null;
  requireAdmin?: boolean;
  children: React.ReactElement;
}> = ({ user, requireAdmin = false, children }) => {
  if (requireAdmin && !isAdminUser(user)) {
    return <Navigate to="/elite/home" replace />;
  }
  return children;
};

const EliteApp: React.FC<{
  user: User | null;
  setUser: (user: User | null) => void;
  authenticated: boolean;
  setAuthenticated: (auth: boolean) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDarkMode: boolean;
}> = ({ user, setUser, authenticated, setAuthenticated, themeMode, setThemeMode, isDarkMode }) => {
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
    <AbilityProvider user={user}>
      <MainLayout 
        activeScreen={activeScreen} 
        setActiveScreen={setActiveScreen} 
        onLogout={handleLogout}
        userName={user?.nome || "CURADOR DIGITAL"}
        themeMode={themeMode}
        setThemeMode={setThemeMode}
        isDarkMode={isDarkMode}
      >
        <Routes>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="criar" element={<CreateProject />} />
          <Route path="configuracoes" element={<Settings />} />
          <Route path="perfil" element={<Profile />} />
          <Route 
            path="usuarios" 
            element={
              <ProtectedRoute user={user} requireAdmin>
                <UsersManagement />
              </ProtectedRoute>
            } 
          />
          <Route path="analytics" element={<AnalyticsDashboard currentUser={user} />} />
          <Route 
            path="perfis" 
            element={
              <ProtectedRoute user={user} requireAdmin>
                <RolesManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="permissoes" 
            element={
              <ProtectedRoute user={user} requireAdmin>
                <PermissionsManagement />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="home" replace />} />
        </Routes>
      </MainLayout>
    </AbilityProvider>
  );
};

const AuthSyncEffect: React.FC<{
  authenticated: boolean;
  setAuthenticated: (val: boolean) => void;
}> = ({ authenticated, setAuthenticated }) => {
  const location = useLocation();

  useEffect(() => {
    if (!authenticated && isAuthenticated()) {
      setAuthenticated(true);
    }
  }, [location.pathname, authenticated, setAuthenticated]);

  return null;
};

const App: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const [user, setUser] = useState<User | null>(null);
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('themeMode');
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved as ThemeMode;
    // Migração de preferências antigas
    const oldSaved = localStorage.getItem('theme');
    if (oldSaved === 'dark') return 'dark';
    if (oldSaved === 'light') return 'light';
    return 'system';
  });

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const applyTheme = () => {
      let dark = false;
      if (themeMode === 'dark') {
        dark = true;
      } else if (themeMode === 'light') {
        dark = false;
      } else {
        dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      setIsDarkMode(dark);
      if (dark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('themeMode', themeMode);
    };

    applyTheme();

    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [themeMode]);

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
      <AuthSyncEffect authenticated={authenticated} setAuthenticated={setAuthenticated} />
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
              themeMode={themeMode}
              setThemeMode={setThemeMode}
              isDarkMode={isDarkMode}
            />
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
