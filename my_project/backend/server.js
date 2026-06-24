import express from 'express'
import cors from "cors"

import dotenv from 'dotenv'


import uploadRoute from './routes/upload.js';
import chatGrok from './routes/chat.js'

dotenv.config();



const app = express();

app.use(cors());
app.use(express.json());

// all routes middelware
app.use("/api/upload" , uploadRoute)
app.use('/api/chat' , chatGrok)



app.get("/" , (req,res)=>{
    res.send("server is running ✔")
})

app.listen(5000 , ()=>{
    console.log("server is running on port 5000")
})