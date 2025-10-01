import { create } from 'zustand';
import type { ReportWithRelations } from '@workspace/types/api';
import type { Report } from '@workspace/database';

interface ReportState {
  // Data
  reports: ReportWithRelations[];
  selectedReport: ReportWithRelations | null;
  totalReports: number;

  // Pagination
  currentPage: number;
  pageSize: number;
  totalPages: number;

  // Filters
  filters: {
    status?: string[];
    type?: string[];
    priority?: string[];
    assigneeId?: string;
    dateRange?: {
      start: Date;
      end: Date;
    };
  };

  // Sorting
  sortBy: string;
  sortOrder: 'asc' | 'desc';

  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;

  // Actions
  setReports: (reports: ReportWithRelations[]) => void;
  addReport: (report: ReportWithRelations) => void;
  updateReport: (id: string, updates: Partial<Report>) => void;
  removeReport: (id: string) => void;
  selectReport: (report: ReportWithRelations | null) => void;

  setFilters: (filters: any) => void;
  clearFilters: () => void;

  setPagination: (page: number, pageSize: number, totalPages: number) => void;
  setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => void;

  setLoading: (loading: boolean) => void;
  setCreating: (creating: boolean) => void;
  setUpdating: (updating: boolean) => void;

  // API Actions
  fetchReports: (filters?: any, page?: number) => Promise<void>;
  fetchReportById: (id: string) => Promise<void>;
  createReport: (data: any) => Promise<void>;
  updateReportStatus: (id: string, status: string) => Promise<void>;
  assignReport: (id: string, assigneeId: string) => Promise<void>;
}

export const useReportStore = create<ReportState>((set, get) => ({
  // Initial state
  reports: [],
  selectedReport: null,
  totalReports: 0,
  currentPage: 1,
  pageSize: 20,
  totalPages: 1,
  filters: {},
  sortBy: 'createdAt',
  sortOrder: 'desc',
  isLoading: false,
  isCreating: false,
  isUpdating: false,

  // Actions
  setReports: (reports) => set({ reports }),

  addReport: (report) => set((state) => ({
    reports: [report, ...state.reports]
  })),

  updateReport: (id, updates) => set((state) => ({
    reports: state.reports.map(r =>
      r.id === id ? { ...r, ...updates } : r
    ),
    selectedReport: state.selectedReport?.id === id
      ? { ...state.selectedReport, ...updates }
      : state.selectedReport
  })),

  removeReport: (id) => set((state) => ({
    reports: state.reports.filter(r => r.id !== id),
    selectedReport: state.selectedReport?.id === id ? null : state.selectedReport
  })),

  selectReport: (report) => set({ selectedReport: report }),

  setFilters: (filters) => set({ filters, currentPage: 1 }),
  clearFilters: () => set({ filters: {}, currentPage: 1 }),

  setPagination: (currentPage, pageSize, totalPages) => set({
    currentPage,
    pageSize,
    totalPages
  }),

  setSorting: (sortBy, sortOrder) => set({ sortBy, sortOrder }),

  setLoading: (isLoading) => set({ isLoading }),
  setCreating: (isCreating) => set({ isCreating }),
  setUpdating: (isUpdating) => set({ isUpdating }),

  // API Actions
  fetchReports: async (filters = {}, page = 1) => {
    try {
      set({ isLoading: true });

      const params = new URLSearchParams({
        page: page.toString(),
        limit: get().pageSize.toString(),
        sortBy: get().sortBy,
        sortOrder: get().sortOrder,
        ...filters
      });

      const response = await fetch(`/api/reports?${params}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }

      const data = await response.json();

      set({
        reports: data.data.reports,
        totalReports: data.data.total,
        currentPage: data.data.page,
        totalPages: data.data.pages,
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching reports:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  fetchReportById: async (id) => {
    try {
      set({ isLoading: true });

      const response = await fetch(`/api/reports/${id}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch report');
      }

      const data = await response.json();

      set({
        selectedReport: data.data,
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching report:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  createReport: async (data) => {
    try {
      set({ isCreating: true });

      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to create report');
      }

      const result = await response.json();

      set((state) => ({
        reports: [result.data, ...state.reports],
        isCreating: false
      }));

      return result.data;
    } catch (error) {
      console.error('Error creating report:', error);
      set({ isCreating: false });
      throw error;
    }
  },

  updateReportStatus: async (id, status) => {
    try {
      set({ isUpdating: true });

      const response = await fetch(`/api/reports/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to update report status');
      }

      const data = await response.json();

      get().updateReport(id, { status });
      set({ isUpdating: false });

      return data.data;
    } catch (error) {
      console.error('Error updating report status:', error);
      set({ isUpdating: false });
      throw error;
    }
  },

  assignReport: async (id, assigneeId) => {
    try {
      set({ isUpdating: true });

      const response = await fetch(`/api/reports/${id}/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assigneeId }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to assign report');
      }

      const data = await response.json();

      get().updateReport(id, { assigneeId });
      set({ isUpdating: false });

      return data.data;
    } catch (error) {
      console.error('Error assigning report:', error);
      set({ isUpdating: false });
      throw error;
    }
  }
}));