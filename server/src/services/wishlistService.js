const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");
const UserActivity = require("../models/UserActivity");

const getWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({
    user: userId,
  }).populate("products");

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: userId,
      products: [],
    });

    wishlist = await Wishlist.findById(
      wishlist._id
    ).populate("products");
  }

  return wishlist;
};

const addToWishlist = async (
  userId,
  productId
) => {
  const product = await Product.findById(
    productId
  );

  if (!product) {
    throw new Error("Product not found");
  }

  let wishlist = await Wishlist.findOne({
    user: userId,
  });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: userId,
      products: [productId],
    });
  } else {
    const exists = wishlist.products.some(
      (id) =>
        id.toString() === productId.toString()
    );

    if (!exists) {
      wishlist.products.push(productId);
      await wishlist.save();
    }
  }

  await UserActivity.create({
    user: userId,
    type: "wishlist",
    product: productId,
  });

  return Wishlist.findById(
    wishlist._id
  ).populate("products");
};

const removeFromWishlist = async (
  userId,
  productId
) => {
  const wishlist = await Wishlist.findOne({
    user: userId,
  });

  if (!wishlist) {
    throw new Error("Wishlist not found");
  }

  wishlist.products =
    wishlist.products.filter(
      (id) =>
        id.toString() !== productId.toString()
    );

  await wishlist.save();

  return Wishlist.findById(
    wishlist._id
  ).populate("products");
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
