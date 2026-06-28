import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy } from 'lucide-react'
import { toast } from 'react-toastify'
import { useTheme } from '../context/ThemeContext'

const MarkdownRenderer = ({ content }) => {
  const { theme } = useTheme()

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
    toast.success('Code copy ho gaya!')
  }

  return (
    <ReactMarkdown
      components={{

        // ── Code Block ──
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '')
          const codeString = String(children).replace(/\n$/, '')

          return !inline && match ? (
            <div className="relative my-2 rounded-xl overflow-hidden max-w-full">
              {/* Language + Copy Button */}
              <div className={`flex items-center justify-between px-3 sm:px-4 py-2 text-xs font-mono
                ${theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'}`}
              >
                <span>{match[1]}</span>
                <button
                  onClick={() => copyCode(codeString)}
                  className="flex items-center gap-1 hover:text-white transition"
                >
                  <Copy size={12} />
                  Copy
                </button>
              </div>

              {/* Code — overflow scroll */}
              <div className="overflow-x-auto max-w-full">
                <SyntaxHighlighter
                  style={theme === 'dark' ? oneDark : oneLight}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    borderRadius: 0,
                    fontSize: '0.75rem',
                    maxWidth: '100%',
                    wordBreak: 'break-word',
                  }}
                  {...props}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            </div>
          ) : (
            // Inline code
            <code
              className={`px-1.5 py-0.5 rounded text-xs font-mono break-all
                ${theme === 'dark' ? 'bg-gray-700 text-violet-300' : 'bg-gray-200 text-violet-600'}`}
              {...props}
            >
              {children}
            </code>
          )
        },

        // ── Headings ──
        h1: ({ children }) => (
          <h1 className="text-lg sm:text-xl font-bold mt-4 mb-2">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-base sm:text-lg font-bold mt-3 mb-2">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm sm:text-base font-semibold mt-2 mb-1">{children}</h3>
        ),

        // ── Paragraph ──
        p: ({ children }) => (
          <p className="mb-2 leading-relaxed text-sm sm:text-base break-words">{children}</p>
        ),

        // ── Lists ──
        ul: ({ children }) => (
          <ul className="list-disc list-inside mb-2 flex flex-col gap-1">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside mb-2 flex flex-col gap-1">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="text-xs sm:text-sm break-words">{children}</li>
        ),

        // ── Bold + Italic ──
        strong: ({ children }) => (
          <strong className="font-bold">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic">{children}</em>
        ),

        // ── Blockquote ──
        blockquote: ({ children }) => (
          <blockquote className={`border-l-4 border-violet-500 pl-3 sm:pl-4 my-2 italic text-sm
            ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
          >
            {children}
          </blockquote>
        ),

        // ── Table ──
        table: ({ children }) => (
          <div className="overflow-x-auto my-2 max-w-full">
            <table className={`w-full text-xs sm:text-sm border-collapse rounded-xl overflow-hidden
              ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
            >
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className={`px-2 sm:px-4 py-1.5 sm:py-2 text-left font-semibold border text-xs sm:text-sm
            ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'}`}
          >
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className={`px-2 sm:px-4 py-1.5 sm:py-2 border text-xs sm:text-sm
            ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
          >
            {children}
          </td>
        ),

        // ── Horizontal Rule ──
        hr: () => (
          <hr className={`my-3 sm:my-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`} />
        ),

      }}
    >
      {content}
    </ReactMarkdown>
  )
}

export default MarkdownRenderer