import React from 'react';

function App() {
  const GITHUB_USER = "Marco91firenze";
  const GITHUB_REPO = "Repo-Definitivo";
  const DOWNLOAD_URL = `https://github.com/${GITHUB_USER}/${GITHUB_REPO}/releases/latest/download/cval-client-setup.exe`;

  const handleDownload = () => {
    window.open(DOWNLOAD_URL, '_blank');
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
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '0.5rem', fontWeight: '800' }}>CVAL</h1>
      <p style={{ color: '#94a3b8', fontSize: '1.25rem', marginBottom: '2rem' }}>The Definitivo Desktop Client</p>
      
      <button 
        onClick={handleDownload}
        style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: '18px 48px',
          borderRadius: '50px',
          border: 'none',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.2s',
          boxShadow: '0 10px 20px -5px rgba(59, 130, 246, 0.5)'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        Download for Windows
      </button>
      
      <footer style={{ marginTop: '50px', color: '#475569' }}>
        v1.0.0 • Verified Build
      </footer>
    </div>
  );
}

export default App;
