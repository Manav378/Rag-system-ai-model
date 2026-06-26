import { searchSimilar } from "../utils/pinecone.js";
import askGroq from "../utils/Groq.js";

const Chat = async(req , res)=>{
    
    const {fileId ,  question} =req.body;
   

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
}

export default Chat