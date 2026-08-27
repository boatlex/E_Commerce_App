import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating cannot be more than 5"]
  },
  comment: {
    type: String,
    trim: true,
    maxlength: [1000, "Review comment cannot exceed 1000 characters"],
    default: ""
  }
}, { timestamps: true });

// 1. PERFORMANCE INDEX: Speeds up calculation queries matching by product
reviewSchema.index({ productId: 1 });

// 2. INTEGRITY INDEX: Strictly prevents duplicate reviews for the same item per order
// reviewSchema.index({ orderId: 1, productId: 1, userId: 1 }, { unique: true });

export const Review = mongoose.model("Review", reviewSchema);
