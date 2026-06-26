import express from "express";
import askGroq from "../utils/Groq.js";
import {searchSimilar} from '../utils/pinecone.js'
import Chat from "../controller/Chat.Controller.js";
import protect from "../middelware/Auth.middelware.js";


const router = express.Router();


router.post('/' , protect,Chat)

export default router;