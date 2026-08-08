const express = require("express");

const commerceRoutes =
    require("./commerceRoutes");

const router = express.Router();

router.use("/", commerceRoutes);

module.exports = router;
