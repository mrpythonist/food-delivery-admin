import api from './axios';

export const getOrders = (params) => api.get('/orders', { params });

export const getOrder = (id) => api.get(`/orders/${id}`);

export const updateOrderStatus = (id, status) =>
  api.patch(`/orders/${id}/status`, {
    status
  });

export const updateOrderPayment = (id, status) => api.patch(`/orders/${id}/payment`, status);

export const createOrder = (data, { isMultipart = false } = {}) =>
  api.post('/orders', data, isMultipart ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined);

export const assignRider = (id, rider_id) =>
  api.patch(`/orders/${id}/assign-rider`, {
    rider_id
  });

export const getTimeline = (id) => api.get(`/orders/${id}/timeline`);
