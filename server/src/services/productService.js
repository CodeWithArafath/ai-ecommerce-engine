const products = [];

const getProducts = ({
  page = 1,
  limit = 20,
  search = "",
  category = "",
  minPrice,
  maxPrice,
  sort = "createdAt",
  order = "desc",
}) => {
  let result = [...products];

  // Search
  if (search) {
    const keyword = search.toLowerCase();

    result = result.filter(
      (product) =>
        product.name?.toLowerCase().includes(keyword) ||
        product.description?.toLowerCase().includes(keyword) ||
        product.brand?.toLowerCase().includes(keyword)
    );
  }

  // Category filter
  if (category) {
    result = result.filter(
      (product) =>
        product.category?.toLowerCase() === category.toLowerCase()
    );
  }

  // Price filters
  if (minPrice !== undefined) {
    result = result.filter(
      (product) => Number(product.price) >= Number(minPrice)
    );
  }

  if (maxPrice !== undefined) {
    result = result.filter(
      (product) => Number(product.price) <= Number(maxPrice)
    );
  }

  // Sorting
  result.sort((a, b) => {
    const valueA = a[sort];
    const valueB = b[sort];

    if (valueA === undefined || valueB === undefined) {
      return 0;
    }

    if (typeof valueA === "number" && typeof valueB === "number") {
      return order === "asc"
        ? valueA - valueB
        : valueB - valueA;
    }

    return order === "asc"
      ? String(valueA).localeCompare(String(valueB))
      : String(valueB).localeCompare(String(valueA));
  });

  // Pagination
  const total = result.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;

  const paginatedProducts = result.slice(start, start + limit);

  return {
    products: paginatedProducts,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

const getProductById = (id) => {
  return products.find((product) => product.id === id);
};

const createProduct = (product) => {
  const newProduct = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...product,
  };

  products.push(newProduct);

  return newProduct;
};

const updateProduct = (id, data) => {
  const index = products.findIndex((product) => product.id === id);

  if (index === -1) {
    return null;
  }

  products[index] = {
    ...products[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  return products[index];
};

const deleteProduct = (id) => {
  const index = products.findIndex((product) => product.id === id);

  if (index === -1) {
    return false;
  }

  products.splice(index, 1);

  return true;
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};