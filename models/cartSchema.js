import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    products: [
        {
            productId: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            totalAmount: {
                type: Number,
            }
        }
    ]
}, { timestamps: true });

export default mongoose.model('Cart', cartSchema);