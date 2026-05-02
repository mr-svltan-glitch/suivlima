import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import api from '../lib/api';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      login: async (email, mot_de_passe) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/login', { email, mot_de_passe });
          const { user, token, refreshToken } = response.data.data;
          
          Cookies.set('suivlima_token', token, { expires: 7 });
          Cookies.set('suivlima_refresh_token', refreshToken, { expires: 30 });
          
          set({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { 
            success: false, 
            error: error.response?.data?.message || 'Erreur lors de la connexion' 
          };
        }
      },

      register: async (nom, email, mot_de_passe, role = 'commercial') => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/register', { nom, email, mot_de_passe, role });
          const { user, token, refreshToken } = response.data.data;
          
          Cookies.set('suivlima_token', token, { expires: 7 });
          Cookies.set('suivlima_refresh_token', refreshToken, { expires: 30 });
          
          set({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { 
            success: false, 
            error: error.response?.data?.message || 'Erreur lors de l\'inscription' 
          };
        }
      },

      logout: () => {
        Cookies.remove('suivlima_token');
        Cookies.remove('suivlima_refresh_token');
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
      },

      setAuth: (user, token, refreshToken = null) => {
        set({ user, token, refreshToken, isAuthenticated: !!token });
      },

      // Initialiser l'auth depuis les cookies au chargement
      initAuth: async () => {
        const token = Cookies.get('suivlima_token');
        if (token) {
          try {
            const response = await api.get('/auth/profile');
            const { user } = response.data.data;
            set({ user, token, isAuthenticated: true });
          } catch (error) {
            Cookies.remove('suivlima_token');
            Cookies.remove('suivlima_refresh_token');
            set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
          }
        }
      },
    }),
    {
      name: 'suivlima-auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;
