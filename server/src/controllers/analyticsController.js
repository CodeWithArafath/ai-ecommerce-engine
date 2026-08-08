const analyticsService =
  require("../services/analyticsService");

exports.dashboard =
  async (req, res) => {
    try {
      const stats =
        await analyticsService.getDashboardStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

exports.salesByStatus =
  async (req, res) => {
    try {
      const data =
        await analyticsService.getSalesByStatus();

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

exports.topProducts =
  async (req, res) => {
    try {
      const data =
        await analyticsService.getTopProducts(
          req.query.limit || 10
        );

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
