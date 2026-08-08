const Product = require("../../models/Product");

const {
    getAIClient
} = require("../aiClient");

const {
    getAIConfig
} = require("../aiConfig");


/*
 * ============================================================
 * NORMALIZE
 * ============================================================
 */

const normalize = (value) => {
    return String(value || "")
        .trim()
        .toLowerCase();
};


/*
 * ============================================================
 * TOKENIZE
 * ============================================================
 */

const tokenize = (value) => {

    return normalize(value)
        .split(/[^a-z0-9]+/)
        .filter(
            token => token.length > 1
        );
};


/*
 * ============================================================
 * TEXT SIMILARITY
 * ============================================================
 */

const textSimilarity = (
    textA,
    textB
) => {

    const tokensA =
        new Set(
            tokenize(textA)
        );

    const tokensB =
        new Set(
            tokenize(textB)
        );

    if (
        tokensA.size === 0 ||
        tokensB.size === 0
    ) {
        return 0;
    }

    let intersection = 0;

    for (
        const token of tokensA
    ) {

        if (
            tokensB.has(token)
        ) {
            intersection++;
        }
    }

    const union =
        new Set([
            ...tokensA,
            ...tokensB
        ]).size;

    if (union === 0) {
        return 0;
    }

    return intersection / union;
};


/*
 * ============================================================
 * PRODUCT RELEVANCE
 * ============================================================
 */

const calculateProductRelevance = (
    product,
    query
) => {

    const q =
        normalize(query);


    const name =
        normalize(product.name);

    const description =
        normalize(product.description);

    const category =
        normalize(product.category);

    const brand =
        normalize(product.brand);


    let score = 0;


    /*
     * Exact matches
     */

    if (name === q) {
        score += 1;
    }

    if (brand === q) {
        score += 0.8;
    }

    if (category === q) {
        score += 0.7;
    }


    /*
     * Partial matches
     */

    if (
        name.includes(q)
    ) {
        score += 0.8;
    }

    if (
        brand.includes(q)
    ) {
        score += 0.5;
    }

    if (
        category.includes(q)
    ) {
        score += 0.5;
    }

    if (
        description.includes(q)
    ) {
        score += 0.3;
    }


    /*
     * Token similarity
     */

    const queryTokens =
        tokenize(q);


    if (
        queryTokens.length > 0
    ) {

        const productText =
            [
                product.name,
                product.description,
                product.category,
                product.brand
            ]
                .filter(Boolean)
                .join(" ");


        const productTokens =
            new Set(
                tokenize(productText)
            );


        let matches = 0;

        for (
            const token of queryTokens
        ) {

            if (
                productTokens.has(token)
            ) {
                matches++;
            }
        }


        score +=
            (
                matches /
                queryTokens.length
            ) *
            0.5;
    }


    return Math.min(
        score,
        1
    );
};


/*
 * ============================================================
 * POPULARITY SCORE
 * ============================================================
 */

const calculatePopularityScore = (
    product
) => {

    const stock =
        Number(product.stock) || 0;

    /*
     * Products with reasonable stock receive
     * a small availability boost.
     */

    if (stock <= 0) {
        return 0;
    }

    if (stock < 5) {
        return 0.2;
    }

    if (stock < 20) {
        return 0.5;
    }

    return 1;
};


/*
 * ============================================================
 * PRICE SCORE
 * ============================================================
 */

const calculatePriceScore = (
    product,
    products
) => {

    const prices =
        products
            .map(
                item =>
                    Number(item.price)
            )
            .filter(
                price =>
                    Number.isFinite(price)
            );


    if (
        prices.length === 0
    ) {
        return 0.5;
    }


    const min =
        Math.min(...prices);

    const max =
        Math.max(...prices);


    if (
        min === max
    ) {
        return 0.5;
    }


    const price =
        Number(product.price) || max;


    /*
     * Lower-priced products receive
     * a modest value score.
     */

    return 1 -
        (
            (price - min) /
            (max - min)
        );
};


/*
 * ============================================================
 * RANK CANDIDATE PRODUCTS
 * ============================================================
 */

