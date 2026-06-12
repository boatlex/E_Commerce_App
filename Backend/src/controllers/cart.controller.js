import { Cart } from "../models/cart.model.js"
import { Product } from "../models/product.model.js"



export const getCart = async (req, res) => {
    try {
        const user = req.user
        let cart = await Cart.findOne({ clerkId: user.clerkId }).populate('items.product')

        if (!cart) {
            cart = await Cart.create({
                user: user._id,
                clerkId: user.clerkId,
                items: []
            })
        }
        res.status(200).json({ cart })
    } catch (error) {
        console.error("Error Creating or  getting cart", error)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body
        const user = req.user

        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({ message: "Product Not Found" })
        }
        if (product.stock < quantity) {
            return res.status(400).json({ message: `Insuficient stock for ${product.name}` })
        }

        let cart = await Cart.findOne({ clerkId: user.clerkId })

        if (!cart) {
            cart = await Cart.create({
                user: user._id,
                clerkId: user.clerkId,
                items: []
            })
        }

        const existingItem = cart.items.find((item) => item.product.toString() === productId)
        if (existingItem) {
            const Newquantity = existingItem.quantity + quantity
            if (product.stock < Newquantity) {
                return res.status(400).json({ message: "Insufficient Stock" })
            }
        } else {
            cart.items.push({
                product: productId,
                quantity
            })
        }

        await cart.save()
        res.status(200).json({ message: "Product Added to Cart Successfully", cart })
    } catch (error) {

        console.error("Error Adding Product to Cart", error)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

export const updateCartItem = async (req, res) => {
  
    try {
        const { quantity } = req.body;
        const { productId } = req.params;
        const user = req.user;

        if (quantity < 1) {
            return res.status(400).json({ message: "quantity must be at least 1" });
        }

        const product = await Product.findById(productId).select('stock').lean();
        if (!product) {
            return res.status(404).json({ message: 'Product Not Found' });
        }
        if (product.stock < quantity) {
            return res.status(400).json({ message: "Insufficient Stock" });
        }

        const cart = await Cart.findOneAndUpdate(
            { 
                clerkId: user.clerkId, 
                "items.product": productId 
            },
            { 
                $set: { "items.$.quantity": quantity } 
            },
            { new: true } 
        ).populate('items.product');

        if (!cart) {
            return res.status(404).json({ message: 'Cart or Item Not Found' });
        }

        res.status(200).json({ message: "Cart Updated Successfully", cart });
    } catch (error) {
        console.error("Error Updating CartItem", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};



export const removeFromCart = async (req, res) => {
    try {
    const { productId } = req.params;
    const user = req.user;

    const cart = await Cart.findOneAndUpdate(
        { clerkId: user.clerkId },
        { $pull: { items: { product: productId } } }, 
        { new: true } 
    ).populate('items.product');

    if (!cart) {
        return res.status(404).json({ message: "Cart Not Found" });
    }
    
    res.status(200).json({ message: "Item Removed Successfully", cart });

} catch (error) {
    console.error("Error Removing CartItem", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
}

}

export const clearCart = async (req, res) => { 
   try {
    const user = req.user;

    const cart = await Cart.findOneAndUpdate(
        { clerkId: user.clerkId },
        { $set: { items: [] } },
        { new: true } 
    );

    if (!cart) {
        return res.status(404).json({ message: "Cart Not Found" });
    }

    res.status(200).json({ message: "Cart Cleared Successfully", cart });

} catch (error) {
    console.error("Error Clearing Cart", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
}

}