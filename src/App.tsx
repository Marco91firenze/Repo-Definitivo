import React from 'react';
import { LandingPage } from './pages/LandingPage';

function App() {
  const DOWNLOAD_URL = "https://github.com/Marco91firenze/Repo-Definitivo/releases/download/v1.0.0/CV%20Fit%20Check%20Setup%201.0.0.exe";

  const handleDownload = () => {
    // Force the browser to download the file
    const link = document.createElement('a');
    link.href = DOWNLOAD_URL;
    link.setAttribute('download', 'CV Fit Check Setup 1.0.0.exe');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // We are replacing the hard-coded blue div with the LandingPage component
  return (
    <LandingPage onDownload={handleDownload} />
  );
}

export default App;
