import api from './axios';

export const getNotifications = (params) => api.get('/notifications', { params });
export const getNotification = (id) => api.get(`/notifications/${id}`);
export const markNotificationAsRead = (id) => api.post(`/notifications/${id}/read`);
export const markAllNotificationsAsRead = () => api.post('/notifications/read-all');
export const deleteNotification = (id) => api.delete(`/notifications/${id}`);
export const getUnreadNotificationCount = () => api.get('/notifications/unread-count');
