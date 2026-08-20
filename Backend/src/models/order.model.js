// import mongoose from "mongoose";

// const shippingAddressSchema = new mongoose.Schema({
//     fullName: {
//         type: String,
//         required: true,

//     },
//     streetAddress: {
//         type: String,
//         required: true,

//     },
//     city: {
//         type: String,
//         required: true,

//     },
//     state: {
//         type: String,
//         required: true,

//     },
//     zipCode:{
//         type:Number,
//         required:true,
//     },
//     phoneNumber:{
//         type:Number,
//         required:true,
//     },
// })
// const orderItemSchema = new mongoose.Schema({
//     product: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Product",
//         required: true,
//     },
//     name: {
//         type: String,
//         required: true,
//     },
//     price: {
//         type: Number,
//         required: true,
//         min: 0,
//     },
//     quantity: {
//         type: Number,
//         required: true,
//         min: 1,
//     },
//     image: {
//         type: String,
//         required: true,
//     },
//     shippingAddress: {
//         type: shippingAddressSchema,
//         required: true,
//     },
//     paymentResults: {
//         id: String,
//         status: String,
//     },
//     totalPrice: {
//         type: Number,
//         required: true,
//         min: 0,
//     },
//     status: {
//         type: String,
//         enum: ["pending", "shipped", "delivered", "cancelled"],
//         default: "pending",
//     },
//     deliveredAt: {
//         type: Date,
//     },
//     shippedAt: {
//         type: Date,
//     },
// })

// const orderSchema = new mongoose.Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true,
//     },
//     clerkId: {
//         type: String,
//         required: true,
//     },
//     orderItems: [orderItemSchema]
// }, { timestamps: true })

// export const Order = mongoose.model("Order", orderSchema)
















import mongoose from "mongoose";

const shippingAddressSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    streetAddress: { // Fixed typo: streetAddresss -> streetAddress
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
        type: Number,
        required: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
});

// Cleaner item schema: contains only properties unique to the product unit
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
    orderItems: [orderItemSchema], // Array of clean items
    
    // Moved these fields to the parent Order level where they belong:
    shippingAddress: { // Fixed typo: shippingAdress -> shippingAddress
        type: shippingAddressSchema,
        required: true,
    },
    paymentReference: { // Added this field explicitly to map with Paystack's tracking ref
        type: String,
        required: true,
        unique: true
    },
    paymentStatus: { // Track if Paystack webhook confirmed it ("pending" vs "paid")
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    status: { // Order delivery milestone fulfillment tracking
        type: String,
        enum: ["pending", "shipped", "delivered", "cancelled"],
        default: "pending",
    },
    shippedAt: { // Fixed typo: shippeddAt -> shippedAt
        type: Date,
    },
    deliveredAt: {
        type: Date,
    },
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);
