const express = require("express");
const router = express.Router();

const { hybridSearch } =
    require("../ai/services/hybridSearchService");

const { rankProducts } =
    require("../ai/services/recommendationRankingService");

const Product =
    require("../models/Product");


// ==========================================
// AI SEMANTIC / HYBRID SEARCH
// ==========================================

router.get("/search", async (req, res) => {
    try {
        const q = String(req.query.q || "").trim();

        const limit = Math.min(
            Math.max(Number(req.query.limit) || 10, 1),
            50
        );

        if (!q) {
            return res.status(400).json({
                success: false,
                message: "Search query is required"
            });
        }

        const results = await hybridSearch(q, {
            limit
        });

        return res.json({
            success: true,
            query: q,
            count: results.length,
            results
        });

    } catch (error) {
        console.error("AI search error:", error);

        return res.status(500).json({
            success: false,
            message: "AI search failed",
            error: error.message
        });
    }
});


// ==========================================
// AI RECOMMENDATIONS
// ==========================================

router.get("/recommendations", async (req, res) => {
    try {
        const limit = Math.min(
            Math.max(Number(req.query.limit) || 10, 1),
            50
        );

        const query =
            String(req.query.q || "").trim();

        const products =
            await Product.find({})
                .select(
                    "name description category brand price stock images"
                )
                .limit(200)
                .lean();

        const ranked =
            rankProducts(products, {
                query
            });

        return res.json({
            success: true,
            query,
            count: Math.min(ranked.length, limit),
            recommendations:
                ranked.slice(0, limit)
        });

    } catch (error) {
        console.error(
            "Recommendation error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Recommendation failed",
            error: error.message
        });
    }
});


// ==========================================
// SIMILAR PRODUCTS
// ==========================================

router.get(
    "/recommendations/:productId",
    async (req, res) => {

        try {
            const product =
                await Product.findById(
                    req.params.productId
                ).lean();

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            const products =
                await Product.find({
                    category:
                        product.category,
                    _id: {
                        $ne:
                            product._id
                    }
                })
                .select(
                    "name description category brand price stock images"
                )
                .limit(100)
                .lean();

            const ranked =
                rankProducts(products, {
                    query:
                        `${product.name} ${product.category} ${product.brand}`
                });

            return res.json({
                success: true,
                productId:
                    req.params.productId,
                recommendations:
                    ranked.slice(0, 10)
            });

        } catch (error) {

            console.error(
                "Similar products error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Unable to generate recommendations",
                error: error.message
            });
        }
    }
);


module.exports = router;
