const express = require("express");

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router =
  express.Router();

router.use(protect);

router.get(
  "/",
  getWishlist
);

router.post(
  "/items",
  addToWishlist
);

router.delete(
  "/items/:productId",
  removeFromWishlist
);

module.exports = router;
