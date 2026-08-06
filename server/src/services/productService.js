const products = [];

const getAllProducts = () => products;

const getProductById = (id) => {
  return products.find((product) => product.id === id);
};

const createProduct = (product) => {
  const newProduct = {
    id: Date.now().toString(),
    ...product,
  };

  products.push(newProduct);
  return newProduct;
};

const updateProduct = (id, data) => {
  const index = products.findIndex((product) => product.id === id);

  if (index === -1) return null;

  products[index] = {
    ...products[index],
    ...data,
  };

  return products[index];
};

const deleteProduct = (id) => {
  const index = products.findIndex((product) => product.id === id);

  if (index === -1) return false;

  products.splice(index, 1);

  return true;
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};