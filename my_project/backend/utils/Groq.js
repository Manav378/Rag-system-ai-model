import { Groq } from 'groq-sdk/client.js';
import dotenv from 'dotenv'

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})


const askGroq = async (context, question) => {
  const response = await groq.chat.completions.create({
   model: "llama-3.3-70b-versatile", // free model
    messages: [
      {
        role: 'user',
        content: `read the context given below:
        
${context}

Only answer this question on basis of given context:
${question}

if answer is not present in context
"This information is not present in document!!"`
      }
    ],
    max_tokens: 1024,
    stream:true
  })

  return response
}
export default askGroq