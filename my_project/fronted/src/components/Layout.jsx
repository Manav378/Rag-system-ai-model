import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import { useTheme } from '../context/ThemeContext.jsx'


const Layout = () => {

    const {theme} = useTheme()
  return (
     <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      
     {/* Sidebar — Left */}
      <Sidebar />



       {/* Main Content — Right */}
      <main className="ml-64 flex-1 p-8">
        <Outlet />
      </main>
    </div>



  )
}

export default Layout
