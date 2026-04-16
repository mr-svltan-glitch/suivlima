import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import api from '../lib/api';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      login: async (email, mot_de_passe) => {
        set({ isLoading: true });
        try {
          // --- MODE DÉMO SANS BACKEND ---
          // Simule une requête serveur avec un petit délai
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const fakeUser = { nom: 'Demo Suivlima', email: email, role: 'admin' };
          const fakeToken = 'fake-token-demo-bypass';
          
          Cookies.set('suivlima_token', fakeToken, { expires: 7 });
          
          set({
            user: fakeUser,
            token: fakeToken,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true };
          // ------------------------------
          
          /* CODE RÉEL COMMENTÉ TEMPORAIREMENT
          const response = await api.post('/auth/login', { email, mot_de_passe });
          const { user, token } = response.data.data;
          
          Cookies.set('suivlima_token', token, { expires: 7 });
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true };
          */
        } catch (error) {
          set({ isLoading: false });
          return { 
            success: false, 
            error: error.response?.data?.message || 'Erreur lors de la connexion' 
          };
        }
      },

      logout: () => {
        Cookies.remove('suivlima_token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      setAuth: (user, token) => {
        set({ user, token, isAuthenticated: !!token });
      },
    }),
    {
      name: 'suivlima-auth-storage', // name of the item in the storage (must be unique)
      // On sauvegarde uniquement l'utilisateur (le token est dans les cookies pour l'API)
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;
