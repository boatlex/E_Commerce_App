import express from "express";
import { createProduct } from "../controllers/admin.controller.js";
import { adminOnly, protectRoute } from "../middlewares/auth.middleware.js";



const router = express.Router()

router.post("/products", protectRoute, adminOnly, createProduct)
export default router