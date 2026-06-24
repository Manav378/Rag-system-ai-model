import {HfInference } from '@huggingface/inference'
import dotenv from 'dotenv'
dotenv.config();





const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

const getEmbedding = async(text)=>{
    const result = await hf.featureExtraction({
        model:'sentence-transformers/all-MiniLM-L6-v2',
        inputs:text
    })
    return Array.from(result)
}


const chunkText = (text , chunkSize=500)=>{
    const word = text.split(' ');
    const chunks = []

    for(let i = 0;i<word.length;i+=chunkSize){
        const chunk = word.slice(i , i+chunkSize).join('')
        chunks.push(chunk)
    }

    return chunks
}

export { getEmbedding, chunkText };