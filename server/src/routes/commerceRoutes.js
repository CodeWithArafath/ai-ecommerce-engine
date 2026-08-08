const express = require("express");

const Cart = require("../models/Cart");
const Wishlist = require("../models/Wishlist");
const Order = require("../models/Order");
const Product = require("../models/Product");

const router = express.Router();

const getUserId = req =>
    req.user?._id ||
    req.user?.id ||
    req.body?.userId ||
    req.query?.userId;

const requireUser = (req, res) => {

    const userId = getUserId(req);

    if (!userId) {
        res.status(401).json({
            success: false,
            message:
                "Authentication required. Provide a valid JWT."
        });

        return null;
    }

    return userId;
};

/*
=========================================================
CART
=========================================================
*/

router.get("/cart", async (req, res) => {

    try {

        const userId = requireUser(req, res);

        if (!userId) return;

        let cart =
            await Cart.findOne({
                user: userId
            })
            .populate("items.product")
            .lean();

        if (!cart) {
            cart = {
                user: userId,
                items: []
            };
        }

        const total =
            cart.items.reduce(
                (sum, item) =>
                    sum +
                    Number(
                        item.product?.price || 0
                    ) *
                    Number(
                        item.quantity || 0
                    ),
                0
            );

        return res.json({
            success: true,
            cart,
            total: Number(
                total.toFixed(2)
            )
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Unable to fetch cart",
            error: error.message
        });
    }
});

router.post("/cart", async (req, res) => {

    try {

        const userId = requireUser(req, res);

        if (!userId) return;

        const {
            productId,
            quantity = 1
        } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "productId is required"
            });
        }

        const product =
            await Product.findById(
                productId
            );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (
            Number(product.stock || 0) <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Product is out of stock"
            });
        }

        const qty =
            Math.max(
                Number(quantity) || 1,
                1
            );

        let cart =
            await Cart.findOne({
                user: userId
            });

        if (!cart) {
            cart = new Cart({
                user: userId,
                items: []
            });
        }

        const existing =
            cart.items.find(
                item =>
                    item.product.toString() ===
                    productId.toString()
            );

        if (existing) {
            existing.quantity += qty;
        } else {
            cart.items.push({
                product: productId,
                quantity: qty
            });
        }

        await cart.save();

        await cart.populate(
            "items.product"
        );

        return res.status(201).json({
            success: true,
            message: "Product added to cart",
            cart
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Unable to update cart",
            error: error.message
        });
    }
});

router.patch("/cart/:productId", async (req, res) => {

    try {

        const userId = requireUser(req, res);

        if (!userId) return;

        const quantity =
            Math.max(
                Number(req.body.quantity) || 1,
                1
            );

        const cart =
            await Cart.findOne({
                user: userId
            });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        const item =
            cart.items.find(
                entry =>
                    entry.product.toString() ===
                    req.params.productId
            );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Product not in cart"
            });
        }

        item.quantity = quantity;

        await cart.save();

        return res.json({
            success: true,
            cart
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Unable to update quantity",
            error: error.message
        });
    }
});

router.delete(
    "/cart/:productId",
    async (req, res) => {

        try {

            const userId =
                requireUser(req, res);

            if (!userId) return;

            const cart =
                await Cart.findOne({
                    user: userId
                });

            if (!cart) {
                return res.status(404).json({
                    success: false,
                    message: "Cart not found"
                });
            }

            cart.items =
                cart.items.filter(
                    item =>
                        item.product.toString() !==
                        req.params.productId
                );

            await cart.save();

            return res.json({
                success: true,
                message:
                    "Product removed from cart",
                cart
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message:
                    "Unable to remove product",
                error: error.message
            });
        }
    }
);

/*
=========================================================
WISHLIST
=========================================================
*/

router.get("/wishlist", async (req, res) => {

    try {

        const userId =
            requireUser(req, res);

        if (!userId) return;

        const wishlist =
            await Wishlist.findOne({
                user: userId
            })
            .populate("products")
            .lean();

        return res.json({
            success: true,
            wishlist:
                wishlist || {
                    user: userId,
                    products: []
                }
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message:
                "Unable to fetch wishlist",
            error: error.message
        });
    }
});

