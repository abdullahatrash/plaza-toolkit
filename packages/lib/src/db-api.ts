import { prisma, type Prisma, type User, type Report, type Case, type Evidence, type Photo, type Note, type Activity, type AnalysisJob, type Notification } from '@workspace/database';
import { ReportStatus, ReportType, Priority, CaseStatus, UserRole, ActivityType, AnalysisStatus, NotificationType } from '@workspace/database';

// User API
export const userApi = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email }
    });
  },

  async findById(id: string, includeRelations: boolean = false) {
    if (!includeRelations) {
      // Lightweight query for auth purposes
      return prisma.user.findUnique({
        where: { id }
      });
    }

    // Full query with relations for profile/dashboard
    return prisma.user.findUnique({
      where: { id },
      include: {
        reports: true,
        assignedReports: true,
        cases: true,
        notifications: {
          where: { isRead: false },
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });
  },

  async updateLastLogin(id: string) {
    return prisma.user.update({
      where: { id },
      data: { lastLogin: new Date() }
    });
  },

  async getByRole(role: string) {
    return prisma.user.findMany({
      where: { role, isActive: true },
      orderBy: { name: 'asc' }
    });
  },

  async updateProfile(id: string, data: Partial<User>) {
    return prisma.user.update({
      where: { id },
      data
    });
  },

  async list(filters?: {
    role?: string;
    isActive?: boolean;
    search?: string;
  }, pagination?: { page: number; limit: number }) {
    const where: Prisma.UserWhereInput = {};

    if (filters) {
      if (filters.role) where.role = filters.role;
      if (filters.isActive !== undefined) where.isActive = filters.isActive;
      if (filters.search) {
        where.OR = [
          { name: { contains: filters.search } },
          { email: { contains: filters.search } },
          { badge: { contains: filters.search } }
        ];
      }
    }

    const page = pagination?.page || 1;
    const limit = pagination?.limit || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          badge: true,
          department: true,
          isActive: true,
          lastLogin: true,
          createdAt: true
        },
        orderBy: { name: 'asc' },
        skip,
        take: limit
      }),
      prisma.user.count({ where })
    ]);

    return {
      users,
      total,
      page,
      pages: Math.ceil(total / limit)
    };
  },

  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        badge: true,
        department: true,
        isActive: true,
        createdAt: true
      }
    });
  },

  async update(id: string, data: Partial<Prisma.UserUpdateInput>) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        badge: true,
        department: true,
        isActive: true,
        lastLogin: true,
        createdAt: true
      }
    });
  },

  async deactivate(id: string) {
    return prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true
      }
    });
  },

  async activate(id: string) {
    return prisma.user.update({
      where: { id },
      data: { isActive: true },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true
      }
    });
  }
};

