const {
    rankProducts
} = require("./services/recommendationRankingService");

class RecommendationEngine {

    getRecommendations(products, options = {}) {

        if (!Array.isArray(products)) {
            return [];
        }

        return rankProducts(
            products,
            options
        );
    }

}

module.exports =
    new RecommendationEngine();
