import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import { useTheme } from '../context/ThemeContext.jsx'


const Layout = () => {

    const {theme} = useTheme()
  return (
 <div className={`flex min-h-screen overflow-x-hidden ${theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
  
  <Sidebar />

  <main className="ml-0 md:ml-64 flex-1 min-w-0 p-4 md:p-8 overflow-x-hidden">
    <Outlet />
  </main>
</div>



  )
}

export default Layout