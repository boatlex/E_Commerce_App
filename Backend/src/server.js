import express from "express"
import path from "path"
import { clerkMiddleware } from '@clerk/express'
import { ENV } from "./config/env.js"
import { connectDB } from "./config/db.js"
import { serve } from "inngest/express"
import { inngest, functions } from "./config/inngest.js"
import adminRoutes from "./routes/admin.route.js"
import userRoutes from "./routes/user.route.js"

const app = express()

const __dirname = path.resolve()

const PORT = ENV.PORT || 3000 

app.use(express.json())

app.use(clerkMiddleware())


app.use("/api/inngest", serve({ client: inngest, functions }))

app.get("/api/health", (req, res) => {
    res.status(200).json({ message: "Success App" })
})

app.use("/api/admin", adminRoutes)
app.use("/api/users", userRoutes)

if (ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "Admin", "dist")))
    
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "Admin", "dist", "index.html"))
    })
}
const connectServer = async () => {
    try {
        await connectDB()
        app.listen(PORT, () => console.log(`Server is Running At Port: ${PORT}`))
    } catch (error) {
        console.error("Database connection failed:", error)
        process.exit(1) 
    }
}

connectServer()
