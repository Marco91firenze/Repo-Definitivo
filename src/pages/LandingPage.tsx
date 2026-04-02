import React from 'react';
import { Download, Lock, Shield, Zap, CheckCircle2, ArrowRight, Search, BarChart3, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LandingPageProps {
  onDownload?: () => void;
}

export function LandingPage({ onDownload }: LandingPageProps) {
  const navigate = useNavigate();

  const handleDownloadClick = () => {
    if (onDownload) {
      onDownload();
    } else {
      window.location.href = "https://github.com/Marco91firenze/Repo-Definitivo/releases/download/v1.0.0/CV%20Fit%20Check%20Setup%201.0.0.exe";
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Zap className="w-6 h-6 text-white fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight">AI CV Scanner</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/app')} className="text-slate-600 font-medium hover:text-blue-600 transition flex items-center gap-2">
            <LogIn className="w-4 h-4" />
            Sign In
          </button>
          <button onClick={handleDownloadClick} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 transition active:scale-95">
            Download
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="px-6 py-16 md:py-24 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-bold mb-8">
          <Shield className="w-4 h-4" />
          100% GDPR Compliant
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight text-slate-900">
          Rank CVs with <span className="text-blue-600">Local AI</span> <br />that never leaves your PC.
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-12 leading-relaxed max-w-3xl mx-auto">
          CV Fit Check is a CV ranking system that uses a locally installed artificial intelligence LLM to analyze the CVs you select without neither the CVs nor their sensitive data ever exiting your company's computer.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
          <button onClick={handleDownloadClick} className="bg-slate-900 text-white px-8 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl hover:bg-slate-800 transition active:scale-95">
            <Download className="w-6 h-6" />
            Download for Windows
          </button>
          <button className="bg-white border-2 border-slate-200 text-slate-700 px-8 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:border-blue-600 hover:text-blue-600 transition">
            Learn More <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Trust Grid */}
      <section className="px-6 py-16 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">100% Private</h3>
            <p className="text-slate-500 leading-relaxed">All CVs stay on your computer. No cloud processing, no data leaks.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">GDPR Compliant</h3>
            <p className="text-slate-500 leading-relaxed">Built for HR teams that prioritize data protection and privacy laws.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Local LLM</h3>
            <p className="text-slate-500 leading-relaxed">High-performance AI running entirely on your local hardware.</p>
          </div>
        </div>
      </section>

      {/* Detail Section */}
      <section className="px-6 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">How AI CV Scanner Works</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            It outputs briefings of how each CV compares to the job requirements you determined in your job description and ranks CVs in order of job fit.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold">1</div>
              <div>
                <h4 className="text-xl font-bold mb-2">Detailed Briefings</h4>
                <p className="text-slate-500">Every candidate gets a comprehensive report detailing their strengths and weaknesses against your specific criteria.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold">2</div>
              <div>
                <h4 className="text-xl font-bold mb-2">Smart Ranking</h4>
                <p className="text-slate-500">Automatic priority scoring ensures you spend your time interviewing the top 5% of candidates first.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold">3</div>
              <div>
                <h4 className="text-xl font-bold mb-2">Offline Processing</h4>
                <p className="text-slate-500">Analyze 1,000s of files without an internet connection. No monthly cloud API costs.</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-900 rounded-3xl p-2 shadow-2xl">
            <div className="bg-white rounded-[1.4rem] p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">98%</div>
                    <div>
                      <div className="font-bold text-sm">Senior_Dev_John.pdf</div>
                      <div className="text-[10px] text-blue-600 font-bold uppercase">Perfect Fit</div>
                    </div>
                  </div>
                  <CheckCircle2 className="text-blue-600 w-5 h-5" />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-300 rounded-lg flex items-center justify-center text-white font-bold text-sm">82%</div>
                    <div>
                      <div className="font-bold text-sm">Marketing_Jane.docx</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Strong Match</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-slate-500">Start for free, upgrade as you scale.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-2xl font-bold mb-2">Free Trial</h3>
              <p className="text-slate-500 mb-8">Test the local AI power</p>
              <div className="text-5xl font-black mb-8">10 <span className="text-xl font-normal text-slate-400">CVs</span></div>
              <button className="w-full py-4 rounded-2xl bg-slate-100 text-slate-400 font-bold cursor-not-allowed">Already Included</button>
            </div>
            <div className="bg-white p-10 rounded-3xl border-2 border-blue-600 shadow-xl relative overflow-hidden">
              <div className="absolute top-5 right-[-35px] bg-blue-600 text-white text-[10px] font-black py-1 px-12 rotate-45">BEST VALUE</div>
              <h3 className="text-2xl font-bold mb-2">Professional</h3>
              <p className="text-slate-500 mb-8">For serious recruiters</p>
              <div className="text-5xl font-black mb-1">100 <span className="text-xl font-normal text-slate-400">CVs</span></div>
              <div className="text-2xl font-bold text-blue-600 mb-8">€50 <span className="text-sm font-normal text-slate-400">one-time</span></div>
              <button onClick={handleDownloadClick} className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition">Get Started</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Zap className="w-8 h-8 text-white fill-current" />
            <span className="text-2xl font-bold text-white tracking-tight">AI CV Scanner</span>
          </div>
          <p className="mb-8">Privacy-first AI solutions for modern human resources.</p>
          <div className="text-sm border-t border-slate-800 pt-8">
            © 2026 AI CV Scanner. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
