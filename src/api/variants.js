import api from './axios';

export const createVariant = (data) => api.post('/variants', data);
export const updateVariant = (id, data) => api.put(`/variants/${id}`, data);
export const deleteVariant = (id) => api.delete(`/variants/${id}`);
