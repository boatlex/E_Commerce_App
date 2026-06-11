import { clerkClient, getAuth } from "@clerk/express"
import { User } from "../models/user.model.js"

export const syncUser = async (req, res) => {
    try {
        const { userId } = getAuth(req)

        console.log("this is Critical", userId)
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. Missing token." })
        }

        const existingUser = await User.findOne({ clerkId: userId })
        if (existingUser) {
            return res.status(200).json({ user: existingUser, message: "User Already Exists!" })
        }

        const clerkUser = await clerkClient.users.getUser(userId)


        const fullName = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim()

        const userData = {
            clerkId: userId,
            email: clerkUser.emailAddresses[0]?.emailAddress || "",
            name: fullName || "Anonymous User",
            imageUrl: clerkUser.imageUrl || "",
            addresses: [],
            wishList: [],
        }

        // 6. Save the new user record
        const user = await User.create(userData)

        return res.status(201).json({
            user,
            message: "User Created Successfully"
        })

    } catch (error) {
        console.error("Error in syncUser controller:", error)
        return res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

export const addAddress = async (req, res) => {
    try {
        const { label, fullName, streetAddress, city, state, zipCode, phoneNumber, isDefault } = req.body
        if (!fullName || !streetAddress || !city || !state || !zipCode ) {
            return res.status(400).json({ message: "Missing required fields" })
        }

        const user = req.user

        if (isDefault) {
            user.addAddresses.forEach((addr) => addr.isDefault = false)
        }

        user.addresses.push({
            label,
            fullName, streetAddress,
            city,
            state,
            zipCode,
            phoneNumber,
            isDefault: isDefault || false
        })

        await user.save()
        res.status(201).json({
            message: "User Address Created Successfully",
            addresses: user.addresses
        })
    } catch (error) {

        console.error("Error Creating Address:", error)
        return res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}
export const getAddresses = async (req, res) => {
    try {
        const user = req.user

        res.status(200).json({ addresses: user.addresses })
    } catch (error) {

        console.error("Error Fetching Addresses:", error)
        return res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}
export const updateAddress = async (req, res) => {
    try {
        const { label, fullName, streetAddress, city, state, zipCode, phoneNumber, isDefault } = req.body
        const { addressId } = req.params
        const user = req.user

        const address = user.addresses.id(addressId)

        if (!address) {
            return res.status(400).json({ message: "Address Not Found" })
        }

        if (isDefault) {
            user.addAddresses.forEach((addr) => addr.isDefault = false)
        }

        address.label = label || address.label
        address.fullName = fullName || address.fullName
        address.streetAddress = streetAddress || address.streetAddress
        address.city = city || address.city
        address.state = state || address.state
        address.zipCode = zipCode || address.zipCode
        address.zipCode = zipCode || address.zipCode
        address.phoneNumber = phoneNumber || address.phoneNumber
        address.isDefault = isDefault !== undefined ? isDefault : address.isDefault

        await user.save()

        res.status(200).json({ message: "Address Updated Successfully", addresses: user.addresses })
    } catch (error) {

        console.error("Error in Updating Address:", error)
        return res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}
export const deleteAddress = async (req, res) => {

    try {
        const { addressId } = req.params

        const user = req.user

        user.addresses.pull(addressId)

        await user.save()
        res.status(200).json({ message: "Address Deleted Successfully" })
    } catch (error) {
        console.error("Error in Updating Address:", error)
        return res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}


export const addToWishList = async (req, res) => {
    try {
        const { productId } = req.body
        const user = req.user

        if (user.wishList.includes(productId)) {
            return res.status(400).json({ message: "Product Already in wishlist" })
        }

        user.wishList.push(productId)

        await user.save()

        res.status(200).json({ message: "Product Added to Wishlist Successfully", wishList: user.wishList })
    } catch (error) {

        console.error("Error in Adding Product to Wishlist:", error)
        return res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}
export const getWishList = async (req, res) => {
    try {
       const user = await User.findById(req.user._id).populate("wishList")
       res.status(200).json({message:"Wishlist fetched successfully", wishList:user.wishList})
    } catch (error) {
        console.error("Error in getting wishlist:", error)
        return res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}
export const removeFromWishList = async (req, res) => {
    try {
        const { productId } = req.params
        const user = req.user

        if (!user.wishList.includes(productId)) {
            return res.status(400).json({ message: "Product Already in wishlist" })
        }

        user.wishList.pull(productId)
        await user.save()

        res.status(200).json({ message: "WishList Removed successfully", wishList: user.wishList })
    } catch (error) {

        console.error("Error in removing wishlist:", error)
        return res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}
