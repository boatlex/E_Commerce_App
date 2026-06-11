import express from "express"
import { protectRoute } from "../middlewares/auth.middleware.js"
import { createReview, deleteReview } from "../controllers/review.controller.js"


const router = express.Router()

router.post("/", protectRoute, createReview)
router.post("/delete/:reviewId", protectRoute, deleteReview)

export default router