import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Goals from './presentation/views/Goals.tsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Elemento 'root' não encontrado no DOM.");
}

createRoot(rootElement).render(
  <StrictMode>
    <Goals />
  </StrictMode>,
);
