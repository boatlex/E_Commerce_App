import { Inngest } from "inngest"
import { connectDB } from "../config/db.js"
import User from "../models/user.model.js"


export const inngest = new Inngest({ id: "ecom-app" })

const syncUser = inngest.createFunction(
    {
        id: "sync-user",
        triggers: [{ event: "clerk/user.created" }]
    },


    async ({ event }) => {
        await connectDB()

        const { id, email_addresses, first_name, last_name, image_url } = event.data

        const userData = event.data;

        const primaryEmailObj = userData?.email_addresses?.find(
            (email) => email.id === userData.primary_email_address_id
        );

        const primaryEmail = primaryEmailObj?.email_address;


        const newUser = {
            clerkId: id,
            email: primaryEmail,
            name: `${first_name || ""} ${last_name || ""}` || "User",
            imageUrl: image_url,
            addresses: [],
            wishList: [],
        }

        await User.create(newUser)
    }
)


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