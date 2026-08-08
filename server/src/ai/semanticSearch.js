const {
    semanticSearch
} = require("./services/semanticSearchService");

class SemanticSearch {

    async search(query, options = {}) {
        return semanticSearch(query, options);
    }

}

module.exports = new SemanticSearch();
