import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { DocumentProvider } from './context/DocumentContext.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <DocumentProvider>
          <App />
        </DocumentProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
