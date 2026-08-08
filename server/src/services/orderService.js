const mongoose = require("mongoose");

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const createOrder = async (
  userId,
  shippingAddress,
  paymentMethod = "cod"
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const cart = await Cart.findOne({
      user: userId,
    }).session(session);

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const cartItem of cart.items) {
      const product = await Product.findById(
        cartItem.product
      ).session(session);

      if (!product) {
        throw new Error(
          `Product ${cartItem.product} not found`
        );
      }

      if (product.stock < cartItem.quantity) {
        throw new Error(
          `Insufficient stock for ${product.name}`
        );
      }

      const subtotal =
        product.price * cartItem.quantity;

      totalAmount += subtotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: cartItem.quantity,
        subtotal,
      });

      product.stock -= cartItem.quantity;

      await product.save({ session });
    }

    const [order] = await Order.create(
      [
        {
          user: userId,
          items: orderItems,
          totalAmount,
          paymentMethod,
          shippingAddress,
        },
      ],
      { session }
    );

    cart.items = [];

    await cart.save({ session });

    await session.commitTransaction();

    return Order.findById(order._id)
      .populate("items.product")
      .populate("user", "name email");
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const getMyOrders = async (userId) => {
  return Order.find({
    user: userId,
  })
    .populate("items.product")
    .sort({ createdAt: -1 });
};

const getOrderById = async (orderId, userId) => {
  return Order.findOne({
    _id: orderId,
    user: userId,
  })
    .populate("items.product")
    .populate("user", "name email");
};

const cancelOrder = async (orderId, userId) => {
  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (
    ["shipped", "delivered", "cancelled"].includes(
      order.status
    )
  ) {
    throw new Error(
      "This order cannot be cancelled"
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            stock: item.quantity,
          },
        },
        { session }
      );
    }

    order.status = "cancelled";

    if (order.paymentStatus === "paid") {
      order.paymentStatus = "refunded";
    }

    await order.save({ session });

    await session.commitTransaction();

    return order;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const getAllOrders = async () => {
  return Order.find()
    .populate("user", "name email")
    .populate("items.product")
    .sort({ createdAt: -1 });
};

const updateOrderStatus = async (
  orderId,
  status
) => {
  const allowedStatuses = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid order status");
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("user", "name email")
    .populate("items.product");

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
};
