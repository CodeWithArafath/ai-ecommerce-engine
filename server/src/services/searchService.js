const Product = require("../models/Product");

const searchProducts = async (query) => {
  const {
    q,
    category,
    brand,
    minPrice,
    maxPrice,
    minStock,
    maxStock,
    inStock,
    sort = "newest",
    page = 1,
    limit = 20,
  } = query;

  const filter = {};

  // Keyword search
  if (q && q.trim()) {
    const searchTerm = q.trim();

    filter.$or = [
      { name: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } },
      { brand: { $regex: searchTerm, $options: "i" } },
      { category: { $regex: searchTerm, $options: "i" } },
    ];
  }

  // Category
  if (category && category.trim()) {
    filter.category = {
      $regex: `^${category.trim()}$`,
      $options: "i",
    };
  }

  // Brand
  if (brand && brand.trim()) {
    filter.brand = {
      $regex: `^${brand.trim()}$`,
      $options: "i",
    };
  }

  // Price filtering
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};

    if (minPrice !== undefined && minPrice !== "") {
      filter.price.$gte = Number(minPrice);
    }

    if (maxPrice !== undefined && maxPrice !== "") {
      filter.price.$lte = Number(maxPrice);
    }
  }

  // Stock filtering
  if (minStock !== undefined || maxStock !== undefined) {
    filter.stock = {};

    if (minStock !== undefined && minStock !== "") {
      filter.stock.$gte = Number(minStock);
    }

    if (maxStock !== undefined && maxStock !== "") {
      filter.stock.$lte = Number(maxStock);
    }
  }

  if (inStock === "true") {
    filter.stock = {
      ...(filter.stock || {}),
      $gt: 0,
    };
  }

  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.min(
    Math.max(Number(limit) || 20, 1),
    100
  );

  const skip = (pageNumber - 1) * limitNumber;

  let sortOption = { createdAt: -1 };

  switch (sort) {
    case "price_asc":
      sortOption = { price: 1 };
      break;

    case "price_desc":
      sortOption = { price: -1 };
      break;

    case "name_asc":
      sortOption = { name: 1 };
      break;

    case "name_desc":
      sortOption = { name: -1 };
      break;

    case "stock_asc":
      sortOption = { stock: 1 };
      break;

    case "stock_desc":
      sortOption = { stock: -1 };
      break;

    case "oldest":
      sortOption = { createdAt: 1 };
      break;

    case "newest":
    default:
      sortOption = { createdAt: -1 };
  }

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber)
      .lean(),

    Product.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(
    total / limitNumber
  );

  return {
    products,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages,
      hasNextPage:
        pageNumber < totalPages,
      hasPreviousPage:
        pageNumber > 1,
    },

    filters: {
      q: q || null,
      category: category || null,
      brand: brand || null,
      minPrice: minPrice || null,
      maxPrice: maxPrice || null,
      minStock: minStock || null,
      maxStock: maxStock || null,
      inStock: inStock === "true",
      sort,
    },
  };
};

const getCategories = async () => {
  return Product.distinct("category");
};

const getBrands = async () => {
  return Product.distinct("brand");
};

const getPriceRange = async () => {
  const result = await Product.aggregate([
    {
      $group: {
        _id: null,
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
  ]);

  return result[0] || {
    minPrice: 0,
    maxPrice: 0,
  };
};

module.exports = {
  searchProducts,
  getCategories,
  getBrands,
  getPriceRange,
};
