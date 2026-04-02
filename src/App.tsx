import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './pages/LandingPage';

// This is the logic for your download button
const handleDownload = () => {
  const DOWNLOAD_URL = "https://github.com/Marco91firenze/Repo-Definitivo/releases/download/v1.0.0/CV%20Fit%20Check%20Setup%201.0.0.exe";
  const link = document.createElement('a');
  link.href = DOWNLOAD_URL;
  link.setAttribute('download', 'CV Fit Check Setup 1.0.0.exe');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <Routes>
      <Route 
        path="/" 
        element={user ? <Navigate to="/app" /> : <LandingPage onDownload={handleDownload} />} 
      />
      <Route 
        path="/app" 
        element={user ? <Dashboard /> : <AuthForm />} 
      />
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
