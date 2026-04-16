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

// Intercepteur générique pour gérer les erreurs, notamment les 401 (non authentifié)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Si on reçoit un 401, on déconnecte l'utilisateur
      // (On pourrait aussi essayer de rafraîchir le token si on avait implémenté un système de refresh token)
      Cookies.remove('suivlima_token');
      // On évite la redirection directe ici dans l'instance axios pour ne pas causer de boucles,
      // la logique de redirection est généralement gérée côté composant ou middleware.
    }
    return Promise.reject(error);
  }
);

export default api;
