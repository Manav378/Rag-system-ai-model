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
    // useState hatao messages ka — context se aayega
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const bottomRef = useRef(null)
    const sendMessage = async () => {
        if (!input.trim() || loading) return

        addMessage({ role: 'user', content: input })  // ← context
        setInput('')
        setLoading(true)
        addMessage({ role: 'assistant', content: '' }) // ← context

        try {
            const history = messages.slice(-10).map(m => ({
                role: m.role,
                content: m.content
            }))

            const response = await fetch('http://localhost:5000/api/chatbot/chatbot-stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ message: input, history })
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
                        if (data.done) { setLoading(false); break }
                        updateLastMessage(data.content) // ← context
                    }
                }
            }

        } catch (error) {
            toast.error('Response nahi aaya!')
        } finally {
            setLoading(false)
        }
    }

    // clearMessages context se use karo
    const clearChat = () => clearMessages()


    // Auto scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Enter key
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }





    return (
        <div className="flex flex-col h-[calc(100vh-64px)]">

            {/* Header */}
            <div className={`flex items-center justify-between px-4 md:px-6 py-4 border-b rounded-t-2xl ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-violet-600 rounded-full flex items-center justify-center">
                        <Bot size={18} className="text-white" />
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
                    className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl transition
            ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                    <Trash2 size={15} />
                    {/* Label hidden on very small screens, icon alone is enough */}
                    <span className="hidden sm:inline">Clear</span>
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 flex flex-col gap-4">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0
              ${msg.role === 'user' ? 'bg-violet-600' : 'bg-gray-700'}`}
                        >
                            {msg.role === 'user'
                                ? <User size={15} className="text-white" />
                                : <Bot size={15} className="text-white" />
                            }
                        </div>

                        {/* Bubble — wider on mobile so text has more room */}
                        <div className={`max-w-[85%] md:max-w-[75%] px-4 py-3 rounded-2xl text-sm
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
                        </div>
                    </div>
                ))}

                {/* Typing Animation */}
                {loading && messages[messages.length - 1]?.content === '' && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                            <Bot size={15} className="text-white" />
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

            {/* Input */}
            <div className={`px-4 md:px-6 py-4 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                <div className={`flex gap-3 items-end rounded-2xl border px-4 py-3
          ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'}`}
                >
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Kuch bhi poocho... (Enter to send)"
                        rows={1}
                        className="flex-1 bg-transparent resize-none outline-none text-sm max-h-32"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!input.trim() || loading}
                        className="p-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl transition"
                    >
                        <Send size={16} />
                    </button>
                </div>
                <p className={`text-xs mt-2 text-center ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
                    Enter to send • Shift+Enter for new line
                </p>
            </div>

        </div>
    )
}

export default Chatbot