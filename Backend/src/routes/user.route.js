import express from "express";
import { syncUser } from "../controllers/user.controller.js";
import { clerkMiddleware, requireAuth } from "@clerk/express";


const router = express.Router()

router.post("/sync-user", requireAuth(), syncUser)

export default router