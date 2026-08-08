const {
  getAIConfig,
} = require("../aiConfig");

exports.status =
  async (req, res) => {
    const config =
      getAIConfig();

    res.json({
      success: true,

      data: {
        enabled:
          config.enabled,

        embeddingModel:
          config.embeddingModel,

        chatModel:
          config.chatModel,

        providerConfigured:
          Boolean(
            config.apiKey
          ),
      },
    });
  };
