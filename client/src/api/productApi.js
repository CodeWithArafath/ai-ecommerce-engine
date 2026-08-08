import api from "./api";

export const getProducts = async (params = {}) => {
    const response = await api.get("/products", { params });
    return response.data;
};

export const getProduct = async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};

export const aiSearch = async (query, limit = 20) => {
    const response = await api.get("/ai/search", {
        params: { q: query, limit }
    });

    return response.data;
};

export const getRecommendations = async (limit = 12, query = "") => {
    const response = await api.get("/ai/recommendations", {
        params: { limit, q: query }
    });

    return response.data;
};
