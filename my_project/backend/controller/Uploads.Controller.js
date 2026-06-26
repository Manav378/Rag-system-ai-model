import User from "../models/User.js";
import extractTextFromPDF from "../utils/pdfParser.js";
import { storeDocument } from "../utils/pinecone.js";

const Uploads = async(req , res)=>{
   
    if(!req.file){
          return res.status(400).json({ message: 'File not found!' })
    }

    try{
        let extractedText = '';
        const fileId = req.file.filename

        //If it is pdf then extract text from this PDF
        if(req.file.mimetype == 'application/pdf'){
            extractedText = await extractTextFromPDF(req.file.path);
            await storeDocument(extractedText , fileId)
        }

        await User.findByIdAndUpdate(req.user._id,{
            $push:{
                documents:{
                    fileId:fileId,
                    filename:fileId,
                    originalName:req.file.originalName,
                }
            }
        })

        res.json({
            message:"File has been uploaded ✔",
            filename:req.file.filename,
            text:extractedText.slice(0 , 500),
            originalName:req.file.originalName
        })
    }catch(error){
        res.status(500).json({ message: 'Text not extracted from PDf', error:error.message })

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