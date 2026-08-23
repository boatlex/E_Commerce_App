import mongoose from "mongoose";

const shippingAddressSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    streetAddress: { 
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
    zipCode: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
});


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
    }
});

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
    orderItems: [orderItemSchema], 
    
    shippingAddress: { 
        type: shippingAddressSchema,
        required: true,
    },
    paymentReference: { 
        type: String,
        required: true,
        unique: true
    },
    paymentStatus: { 
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    status: { 
        type: String,
        enum: ["pending", "shipped", "delivered", "cancelled"],
        default: "pending",
    },
    isPaid: {
        type: Boolean,
        default:false
    },
    paidAt: {
        type: Date,
    },
    shippedAt: {
        type: Date,
    },
    deliveredAt: {
        type: Date,
    },
    cancelledAt: {
        type: Date,
    },
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);
