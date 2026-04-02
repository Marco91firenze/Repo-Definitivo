import React from 'react';

function App() {
  const DOWNLOAD_URL = "https://github.com/Marco91firenze/Repo-Definitivo/releases/download/v1.0.0/CV%20Fit%20Check%20Setup%201.0.0.exe";

  const handleDownload = () => {
    window.location.href = DOWNLOAD_URL;
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
      <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '10px' }}>CV Fit Check</h1>
      <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginBottom: '30px' }}>Desktop Analysis Tool</p>
      
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
          boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.4)'
        }}
      >
        Download for Windows
      </button>
      
      <footer style={{ marginTop: '50px', color: '#475569', fontSize: '0.9rem' }}>
        v1.0.0 • Verified Installer
      </footer>
    </div>
  );
}

export default App;
