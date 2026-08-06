const { faker } = require("@faker-js/faker");

const products = [];

for (let i = 0; i < 10000; i++) {
  products.push({
    id: i + 1,
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    brand: faker.company.name(),
    category: faker.commerce.department(),
    price: Number(faker.commerce.price()),
    stock: faker.number.int({
      min: 0,
      max: 500,
    }),
    image: faker.image.url(),
  });
}

module.exports = products;