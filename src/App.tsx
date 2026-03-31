import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import { Dashboard } from './components/Dashboard';
import { ResetPassword } from './components/ResetPassword';
import { LandingPage } from './pages/LandingPage';

function AppContent() {
  const { user, loading } = useAuth();

  return (
    <Routes>
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/"
        element={
          loading ? (
            <LandingPage />
          ) : user ? (
            <Dashboard />
          ) : (
            <LandingPage />
          )
        }
      />
      <Route
        path="/app"
        element={
          loading ? (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : user ? (
            <Dashboard />
          ) : (
            <Navigate to="/" replace />
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
