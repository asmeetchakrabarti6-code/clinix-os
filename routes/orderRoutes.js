const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");

// /api/orders
router.route("/").get(getOrders).post(createOrder);

// /api/orders/:id
router.route("/:id").get(getOrderById);

// /api/orders/:id/status
router.route("/:id/status").put(updateOrderStatus);

module.exports = router;
