const express = require('express');
const router = express.Router();
const {
  getInventory,
  getOrders,
  updateStock
} = require('../controllers/pharmacyController');

router.get('/inventory', getInventory);
router.get('/orders', getOrders);
router.put('/inventory/:id', updateStock);

module.exports = router;

