const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// GET /api/products
router.get("/", async (req, res) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);

        const filter = {};

        if (req.query.category) {
            filter.category = new RegExp(
                String(req.query.category).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                "i"
            );
        }

        if (req.query.brand) {
            filter.brand = new RegExp(
                String(req.query.brand).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                "i"
            );
        }

        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {};

            if (req.query.minPrice) {
                filter.price.$gte = Number(req.query.minPrice);
            }

            if (req.query.maxPrice) {
                filter.price.$lte = Number(req.query.maxPrice);
            }
        }

        if (req.query.q) {
            const q = String(req.query.q).trim().replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

            filter.$or = [
                { name: new RegExp(q, "i") },
                { description: new RegExp(q, "i") },
                { category: new RegExp(q, "i") },
                { brand: new RegExp(q, "i") }
            ];
        }

        const total = await Product.countDocuments(filter);

        const products = await Product.find(filter)
            .select("-embedding")
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        res.json({
            success: true,
            count: products.length,
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
            products
        });

    } catch (error) {
        console.error("Product API error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch products",
            error: error.message
        });
    }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .select("-embedding")
            .lean();

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.json({
            success: true,
            product
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid product ID",
            error: error.message
        });
    }
});

module.exports = router;
