import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Sales from './Sales.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Sales />
  </StrictMode>,
)
