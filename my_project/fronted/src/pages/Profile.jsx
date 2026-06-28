import { useState, useEffect } from 'react'
import { User, Mail, Calendar, FileText, MessageSquare, Lock, Trash2, LogOut } from 'lucide-react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const Profile = () => {
  const { user, logout } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: ''
  })
  const [changing, setChanging] = useState(false)

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/auth/stats')
        setStats(res.data)
      } catch (error) {
        toast.error('Stats failed to load!')
      }
    }
    fetchStats()
  }, [])

  // Change Password
  const handleChangePassword = async () => {
    if (!passwords.currentPassword || !passwords.newPassword) {
      return toast.error('Please fill both fields!')
    }
    setChanging(true)
    try {
      await api.put('/auth/change-password', passwords)
      toast.success('Password changed successfully! ✅')
      setShowPasswordForm(false)
      setPasswords({ currentPassword: '', newPassword: '' })
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred!')
    } finally {
      setChanging(false)
    }
  }

  // Delete Account
  const handleDeleteAccount = async () => {
    try {
      await api.delete('/auth/delete-account')
      toast.success('Account deleted successfully!')
      logout()
      navigate('/')
    } catch (error) {
      toast.error('Failed to delete account!')
    }
  }

  // Logout
  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const cardClass = `p-4 sm:p-6 rounded-2xl border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-4 px-4 sm:px-0">

      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Account settings and stats
        </p>
      </div>

      {/* User Info — stacks vertically on mobile, avatar centered */}
      <div className={cardClass}>
        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 bg-violet-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
              <Mail size={14} className="text-gray-500" />
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {user?.email}
              </span>
            </div>
            {stats?.memberSince && (
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                <Calendar size={14} className="text-gray-500" />
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Member since {new Date(stats.memberSince).toLocaleDateString('en-IN', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats — smaller icon/text gap on mobile so cards don't feel cramped */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className={`${cardClass} flex items-center gap-2 sm:gap-4`}>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-violet-600/20 rounded-xl flex items-center justify-center shrink-0">
            <FileText size={20} className="text-violet-400" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold">{stats?.totalDocuments ?? '—'}</p>
            <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Documents
            </p>
          </div>
        </div>

        <div className={`${cardClass} flex items-center gap-2 sm:gap-4`}>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-violet-600/20 rounded-xl flex items-center justify-center shrink-0">
            <MessageSquare size={20} className="text-violet-400" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold">{stats?.totalQuestions ?? '—'}</p>
            <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Questions Asked
            </p>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className={cardClass}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock size={20} className="text-violet-400 shrink-0" />
            <span className="font-semibold">Change Password</span>
          </div>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="text-sm text-violet-400 hover:text-violet-300 transition shrink-0"
          >
            {showPasswordForm ? 'Cancel' : 'Change'}
          </button>
        </div>

        {showPasswordForm && (
          <div className="mt-4 flex flex-col gap-3">
            <input
              type="password"
              placeholder="Current Password"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords(prev => ({ ...prev, currentPassword: e.target.value }))}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none
                ${theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                }`}
            />
            <input
              type="password"
              placeholder="New Password (min 6 characters)"
              value={passwords.newPassword}
              onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none
                ${theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                }`}
            />
            <button
              onClick={handleChangePassword}
              disabled={changing}
              className="py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition"
            >
              {changing ? 'Changing...' : 'Update Password'}
            </button>
          </div>
        )}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className={`${cardClass} flex items-center gap-3 w-full text-left hover:border-gray-600 transition`}
      >
        <LogOut size={20} className="text-orange-400 shrink-0" />
        <span className="font-semibold text-orange-400">Logout</span>
      </button>

      {/* Delete Account */}
      <div className={`${cardClass} border-red-500/30`}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <Trash2 size={20} className="text-red-400 shrink-0" />
              <span className="font-semibold text-red-400">Delete Account</span>
            </div>
            <p className={`text-xs mt-1 ml-8 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              This action is permanent — everything will be deleted
            </p>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-sm text-red-400 hover:text-red-300 transition shrink-0"
          >
            Delete
          </button>
        </div>

        {/* Confirm Delete — buttons stack on mobile, side by side from sm up */}
        {showDeleteConfirm && (
          <div className="mt-4 p-4 bg-red-500/10 rounded-xl border border-red-500/30">
            <p className="text-sm text-red-400 mb-3 font-medium">
              Are you sure you want to delete? Everything will be lost!
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-xl transition"
              >
                Yes, Delete Account
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className={`px-4 py-2 text-sm rounded-xl transition ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}

export default Profile