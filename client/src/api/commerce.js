import api from "./client";

export const getCart = () =>
  api.get("/cart");

export const addToCart = (data) =>
  api.post("/cart", data);

export const updateCart = (id, data) =>
  api.put(`/cart/${id}`, data);

export const removeFromCart = (id) =>
  api.delete(`/cart/${id}`);

export const getOrders = () =>
  api.get("/orders");

export const createOrder = (data) =>
  api.post("/orders", data);
