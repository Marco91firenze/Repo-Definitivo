import React from 'react';
import { Download, Lock, Zap, Shield, CheckCircle, ArrowRight, LogIn, Search, FileText, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LandingPageProps {
  onDownload?: () => void;
}

export function LandingPage({ onDownload }: LandingPageProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-8 h-8 text-blue-600 fill-current" />
            <span className="text-xl font-bold text-slate-900 tracking-tight">CV Fit Check</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/app')}
              className="text-slate-600 hover:text-slate-900 font-medium px-4 py-2 transition"
            >
              Sign In
            </button>
            <button 
              onClick={onDownload}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition shadow-sm"
            >
              Download Now
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="px-6 py-20 lg:py-32 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-6">
              <Shield className="w-4 h-4" />
              100% GDPR Compliant & Private
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
              Rank CVs with <span className="text-blue-600">Local AI</span> that never leaves your PC.
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              CV Fit Check uses a locally installed LLM to analyze candidates. No sensitive data is ever uploaded to the cloud, ensuring your company remains fully compliant with privacy regulations while leveraging the power of AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onDownload}
                className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-lg font-bold px-8 py-4 rounded-xl transition shadow-lg"
              >
                <Download className="w-5 h-5" />
                Download for Windows
              </button>
              <button className="flex items-center justify-center gap-2 bg-white border border-slate-300 hover:border-blue-600 text-slate-700 font-semibold px-8 py-4 rounded-xl transition">
                View Demo
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100 to-indigo-100 rounded-3xl blur-2xl opacity-50"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 p-8">
              {/* Abstract UI representation of the ranking list */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">98%</div>
                    <div>
                      <div className="font-bold text-slate-900">Senior Developer.pdf</div>
                      <div className="text-xs text-slate-500">Perfect Match • Python, React, AWS</div>
                    </div>
                  </div>
                  <CheckCircle className="text-green-500 w-5 h-5" />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">85%</div>
                    <div>
                      <div className="font-bold text-slate-900">Project Manager.docx</div>
                      <div className="text-xs text-slate-500">Strong Match • Agile, Scrum, 5y Exp</div>
                    </div>
                  </div>
                  <CheckCircle className="text-blue-500 w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* SEO & Features Section */}
      <section className="bg-white py-24 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Intelligent Analysis, Absolute Privacy</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Our system provides detailed briefings and rankings based on your specific job requirements.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Briefing Reports</h3>
              <p className="text-slate-600 leading-relaxed">
                Get a written summary of how each CV compares to your job description. The AI identifies missing skills, years of experience, and cultural fit automatically.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Smart Ranking</h3>
              <p className="text-slate-600 leading-relaxed">
                CVs are ranked in order of "Job Fit." Focus your time on the top 5 candidates instead of reading hundreds of unqualified applications.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Zero Cloud Dependency</h3>
              <p className="text-slate-600 leading-relaxed">
                The entire analysis happens on your local hardware. No API keys, no monthly cloud fees, and no risk of data breaches from external servers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 text-sm">
          <p>© 2026 CV Fit Check. Local AI for modern HR. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
