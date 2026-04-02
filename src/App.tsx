import React from 'react';

function App() {
  const GITHUB_URL = "https://github.com/Marco91firenze/Repo-Definitivo/releases/download/v1.0.0/CV%20Fit%20Check%20Setup%201.0.0.exe";

  const downloadFile = () => {
    window.location.href = GITHUB_URL;
  };

  return (
    <div style={{ backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '3rem', margin: '0' }}>CV Fit Check</h1>
      <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Professional Analysis Tool</p>
      <button 
        onClick={downloadFile}
        style={{ backgroundColor: '#2563eb', color: 'white', padding: '12px 32px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
      >
        Download for Windows
      </button>
    </div>
  );
}

export default App;
