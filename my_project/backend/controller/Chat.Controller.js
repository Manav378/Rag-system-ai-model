import { searchSimilar } from "../utils/pinecone.js";
import askGroq from "../utils/Groq.js";
import ChatModels from "../models/Chat.models.js";
import { Groq } from "groq-sdk/client.js";

export const Stream = async (req, res) => {
  const { question, fileId, fileName } = req.body;
  if (!question || !fileId || !fileName)
    return res
      .status(400)
      .json({ message: "question and fileId both required!" });

  try {
    const context = await searchSimilar(question, fileId);

    //set streaming headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = await askGroq(context, question);

    let fullAnswer = "";

    //send all chunk to fronted

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";

      if (content) {
        fullAnswer += content;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write(`data:${JSON.stringify({ done: true })}\n\n`);
    res.end();

    //save in mongodb

    let chat = await ChatModels.findOne({ userId: req.user._id, fileId });

    if (!chat) {
      chat = await ChatModels.create({
        userId: req.user._id,
        fileId,
        fileName: fileName || fileId,
        message: [],
      });
    }

    chat.message.push({ role: "user", content: question });
    chat.message.push({ role: "assistant", content: fullAnswer });
    await chat.save();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error streaming", error: error.message });
  }
};

export const ChatHistory = async (req, res) => {
  try {
    const Allchat = await ChatModels.findOne({
      userId: req.user._id,
      fileId: req.params.fileId,
    });

    res.json({ message: Allchat ? Allchat.message : [] });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in chathistory", error: error.message });
  }
};

export const Clearchat = async (req, res) => {
  try {
    await ChatModels.findOneAndDelete({
      userId: req.user._id,
      fileId: req.params.fileId,
    });

    res.json({ message: "chat cleared successfully!!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Errorin deleting chat", error: error.message });
  }
};


const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export const ChatbotStream = async (req, res) => {
  const { message, history } = req.body;

  if (!message) return res.status(400).json({ message: "Message required!" });

  try {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    //history + new messages
    const messages =[

        {
            role:'system',
            content:`You are DocuMind AI — a helpful assistant. 
        Answer clearly and concisely.
        If asked about documents, tell user to upload them first.`
        },
        ...history , {
            role:'user',
            content:message
        }
    ]

    const stream = await groq.chat.completions.create({
        model:'llama-3.3-70b-versatile',
        messages,
        max_tokens:1024,
        stream:true
    })

    for await (const chunk of stream){
        const content = chunk.choices[0]?.delta?.content || '';
        if(content){
            res.write(`data: ${JSON.stringify({content})}\n\n`)
        }
    }

     res.write(`data: ${JSON.stringify({ done: true })}\n\n`)
     res.end()

  } catch (error) {
     res.status(500).json({ message: 'Error in chatbot streaming', error: error.message })
  }
};
