import React from 'react';

function App() {
  // Direct Download Link - Optimized for GitHub Release v1.0.0
  const DOWNLOAD_URL = "https://github.com/Marco91firenze/Repo-Definitivo/releases/download/v1.0.0/CV%20Fit%20Check%20Setup%201.0.0.exe";

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = DOWNLOAD_URL;
    link.setAttribute('download', 'CV Fit Check Setup 1.0.0.exe');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      fontFamily: 'system-ui, -apple-system, sans-serif',
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
        style={{
          backgroundColor: '#2563eb',
          color: 'white',
          padding: '18px 56px',
          borderRadius: '9999px',
          border: 'none',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.4)',
          transition: 'background-color 0.2s ease'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
      >
        Download for Windows
      </button>
      
      <div style={{ marginTop: '50px', color: '#475569', fontSize: '0.85rem' }}>
        v1.0.0 • Direct Installer (.exe)
      </div>
    </div>
  );
}

export default App;
