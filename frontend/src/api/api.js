import axios from 'axios';

const api = axios.create({
  headers: {
    Authorization: `Bearer ${JSON.parse(localStorage.getItem('userId'))?.token}`,
  },
});

export default api;