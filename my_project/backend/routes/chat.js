import express from "express";
import askGroq from "../utils/Groq.js";
import {searchSimilar} from '../utils/pinecone.js'
import { ChatHistory, Clearchat, Stream } from "../controller/Chat.Controller.js";
import protect from "../middelware/Auth.middelware.js";


const router = express.Router();


router.post('/stream' , protect,Stream)

router.get("/:fileId" , protect , ChatHistory);

router.delete("/:fileId" , protect , Clearchat)


export default router;