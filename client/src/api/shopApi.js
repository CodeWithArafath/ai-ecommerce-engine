import api from "./api";

const userId = () =>
    localStorage.getItem("userId") || undefined;

const withUser = (data = {}) => ({
    ...data,
    ...(userId() ? { userId: userId() } : {})
});

export const getCart = async () => {
    const response = await api.get("/shop/cart", {
        params: userId() ? { userId: userId() } : {}
    });

    return response.data;
};

export const addToCart = async (productId, quantity = 1) => {
    const response = await api.post(
        "/shop/cart",
        withUser({ productId, quantity })
    );

    return response.data;
};

export const updateCartItem = async (productId, quantity) => {
    const response = await api.patch(
        `/shop/cart/${productId}`,
        withUser({ quantity })
    );

    return response.data;
};

export const removeCartItem = async (productId) => {
    const response = await api.delete(
        `/shop/cart/${productId}`,
        {
            data: withUser({})
        }
    );

    return response.data;
};

export const getWishlist = async () => {
    const response = await api.get("/shop/wishlist", {
        params: userId() ? { userId: userId() } : {}
    });

    return response.data;
};

export const addWishlist = async (productId) => {
    const response = await api.post(
        `/shop/wishlist/${productId}`,
        withUser({})
    );

    return response.data;
};

export const removeWishlist = async (productId) => {
    const response = await api.delete(
        `/shop/wishlist/${productId}`,
        {
            data: withUser({})
        }
    );

    return response.data;
};

export const checkout = async (data) => {
    const response = await api.post(
        "/shop/checkout",
        withUser(data)
    );

    return response.data;
};

export const getOrders = async () => {
    const response = await api.get("/shop/orders", {
        params: userId() ? { userId: userId() } : {}
    });

    return response.data;
};

export const getOrder = async (id) => {
    const response = await api.get(`/shop/orders/${id}`, {
        params: userId() ? { userId: userId() } : {}
    });

    return response.data;
};
