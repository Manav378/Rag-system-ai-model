import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Sun, Moon, Eye, EyeOff, ArrowRight, Zap, Mail, Lock, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios.js';

export default function AuthPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { login } = useAuth();
  const isDark = theme === 'dark';

  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const isLogin = mode === 'login';

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isLogin && form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/signup';
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const res = await api.post(endpoint, payload);
      login(res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(isLogin ? 'signup' : 'login');
    setError('');
    setForm({ name: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 select-none ${
        isDark ? 'bg-gray-950 text-white' : 'bg-slate-50 text-gray-900'
      }`}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b backdrop-blur-md transition-colors duration-300 ${
          isDark ? 'border-gray-800 bg-gray-950/80' : 'border-gray-200 bg-white/80'
        }`}
      >
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <Brain className="text-violet-500 group-hover:text-violet-400 transition-colors" size={28} />
          <span className="text-xl font-bold tracking-tight">DocuMind AI</span>
        </div>

        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className={`p-2 rounded-full cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
            isDark
              ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      {/* Main */}
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">

          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div
              className={`inline-flex items-center gap-2 text-sm px-4 py-1.5 rounded-full font-medium shadow-sm border ${
                isDark
                  ? 'bg-violet-500/10 border-violet-500/20 text-violet-300'
                  : 'bg-violet-50 border-violet-100 text-violet-700'
              }`}
            >
              <Zap size={14} className={isDark ? 'text-violet-400' : 'text-violet-500'} />
              {isLogin ? 'Welcome back' : 'Start for free today'}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-center tracking-tight mb-2">
            {isLogin ? 'Sign in to ' : 'Create your '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-500 to-fuchsia-500">
              DocuMind
            </span>
          </h1>
          <p
            className={`text-center text-sm mb-8 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {isLogin
              ? "Don't have an account? "
              : 'Already have an account? '}
            <button
              onClick={switchMode}
              className="text-violet-500 hover:text-violet-400 font-semibold cursor-pointer transition-colors focus:outline-none"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>

          {/* Card */}
          <div
            className={`rounded-2xl border p-8 shadow-xl transition-colors duration-300 ${
              isDark
                ? 'bg-gray-900 border-gray-800 shadow-black/40'
                : 'bg-white border-gray-200 shadow-gray-200/60'
            }`}
          >
            {/* Error */}
            {error && (
              <div className="mb-5 px-4 py-3 rounded-lg text-sm bg-red-500/10 border border-red-500/20 text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              {/* Name (signup only) */}
              {!isLogin && (
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="name"
                    className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      size={16}
                      className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                        isDark ? 'text-gray-500' : 'text-gray-400'
                      }`}
                    />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required={!isLogin}
                      placeholder="Manav Patel"
                      value={form.name}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm border outline-none transition-all focus:ring-2 focus:ring-violet-500 ${
                        isDark
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                          : 'bg-slate-50 border-gray-300 text-gray-900 placeholder-gray-400'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    }`}
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm border outline-none transition-all focus:ring-2 focus:ring-violet-500 ${
                      isDark
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                        : 'bg-slate-50 border-gray-300 text-gray-900 placeholder-gray-400'
                    }`}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    Password
                  </label>
                  {isLogin && (
                    <button
                      type="button"
                      className="text-xs text-violet-500 hover:text-violet-400 cursor-pointer transition-colors focus:outline-none"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock
                    size={16}
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    }`}
                  />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    required
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-11 py-3 rounded-xl text-sm border outline-none transition-all focus:ring-2 focus:ring-violet-500 ${
                      isDark
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                        : 'bg-slate-50 border-gray-300 text-gray-900 placeholder-gray-400'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className={`absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer transition-colors focus:outline-none ${
                      isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                    }`}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (signup only) */}
              {!isLogin && (
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="confirmPassword"
                    className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                        isDark ? 'text-gray-500' : 'text-gray-400'
                      }`}
                    />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirm ? 'text' : 'password'}
                      autoComplete="new-password"
                      required={!isLogin}
                      placeholder="••••••••"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-11 py-3 rounded-xl text-sm border outline-none transition-all focus:ring-2 focus:ring-violet-500 ${
                        isDark
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                          : 'bg-slate-50 border-gray-300 text-gray-900 placeholder-gray-400'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className={`absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer transition-colors focus:outline-none ${
                        isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                      }`}
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-violet-600 hover:bg-violet-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl shadow-lg shadow-violet-500/25 cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                {loading ? (
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Bottom switch */}
          <p className={`text-center text-xs mt-6 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            By continuing, you agree to DocuMind's{' '}
            <span className="cursor-pointer text-violet-500 hover:text-violet-400 transition-colors">
              Terms of Service
            </span>{' '}
            and{' '}
            <span className="cursor-pointer text-violet-500 hover:text-violet-400 transition-colors">
              Privacy Policy
            </span>
            .
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`py-6 border-t text-sm transition-colors duration-300 ${
          isDark
            ? 'border-gray-800 bg-gray-950 text-gray-600'
            : 'border-gray-200 bg-slate-50 text-gray-400'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-center gap-1">
          <Brain size={16} className="text-violet-500" />
          <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>
            DocuMind AI © {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </div>
  );
}