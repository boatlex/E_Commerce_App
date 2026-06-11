import { Order } from "../models/order.model.js"
import { Product } from "../models/product.model.js"
import { Review } from "../models/review.model.js"





export const createOrder = async (req, res) => {
    try {
        const { orderItems, shippindAddress, paymentResult, totalPrice } = req.body
        const user = req.user

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: "No order order items" })
        }

        for (const item of orderItems) {
            const product = Product.findById(item.product._id)

            if (!product) {
                return res.status(404).json({ message: `Product ${product.name} Not Found ` })
            }
            if (product.stock < item.quantity) {
                res.status(400).json({ message: `Insufficient stock for ${product.name}` })
            }
        }
        const order = await Order.create({
            user: user._id,
            clerkId: user.clerkId,
            orderItems,
            shippindAddress,
            paymentResult,
            totalPrice

        })

        for (const item of orderItems) {
            const product = await Product.findByIdAndUpdate(item.product._id, {
                $inc: { stock: -item.quantity }
            })
        }

        res.status(201).json({ message: "Order Created Successfully", order })
    } catch (error) {
        console.error("Error in creating Orders:", error)
        return res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ clerkId: req.user.clerkId })
            .populate("orderItems.product")
            .sort({ createdAt: -1 });

        const orderIds = orders.map(order => order._id);

        const reviews = await Review.find({ orderId: { $in: orderIds } });

        const reviewedOrderIds = new Set(reviews.map(r => r.orderId.toString()));

        const ordersWithReviewStatus = orders.map(order => ({
            ...order.toObject(),
            hasReviewed: reviewedOrderIds.has(order._id.toString())
        }));

        res.status(200).json({ orders: ordersWithReviewStatus });

    } catch (error) {
        console.error("Error in fetching user orders:", error)
        return res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}