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
        content: `Neeche diya gaya context padho:
        
${context}

Ab sirf is context ke basis pe yeh question ka jawab do:
${question}

Agar answer context mein nahi hai to bolo
"This information is not present in document!!"`
      }
    ],
    max_tokens: 1024
  })

  return response.choices[0].message.content
}
export default askGroq