import express from "express";
import { createProduct } from "../controllers/admin.controller.js";



const router = express.Router()

router.post("/products",  createProduct)
export default router