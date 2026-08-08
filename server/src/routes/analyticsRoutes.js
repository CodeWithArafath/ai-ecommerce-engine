const express = require("express");

const {
  dashboard,
  salesByStatus,
  topProducts,
} = require("../controllers/analyticsController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router =
  express.Router();

router.use(protect);
router.use(adminOnly);

router.get(
  "/dashboard",
  dashboard
);

router.get(
  "/sales",
  salesByStatus
);

router.get(
  "/top-products",
  topProducts
);

module.exports = router;
