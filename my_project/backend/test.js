import { Pinecone } from '@pinecone-database/pinecone'
import dotenv from 'dotenv'
dotenv.config()

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY })
const index = pinecone.index(process.env.PINECONE_INDEX)

const testVector = Array.from({ length: 384 }, () => 0.1)

const record = {
  id: 'test-1',
  values: testVector,
  metadata: { text: 'test', fileId: 'test' }
}

const records = [record]

console.log("Records length:", records.length)        // 1 hona chahiye
console.log("Values length:", records[0].values.length) // 384 hona chahiye
console.log("Is Array:", Array.isArray(records))       // true hona chahiye
console.log("Is Array values:", Array.isArray(records[0].values)) // true hona chahiye

await index.upsert(records)
console.log("✅ Done!")