import {Pinecone} from '@pinecone-database/pinecone'
import {getEmbedding , chunkText} from './embedding.js'
import dotenv from 'dotenv'

dotenv.config();

const pinecone = new Pinecone({
    apiKey:process.env.PINECONE_API_KEY
})


const index = pinecone.index(process.env.PINECONE_INDEX)


// convert PDF text into chunks and save in pinecone 
const storeDocument = async(text , fileId)=>{
      if (!text || text.trim().length === 0) {
    throw new Error('Text not extracted from PDF')
  }

    const chunks = chunkText(text)

    const vectors = [];


    for(let i =0;i<chunks.length;i++){
        const embedding = await getEmbedding(chunks[i]);

        vectors.push({
            id:`${fileId}-chunk-${i}`,
            values:embedding,
            metadata:{
                text:chunks[i],
                fileId:fileId
            }
        })
    }

    console.log("Chunks:", chunks.length);
console.log("Vectors:", vectors.length);
console.log(vectors);

    await index.upsert(vectors)
    console.log(`✅ ${vectors.length} chunks saved!`)
}



//find question related chunk

const searchSimilar = async (question , fileId)=>{
    const questionEmbedding = await getEmbedding(question)

    const results = await index.query({
        vector:questionEmbedding,
        topK:3,
        filter:{fileId:fileId},
        includeMetadata:true
    })
    
    
    const context = results.matches
    .map(match=>match.metadata.text)
    .join('\n\n')
    
    return context
    
}


export  {storeDocument,searchSimilar}