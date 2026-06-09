import { Inngest } from "inngest"
import { connectDB } from "../config/db.js"
import User from "../models/user.model.js"


export const inngest = new Inngest({ id: "ecom-app" })
const syncUser = inngest.createFunction(
    {
        id: "sync-user",
        triggers: [{ event: "clerk.user.created" }] 
    },

    async ({ event }) => {
        await connectDB()

         const userData = event.data
        const { id, email_addresses, first_name, last_name, image_url } = userData
          
        const newUser = {
            clerkId: id,
            email: email_addresses[0]?.email_address,
            name: `${first_name || ""} ${last_name || ""}`.trim() || "User",
            imageUrl: image_url,
            addresses: [],
            wishList: [],
        }
  
        await User.create(newUser)
    }
);



const deleteUser = inngest.createFunction(
    {
        id: "delete-user",
        triggers: [{ event: "clerk/user.created" }]
    },

    async ({ event }) => {
        await connectDB()

        const { id } = event.data

        await User.deleteOne({ clerkId: id })
    }

)


export const functions = [syncUser, deleteUser]