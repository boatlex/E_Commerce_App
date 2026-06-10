import { clerkClient, getAuth } from "@clerk/express"
import { User } from "../models/user.model"




export const syncUser = async (req, res) => {

    const { userId } = getAuth(req)

    const existingUser = await User.findOne({ clerkId: userId })
    if (existingUser) return res.status(200).json({ user: existingUser, message: "User Already Exists!" })

    const clerkUser = await clerkClient.users.getUser(userId)

    const userData = {
        clerkId: userId,
        email: clerkUser.emailAddresses[0].emailAddress,
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
        imageUrl: clerkUser.imageUrl || "",
        addresses: [],
        wishList: [],
    }

    const user = await User.create(userData)

    res.status(200).json({
        user,
        message: "User Created Successfully"
    })
}