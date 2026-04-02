import React from 'react';

function App() {
  // FIXED URL: GitHub Release assets often use dots or dashes. 
  // Replacing spaces with dots to match the standard output of electron-builder.
  const DOWNLOAD_URL = "https://github.com/Marco91firenze/Repo-Definitivo/releases/download/v1.0.0/CV.Fit.Check.Setup.1.0.0.exe";

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = DOWNLOAD_URL;
    // This attribute hints to the browser to download the file immediately
    link.setAttribute('download', 'CV.Fit.Check.Setup.1.0.0.exe');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{
      backgroundColor: '#0f172a',
      color: 'white',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ 
          fontSize: '4rem', 
          fontWeight: '900', 
          margin: '0',
          background: 'linear-gradient(to right, #60a5fa, #3b82f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          CV Fit Check
        </h1>
        <p style={{ fontSize: '1.5rem', color: '#94a3b8', marginTop: '10px' }}>
          Professional Desktop Analysis Platform
        </p>
      </header>

      <main style={{ textAlign: 'center' }}>
        <button 
          onClick={handleDownload}
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '20px 60px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'transform 0.2s, background-color 0.2s',
            boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.4)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#1d4ed8';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Download for Windows
        </button>
        
        <p style={{ marginTop: '25px', color: '#64748b', fontSize: '0.9rem' }}>
          Latest Version: 1.0.0 (.exe)
        </p>
      </main>

      <footer style={{ position: 'absolute', bottom: '30px', color: '#334155' }}>
        &copy; 2024 CV Fit Check. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
