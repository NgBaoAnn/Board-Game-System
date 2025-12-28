
import { createRoot } from 'react-dom/client'
import '@/styles/index.css'
import App from '@/App.jsx'
import { AuthProvider, ThemeProvider, GameProvider, BoardProvider, UserProvider } from '@/context'
import { StrictMode } from 'react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <GameProvider>
          <BoardProvider>
            <UserProvider>
              <App />
            </UserProvider>
          </BoardProvider>
        </GameProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
)

