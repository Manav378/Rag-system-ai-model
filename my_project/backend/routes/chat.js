import express from "express";
import askGroq from "../utils/Groq.js";
import {searchSimilar} from '../utils/pinecone.js'


const router = express.Router();


router.post('/' , async(req , res)=>{
    const {fileId ,  question} =req.body;
    console.log(fileId , question)

    if(!fileId || !question){
        return res.status(400).json({
            messgae:"context and question both required!"
        })
    }

    try{
        //search relevant context from pinecone
       const context = await searchSimilar(question , fileId);

       const answer = await askGroq(context , question);
         res.json({ answer })
    }catch(error){
        res.status(500).json({
            message:"grok is not answering !" , error:error.message
        })
    }
})

export default router;