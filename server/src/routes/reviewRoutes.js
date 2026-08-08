const express = require("express");

const {
  createReview,
  getReviews,
} = require("../controllers/reviewController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router =
  express.Router();

router.get(
  "/:productId",
  getReviews
);

router.post(
  "/:productId",
  protect,
  createReview
);

module.exports = router;
