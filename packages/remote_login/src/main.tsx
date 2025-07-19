import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'firebaseui/dist/firebaseui.css';
import Login from './presentation/views/Login';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Elemento 'login' não encontrado no DOM.");
}

createRoot(rootElement).render(
  <StrictMode>
    <Login />
  </StrictMode>,
);
