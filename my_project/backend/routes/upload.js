import express from 'express'
import multer from 'multer'
import path from "path"
import {storeDocument} from '../utils/pinecone.js'
import extractTextFromPDF from '../utils/pdfParser.js';


const router  = express.Router();


//where the file save and what si the name of the file

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null , 'uploads/')
    },
    filename:(req,file , cb)=>{
        cb(null , Date.now() + path.extname(file.originalname))
    }
})


//only allow pdf and images

const fileFilter = (req,file ,cb)=>{
    const allowed = ['application/pdf', 'image/jpeg', 'image/png']
    if(allowed.includes(file.mimetype)){
        cb(null , true);
    }else{
        cb(new Error("only upload PDF ya Image!") , false)
    }
}

const upload = multer({storage , fileFilter})


router.post('/' , upload.single('file') , async(req,res)=>{
    if(!req.file){
          return res.status(400).json({ message: 'File not found!' })
    }

    try{
        let extractedText = '';
        const fileId = req.file.filename

        //If it is padf then extract text from this PDF
        if(req.file.mimetype == 'application/pdf'){
            extractedText = await extractTextFromPDF(req.file.path);
        }

        await storeDocument(extractedText , fileId)
        res.json({
            message:"File has been uploaded ✔",
            filename:req.file.filename,
            text:extractedText.slice(0 , 500)
        })
    }catch(error){
        res.status(500).json({ message: 'Text not extracted from PDf', error:error.message })

    }

   
})


export default router;