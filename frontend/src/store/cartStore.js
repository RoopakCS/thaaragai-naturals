import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';

export const useCartStore = create((set, get) => ({
  items: [],
  loading: false,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get('/api/cart');
      set({ items: response.data.items || [], loading: false });
    } catch (error) {
      console.error('Error fetching cart:', error);
      set({ items: [], loading: false });
    }
  },

  addItem: async (product, quantity = 1) => {
    set({ loading: true });
    try {
      await axiosInstance.post('/api/cart/add', {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        weight: product.weight
      });
      await get().fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      set({ loading: false });
    }
  },

  removeItem: async (productId) => {
    set({ loading: true });
    try {
      await axiosInstance.delete(`/api/cart/remove/${productId}`);
      await get().fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
      set({ loading: false });
    }
  },

  updateQuantity: async (productId, qty) => {
    set({ loading: true });
    try {
      await axiosInstance.put('/api/cart/update', { productId, quantity: qty });
      await get().fetchCart();
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      set({ loading: false });
    }
  },

  clearCart: async () => {
    set({ loading: true });
    try {
      await axiosInstance.delete('/api/cart/clear');
      await get().fetchCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
      set({ loading: false });
    }
  },

  get totalItems() {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
  
  get totalPrice() {
    return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}));
