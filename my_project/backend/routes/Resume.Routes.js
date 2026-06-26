import express from "express";
import protect from "../middelware/Auth.middelware.js";
import { analyzeResume, matchWithJD } from "../controller/Resume.Controller.js";
import uploads_multer from "../utils/multer.js";
const Resumerouter = express.Router();




Resumerouter.post('/analyzeResume' , protect , uploads_multer.single('resume') ,analyzeResume )


Resumerouter.post("/MatchWithJD" , protect , uploads_multer.single('resume') ,matchWithJD )


export default Resumerouter