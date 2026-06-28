import express from 'express'
import protect from '../middelware/Auth.middelware.js'
import { ChatbotStream } from '../controller/Chat.Controller.js'

const ChatbotRouter = express.Router()



ChatbotRouter.post('/chatbot-stream' , protect , ChatbotStream)


export default ChatbotRouter