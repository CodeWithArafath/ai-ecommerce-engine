const {
    semanticSearch
} = require("../services/semanticSearchService");

const {
    hybridSearch
} = require("../services/hybridSearchService");

const {
    generateAIRecommendationReason
} = require("../services/aiRecommendationService");

const {
    getPersonalizedRecommendations
} = require("../services/personalizedRecommendationService");


/*
 * ============================================================
 * SEMANTIC SEARCH
 * ============================================================
 */

exports.semanticSearch = async (req, res) => {

    try {

        const {
            q,
            limit = 10
        } = req.query;

        if (!q || !q.trim()) {

            return res.status(400).json({
                success: false,
                message:
                    "Query parameter q is required"
            });
        }

        const results =
            await semanticSearch(
                q,
                {
                    limit: Number(limit)
                }
            );

        return res.json({
            success: true,
            message:
                "Semantic search completed",
            count: results.length,
            data: results
        });

    } catch (error) {

        console.error(
            "Semantic search error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/*
 * ============================================================
 * HYBRID SEARCH
 * ============================================================
 */

exports.hybridSearch = async (req, res) => {

    try {

        const {
            q,
            limit = 10,
            semanticWeight,
            keywordWeight
        } = req.query;

        if (!q || !q.trim()) {

            return res.status(400).json({
                success: false,
                message:
                    "Query parameter q is required"
            });
        }

        const options = {
            limit: Number(limit)
        };

        if (
            semanticWeight !== undefined
        ) {
            options.semanticWeight =
                Number(semanticWeight);
        }

        if (
            keywordWeight !== undefined
        ) {
            options.keywordWeight =
                Number(keywordWeight);
        }

        const results =
            await hybridSearch(
                q,
                options
            );

        return res.json({
            success: true,
            message:
                "Hybrid AI search completed",
            count: results.length,
            data: results
        });

    } catch (error) {

        console.error(
            "Hybrid search error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/*
 * ============================================================
 * AI RECOMMENDATIONS
 *
 * Public mode:
 *     /api/ai/recommend?q=running shoes
 *
 * Personalized mode:
 *     /api/ai/recommend?q=running shoes
 *     Authorization: Bearer TOKEN
 *
 * Explicit personalized mode:
 *     /api/ai/recommend?q=running shoes&personalized=true
 * ============================================================
 */

exports.aiRecommend = async (req, res) => {

    try {

        const {
            q = "",
            limit = 10,
            explain = "true",
            personalized = "auto"
        } = req.query;


        const hasUser =
            Boolean(
                req.user &&
                req.user.id
            );


        const usePersonalization =
            hasUser &&
            (
                String(personalized)
                    .toLowerCase() !==
                "false"
            );


        /*
         * ----------------------------------------------------
         * PERSONALIZED MODE
         * ----------------------------------------------------
         */

        if (usePersonalization) {

            const result =
                await getPersonalizedRecommendations(
                    req.user.id,
                    q,
                    {
                        limit:
                            Number(limit)
                    }
                );


            let recommendations =
                result.recommendations;


            /*
             * AI explanations are optional.
             */

            if (
                String(explain)
                    .toLowerCase() !==
                "false"
            ) {

                recommendations =
                    await generateAIRecommendationReason(
                        q ||
                        "products you may like",
                        recommendations
                    );
            }


            return res.json({

                success: true,

                message:
                    "Personalized AI recommendations generated",

                mode:
                    "personalized",

                query:
                    q,

                count:
                    recommendations.length,

                aiExplanation:
                    String(explain)
                        .toLowerCase() !==
                    "false",

                profile: {

                    activityCount:
                        result.profile
                            .activityCount,

                    topCategories:
                        result.profile
                            .categories
                            .slice(0, 5),

                    topBrands:
                        result.profile
                            .brands
                            .slice(0, 5),

                    recentSearches:
                        result.profile
                            .searches
                            .slice(0, 5)
                },

                data:
                    recommendations
            });
        }


        /*
         * ----------------------------------------------------
         * PUBLIC MODE
         * ----------------------------------------------------
         */

        if (!q || !q.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Query parameter q is required for public recommendations"
            });
        }


        const results =
            await hybridSearch(
                q,
                {
                    limit:
                        Number(limit)
                }
            );


        let products =
            results.map(
                item => ({
                    ...item.product,

                    relevanceScore:
                        item.score,

                    source:
                        item.source
                })
            );


        if (
            String(explain)
                .toLowerCase() !==
            "false"
        ) {

            products =
                await generateAIRecommendationReason(
                    q,
                    products
                );
        }


        return res.json({

            success: true,

            message:
                "AI recommendations generated",

            mode:
                "public",

            query:
                q,

            count:
                products.length,

            aiExplanation:
                String(explain)
                    .toLowerCase() !==
                "false",

            data:
                products
        });

    } catch (error) {

        console.error(
            "AI recommendation error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message
        });
    }
};


module.exports = {
    semanticSearch:
        exports.semanticSearch,

    hybridSearch:
        exports.hybridSearch,

    aiRecommend:
        exports.aiRecommend
};