router.post(
    "/wishlist/:productId",
    async (req, res) => {

        try {

            const userId =
                requireUser(req, res);

            if (!userId) return;

            const product =
                await Product.findById(
                    req.params.productId
                );

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            let wishlist =
                await Wishlist.findOne({
                    user: userId
                });

            if (!wishlist) {
                wishlist =
                    new Wishlist({
                        user: userId,
                        products: []
                    });
            }

            const exists =
                wishlist.products.some(
                    id =>
                        id.toString() ===
                        req.params.productId
                );

            if (!exists) {
                wishlist.products.push(
                    req.params.productId
                );
            }

            await wishlist.save();

            return res.json({
                success: true,
                message:
                    "Product added to wishlist",
                wishlist
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message:
                    "Unable to update wishlist",
                error: error.message
            });
        }
    }
);

router.delete(
    "/wishlist/:productId",
    async (req, res) => {

        try {

            const userId =
                requireUser(req, res);

            if (!userId) return;

            const wishlist =
                await Wishlist.findOne({
                    user: userId
                });

            if (!wishlist) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Wishlist not found"
                });
            }

            wishlist.products =
                wishlist.products.filter(
                    id =>
                        id.toString() !==
                        req.params.productId
                );

            await wishlist.save();

            return res.json({
                success: true,
                message:
                    "Product removed from wishlist",
                wishlist
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message:
                    "Unable to update wishlist",
                error: error.message
            });
        }
    }
);

/*
=========================================================
CHECKOUT
=========================================================
*/

router.post("/checkout", async (req, res) => {

    try {

        const userId =
            requireUser(req, res);

        if (!userId) return;

        const cart =
            await Cart.findOne({
                user: userId
            })
            .populate("items.product");

        if (
            !cart ||
            cart.items.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        const orderItems = [];
        let total = 0;

        for (const item of cart.items) {

            const product =
                item.product;

            if (!product) {
                return res.status(400).json({
                    success: false,
                    message:
                        "A product in the cart no longer exists"
                });
            }

            const quantity =
                Number(item.quantity);

            const stock =
                Number(product.stock || 0);

            if (stock < quantity) {
                return res.status(400).json({
                    success: false,
                    message:
                        `${product.name} has insufficient stock`
                });
            }

            const price =
                Number(product.price || 0);

            total +=
                price * quantity;

            orderItems.push({
                product: product._id,
                name: product.name,
                price,
                quantity
            });
        }

        const order =
            await Order.create({
                user: userId,
                items: orderItems,
                total: Number(
                    total.toFixed(2)
                ),
                paymentMethod:
                    req.body.paymentMethod ||
                    "cod",
                shippingAddress:
                    req.body.shippingAddress ||
                    {}
            });

        for (const item of cart.items) {

            await Product.updateOne(
                {
                    _id:
                        item.product._id
                },
                {
                    $inc: {
                        stock:
                            -Number(
                                item.quantity
                            )
                    }
                }
            );
        }

        cart.items = [];

        await cart.save();

        return res.status(201).json({
            success: true,
            message:
                "Order created successfully",
            order
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message:
                "Checkout failed",
            error: error.message
        });
    }
});

/*
=========================================================
ORDERS
=========================================================
*/

router.get("/orders", async (req, res) => {

    try {

        const userId =
            requireUser(req, res);

        if (!userId) return;

        const orders =
            await Order.find({
                user: userId
            })
            .populate(
                "items.product",
                "name images"
            )
            .sort({
                createdAt: -1
            })
            .lean();

        return res.json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message:
                "Unable to fetch orders",
            error: error.message
        });
    }
});

router.get(
    "/orders/:id",
    async (req, res) => {

        try {

            const userId =
                requireUser(req, res);

            if (!userId) return;

            const order =
                await Order.findOne({
                    _id: req.params.id,
                    user: userId
                })
                .populate(
                    "items.product",
                    "name images"
                )
                .lean();

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Order not found"
                });
            }

            return res.json({
                success: true,
                order
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message:
                    "Unable to fetch order",
                error: error.message
            });
        }
    }
);

module.exports = router;
