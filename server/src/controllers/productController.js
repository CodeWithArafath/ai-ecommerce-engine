const QueryFeatures = require("../utils/queryFeatures");
const { success, error } = require("../utils/apiResponse");

// Temporary product storage (will be replaced by MongoDB later)
const products = require("../data/products");

const getProducts = (req, res) => {
  try {
    let result = new QueryFeatures(products, req.query)
      .search()
      .filter()
      .sort();

    const total = result.data.length;

    result.paginate();

    return success(
      res,
      {
        products: result.data,
        total,
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 20,
      },
      "Products fetched successfully"
    );

  } catch (err) {
    return error(res, err.message);
  }
};


const createProduct = (req, res) => {
  try {
    const product = {
      id: Date.now(),
      ...req.body,
    };

    products.push(product);

    return success(
      res,
      product,
      "Product created successfully",
      201
    );

  } catch (err) {
    return error(res, err.message);
  }
};


const getProductById = (req, res) => {
  try {
    const product = products.find(
      (p) => p.id == req.params.id
    );

    if (!product) {
      return error(res, "Product not found", 404);
    }

    return success(
      res,
      product,
      "Product fetched successfully"
    );

  } catch (err) {
    return error(res, err.message);
  }
};


const updateProduct = (req, res) => {
  try {
    const index = products.findIndex(
      (p) => p.id == req.params.id
    );

    if (index === -1) {
      return error(res, "Product not found", 404);
    }

    products[index] = {
      ...products[index],
      ...req.body,
    };

    return success(
      res,
      products[index],
      "Product updated successfully"
    );

  } catch (err) {
    return error(res, err.message);
  }
};


const deleteProduct = (req, res) => {
  try {
    products = products.filter(
      (p) => p.id != req.params.id
    );

    return success(
      res,
      null,
      "Product deleted successfully"
    );

  } catch (err) {
    return error(res, err.message);
  }
};


module.exports = {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};