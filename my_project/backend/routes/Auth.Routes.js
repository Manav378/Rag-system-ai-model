import express from 'express'

import {Login ,  Logout, Profile, Signup } from '../controller/Auth.Controller.js';
import protect from '../middelware/Auth.middelware.js';
const AuthRouter = express.Router();



AuthRouter.post("/signup" ,Signup)

AuthRouter.post("/login" , Login)

AuthRouter.post("/logout" , Logout)

AuthRouter.get('/profile' , protect , Profile)



export default AuthRouter