// Report API
export const reportApi = {
  async create(data: Prisma.ReportCreateInput) {
    const report = await prisma.report.create({
      data,
      include: {
        author: true,
        assignee: true,
        photos: true
      }
    });

    // Create activity log
    await activityApi.create({
      type: ActivityType.CREATE,
      action: 'Created report',
      description: `New ${data.type} report created`,
      userId: data.author.connect?.id || '',
      reportId: report.id
    });

    return report;
  },

  async findById(id: string) {
    return prisma.report.findUnique({
      where: { id },
      include: {
        author: true,
        assignee: true,
        photos: true,
        evidence: true,
        notes: {
          orderBy: { createdAt: 'desc' }
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { user: true }
        },
        case: true,
        analysisJobs: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  },

  async findByReportNumber(reportNumber: string) {
    return prisma.report.findUnique({
      where: { reportNumber },
      include: {
        author: true,
        assignee: true,
        photos: true,
        case: true,
        evidence: {
          include: {
            collector: true
          }
        }
      }
    });
  },

  async list(filters?: {
    status?: string;
    type?: string;
    priority?: string;
    authorId?: string;
    assigneeId?: string;
    caseId?: string;
    startDate?: Date;
    endDate?: Date;
  }, pagination?: { page: number; limit: number }) {
    const where: Prisma.ReportWhereInput = {};

    if (filters) {
      if (filters.status) where.status = filters.status;
      if (filters.type) where.type = filters.type;
      if (filters.priority) where.priority = filters.priority;
      if (filters.authorId) where.authorId = filters.authorId;
      if (filters.assigneeId) where.assigneeId = filters.assigneeId;
      if (filters.caseId) where.caseId = filters.caseId;
      if (filters.startDate || filters.endDate) {
        where.incidentDate = {};
        if (filters.startDate) where.incidentDate.gte = filters.startDate;
        if (filters.endDate) where.incidentDate.lte = filters.endDate;
      }
    }

    const page = pagination?.page || 1;
    const limit = pagination?.limit || 20;
    const skip = (page - 1) * limit;

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        include: {
          author: true,
          assignee: true,
          photos: { take: 1 },
          case: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.report.count({ where })
    ]);

    return {
      reports,
      total,
      page,
      pages: Math.ceil(total / limit)
    };
  },

  async updateStatus(id: string, status: string, userId: string) {
    const oldReport = await prisma.report.findUnique({
      where: { id },
      select: { status: true }
    });

    const report = await prisma.report.update({
      where: { id },
      data: { status },
      include: {
        author: true,
        assignee: true
      }
    });

    // Log activity
    await activityApi.create({
      type: ActivityType.STATUS_CHANGE,
      action: 'Status updated',
      description: `Status changed from ${oldReport?.status} to ${status}`,
      metadata: JSON.stringify({ oldStatus: oldReport?.status, newStatus: status }),
      userId,
      reportId: id
    });

    // Create notification for assignee if status is critical
    if (status === ReportStatus.IN_PROGRESS && report.assigneeId && report.assigneeId !== userId) {
      await notificationApi.create({
        type: NotificationType.STATUS_CHANGE,
        title: 'Report Status Updated',
        message: `Report ${report.reportNumber} is now under investigation`,
        link: `/reports/${report.id}`,
        userId: report.assigneeId
      });
    }

    return report;
  },

  async assign(id: string, assigneeId: string, userId: string) {
    const report = await prisma.report.update({
      where: { id },
      data: { assigneeId },
      include: {
        author: true,
        assignee: true
      }
    });

    // Log activity
    await activityApi.create({
      type: ActivityType.ASSIGN,
      action: 'Report assigned',
      description: `Report assigned to ${report.assignee?.name}`,
      metadata: JSON.stringify({ assigneeId }),
      userId,
      reportId: id
    });

    // Notify assignee
    if (assigneeId !== userId) {
      await notificationApi.create({
        type: NotificationType.ASSIGNMENT,
        title: 'New Report Assigned',
        message: `You have been assigned to report ${report.reportNumber}`,
        link: `/reports/${report.id}`,
        userId: assigneeId
      });
    }

    return report;
  },

  async addPhoto(reportId: string, photoData: Omit<Photo, 'id' | 'reportId' | 'createdAt'>) {
    return prisma.photo.create({
      data: {
        ...photoData,
        reportId
      }
    });
  },

  async getStats(userId?: string, role?: string) {
    const where: Prisma.ReportWhereInput = {};

    if (userId && role) {
      if (role === UserRole.OFFICER) {
        where.OR = [
          { authorId: userId },
          { assigneeId: userId }
        ];
      } else if (role === UserRole.ANALYST) {
        where.assigneeId = userId;
      } else if (role === UserRole.CITIZEN) {
        where.authorId = userId;
      }
    }

    const [total, byStatus, byPriority, recent] = await Promise.all([
      prisma.report.count({ where }),
      prisma.report.groupBy({
        by: ['status'],
        where,
        _count: true
      }),
      prisma.report.groupBy({
        by: ['priority'],
        where: {
          ...where,
          status: {
            in: [ReportStatus.SUBMITTED, ReportStatus.UNDER_REVIEW, ReportStatus.IN_PROGRESS]
          }
        },
        _count: true
      }),
      prisma.report.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          author: true,
          photos: { take: 1 }
        }
      })
    ]);

    return {
      total,
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.status] = item._count;
        return acc;
      }, {} as Record<string, number>),
      byPriority: byPriority.reduce((acc, item) => {
        acc[item.priority] = item._count;
        return acc;
      }, {} as Record<string, number>),
      recent
    };
  },

  // Additional methods for direct Prisma access
  async findMany(args?: Prisma.ReportFindManyArgs) {
    return prisma.report.findMany(args);
  },

  async count(args?: Prisma.ReportCountArgs) {
    return prisma.report.count(args);
  },

  async update(args: Prisma.ReportUpdateArgs) {
    return prisma.report.update(args);
  },

  async delete(args: Prisma.ReportDeleteArgs) {
    return prisma.report.delete(args);
  },

  async findUnique(args: Prisma.ReportFindUniqueArgs) {
    return prisma.report.findUnique(args);
  }
};

