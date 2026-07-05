import api from './axios';

export const getAbandonedCarts = (params) => api.get('/cart/abandoned', { params });
