const UserActivity = require("../../models/UserActivity");
const Product = require("../../models/Product");

const {
    calculateProductRelevance,
    calculatePopularityScore,
    calculatePriceScore
} = require("./aiRecommendationService");


/*
 * ============================================================
 * ACTIVITY WEIGHTS
 * ============================================================
 */

const ACTIVITY_WEIGHTS = {
    purchase: 1.00,
    wishlist: 0.90,
    cart: 0.80,
    review: 0.70,
    view: 0.50,
    search: 0.35
};


/*
 * ============================================================
 * RECENCY DECAY
 * ============================================================
 */

const calculateRecencyWeight = (
    createdAt
) => {

    const timestamp =
        new Date(createdAt).getTime();

    if (
        !Number.isFinite(timestamp)
    ) {
        return 0;
    }

    const ageMs =
        Date.now() - timestamp;

    const ageDays =
        Math.max(
            ageMs / (
                1000 *
                60 *
                60 *
                24
            ),
            0
        );

    /*
     * Half-life approximately 30 days.
     */

    return Math.exp(
        -ageDays / 30
    );
};


/*
 * ============================================================
 * BUILD USER PROFILE
 * ============================================================
 */

const buildUserPreferenceProfile =
async (
    userId,
    options = {}
) => {

    const limit =
        Math.min(
            Math.max(
                Number(
                    options.activityLimit
                ) || 200,
                10
            ),
            1000
        );


    const activities =
        await UserActivity.find({
            user: userId
        })
        .sort({
            createdAt: -1
        })
        .limit(limit)
        .populate(
            "product",
            "name category brand price"
        )
        .lean();


    const categories = {};
    const brands = {};
    const searches = {};


    const interactedProducts =
        new Set();


    let totalActivityWeight = 0;


    for (
        const activity of activities
    ) {

        const baseWeight =
            ACTIVITY_WEIGHTS[
                activity.type
            ] || 0;


        if (
            baseWeight <= 0
        ) {
            continue;
        }


        const recency =
            calculateRecencyWeight(
                activity.createdAt
            );


        const weight =
            baseWeight *
            recency;


        totalActivityWeight +=
            weight;


        /*
         * Product-based preferences
         */

        if (
            activity.product
        ) {

            const product =
                activity.product;


            const productId =
                product._id.toString();


            interactedProducts.add(
                productId
            );


            if (
                product.category
            ) {

                const category =
                    String(
                        product.category
                    ).toLowerCase();


                categories[category] =
                    (
                        categories[category] ||
                        0
                    ) +
                    weight;
            }


            if (
                product.brand
            ) {

                const brand =
                    String(
                        product.brand
                    ).toLowerCase();


                brands[brand] =
                    (
                        brands[brand] ||
                        0
                    ) +
                    weight;
            }
        }


        /*
         * Search preferences
         */

        if (
            activity.searchQuery
        ) {

            const search =
                String(
                    activity.searchQuery
                )
                .trim()
                .toLowerCase();


            if (
                search
            ) {

                searches[search] =
                    (
                        searches[search] ||
                        0
                    ) +
                    weight;
            }
        }
    }


    const sortObject =
        (object) => {

            return Object.entries(
                object
            )
            .sort(
                (a, b) =>
                    b[1] - a[1]
            )
            .map(
                ([key, score]) => ({
                    value: key,

                    score:
                        Number(
                            score.toFixed(4)
                        )
                })
            );
        };


    return {

        userId,

        activityCount:
            activities.length,

        totalActivityWeight:
            Number(
                totalActivityWeight
                    .toFixed(4)
            ),

        categories:
            sortObject(
                categories
            ),

        brands:
            sortObject(
                brands
            ),

        searches:
            sortObject(
                searches
            ),

        interactedProducts:
            Array.from(
                interactedProducts
            )
    };
};


/*
 * ============================================================
 * CATEGORY PREFERENCE SCORE
 * ============================================================
 */

const getPreferenceScore = (
    values,
    value
) => {

    if (
        !value
    ) {
        return 0;
    }


    const normalized =
        String(value)
            .toLowerCase();


    const match =
        values.find(
            item =>
                item.value ===
                normalized
        );


    if (
        !match
    ) {
        return 0;
    }


    const maximum =
        values[0]?.score || 1;


    return Math.min(
        match.score /
        maximum,
        1
    );
};


/*
 * ============================================================
 * SEARCH PREFERENCE SCORE
 * ============================================================
 */

