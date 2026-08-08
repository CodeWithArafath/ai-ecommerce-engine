const recommendationService =
  require("../services/recommendationService");

exports.personalized =
  async (req, res) => {
    try {
      const products =
        await recommendationService.getPersonalizedRecommendations(
          req.user.id,
          req.query.limit || 10
        );

      res.json({
        success: true,
        message:
          "Personalized recommendations generated",
        data: products,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

exports.trending =
  async (req, res) => {
    try {
      const products =
        await recommendationService.getTrendingProducts(
          req.query.limit || 10
        );

      res.json({
        success: true,
        message:
          "Trending products fetched",
        data: products,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

exports.similar =
  async (req, res) => {
    try {
      const products =
        await recommendationService.getSimilarProducts(
          req.params.productId,
          req.query.limit || 10
        );

      res.json({
        success: true,
        message:
          "Similar products fetched",
        data: products,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
