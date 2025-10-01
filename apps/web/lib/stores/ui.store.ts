import { create } from 'zustand';

interface UiState {
  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Modals
  modals: Record<string, boolean>;
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  toggleModal: (modalId: string) => void;

  // Notifications
  showNotifications: boolean;
  notificationCount: number;
  setShowNotifications: (show: boolean) => void;
  setNotificationCount: (count: number) => void;

  // Theme
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;

  // Loading states
  globalLoading: boolean;
  loadingStates: Record<string, boolean>;
  setGlobalLoading: (loading: boolean) => void;
  setLoading: (key: string, loading: boolean) => void;

  // Filters
  activeFilters: Record<string, any>;
  setFilter: (key: string, value: any) => void;
  clearFilters: () => void;

  // View preferences
  viewMode: 'grid' | 'list' | 'map';
  setViewMode: (mode: 'grid' | 'list' | 'map') => void;
}

export const useUiStore = create<UiState>((set) => ({
  // Sidebar
  sidebarOpen: true,
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  // Modals
  modals: {},
  openModal: (modalId) => set((state) => ({
    modals: { ...state.modals, [modalId]: true }
  })),
  closeModal: (modalId) => set((state) => ({
    modals: { ...state.modals, [modalId]: false }
  })),
  toggleModal: (modalId) => set((state) => ({
    modals: { ...state.modals, [modalId]: !state.modals[modalId] }
  })),

  // Notifications
  showNotifications: false,
  notificationCount: 0,
  setShowNotifications: (show) => set({ showNotifications: show }),
  setNotificationCount: (count) => set({ notificationCount: count }),

  // Theme
  theme: 'system',
  setTheme: (theme) => set({ theme }),

  // Loading states
  globalLoading: false,
  loadingStates: {},
  setGlobalLoading: (loading) => set({ globalLoading: loading }),
  setLoading: (key, loading) => set((state) => ({
    loadingStates: { ...state.loadingStates, [key]: loading }
  })),

  // Filters
  activeFilters: {},
  setFilter: (key, value) => set((state) => ({
    activeFilters: { ...state.activeFilters, [key]: value }
  })),
  clearFilters: () => set({ activeFilters: {} }),

  // View preferences
  viewMode: 'list',
  setViewMode: (mode) => set({ viewMode: mode }),
}));