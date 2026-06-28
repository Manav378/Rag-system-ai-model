import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import ProtectedRoute from './components/ProtectedRoute.jsx'

import Landing from './pages/Landing.jsx'
import AuthPage from './pages/AuthPage.jsx'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Chat from './pages/Chat.jsx'
import Resume from './pages/Resume.jsx'
import Profile from './pages/Profile.jsx'
import Chatbot from './pages/Chatbot.jsx'
const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" />

      <Routes>
           {/* Public Routes */}
        <Route path="/" element={<Landing/>} />
        <Route path="/login" element={<AuthPage/>} />
        <Route path="/signup" element={<AuthPage/>} />


         {/* Protected Routes */}

         <Route element={
          <ProtectedRoute>
            <Layout/>
          </ProtectedRoute>
         }>

          <Route path='/dashboard' element={<Dashboard/>} />
          <Route path='/chat/:fileId' element={<Chat/>}/>
          <Route path='/resume' element={<Resume/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/chatbot' element={<Chatbot/>}/>
         </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App