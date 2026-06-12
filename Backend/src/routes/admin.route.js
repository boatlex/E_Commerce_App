import express from "express";
import {
    createProduct,
    getAllProducts,
    updateProduct,
    getAllOrders,
    getAllCustomers,
    getDashboardStats,
    updatedOrderStatus
} from "../controllers/admin.controller.js";
import { adminOnly, protectRoute } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";





const router = express.Router();

// Apply global admin protection middleware
router.use(protectRoute, adminOnly);

// Product Management
router.post("/products", upload.array("images", 3), createProduct);
router.put("/products/:id", upload.array("images", 3), updateProduct);
router.get("/products", getAllProducts);

// Order Management
router.get("/orders", getAllOrders);
router.patch("/orders/:orderId/status", updatedOrderStatus);

// Customer & Business Insights
router.get("/customers", getAllCustomers);
router.get("/stats", getDashboardStats);

export default router;
