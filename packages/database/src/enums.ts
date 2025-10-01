export const UserRole = {
  OFFICER: 'OFFICER',
  ANALYST: 'ANALYST',
  PROSECUTOR: 'PROSECUTOR',
  ADMIN: 'ADMIN',
  CITIZEN: 'CITIZEN'
} as const;
export type UserRole = typeof UserRole[keyof typeof UserRole];

export const ReportType = {
  POLLUTION: 'POLLUTION',
  WILDLIFE: 'WILDLIFE',
  WATER_QUALITY: 'WATER_QUALITY',
  AIR_QUALITY: 'AIR_QUALITY',
  DEFORESTATION: 'DEFORESTATION',
  WASTE: 'WASTE',
  NOISE: 'NOISE',
  OTHER: 'OTHER'
} as const;
export type ReportType = typeof ReportType[keyof typeof ReportType];

export const ReportStatus = {
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  DISMISSED: 'DISMISSED'
} as const;
export type ReportStatus = typeof ReportStatus[keyof typeof ReportStatus];

export const Priority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
} as const;
export type Priority = typeof Priority[keyof typeof Priority];

export const CaseStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  PENDING_REVIEW: 'PENDING_REVIEW',
  WITH_PROSECUTOR: 'WITH_PROSECUTOR',
  IN_COURT: 'IN_COURT',
  CLOSED: 'CLOSED',
  DISMISSED: 'DISMISSED'
} as const;
export type CaseStatus = typeof CaseStatus[keyof typeof CaseStatus];

export const EvidenceType = {
  PHOTO: 'PHOTO',
  VIDEO: 'VIDEO',
  DOCUMENT: 'DOCUMENT',
  SAMPLE: 'SAMPLE',
  TESTIMONY: 'TESTIMONY',
  REPORT: 'REPORT',
  OTHER: 'OTHER'
} as const;
export type EvidenceType = typeof EvidenceType[keyof typeof EvidenceType];

export const NoteType = {
  COMMENT: 'COMMENT',
  OBSERVATION: 'OBSERVATION',
  UPDATE: 'UPDATE',
  ACTION: 'ACTION',
  DECISION: 'DECISION'
} as const;
export type NoteType = typeof NoteType[keyof typeof NoteType];

export const ActivityType = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  ASSIGN: 'ASSIGN',
  STATUS_CHANGE: 'STATUS_CHANGE',
  COMMENT: 'COMMENT',
  UPLOAD: 'UPLOAD',
  VIEW: 'VIEW',
  EXPORT: 'EXPORT',
  ANALYSIS: 'ANALYSIS'
} as const;
export type ActivityType = typeof ActivityType[keyof typeof ActivityType];

export const AnalysisType = {
  POLLUTION_DETECTION: 'POLLUTION_DETECTION',
  WILDLIFE_IDENTIFICATION: 'WILDLIFE_IDENTIFICATION',
  DAMAGE_ASSESSMENT: 'DAMAGE_ASSESSMENT',
  PATTERN_ANALYSIS: 'PATTERN_ANALYSIS',
  TREND_PREDICTION: 'TREND_PREDICTION',
  RISK_ASSESSMENT: 'RISK_ASSESSMENT'
} as const;
export type AnalysisType = typeof AnalysisType[keyof typeof AnalysisType];

export const AnalysisStatus = {
  QUEUED: 'QUEUED',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED'
} as const;
export type AnalysisStatus = typeof AnalysisStatus[keyof typeof AnalysisStatus];

export const NotificationType = {
  INFO: 'INFO',
  SUCCESS: 'SUCCESS',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  ASSIGNMENT: 'ASSIGNMENT',
  STATUS_CHANGE: 'STATUS_CHANGE',
  MENTION: 'MENTION',
  DEADLINE: 'DEADLINE'
} as const;
export type NotificationType = typeof NotificationType[keyof typeof NotificationType];