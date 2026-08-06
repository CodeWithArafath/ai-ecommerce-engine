class RecommendationEngine {


    getRecommendations(product){


        return {

            basedOn:
            product.category,

            recommendations:[
                "Similar products",
                "Frequently bought items",
                "Trending products"
            ]

        };


    }


}


module.exports = new RecommendationEngine();
