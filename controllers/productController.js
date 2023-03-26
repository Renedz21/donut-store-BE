import Product from '../models/productSchema.js'

export const createProduct = async (req, res, next) => {

    const newProduct = new Product(req.body);

    try {
        const savedProduct = await newProduct.save();

        res.status(201).json({ savedProduct });
    } catch (error) {
        next(error);
    }

}

export const getProducts = async (req, res, next) => {
    try {

        const products = await Product.find({ deleted: false }).populate([
            { path: 'category', select: 'name' },
        ]);
        res.status(200).json(products);

    } catch (error) {
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

        res.status(200).json({ deletedProduct });

    } catch (error) {
        next(error);
    }

}