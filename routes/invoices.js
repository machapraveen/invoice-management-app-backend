// backend/routes/invoices.js
const express = require('express');
const Invoice = require('../models/Invoice');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const invoice = new Invoice({
      items: req.body.items.map(item => ({
        product: item.product,
        name: item.name,
        hsnCode: item.hsnCode,
        unit: item.unit,
        quantity: item.quantity,
        rate: item.rate,
        batch: item.batch,
        mfgDate: item.mfgDate,
        expDate: item.expDate,
        cgstPercentage: item.cgstPercentage,
        sgstPercentage: item.sgstPercentage,
        cgstAmount: item.cgstAmount,
        sgstAmount: item.sgstAmount,
        total: item.total
      })),
      subtotal: req.body.items.reduce((sum, item) => sum + item.total, 0),
      cgst: req.body.items.reduce((sum, item) => sum + item.cgstAmount, 0),
      sgst: req.body.items.reduce((sum, item) => sum + item.sgstAmount, 0),
      total: req.body.items.reduce((sum, item) => sum + item.total + item.cgstAmount + item.sgstAmount, 0),
      date: new Date()
    });
    await invoice.save();
    res.status(201).send(invoice);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ date: -1 });
    res.send(invoices);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('items.product');
    if (!invoice) {
      return res.status(404).send();
    }
    res.send(invoice);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
