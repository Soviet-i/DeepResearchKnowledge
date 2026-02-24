import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import PreferenceSettingsPage from "@/pages/PreferenceSettingsPage";
import SearchResultsPage from "@/pages/SearchResultsPage";
import ReportGenerationPage from "@/pages/ReportGenerationPage";
import LoginPage from "@/pages/LoginPage";
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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/report" element={<ReportGenerationPage />} />
      </Routes>
    </AuthContext.Provider>
  );
}
