const express = require('express');
const router = express.Router();
const productService = require('../services/productService');

// GET /api/products - Hämta alla [cite: 200, 201]
router.get('/', async (req, res) => {
  const products = await productService.getAllProducts();
  res.json(products);
});

// GET /api/products/:id - Hämta en [cite: 201]
router.get('/:id', async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  if (!product) return res.status(404).json({ message: "Hittades inte" });
  res.json(product);
});

// POST /api/products - Skapa ny (Admin) [cite: 91, 203]
router.post('/', async (req, res) => {
  const newProduct = await productService.createProduct(req.body);
  res.status(201).json(newProduct);
});

// DELETE /api/products/:id - Ta bort (Admin) [cite: 260]
router.delete('/:id', async (req, res) => {
  const success = await productService.deleteProduct(req.params.id);
  if (success) res.sendStatus(204);
  else res.status(404).json({ message: "Kunde inte radera" });
});

module.exports = router;