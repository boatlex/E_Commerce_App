import express from 'express'
import {  validatedPayment } from '../controllers/payment.controller.js'


const router = express.Router()


 router.post("/paystack", validatedPayment)
export default router