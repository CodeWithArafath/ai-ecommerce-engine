const User =
  require("../models/User");

const Product =
  require("../models/Product");

const Order =
  require("../models/Order");

const Review =
  require("../models/Review");

const UserActivity =
  require("../models/UserActivity");

const getDashboardStats = async () => {
  const [
    users,
    products,
    orders,
    reviews,
    activities,
    revenueResult,
  ] = await Promise.all([
    User.countDocuments(),

    Product.countDocuments(),

    Order.countDocuments(),

    Review.countDocuments(),

    UserActivity.countDocuments(),

    Order.aggregate([
      {
        $match: {
          status: {
            $ne: "cancelled",
          },
        },
      },

      {
        $group: {
          _id: null,

          revenue: {
            $sum: "$totalAmount",
          },

          totalItems: {
            $sum: {
              $sum:
                "$items.quantity",
            },
          },
        },
      },
    ]),
  ]);

  return {
    users,
    products,
    orders,
    reviews,
    activities,

    revenue:
      revenueResult[0]?.revenue ||
      0,

    totalItemsSold:
      revenueResult[0]?.totalItems ||
      0,
  };
};

const getSalesByStatus =
  async () => {
    return Order.aggregate([
      {
        $group: {
          _id: "$status",

          count: {
            $sum: 1,
          },

          revenue: {
            $sum: "$totalAmount",
          },
        },
      },

      {
        $sort: {
          count: -1,
        },
      },
    ]);
  };

const getTopProducts =
  async (limit = 10) => {
    const result =
      await Order.aggregate([
        {
          $match: {
            status: {
              $ne: "cancelled",
            },
          },
        },

        {
          $unwind: "$items",
        },

        {
          $group: {
            _id:
              "$items.product",

            name: {
              $first:
                "$items.name",
            },

            quantity: {
              $sum:
                "$items.quantity",
            },

            revenue: {
              $sum:
                "$items.subtotal",
            },
          },
        },

        {
          $sort: {
            quantity: -1,
          },
        },

        {
          $limit:
            Number(limit),
        },
      ]);

    return result;
  };

module.exports = {
  getDashboardStats,
  getSalesByStatus,
  getTopProducts,
};
