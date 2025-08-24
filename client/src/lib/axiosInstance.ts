import axios from 'axios';

const BASE_URL=import.meta.env.BASE_URL;
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", 
  withCredentials: true
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('authToken');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
