import express from 'express';

import { createProduct, getProducts, getProduct } from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts)
router.get('/:id', getProduct)
router.post('/', createProduct)
router.put('/:id', (req, res) => { })
router.delete('/:id', (req, res) => { })

export default router;