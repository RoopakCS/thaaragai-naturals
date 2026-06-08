import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  try {
    const authData = localStorage.getItem('thaaragai-auth');
    if (authData) {
      const parsedData = JSON.parse(authData);
      const token = parsedData?.state?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.error('Error reading auth token from localStorage', error);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
