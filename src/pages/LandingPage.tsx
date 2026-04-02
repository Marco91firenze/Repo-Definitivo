import React from 'react';
import { Download, Lock, Shield, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
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
      // Fallback direct link if prop isn't passed
      window.location.href = "https://github.com/Marco91firenze/Repo-Definitivo/releases/download/v1.0.0/CV%20Fit%20Check%20Setup%201.0.0.exe";
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Zap className="w-6 h-6 text-white fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight">AI CV Scanner</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/app')} className="text-slate-600 font-medium flex items-center gap-1">
            <span className="text-sm">Sign In</span>
          </button>
          <button onClick={handleDownloadClick} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-sm hover:bg-blue-700 transition">
            Download
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="px-6 py-16 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-6 leading-tight">
          CV Ranking Made <span className="text-blue-600">Private & Secure</span>
        </h1>
        <p className="text-lg text-slate-600 mb-10 leading-relaxed">
          CV Fit Check is a CV ranking system that uses a locally installed artificial intelligence LLM to analyze the CVs you select without neither the CVs nor their sensitive data ever exiting your company's computer.
        </p>
        <div className="flex flex-col gap-4">
          <button onClick={handleDownloadClick} className="bg-blue-600 text-white w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg active:scale-95 transition">
            <Download className="w-5 h-5" />
            Download for Windows
          </button>
          <button className="border border-slate-200 w-full py-4 rounded-xl font-semibold text-slate-700 flex items-center justify-center gap-2 hover:bg-slate-50 transition">
            Learn More <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Core Values */}
      <section className="px-6 py-12 space-y-12 bg-slate-50/50">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2"><Lock className="w-10 h-10 text-blue-400" /></div>
          <h3 className="text-xl font-bold">100% Private</h3>
          <p className="text-slate-500">All CVs stay on your computer. Nothing leaves your organization.</p>
        </div>
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2"><Shield className="w-10 h-10 text-green-400" /></div>
          <h3 className="text-xl font-bold">GDPR Compliant</h3>
          <p className="text-slate-500">Fully compliant with GDPR and privacy regulations worldwide.</p>
        </div>
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2"><Zap className="w-10 h-10 text-purple-400" /></div>
          <h3 className="text-xl font-bold">Instant Analysis</h3>
          <p className="text-slate-500">Analyze CVs in seconds using local AI processing.</p>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Why Choose AI CV Scanner?</h2>
        <p className="text-center text-slate-600 mb-12">
          It outputs briefings of how each CV compares to the job requirements you determined in your job description and ranks CVs in order of job fit for those requirements.
        </p>
        
        <div className="space-y-6">
          <div className="p-6 border border-slate-100 rounded-2xl bg-white shadow-sm">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-500 mt-1 shrink-0" />
              <div>
                <h4 className="font-bold text-lg mb-2">No Sensitive Data Processing</h4>
                <p className="text-slate-500 text-sm">We don't process the data as a third-party. You retain it for the whole process.</p>
              </div>
            </div>
          </div>
          <div className="p-6 border border-slate-100 rounded-2xl bg-white shadow-sm">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-500 mt-1 shrink-0" />
              <div>
                <h4 className="font-bold text-lg mb-2">Offline Capability</h4>
                <p className="text-slate-500 text-sm">After payment, use CV analysis offline. No internet required.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-6 py-16 bg-slate-50">
        <h2 className="text-3xl font-bold text-center mb-2">Simple Pricing</h2>
        <p className="text-center text-slate-500 mb-12">Start free, pay only when you need more</p>
        
        <div className="space-y-8">
          {/* Free Tier */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200">
            <h3 className="text-2xl font-bold mb-1">Free</h3>
            <p className="text-slate-500 mb-6">Perfect for trying it out</p>
            <div className="text-4xl font-black mb-6">10 <span className="text-lg font-normal text-slate-400">CVs</span></div>
            <button className="w-full py-3 rounded-xl border border-slate-200 font-bold text-slate-400" disabled>Included</button>
          </div>

          {/* Professional Tier */}
          <div className="bg-white p-8 rounded-3xl border-2 border-blue-600 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-bl-xl">Popular</div>
            <h3 className="text-2xl font-bold mb-1">Professional</h3>
            <p className="text-slate-500 mb-6">For growing teams</p>
            <div className="text-4xl font-black mb-1">100 <span className="text-lg font-normal text-slate-400">CVs</span></div>
            <div className="text-3xl font-bold text-slate-900 mb-6">€50</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-green-500" /> Everything in Free</li>
              <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-green-500" /> 100 CV analyses</li>
              <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-green-500" /> One-time payment</li>
            </ul>
            <button className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold shadow-md active:scale-95 transition">Get Started</button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20 bg-blue-600 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="mb-10 opacity-90">Download AI CV Scanner now and analyze your first 10 CVs for free. No credit card required.</p>
        <button onClick={handleDownloadClick} className="bg-white text-blue-600 w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl">
          <Download className="w-5 h-5" />
          Download for Windows
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white px-6 py-16">
        <div className="space-y-10 mb-12">
          <div>
            <h4 className="font-bold mb-4">About</h4>
            <p className="text-slate-400 text-sm">AI CV Scanner - Privacy-first CV ranking for modern HR.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Features</h4>
            <ul className="text-slate-400 text-sm space-y-2">
              <li>Local Processing</li>
              <li>GDPR Compliant</li>
              <li>Free Trial</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="text-slate-400 text-sm space-y-2">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-800 text-center text-slate-500 text-xs">
          Copyright 2026 AI CV Scanner. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
