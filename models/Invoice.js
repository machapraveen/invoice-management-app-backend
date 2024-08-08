// backend/models/Invoice.js
const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    hsnCode: String,
    unit: String,
    quantity: Number,
    rate: Number,
    batch: String,
    mfgDate: Date,
    expDate: Date,
    cgstPercentage: Number,
    sgstPercentage: Number,
    cgstAmount: Number,
    sgstAmount: Number,
    total: Number
  }],
  subtotal: Number,
  cgst: Number,
  sgst: Number,
  total: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Invoice', invoiceSchema);