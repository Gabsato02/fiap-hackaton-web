import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Sales from './presentation/views/Sales.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Sales />
  </StrictMode>,
);
