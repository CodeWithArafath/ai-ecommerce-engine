class EmbeddingService {

    generateEmbedding(text){

        // Placeholder for OpenAI / HuggingFace embeddings

        const vector = text
        .split("")
        .map(char => char.charCodeAt(0));

        return vector;

    }


}


module.exports = new EmbeddingService();
