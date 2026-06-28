import express from 'express'

import {change_password, DeleteAcount, Login ,  Logout, Profile, Signup, Stats } from '../controller/Auth.Controller.js';
import protect from '../middelware/Auth.middelware.js';
const AuthRouter = express.Router();



AuthRouter.post("/signup" ,Signup)

AuthRouter.post("/login" , Login)

AuthRouter.post("/logout" , Logout)

AuthRouter.get('/profile' , protect , Profile)

AuthRouter.put('/change-password' , protect , change_password)

AuthRouter.delete('/delete-account' ,protect, DeleteAcount)

AuthRouter.get('/Stats' , protect , Stats)



export default AuthRouter