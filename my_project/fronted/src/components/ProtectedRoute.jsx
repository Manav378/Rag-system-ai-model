import {Navigate} from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'


const ProtectedRoute = ({children})=>{
    const {user , loading} = useAuth()



     
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-2 border-violet-500" />
      </div>
    )
  }

 
  if(!user){
    return <Navigate to='/login' replace/>
  }


  return children
}


export default ProtectedRoute