// Case API
export const caseApi = {
  async create(data: Prisma.CaseCreateInput) {
    const caseRecord = await prisma.case.create({
      data,
      include: {
        owner: true,
        team: true,
        reports: true
      }
    });

    // Log activity
    await activityApi.create({
      type: ActivityType.CREATE,
      action: 'Case created',
      description: `New case ${data.caseNumber} created`,
      userId: data.owner.connect?.id || '',
      caseId: caseRecord.id
    });

    return caseRecord;
  },

  async findById(id: string) {
    return prisma.case.findUnique({
      where: { id },
      include: {
        owner: true,
        team: true,
        reports: {
          include: {
            author: true,
            photos: true
          }
        },
        evidence: {
          include: {
            collector: true
          }
        },
        notes: {
          include: {
            author: true
          },
          orderBy: { createdAt: 'desc' }
        },
        activities: {
          include: {
            user: true
          },
          orderBy: { createdAt: 'desc' },
          take: 20
        },
        _count: {
          select: {
            reports: true,
            evidence: true,
            notes: true
          }
        }
      }
    });
  },

  async findByCaseNumber(caseNumber: string) {
    return prisma.case.findUnique({
      where: { caseNumber },
      include: {
        owner: true,
        team: true,
        reports: {
          include: {
            author: true,
            photos: true
          }
        },
        evidence: {
          include: {
            collector: true
          }
        },
        _count: {
          select: {
            reports: true,
            evidence: true,
            notes: true
          }
        }
      }
    });
  },

  async list(filters?: {
    status?: string;
    priority?: string;
    ownerId?: string;
    hasCourtDate?: boolean;
  }, pagination?: { page: number; limit: number }) {
    const where: Prisma.CaseWhereInput = {};

    if (filters) {
      if (filters.status) where.status = filters.status;
      if (filters.priority) where.priority = filters.priority;
      if (filters.ownerId) where.ownerId = filters.ownerId;
      if (filters.hasCourtDate) where.courtDate = { not: null };
    }

    const page = pagination?.page || 1;
    const limit = pagination?.limit || 20;
    const skip = (page - 1) * limit;

    const [cases, total] = await Promise.all([
      prisma.case.findMany({
        where,
        include: {
          owner: true,
          reports: { select: { id: true } },
          evidence: { select: { id: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.case.count({ where })
    ]);

    return {
      cases: cases.map(c => ({
        ...c,
        reportCount: c.reports.length,
        evidenceCount: c.evidence.length
      })),
      total,
      page,
      pages: Math.ceil(total / limit)
    };
  },

  async addReport(caseId: string, reportId: string, userId: string) {
    const result = await prisma.case.update({
      where: { id: caseId },
      data: {
        reports: {
          connect: { id: reportId }
        }
      },
      include: {
        reports: true
      }
    });

    await activityApi.create({
      type: ActivityType.UPDATE,
      action: 'Report added to case',
      description: 'Report linked to case',
      userId,
      caseId,
      reportId
    });

    return result;
  },

  async updateStatus(id: string, status: string, userId: string) {
    const oldCase = await prisma.case.findUnique({
      where: { id },
      select: { status: true }
    });

    const caseRecord = await prisma.case.update({
      where: { id },
      data: { status },
      include: {
        owner: true,
        team: true
      }
    });

    await activityApi.create({
      type: ActivityType.STATUS_CHANGE,
      action: 'Case status updated',
      description: `Status changed from ${oldCase?.status} to ${status}`,
      metadata: JSON.stringify({ oldStatus: oldCase?.status, newStatus: status }),
      userId,
      caseId: id
    });

    // Notify team members
    const teamIds = caseRecord.team.map(m => m.id).filter(id => id !== userId);
    for (const memberId of teamIds) {
      await notificationApi.create({
        type: NotificationType.STATUS_CHANGE,
        title: 'Case Status Updated',
        message: `Case ${caseRecord.caseNumber} status changed to ${status}`,
        link: `/cases/${caseRecord.id}`,
        userId: memberId
      });
    }

    return caseRecord;
  },

  async update(id: string, data: Partial<Prisma.CaseUpdateInput>, userId: string) {
    const caseRecord = await prisma.case.update({
      where: { id },
      data,
      include: {
        owner: true,
        team: true,
        reports: true
      }
    });

    await activityApi.create({
      type: ActivityType.UPDATE,
      action: 'Case updated',
      description: `Case details updated`,
      userId,
      caseId: id
    });

    return caseRecord;
  },

  async delete(id: string, userId: string) {
    await activityApi.create({
      type: ActivityType.DELETE,
      action: 'Case deleted',
      description: `Case removed from system`,
      userId,
      caseId: id
    });

    return prisma.case.delete({
      where: { id }
    });
  },

  async addTeamMember(caseId: string, userId: string, addedBy: string) {
    const caseRecord = await prisma.case.update({
      where: { id: caseId },
      data: {
        team: {
          connect: { id: userId }
        }
      },
      include: {
        team: true
      }
    });

    await activityApi.create({
      type: ActivityType.ASSIGN,
      action: 'Team member added',
      description: `User added to case team`,
      userId: addedBy,
      caseId
    });

    return caseRecord;
  },

  async removeTeamMember(caseId: string, userId: string, removedBy: string) {
    const caseRecord = await prisma.case.update({
      where: { id: caseId },
      data: {
        team: {
          disconnect: { id: userId }
        }
      },
      include: {
        team: true
      }
    });

    await activityApi.create({
      type: ActivityType.UPDATE,
      action: 'Team member removed',
      description: `User removed from case team`,
      userId: removedBy,
      caseId
    });

    return caseRecord;
  }
};

// Evidence API
export const evidenceApi = {
  async create(data: Prisma.EvidenceCreateInput) {
    return prisma.evidence.create({
      data,
      include: {
        collector: true,
        report: true,
        case: true
      }
    });
  },

  async findById(id: string) {
    return prisma.evidence.findUnique({
      where: { id },
      include: {
        collector: true,
        report: true,
        case: true
      }
    });
  },

  async listByReport(reportId: string) {
    return prisma.evidence.findMany({
      where: { reportId },
      include: {
        collector: true
      },
      orderBy: { collectedAt: 'desc' }
    });
  },

  async listByCase(caseId: string) {
    return prisma.evidence.findMany({
      where: { caseId },
      include: {
        collector: true,
        report: true
      },
      orderBy: { collectedAt: 'desc' }
    });
  },

  async list(filters?: {
    type?: string;
    caseId?: string;
    reportId?: string;
    collectedBy?: string;
  }, pagination?: { page: number; limit: number }) {
    const where: Prisma.EvidenceWhereInput = {};

    if (filters) {
      if (filters.type) where.type = filters.type;
      if (filters.caseId) where.caseId = filters.caseId;
      if (filters.reportId) where.reportId = filters.reportId;
      if (filters.collectedBy) where.collectedBy = filters.collectedBy;
    }

    const page = pagination?.page || 1;
    const limit = pagination?.limit || 20;
    const skip = (page - 1) * limit;

    const [evidence, total] = await Promise.all([
      prisma.evidence.findMany({
        where,
        include: {
          collector: true,
          report: { select: { id: true, reportNumber: true, title: true } },
          case: { select: { id: true, caseNumber: true, title: true } }
        },
        orderBy: { collectedAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.evidence.count({ where })
    ]);

    return {
      evidence,
      total,
      page,
      pages: Math.ceil(total / limit)
    };
  },

  async update(id: string, data: Partial<Prisma.EvidenceUpdateInput>) {
    return prisma.evidence.update({
      where: { id },
      data,
      include: {
        collector: true,
        report: true,
        case: true
      }
    });
  },

  async delete(id: string) {
    return prisma.evidence.delete({
      where: { id }
    });
  }
};

// Note API
export const noteApi = {
  async create(data: Prisma.NoteCreateInput) {
    return prisma.note.create({
      data,
      include: {
        author: true
      }
    });
  },

  async listByReport(reportId: string, includeInternal: boolean = false) {
    return prisma.note.findMany({
      where: {
        reportId,
        isInternal: includeInternal ? undefined : false
      },
      include: {
        author: true
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  async listByCase(caseId: string, includeInternal: boolean = false) {
    return prisma.note.findMany({
      where: {
        caseId,
        isInternal: includeInternal ? undefined : false
      },
      include: {
        author: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }
};

// Activity API
export const activityApi = {
  async create(data: {
    type: string;
    action: string;
    description?: string;
    metadata?: string;
    userId: string;
    reportId?: string;
    caseId?: string;
  }) {
    return prisma.activity.create({
      data
    });
  },

  async getRecent(filters?: {
    userId?: string;
    reportId?: string;
    caseId?: string;
    limit?: number;
  }) {
    const where: Prisma.ActivityWhereInput = {};

    if (filters?.userId) where.userId = filters.userId;
    if (filters?.reportId) where.reportId = filters.reportId;
    if (filters?.caseId) where.caseId = filters.caseId;

    return prisma.activity.findMany({
      where,
      include: {
        user: true,
        report: true,
        case: true
      },
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 20
    });
  }
};

// Analysis Job API
export const analysisApi = {
  async create(data: Prisma.AnalysisJobCreateInput) {
    const job = await prisma.analysisJob.create({
      data,
      include: {
        requester: true,
        report: true
      }
    });

    // Notify user
    await notificationApi.create({
      type: NotificationType.INFO,
      title: 'AI Analysis Started',
      message: `${data.type} analysis has been queued`,
      link: data.report?.connect?.id ? `/reports/${data.report.connect.id}/analysis` : undefined,
      userId: data.requester.connect?.id || ''
    });

    return job;
  },

  async updateStatus(id: string, status: string, result?: any) {
    const job = await prisma.analysisJob.update({
      where: { id },
      data: {
        status,
        completedAt: status === AnalysisStatus.COMPLETED ? new Date() : undefined,
        result: result ? JSON.stringify(result) : undefined,
        progress: status === AnalysisStatus.COMPLETED ? 100 : undefined
      },
      include: {
        requester: true,
        report: true
      }
    });

    // Notify requester on completion
    if (status === AnalysisStatus.COMPLETED || status === AnalysisStatus.FAILED) {
      await notificationApi.create({
        type: status === AnalysisStatus.COMPLETED ? NotificationType.SUCCESS : NotificationType.ERROR,
        title: status === AnalysisStatus.COMPLETED ? 'Analysis Complete' : 'Analysis Failed',
        message: `${job.type} analysis ${status === AnalysisStatus.COMPLETED ? 'completed successfully' : 'failed'}`,
        link: job.reportId ? `/reports/${job.reportId}/analysis` : undefined,
        userId: job.requestedBy
      });
    }

    return job;
  },

  async findById(id: string) {
    return prisma.analysisJob.findUnique({
      where: { id },
      include: {
        requester: true,
        report: true
      }
    });
  },

  async listByReport(reportId: string) {
    return prisma.analysisJob.findMany({
      where: { reportId },
      include: {
        requester: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }
};

// Notification API
export const notificationApi = {
  async create(data: {
    type: string;
    title: string;
    message: string;
    link?: string;
    userId: string;
  }) {
    return prisma.notification.create({
      data
    });
  },

  async markAsRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });
  },

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: {
        userId,
        isRead: false
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });
  },

  async list(userId: string, unreadOnly: boolean = false) {
    return prisma.notification.findMany({
      where: {
        userId,
        isRead: unreadOnly ? false : undefined
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  },

  async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: {
        userId,
        isRead: false
      }
    });
  }
};

// Dashboard Stats API
export const dashboardApi = {
  async getOfficerStats(userId: string) {
    const [myReports, assignedReports, activeCases, recentActivities, notifications] = await Promise.all([
      prisma.report.count({
        where: { authorId: userId }
      }),
      prisma.report.count({
        where: {
          assigneeId: userId,
          status: {
            in: [ReportStatus.UNDER_REVIEW, ReportStatus.IN_PROGRESS]
          }
        }
      }),
      prisma.case.count({
        where: {
          team: {
            some: { id: userId }
          },
          status: {
            in: [CaseStatus.OPEN, CaseStatus.IN_PROGRESS]
          }
        }
      }),
      activityApi.getRecent({ userId, limit: 10 }),
      notificationApi.getUnreadCount(userId)
    ]);

    return {
      myReports,
      assignedReports,
      activeCases,
      recentActivities,
      unreadNotifications: notifications
    };
  },

  async getAnalystStats(userId: string) {
    const [activeAnalyses, completedAnalyses, assignedReports, casesInvolved] = await Promise.all([
      prisma.analysisJob.count({
        where: {
          requestedBy: userId,
          status: {
            in: [AnalysisStatus.QUEUED, AnalysisStatus.PROCESSING]
          }
        }
      }),
      prisma.analysisJob.count({
        where: {
          requestedBy: userId,
          status: AnalysisStatus.COMPLETED
        }
      }),
      prisma.report.count({
        where: {
          assigneeId: userId,
          status: {
            in: [ReportStatus.UNDER_REVIEW, ReportStatus.IN_PROGRESS]
          }
        }
      }),
      prisma.case.count({
        where: {
          team: {
            some: { id: userId }
          },
          status: {
            in: [CaseStatus.OPEN, CaseStatus.IN_PROGRESS]
          }
        }
      })
    ]);

    return {
      activeAnalyses,
      completedAnalyses,
      assignedReports,
      casesInvolved
    };
  },

  async getProsecutorStats(userId: string) {
    const [activeCases, inCourtCases, pendingReview, upcomingDeadlines] = await Promise.all([
      prisma.case.count({
        where: {
          ownerId: userId,
          status: CaseStatus.WITH_PROSECUTOR
        }
      }),
      prisma.case.count({
        where: {
          ownerId: userId,
          status: CaseStatus.IN_COURT
        }
      }),
      prisma.case.count({
        where: {
          ownerId: userId,
          status: CaseStatus.PENDING_REVIEW
        }
      }),
      prisma.case.findMany({
        where: {
          ownerId: userId,
          courtDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Next 30 days
          }
        },
        orderBy: { courtDate: 'asc' },
        take: 5
      })
    ]);

    return {
      activeCases,
      inCourtCases,
      pendingReview,
      upcomingDeadlines
    };
  }
};

// Search API
export const searchApi = {
  async global(query: string, types: string[] = ['reports', 'cases', 'users']) {
    const results: any = {};

    if (types.includes('reports')) {
      results.reports = await prisma.report.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
            { reportNumber: { contains: query } },
            { location: { contains: query } }
          ]
        },
        include: {
          author: true,
          photos: { take: 1 }
        },
        take: 5
      });
    }

    if (types.includes('cases')) {
      results.cases = await prisma.case.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
            { caseNumber: { contains: query } }
          ]
        },
        include: {
          owner: true
        },
        take: 5
      });
    }

    if (types.includes('users')) {
      results.users = await prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { email: { contains: query } },
            { badge: { contains: query } }
          ]
        },
        take: 5
      });
    }

    return results;
  }
};

