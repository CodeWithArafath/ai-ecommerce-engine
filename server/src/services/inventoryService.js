const Product = require("../models/Product");

const updateStock = async (productId, quantity) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  quantity = Number(quantity);

  if (!Number.isInteger(quantity)) {
    throw new Error("Quantity must be an integer");
  }

  const newStock = product.stock + quantity;

  if (newStock < 0) {
    throw new Error("Stock cannot be negative");
  }

  product.stock = newStock;

  await product.save();

  return product;
};

const setStock = async (productId, stock) => {
  stock = Number(stock);

  if (!Number.isInteger(stock) || stock < 0) {
    throw new Error("Stock must be a non-negative integer");
  }

  const product = await Product.findByIdAndUpdate(
    productId,
    { stock },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

const getLowStockProducts = async (threshold = 10) => {
  threshold = Number(threshold);

  if (!Number.isFinite(threshold) || threshold < 0) {
    threshold = 10;
  }

  return Product.find({
    stock: {
      $gt: 0,
      $lte: threshold,
    },
  }).sort({ stock: 1 });
};

const getOutOfStockProducts = async () => {
  return Product.find({
    stock: 0,
  }).sort({ updatedAt: -1 });
};

const getInventorySummary = async () => {
  const [summary] = await Product.aggregate([
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        totalStock: { $sum: "$stock" },
        totalInventoryValue: {
          $sum: {
            $multiply: ["$price", "$stock"],
          },
        },
        averageStock: { $avg: "$stock" },
      },
    },
  ]);

  const lowStockCount = await Product.countDocuments({
    stock: {
      $gt: 0,
      $lte: 10,
    },
  });

  const outOfStockCount = await Product.countDocuments({
    stock: 0,
  });

  return {
    totalProducts: summary?.totalProducts || 0,
    totalStock: summary?.totalStock || 0,
    totalInventoryValue:
      summary?.totalInventoryValue || 0,
    averageStock:
      summary?.averageStock || 0,
    lowStockProducts: lowStockCount,
    outOfStockProducts: outOfStockCount,
  };
};

module.exports = {
  updateStock,
  setStock,
  getLowStockProducts,
  getOutOfStockProducts,
  getInventorySummary,
};
