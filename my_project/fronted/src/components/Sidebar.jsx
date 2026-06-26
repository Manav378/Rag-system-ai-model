import React from 'react'
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, User, LogOut, Brain } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { isCancel } from 'axios';




const Sidebar = () => {

    const { logout } = useAuth()
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();


    const handleLogOut = async () => {
        await logout()
        navigate('/')
    }


    const navItems = [
        { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/resume', icon: <FileText size={20} />, label: 'Resume Analyzer' },
        { path: '/profile', icon: <User size={20} />, label: 'Profile' }
    ]


    return (
        <div className={`w-64 h-screen fixed left-0 top-0 flex flex-col justify-between px-4 py-6 border-r ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>


            {/* Logo */}
            <div>
                <div className="flex items-center gap-2 mb-10 px-2">
                    <Brain className="text-violet-500" size={26} />
                    <span className="text-lg font-bold">DocuMind AI</span>
                </div>


                <nav className='flex flex-col gap-1'>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition
                ${isActive
                                    ? 'bg-violet-600 text-white'
                                    : theme === 'dark'
                                        ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`
                            }
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}

                </nav>
            </div>


            {/* Bottom — Theme + Logout */}
            <div className="flex flex-col gap-2">
                <button
                    onClick={toggleTheme}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    {theme === 'dark' ? '☀️' : '🌙'}
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>

                <button
                    onClick={handleLogOut}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>


        </div>
    )
}

export default Sidebar
