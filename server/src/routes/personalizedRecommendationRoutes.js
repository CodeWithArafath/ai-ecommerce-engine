const express =
    require("express");

const {
    protect
} =
require("../middleware/authMiddleware");

const {
    personalizedRecommendations
} =
require("../controllers/personalizedRecommendationController");


const router =
    express.Router();


router.get(
    "/",
    protect,
    personalizedRecommendations
);


module.exports =
    router;
