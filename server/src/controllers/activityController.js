const activityService =
  require("../services/activityService");

exports.track =
  async (req, res) => {
    try {
      const {
        type,
        productId,
        searchQuery,
        metadata,
      } = req.body;

      const allowed = [
        "view",
        "search",
        "wishlist",
        "cart",
        "purchase",
        "review",
      ];

      if (!allowed.includes(type)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid activity type",
        });
      }

      const activity =
        await activityService.trackActivity(
          req.user.id,
          type,
          productId,
          searchQuery,
          metadata
        );

      res.status(201).json({
        success: true,
        data: activity,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

exports.recentlyViewed =
  async (req, res) => {
    try {
      const products =
        await activityService.getRecentlyViewed(
          req.user.id,
          req.query.limit || 10
        );

      res.json({
        success: true,
        data: products,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

exports.activities =
  async (req, res) => {
    try {
      const activities =
        await activityService.getUserActivities(
          req.user.id,
          req.query.limit || 50
        );

      res.json({
        success: true,
        data: activities,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
