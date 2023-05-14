import Product from '../models/productSchema.js'
import { uploadImage } from '../utils/uploadImage.js';

export const createProduct = async (req, res, next) => {
    try {

        const { image, ...data } = req.body;
        let product;
        if (image) {
            const photoUrl = await uploadImage(image, 'products');

            product = new Product({ ...data, image: photoUrl });
        } else {
            product = new Product({ ...data });
        }

        const savedProduct = await product.save();

        res.status(201).json({ savedProduct });
    } catch (error) {
        next(error);
    }

}

export const getProducts = async (req, res, next) => {
    try {
        const products = await Product.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: '$category' }
        ]);
        res.status(200).json({
            data: products
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
}

export const getProduct = async (req, res, next) => {

    const { id } = req.params;

    try {

        const product = await Product.findById(id).populate([
            { path: 'category', select: 'name' },
        ]);

        res.status(200).json(product);

    } catch (error) {
        next(error);
    }
}

export const updateProduct = async (req, res, next) => {

    const { id } = req.params;

    try {

        const updatedProduct = await Product.findByIdAndUpdate(id, req.body)

        res.status(200).json({ updatedProduct });

    } catch (error) {
        next(error);
    }
}

export const deleteProduct = async (req, res, next) => {

    const { id } = req.params;

    try {
        const deletedProduct = await Product.findByIdAndUpdate(id, { deleted: true })
        res.status(200).json({
            success: true,
            message: 'Producto eliminado exitosamente',
        });
    } catch (error) {
        next(error);
    }

}