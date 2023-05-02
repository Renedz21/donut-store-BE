import express from 'express';
import { getCategories, createCategory } from '../controllers/categoryController.js'

const router = express.Router();

router.get('/', getCategories)
router.get('/:id', (req, res) => { })
router.post('/', createCategory)
router.put('/:id', (req, res) => { })
router.delete('/:id', (req, res) => { })

export default router;