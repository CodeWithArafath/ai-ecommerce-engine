const Product = require("../../models/Product");

const {
    generateEmbedding
} = require("./embeddingService");

const {
    cosineSimilarity
} = require("../utils/cosineSimilarity");

async function semanticSearch(
    query,
    {
        limit = 10,
        minScore = 0
    } = {}
) {

    if (!query || !query.trim()) {
        throw new Error(
            "Search query is required"
        );
    }

    const safeLimit = Math.min(
        Math.max(
            Number(limit) || 10,
            1
        ),
        100
    );

    const safeMinScore = Math.max(
        Number(minScore) || 0,
        -1
    );

    const queryEmbedding =
        await generateEmbedding(
            query.trim()
        );

    const products =
        await Product.find({
            embedding: {
                $exists: true,
                $ne: []
            }
        })
        .select(
            "name description category brand price stock images embedding"
        )
        .lean();

    if (!products.length) {
        return [];
    }

    const results = [];

    for (const product of products) {

        const score =
            cosineSimilarity(
                queryEmbedding,
                product.embedding
            );

        if (score >= safeMinScore) {

            results.push({
                product: {
                    ...product,
                    embedding: undefined
                },
                score: Number(
                    score.toFixed(6)
                )
            });
        }
    }

    results.sort(
        (a, b) =>
            b.score - a.score
    );

    return results
        .slice(0, safeLimit)
        .map(
            (item, index) => ({
                rank: index + 1,
                score: item.score,
                product: item.product
            })
        );
}

module.exports = {
    semanticSearch
};

