const UserActivity = require("../models/UserActivity");

const buildUserProfile = async (userId) => {
    if (!userId) {
        return {
            categories: {},
            brands: {},
            priceRange: {
                min: 0,
                max: 0,
                average: 0
            },
            interests: [],
            activityCount: 0
        };
    }

    const activities = await UserActivity.find({
        user: userId
    })
    .sort({
        createdAt: -1
    })
    .limit(200)
    .populate("product")
    .lean();

    const categories = {};
    const brands = {};

    let totalPrice = 0;
    let priceCount = 0;

    const weights = {
        view: 1,
        search: 2,
        wishlist: 4,
        cart: 5,
        purchase: 8,
        review: 6
    };

    for (const activity of activities) {
        const weight =
            weights[activity.type] || 1;

        if (activity.product) {
            const product =
                activity.product;

            if (product.category) {
                categories[product.category] =
                    (categories[product.category] || 0)
                    + weight;
            }

            if (product.brand) {
                brands[product.brand] =
                    (brands[product.brand] || 0)
                    + weight;
            }

            if (Number.isFinite(Number(product.price))) {
                totalPrice += Number(product.price);
                priceCount++;
            }
        }
    }

    const categoryEntries =
        Object.entries(categories)
        .sort((a, b) => b[1] - a[1]);

    const brandEntries =
        Object.entries(brands)
        .sort((a, b) => b[1] - a[1]);

    const interests =
        categoryEntries
        .slice(0, 10)
        .map(([name, score]) => ({
            name,
            score
        }));

    return {
        categories,
        brands,

        priceRange: {
            min: priceCount
                ? Math.max(0, (totalPrice / priceCount) * 0.5)
                : 0,

            max: priceCount
                ? (totalPrice / priceCount) * 1.5
                : 0,

            average: priceCount
                ? totalPrice / priceCount
                : 0
        },

        interests,

        preferredCategories:
            categoryEntries
            .slice(0, 5)
            .map(([name]) => name),

        preferredBrands:
            brandEntries
            .slice(0, 5)
            .map(([name]) => name),

        activityCount:
            activities.length
    };
};


/* ============================================================
   PERSONALIZATION SCORE
   ============================================================ */

const calculatePersonalizationScore = (
    product,
    profile
) => {
    if (!profile || !product) {
        return 0;
    }

    let score = 0;

    const categoryScore =
        profile.categories?.[
            product.category
        ] || 0;

    const brandScore =
        profile.brands?.[
            product.brand
        ] || 0;

    /*
     * Normalize activity signals.
     */
    score +=
        Math.min(categoryScore / 20, 1) * 0.55;

    score +=
        Math.min(brandScore / 20, 1) * 0.30;

    /*
     * Price preference.
     */
    const averagePrice =
        Number(
            profile.priceRange?.average
        ) || 0;

    const productPrice =
        Number(product.price) || 0;

    if (
        averagePrice > 0 &&
        productPrice > 0
    ) {
        const difference =
            Math.abs(
                productPrice -
                averagePrice
            ) / averagePrice;

        const pricePreference =
            Math.max(
                0,
                1 - difference
            );

        score +=
            pricePreference * 0.15;
    }

    return Math.min(
        Math.max(score, 0),
        1
    );
};


/* ============================================================
   EXPLANATION
   ============================================================ */

const getPersonalizationReason = (
    product,
    profile
) => {
    if (!profile) {
        return "Recommended based on product relevance.";
    }

    const categoryMatch =
        Boolean(
            profile.preferredCategories
            ?.includes(product.category)
        );

    const brandMatch =
        Boolean(
            profile.preferredBrands
            ?.includes(product.brand)
        );

    if (categoryMatch && brandMatch) {
        return "Recommended because it matches your preferred category and brand.";
    }

    if (categoryMatch) {
        return "Recommended because it matches categories you frequently interact with.";
    }

    if (brandMatch) {
        return "Recommended because you frequently interact with this brand.";
    }

    if (
        profile.priceRange?.average &&
        product.price
    ) {
        const difference =
            Math.abs(
                Number(product.price) -
                profile.priceRange.average
            ) /
            profile.priceRange.average;

        if (difference < 0.25) {
            return "Recommended because its price is close to your typical shopping range.";
        }
    }

    return "Recommended based on your recent activity and product relevance.";
};


module.exports = {
    buildUserProfile,
    calculatePersonalizationScore,
    getPersonalizationReason
};
