/*
 * ============================================================
 * PRODUCTION RECOMMENDATION RANKING ENGINE
 * ============================================================
 *
 * Combines:
 *
 * 1. Query relevance
 * 2. Semantic relevance
 * 3. Category preference
 * 4. Brand preference
 * 5. Popularity
 * 6. Price/value
 * 7. Stock availability
 * 8. Personalization
 *
 * The engine is deterministic and works without an
 * external AI API.
 * ============================================================
 */

const DEFAULT_WEIGHTS = {
    queryRelevance: 0.25,
    semanticRelevance: 0.20,
    categoryPreference: 0.15,
    brandPreference: 0.10,
    popularity: 0.10,
    priceValue: 0.08,
    stockAvailability: 0.07,
    personalization: 0.05
};


/*
 * ============================================================
 * SAFE NUMBER
 * ============================================================
 */

const safeNumber = (
    value,
    fallback = 0
) => {

    const number =
        Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;
};


/*
 * ============================================================
 * CLAMP
 * ============================================================
 */

const clamp = (
    value,
    minimum = 0,
    maximum = 1
) => {

    return Math.min(
        Math.max(
            safeNumber(value),
            minimum
        ),
        maximum
    );
};


/*
 * ============================================================
 * NORMALIZE TEXT
 * ============================================================
 */

const normalizeText = (
    value
) => {

    return String(
        value || ""
    )
    .toLowerCase()
    .trim();
};


/*
 * ============================================================
 * TOKENIZE
 * ============================================================
 */

const tokenize = (
    text
) => {

    return normalizeText(text)
        .split(/[^a-z0-9]+/)
        .filter(
            word =>
                word.length > 1
        );
};


/*
 * ============================================================
 * QUERY RELEVANCE
 * ============================================================
 */

const calculateQueryRelevance = (
    product,
    query
) => {

    if (
        !query ||
        !query.trim()
    ) {
        return 0;
    }


    const queryTokens =
        tokenize(query);


    if (
        queryTokens.length === 0
    ) {
        return 0;
    }


    const name =
        normalizeText(
            product.name
        );

    const description =
        normalizeText(
            product.description
        );

    const category =
        normalizeText(
            product.category
        );

    const brand =
        normalizeText(
            product.brand
        );


    let score = 0;


    for (
        const token of queryTokens
    ) {

        /*
         * Product name gets the strongest
         * keyword relevance.
         */

        if (
            name.includes(token)
        ) {
            score += 1.00;

            continue;
        }


        /*
         * Category is highly relevant.
         */

        if (
            category.includes(token)
        ) {
            score += 0.85;

            continue;
        }


        /*
         * Brand relevance.

         */

        if (
            brand.includes(token)
        ) {
            score += 0.75;

            continue;
        }


        /*
         * Description relevance.
         */

        if (
            description.includes(token)
        ) {
            score += 0.50;
        }
    }


    return clamp(
        score /
        queryTokens.length
    );
};


/*
 * ============================================================
 * CATEGORY PREFERENCE
 * ============================================================
 */

const calculateCategoryPreference = (
    product,
    profile
) => {

    if (
        !profile ||
        !Array.isArray(
            profile.categories
        )
    ) {
        return 0;
    }


    const category =
        normalizeText(
            product.category
        );


    if (
        !category
    ) {
        return 0;
    }


    const match =
        profile.categories.find(
            item =>
                item.value ===
                category
        );


    if (
        !match
    ) {
        return 0;
    }


    const maximum =
        safeNumber(
            profile.categories[0]?.score,
            1
        );


    return clamp(
        match.score /
        maximum
    );
};


/*
 * ============================================================
 * BRAND PREFERENCE
 * ============================================================
 */

