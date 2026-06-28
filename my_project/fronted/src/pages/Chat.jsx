import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Send, Copy, Trash2, FileText, Bot, User } from 'lucide-react'
import { toast } from 'react-toastify'
import api from '../api/axios'
import { useTheme } from '../context/ThemeContext'
import { useDocuments } from '../context/DocumentContext'
import MarkdownRenderer from '../components/MarkDownRenderer.jsx'
const Chat = () => {
  const { fileId } = useParams()
  const { theme } = useTheme()
  const { document } = useDocuments()
  const [message, setMessage] = useState([])
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const bottomRef = useRef(null)

  // Current document info
  const currentDoc = document.find(doc => doc.fileId === fileId)

  // Chat history fetch karo
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/chat/${fileId}`)
        setMessage(res.data.message)
      } catch (error) {
        toast.error('Failed to load chat history!')
      } finally {
        setFetching(false)
      }
    }
    fetchHistory()
  }, [fileId])

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [message])


  //send message
  const sendMessage = async () => {
    if (!question.trim() || loading) return

    const userMessage = { role: 'user', content: question }
    setMessage(prev => [...prev, userMessage])
    setQuestion('')
    setLoading(true)

    // Empty assistant message add karo
    setMessage(prev => [...prev, { role: 'assistant', content: '' }])

    try {
      console.log(question, fileId, fileId)
      const response = await fetch('http://localhost:5000/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',  // cookies ke liye
        body: JSON.stringify({
          question,
          fileId,
          fileName: fileId
        })
      })

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

            if (data.done) {
              setLoading(false)
              break
            }

            // Last message update karo — ek ek word add karo
            setMessage(prev => {
              const updated = [...prev]
              const last = updated[updated.length - 1]
              updated[updated.length - 1] = {
                ...last,
                content: last.content + data.content
              }
              return updated
            })
          }
        }
      }

    } catch (error) {
      toast.error('Answer nahi aaya!')
      setMessage(prev => prev.slice(0, -2))
    } finally {
      setLoading(false)
    }
  }

  // Send on Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Copy answer
  const copyMessage = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied successfully!')
  }

  // Clear chat
  const clearChat = async () => {
    try {
      await api.delete(`/chat/${fileId}`)
      setMessage([])
      toast.success('Chat clear ho gaya!')
    } catch (error) {
      toast.error('Clear nahi hua!')
    }
  }

  // Suggested questions
  const suggestedQuestions = [
    'Summarize this document',
    'What are the main points?',
    'What skills are mentioned?',
  ]

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] gap-4">

      {/* Left — Document Info. Hidden on mobile to give the chat full space, visible from md breakpoint up */}
      <div className={`hidden md:flex w-64 shrink-0 rounded-2xl border p-5 flex-col gap-4 ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>

        {/* Doc Info */}
        <div>
          <div className="w-12 h-12 bg-violet-600/20 rounded-xl flex items-center justify-center mb-3">
            <FileText size={22} className="text-violet-400" />
          </div>
          <p className="font-semibold text-sm truncate">
            {currentDoc?.originalName || fileId}
          </p>
          <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            {currentDoc?.uploadedAt
              ? new Date(currentDoc.uploadedAt).toLocaleDateString('en-IN')
              : ''}
          </p>
        </div>

        {/* Divider */}
        <div className={`border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`} />

        {/* Suggested Questions */}
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            Suggested Questions
          </p>
          <div className="flex flex-col gap-2">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => setQuestion(q)}
                className={`text-left text-xs px-3 py-2 rounded-xl transition ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Clear Chat */}
        <button
          onClick={clearChat}
          className="mt-auto flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition"
        >
          <Trash2 size={16} />
          Clear Chat
        </button>
      </div>

      {/* Right — Chat */}
      <div className={`flex-1 rounded-2xl border flex flex-col min-h-0 ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>

        {/* Chat Header */}
        <div className={`px-4 md:px-6 py-4 border-b flex items-center gap-3 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
          <Bot size={20} className="text-violet-400" />
          <span className="font-semibold">DocuMind AI</span>
          <span className={`text-xs ml-auto ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            {message.length / 2} questions asked
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 flex flex-col gap-4">

          {/* Fetching */}
          {fetching ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-violet-500" />
            </div>
          ) : message.length === 0 ? (

            /* Empty State */
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-4">
              <Bot size={40} className="text-gray-500" />
              <p className="font-semibold">Ask a question!!</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                Try the suggested questions on the left
              </p>
            </div>

          ) : (
            message.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-violet-600' : 'bg-gray-700'}`}>
                  {msg.role === 'user'
                    ? <User size={16} className="text-white" />
                    : <Bot size={16} className="text-white" />
                  }
                </div>

                {/* Message Bubble — wider on mobile since there's no side panel taking up space */}
                <div className={`relative max-w-[85%] md:max-w-[75%] px-4 py-3 rounded-2xl text-sm group
                  ${msg.role === 'user'
                    ? 'bg-violet-600 text-white rounded-tr-none'
                    : theme === 'dark'
                      ? 'bg-gray-800 text-gray-200 rounded-tl-none'
                      : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}
                >
                  {/* Baad mein ✅ — sirf assistant ke liye */}
                  {msg.role === 'assistant'
                    ? <MarkdownRenderer content={msg.content} />
                    : msg.content
                  }
                  {/* Copy Button */}
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => copyMessage(msg.content)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
                    >
                      <Copy size={13} className="text-gray-400 hover:text-white" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}

          {/* Typing Animation */}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div className={`px-4 py-3 rounded-2xl rounded-tl-none ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <div className="flex gap-1 items-center h-5">
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className={`px-4 md:px-6 py-4 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className={`flex gap-3 items-end rounded-2xl border px-4 py-3 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'}`}>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question... (Press Enter to send)"
              rows={1}
              className="flex-1 bg-transparent resize-none outline-none text-sm max-h-32"
            />
            <button
              onClick={sendMessage}
              disabled={!question.trim() || loading}
              className="p-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition"
            >
              <Send size={17} />
            </button>
          </div>
          <p className={`text-xs mt-2 text-center ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
            Enter to send • Shift+Enter for new line
          </p>
        </div>

      </div>
    </div>
  )
}

export default Chat