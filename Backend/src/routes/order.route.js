import express from "express"
import { protectRoute } from "../middlewares/auth.middleware.js"
import { createOrder, getUserOrders } from "../controllers/order.controller.js"




const router = express.Router()
router.use(protectRoute)
router.post("/", createOrder)
router.get("/", getUserOrders)

export default router