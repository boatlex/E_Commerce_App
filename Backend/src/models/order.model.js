import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    image: {
        type: String,
        required: true,
    },
    shippingAdress: {
        type: shippingAdressSchema,
        required: true,
    },
    paymentResults: {
        id: String,
        status: String,
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: ["pending", "shipped", "delivered"],
        default: "pending",
    },
    deliveredAt: {
        type: Date,
    },
    shippeddAt: {
        type: Date,
    },
})

const shippingAdressSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,

    },
    streetAddresss: {
        type: String,
        required: true,

    },
    city: {
        type: String,
        required: true,

    },
    state: {
        type: String,
        required: true,

    },
    zipCode:{
        type:Number,
        required:true,
    },
    phoneNumber:{
        type:Number,
        required:true,
    },
})
const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    clerkId: {
        type: String,
        required: true,
    },
    orderItems: [orderItemSchema]
}, { timestamps: true })

export const Order = mongoose.model("Order", orderSchema)