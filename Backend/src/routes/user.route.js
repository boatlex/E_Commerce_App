import express from "express";
import {
    addAddress,
    getAddresses,
    updateAddress,
    deleteAddress,
    syncUser,
    removeFromWishList,
    addToWishList,
    getWishList
} from "../controllers/user.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";


const router = express.Router()

// Public Route
router.post('/sync-user', syncUser);

// Protected Routes (Authentication Required)
router.use(protectRoute);

// Address Management
router.post('/addresses', addAddress);
router.get('/addresses', getAddresses);
router.put('/addresses/:addressId', updateAddress);
router.delete('/addresses/:addressId', deleteAddress);

// Wishlist Management
router.post('/wishList', addToWishList);
router.get('/wishList', getWishList);
router.delete('/wishList/:productId', removeFromWishList);


export default router