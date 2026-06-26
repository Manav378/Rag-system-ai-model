import jwt from 'jsonwebtoken'
import User from '../models/User.js'


const protect = async(req , res , next)=>{
    try {
        
        //Extract token from cookie
        const token = req.cookies?.token;
        console.log(token);


        if(!token){
            return res.status(401).json({message:"Login first!"})
        }

        const decoded = jwt.verify(token , process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id).select('-password')

        next();

    } catch (error) {
         res.status(401).json({ message: 'Token is invalid!' })
    }
}


export default protect;