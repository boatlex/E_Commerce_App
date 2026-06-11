import express from "express";
import {
    createProduct, getAllProducts, updateProduct, getAllOrders,
    updateOrderstatus, getAllCustomers, getDashboardStats
} from "../controllers/admin.controller.js";
import { adminOnly, protectRoute } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";




const router = express.Router()
router.use(protectRoute, adminOnly)


router.post("/products", upload.array("images", 3), createProduct)
router.put("/products/:id", upload.array("images", 3), updateProduct)
router.get("/products", getAllProducts)

router.get("/orders", getAllOrders)
router.patch("/orders/:orderId/status", updateOrderstatus)

router.patch("/customers", getAllCustomers)
router.patch("/tats", getDashboardStats)
export default router