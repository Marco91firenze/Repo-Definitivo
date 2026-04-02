import React, { useState } from 'react';

function App() {
  const [isDownloading, setIsDownloading] = useState(false);
  const DOWNLOAD_URL = "https://github.com/Marco91firenze/Repo-Definitivo/releases/download/v1.0.0/CV%20Fit%20Check%20Setup%201.0.0.exe";

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(DOWNLOAD_URL);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'CV Fit Check Setup 1.0.0.exe');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      window.location.assign(DOWNLOAD_URL);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#0f172a', color: 'white', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold' }}>CV Fit Check</h1>
      <p style={{ color: '#94a3b8', marginBottom: '40px' }}>Professional Desktop Tool</p>
      <button 
        onClick={handleDownload}
        disabled={isDownloading}
        style={{ backgroundColor: isDownloading ? '#475569' : '#2563eb', color: 'white', padding: '18px 56px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
      >
        {isDownloading ? 'Downloading...' : 'Download for Windows'}
      </button>
    </div>
  );
}

export default App;
