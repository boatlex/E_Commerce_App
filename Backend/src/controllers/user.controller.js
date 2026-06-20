import { clerkClient, getAuth } from "@clerk/express"
import { User } from "../models/user.model.js"

export const syncUser = async (req, res) => {
    try {
        const { userId } = getAuth(req)

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
        if (!fullName || !streetAddress || !city || !state || !zipCode) {
            return res.status(400).json({ message: "Missing required fields" })
        }

        const user = req.user

        if (isDefault) {
            user.addresses.forEach((addr) => addr.isDefault = false)
        }

        user.addresses.push({
            label: label || "Home",
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
        const user = req.user;

        const userProfile = await User.findById(user._id)
            .select("addresses")
            .lean();


        if (!userProfile) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Addresses fetched successfully",
            addresses: userProfile.addresses || []
        });
    } catch (error) {
        console.error("Error Fetching Addresses:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }

}
export const updateAddress = async (req, res) => {
    try {
        const { label, fullName, streetAddress, city, state, zipCode,
            phoneNumber, isDefault } = req.body;
        const { addressId } = req.params;
        const user = req.user;

        const address = user.addresses.id(addressId);

        if (!address) {
            return res.status(404).json({ message: "Address Not Found" });
        }

        if (isDefault) {
            user.addresses.forEach((addr) => {
                addr.isDefault = false;
            });
        }

        address.label = label || address.label;
        address.fullName = fullName || address.fullName;
        address.streetAddress = streetAddress || address.streetAddress;
        address.city = city || address.city;
        address.state = state || address.state;
        address.zipCode = zipCode || address.zipCode;
        address.phoneNumber = phoneNumber || address.phoneNumber;
        address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

        await user.save();

        res.status(200).json({ message: "Address Updated Successfully", addresses: user.addresses });
    } catch (error) {
        console.error("Error in Updating Address:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }

}
export const deleteAddress = async (req, res) => {

   try {
    const { addressId } = req.params;
    const user = req.user;

    const addressToDelete = user.addresses.id(addressId);
    if (!addressToDelete) {
        return res.status(404).json({ message: "Address Not Found" });
    }

    const wasDefault = addressToDelete.isDefault;

    user.addresses.pull(addressId);

    if (wasDefault && user.addresses.length > 0) {
        user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({ 
        message: "Address Deleted Successfully", 
        addresses: user.addresses 
    });
} catch (error) {
    console.error("Error in Deleting Address:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
}

}


export const addToWishList = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { $addToSet: { wishList: productId } },
            { new: true }
        ).populate('wishList')


        res.status(200).json({
            message: "Product Added to Wishlist Successfully",
            wishList: updatedUser.wishList
        });

    } catch (error) {
        console.error("Error in Adding Product to Wishlist:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }

}
export const getWishList = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select("wishList")
            .populate("wishList")
            .lean()

        res.status(200).json({ message: "Wishlist fetched successfully", wishList: user.wishList || [] })
    } catch (error) {
        console.error("Error in getting wishlist:", error)
        return res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}
export const removeFromWishList = async (req, res) => {
    try {
        const { productId } = req.params;
        const user = req.user;

        const hasProduct = user.wishList.some(id => id.toString() === productId);
        if (!hasProduct) {
            return res.status(404).json({ message: "Product not found in wishlist" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { $pull: { wishList: productId } },
            { new: true }
        ).populate('wishList');

        res.status(200).json({
            message: "Product removed from wishlist successfully",
            wishList: updatedUser.wishList
        });

    } catch (error) {
        console.error("Error in removing wishlist:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }

}
