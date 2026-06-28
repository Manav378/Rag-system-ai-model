import express from 'express'
import {storeDocument} from '../utils/pinecone.js'
import extractTextFromPDF from '../utils/pdfParser.js';
import protect from '../middelware/Auth.middelware.js';
import { upload_cloudinary } from '../utils/cloudinary.js';


import { getAllUserDocument ,DeletUserDocument , Uploads } from '../controller/Uploads.Controller.js';
const router  = express.Router();





router.post('/', protect, (req, res, next) => {
  upload_cloudinary.single('file')(req, res, (err) => {
    if (err) {
      console.log('Multer/Cloudinary error:', err)  // ← exact error
      return res.status(500).json({ 
        message: 'Upload error', 
        error: err.message 
      })
    }
    next()
  })
}, Uploads)


// User all document
router.get("/document" , protect ,getAllUserDocument);


// DELETE - delete user document
router.delete('/:fileId' , protect ,DeletUserDocument)



export default router;