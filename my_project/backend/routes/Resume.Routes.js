import express from "express";
import protect from "../middelware/Auth.middelware.js";
import { analyzeResume, matchWithJD } from "../controller/Resume.Controller.js";
import { upload_cloudinary } from "../utils/cloudinary.js";
const Resumerouter = express.Router();




Resumerouter.post('/analyzeResume' , protect , upload_cloudinary.single('resume') ,analyzeResume )


Resumerouter.post("/MatchWithJD" , protect , upload_cloudinary.single('resume') ,matchWithJD )


export default Resumerouter