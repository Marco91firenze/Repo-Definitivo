import React from 'react';

function App() {
  // This URL automatically points to the latest .exe released by your GitHub Action
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
          The ultimate desktop experience for managing your data. Fast, secure, and cross-platform.
        </p>
      </header>

      <main className="flex flex-col items-center">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="Status: 4,7-16 11 11 11-4-7m0 0l-4 4m4-4v12" />
            </svg>
          </div>
          
          <button
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-blue-600/30"
          >
            Download for Windows
          </button>
          
          <p className="mt-4 text-sm text-slate-500">
            Version 1.0.0 • .exe installer
          </p>
        </div>

        <section className="mt-16
