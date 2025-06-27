import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Stock from './presentation/views/Stock.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Stock />
  </StrictMode>,
);
