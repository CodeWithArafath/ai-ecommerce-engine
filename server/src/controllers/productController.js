const Product = require("../models/Product");
const { success, error } = require("../utils/apiResponse");

exports.getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      page = 1,
      limit = 20,
      sort = "createdAt",
      order = "desc"
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    if (brand) {
      query.brand = { $regex: brand, $options: "i" };
    }

    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Math.max(Number(limit), 1), 100);
    const skip = (pageNumber - 1) * limitNumber;

    const sortOrder = order === "asc" ? 1 : -1;

    const allowedSortFields = [
      "createdAt",
      "name",
      "price",
      "stock",
      "brand",
      "category"
    ];

    const sortField = allowedSortFields.includes(sort)
      ? sort
      : "createdAt";

    const products = await Product.find(query)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limitNumber);

    const total = await Product.countDocuments(query);

    return success(
      res,
      {
        products,
        pagination: {
          total,
          page: pageNumber,
          limit: limitNumber,
          pages: Math.ceil(total / limitNumber)
        }
      },
      "Products fetched successfully"
    );
  } catch (err) {
    return error(res, err.message);
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

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

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

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

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return error(res, "Product not found", 404);
    }

    return success(
      res,
      product,
      "Product updated successfully"
    );
  } catch (err) {
    return error(res, err.message);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return error(res, "Product not found", 404);
    }

    return success(
      res,
      null,
      "Product deleted successfully"
    );
  } catch (err) {
    return error(res, err.message);
  }
};
