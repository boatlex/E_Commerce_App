import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";

export const createOrder = async (req, res) => {
    try {
        const { orderItems, shippingAddress, paymentReference, totalPrice } = req.body;
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: "User authentication missing" });
        }

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: "No order items provided" });
        }

        for (const item of orderItems) {
            const productId = item.product?._id || item.product || item.productId;
            
            if (!productId) {
                return res.status(400).json({ message: "Invalid product ID format encountered" });
            }

            const product = await Product.findById(productId);

            if (!product) {
                return res.status(404).json({ message: `Product item not found in database records` });
            }
            if (product.stock < item.quantity) {
               return res.status(400).json({ message: `Insufficient inventory stock for ${product.name}` });
            }
        }

        const order = await Order.create({
            user: user._id,
            clerkId: user.clerkId || req.user?.id || "N/A",
            orderItems: orderItems.map(item => ({
                product: item.product?._id || item.product || item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image || ""
            })),
            shippingAddress,
            totalPrice,
            paymentReference: paymentReference || `ref_${Date.now()}`, 
            paymentStatus: "pending"
        });


        res.status(201).json({ message: "Order Created Successfully", order });
    } catch (error) {
        console.error("Error in creating Orders:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const clerkId = req.user?.clerkId || req.user?.id;
        
        if (!clerkId) {
            return res.status(401).json({ message: "Authentication record reference missing" });
        }

        const orders = await Order.find({ clerkId })
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
        console.error("Error in fetching user orders:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};