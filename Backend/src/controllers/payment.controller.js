import axios from "axios";
import { ENV } from "../config/env.js";
import crypto from "crypto";
import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";


export const intializedPayment = async (req, res) => {
    try {
        const { cartItems, shippingAddress } = req.body;
        const user = req.user;
        if (!user || !user.email) {
            return res.status(401).json({ message: "User authentication or email missing" });
        }
        if (!cartItems || cartItems.length === 0 || !shippingAddress) {
            return res.status(400).json({ message: "Cart is Empty or shipping address missing" });
        }

        let subTotal = 0;
        const validateItems = [];

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

            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
            }

            subTotal += product.price * item.quantity;
            validateItems.push({
                product: product._id.toString(),
                name: product.name,
                price: product.price,
                quantity: item.quantity,
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

        const response = await axios.post(
            'https://api.paystack.co/transaction/initialize',
            {
                email: user.email,
                amount: paystackAmount,

                customer: {
                    first_name: shippingAddress.fullName.split(" ")[0] || "Customer",
                    last_name: shippingAddress.fullName.split(" ").slice(1).join(" ") || "Name",
                    phone: String(shippingAddress.phoneNumber || "")
                },
                
                metadata: {
                    userId: user._id.toString(),
                    cartCount: validateItems.length,
                    shippingAddress: shippingAddress,
                    items: validateItems,

                    customer_name: shippingAddress.fullName,
                    customer_phone: shippingAddress.phoneNumber,
                    custom_fields: [
                        {
                            display_name: "Customer Full Name",
                            variable_name: "customer_name",
                            value: shippingAddress.fullName || user.name || "N/A"
                        },
                        {
                            display_name: "Customer Phone Number",
                            variable_name: "customer_phone",
                            value: String(shippingAddress.phoneNumber || user.phone || "N/A")
                        }
                    ],
                    customerName: shippingAddress.fullName,
                    customerPhone: shippingAddress.phoneNumber
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${ENV.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        await Order.create({
            user: user._id,
            clerkId: user.clerkId || req.user.id || "clerk_default_dev_id",
            orderItems: validateItems,
            shippingAddress: shippingAddress,
            totalPrice: total,
            paymentReference: response.data.data.reference,
            paymentStatus: "pending"
        });

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
        const payload = req.rawBody ? req.rawBody : JSON.stringify(req.body);

        const hash = crypto
            .createHmac('sha512', ENV.PAYSTACK_SECRET_KEY)
            .update(payload)
            .digest('hex');

        if (hash !== req.headers['x-paystack-signature']) {
            console.error("❌ Paystack signature verification failed.");
            return res.status(401).json({ message: "Unauthorized: Invalid signature" });
        }

        const event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

        if (event.event === 'charge.success') {
            const { reference, metadata } = event.data;

            const order = await Order.findOne({ paymentReference: reference });

            if (order) {
                if (!order.isPaid) {
                    order.paymentStatus = "paid";
                    order.isPaid = true;
                    order.status = "pending";
                    order.paidAt = new Date();

                    if (metadata) {
                        order.shippingAddress.fullName = metadata.customer_name || order.shippingAddress.fullName;
                        order.shippingAddress.phoneNumber = metadata.customer_phone || order.shippingAddress.phoneNumber;
                    }


                    await order.save();

                    if (order.orderItems && order.orderItems.length > 0) {
                        for (const item of order.orderItems) {
                            await Product.findByIdAndUpdate(item.product, {
                                $inc: { stock: -item.quantity }
                            });
                        }
                    }


                    await Cart.findOneAndUpdate({ user: order.user }, { items: [] });

                    console.log(`✅ MongoDB Order ${order._id} successfully switched to PAID.`);
                } else {
                    console.log(`ℹ️ Order ${order._id} was already previously marked as paid.`);
                }
            } else {
                console.warn(`⚠️ Target order reference not found: ${reference}`);
            }
        }

        return res.sendStatus(200);

    } catch (error) {
        console.error("💥 Critical Webhook Exception:", error);
        if (!res.headersSent) {
            return res.status(500).json({ error: error.message });
        }
    }
};
