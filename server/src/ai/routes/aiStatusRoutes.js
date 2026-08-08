const express =
  require("express");

const {
  status,
} = require("../controllers/aiStatusController");

const router =
  express.Router();

router.get(
  "/status",
  status
);

module.exports = router;
