import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './components/Dashboard';
import { ResetPassword } from './components/ResetPassword';
import { LandingPage } from './pages/LandingPage';

// --- NEW DOWNLOAD LOGIC ---
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

  const loadingSpinner = (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <Routes>
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/"
        element={
          loading ? (
            loadingSpinner
          ) : user ? (
            <Navigate to="/app" replace />
          ) : (
            /* We pass the download function as a prop to the LandingPage */
            <LandingPage onDownload={handleDownload} />
          )
        }
      />
      <Route
        path="/app"
        element={
          loading ? (
            loadingSpinner
          ) : user ? (
            <Dashboard />
          ) : (
            <AuthForm />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
