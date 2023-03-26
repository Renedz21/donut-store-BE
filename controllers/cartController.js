import Cart from "../models/cartSchema.js";
import Product from "../models/productSchema.js";

export const getCart = async (req, res, next) => {

    const { userId } = req.params;

    try {
        const cart = await Cart.findOne({ userId: userId });

        const products = await Product.find({ _id: { $in: cart.products.map(p => p.productId) } }).populate('category');

        res.status(200).json({ products, cart });

    } catch (error) {
        next(error);
    }
}

export const addToCart = async (req, res, next) => {
    try {

        //consider the totalAmount

        const cart = await Cart.findOne({ userId: req.params.userId });

        if (cart) {
            const product = cart.products.find(p => p.productId === req.body.productId);
            if (product) {
                await Cart.findOneAndUpdate(
                    { userId: req.params.userId, "products.productId": req.body.productId },
                    { $inc: { "products.$.quantity": req.body.quantity } }
                );
                res.status(200).json({ message: 'Product quantity updated' });
            } else {
                await Cart.findOneAndUpdate(
                    { userId: req.params.userId },
                    { $push: { products: { productId: req.body.productId, quantity: req.body.quantity } } }
                );
                res.status(200).json({ message: 'Product added to cart' });
            }
        } else {
            const cart = new Cart({
                userId: req.params.userId,
                products: [{ productId: req.body.productId, quantity: req.body.quantity }]
            });
            await cart.save();
            res.status(200).json({ message: 'Product added to cart' });
        }

    } catch (error) {
        next(error);
    }
}

export const removeFromCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        console.log(cart);
        if (cart) {
            const product = cart.products.find(p => p.productId === req.params.productId);
            if (product) {
                if (product.quantity > 1) {
                    await Cart.findOneAndUpdate(
                        { userId: req.params.userId, "products.productId": req.params.productId },
                        { $inc: { "products.$.quantity": - req.body.quantity } }
                    );
                    res.status(200).json({ message: 'Product quantity updated' });
                } else {
                    await Cart.findOneAndUpdate(
                        { userId: req.params.userId },
                        { $pull: { products: { productId: req.params.productId } } }
                    );
                    res.status(200).json({ message: 'Product removed from cart' });
                }
            } else {
                res.status(200).json({ message: 'Product not found in cart' });
            }
        } else {
            res.status(200).json({ message: 'Cart is empty' });
        }
    } catch (error) {
        next(error);
    }
}

export const saveCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        if (cart) {
            const products = cart.products.map(p => {
                return { productId: p.productId, quantity: p.quantity }
            });
            res.status(200).json({ products });
        } else {
            res.status(200).json({ message: 'Cart is empty' });
        }
    } catch (error) {
        next(error);
    }
}

