const OpenAI = require("openai");
const {
  getAIConfig,
} = require("./aiConfig");

let client = null;

const getAIClient = () => {
  const config = getAIConfig();

  if (!config.enabled) {
    return null;
  }

  if (!client) {
    client = new OpenAI({
      apiKey: config.apiKey,

      ...(config.baseURL
        ? {
            baseURL:
              config.baseURL,
          }
        : {}),
    });
  }

  return client;
};

module.exports = {
  getAIClient,
};
