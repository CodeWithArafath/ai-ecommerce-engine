const UserActivity =
  require("../models/UserActivity");

const Product =
  require("../models/Product");

const trackActivity = async (
  userId,
  type,
  productId = null,
  searchQuery = null,
  metadata = {}
) => {
  return UserActivity.create({
    user: userId,
    type,
    product: productId,
    searchQuery,
    metadata,
  });
};

const getRecentlyViewed = async (
  userId,
  limit = 10
) => {
  const activities =
    await UserActivity.find({
      user: userId,
      type: "view",
      product: {
        $ne: null,
      },
    })
      .sort({
        createdAt: -1,
      })
      .limit(100)
      .populate("product");

  const seen = new Set();
  const products = [];

  for (const activity of activities) {
    if (
      activity.product &&
      !seen.has(
        activity.product._id.toString()
      )
    ) {
      seen.add(
        activity.product._id.toString()
      );

      products.push(activity.product);

      if (
        products.length >= Number(limit)
      ) {
        break;
      }
    }
  }

  return products;
};

const getUserActivities = async (
  userId,
  limit = 50
) => {
  return UserActivity.find({
    user: userId,
  })
    .populate("product")
    .sort({
      createdAt: -1,
    })
    .limit(Number(limit));
};

module.exports = {
  trackActivity,
  getRecentlyViewed,
  getUserActivities,
};
