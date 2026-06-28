import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'
import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Local storage — temp mein save karo
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '_' + file.originalname)
})

const fileFilter = (req, file, cb) => {
  const allowed = ['application/pdf', 'image/jpeg', 'image/png']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('only PDF and image allowed!'), false)
  }
}

const upload_cloudinary = multer({ storage, fileFilter })

// Cloudinary pe upload karo
const uploadToCloudinary = async (filePath, mimetype) => {
  const isPDF = mimetype === 'application/pdf'
  
  const result = await cloudinary.uploader.upload(filePath, {
    folder: 'documind',
    resource_type: isPDF ? 'raw' : 'image',
    public_id: Date.now().toString()
  })
  
  return result
}

export { cloudinary, upload_cloudinary, uploadToCloudinary }