const Product =
    require("../models/Product");

const {
    hybridSearch
} =
    require("./../ai/services/hybridSearchService");

const {
    buildUserProfile,
    calculatePersonalizationScore,
    getPersonalizationReason
} =
    require("./personalizationService");


const getPersonalizedRecommendations =
async (
    userId,
    query,
    options = {}
) => {

    const limit =
        Math.min(
            Math.max(
                Number(options.limit) || 10,
                1
            ),
            50
        );


    /*
     * Build profile from activity.
     */
    const profile =
        await buildUserProfile(
            userId
        );


    /*
     * Get hybrid candidates.
     */
    let candidates = [];

    if (query && query.trim()) {

        candidates =
            await hybridSearch(
                query.trim(),
                {
                    limit:
                        Math.min(
                            limit * 4,
                            100
                        )
                }
            );

    } else {

        const products =
            await Product.find({})
            .sort({
                createdAt: -1
            })
            .limit(
                Math.min(
                    limit * 4,
                    100
                )
            )
            .lean();

        candidates =
            products.map(
                product => ({
                    product,
                    score: 0,
                    source: "catalog"
                })
            );
    }


    /*
     * Rank using:
     *
     * relevance       50%
     * personalization 30%
     * popularity      10%
     * price            10%
     */
    const ranked =
        candidates.map(
            item => {

                const product =
                    item.product;

                const relevance =
                    Math.min(
                        Math.max(
                            Number(item.score) || 0,
                            0
                        ),
                        1
                    );


                const personalization =
                    calculatePersonalizationScore(
                        product,
                        profile
                    );


                const popularityRaw =
                    Number(
                        product.rating ||
                        product.reviewsCount ||
                        product.salesCount ||
                        0
                    );

                const popularity =
                    Math.min(
                        Math.max(
                            popularityRaw / 5,
                            0
                        ),
                        1
                    );


                let priceScore = 0;

                if (
                    profile.priceRange?.average &&
                    product.price
                ) {

                    const difference =
                        Math.abs(
                            Number(product.price) -
                            profile.priceRange.average
                        ) /
                        profile.priceRange.average;

                    priceScore =
                        Math.max(
                            0,
                            1 - difference
                        );

                } else {
                    priceScore = 0.5;
                }


                const finalScore =
                    relevance * 0.50 +
                    personalization * 0.30 +
                    popularity * 0.10 +
                    priceScore * 0.10;


                return {
                    product,

                    score:
                        Number(
                            finalScore.toFixed(6)
                        ),

                    relevanceScore:
                        Number(
                            relevance.toFixed(6)
                        ),

                    personalizationScore:
                        Number(
                            personalization.toFixed(6)
                        ),

                    popularityScore:
                        Number(
                            popularity.toFixed(6)
                        ),

                    priceScore:
                        Number(
                            priceScore.toFixed(6)
                        ),

                    source:
                        item.source || "hybrid",

                    reason:
                        getPersonalizationReason(
                            product,
                            profile
                        )
                };
            }
        );


    ranked.sort(
        (a, b) =>
            b.score - a.score
    );


    return {
        profile,
        results:
            ranked
            .slice(0, limit)
            .map(
                (item, index) => ({
                    rank:
                        index + 1,

                    ...item
                })
            )
    };
};


module.exports = {
    getPersonalizedRecommendations
};
