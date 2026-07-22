import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Vite proxy will forward this to http://localhost:8080/api
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to automatically inject the JWT token
api.interceptors.request.use(
  (config) => {
    // Prioritize sessionStorage (current session) over localStorage (persisted)
    const userStr = sessionStorage.getItem('auctxi_user') || localStorage.getItem('auctxi_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (e) {
        console.error('Error parsing user from storage', e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Response interceptor for global error handling (e.g., 401 Unauthorized or 403 Forbidden)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error('API Error 401/403: ', error.response.data);
      console.error('Clearing auth storage and redirecting to login');
      
      // Token might be expired or invalid. Clear storage and redirect to login.
      localStorage.removeItem('auctxi_user');
      sessionStorage.removeItem('auctxi_user');
      
      // Only redirect if we are not already on the login page
      if (window.location.pathname !== '/auth/login' && window.location.pathname !== '/auth/signup') {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
