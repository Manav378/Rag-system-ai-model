import express from 'express'
import {storeDocument} from '../utils/pinecone.js'
import extractTextFromPDF from '../utils/pdfParser.js';
import protect from '../middelware/Auth.middelware.js';
import uploads_multer from '../utils/multer.js';


import { getAllUserDocument ,DeletUserDocument , Uploads } from '../controller/Uploads.Controller.js';
const router  = express.Router();





router.post('/',protect , uploads_multer.single('file') ,Uploads)


// User all document
router.get("/document" , protect ,getAllUserDocument);


// DELETE - delete user document
router.delete('/:fileId' , protect ,DeletUserDocument)



export default router;