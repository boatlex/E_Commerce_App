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
           
    const userData = event.data;

// 1. Destructure the required variables from userData
const { id, first_name, last_name, image_url } = userData;

// 2. Find the primary email safely
const primaryEmailObj = userData?.email_addresses?.find(
    (email) => email.id === userData.primary_email_address_id
);
const primaryEmail = primaryEmailObj?.email_address;

// 3. Format name correctly (trim removes extra spaces if last_name is missing)
const fullName = `${first_name || ""} ${last_name || ""}`.trim() || "User";

const newUser = {
    clerkId: id, // Now defined
    email: primaryEmail,
    name: fullName,
    imageUrl: image_url, // Now defined
    addresses: [],
    wishList: [],
};

// 4. Use create (or findOneAndUpdate to prevent duplicate errors on retry)
await User.create(newUser);
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