const Review = require("../models/Review");
const Product = require("../models/Product");
const UserActivity = require("../models/UserActivity");

const createReview = async (
  userId,
  productId,
  rating,
  title,
  comment
) => {
  const product = await Product.findById(
    productId
  );

  if (!product) {
    throw new Error("Product not found");
  }

  const existing = await Review.findOne({
    user: userId,
    product: productId,
  });

  if (existing) {
    throw new Error(
      "You have already reviewed this product"
    );
  }

  const review = await Review.create({
    user: userId,
    product: productId,
    rating,
    title,
    comment,
  });

  await UserActivity.create({
    user: userId,
    type: "review",
    product: productId,
  });

  return Review.findById(
    review._id
  ).populate(
    "user",
    "name"
  );
};

const getProductReviews = async (
  productId
) => {
  return Review.find({
    product: productId,
  })
    .populate(
      "user",
      "name"
    )
    .sort({
      createdAt: -1,
    });
};

const getProductRating = async (
  productId
) => {
  const result =
    await Review.aggregate([
      {
        $match: {
          product:
            require("mongoose").Types.ObjectId.createFromHexString(
              productId
            ),
        },
      },
      {
        $group: {
          _id: "$product",
          averageRating: {
            $avg: "$rating",
          },
          totalReviews: {
            $sum: 1,
          },
        },
      },
    ]);

  return (
    result[0] || {
      averageRating: 0,
      totalReviews: 0,
    }
  );
};

module.exports = {
  createReview,
  getProductReviews,
  getProductRating,
};
