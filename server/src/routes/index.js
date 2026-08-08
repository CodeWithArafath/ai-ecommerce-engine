const express =
  require("express");

const productRoutes =
  require("./productRoutes");

const authRoutes =
  require("./authRoutes");

const cartRoutes =
  require("./cartRoutes");

const orderRoutes =
  require("./orderRoutes");

const inventoryRoutes =
  require("./inventoryRoutes");

const searchRoutes =
  require("./searchRoutes");

const wishlistRoutes =
  require("./wishlistRoutes");

const reviewRoutes =
  require("./reviewRoutes");

const activityRoutes =
  require("./activityRoutes");

const recommendationRoutes =
  require("./recommendationRoutes");

const analyticsRoutes =
  require("./analyticsRoutes");

const aiRoutes =
  require("../ai/routes/aiRoutes");

const aiStatusRoutes =
  require("../ai/routes/aiStatusRoutes");


const router =
  express.Router();


router.use(
  "/products",
  productRoutes
);

router.use(
  "/auth",
  authRoutes
);

router.use(
  "/cart",
  cartRoutes
);

router.use(
  "/orders",
  orderRoutes
);

router.use(
  "/inventory",
  inventoryRoutes
);

router.use(
  "/search",
  searchRoutes
);

router.use(
  "/wishlist",
  wishlistRoutes
);

router.use(
  "/reviews",
  reviewRoutes
);

router.use(
  "/activity",
  activityRoutes
);

router.use(
  "/recommendations",
  recommendationRoutes
);

router.use(
  "/analytics",
  analyticsRoutes
);

router.use(
  "/ai",
  aiRoutes
);

router.use(
  "/ai",
  aiStatusRoutes
);


module.exports =
  router;
