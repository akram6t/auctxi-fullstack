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
          if (config.headers && typeof config.headers.set === 'function') {
            config.headers.set('Authorization', `Bearer ${user.token}`);
          } else {
            config.headers.Authorization = `Bearer ${user.token}`;
          }
          console.log(`[API] Sending request to ${config.url} with token: ${user.token.substring(0, 10)}...`);
        } else {
          console.log(`[API] Sending request to ${config.url} WITHOUT token (no token in storage)`);
        }
      } catch (e) {
        console.error('Error parsing user from storage', e);
      }
    } else {
      console.log(`[API] Sending request to ${config.url} WITHOUT token (no user in storage)`);
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
      console.error('Clearing auth storage due to invalid token.');
      
      // Token might be expired or invalid. Clear storage.
      localStorage.removeItem('auctxi_user');
      sessionStorage.removeItem('auctxi_user');
      
      // Instead of forcing a hard reload, we can trigger a custom event or just let the React components handle it
      window.dispatchEvent(new Event('auth-error'));
    }
    return Promise.reject(error);
  }
);

export default api;
