import React from 'react';

function App() {
  const LATEST_RELEASE_URL = "https://github.com/Marco91firenze/Repo-Definitivo/releases/latest/download/cval-client-setup.exe";

  const handleDownload = () => {
    window.location.href = LATEST_RELEASE_URL;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          CVAL Client
        </h1>
        <p className="text-xl text-slate-400 max-w-md mx-auto">
          The ultimate desktop experience for managing your data.
        </p>
      </header>

      <main className="flex flex-col items-center">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 flex flex-col items-center">
          <button
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-blue-600/30"
          >
            Download for Windows
          </button>
          <p className="mt-4 text-sm text-slate-500">Version 1.0.0 • .exe</p>
        </div>

        <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          <div className="text-center">
            <h3 className="font-bold text-lg mb-2">High Performance</h3>
            <p className="text-slate-400 text-sm">Built with Vite and Electron.</p>
          </div>
          <div className="text-center">
            <h3 className="font-bold text-lg mb-2">Secure</h3>
            <p className="text-slate-400 text-sm">Local data encryption.</p>
          </div>
          <div className="text-center">
            <h3 className="font-bold text-lg mb-2">Auto Updates</h3>
            <p className="text-slate-400 text-sm">Seamless background updates.</p>
          </div>
        </section>
      </main>

      <footer className="mt-20 text-slate-600 text-sm">
        © 2024 CVAL Client.
      </footer>
    </div>
  );
}

export default App;
