const {
    getPersonalizedRecommendations
} =
require("../services/personalizedRecommendationService");


exports.personalizedRecommendations =
async (req, res) => {

    try {

        const {
            q,
            limit = 10
        } = req.query;


        const userId =
            req.user?.id ||
            req.user?._id;


        if (!userId) {
            return res.status(401).json({
                success: false,
                message:
                    "Authentication required"
            });
        }


        const result =
            await getPersonalizedRecommendations(
                userId,
                q || "",
                {
                    limit
                }
            );


        res.json({
            success: true,

            message:
                "Personalized recommendations generated",

            query:
                q || null,

            count:
                result.results.length,

            personalization:
                {
                    activityCount:
                        result.profile.activityCount,

                    preferredCategories:
                        result.profile
                        .preferredCategories,

                    preferredBrands:
                        result.profile
                        .preferredBrands,

                    averagePrice:
                        Number(
                            result.profile
                            .priceRange
                            .average
                            .toFixed(2)
                        )
                },

            data:
                result.results
        });

    } catch (error) {

        console.error(
            "Personalized recommendation error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
