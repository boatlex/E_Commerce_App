import {v2 as cloudinary} from "cloudinary"
import { ENV } from "./env.js"

cloudinary.config({
    cloud_name:ENV.CLOUDINARY_CLOUD_NAME,
    api_key : ENV.CLOUDINARY_API_KEY,
    api_secret:ENV.CLOUDINARY_API_SECRET
})


console.log("--- CLOUDINARY CONFIG CHECK ---");
console.log("Cloud Name Configured:", cloudinary.config().cloud_name);
console.log("API Key Exists:", !!cloudinary.config().api_key);
export default cloudinary