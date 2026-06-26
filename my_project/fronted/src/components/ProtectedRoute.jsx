import {Navigate} from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'


const ProtectedRoute = ({children})=>{
    const {user , loading} = useAuth()



     // Auth check ho raha hai — wait karo
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-violet-500" />
      </div>
    )
  }

  // Redirect to login page if not login
  if(!user){
    return <Navigate to='/login' replace/>
  }

  //user already logged in so show the page
  return children
}


export default ProtectedRoute