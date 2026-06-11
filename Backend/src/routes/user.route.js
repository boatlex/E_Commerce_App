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

router.post("/sync-user", syncUser)

router.use(protectRoute)
router.post("/addresses", addAddress)
router.get("/addresses", getAddresses)
router.put("/addresses/:addressId", updateAddress)
router.delete("/addresses/:addressId", deleteAddress)

router.post("/wishList", addToWishList)
router.post("/wishList", getWishList)
router.delete("/wishList/:productId", removeFromWishList)


export default router