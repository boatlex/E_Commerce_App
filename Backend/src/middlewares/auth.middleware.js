import { getAuth} from "@clerk/express";
import { ENV } from "../config/env.js";
import { User } from "../models/user.model.js";



export const protectRoute =  async (req, res, next) => {
  try {
    const authState = getAuth(req)
    const clerkId = authState?.userId
    

    if (!clerkId) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" })
    }

    const user = await User.findOne({ clerkId })
    if (!user) {
      return res.status(404).json({ message: "User Not Found" })
    }

    req.user = user
    next()
  } catch (error) {
    console.log("Error in ProtectRoute Middleware:", error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}


export const adminOnly = async (req, res, next)=>{
    if(!req.user){
        res.status(401).json({message:"Unauthorized- user not found"})
    }
   if(req.user.email!==ENV.ADMIN_EMAIL){
    return res.status(403).json({message:"Forbiden- Restricted Access"})
   }

   next()
}
