import { Review } from "../models/review.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";


import { Review } from "../models/review.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";

export const createReview = async (req, res) => {
    try {
        const { productId, orderId, rating, comment } = req.body;
        const user = req.user;

        
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "You can only rate from 1-5" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order Cannot be Found" });
        }

        if (order.clerkId?.toString() !== user.clerkId?.toString()) {
            return res.status(403).json({ message: "Not Authorized to review this order" });
        }

        if (order.status !== "delivered") {
            return res.status(400).json({ message: "You can only review delivered orders" });
        }

        const productInOrder = order.orderItems.find(
            (item) => item.product.toString() === productId.toString()
        );
        if (!productInOrder) {
            return res.status(404).json({ message: "Product Not Found in Order" });
        }

        // Upsert Review (Atomic update if exists, otherwise create)
        const review = await Review.findOneAndUpdate(
            { productId, orderId, userId: user._id },
            { rating, comment: comment || "" }, 
            { new: true, upsert: true, runValidators: true }
        );

        // OPTIMIZATION: Calculate average using MongoDB aggregation rather than loading arrays into memory
        const stats = await Review.aggregate([
            { $match: { productId: review.productId } },
            {
                $group: {
                    _id: "$productId",
                    averageRating: { $avg: "$rating" },
                    totalReview: { $sum: 1 }
                }
            }
        ]);

        // Update the Product document with fresh stats
        if (stats.length > 0) {
            await Product.findByIdAndUpdate(productId, {
                averageRating: Math.round(stats[0].averageRating * 10) / 10, // Rounds to 1 decimal place
                totalReview: stats[0].totalReview
            });
        }

        res.status(200).json({ 
            message: "You have reviewed this product successfully", 
            review 
        });

    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};






export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const user = req.user;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review Not Found" });
        }

    
        if (review.userId.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this review" });
        }

        const productId = review.productId;


        await Review.findByIdAndDelete(reviewId);

        // 4. OPTIMIZATION: Calculate new stats using MongoDB aggregation instead of loading arrays into memory
        const stats = await Review.aggregate([
            { $match: { productId: productId } },
            {
                $group: {
                    _id: "$productId",
                    averageRating: { $avg: "$rating" },
                    totalReview: { $sum: 1 }
                }
            }
        ]);

        // 5. Update the product document based on whether any reviews remain
        if (stats.length > 0) {
            await Product.findByIdAndUpdate(productId, {
                averageRating: Math.round(stats[0].averageRating * 10) / 10, // Round to 1 decimal place
                totalReview: stats[0].totalReview
            });
        } else {
            // Reset to default values if the deleted review was the last one
            await Product.findByIdAndUpdate(productId, {
                averageRating: 0,
                totalReview: 0
            });
        }

        res.status(200).json({ message: "Review Deleted Successfully" });
        
    } catch (error) {

        console.error("Error deleting review:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


