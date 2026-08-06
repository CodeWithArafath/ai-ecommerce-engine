const embeddingService = require("./embeddingService");


class SemanticSearch {


    search(products,query){


        const queryVector =
        embeddingService.generateEmbedding(query);


        return products.map(product=>({

            product,

            similarity:
            Math.random()

        }))
        .sort((a,b)=>b.similarity-a.similarity);


    }


}


module.exports = new SemanticSearch();
