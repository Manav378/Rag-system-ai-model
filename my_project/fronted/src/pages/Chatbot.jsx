import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { Send, Bot, User, Trash2 } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { toast } from 'react-toastify'
import { useChatbot } from '../context/chatbotContext.jsx'
import MarkdownRenderer from '../components/MarkDownRenderer.jsx'

const Chatbot = () => {
  const { messages, addMessage, updateLastMessage, clearMessages } = useChatbot()
  const { theme } = useTheme()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    addMessage({ role: 'user', content: input })
    setInput('')
    setLoading(true)
    addMessage({ role: 'assistant', content: '' })

    try {
      const history = messages.slice(-10).map(m => ({
        role: m.role,
        content: m.content
      }))

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/chatbot/chatbot-stream`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ message: input, history })
        }
      )

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n\n').filter(Boolean)

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.replace('data: ', ''))
            if (data.done) { setLoading(false); break }
            updateLastMessage(data.content)
          }
        }
      }

    } catch (error) {
      toast.error('Response nahi aaya!')
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => clearMessages()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto w-full">

      {/* Header */}
      <div className={`flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b rounded-t-2xl 
        ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-violet-600 rounded-full flex items-center justify-center">
            <Bot size={16} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-sm">DocuMind AI</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`}>
              Online
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className={`flex items-center gap-1.5 sm:gap-2 text-sm px-2.5 sm:px-3 py-1.5 rounded-xl transition
            ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          <Trash2 size={14} />
          <span className="hidden sm:inline text-xs">Clear</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex flex-col gap-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2 sm:gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0
              ${msg.role === 'user' ? 'bg-violet-600' : 'bg-gray-700'}`}
            >
              {msg.role === 'user'
                ? <User size={13} className="text-white" />
                : <Bot size={13} className="text-white" />
              }
            </div>

            {/* Bubble */}
            <div className={`max-w-[88%] sm:max-w-[80%] md:max-w-[75%] px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-sm
              ${msg.role === 'user'
                ? 'bg-violet-600 text-white rounded-tr-none'
                : theme === 'dark'
                  ? 'bg-gray-800 text-gray-200 rounded-tl-none'
                  : 'bg-gray-100 text-gray-800 rounded-tl-none'
              }`}
            >
              {msg.role === 'assistant'
                ? <MarkdownRenderer content={msg.content} />
                : msg.content
              }
            </div>
          </div>
        ))}

        {/* Typing Animation */}
        {loading && messages[messages.length - 1]?.content === '' && (
          <div className="flex gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <Bot size={13} className="text-white" />
            </div>
            <div className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl rounded-tl-none 
              ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <div className="flex gap-1 items-center h-4 sm:h-5">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-violet-400 rounded-full animate-bounce" 
                  style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-violet-400 rounded-full animate-bounce" 
                  style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-violet-400 rounded-full animate-bounce" 
                  style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className={`px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t 
        ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className={`flex gap-2 sm:gap-3 items-end rounded-2xl border px-3 sm:px-4 py-2.5 sm:py-3
          ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'}`}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Kuch bhi poocho..."
            rows={1}
            className="flex-1 bg-transparent resize-none outline-none text-sm max-h-28 sm:max-h-32"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="p-1.5 sm:p-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl transition"
          >
            <Send size={15} />
          </button>
        </div>
        <p className={`text-xs mt-1.5 sm:mt-2 text-center 
          ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
          Enter to send • Shift+Enter for new line
        </p>
      </div>

    </div>
  )
}

export default Chatbot