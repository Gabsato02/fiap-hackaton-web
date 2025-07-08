import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './presentation/layout/App.tsx';
import CssBaseline from '@mui/material/CssBaseline';
import { initializeApp } from 'firebase/app';
import { ThemeProvider } from '@mui/material';
import { mainTheme } from './presentation/themes/index.ts';
import { FIREBASE_CONFIG } from './vars/index.ts';

initializeApp(FIREBASE_CONFIG);

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ThemeProvider theme={mainTheme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </StrictMode>,
  );
} else {
  throw new Error("Root element with id 'root' not found");
}
