import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const path = window.location.pathname;
      if (
        path.startsWith('/admin') && 
        !path.startsWith('/admin/login') &&
        !path.startsWith('/admin/forgot-password') &&
        !path.startsWith('/admin/reset-password')
      ) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default instance;