import { Review } from "../models/review.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";



export const createReview = async (req, res) => {
try {
    const { productId, orderId, rating } = req.body;
    const user = req.user;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "You can only rate from 1-5" })
    }

    const order = await Order.findById(orderId);
    if (!order) {
        return res.status(404).json({ message: "Order Cannot be Found" })
    }

    if (order.clerkId !== user.clerkId) {
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
       let review
    const existingReview = await Review.findOne({ productId, orderId, userId: user._id });
    if (existingReview) {
        //update existing review
        existingReview.rating = rating
        existingReview.orderId = orderId
        review = await existingReview.save()
    }else{
        review = await Review.create({
        productId,
        userId: user._id,
        orderId,
        rating
    });
    }

    

    const reviews = await Review.find({ productId });
    const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
    
    await Product.findByIdAndUpdate(productId, {
        averageRating: totalRating / reviews.length,
        totalReview: reviews.length
    }, {new:true, runValidators:true});

    res.status(200).json({ message: "You have reviewed this product successfully", review });

} catch (error) {
    console.error("Error creating review", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
}


}

export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params
        const user = req.user

        const review = await Review.findById(reviewId)
        if (!review) {
            return res.status(404).json({ message: 'Review Not Found' })
        }

        if (review.userId.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this review" })
        }

        const productId = review.productId
        await Review.findByIdAndDelete(reviewId)


        const reviews = await Review.find({ productId })
        const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0)
        await Product.findByIdAndUpdate(productId, {
            averageRating: reviews.length > 0 ? totalRating / reviews.length : 0,
            totalReview : reviews.length
        })

       res.status(200).json({message:"Review Deleted Successfully"})
    } catch (error) {
      console.error("Error getting Produt", error)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}