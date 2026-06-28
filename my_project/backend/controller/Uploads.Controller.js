import User from "../models/User.js";
import extractTextFromPDF from "../utils/pdfParser.js";
import { storeDocument } from "../utils/pinecone.js";


import { uploadToCloudinary } from "../utils/cloudinary.js"
import fs from 'fs'
const Uploads = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'File not found!' })
  }

  try {
    let extractedText = ''
    const fileId = req.file.filename        // Cloudinary public_id
    const originalName = req.file.originalname
    const fileUrl = req.file.path           // ← Cloudinary URL milega

    if (req.file.mimetype === 'application/pdf') {
      // Cloudinary URL se text extract karo
      extractedText = await extractTextFromPDF(fileUrl)
      await storeDocument(extractedText, fileId)
    }

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        documents: {
          fileId: fileId,
          filename: fileId,
          originalName: originalName,
          fileUrl: fileUrl,               // ← URL save karo
        }
      }
    })

    res.json({
      message: "File has been uploaded ✔",
      fileId: fileId,
      originalName: originalName,
      fileUrl: fileUrl
    })

  } catch (error) {
    res.status(500).json({ message: 'Error aaya', error: error.message })
  }
}






 const  getAllUserDocument = async(req,res)=>{
    try {
        const user = await User.findById(req.user._id).select('documents');
        res.json({documents:user.documents})
    } catch (error) {
        res.status(500).json({message:"Error in getAll documents" , error:error.message})
    }
}





const DeletUserDocument = async(req,res)=>{
    try {
        const {fileId} = req.params;

          // ← Cloudinary se bhi delete karo
    const { cloudinary } = await import('../utils/cloudinary.js')
    await cloudinary.uploader.destroy(fileId, { resource_type: 'raw' })

        // Remove from Mongo db

        await User.findByIdAndUpdate(req.user._id,{
            $pull:{documents:{fileId:fileId}}
        })

        res.json({message:"document deleted successfully"})
    } catch (error) {
        res.status(500).json({ message: 'Error during deleting document', error: error.message })
    }
}

export  {Uploads , getAllUserDocument , DeletUserDocument}