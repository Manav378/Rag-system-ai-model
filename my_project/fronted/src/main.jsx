import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { DocumentProvider } from './context/DocumentContext.jsx'
import { ChatbotProvider } from './context/chatbotContext.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <DocumentProvider>
          <ChatbotProvider>
          <App />
          </ChatbotProvider>
        </DocumentProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
