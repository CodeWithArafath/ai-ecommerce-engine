const Product = require("../../models/Product");

const {
    semanticSearch
} = require("./semanticSearchService");

function keywordScore(product, query) {

    const q =
        String(query)
            .toLowerCase()
            .trim();

    if (!q) {
        return 0;
    }

    const name =
        String(product.name || "")
            .toLowerCase();

    const description =
        String(product.description || "")
            .toLowerCase();

    const category =
        String(product.category || "")
            .toLowerCase();

    const brand =
        String(product.brand || "")
            .toLowerCase();

    let score = 0;

    if (name === q) {
        score += 1;
    } else if (name.includes(q)) {
        score += 0.9;
    }

    if (brand === q) {
        score += 0.8;
    } else if (brand.includes(q)) {
        score += 0.6;
    }

    if (category === q) {
        score += 0.7;
    } else if (category.includes(q)) {
        score += 0.5;
    }

    if (description.includes(q)) {
        score += 0.3;
    }

    const tokens =
        q.split(/\s+/)
            .filter(Boolean);

    if (tokens.length > 1) {

        let matched = 0;

        for (const token of tokens) {

            if (
                name.includes(token) ||
                brand.includes(token) ||
                category.includes(token) ||
                description.includes(token)
            ) {
                matched++;
            }
        }

        score +=
            (matched / tokens.length) *
            0.5;
    }

    return Math.min(score, 1);
}

async function hybridSearch(
    query,
    {
        limit = 10,
        semanticWeight = 0.6,
        keywordWeight = 0.4
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

    const searchLimit =
        safeLimit * 3;

    const regex =
        new RegExp(
            query.trim().replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            ),
            "i"
        );

    const keywordProducts =
        await Product.find({
            $or: [
                { name: regex },
                { description: regex },
                { category: regex },
                { brand: regex }
            ]
        })
        .select(
            "name description category brand price stock images"
        )
        .limit(searchLimit)
        .lean();

    let semanticResults = [];

    try {

        semanticResults =
            await semanticSearch(
                query,
                {
                    limit: searchLimit
                }
            );

    } catch (error) {

        console.log(
            "Semantic search unavailable:",
            error.message
        );
    }

    const map = new Map();

    for (
        const product of keywordProducts
    ) {

        const id =
            product._id.toString();

        const score =
            keywordScore(
                product,
                query
            );

        map.set(
            id,
            {
                product,
                keywordScore: score,
                semanticScore: 0,
                score:
                    score *
                    keywordWeight,
                source: "keyword"
            }
        );
    }

    for (
        const result of semanticResults
    ) {

        const product =
            result.product;

        const id =
            product._id.toString();

        const semanticScore =
            Number(result.score) || 0;

        const existing =
            map.get(id);

        if (existing) {

            existing.semanticScore =
                semanticScore;

            existing.score =
                semanticScore *
                semanticWeight +
                existing.keywordScore *
                keywordWeight;

            existing.source =
                "hybrid";

        } else {

            map.set(
                id,
                {
                    product,
                    keywordScore: 0,
                    semanticScore,
                    score:
                        semanticScore *
                        semanticWeight,
                    source: "semantic"
                }
            );
        }
    }

    return Array
        .from(map.values())
        .sort(
            (a, b) =>
                b.score - a.score
        )
        .slice(0, safeLimit)
        .map(
            (item, index) => ({
                rank: index + 1,
                score:
                    Number(
                        item.score.toFixed(6)
                    ),
                semanticScore:
                    Number(
                        item.semanticScore.toFixed(6)
                    ),
                keywordScore:
                    Number(
                        item.keywordScore.toFixed(6)
                    ),
                source: item.source,
                product: item.product
            })
        );
}

module.exports = {
    hybridSearch,
    keywordScore,
    calculateKeywordScore: keywordScore
};
