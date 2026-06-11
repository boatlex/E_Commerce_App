import express from "express"
import { protectRoute } from "../middlewares/auth.middleware.js"
import { getAllProducts } from "../controllers/admin.controller.js"
import { getProductById } from "../controllers/product.controller.js"


const router = express.Router()

router.get("/", protectRoute, getAllProducts)
router.get("/:id", protectRoute, getProductById)

export default router