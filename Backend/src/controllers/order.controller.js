import { Order } from "../models/order.model.js"
import { Product } from "../models/product.model.js"
import { Review } from "../models/review.model.js"





export const createOrder = async (req, res) => {
    try {
        const { orderItems, shippingAddress, paymentResult, totalPrice } = req.body
        const user = req.user

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: "No order order items" })
        }

        for (const item of orderItems) {
            const product = await Product.findById(item.product._id)

            if (!product) {
                return res.status(404).json({ message: `Product ${product.name} Not Found ` })
            }
            if (product.stock < item.quantity) {
               return res.status(400).json({ message: `Insufficient stock for ${product.name}` })
            }
        }
        const order = await Order.create({
            user: user._id,
            clerkId: user.clerkId,
            orderItems,
            shippingAddress,
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









// import axios from "axios";
// import crypto from "crypto";
// import { ENV } from "../config/env.js";
// import { Order } from "../models/order.model.js";
// import { Product } from "../models/product.model.js";

// // Step 1: Initialize Payment and Create Pending Order
// export const createOrder = async (req, res) => {
//     try {
//         const { orderItems, shippingAddress } = req.body;
//         const user = req.user;

//         // 1. Validations
//         if (!user || !user.email) {
//             return res.status(401).json({ message: "User authentication or email missing" });
//         }
//         if (!orderItems || orderItems.length === 0) {
//             return res.status(400).json({ message: "No order items provided" });
//         }
//         if (!shippingAddress) {
//             return res.status(400).json({ message: "Shipping address is missing" });
//         }

//         let subTotal = 0;
//         const validatedItems = [];

//         // 2. Pre-verify stock availability and calculate prices securely
//         for (const item of orderItems) {
//             const product = await Product.findById(item.product?._id || item.product);

//             if (!product) {
//                 return res.status(404).json({ message: `Product item not found` });
//             }
//             if (product.stock < item.quantity) {
//                 return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
//             }

//             subTotal += product.price * item.quantity;
            
//             validatedItems.push({
//                 product: product._id,
//                 name: product.name,
//                 price: product.price,
//                 quantity: item.quantity,
//                 image: product.images?.[0] || ""
//             });
//         }

//         // 3. Apply standard shipping costs and local taxes safely
//         const shippingFee = 10.0;
//         const tax = subTotal * 0.08;
//         const total = subTotal + shippingFee + tax;

//         if (total <= 0) {
//             return res.status(400).json({ message: "Invalid Order Total" });
//         }

//         // Convert checkout amount into Paystack currency units (kobo/pesewas)
//         const paystackAmount = Math.round(total * 100);

//         // 4. Request hosted payment gateway link from Paystack API
//         const response = await axios.post(
//             'https://paystack.co',
//             {
//                 email: user.email,
//                 amount: paystackAmount,
//                 metadata: {
//                     userId: user._id.toString(),
//                     clerkId: user.clerkId
//                 }
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${ENV.PAYSTACK_SECRET_KEY}`,
//                     'Content-Type': 'application/json',
//                 },
//             }
//         );

//         // 5. Create order structure as pending (Do not deduct stock yet)
//         const order = await Order.create({
//             user: user._id,
//             clerkId: user.clerkId,
//             orderItems: validatedItems,
//             shippingAddress,
//             totalPrice: total,
//             paymentReference: response.data.data.reference, // Maps to Paystack tracking ref
//             paymentStatus: "pending",
//             status: "pending"
//         });

//         // Send payment link and reference back to React Native Axios collector
//         res.status(201).json({
//             message: "Order Initialized Successfully",
//             authorization_url: response.data.data.authorization_url,
//             reference: response.data.data.reference,
//             orderId: order._id
//         });

//     } catch (error) {
//         console.error("Error in initializing Order:", error.response?.data || error.message);
//         return res.status(500).json({ message: "Internal Server Error", error: error.message });
//     }
// };

// // Step 2: Paystack Webhook Handler (Deducts stock on success)
// export const validatedPayment = async (req, res) => {
//     try {
//         // 1. Verify webhook signature authenticity using crypto hash
//         const hash = crypto
//             .createHmac('sha512', ENV.PAYSTACK_SECRET_KEY)
//             .update(JSON.stringify(req.body))
//             .digest('hex');

//         if (hash !== req.headers['x-paystack-signature']) {
//             return res.status(401).json({ message: "Unauthorized: Invalid webhook signature" });
//         }

//         const event = req.body;

//         if (event.event === 'charge.success') {
//             const { reference } = event.data;

//             // 2. Fetch targeted matching database entry using reference
//             const order = await Order.findOne({ paymentReference: reference });

//             if (!order) {
//                 console.log(`⚠️ Order reference tracking missing from database: ${reference}`);
//                 return res.sendStatus(200);
//             }

//             // Prevent executing inventory reductions twice if webhook triggers a retry
//             if (order.paymentStatus === "paid") {
//                 return res.sendStatus(200);
//             }

//             // 3. Mark payment tracking state fields as confirmed
//             order.paymentStatus = "paid";
//             await order.save();

//             // 4. Securely deduct catalog inventories now that payment is guaranteed
//             for (const item of order.orderItems) {
//                 await Product.findByIdAndUpdate(item.product, {
//                     $inc: { stock: -item.quantity }
//                 });
//             }

//             console.log(`✅ Order ${order._id} paid and items inventory updated securely.`);
//         }

//         res.sendStatus(200);

//     } catch (error) {
//         console.error("Webhook verification exception:", error);
//         res.status(500).json({ error: error.message });
//     }
// };



// import { Order } from "../models/order.model.js";
// import { Review } from "../models/review.model.js";

// export const getUserOrders = async (req, res) => {
//     try {
//         const user = req.user;
//         if (!user || !user.clerkId) {
//             return res.status(401).json({ message: "Unauthorized: Clerk user missing" });
//         }

//         // 1. Fetch user orders and populate product references correctly
//         const orders = await Order.find({ clerkId: user.clerkId })
//             .populate("orderItems.product") // Maps directly to the product ID field in items
//             .sort({ createdAt: -1 });

//         const orderIds = orders.map(order => order._id);

//         // 2. Fetch any submitted reviews associated with these orders
//         const reviews = await Review.find({ orderId: { $in: orderIds } });
//         const reviewedOrderIds = new Set(reviews.map(r => r.orderId.toString()));

//         // 3. Inject review status cleanly into response mapping
//         const ordersWithReviewStatus = orders.map(order => ({
//             ...order.toObject(),
//             hasReviewed: reviewedOrderIds.has(order._id.toString())
//         }));

//         return res.status(200).json({ orders: ordersWithReviewStatus });

//     } catch (error) {
//         console.error("Error in fetching user orders:", error);
//         return res.status(500).json({ 
//             message: "Internal Server Error", 
//             error: error.message 
//         });
//     }
// };
