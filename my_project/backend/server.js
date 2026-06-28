import express from 'express'
import cors from "cors"
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

dotenv.config();



import uploadRoute from './routes/upload.js';
import chatGrok from './routes/chat.js'
import AuthRouter from './routes/Auth.Routes.js';
import Resumerouter from './routes/Resume.Routes.js'
import ChatbotRouter from './routes/Chatbot.Routes.js'

console.log(process.env.MONGODB_URI)

// MongoDB connect karo
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected ✅'))
  .catch((err) => console.log('MongoDB error:', err))





  const app = express();

app.use(cors({
  origin: function(origin, callback) {
    // Sab vercel.app domains allow karo
    if (!origin || 
        origin.includes('vercel.app') || 
        origin === 'http://localhost:5173') {
      callback(null, true)
    } else {
      callback(new Error('CORS not allowed'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}))

app.options('*', cors())
app.use(cookieParser());
app.use(express.json());

// all routes middelware
app.use("/api/upload" , uploadRoute)
app.use('/api/chat' , chatGrok)
app.use('/api/auth' , AuthRouter);
app.use('/api/resume' , Resumerouter)
app.use('/api/chatbot' , ChatbotRouter)



app.get("/" , (req,res)=>{
    res.send("server is running ✔")
})

app.listen(5000 , ()=>{
    console.log("server is running on port 5000")
})