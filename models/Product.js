const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hsnCode: { type: String, required: true },
  unit: { type: String, required: true },
  rate: { type: Number, required: true },
  stock: { type: Number, required: true },
  batch: { type: String },
  mfgDate: { type: Date },
  expDate: { type: Date },
  cgstPercentage: { type: Number, default: 9 },
  sgstPercentage: { type: Number, default: 9 },
});

module.exports = mongoose.model('Product', productSchema);