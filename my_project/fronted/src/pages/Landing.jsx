import { useNavigate } from 'react-router-dom';
import { Brain, FileText, MessageSquare, Zap, Upload, CheckCircle, ArrowRight, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Landing() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-950 text-white' : 'bg-slate-50 text-gray-900'}`}>

      {/* Header */}
      <header className={`sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b backdrop-blur-md transition-colors duration-300 ${isDark ? 'border-gray-800 bg-gray-950/80' : 'border-gray-200 bg-white/80'}`}>
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <Brain className="text-violet-500 group-hover:text-violet-400 transition-colors" size={28} />
          <span className="text-xl font-bold tracking-tight">DocuMind AI</span>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className={`p-2 rounded-full cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 ${isDark ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button
            onClick={() => navigate('/login')}
            className={`hidden sm:block px-4 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            Login
          </button>
          
          <button
            onClick={() => navigate('/signup')}
            className="px-5 py-2.5 text-sm font-semibold bg-violet-600 hover:bg-violet-700 active:scale-95 text-white rounded-lg shadow-sm cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
          >
            Get Started
          </button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center px-6 py-24 md:py-32 max-w-5xl mx-auto">
          <div className={`inline-flex items-center gap-2 text-sm px-4 py-1.5 rounded-full mb-8 font-medium shadow-sm border cursor-default transition-colors ${isDark ? 'bg-violet-500/10 border-violet-500/20 text-violet-300' : 'bg-violet-50 border-violet-100 text-violet-700'}`}>
            <Zap size={16} className={isDark ? 'text-violet-400' : 'text-violet-500'} />
            AI-Powered Document Intelligence
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
            Have a Conversation with Your <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-500 to-fuchsia-500">Documents</span>
          </h1>

          <p className={`text-lg md:text-xl max-w-2xl mb-10 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Upload any PDF or image and ask AI anything. Instantly analyze your resume, match it to job descriptions, and extract vital insights in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-4 bg-violet-600 hover:bg-violet-700 active:scale-95 text-white rounded-xl font-semibold shadow-lg shadow-violet-500/25 cursor-pointer transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
            >
              Try for Free <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate('/login')}
              className={`px-8 py-4 rounded-xl font-semibold border cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-violet-500 ${isDark ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100 bg-white'}`}
            >
              Login Now
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className={`py-24 px-6 border-y transition-colors duration-300 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Features</h2>
              <p className={`max-w-2xl mx-auto text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Everything you need to extract data, understand content, and optimize your professional documents.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Feature 1 */}
              <div className={`p-8 rounded-2xl border cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isDark ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:shadow-violet-900/20' : 'bg-slate-50 border-gray-200 hover:bg-white hover:shadow-violet-500/10'}`}>
                <div className="w-14 h-14 bg-violet-600 rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                  <Upload size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Smart Uploads</h3>
                <p className={`leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Upload PDFs or images seamlessly with intuitive drag & drop support. We handle the heavy lifting of extraction.
                </p>
              </div>

              {/* Feature 2 */}
              <div className={`p-8 rounded-2xl border cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isDark ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:shadow-violet-900/20' : 'bg-slate-50 border-gray-200 hover:bg-white hover:shadow-violet-500/10'}`}>
                <div className="w-14 h-14 bg-violet-600 rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                  <MessageSquare size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Interactive AI Chat</h3>
                <p className={`leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Ask specific questions about your document's content. Our AI analyzes the text and provides accurate, context-aware answers.
                </p>
              </div>

              {/* Feature 3 */}
              <div className={`p-8 rounded-2xl border cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isDark ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:shadow-violet-900/20' : 'bg-slate-50 border-gray-200 hover:bg-white hover:shadow-violet-500/10'}`}>
                <div className="w-14 h-14 bg-violet-600 rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                  <FileText size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Resume Analyzer</h3>
                <p className={`leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Instantly calculate your ATS score and compare your resume against target job descriptions to improve your match rate.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              How It Works
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-4 relative">
              
              {/* Connecting Timeline (Desktop only) */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-800 -z-10 -translate-y-12"></div>

              {[
                { step: '01', title: 'Upload Document', desc: 'Securely upload your PDF or image files to the platform.', icon: <Upload size={24} /> },
                { step: '02', title: 'AI Processing', desc: 'Our engine quickly extracts and analyzes the internal text.', icon: <Brain size={24} /> },
                { step: '03', title: 'Get Answers', desc: 'Ask questions and receive instant, precise insights.', icon: <CheckCircle size={24} /> },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center relative w-full md:w-1/3 bg-transparent cursor-default">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg transform transition-transform hover:scale-105 ${isDark ? 'bg-gray-800 border-2 border-violet-500/30' : 'bg-white border-2 border-violet-100'}`}>
                    <div className="w-14 h-14 bg-violet-600 rounded-xl flex items-center justify-center">
                      {item.icon}
                    </div>
                  </div>
                  <span className="text-violet-500 text-sm font-mono font-bold mb-2 tracking-wider">STEP {item.step}</span>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className={`text-base px-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.desc}</p>
                </div>
              ))}

            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={`py-10 border-t text-sm transition-colors duration-300 ${isDark ? 'border-gray-800 bg-gray-950 text-gray-500' : 'border-gray-200 bg-slate-50 text-gray-500'}`}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2 cursor-pointer hover:text-violet-500 transition-colors" onClick={() => navigate('/')}>
            <Brain size={20} className="text-violet-500" />
            <span className="font-semibold text-gray-900 dark:text-gray-300">DocuMind AI</span>
          </div>
          <p>Built with ❤️ by Manav Patel © {new Date().getFullYear()}</p>
          <div className="flex gap-4 justify-center">
            <span className="cursor-pointer hover:text-violet-500 transition-colors">Privacy Policy</span>
            <span className="cursor-pointer hover:text-violet-500 transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>

    </div>
  );
}