import React from 'react';

function App() {
  const downloadUrl = "https://github.com/Marco91firenze/Repo-Definitivo/releases/latest/download/cval-client-setup.exe";

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
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>CVAL Client</h1>
      <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Professional Data Management Desktop App</p>
      
      <a 
        href={downloadUrl}
        style={{
          backgroundColor: '#2563eb',
          color: 'white',
          padding: '15px 40px',
          borderRadius: '30px',
          textDecoration: 'none',
          fontWeight: 'bold',
          transition: 'transform 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        Download for Windows
      </a>
      
      <div style={{ marginTop: '50px', color: '#475569', fontSize: '0.8rem' }}>
        v1.0.0 • Secure Installer
      </div>
    </div>
  );
}

export default App;
