import { ENV } from "../config/env.js";
import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";



export const intializedPayment = async (req, res) => {

    try {

        const { cartItems, shipingAddress } = req.body
        const user = req, user
        if (!user || !user.email) {
            return res.status(401).json({ message: "User authentication or email missing" });
        }
        if (!cartItems || !shipingAddress) {
            return res.status(400).json({ message: "Cart is Empty" })
        }

        let subTotal = 0
        const validateItems = []

        for (const item of cartItems) {
            if (!productId) {
                return res.status(400).json({ message: "Invalid product ID format provided" });
            }
            const product = await Product.findById(item.product._id)
            if (!product) {
                return res.status(400).json({ message: `Product ${item.product.name} not found` })
            }
            if (product.stock < product.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}` })
            }

            subTotal += product.price * item.quantity
            validateItems.push({
                product: product._id.toString(),
                name: product.name,
                price: product.price,
                quantity: product.quantity,
                Image: product.images[0]
            })
        }

        const shippingFee = 10.0
        const tax = subTotal * 0.08
        const total = subTotal + shippingFee + tax

        if (total < 0) {
            return res.status(400).json({ message: "Invalid Order Total" })
        }


        const paystackAmount = Math.round(total * 100);

        const response = await axios.post(
            'https://paystack.co',
            {
                email: user.email,
                amount: paystackAmount,
                // Optional: callback_url: 'https://yourwebsite.com'

                metadata: {
                    custom_fields: [
                        {
                            display_name: "Cart Count", variable_name: "cart_count",
                            value: validateItems.length
                        }
                    ]
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${ENV.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        res.status(200).json(response.data.data)

    } catch (error) {
        console.error("Paystack Initialize Error:", error.response?.data || error.message);
        return res.status(500).json({
            error: error.response?.data?.message || 'Initialization failed'
        });
    }

}


export const validatedPayment = async (req, res) => {


    try {
        const event = req.body;

        if (event.event === 'charge.success') {
            const { reference, customer, amount } = event.data;
            // Update your database: Mark order as paid
            console.log(`Payment successful for ${customer.email}. Ref: ${reference}`);
        }

        res.sendStatus(200);

    } catch (error) {
        res.status(500).json({ error: error.response?.data?.message || 'validated payment failed' });
    }
}