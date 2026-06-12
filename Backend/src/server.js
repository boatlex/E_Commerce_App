import express from "express"
import cors from "cors"
import path from "path"
import { clerkMiddleware, getAuth } from '@clerk/express'
import { ENV } from "./config/env.js"
import { connectDB } from "./config/db.js"
import { serve } from "inngest/express"
//import { inngest, functions } from "./config/inngest.js"
import adminRoutes from "./routes/admin.route.js"
import userRoutes from "./routes/user.route.js"
import orderRoutes from "./routes/order.route.js"
import reviewRoutes from "./routes/review.route.js"
import productRoutes from "./routes/product.route.js"
import cartRoutes from "./routes/cart.route.js"

const app = express()

app.use(cors({
  origin: ENV.CLIENT_URL, // Replace with your exact Vite frontend URL
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"] // Explicitly allow Clerk tokens
}))


const __dirname = path.resolve()

const PORT = ENV.PORT || 3000 

app.use(express.json())

app.use(clerkMiddleware())


//app.use("/api/inngest", serve({ client: inngest, functions }))

app.get("/api/health", (req, res) => {
    res.status(200).json({ message: "Success App", userId})
})

app.use("/api/admin", adminRoutes)
app.use("/api/users", userRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/reviews", reviewRoutes)
app.use("/api/products", productRoutes)
app.use("/api/carts", cartRoutes)

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