// Chat API (AI XAI Feature)
export const chatApi = {
  async create(data: { id: string; userId: string; title: string; reportId?: string; caseId?: string }) {
    return prisma.chat.create({
      data: {
        id: data.id,
        userId: data.userId,
        title: data.title,
        reportId: data.reportId,
        caseId: data.caseId,
      }
    });
  },

  async findById(id: string) {
    return prisma.chat.findUnique({
      where: { id },
      include: {
        user: true,
        report: true,
        case: true,
      }
    });
  },

  async getUserChats(userId: string, limit: number = 50) {
    return prisma.chat.findMany({
      where: { userId },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'asc' }
        },
        report: {
          select: {
            id: true,
            title: true,
            reportNumber: true
          }
        },
        case: {
          select: {
            id: true,
            title: true,
            caseNumber: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: limit
    });
  },

  async updateTitle(id: string, title: string) {
    return prisma.chat.update({
      where: { id },
      data: {
        title,
        updatedAt: new Date()
      }
    });
  },

  async getMessages(chatId: string) {
    return prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' }
    });
  },

  async saveMessages(messages: Array<{
    id: string;
    chatId: string;
    role: string;
    parts: string;
    attachments: string;
  }>) {
    return prisma.message.createMany({
      data: messages
    });
  },

  async deleteById(id: string) {
    // Messages will cascade delete due to onDelete: Cascade in schema
    return prisma.chat.delete({
      where: { id }
    });
  }
};