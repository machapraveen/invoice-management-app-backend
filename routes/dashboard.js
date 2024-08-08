// backend/routes/dashboard.js
const express = require('express');
const Invoice = require('../models/Invoice');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/sales', auth, async (req, res) => {
  try {
    const salesData = await Invoice.aggregate([
      {
        $group: {
          _id: { $month: "$date" },
          sales: { $sum: "$total" }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.send(salesData);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/top-products', auth, async (req, res) => {
  try {
    const topProducts = await Invoice.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          unitsSold: { $sum: "$items.quantity" }
        }
      },
      { $sort: { unitsSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $project: {
          name: "$product.name",
          unitsSold: 1
        }
      }
    ]);
    res.send(topProducts);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;