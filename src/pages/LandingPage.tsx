import React from 'react';
import { Download, Lock, Zap, Shield, CheckCircle, ArrowRight, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LandingPageProps {
  onDownload?: () => void;
}

export function LandingPage({ onDownload }: LandingPageProps) {
  const navigate = useNavigate();

  // We use the prop passed from App.tsx to handle the download
  const handleDownloadClick = () => {
    if (onDownload) {
      onDownload();
    } else {
      // Fallback if prop isn't provided
      window.location.href = 'https://github.com/Marco91firenze/Repo-Definitivo/releases/download/v1.0.0/CV%20Fit%20Check%20Setup%201.0.0.exe';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">CV AI Scanner</h1>
            </div>
            <nav className="flex items-center gap-6">
              <a href="#features" className="hidden sm:inline text-slate-600 hover:text-slate-900 transition">Features</a>
              <a href="#why" className="hidden sm:inline text-slate-600 hover:text-slate-900 transition">Why Us</a>
              <a href="#pricing" className="hidden sm:inline text-slate-600 hover:text-slate-900 transition">Pricing</a>
              <button
                onClick={() => navigate('/app')}
                className="text-slate-600 hover:text-slate-900 transition flex items-center gap-1.5 font-medium"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
              <button
                onClick={handleDownloadClick}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
              >
                Download
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                CV Ranking Made <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">Private & Secure</span>
              </h2>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                CV Fit Check is a CV ranking system that uses a locally installed artificial intelligence LLM to analyze the CVs you select without neither the CVs nor their sensitive data ever exiting your company's computer.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleDownloadClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition flex items-center justify-center gap-2 text-lg"
                >
                  <Download className="w-5 h-5" />
                  Download for Windows
                </button>
                <a
                  href="#why"
                  className="border-2 border-slate-300 text-slate-900 font-semibold px-8 py-4 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition flex items-center justify-center gap-2"
                >
                  Learn More
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-1 shadow-2xl">
                <div className="bg-white rounded-2xl p-8">
                  <div className="space-y-4">
                    <div className="bg-slate-100 h-10 rounded-lg animate-pulse"></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-100 h-20 rounded-lg animate-pulse"></div>
                      <div className="bg-slate-100 h-20 rounded-lg animate-pulse"></div>
                    </div>
                    <div className="bg-slate-100 h-32 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-4">
                <Lock className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">100% Private</h3>
              <p className="text-slate-600">All CVs stay on your computer. Nothing leaves your organization.</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-4">
                <Shield className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">GDPR Compliant</h3>
              <p className="text-slate-600">Fully compliant with GDPR and privacy regulations worldwide.</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-100 rounded-full mb-4">
                <Zap className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Instant Analysis</h3>
              <p className="text-slate-600">Analyze CVs in seconds using local AI processing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section id="why" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 text-center">Why Choose CV AI Scanner?</h2>
          <p className="text-xl text-slate-600 text-center mb-12 max-w-2xl mx-auto">
            It outputs briefings of how each CV compares to the job requirements you determined in your job description and ranks CVs in order of job fit for those requirements.
          </p