const getSearchPreferenceScore = (
    searches,
    product
) => {

    if (
        !searches ||
        searches.length === 0
    ) {
        return 0;
    }


    const productText =
        [
            product.name,
            product.description,
            product.category,
            product.brand
        ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();


    let bestScore = 0;


    for (
        const search of searches
    ) {

        if (
            !search.value
        ) {
            continue;
        }


        const queryWords =
            search.value
                .split(
                    /[^a-z0-9]+/
                )
                .filter(
                    word =>
                        word.length > 1
                );


        if (
            queryWords.length === 0
        ) {
            continue;
        }


        let matches = 0;


        for (
            const word of queryWords
        ) {

            if (
                productText.includes(
                    word
                )
            ) {
                matches++;
            }
        }


        const similarity =
            matches /
            queryWords.length;


        const normalizedSearchWeight =
            search.score /
            (
                searches[0]?.score ||
                1
            );


        const score =
            similarity *
            normalizedSearchWeight;


        bestScore =
            Math.max(
                bestScore,
                score
            );
    }


    return Math.min(
        bestScore,
        1
    );
};


/*
 * ============================================================
 * PERSONALIZED PRODUCT SCORE
 * ============================================================
 */

const calculatePersonalizedScore = (
    product,
    profile,
    allProducts,
    query = ""
) => {

    const relevance =
        query
            ? calculateProductRelevance(
                product,
                query
            )
            : 0;


    const categoryScore =
        getPreferenceScore(
            profile.categories,
            product.category
        );


    const brandScore =
        getPreferenceScore(
            profile.brands,
            product.brand
        );


    const searchScore =
        getSearchPreferenceScore(
            profile.searches,
            product
        );


    const popularity =
        calculatePopularityScore(
            product
        );


    const priceScore =
        calculatePriceScore(
            product,
            allProducts
        );


    /*
     * Personalization formula
     *
     * Query relevance       = 30%
     * Category preference   = 25%
     * Brand preference      = 15%
     * Search preference     = 10%
     * Popularity             = 10%
     * Price/value            = 10%
     */

    const score =
        (
            relevance * 0.30
        ) +
        (
            categoryScore * 0.25
        ) +
        (
            brandScore * 0.15
        ) +
        (
            searchScore * 0.10
        ) +
        (
            popularity * 0.10
        ) +
        (
            priceScore * 0.10
        );


    return {

        score:
            Number(
                score.toFixed(6)
            ),

        relevanceScore:
            Number(
                relevance.toFixed(6)
            ),

        categoryPreference:
            Number(
                categoryScore.toFixed(6)
            ),

        brandPreference:
            Number(
                brandScore.toFixed(6)
            ),

        searchPreference:
            Number(
                searchScore.toFixed(6)
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
};


/*
 * ============================================================
 * PERSONALIZED RECOMMENDATIONS
 * ============================================================
 */

const getPersonalizedRecommendations =
async (
    userId,
    query = "",
    options = {}
) => {

    if (
        !userId
    ) {
        throw new Error(
            "User ID is required for personalized recommendations"
        );
    }


    const limit =
        Math.min(
            Math.max(
                Number(
                    options.limit
                ) || 10,
                1
            ),
            50
        );


    const profile =
        await buildUserPreferenceProfile(
            userId,
            {
                activityLimit:
                    options.activityLimit ||
                    200
            }
        );


    const products =
        await Product.find({
            stock: {
                $gt: 0
            }
        })
        .select(
            "name description category brand price stock images"
        )
        .lean();


    if (
        products.length === 0
    ) {
        return {

            profile,

            recommendations: []
        };
    }


    const scored =
        products.map(
            product => {

                const scores =
                    calculatePersonalizedScore(
                        product,
                        profile,
                        products,
                        query
                    );


                const productId =
                    product._id.toString();


                /*
                 * Avoid recommending products
                 * the user already purchased.
                 */

                const alreadyInteracted =
                    profile
                        .interactedProducts
                        .includes(
                            productId
                        );


                let finalScore =
                    scores.score;


                if (
                    alreadyInteracted
                ) {

                    /*
                     * Small penalty rather than
                     * complete exclusion because
                     * users may want to buy again.
                     */

                    finalScore *=
                        0.92;
                }


                return {

                    product,

                    ...scores,

                    score:
                        Number(
                            finalScore.toFixed(
                                6
                            )
                        ),

                    previouslyInteracted:
                        alreadyInteracted
                };
            }
        );


    scored.sort(
        (a, b) =>
            b.score - a.score
    );


    const recommendations =
        scored
            .slice(
                0,
                limit
            )
            .map(
                (item, index) => ({

                    rank:
                        index + 1,

                    score:
                        item.score,

                    relevanceScore:
                        item.relevanceScore,

                    categoryPreference:
                        item.categoryPreference,

                    brandPreference:
                        item.brandPreference,

                    searchPreference:
                        item.searchPreference,

                    popularityScore:
                        item.popularityScore,

                    priceScore:
                        item.priceScore,

                    previouslyInteracted:
                        item.previouslyInteracted,

                    product:
                        item.product
                })
            );


    return {

        profile,

        recommendations
    };
};


/*
 * ============================================================
 * EXPORTS
 * ============================================================
 */

module.exports = {

    ACTIVITY_WEIGHTS,

    calculateRecencyWeight,

    buildUserPreferenceProfile,

    calculatePersonalizedScore,

    getPersonalizedRecommendations
};
