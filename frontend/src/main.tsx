import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Keep backend alive — ping every 10 minutes
setInterval(async () => {
  try {
    const baseUrl = import.meta.env.VITE_API_URL || 'https://expense-tracker-89aa.onrender.com';
    await fetch(`${baseUrl}/`);
  } catch {}
}, 10 * 60 * 1000);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="611193245733-kseucvrcu8uif2tn9b4aop2bllit941d.apps.googleusercontent.com">
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);