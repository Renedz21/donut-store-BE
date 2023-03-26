import Category from '../models/categorySchema.js'

export const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find()
        res.status(200).json(categories)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}