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
    const { page, limit, sortBy = '_id', sortOrder = 'asc', search = '' } = req.query;

    const intPage = parseInt(page);
    const intLimit = parseInt(limit);

    const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const regex = new RegExp(search, 'i');

    const matchStage = {
        deleted: false,
        $or: [
            { name: search ? regex : /.*/ },
            { description: search ? regex : /.*/ },
        ]
    }

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
            { $unwind: '$category' },
            { $match: matchStage },
            { $sort: sortOptions },
            { $skip: (intPage - 1) * intLimit },
            { $limit: intLimit },
        ]);

        const count = await Product.countDocuments({ deleted: false });

        if (intLimit < 1 || intPage < 1 || (intPage - 1) * intLimit >= count) {
            return res.status(400).json({
                message: 'Número de página o límite inválido',
                error: 'No hay Productos',
                success: false,
            });
        }
        const actualPage = intPage > Math.ceil(count / intLimit) ? Math.ceil(count / intLimit) : intPage;
        const nextPage = intPage + 1 <= Math.ceil(count / intLimit) ? intPage + 1 : null;
        const prevPage = intPage - 1 > 0 ? intPage - 1 : null;
        const totalPages = Math.ceil(count / intLimit);
        const totalItemsInCurrentPage = products.length;

        res.status(200).json({
            data: products,
            actualPage,
            totalItemsInCurrentPage,
            nextPage,
            prevPage,
            totalPages,
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