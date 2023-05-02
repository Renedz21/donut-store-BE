import Category from '../models/categorySchema.js'

export const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find()
        res.status(200).json(categories)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const createCategory = async (req, res, next) => {
    try {
        const categories = await Category.create(req.body)

        if (!categories) {
            return res.status(400).json({ success: false })
        }
        res.status(200).json(categories)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}