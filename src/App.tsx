import React from 'react';

function App() {
  // Direct link to the specific file asset in your v1.0.0 release
  const DOWNLOAD_URL = "https://github.com/Marco91firenze/Repo-Definitivo/releases/download/v1.0.0/CV%20Fit%20Check%20Setup%201.0.0.exe";

  const handleDownload = () => {
    // Hidden anchor trick to force immediate download
    const link = document.createElement('a');
    link.href = DOWNLOAD_URL;
    link.download = 'CV Fit Check Setup 1.0.0.exe';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <h1 className="text-5xl font-extrabold mb-4 text-blue-400">CV Fit Check</h1>
      <p className="text-xl text-slate-400 mb-12">Professional Desktop Analysis Tool</p>
      
      <button 
        onClick={handleDownload}
        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-full transition-transform transform hover:scale-105 shadow-lg shadow-blue-500/30 border-none cursor-pointer"
      >
        Download for Windows
      </button>
      
      <div className="mt-12 text-sm text-slate-500">
        Current Version: 1.0.0
      </div>
    </div>
  );
}

export default App;
