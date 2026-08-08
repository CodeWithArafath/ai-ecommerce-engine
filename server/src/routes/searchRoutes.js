const express = require("express");

const {
  searchProducts,
  getCategories,
  getBrands,
  getPriceRange,
} = require("../controllers/searchController");

const router = express.Router();

router.get("/", searchProducts);

router.get(
  "/categories",
  getCategories
);

router.get(
  "/brands",
  getBrands
);

router.get(
  "/price-range",
  getPriceRange
);

module.exports = router;
