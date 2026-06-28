import mongoose, { mongo } from "mongoose";

const messageSchema = new mongoose.Schema({

    role:{
        type:String,
        enum:['user' , 'assistant'],
        required:true
    },

    content:{
        type:String,
        required:true
    },

    createdAt:{
        type:Date,
        default:Date.now
    }
})


const chatSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    fileId:{
        type:String,
        required:true
    },

    fileName:{
        type:String
    },

    message:[messageSchema]
},{timestamps:true})

export default mongoose.model('ChatModels' , chatSchema);