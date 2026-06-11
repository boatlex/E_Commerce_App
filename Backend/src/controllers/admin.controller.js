import cloudinary from "../config/cloudinary.js"
import { Product } from "../models/product.model.js"
import { Order } from "../models/order.model.js"
import { User } from "../models/user.model.js"



export const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body

        if (!name || !description || !price || !stock || !category) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (!req.files && !req.files.length === 0) {
            return res.status(400).json({ message: "At least one image is required" })
        }

        if (req.files.length > 3) {
            return res.status(400).json({ message: "Maximum three images are allowed" })
        }

        const uploadPromise = req.files.map(file => {
            return cloudinary.uploader.upload(file.path, {
                folder: "products"
            })
        })

        const uploadResults = await Promise.all(uploadPromise)

        const imageUrl = uploadResults.map((result) => result.secure_url)

        const product = await Product.create({
            name,
            description,
            price: parseFloat(price),
            stock: parseInt(stock),
            category,
            image: imageUrl
        })

        res.status(201).json({ product })
    } catch (error) {
        console.error("Error Creating Product", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const getAllProducts = async (req, res) => {

    try {
        const products = await Product.find().sort({ createdAt: -1 })
        res.status(200).json({ products })
    } catch (error) {
        console.error("Error Fetching Products", error)
        res.status(500).json({ message: "Internal Server Error" })
    }


}

export const updateProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body
        const { id } = req.params

        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).json({ message: "Product Not Found" })
        }

        if (name) product.name = name
        if (description) product.description = description
        if (price !==undefined) product.price = parseFloat(price)
        if (stock !== undefined) product.stock = parseInt(stock)
        if (category) product.category = category

        if (req.files && req.files.length > 0) {
            if (req.files.length > 3) {
                return res.status(400).json({ message: "Maximum 3 images allowed" })
            }
        }

        const uploadPromise = await req.files.map((file) => {
            return cloudinary.uploader.upload(file.path, {
                folder: 'products'
            })
        })

        const uploadResults = await Promise.all(uploadPromise)
        product.images = uploadResults.map((result) => result.secure_url)

        await product.save()
        res.status(200).json({ product })
    } catch (error) {

        console.error("Error Updating Products", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const getAllOrders = async (req, res) => {
    try {
        const order = (await Order.find().
            populate("user", "name email")).
            populate("orderItems.product").
            sort({ createdAt: -1 })

        res.status(200).json({ order })
    } catch (error) {
        console.error("Error Updating Products", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}
export const updateOrderstatus = async (req, res) => {

    try {
        const { orderId } = req.params
        const { status } = req.body

        if (!["pending", "shipped", "delivered"].includes(status)) {
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
            order.deliverdAt = new Date()
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
        const totalCustomers =await User.countDocuments()
        const totalOrders = await Order.countDocuments()
        const revenueResult = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalPrice" },
                },
            },
        ])
        const totalRevenue = revenueResult[0]?.total || 0
        const totalProducts = await Product.countDocuments()

        res.status(200).json({
            totalCustomers,
            totalOrders,
            totalRevenue,
            totalProducts,
        })
    } catch (error) {
        console.error("Error Fetching  DashBoard Stats", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}
