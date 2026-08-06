const { faker } = require("@faker-js/faker");

const products = [];

const categories = [
  "Mobiles",
  "Laptops",
  "Fashion",
  "Shoes",
  "Electronics",
  "Books",
  "Home",
  "Beauty",
];

const brands = [
  "Apple",
  "Samsung",
  "Nike",
  "Adidas",
  "Sony",
  "HP",
  "Dell",
  "Puma",
];

for (let i = 0; i < 10000; i++) {
  products.push({
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    category: faker.helpers.arrayElement(categories),
    brand: faker.helpers.arrayElement(brands),
    price: Number(faker.commerce.price({ min: 100, max: 100000 })),
    stock: faker.number.int({ min: 0, max: 500 }),
    images: [faker.image.url()],
    embedding: [],
  });
}

console.log(`Generated ${products.length} products`);

console.log(products.slice(0, 5));