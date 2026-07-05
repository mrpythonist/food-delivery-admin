import api from './axios';

export const loginRequest = (email, password) => {
  return api.post('/login', {
    email,
    password
  });
};

export const getMe = () => {
  return api.get('/me');
};

export const logoutRequest = () => {
  return api.post('/logout');
};
