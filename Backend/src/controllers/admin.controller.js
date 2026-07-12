import cloudinary from "../config/cloudinary.js"
import { Product } from "../models/product.model.js"
import { Order } from "../models/order.model.js"
import { User } from "../models/user.model.js"
import fs from "fs"
import path from "path"


export const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;


        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "At least one image is required" });
        }

        
        const uploadPromise = req.files.map(async (file) => {
            const base64Image = Buffer.from(file.buffer).toString("base64");
            const dataURI = `data:${file.mimetype};base64,${base64Image}`;

            
            const result = await cloudinary.uploader.upload(dataURI, {
                folder: "products"
            });
            return result;
        });
        
        const uploadResults = await Promise.all(uploadPromise);
        const imageUrl = uploadResults.map((result) => result.secure_url);

        const product = await Product.create({
            name,
            description,
            price: parsedPrice,
            stock: parsedStock,
            category,
            images: imageUrl
        });

        res.status(201).json({ product });
    } catch (error) {
        console.error("Error Creating Product", error);
        res.status(500).json({ message: "Internal Server Error" });
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

            const uploadPromises = req.files.map(async (file) => {
                const base64Image = Buffer.from(file.buffer).toString("base64");
                const dataURI = `data:${file.mimetype};base64,${base64Image}`;
                const result = await cloudinary.uploader.upload(dataURI, {
                    folder: "products",   
                });
                return result;
            });

            const uploadResults = await Promise.all(uploadPromises);
            product.images = uploadResults.map((result) => result.secure_url);

        } else if (existingImages) {
        
            product.images = Array.isArray(existingImages) ? existingImages : [existingImages];
        } else {
            
            product.images = product.images || [];
        }

        await product.save();
        res.status(200).json({ product });

    } catch (error) {
        
        console.error("Error Updating Product", error);
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



