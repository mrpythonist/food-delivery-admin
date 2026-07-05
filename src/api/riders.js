import api from './axios';

export const getRiders = (params) => api.get('/riders', { params });
export const getRider = (id) => api.get(`/riders/${id}`);
export const createRider = (data) => api.post('/riders', data);
export const updateRider = (id, data) => api.put(`/riders/${id}`, data);
export const deleteRider = (id) => api.delete(`/riders/${id}`);
export const getRiderLocation = (id) => api.get(`/riders/${id}/location`);
export const getRiderOrders = (riderId) => api.get('/rider/orders', { params: { rider_id: riderId } });
