const express = require("express");

const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", getCart);

router.post("/items", addToCart);

router.put(
  "/items/:productId",
  updateCartItem
);

router.delete(
  "/items/:productId",
  removeFromCart
);

router.delete(
  "/clear",
  clearCart
);

module.exports = router;
