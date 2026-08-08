const express = require("express");

const {
  updateStock,
  setStock,
  getLowStock,
  getOutOfStock,
  getSummary,
} = require("../controllers/inventoryController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.patch(
  "/:id/stock",
  updateStock
);

router.put(
  "/:id/stock",
  setStock
);

router.get(
  "/low-stock",
  getLowStock
);

router.get(
  "/out-of-stock",
  getOutOfStock
);

router.get(
  "/summary",
  getSummary
);

module.exports = router;
