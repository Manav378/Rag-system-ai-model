import User from "../models/User.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cookie from 'cookie-parser'
import ChatModels from "../models/Chat.models.js";


const generateToken = (userId)=>{
    return jwt.sign(
        {id:userId},
        process.env.JWT_SECRET,
        {expiresIn:'7d'},
    )
}

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // production mein true, local mein false
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // production mein none chahiye cross-origin ke liye
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 din
}





//--------------------Signup-----------------
export const Signup = async(req , res)=>{


    const {name , email , password} = req.body

    if(!name || !email || !password){
        return res.status(400).json({message:"Fill all required fields!"});
    }

    try {
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                message:"Email is already registered!"
            })
        }


        const hashedPassword = await bcrypt.hash(password , 10);
        const user = await User.create({name , email:email , password:hashedPassword});
        
        const token = generateToken(user._id);
        res.cookie('token' , token , cookieOptions)


         res.status(201).json({
      message: 'Account has been created! ✅',
      user: { id: user._id, name: user.name, email: user.email }
    })


    } catch (error) {
          res.status(500).json({ message: 'Signup error', error })
    }
}

//--------------------Login-----------------
export const Login = async(req,res)=>{
const {email , password} = req.body;


if(!email ||!password){
    return res.status(400).json({message:'Email and password required!'})
}


try {
    const user = await User.findOne({email});

    if(!user){
        return res.status(400).json({message:"Email is not regestereed!"})
    }


    const isMatch = await bcrypt.compare(password , user.password);

    if(!isMatch){
        return res.status(400).json({message:"wrong password please try again!"});
    }

    const token  = generateToken(user._id);

    res.cookie('token' , token , cookieOptions);

    res.json({
        message: 'Login successful! ✅',
      user: { id: user._id, name: user.name, email: user.email }
    })
} catch (error) {
      res.status(500).json({ message: 'Login error', error:error.message })
}
}


//--------------------Logout-----------------


export const Logout = async(req , res)=>{
    res.clearCookie('token');
    res.json({ message: 'Logout successfully! ✅' })
}



//--------------------profile-----------------

export const Profile = async(req , res)=>{
    try {
        res.json({user:req.user})
    } catch (error) {
        res.status(500).json({ message: 'Error in profile' })
    }
}


//-----------------change password------------

export const change_password = async(req , res)=>{
    const {currentPassword , newPassword} = req.body;

    if(!currentPassword || !newPassword) return res.status(400).json({message:'Both Password required!'});

    if(newPassword.length < 6) return res.status(400).json({message:"Password atleast 6 characters"})

        try {
            //check current password
            const user = await User.findById(req.user._id)

            const isMatch = await bcrypt.compare(currentPassword , user.password)
            if(!isMatch) return res.status(400).json({message:"your current password is wrong!"})
                
                //hash New password 
                const hashed = await bcrypt.hash(newPassword , 10)
                await User.findByIdAndUpdate(req.user._id , {password:hashed})
                res.json({message:"Password changed successfully! ✅"})

        } catch (error) {
            res.status(500).json({ message: 'Error in changing password', error: error.message })
        }
}



//-----------------Delete Account------------
export const DeleteAcount = async(req , res)=>{
    try {

        //delete users all chats
        await ChatModels.deleteMany({userId:req.user._id})

        // Delete user
        await User.findByIdAndDelete(req.user._id)

        //clear cookie 

        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        })

        res.json({message:"Account has been deleted successfully!✅"})

    } catch (error) {
         res.status(500).json({ message: 'Error in deleting account', error: error.message })
    }
}




//-----------------Get state-----------


export const Stats = async(req , res)=>{
    try {
        const user = await User.findById(req.user._id).select('documents , createdAt')


        //count total question 
        const chats = await ChatModels.find({userId:req.user._id})

        const totalQuestion = chats.reduce((acc , chat)=>{

            //only count user messages
            const userMessage = chat.message.filter(m=>m.role === 'user')
            return acc + userMessage.length
        } ,0)


        res.json({
            totalDocuments:user.documents.length,
            totalQuestion,
            memberSince:user.createdAt
        })
    } catch (error) {
          res.status(500).json({ message: 'Error in states', error: error.message })
    }
}



