import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Stock from './presentation/views/Stock.js';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <Stock />
    </StrictMode>,
  );
} else {
  throw new Error("Root element with id 'root' not found.");
}
