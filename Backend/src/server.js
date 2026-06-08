import express from "express"
import path from "path"
import { clerkMiddleware } from '@clerk/express'
import { ENV } from "./config/env.js"
import { connectDB } from "./config/db.js"


const app = express()


const __dirname = path.resolve()
const  Port =ENV.PORT|| 3000 

app.use(clerkMiddleware())

app.get("/api/health", (req, res)=>{
    res.status(200).json({message:"Success App"})
})

if(ENV.NODE_ENV ==="production"){
    app.use(express.static(path.join(__dirname,"../Admin/dist")))

    app.get("/{*any}", (req, res)=>{
      res.sendFile(path.join(__dirname, "../Admin", "dist", "index.html"))
    })
}


const connectServer = async()=>{

 await connectDB()
 app.listen(Port, ()=>
    console.log(`Server is Running At Port: ${Port}`)
)
}

connectServer()
