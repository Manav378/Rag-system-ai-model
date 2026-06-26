import mongoose, { mongo, Schema } from 'mongoose'


const UserSchema = new Schema({

    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        minLength:6
    },

    documents:[
        {
            fileId:String,  //Pinecone store fileId
            filename:String, //original filename
            originalName:String,
            uploadedAt:{
                type:Date,
                default:Date.now
            }
        }
    ]

},{timestamps:true})


export default mongoose.model('User' , UserSchema)