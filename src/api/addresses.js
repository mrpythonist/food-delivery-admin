import api from './axios';

export const getAddresses = (params) => api.get('/addresses', { params });
export const getAddress = (id) => api.get(`/addresses/${id}`);
export const createAddress = (data) => api.post('/addresses', data);
export const updateAddress = (id, data) => api.put(`/addresses/${id}`, data);
export const deleteAddress = (id) => api.delete(`/addresses/${id}`);
