const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");

const productRoutes = require("./routes/productRoutes");
const aiRoutes = require("./routes/aiRoutes");
const shopRoutes = require("./routes/shopRoutes");

const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const searchRoutes = require("./routes/searchRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const personalizedRecommendationRoutes =
  require("./routes/personalizedRecommendationRoutes");

const activityRoutes =
  require("./routes/activityRoutes");

const analyticsRoutes =
  require("./routes/analyticsRoutes");

const commerceRoutes =
  require("./routes/commerceRoutes");

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(helmet());
app.use(morgan("dev"));
app.use(compression());

app.use(express.json({ limit: "2mb" }));
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.json({
    success: true,
    name: "AI E-Commerce Engine",
    version: "1.0.0",
    status: "running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    service: "AI E-Commerce Engine",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/products", productRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/shop", shopRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use(
  "/api/personalized-recommendations",
  personalizedRecommendationRoutes
);

app.use("/api/activity", activityRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/commerce", commerceRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);

  res.status(err.status || 500).json({
    success: false,
    message:
      err.message ||
      "Internal server error",
  });
});

module.exports = app;
