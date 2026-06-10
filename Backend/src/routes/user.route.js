import express from "express";
import { syncUser } from "../controllers/user.controller.js";
//import { requireAuth } from "@clerk/express";
import { protectRoute } from "../middlewares/auth.middleware.js";


const router = express.Router()

router.post("/sync-user",protectRoute, syncUser)

export default router