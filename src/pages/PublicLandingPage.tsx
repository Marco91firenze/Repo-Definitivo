import { Download, Lock, Zap, Shield, CheckCircle, ArrowRight } from 'lucide-react';

export function PublicLandingPage() {
  const handleDownload = () => {
    const downloadUrl = 'https://github.com/yourusername/cv-fit-check/releases/download/v1.0.0/CV-Fit-Check-1.0.0.exe';
    window.location.href = downloadUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">AI CV Scanner</h1>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 transition font-medium">Features</a>
              <a href="#why" className="text-slate-600 hover:text-slate-900 transition font-medium">Why Us</a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition font-medium">Pricing</a>
              <button
                onClick={handleDownload}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
              >
                Download
              </button>
            </nav>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                CV Ranking Made <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">Private & Secure</span>
              </h2>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                AI CV Scanner analyzes CVs using local artificial intelligence. Your sensitive data never leaves your computer. Fully GDPR compliant.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleDownload}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-xl"
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
              <p className="text-sm text-slate-500 mt-6">
                💚 Free trial: 10 CVs included. No credit card required.
              </p>
            </div>

            <div className="relative hidden lg:block">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-1 shadow-2xl">
                <div className="bg-white rounded-2xl p-8">
                  <div className="space-y-4">
                    <div className="bg-slate-100 h-10 rounded-lg"></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-100 h-20 rounded-lg"></div>
                      <div className="bg-slate-100 h-20 rounded-lg"></div>
                    </div>
                    <div className="bg-slate-100 h-32 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
              <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-4">
                <Zap className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Instant Analysis</h3>
              <p className="text-slate-600">Analyze CVs in seconds using local AI processing.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="why" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 text-center">Why Choose AI CV Scanner?</h2>
          <p className="text-xl text-slate-600 text-center mb-12 max-w-2xl mx-auto">
            Intelligent CV ranking that respects your privacy and complies with regulations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 border border-slate-200 hover:border-blue-300 transition">
              <div className="flex gap-4">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">No Data Upload</h3>
                  <p className="text-slate-600">All CV analysis happens locally on your machine. Nothing is sent to external servers.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 border border-slate-200 hover:border-blue-300 transition">
              <div className="flex gap-4">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Works Offline</h3>
                  <p className="text-slate-600">After initial setup, use the app offline. No internet required for analysis.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 border border-slate-200 hover:border-blue-300 transition">
              <div className="flex gap-4">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Free Trial</h3>
                  <p className="text-slate-600">Analyze 10 CVs free. Test the system before paying anything.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 border border-slate-200 hover:border-blue-300 transition">
              <div className="flex gap-4">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Smart Ranking</h3>
                  <p className="text-slate-600">AI analyzes experience, skills, location, and language proficiency.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-12 text-center">Powerful Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Quick Setup</h3>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <span className="text-blue-600 font-bold text-lg flex-shrink-0">1</span>
                  <span className="text-slate-600">Download and install the desktop app</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-blue-600 font-bold text-lg flex-shrink-0">2</span>
                  <span className="text-slate-600">Create your secure account</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-blue-600 font-bold text-lg flex-shrink-0">3</span>
                  <span className="text-slate-600">Define your job requirements</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-blue-600 font-bold text-lg flex-shrink-0">4</span>
                  <span className="text-slate-600">Upload and rank your CVs</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Smart Analysis</h3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600">Experience matching</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600">Skills identification</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600">Location matching</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600">Language proficiency assessment</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600">Automated ranking</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 text-center">Simple Pricing</h2>
          <p className="text-lg text-slate-600 text-center mb-12">Start free, upgrade when you need more CVs</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 border-2 border-slate-200 transition hover:shadow-lg">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Free</h3>
              <p className="text-slate-600 mb-6">Perfect for trying it out</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-slate-900">10</span>
                <span className="text-slate-600"> CVs</span>
              </div>
              <ul className="space-y-2 mb-8">
                <li className="flex gap-2 text-slate-600">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  Full analysis included
                </li>
                <li className="flex gap-2 text-slate-600">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  No credit card required
                </li>
              </ul>
              <button className="w-full bg-slate-100 text-slate-900 font-semibold py-3 rounded-lg cursor-default hover:bg-slate-200 transition">
                Get Started Free
              </button>
            </div>

            <div className="bg-white rounded-xl p-8 border-2 border-blue-600 relative shadow-lg transition">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Professional</h3>
              <p className="text-slate-600 mb-6">For growing teams</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-slate-900">100</span>
                <span className="text-slate-600"> CVs</span>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-6">€50</div>
              <ul className="space-y-2 mb-8">
                <li className="flex gap-2 text-slate-600">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  Everything in Free
                </li>
                <li className="flex gap-2 text-slate-600">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  100 CV analyses
                </li>
                <li className="flex gap-2 text-slate-600">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  One-time payment
                </li>
              </ul>
              <button
                onClick={handleDownload}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
              >
                Get Started
              </button>
            </div>

            <div className="bg-white rounded-xl p-8 border-2 border-slate-200 transition hover:shadow-lg">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Enterprise</h3>
              <p className="text-slate-600 mb-6">For large organizations</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-slate-900">1000</span>
                <span className="text-slate-600"> CVs</span>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-6">€300</div>
              <ul className="space-y-2 mb-8">
                <li className="flex gap-2 text-slate-600">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  Everything in Professional
                </li>
                <li className="flex gap-2 text-slate-600">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  1000 CV analyses
                </li>
                <li className="flex gap-2 text-slate-600">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  Best value
                </li>
              </ul>
              <button
                onClick={handleDownload}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Download AI CV Scanner now and analyze your first 10 CVs completely free. No credit card, no registration hassles.
          </p>
          <button
            onClick={handleDownload}
            className="bg-white hover:bg-blue-50 text-blue-600 font-semibold px-8 py-4 rounded-lg transition text-lg inline-flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Download className="w-5 h-5" />
            Download for Windows
          </button>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">About</h3>
              <p className="text-sm">AI CV Scanner - Privacy-first CV ranking for modern HR.</p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Features</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition">Local Processing</a></li>
                <li><a href="#why" className="hover:text-white transition">GDPR Compliant</a></li>
                <li><a href="#pricing" className="hover:text-white transition">Free Trial</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="mailto:support@aicvscanner.com" className="hover:text-white transition">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>Copyright 2026 AI CV Scanner. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
