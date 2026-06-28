import { createContext, useContext, useState } from 'react'

const ChatbotContext = createContext()

export const ChatbotProvider = ({ children }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
     content:`Hello! I'm DocuMind AI. Ask me anything about your documents! 😊`
    }
  ])

  const addMessage = (message) => {
    setMessages(prev => [...prev, message])
  }

  const updateLastMessage = (content) => {
    setMessages(prev => {
      const updated = [...prev]
      updated[updated.length - 1] = {
        ...updated[updated.length - 1],
        content: updated[updated.length - 1].content + content
      }
      return updated
    })
  }

  const clearMessages = () => {
    setMessages([{
      role: 'assistant',
    content:`Hello! I'm DocuMind AI. Ask me anything about your documents! 😊`
    }])
  }

  return (
    <ChatbotContext.Provider value={{
      messages,
      addMessage,
      updateLastMessage,
      clearMessages
    }}>
      {children}
    </ChatbotContext.Provider>
  )
}

export const useChatbot = () => useContext(ChatbotContext)