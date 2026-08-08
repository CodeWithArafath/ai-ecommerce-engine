const express = require("express");

const {
  track,
  recentlyViewed,
  activities,
} = require("../controllers/activityController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router =
  express.Router();

router.use(protect);

router.post(
  "/",
  track
);

router.get(
  "/recently-viewed",
  recentlyViewed
);

router.get(
  "/",
  activities
);

module.exports = router;
