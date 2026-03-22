import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { pingBackend } from './constants';
pingBackend();

<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
  <App />
</GoogleOAuthProvider>
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="611193245733-kseucvrcu8uif2tn9b4aop2bllit941d.apps.googleusercontent.com">
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
// Keep backend alive
setInterval(async () => {
  try { await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/`); } catch {}
}, 10 * 60 * 1000);