const calculateBrandPreference = (
    product,
    profile
) => {

    if (
        !profile ||
        !Array.isArray(
            profile.brands
        )
    ) {
        return 0;
    }


    const brand =
        normalizeText(
            product.brand
        );


    if (
        !brand
    ) {
        return 0;
    }


    const match =
        profile.brands.find(
            item =>
                item.value ===
                brand
        );


    if (
        !match
    ) {
        return 0;
    }


    const maximum =
        safeNumber(
            profile.brands[0]?.score,
            1
        );


    return clamp(
        match.score /
        maximum
    );
};


/*
 * ============================================================
 * POPULARITY
 *
 * Uses available product metadata.
 *
 * Products with stronger stock receive a
 * small availability/popularity signal.
 * ============================================================
 */

const calculatePopularity = (
    product,
    maximumStock
) => {

    const stock =
        Math.max(
            safeNumber(
                product.stock
            ),
            0
        );


    const max =
        Math.max(
            safeNumber(
                maximumStock,
                1
            ),
            1
        );


    return clamp(
        Math.log1p(stock) /
        Math.log1p(max)
    );
};


/*
 * ============================================================
 * PRICE / VALUE SCORE
 *
 * Lower prices receive a stronger value score,
 * but price is deliberately given a limited weight
 * so cheap products cannot dominate relevance.
 * ============================================================
 */

const calculatePriceValue = (
    product,
    products
) => {

    const prices =
        products
            .map(
                item =>
                    safeNumber(
                        item.price,
                        0
                    )
            )
            .filter(
                price =>
                    price > 0
            );


    if (
        prices.length === 0
    ) {
        return 0.5;
    }


    const minimum =
        Math.min(
            ...prices
        );

    const maximum =
        Math.max(
            ...prices
        );


    const price =
        safeNumber(
            product.price
        );


    if (
        maximum === minimum
    ) {
        return 0.5;
    }


    /*
     * Cheapest = 1
     * Most expensive = 0
     */

    return clamp(
        1 -
        (
            (price - minimum) /
            (maximum - minimum)
        )
    );
};


/*
 * ============================================================
 * STOCK AVAILABILITY
 * ============================================================
 */

const calculateStockAvailability = (
    product
) => {

    const stock =
        safeNumber(
            product.stock
        );


    if (
        stock <= 0
    ) {
        return 0;
    }


    /*
     * Saturates around 100 units.
     */

    return clamp(
        Math.log1p(stock) /
        Math.log1p(100)
    );
};


/*
 * ============================================================
 * SEMANTIC SCORE
 *
 * Accepts an existing semantic score when available.
 * ============================================================
 */

const calculateSemanticScore = (
    candidate
) => {

    return clamp(
        candidate?.semanticScore ??
        candidate?.score ??
        0
    );
};


/*
 * ============================================================
 * PERSONALIZATION SCORE
 * ============================================================
 */

const calculatePersonalizationScore = (
    categoryPreference,
    brandPreference,
    profile
) => {

    if (
        !profile
    ) {
        return 0;
    }


    const hasHistory =
        (
            Array.isArray(
                profile.categories
            ) &&
            profile.categories.length > 0
        ) ||
        (
            Array.isArray(
                profile.brands
            ) &&
            profile.brands.length > 0
        );


    if (
        !hasHistory
    ) {
        return 0;
    }


    return clamp(
        (
            categoryPreference +
            brandPreference
        ) / 2
    );
};


/*
 * ============================================================
 * NORMALIZE WEIGHTS
 * ============================================================
 */

const normalizeWeights = (
    customWeights = {}
) => {

    const merged = {
        ...DEFAULT_WEIGHTS,
        ...customWeights
    };


    const entries =
        Object.entries(
            merged
        );


    const total =
        entries.reduce(
            (
                sum,
                [, value]
            ) =>
                sum +
                Math.max(
                    safeNumber(value),
                    0
                ),
            0
        );


    if (
        total <= 0
    ) {
        return {
            ...DEFAULT_WEIGHTS
        };
    }


    return Object.fromEntries(
        entries.map(
            (
                [key, value]
            ) => [
                key,
                Math.max(
                    safeNumber(value),
                    0
                ) / total
            ]
        )
    );
};


