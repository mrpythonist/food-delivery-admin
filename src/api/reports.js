import api from './axios';

export const getStats = (params) => api.get('/reports/stats', { params });
export const getTopProducts = (params) => api.get('/reports/top-products', { params });
export const getSalesSummary = (params) => api.get('/reports/sales-summary', { params });
export const getOrdersByStatus = (params) => api.get('/reports/orders-by-status', { params });
