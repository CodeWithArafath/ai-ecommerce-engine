const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getCart = async (userId) => {
  let cart = await Cart.findOne({
    user: userId,
  }).populate("items.product");

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
    });

    cart = await Cart.findById(cart._id).populate(
      "items.product"
    );
  }

  return cart;
};

const addToCart = async (userId, productId, quantity = 1) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  quantity = Number(quantity);

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Quantity must be at least 1");
  }

  if (product.stock < quantity) {
    throw new Error("Insufficient product stock");
  }

  let cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [
        {
          product: productId,
          quantity,
        },
      ],
    });
  } else {
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId.toString()
    );

    if (existingItem) {
      const newQuantity =
        existingItem.quantity + quantity;

      if (newQuantity > product.stock) {
        throw new Error("Insufficient product stock");
      }

      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
      });
    }

    await cart.save();
  }

  return Cart.findById(cart._id).populate(
    "items.product"
  );
};

const updateCartItem = async (
  userId,
  productId,
  quantity
) => {
  quantity = Number(quantity);

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Quantity must be at least 1");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  if (quantity > product.stock) {
    throw new Error("Insufficient product stock");
  }

  const cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  const item = cart.items.find(
    (item) => item.product.toString() === productId.toString()
  );

  if (!item) {
    throw new Error("Product is not in cart");
  }

  item.quantity = quantity;

  await cart.save();

  return Cart.findById(cart._id).populate(
    "items.product"
  );
};

const removeFromCart = async (
  userId,
  productId
) => {
  const cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  const originalLength = cart.items.length;

  cart.items = cart.items.filter(
    (item) =>
      item.product.toString() !== productId.toString()
  );

  if (cart.items.length === originalLength) {
    throw new Error("Product is not in cart");
  }

  await cart.save();

  return Cart.findById(cart._id).populate(
    "items.product"
  );
};

const clearCart = async (userId) => {
  const cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    return null;
  }

  cart.items = [];

  await cart.save();

  return cart;
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
