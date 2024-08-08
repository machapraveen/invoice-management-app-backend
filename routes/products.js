const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const existingProduct = await Product.findOne({ name: req.body.name });
    if (existingProduct) {
      return res.status(400).send({ error: 'A product with this name already exists.' });
    }
    const product = new Product(req.body);
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch('/:id', auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    console.log('Received updates:', updates); // Debugging line
    const allowedUpdates = ['name', 'hsnCode', 'unit', 'rate', 'stock', 'batch', 'mfgDate', 'expDate', 'cgstPercentage', 'sgstPercentage'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ error: 'Product not found' });
    }

    // Check for duplicate product name
    if (req.body.name && req.body.name !== product.name) {
      const existingProduct = await Product.findOne({ name: req.body.name });
      if (existingProduct) {
        return res.status(400).send({ error: 'A product with this name already exists.' });
      }
    }

    updates.forEach((update) => product[update] = req.body[update]);

    await product.save();

    res.send(product);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).send({ error: 'Validation failed', details: validationErrors });
    }
    console.error('Error updating product:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

module.exports = router;