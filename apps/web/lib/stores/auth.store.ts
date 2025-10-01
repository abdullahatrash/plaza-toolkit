import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SessionUser } from '@workspace/types/api';

interface AuthState {
  user: SessionUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: SessionUser | null) => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false
        });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      login: async (email, password) => {
        try {
          set({ isLoading: true });

          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include',
          });

          const data = await response.json();

          if (!response.ok || !data.success) {
            throw new Error(data.error || 'Login failed');
          }

          set({
            user: data.data.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true });

          await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
          });

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          console.error('Logout error:', error);
        }
      },

      checkSession: async () => {
        try {
          set({ isLoading: true });

          const response = await fetch('/api/auth/session', {
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
            },
          });

          // Check if response is JSON
          const contentType = response.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            // Not JSON, likely redirected to login page or error
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
            return;
          }

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
              set({
                user: data.data,
                isAuthenticated: true,
                isLoading: false,
              });
              return;
            }
          }

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error) {
          // Silently fail for session check - this is expected when not logged in
          console.error('Session check error:', error);
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      clearAuth: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },
    }),
    {
      name: 'plaza-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);