/*
 * ============================================================
 * RANK PRODUCTS
 * ============================================================
 */

const rankProducts = (
    products,
    options = {}
) => {

    if (
        !Array.isArray(products)
    ) {
        return [];
    }


    const query =
        options.query ||
        "";


    const profile =
        options.profile ||
        null;


    const weights =
        normalizeWeights(
            options.weights
        );


    const maximumStock =
        Math.max(
            ...products.map(
                product =>
                    safeNumber(
                        product.stock
                    )
            ),
            1
        );


    const ranked =
        products.map(
            (
                candidate
            ) => {

                const product =
                    candidate.product ||
                    candidate;


                const queryRelevance =
                    calculateQueryRelevance(
                        product,
                        query
                    );


                const semanticRelevance =
                    calculateSemanticScore(
                        candidate
                    );


                const categoryPreference =
                    calculateCategoryPreference(
                        product,
                        profile
                    );


                const brandPreference =
                    calculateBrandPreference(
                        product,
                        profile
                    );


                const popularity =
                    calculatePopularity(
                        product,
                        maximumStock
                    );


                const priceValue =
                    calculatePriceValue(
                        product,
                        products.map(
                            item =>
                                item.product ||
                                item
                        )
                    );


                const stockAvailability =
                    calculateStockAvailability(
                        product
                    );


                const personalization =
                    calculatePersonalizationScore(
                        categoryPreference,
                        brandPreference,
                        profile
                    );


                const score =
                    (
                        queryRelevance *
                        weights.queryRelevance
                    ) +
                    (
                        semanticRelevance *
                        weights.semanticRelevance
                    ) +
                    (
                        categoryPreference *
                        weights.categoryPreference
                    ) +
                    (
                        brandPreference *
                        weights.brandPreference
                    ) +
                    (
                        popularity *
                        weights.popularity
                    ) +
                    (
                        priceValue *
                        weights.priceValue
                    ) +
                    (
                        stockAvailability *
                        weights.stockAvailability
                    ) +
                    (
                        personalization *
                        weights.personalization
                    );


                return {

                    ...candidate,

                    product,

                    score:
                        Number(
                            score.toFixed(6)
                        ),

                    rankingFactors: {

                        queryRelevance:
                            Number(
                                queryRelevance
                                    .toFixed(6)
                            ),

                        semanticRelevance:
                            Number(
                                semanticRelevance
                                    .toFixed(6)
                            ),

                        categoryPreference:
                            Number(
                                categoryPreference
                                    .toFixed(6)
                            ),

                        brandPreference:
                            Number(
                                brandPreference
                                    .toFixed(6)
                            ),

                        popularity:
                            Number(
                                popularity
                                    .toFixed(6)
                            ),

                        priceValue:
                            Number(
                                priceValue
                                    .toFixed(6)
                            ),

                        stockAvailability:
                            Number(
                                stockAvailability
                                    .toFixed(6)
                            ),

                        personalization:
                            Number(
                                personalization
                                    .toFixed(6)
                            )
                    }
                };
            }
        );


    ranked.sort(
        (a, b) => {

            if (
                b.score !==
                a.score
            ) {
                return (
                    b.score -
                    a.score
                );
            }


            return (
                String(
                    a.product?._id ||
                    ""
                )
                .localeCompare(
                    String(
                        b.product?._id ||
                        ""
                    )
                )
            );
        }
    );


    return ranked.map(
        (
            item,
            index
        ) => ({

            ...item,

            rank:
                index + 1
        })
    );
};


/*
 * ============================================================
 * EXPORTS
 * ============================================================
 */

module.exports = {

    DEFAULT_WEIGHTS,

    safeNumber,

    clamp,

    calculateQueryRelevance,

    calculateCategoryPreference,

    calculateBrandPreference,

    calculatePopularity,

    calculatePriceValue,

    calculateStockAvailability,

    normalizeWeights,

    rankProducts
};
