import { createContext , useContext , useState , useEffect, Children } from "react";
import api from '../api/axios.js'


const AuthContext = createContext();

export const AuthProvider = ({children})=>{
    const [user, setuser] = useState(null);
    const [loading, setloading] = useState(true);


    useEffect(() => {
       const checkAuth = async () =>{
        try {
            const res = await api.get('/auth/profile')
            setuser(res.data.user)
        } catch (error) {
            setuser(null)
        } finally{
            setloading(false)
        }
       }
       checkAuth()
       
    }, []);

    const login = (userData)=>setuser(userData)


        const logout = async()=>{
            await api.post('/auth/logout')
            setuser(null)
        }

        return(
            <AuthContext.Provider value={{user , loading , login ,logout}}>
                {children}
            </AuthContext.Provider>

        )
}

export const useAuth = ()=> useContext(AuthContext)