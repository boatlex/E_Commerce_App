import { clerkClient, getAuth } from "@clerk/express"
import { User } from "../models/user.model.js"

export const syncUser = async (req, res) => {
    try {
        const { userId } = getAuth(req)
        console.log(userId)
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
