import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';

export const useWishlistStore = create((set, get) => ({
  items: [],
  loading: false,

  fetchWishlist: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get('/api/auth/wishlist');
      set({ items: response.data, loading: false });
    } catch (error) {
      console.error('Failed to fetch wishlist', error);
      set({ loading: false });
    }
  },

  toggleWishlist: async (productId) => {
    try {
      const response = await axiosInstance.post(`/api/auth/wishlist/${productId}`);
      set({ items: response.data });
    } catch (error) {
      console.error('Failed to toggle wishlist', error);
      throw error;
    }
  },

  isInWishlist: (productId) => {
    const { items } = get();
    return items.some(item => item._id === productId);
  },

  clearWishlist: () => set({ items: [] }),
}));
