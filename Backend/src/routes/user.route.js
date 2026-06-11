import express from "express";
import { syncUser } from "../controllers/user.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";


const router = express.Router()

router.post("/sync-user", syncUser)

export default router