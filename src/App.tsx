import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './pages/LandingPage';

const handleDownload = () => {
  const DOWNLOAD_URL = "https://github.com/Marco91firenze/Repo-Definitivo/releases/download/v1.0.0/CV%20Fit%20Check%20Setup%201.0.0.exe";
  window.location.href = DOWNLOAD_URL;
};

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/app" /> : <LandingPage onDownload={handleDownload} />} />
      <Route path="/app" element={user ? <Dashboard /> : <AuthForm />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
