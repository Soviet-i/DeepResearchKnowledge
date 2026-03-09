import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import PreferenceSettingsPage from "@/pages/PreferenceSettingsPage";
import SearchResultsPage from "@/pages/SearchResultsPage";
import ReportGenerationPage from "@/pages/ReportGenerationPage";
import LoginPage from "@/pages/LoginPage";
import UserCenterPage from "@/pages/UserCenterPage";
import { useEffect, useState } from "react";
import { AuthContext } from '@/contexts/authContext';
import { logout as clearAuthStorage } from "@/lib/api";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ id?: string; email?: string; name?: string; role?: string } | null>(null);

  useEffect(() => {
    const savedThemeMode = localStorage.getItem('themeMode') as 'light' | 'dark' | 'auto' | null;
    const resolvedTheme =
      savedThemeMode === 'dark'
        ? 'dark'
        : savedThemeMode === 'light'
          ? 'light'
          : window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
    document.documentElement.classList.remove('theme-light', 'theme-dark');
    document.documentElement.classList.add(resolvedTheme === 'dark' ? 'theme-dark' : 'theme-light');
    document.documentElement.setAttribute('data-theme', resolvedTheme);

    const savedLanguage = localStorage.getItem('language') || 'zh-CN';
    document.documentElement.lang = savedLanguage;

    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const userRaw = localStorage.getItem('authUser') || sessionStorage.getItem('authUser');

    if (token) {
      setIsAuthenticated(true);
    }

    if (userRaw) {
      try {
        setUser(JSON.parse(userRaw));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    clearAuthStorage();
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, setUser, setIsAuthenticated, logout }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/preferences" element={<PreferenceSettingsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user-center" element={<UserCenterPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/report" element={<ReportGenerationPage />} />
      </Routes>
    </AuthContext.Provider>
  );
}
