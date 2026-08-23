import express from 'express'
import { protectRoute } from '../middlewares/auth.middleware.js'
import { intializedPayment} from '../controllers/payment.controller.js'


const router = express.Router()

 router.post("/initialized", protectRoute, intializedPayment)

export default router