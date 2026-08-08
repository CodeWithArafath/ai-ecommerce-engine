const cartService = require("../services/cartService");

exports.getCart = async (req, res) => {
  try {
    const cart = await cartService.getCart(
      req.user.id
    );

    return res.json({
      success: true,
      message: "Cart fetched successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Get cart error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const {
      productId,
      quantity = 1,
    } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "productId is required",
      });
    }

    const cart = await cartService.addToCart(
      req.user.id,
      productId,
      quantity
    );

    return res.status(201).json({
      success: true,
      message: "Product added to cart",
      data: cart,
    });
  } catch (error) {
    console.error("Add cart error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const {
      quantity,
    } = req.body;

    const cart = await cartService.updateCartItem(
      req.user.id,
      req.params.productId,
      quantity
    );

    return res.json({
      success: true,
      message: "Cart updated successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Update cart error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const cart = await cartService.removeFromCart(
      req.user.id,
      req.params.productId
    );

    return res.json({
      success: true,
      message: "Product removed from cart",
      data: cart,
    });
  } catch (error) {
    console.error("Remove cart error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const cart = await cartService.clearCart(
      req.user.id
    );

    return res.json({
      success: true,
      message: "Cart cleared successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Clear cart error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
