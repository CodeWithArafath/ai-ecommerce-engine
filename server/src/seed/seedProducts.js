require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("../models/Product");

const categories = [
  "Electronics",
  "Fashion",
  "Home",
  "Books",
  "Shoes",
  "Mobiles",
  "Beauty",
  "Laptops",
];

const brands = [
  "Apple",
  "Samsung",
  "Sony",
  "Nike",
  "Adidas",
  "Dell",
  "HP",
  "Puma",
];

const generateProducts = (count) => {
  const products = [];

  for (let i = 1; i <= count; i++) {
    const category =
      categories[Math.floor(Math.random() * categories.length)];

    const brand =
      brands[Math.floor(Math.random() * brands.length)];

    products.push({
      name: `${brand} ${category} Product ${i}`,

      description: `High quality ${category.toLowerCase()} product from ${brand}`,

      category,

      brand,

      price: Number(
        (Math.random() * 100000 + 500).toFixed(2)
      ),

      stock: Math.floor(Math.random() * 500) + 1,

      images: [
        `https://picsum.photos/seed/product${i}/500/500`,
      ],

      embedding: [],
    });
  }

  return products;
};

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Connected");

    await Product.deleteMany({});

    console.log("🗑️ Existing products removed");

    const products = generateProducts(10000);

    console.log("🌱 Generated 10,000 products");

    await Product.insertMany(products, {
      ordered: false,
    });

    console.log("✅ 10,000 products inserted successfully");

    await mongoose.disconnect();

    console.log("🔌 MongoDB disconnected");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);

    await mongoose.disconnect().catch(() => {});

    process.exit(1);
  }
};

seedProducts();