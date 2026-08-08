const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: [
        "view",
        "search",
        "wishlist",
        "cart",
        "purchase",
        "review",
      ],
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },

    searchQuery: {
      type: String,
      default: null,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

activitySchema.index({
  user: 1,
  createdAt: -1,
});

activitySchema.index({
  type: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "UserActivity",
  activitySchema
);
