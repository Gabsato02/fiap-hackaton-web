import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './presentation/layout/App.jsx';
import CssBaseline from '@mui/material/CssBaseline';
import { initializeApp } from 'firebase/app';
import { ThemeProvider } from '@mui/material';
import { mainTheme } from './presentation/themes';

const firebaseConfig = {
  apiKey: 'AIzaSyA73aVkVYsp3JD7jOs_Yylimq4vY9IxvEo',
  authDomain: 'fiap-m05-hackaton.firebaseapp.com',
  projectId: 'fiap-m05-hackaton',
  storageBucket: 'fiap-m05-hackaton.firebasestorage.app',
  messagingSenderId: '401659988517',
  appId: '1:401659988517:web:fe278a599fd1aaadad8dcc',
};

initializeApp(firebaseConfig);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={mainTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
