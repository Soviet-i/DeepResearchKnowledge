import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import PreferenceSettingsPage from "@/pages/PreferenceSettingsPage";
import SearchResultsPage from "@/pages/SearchResultsPage";
import ReportGenerationPage from "@/pages/ReportGenerationPage";
import { useState } from "react";
import { AuthContext } from '@/contexts/authContext';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, logout }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/preferences" element={<PreferenceSettingsPage />} />
      <Route path="/login" element={<div className="text-center text-xl py-8">登录页面 - 即将上线</div>} />
      <Route path="/search" element={<SearchResultsPage />} />
      <Route path="/report" element={<ReportGenerationPage />} />
    </Routes>
    </AuthContext.Provider>
  );
}
