import axios from 'axios';

const api = axios.create();

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('userId'));

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

export default api;