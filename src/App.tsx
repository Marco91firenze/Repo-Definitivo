import React from 'react';

function App() {
  // Direct link to the specific file asset in your v1.0.0 release
  // We use the dot-separated name which is the standard output for electron-builder
  const DOWNLOAD_URL = "https://github.com/Marco91firenze/Repo-Definitivo/releases/download/v1.0.0/CV.Fit.Check.Setup.1.0.0.exe";

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    const link = document.createElement('a');
    link.href = DOWNLOAD_URL;
    link.setAttribute('download', 'CV.Fit.Check.Setup.1.0.0.exe');
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
      fontFamily: 'sans-serif',
      textAlign: 'center'
    }}>
      <h1 style={{ 
        fontSize: '3.5rem', 
        fontWeight: 'bold', 
        marginBottom: '10px' 
      }}>
        CV Fit Check
      </h1>
      
      <p style={{ 
        color: '#94a3b8', 
        fontSize: '1.2rem', 
        marginBottom: '30px' 
      }}>
        Desktop Analysis Tool
      </p>
      
      <button 
        onClick={handleDownload}
        style={{
          backgroundColor: '#2563eb',
          color: 'white',
          padding: '16px 48px',
          borderRadius: '50px',
          border: 'none',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.4)',
          transition: 'transform 0.2s, background-color 0.2s'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#1d4ed8';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#2563eb';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        Download for Windows
      </button>
      
      <footer style={{ 
        marginTop: '50px', 
        color: '#475569', 
        fontSize: '0.9rem' 
      }}>
        v1.0.0 • Verified Installer
      </footer>
    </div>
  );
}

export default App;
