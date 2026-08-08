const buildProductText = (product) => {
  if (!product) {
    return "";
  }

  return [
    `Product: ${product.name || ""}`,

    `Category: ${
      product.category || ""
    }`,

    `Brand: ${
      product.brand || ""
    }`,

    `Description: ${
      product.description || ""
    }`,

    `Price: ${
      product.price ?? ""
    }`,

    `Stock: ${
      product.stock ?? ""
    }`,
  ].join(". ");
};

module.exports = {
  buildProductText,
};
