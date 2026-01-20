import { createRoot } from 'react-dom/client'
import '@/styles/index.css'
// Initialize i18n before app loads
import '@/i18n'
import App from '@/App.jsx'
import { StrictMode } from 'react'
import AuthProvider from './context/AuthProvider'
import ThemeProvider from './context/ThemeContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
)


