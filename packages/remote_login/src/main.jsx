import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'firebaseui/dist/firebaseui.css';
import Login from './presentation/views/Login';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Login />
  </StrictMode>
);
