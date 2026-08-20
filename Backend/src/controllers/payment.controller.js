import axios from "axios";
import { ENV } from "../config/env.js";
import crypto from "crypto"; // Built-in Node.js module
import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";

export const intializedPayment = async (req, res) => {
    try {
        const { cartItems, shippingAddress } = req.body;

        // 1. Fixed req.user syntax
        const user = req.user;
        if (!user || !user.email) {
            return res.status(401).json({ message: "User authentication or email missing" });
        }
        if (!cartItems || cartItems.length === 0 || !shippingAddress) {
            return res.status(400).json({ message: "Cart is Empty or shipping address missing" });
        }

        let subTotal = 0;
        const validateItems = [];

        // 2. Fixed variable scoping inside the loop
        for (const item of cartItems) {
            const productId = item.product?._id || item.product || item.productId;
            if (!productId) {
                console.log("❌ Failed validation on item payload structure:", item);
                return res.status(400).json({ message: "Invalid product ID format provided" });
            }

            const product = await Product.findById(productId);
            if (!product) {
                return res.status(400).json({ message: `Product not found` });
            }

            // Fixed: Check stock against user's requested item.quantity, not product.quantity
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
            }

            subTotal += product.price * item.quantity;
            validateItems.push({
                product: product._id.toString(),
                name: product.name,
                price: product.price,
                quantity: item.quantity, // Fixed: use item.quantity
                image: product.images?.[0] || ""
            });
        }

        const shippingFee = 10.0;
        const tax = subTotal * 0.08;
        const total = subTotal + shippingFee + tax;

        if (total <= 0) {
            return res.status(400).json({ message: "Invalid Order Total" });
        }

        const paystackAmount = Math.round(total * 100);

        // 3. Fixed URL: Must hit /transaction/initialize
        const response = await axios.post(
            'https://api.paystack.co/transaction/initialize',
            {
                email: user.email,
                amount: paystackAmount,
                metadata: {
                    userId: user._id.toString(), // CRUCIAL: Pass this to find the user/order in webhook
                    cartCount: validateItems.length,
                    shippingAddress: shippingAddress,
                    items: validateItems // Sending items allows webhook to see what was bought
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${ENV.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

               // 4. Create a "pending" order in your database before redirecting the user
        await Order.create({
            user: user._id,
            clerkId: user.clerkId || req.user.id || "clerk_default_dev_id", // 🟢 FIXED: Satisfies your schema's required clerkId property
            orderItems: validateItems,                                    // 🟢 FIXED: Maps to your schema array variable name
            shippingAddress: shippingAddress,
            totalPrice: total,
            paymentReference: response.data.data.reference, 
            paymentStatus: "pending"
        });


        // Return authorization_url and reference to React Native
        res.status(200).json(response.data);

    } catch (error) {
        console.error("Paystack Initialize Error:", error.response?.data || error.message);
        return res.status(500).json({
            error: error.response?.data?.message || 'Initialization failed'
        });
    }
};

export const validatedPayment = async (req, res) => {
    try {
        // 5. SECURITY: Verify that this webhook request actually came from Paystack
        const hash = crypto
            .createHmac('sha512', ENV.PAYSTACK_SECRET_KEY)
            .update(JSON.stringify(req.body))
            .digest('hex');

        if (hash !== req.headers['x-paystack-signature']) {
            return res.status(401).json({ message: "Unauthorized: Invalid webhook signature" });
        }

        const event = req.body;

        if (event.event === 'charge.success') {
            const { reference, customer } = event.data;

            // Find the pending order using the reference Paystack returned
            const order = await Order.findOne({ paymentReference: reference });

            if (order) {
                order.paymentStatus = "paid";
                order.isPaid = true;
                order.paidAt = new Date();
                await order.save();

                // OPTIONAL: Deduct product stock here securely since payment is verified
                for (const item of order.items) {
                    await Product.findByIdAndUpdate(item.product, {
                        $inc: { stock: -item.quantity }
                    });
                }

                // OPTIONAL: Clear the user's shopping cart model here
                await Cart.findOneAndUpdate({ user: order.user }, { items: [] });

                console.log(`✅ Order ${order._id} successfully paid by ${customer.email}`);
            } else {
                console.log(`⚠️ Order not found for reference: ${reference}`);
            }
        }

        // Always send a 200 OK back to Paystack so they stop retrying the webhook
        res.sendStatus(200);

    } catch (error) {
        console.error("Webhook verification error:", error);
        res.status(500).json({ error: error.message || 'validated payment failed' });
    }
};




// export const intializedPayment = async (req, res) => {

//     try {

//         const { cartItems, shipingAddress } = req.body
//         const user = req.user
//         if (!user || !user.email) {
//             return res.status(401).json({ message: "User authentication or email missing" });
//         }
//         if (!cartItems || !shipingAddress) {
//             return res.status(400).json({ message: "Cart is Empty" })
//         }

//         let subTotal = 0
//         const validateItems = []

//         for (const item of cartItems) {
//             if (!item.product?._id) {
//                 return res.status(400).json({ message: "Invalid product ID format provided" });
//             }
//             const product = await Product.findById(item.product._id)
//             if (!product) {
//                 return res.status(400).json({ message: `Product ${item.product.name} not found` })
//             }
//             if (product.stock < item.quantity) {
//                 return res.status(400).json({ message: `Insufficient stock for ${product.name}` })
//             }

//             subTotal += product.price * item.quantity
//             validateItems.push({
//                 product: product._id.toString(),
//                 name: product.name,
//                 price: product.price,
//                 quantity: item.quantity,
//                 image: product.images?.[0] || ""
//             })
//         }

//         const shippingFee = 10.0
//         const tax = subTotal * 0.08
//         const total = subTotal + shippingFee + tax

//         if (total < 0) {
//             return res.status(400).json({ message: "Invalid Order Total" })
//         }


//         const paystackAmount = Math.round(total * 100);

//         const response = await axios.post(
//             'https://paystack.co',
//             {
//                 email: user.email,
//                 amount: paystackAmount,
//                 // Optional: callback_url: 'https://yourwebsite.com'

//                 metadata: {
//                     custom_fields: [
//                         {
//                             display_name: "Cart Count", variable_name: "cart_count",
//                             value: validateItems.length
//                         }
//                     ]
//                 }
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${ENV.PAYSTACK_SECRET_KEY}`,
//                     'Content-Type': 'application/json',
//                 },
//             }
//         );
//         res.status(200).json(response.data.data)

//     } catch (error) {
//         console.error("Paystack Initialize Error:", error.response?.data || error.message);
//         return res.status(500).json({
//             error: error.response?.data?.message || 'Initialization failed'
//         });
//     }

// }


// export const validatedPayment = async (req, res) => {


//     try {
//         const event = req.body;

//         if (event.event === 'charge.success') {
//             const { reference, customer, amount } = event.data;
//             // Update your database: Mark order as paid
//             console.log(`Payment successful for ${customer.email}. Ref: ${reference}`);
//         }

//         res.sendStatus(200);

//     } catch (error) {
//         res.status(500).json({ error: error.response?.data?.message || 'validated payment failed' });
//     }
// }