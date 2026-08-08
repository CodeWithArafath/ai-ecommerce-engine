const searchService = require("../services/searchService");

exports.searchProducts = async (req, res) => {
  try {
    const result =
      await searchService.searchProducts(req.query);

    return res.json({
      success: true,
      message: "Products fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Search error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories =
      await searchService.getCategories();

    return res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getBrands = async (req, res) => {
  try {
    const brands =
      await searchService.getBrands();

    return res.json({
      success: true,
      data: brands,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPriceRange = async (req, res) => {
  try {
    const range =
      await searchService.getPriceRange();

    return res.json({
      success: true,
      data: range,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
