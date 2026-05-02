import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('suivlima_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Flag pour éviter les boucles infinies de refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  isRefreshing = false;
  failedQueue = [];
};

// Intercepteur générique pour gérer les erreurs et les 401
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = Cookies.get('suivlima_refresh_token');
      if (refreshToken) {
        return axios
          .post(`${API_URL}/auth/refresh`, { refreshToken })
          .then(response => {
            const { token, refreshToken: newRefreshToken } = response.data.data;
            Cookies.set('suivlima_token', token, { expires: 7 });
            Cookies.set('suivlima_refresh_token', newRefreshToken, { expires: 30 });
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            processQueue(null, token);
            return api(originalRequest);
          })
          .catch(err => {
            processQueue(err, null);
            Cookies.remove('suivlima_token');
            Cookies.remove('suivlima_refresh_token');
            // Redirection vers login gérée au niveau composant/middleware
            return Promise.reject(err);
          });
      } else {
        Cookies.remove('suivlima_token');
        Cookies.remove('suivlima_refresh_token');
        processQueue(error, null);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
