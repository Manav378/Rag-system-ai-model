import User from "../models/User.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cookie from 'cookie-parser'


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
const Signup = async(req , res)=>{


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
const Login = async(req,res)=>{
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


const Logout = async(req , res)=>{
    res.clearCookie('token');
    res.json({ message: 'Logout successfully! ✅' })
}



//--------------------profile-----------------

const Profile = async(req , res)=>{
    try {
        res.json({user:req.user})
    } catch (error) {
        res.status(500).json({ message: 'Error in profile' })
    }
}


export  {Login , Signup , Logout , Profile}