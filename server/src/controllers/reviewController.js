const reviewService =
  require("../services/reviewService");

exports.createReview =
  async (req, res) => {
    try {
      const {
        rating,
        title,
        comment,
      } = req.body;

      if (
        rating === undefined ||
        Number(rating) < 1 ||
        Number(rating) > 5
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Rating must be between 1 and 5",
        });
      }

      const review =
        await reviewService.createReview(
          req.user.id,
          req.params.productId,
          Number(rating),
          title,
          comment
        );

      res.status(201).json({
        success: true,
        message:
          "Review created successfully",
        data: review,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

exports.getReviews =
  async (req, res) => {
    try {
      const reviews =
        await reviewService.getProductReviews(
          req.params.productId
        );

      const rating =
        await reviewService.getProductRating(
          req.params.productId
        );

      res.json({
        success: true,
        data: {
          reviews,
          rating,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
