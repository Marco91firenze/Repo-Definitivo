import React, { useState } from 'react';

function App() {
  const [isDownloading, setIsDownloading] = useState(false);
  
  // The exact URL to the binary file asset
  const DOWNLOAD_URL = "https://github.com/Marco91firenze/Repo-Definitivo/releases/download/v1.0.0/CV%20Fit%20Check%20Setup%201.0.0.exe";
  const FILE_NAME = "CV Fit Check Setup 1.0.0.exe";

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Fetching the file as a blob forces the browser to bypass the 'Page Redirect'
      const response = await fetch(DOWNLOAD_URL);
      const blob = await response.blob();
      
      // Create a local URL for the downloaded blob
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', FILE_NAME);
      
      // Append, trigger, and cleanup
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // Fallback: If fetch is blocked by CORS, open in a new tab as a last resort
      window.location.assign(DOWNLOAD_URL);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#0f172a',
      color: 'white',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '10px' }}>
        CV Fit Check
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '1.25rem', marginBottom: '40px' }}>
        Professional Desktop Analysis Tool
      </p>
      
      <button 
        onClick={handleDownload}
        disabled={isDownloading}
        style={{
          backgroundColor: isDownloading ? '#475569' : '#2563eb',
          color: 'white',
          padding: '18px 56px',
          borderRadius: '9999px',
          border: 'none',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          cursor: isDownloading ? 'not-allowed' : 'pointer',
          boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.4)',
          transition: 'all 0.2s ease'
        }}
      >
        {isDownloading ? 'Starting Download...' : 'Download for Windows'}
      </button>
      
      <div style={{ marginTop: '50px', color: '#475569', fontSize: '0.85rem' }}>
        v1.0.0 • Direct Installer (.exe)
      </div>
    </div>
  );
}

export default App;

export default App;
