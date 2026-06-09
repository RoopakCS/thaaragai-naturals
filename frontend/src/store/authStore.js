import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosInstance from '../utils/axiosInstance';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (userData) => set({ user: userData, isAuthenticated: true }),
      logout: async () => {
        try {
          await axiosInstance.post('/api/auth/logout');
        } catch (e) {
          console.error('Logout failed:', e);
        } finally {
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'thaaragai-auth',
    }
  )
);
