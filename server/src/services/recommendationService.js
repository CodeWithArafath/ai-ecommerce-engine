const Product =
  require("../models/Product");

const UserActivity =
  require("../models/UserActivity");

const Wishlist =
  require("../models/Wishlist");

const Review =
  require("../models/Review");

const getTrendingProducts = async (
  limit = 10
) => {
  const activities =
    await UserActivity.aggregate([
      {
        $match: {
          createdAt: {
            $gte:
              new Date(
                Date.now() -
                  30 *
                    24 *
                    60 *
                    60 *
                    1000
              ),
          },
          product: {
            $ne: null,
          },
        },
      },

      {
        $group: {
          _id: "$product",

          views: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$type",
                    "view",
                  ],
                },
                1,
                0,
              ],
            },
          },

          carts: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$type",
                    "cart",
                  ],
                },
                1,
                0,
              ],
            },
          },

          purchases: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$type",
                    "purchase",
                  ],
                },
                1,
                0,
              ],
            },
          },

          wishlists: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$type",
                    "wishlist",
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },

      {
        $addFields: {
          score: {
            $add: [
              {
                $multiply: [
                  "$views",
                  1,
                ],
              },

              {
                $multiply: [
                  "$carts",
                  3,
                ],
              },

              {
                $multiply: [
                  "$wishlists",
                  4,
                ],
              },

              {
                $multiply: [
                  "$purchases",
                  10,
                ],
              },
            ],
          },
        },
      },

      {
        $sort: {
          score: -1,
        },
      },

      {
        $limit: Number(limit),
      },
    ]);

  const ids = activities.map(
    (item) => item._id
  );

  if (ids.length === 0) {
    return Product.find({
      stock: {
        $gt: 0,
      },
    })
      .sort({
        createdAt: -1,
      })
      .limit(Number(limit));
  }

  const products =
    await Product.find({
      _id: {
        $in: ids,
      },
    });

  const map = new Map(
    products.map(
      (product) => [
        product._id.toString(),
        product,
      ]
    )
  );

  return ids
    .map((id) =>
      map.get(id.toString())
    )
    .filter(Boolean);
};

const getSimilarProducts = async (
  productId,
  limit = 10
) => {
  const product =
    await Product.findById(
      productId
    );

  if (!product) {
    throw new Error(
      "Product not found"
    );
  }

  return Product.find({
    _id: {
      $ne: productId,
    },

    $or: [
      {
        category:
          product.category,
      },

      {
        brand:
          product.brand,
      },
    ],

    stock: {
      $gt: 0,
    },
  })
    .sort({
      createdAt: -1,
    })
    .limit(Number(limit));
};

const getPersonalizedRecommendations = async (
  userId,
  limit = 10
) => {
  const activities =
    await UserActivity.find({
      user: userId,
      product: {
        $ne: null,
      },
    })
      .sort({
        createdAt: -1,
      })
      .limit(100)
      .populate("product");

  const categoryScores = {};
  const brandScores = {};

  for (const activity of activities) {
    if (!activity.product) {
      continue;
    }

    const product =
      activity.product;

    let weight = 1;

    if (
      activity.type ===
      "purchase"
    ) {
      weight = 10;
    } else if (
      activity.type ===
      "cart"
    ) {
      weight = 5;
    } else if (
      activity.type ===
      "wishlist"
    ) {
      weight = 4;
    } else if (
      activity.type ===
      "view"
    ) {
      weight = 2;
    }

    categoryScores[
      product.category
    ] =
      (categoryScores[
        product.category
      ] || 0) + weight;

    brandScores[
      product.brand
    ] =
      (brandScores[
        product.brand
      ] || 0) + weight;
  }

  const categories =
    Object.entries(
      categoryScores
    )
      .sort(
        (a, b) => b[1] - a[1]
      )
      .slice(0, 5)
      .map(
        ([category]) =>
          category
      );

  const brands =
    Object.entries(
      brandScores
    )
      .sort(
        (a, b) => b[1] - a[1]
      )
      .slice(0, 5)
      .map(
        ([brand]) => brand
      );

  const viewedIds =
    activities
      .filter(
        (activity) =>
          activity.product
      )
      .map(
        (activity) =>
          activity.product._id
      );

  let products =
    await Product.find({
      _id: {
        $nin: viewedIds,
      },

      stock: {
        $gt: 0,
      },

      $or: [
        {
          category: {
            $in: categories,
          },
        },

        {
          brand: {
            $in: brands,
          },
        },
      ],
    }).limit(
      Number(limit) * 3
    );

  products.sort(
    (a, b) => {
      const score = (
        product
      ) => {
        let value = 0;

        if (
          categories.includes(
            product.category
          )
        ) {
          value +=
            categoryScores[
              product.category
            ] || 0;
        }

        if (
          brands.includes(
            product.brand
          )
        ) {
          value +=
            brandScores[
              product.brand
            ] || 0;
        }

        return value;
      };

      return (
        score(b) - score(a)
      );
    }
  );

  if (
    products.length <
    Number(limit)
  ) {
    const fallback =
      await Product.find({
        _id: {
          $nin: viewedIds,
        },

        stock: {
          $gt: 0,
        },
      })
        .sort({
          createdAt: -1,
        })
        .limit(
          Number(limit)
        );

    products = [
      ...products,
      ...fallback,
    ];
  }

  const seen = new Set();

  return products
    .filter((product) => {
      const id =
        product._id.toString();

      if (seen.has(id)) {
        return false;
      }

      seen.add(id);
      return true;
    })
    .slice(
      0,
      Number(limit)
    );
};

module.exports = {
  getTrendingProducts,
  getSimilarProducts,
  getPersonalizedRecommendations,
};
