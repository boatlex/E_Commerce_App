import express from 'express'
import { protectRoute } from '../middlewares/auth.middleware.js'
import { intializedPayment, validatedPayment } from '../controllers/payment.controller.js'


const router = express.Router()

 router.post("/initialized", protectRoute, intializedPayment)
 router.post("/validated", validatedPayment)
export default router