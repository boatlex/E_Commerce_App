import cloudinary from "../config/cloudinary.js"
import { Product } from "../models/product.model.js"
import { Order } from "../models/order.model.js"
import { User } from "../models/user.model.js"
import path from "path"
import { promises as fsPromises } from "fs";


export const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;

        if (!name || !description || !price || !stock || !category) {
            if (req.files) {
                for (const file of req.files) await fsPromises.unlink(file.path).catch(() => { });
            }
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "At least one image is required" });
        }




        const uploadPromises = req.files.map(async (file) => {
            const normalizedPath = file.path.replace(/\\/g, '/');
            console.log(file)
            return await cloudinary.uploader.upload(normalizedPath, {
                folder: "products",
                upload_preset: "images"
            });

        })
        const uploadResults = await Promise.all(uploadPromises);
        const imageUrls = uploadResults.map((result) => result.secure_url);

        // 3. ONLY delete local temporary files AFTER Cloudinary confirms success
        for (const file of req.files) {
            await fsPromises.unlink(file.path).catch((err) =>
                console.error("Failed to delete local temp file:", err.message)
            );
        }


        const product = await Product.create({
            name,
            description,
            price: parseFloat(price),
            stock: parseInt(stock, 10),
            category,
            images: imageUrls
        });

        return res.status(201).json({ product });

    } catch (error) {
        console.error("Error Creating Product:", error);

        // Clean up temp files if anything fails
        if (req.files) {
            for (const file of req.files) {
                await fsPromises.unlink(file.path).catch(() => { });
            }
        }

        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


export const getAllProducts = async (req, res) => {

    try {
        const products = await Product.find()
            .sort({ createdAt: -1 }).lean()
        res.status(200).json({ products })
    } catch (error) {
        console.error("Error Fetching Products", error)
        res.status(500).json({ message: "Internal Server Error" })
    }


}

export const updateProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category, existingImages } = req.body;
        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product Not Found" });
        }


        if (name) product.name = name;
        if (description) product.description = description;
        if (price !== undefined) product.price = parseFloat(price);
        if (stock !== undefined) product.stock = parseInt(stock, 10);
        if (category) product.category = category;


        if (req.files && req.files.length > 0) {
            if (req.files.length > 3) {
                return res.status(400).json({ message: "Maximum 3 images allowed" });
            }

            const uploadPromises = req.files.map((file) => {
                return cloudinary.uploader.upload(file.path, {
                    folder: "products",
                    upload_preset: "images"
                });

            });

            const uploadResults = await Promise.all(uploadPromises);
            product.images = uploadResults.map((result) => result.secure_url);


            for (const file of req.files) {
                await fsPromises.unlink(file.path).catch((err) =>
                    console.error("Failed to delete local temp file:", err.message)
                );
            }

        } else if (existingImages) {

            product.images = Array.isArray(existingImages) ? existingImages : [existingImages];
        } else {

            product.images = product.images || [];
        }

        await product.save();
        res.status(200).json({ product });

    } catch (error) {

        console.error("Error Updating Product", error);

        if (req.files) {
            for (const file of req.files) {
                await fsPromises.unlink(file.path).catch(() => { });
            }
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().
            populate("user", "name email").
            populate("orderItems.product").
            sort({ createdAt: -1 })

        res.status(200).json({ orders })
    } catch (error) {
        console.error("Error Updating Products", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}
export const updatedOrderStatus = async (req, res) => {

    try {
        const { orderId } = req.params
        const { status } = req.body

        if (!["pending", "shipped", "delivered", "cancelled"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" })
        }
        const order = await Order.findById(orderId)
        if (!order) {
            return res.status(404).json({ message: "Order Not Found" })
        }

        order.status = status

        if (status === "shipped" && !order.shippedAt) {
            order.shippedAt = new Date()
        }
        if (status === "delivered" && !order.deliveredAt) {
            order.deliveredAt = new Date()
        }

        await order.save()

        res.status(200).json({ message: "Order Status Updated Successfully", order })
    } catch (error) {
        console.error("Error Updating Status", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const getAllCustomers = async (req, res) => {
    try {
        const customers = await User.find().sort({ createdAt: -1 })
        if (!customers) {
            return res.status(404).json({ message: "No Customer is Found" })
        }

        res.status(200).json({ customers })
    } catch (error) {
        console.error("Error Fetching Customers", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}
export const getDashboardStats = async (req, res) => {
    try {
        const [totalCustomers, totalOrders, totalProducts, revenueResult] = await Promise.all([
            // Only count users who have a 'customer' role (adjust based on your schema)
            User.countDocuments({ role: "customer" }),

            Order.countDocuments(),

            Product.countDocuments(),

            Order.aggregate([

                { $match: { status: "delivered" } },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$totalPrice" },
                    },
                },
            ])
        ]);

        const totalRevenue = revenueResult[0]?.total || 0;

        res.status(200).json({
            totalCustomers,
            totalOrders,
            totalRevenue,
            totalProducts,
        });
    } catch (error) {
        console.error("Error Fetching DashBoard Stats", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



