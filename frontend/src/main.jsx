
import { createRoot } from 'react-dom/client'
import '@/styles/index.css'
import App from '@/App.jsx'
import { StrictMode } from 'react'
import AuthProvider from './context/AuthProvider'
import ThemeProvider from './context/ThemeContext'

// Initialize auth state on app load

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
         <AuthProvider>
            <App />
         </AuthProvider>
    </ThemeProvider>
  </StrictMode>
)

