import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Goals from './presentation/views/Goals.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Goals />
  </StrictMode>,
);
