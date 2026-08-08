const express = require("express");

const {
  personalized,
  trending,
  similar,
} = require("../controllers/recommendationController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router =
  express.Router();

router.get(
  "/trending",
  trending
);

router.get(
  "/similar/:productId",
  similar
);

router.get(
  "/personalized",
  protect,
  personalized
);

module.exports = router;
