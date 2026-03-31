import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Building2, Mail, Lock } from 'lucide-react';

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, resetPassword, isLocalMode, localSignIn, localSignUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (showForgotPassword) {
        if (!isLocalMode) {
          await resetPassword(email);
          setSuccess('Password reset email sent! Check your inbox.');
          setEmail('');
        } else {
          setError('Password reset is not available in local mode');
        }
      } else if (isLogin) {
        if (isLocalMode) {
          await localSignIn(email, password);
        } else {
          await signIn(email, password);
        }
      } else {
        if (!companyName.trim()) {
          setError('Company name is required');
          setLoading(false);
          return;
        }
        if (isLocalMode) {
          await localSignUp(email, password, companyName);
        } else {
          await signUp(email, password, companyName);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">CV Fit Check</h1>
          {isLocalMode && (
            <p className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full inline-block mb-3">
              Local Mode - CVs Stay Private
            </p>
          )}
          <p className="text-slate-600">
            {showForgotPassword ? 'Reset your password' : isLogin ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && !showForgotPassword && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Company Name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Your Company Ltd."
                  required={!isLogin && !showForgotPassword}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="you@company.com"
                required
              />
            </div>
          </div>

          {!showForgotPassword && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          {!isLogin && !showForgotPassword && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
              You get 10 free CV analyses to start
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : showForgotPassword ? 'Send Reset Email' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 space-y-3 text-center">
          {isLogin && !showForgotPassword && (
            <button
              type="button"
              onClick={() => {
                setShowForgotPassword(true);
                setError('');
                setSuccess('');
              }}
              className="block w-full text-slate-600 hover:text-slate-900 text-sm transition-colors"
            >
              Forgot your password?
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (showForgotPassword) {
                setShowForgotPassword(false);
                setIsLogin(true);
              } else {
                setIsLogin(!isLogin);
              }
              setError('');
              setSuccess('');
            }}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
          >
            {showForgotPassword ? 'Back to sign in' : isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
