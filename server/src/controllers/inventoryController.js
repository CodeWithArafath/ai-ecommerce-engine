const inventoryService = require("../services/inventoryService");

exports.updateStock = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "quantity is required",
      });
    }

    const product =
      await inventoryService.updateStock(
        req.params.id,
        quantity
      );

    return res.json({
      success: true,
      message: "Stock updated successfully",
      data: product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.setStock = async (req, res) => {
  try {
    const { stock } = req.body;

    if (stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "stock is required",
      });
    }

    const product =
      await inventoryService.setStock(
        req.params.id,
        stock
      );

    return res.json({
      success: true,
      message: "Stock set successfully",
      data: product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getLowStock = async (req, res) => {
  try {
    const products =
      await inventoryService.getLowStockProducts(
        req.query.threshold
      );

    return res.json({
      success: true,
      message: "Low stock products fetched successfully",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getOutOfStock = async (req, res) => {
  try {
    const products =
      await inventoryService.getOutOfStockProducts();

    return res.json({
      success: true,
      message: "Out of stock products fetched successfully",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const summary =
      await inventoryService.getInventorySummary();

    return res.json({
      success: true,
      message: "Inventory summary fetched successfully",
      data: summary,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
