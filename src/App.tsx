import React from 'react';

function App() {
  // This specific URL format triggers an immediate download ONCE a release exists.
  const LATEST_RELEASE_URL = "https://github.com/Marco91firenze/Repo-Definitivo/releases/latest/download/cval-client-setup.exe";

  const handleDownload = (e: React.MouseEvent) => {
    // We use a hidden anchor trick to force the browser to treat it as a download
    const link = document.createElement('a');
    link.href = LATEST_RELEASE_URL;
    link.download = 'cval-client-setup.exe';
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
      fontFamily: 'sans-serif' 
    }}>
      <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>CVAL</h1>
      <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginBottom: '2.5rem' }}>Secure Desktop Client</p>
      
      <button 
        onClick={handleDownload}
        style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: '16px 45px',
          borderRadius: '9999px',
          border: 'none',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.5)'
        }}
      >
        Download for Windows
      </button>
      
      <div style={{ marginTop: '40px', color: '#475569', fontSize: '0.9rem' }}>
        v1.0.0 • Official Installer
      </div>
    </div>
  );
}

export default App;
