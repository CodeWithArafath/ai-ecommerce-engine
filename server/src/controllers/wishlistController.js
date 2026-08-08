const wishlistService =
  require("../services/wishlistService");

exports.getWishlist =
  async (req, res) => {
    try {
      const wishlist =
        await wishlistService.getWishlist(
          req.user.id
        );

      res.json({
        success: true,
        message:
          "Wishlist fetched successfully",
        data: wishlist,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

exports.addToWishlist =
  async (req, res) => {
    try {
      const {
        productId,
      } = req.body;

      if (!productId) {
        return res.status(400).json({
          success: false,
          message:
            "productId is required",
        });
      }

      const wishlist =
        await wishlistService.addToWishlist(
          req.user.id,
          productId
        );

      res.status(201).json({
        success: true,
        message:
          "Product added to wishlist",
        data: wishlist,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

exports.removeFromWishlist =
  async (req, res) => {
    try {
      const wishlist =
        await wishlistService.removeFromWishlist(
          req.user.id,
          req.params.productId
        );

      res.json({
        success: true,
        message:
          "Product removed from wishlist",
        data: wishlist,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
