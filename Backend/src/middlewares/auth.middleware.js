import { requireAuth } from "@clerk/express";
import { ENV } from "../config/env.js";
import { User } from "../models/user.model.js";
User

export const protectRoute =[
    requireAuth(),

  async (req, res, next)=>{
   try {
     
  const clerkId = req.auth().userId
  console.log("this too is an id", clerkId)
  if(!clerkId){
    res.status(401).json({message:"Unauthorized-invalid toke"})
    return
  }
  const user = await  User.findOne({clerkId})
   if(!user){
     res.status(404).json({message:"User Not Found"})
    return
   }
   req.user = user
   next()
   } catch (error) {
    console.log("Error in ProtectRoute MiddleWare", error)
    res.status(500).json({message:"Internal Server Error"})
   }
}
]

export const adminOnly = async (req, res, next)=>{
    if(!req.user){
        res.status(401).json({message:"Unauthorized- user not found"})
    }
   if(req.user.email!==ENV.ADMIN_EMAIL){
    return res.status(403).json({message:"Forbiden- Restricted Access"})
   }

   next()
}
