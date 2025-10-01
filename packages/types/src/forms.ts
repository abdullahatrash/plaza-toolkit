import { z } from 'zod';
import { ReportType, ReportStatus, Priority, CaseStatus, EvidenceType, AnalysisType } from '@workspace/database';

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  department: z.string().optional(),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Report Schemas
export const createReportSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  type: z.string(),
  priority: z.string(),
  location: z.string().min(3, 'Location is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().optional(),
  incidentDate: z.string().datetime(),
  tags: z.array(z.string()).optional(),
  weatherData: z.object({
    temperature: z.number().optional(),
    humidity: z.number().optional(),
    windSpeed: z.number().optional(),
    windDirection: z.string().optional(),
  }).optional(),
});

export const updateReportSchema = z.object({
  title: z.string().min(5).max(200).optional(),
  description: z.string().min(20).optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  assigneeId: z.string().cuid().optional(),
  tags: z.array(z.string()).optional(),
});

// Case Schemas
export const createCaseSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  type: z.string(),
  priority: z.string(),
  reportIds: z.array(z.string().cuid()).optional(),
  teamMemberIds: z.array(z.string().cuid()).optional(),
  summary: z.string().optional(),
});

export const updateCaseSchema = z.object({
  title: z.string().min(5).max(200).optional(),
  description: z.string().min(20).optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  summary: z.string().optional(),
  findings: z.object({
    violations: z.array(z.string()),
    estimatedDamage: z.string().optional(),
    affectedArea: z.string().optional(),
  }).optional(),
  legalStatus: z.string().optional(),
  courtDate: z.string().datetime().optional(),
  verdict: z.string().optional(),
});

// Evidence Schemas
export const createEvidenceSchema = z.object({
  type: z.string(),
  title: z.string().min(3, 'Title is required'),
  description: z.string().optional(),
  location: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  reportId: z.string().cuid().optional(),
  caseId: z.string().cuid().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
});

// Note Schemas
export const createNoteSchema = z.object({
  content: z.string().min(1, 'Note content is required').max(5000),
  type: z.enum(['COMMENT', 'OBSERVATION', 'UPDATE', 'ACTION', 'DECISION']),
  isInternal: z.boolean().default(false),
  reportId: z.string().cuid().optional(),
  caseId: z.string().cuid().optional(),
}).refine((data) => data.reportId || data.caseId, {
  message: 'Note must be associated with either a report or a case',
});

// Analysis Schemas
export const createAnalysisSchema = z.object({
  type: z.string(),
  reportId: z.string().cuid().optional(),
  priority: z.string().default('MEDIUM'),
  inputData: z.object({
    images: z.array(z.string()).optional(),
    location: z.object({
      lat: z.number(),
      lng: z.number(),
    }).optional(),
    parameters: z.record(z.any()).optional(),
  }).optional(),
});

// Search Schemas
export const searchSchema = z.object({
  query: z.string().min(2, 'Search query must be at least 2 characters'),
  types: z.array(z.enum(['reports', 'cases', 'users', 'evidence'])).optional(),
  filters: z.object({
    status: z.array(z.string()).optional(),
    type: z.array(z.string()).optional(),
    priority: z.array(z.string()).optional(),
    dateRange: z.object({
      start: z.string().datetime(),
      end: z.string().datetime(),
    }).optional(),
  }).optional(),
  limit: z.number().min(1).max(100).default(20),
  page: z.number().min(1).default(1),
});

// Filter Schemas
export const reportFilterSchema = z.object({
  status: z.array(z.string()).optional(),
  type: z.array(z.string()).optional(),
  priority: z.array(z.string()).optional(),
  authorId: z.string().cuid().optional(),
  assigneeId: z.string().cuid().optional(),
  caseId: z.string().cuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    radius: z.number().positive(),
  }).optional(),
});

// Photo Upload Schema
export const photoUploadSchema = z.object({
  caption: z.string().max(500).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  takenAt: z.string().datetime().optional(),
});

// User Update Schema
export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  department: z.string().optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});

// Change Password Schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Export form types
export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
export type CreateReportForm = z.infer<typeof createReportSchema>;
export type UpdateReportForm = z.infer<typeof updateReportSchema>;
export type CreateCaseForm = z.infer<typeof createCaseSchema>;
export type UpdateCaseForm = z.infer<typeof updateCaseSchema>;
export type CreateEvidenceForm = z.infer<typeof createEvidenceSchema>;
export type CreateNoteForm = z.infer<typeof createNoteSchema>;
export type CreateAnalysisForm = z.infer<typeof createAnalysisSchema>;
export type SearchForm = z.infer<typeof searchSchema>;
export type ReportFilterForm = z.infer<typeof reportFilterSchema>;
export type PhotoUploadForm = z.infer<typeof photoUploadSchema>;
export type UpdateUserForm = z.infer<typeof updateUserSchema>;
export type ChangePasswordForm = z.infer<typeof changePasswordSchema>;