import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ||'https://documind-backend-posd.onrender.com/api',
    withCredentials:true
})


console.log('API URL:', import.meta.env.VITE_API_URL)
export default api