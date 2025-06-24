import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Goals from './Goals.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Goals />
  </StrictMode>,
)
