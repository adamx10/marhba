import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  restoreSession: async () => {
    set({ isLoading: true });
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        const response = await api.get('/auth/me');
        set({
          user: response.data.user,
          token,
          isAuthenticated: true,
        });
      } else {
        set({ isAuthenticated: false });
      }
    } catch (error) {
      console.error('Session restoration failed:', error);
      await SecureStore.deleteItemAsync('token');
      set({ user: null, token: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (fullName, email, password) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/auth/register', { fullName, email, password });
      const { token, user } = response.data;
      await SecureStore.setItemAsync('token', token);
      set({ user, token, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      await SecureStore.setItemAsync('token', token);
      set({ user, token, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await SecureStore.deleteItemAsync('token');
      set({ user: null, token: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));
