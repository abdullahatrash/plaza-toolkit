import type { User, Report, Case, Evidence, Photo, Note, Activity, AnalysisJob, Notification } from '@workspace/database';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: Omit<User, 'password'>;
  token: string;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
  department?: string;
  avatarUrl?: string;
}

// Report Types
export interface CreateReportRequest {
  title: string;
  description: string;
  type: string;
  priority: string;
  location: string;
  latitude: number;
  longitude: number;
  address?: string;
  incidentDate: string;
  photos?: File[];
  tags?: string[];
}

export interface UpdateReportRequest {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  assigneeId?: string;
}

export interface ReportWithRelations extends Report {
  author: User;
  assignee?: User;
  photos: Photo[];
  case?: Case;
  evidence?: Evidence[];
  notes?: Note[];
  activities?: (Activity & { user: User })[];
  analysisJobs?: AnalysisJob[];
}

// Case Types
export interface CreateCaseRequest {
  title: string;
  description: string;
  type: string;
  priority: string;
  reportIds?: string[];
  teamMemberIds?: string[];
}

export interface CaseWithRelations extends Case {
  owner: User;
  team: User[];
  reports: ReportWithRelations[];
  evidence: (Evidence & { collector: User })[];
  notes: (Note & { author: User })[];
  activities: (Activity & { user: User })[];
}

// Evidence Types
export interface CreateEvidenceRequest {
  type: string;
  title: string;
  description?: string;
  file?: File;
  location?: string;
  latitude?: number;
  longitude?: number;
  reportId?: string;
  caseId?: string;
}

// Analysis Types
export interface CreateAnalysisRequest {
  type: string;
  reportId?: string;
  priority?: string;
  parameters?: Record<string, any>;
}

export interface AnalysisResult {
  job: AnalysisJob;
  detections?: Array<{
    type: string;
    confidence: number;
    bbox?: number[];
    description?: string;
  }>;
  suggestions?: string[];
  explanation?: {
    factors: Array<{
      name: string;
      weight: number;
      value: string;
    }>;
    confidence_breakdown: Record<string, number>;
  };
}

// Dashboard Types
export interface DashboardStats {
  totalReports: number;
  activeReports: number;
  resolvedReports: number;
  criticalReports: number;
  recentReports: ReportWithRelations[];
  reportsByType: Record<string, number>;
  reportsByStatus: Record<string, number>;
  activeCases?: number;
  teamMembers?: number;
}

export interface OfficerDashboard {
  myReports: number;
  assignedReports: number;
  recentActivities: Activity[];
  unreadNotifications: number;
  upcomingDeadlines?: Report[];
}

export interface AnalystDashboard {
  activeAnalyses: number;
  completedAnalyses: number;
  assignedReports: number;
  casesInvolved: number;
  recentAnalyses: AnalysisJob[];
}

export interface ProsecutorDashboard {
  activeCases: number;
  inCourtCases: number;
  pendingReview: number;
  upcomingDeadlines: Case[];
  recentCases: CaseWithRelations[];
}

// Search Types
export interface SearchRequest {
  query: string;
  types?: ('reports' | 'cases' | 'users' | 'evidence')[];
  filters?: {
    status?: string[];
    type?: string[];
    priority?: string[];
    dateRange?: {
      start: string;
      end: string;
    };
  };
}

export interface SearchResults {
  reports?: Report[];
  cases?: Case[];
  users?: User[];
  evidence?: Evidence[];
  total: number;
}

// Notification Types
export interface NotificationWithUser extends Notification {
  user: User;
}

// Map Types
export interface MapMarker {
  id: string;
  type: 'report' | 'evidence' | 'alert';
  position: [number, number];
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  icon?: string;
  color?: string;
}

export interface MapCluster {
  id: string;
  position: [number, number];
  count: number;
  markers: MapMarker[];
}

// Filter Types
export interface ReportFilters {
  status?: string[];
  type?: string[];
  priority?: string[];
  authorId?: string;
  assigneeId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  location?: {
    lat: number;
    lng: number;
    radius: number; // in km
  };
}

export interface CaseFilters {
  status?: string[];
  priority?: string[];
  ownerId?: string;
  hasEvidence?: boolean;
  hasReports?: boolean;
}