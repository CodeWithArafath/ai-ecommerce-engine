const express =
  require("express");

const {
  semanticSearch,
  hybridSearch,
  aiRecommend,
} = require("../controllers/aiController");

const router =
  express.Router();

router.get(
  "/semantic-search",
  semanticSearch
);

router.get(
  "/hybrid-search",
  hybridSearch
);

router.get(
  "/recommend",
  aiRecommend
);

module.exports = router;
