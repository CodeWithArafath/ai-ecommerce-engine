import api from "./client";

export const getProducts = (params = {}) =>
  api.get("/products", { params });

export const getProduct = (id) =>
  api.get(`/products/${id}`);

export const searchProducts = (q, params = {}) =>
  api.get("/ai/search", {
    params: {
      q,
      ...params,
    },
  });

export const getRecommendations = (params = {}) =>
  api.get("/ai/recommendations", { params });
