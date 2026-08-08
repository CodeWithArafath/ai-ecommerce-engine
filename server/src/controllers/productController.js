const productService = require("../services/productService");
const { success, error } = require("../utils/apiResponse");

exports.getProducts = (req, res) => {
  const {
    page = 1,
    limit = 20,
    search = "",
    category = "",
    minPrice,
    maxPrice,
    sort = "createdAt",
    order = "desc",
  } = req.query;

  const result = productService.getProducts({
    page: Math.max(Number(page), 1),
    limit: Math.min(Math.max(Number(limit), 1), 100),
    search,
    category,
    minPrice,
    maxPrice,
    sort,
    order: order === "asc" ? "asc" : "desc",
  });

  return success(res, result, "Products fetched successfully");
};

exports.getProduct = (req, res) => {
  const product = productService.getProductById(req.params.id);

  if (!product) {
    return error(res, "Product not found", 404);
  }

  return success(res, product, "Product fetched successfully");
};

exports.createProduct = (req, res) => {
  const product = productService.createProduct(req.body);

  return success(res, product, "Product created successfully", 201);
};

exports.updateProduct = (req, res) => {
  const product = productService.updateProduct(req.params.id, req.body);

  if (!product) {
    return error(res, "Product not found", 404);
  }

  return success(res, product, "Product updated successfully");
};

exports.deleteProduct = (req, res) => {
  const deleted = productService.deleteProduct(req.params.id);

  if (!deleted) {
    return error(res, "Product not found", 404);
  }

  return success(res, null, "Product deleted successfully");
};