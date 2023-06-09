import express from 'express';

import { createProduct, getProducts, getProduct, deleteProduct, updateProduct } from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts)
router.get('/:id', getProduct)
router.post('/', createProduct)
router.put('/:id', (req, res) => { })
router.delete('/:id', deleteProduct)

export default router;