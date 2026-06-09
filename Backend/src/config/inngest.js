import { Inngest } from "inngest"
import { connectDB } from "../config/db.js"
import User from "../models/user.model.js"


export const inngest = new Inngest({ id: "ecom-app" })
const syncUser = inngest.createFunction(
    {
        id: "sync-user",
        triggers: [{ event: "clerk.user.created" }] 
    },
    async ({ event, step }) => {
        await step.run("connect-to-db", async () => {
            await connectDB();
        });

        const userData = event.data;
        const { id, first_name, last_name, image_url } = userData;

        let primaryEmailObj = userData?.email_addresses?.find(
            (email) => email.id === userData.primary_email_address_id
        );
        
    
        if (!primaryEmailObj && userData?.email_addresses?.length > 0) {
            primaryEmailObj = userData.email_addresses[0];
        }

    
        const primaryEmail = primaryEmailObj?.email_address || userData?.external_accounts?.[0]?.email_address;

        if (!primaryEmail) {
            throw new Error(`CRITICAL: No email address found in Clerk payload for user ${id}`);
        }
        

        const fullName = `${first_name || ""} ${last_name || ""}`.trim() || "User";

        const newUser = {
            clerkId: id,
            email: primaryEmail,
            name: fullName,
            imageUrl: image_url,
            addresses: [],
            wishList: [],
        };

        await step.run("upsert-user-to-db", async () => {
            return await User.findOneAndUpdate(
                { clerkId: id },
                newUser,
                { upsert: true, new: true }
            );
        });
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