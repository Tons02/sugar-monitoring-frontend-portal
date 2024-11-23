import axios from "axios";

const ENDPOINT = import.meta.env.VITE_SUGAR_MONITORING_ENDPOINT;
const API = axios.create({
    baseURL:ENDPOINT,
    headers: {
        "Content-Type":"application/json",
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    }
})

// Add interceptor to dynamically update token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;