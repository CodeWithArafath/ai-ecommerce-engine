const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", createOrder);

router.get("/my-orders", getMyOrders);

router.get("/:id", getOrder);

router.patch(
  "/:id/cancel",
  cancelOrder
);

router.get(
  "/admin/all",
  adminOnly,
  getAllOrders
);

router.patch(
  "/admin/:id/status",
  adminOnly,
  updateOrderStatus
);

module.exports = router;
