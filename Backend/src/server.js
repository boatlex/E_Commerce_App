import express from "express"
import path from "path"
import { ENV } from "./config/env.js"


const app = express()


const __dirname = path.resolve()


app.get("/api/health", (req, res)=>{
    res.status(200).json({message:"Success App"})
})

if(ENV.NODE_ENV ==="production"){
    app.use(express.static(path.join(__dirname,"../Admin/dist")))

    app.get("/{*any}", (req, res)=>{
      res.sendFile(path.join(__dirname, "../Admin", "dist", "index.html"))
    })
}


app.listen(ENV.PORT, ()=>
    console.log("Server is Running")
)