const rankRecommendations = (
    products,
    query
) => {

    return products
        .map(product => {

            const relevance =
                calculateProductRelevance(
                    product,
                    query
                );


            const popularity =
                calculatePopularityScore(
                    product
                );


            const priceScore =
                calculatePriceScore(
                    product,
                    products
                );


            /*
             * Recommendation formula
             *
             * Relevance  = 60%
             * Popularity = 20%
             * Price      = 20%
             */

            const score =
                (
                    relevance * 0.60
                ) +
                (
                    popularity * 0.20
                ) +
                (
                    priceScore * 0.20
                );


            return {

                product,

                score:
                    Number(
                        score.toFixed(6)
                    ),

                relevanceScore:
                    Number(
                        relevance.toFixed(6)
                    ),

                popularityScore:
                    Number(
                        popularity.toFixed(6)
                    ),

                priceScore:
                    Number(
                        priceScore.toFixed(6)
                    )
            };
        })
        .sort(
            (a, b) =>
                b.score - a.score
        );
};


/*
 * ============================================================
 * GET RECOMMENDATIONS
 * ============================================================
 */

const getRecommendations = async (
    query,
    options = {}
) => {

    if (
        !query ||
        !query.trim()
    ) {
        throw new Error(
            "Recommendation query is required"
        );
    }


    const limit =
        Math.min(
            Math.max(
                Number(options.limit) || 10,
                1
            ),
            50
        );


    const products =
        await Product.find({})
            .select(
                "name description category brand price stock images"
            )
            .lean();


    if (
        products.length === 0
    ) {
        return [];
    }


    const ranked =
        rankRecommendations(
            products,
            query
        );


    return ranked
        .slice(0, limit)
        .map(
            (item, index) => ({

                rank:
                    index + 1,

                score:
                    item.score,

                relevanceScore:
                    item.relevanceScore,

                popularityScore:
                    item.popularityScore,

                priceScore:
                    item.priceScore,

                product:
                    item.product
            })
        );
};


/*
 * ============================================================
 * AI RECOMMENDATION REASONS
 * ============================================================
 */

const generateAIRecommendationReason =
async (
    userQuery,
    products
) => {

    const client =
        getAIClient();

    const config =
        getAIConfig();


    /*
     * AI unavailable:
     * provide deterministic explanations.
     */

    if (
        !client ||
        !config
    ) {

        return products.map(
            item => ({

                ...item,

                reason:
                    buildFallbackReason(
                        userQuery,
                        item
                    )
            })
        );
    }


    const productText =
        products
            .map(
                (item, index) =>
                    `${index + 1}. ${item.product?.name || item.name} | ${item.product?.category || item.category} | ${item.product?.brand || item.brand} | ${item.product?.description || item.description}`
            )
            .join("\n");


    try {

        const response =
            await client.chat.completions.create(
                {

                    model:
                        config.chatModel,

                    temperature:
                        0.2,

                    messages: [

                        {
                            role:
                                "system",

                            content:
                                "You are an e-commerce recommendation assistant. Give one concise, factual reason for each recommended product. Do not invent product features."
                        },

                        {
                            role:
                                "user",

                            content:
                                `Customer request: ${userQuery}

Products:

${productText}

Return one short reason for each product in numbered format.`
                        }
                    ]
                }
            );


        const text =
            response
                .choices?.[0]
                ?.message?.content ||
            "";


        const reasons =
            text
                .split("\n")
                .map(
                    line =>
                        line
                            .replace(
                                /^\s*\d+[\.\)]\s*/,
                                ""
                            )
                            .trim()
                )
                .filter(Boolean);


        return products.map(
            (item, index) => ({

                ...item,

                reason:
                    reasons[index] ||
                    buildFallbackReason(
                        userQuery,
                        item
                    )
            })
        );


    } catch (error) {

        console.log(
            "AI recommendation explanation unavailable:",
            error.message
        );


        return products.map(
            item => ({

                ...item,

                reason:
                    buildFallbackReason(
                        userQuery,
                        item
                    )
            })
        );
    }
};


/*
 * ============================================================
 * FALLBACK EXPLANATION
 * ============================================================
 */

const buildFallbackReason = (
    query,
    item
) => {

    const product =
        item.product || item;


    const relevance =
        Number(
            item.relevanceScore
        ) || 0;


    const category =
        product.category ||
        "this category";


    const brand =
        product.brand ||
        "this brand";


    if (
        relevance >= 0.8
    ) {

        return `Strong match for "${query}" based on the product name, category, or brand.`;
    }


    if (
        relevance >= 0.5
    ) {

        return `Relevant to "${query}" based on product attributes and category.`;
    }


    return `Recommended as a relevant option in ${category} from ${brand}.`;
};


/*
 * ============================================================
 * EXPORTS
 * ============================================================
 */

module.exports = {

    getRecommendations,

    rankRecommendations,

    calculateProductRelevance,

    calculatePopularityScore,

    calculatePriceScore,

    generateAIRecommendationReason
};
