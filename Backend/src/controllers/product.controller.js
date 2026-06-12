import { Product } from "../models/product.model.js";


export const getProductById = async (req,res)=>{
    try {
        const {id} =req.params

        const product = await Product.findById(id).lean()
        if(!product){
            return res.status(404).json({message:"Product not found "})
        }

        res.status(200).json({product})
    } catch (error) {
        console.error("Error getting Product", error)
        res.status(500).json({message:"Internal Server Error", error:error.message})
    }
}