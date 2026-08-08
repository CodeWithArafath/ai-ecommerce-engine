const getAIConfig = () => {
  return {
    apiKey:
      process.env.OPENAI_API_KEY ||
      process.env.AI_API_KEY ||
      "",

    baseURL:
      process.env.OPENAI_BASE_URL ||
      process.env.AI_BASE_URL ||
      undefined,

    embeddingModel:
      process.env.EMBEDDING_MODEL ||
      "text-embedding-3-small",

    chatModel:
      process.env.AI_MODEL ||
      "gpt-4o-mini",

    enabled:
      Boolean(
        process.env.OPENAI_API_KEY ||
        process.env.AI_API_KEY
      ),
  };
};

module.exports = {
  getAIConfig,
};
