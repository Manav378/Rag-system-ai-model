
import multer from 'multer'
import path from "path"


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

const uploads_multer = multer({storage , fileFilter})

export default uploads_multer