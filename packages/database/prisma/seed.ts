import { PrismaClient } from '@prisma/client';
import { UserRole, ReportStatus, ReportType, Priority, CaseStatus, EvidenceType, NoteType, ActivityType, AnalysisType, AnalysisStatus, NotificationType } from '../src/enums';

const prisma = new PrismaClient();

// Helper to create hashed password (simplified for demo)
function hashPassword(password: string): string {
  return Buffer.from(password).toString('base64');
}

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.analysisJob.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.note.deleteMany();
  await prisma.evidence.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.report.deleteMany();
  await prisma.case.deleteMany();
  await prisma.user.deleteMany();

  console.log('📦 Creating users...');

  // Create users
  const users = {
    // Officers
    officer1: await prisma.user.create({
      data: {
        email: 'martinez@plaza.gov',
        password: hashPassword('password123'),
        name: 'Officer Sarah Martinez',
        role: UserRole.OFFICER,
        department: 'Environmental Enforcement',
        badge: 'ENV-2847',
        rank: 'Senior Officer',
        phone: '555-0101',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
        isActive: true,
        lastLogin: new Date('2024-01-15T09:30:00'),
      }
    }),
    officer2: await prisma.user.create({
      data: {
        email: 'johnson@plaza.gov',
        password: hashPassword('password123'),
        name: 'Officer Mike Johnson',
        role: UserRole.OFFICER,
        department: 'Environmental Enforcement',
        badge: 'ENV-3156',
        rank: 'Officer',
        phone: '555-0102',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
        isActive: true,
      }
    }),
    officer3: await prisma.user.create({
      data: {
        email: 'chen@plaza.gov',
        password: hashPassword('password123'),
        name: 'Officer Lisa Chen',
        role: UserRole.OFFICER,
        department: 'Wildlife Protection',
        badge: 'WLD-1923',
        rank: 'Officer',
        phone: '555-0103',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa',
        isActive: true,
      }
    }),

    // Analysts
    analyst1: await prisma.user.create({
      data: {
        email: 'analyst@plaza.gov',
        password: hashPassword('password123'),
        name: 'Dr. Emily Watson',
        role: UserRole.ANALYST,
        department: 'Environmental Analysis',
        phone: '555-0201',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
        isActive: true,
      }
    }),
    analyst2: await prisma.user.create({
      data: {
        email: 'raj@plaza.gov',
        password: hashPassword('password123'),
        name: 'Dr. Raj Patel',
        role: UserRole.ANALYST,
        department: 'Data Science',
        phone: '555-0202',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=raj',
        isActive: true,
      }
    }),

    // Prosecutors
    prosecutor1: await prisma.user.create({
      data: {
        email: 'prosecutor@plaza.gov',
        password: hashPassword('password123'),
        name: 'James Wilson',
        role: UserRole.PROSECUTOR,
        department: 'Legal Department',
        phone: '555-0301',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
        isActive: true,
      }
    }),
    prosecutor2: await prisma.user.create({
      data: {
        email: 'garcia@plaza.gov',
        password: hashPassword('password123'),
        name: 'Maria Garcia',
        role: UserRole.PROSECUTOR,
        department: 'Legal Department',
        phone: '555-0302',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
        isActive: true,
      }
    }),

    // Admin
    admin: await prisma.user.create({
      data: {
        email: 'admin@plaza.gov',
        password: hashPassword('password123'),
        name: 'Admin User',
        role: UserRole.ADMIN,
        department: 'System Administration',
        phone: '555-0401',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        isActive: true,
      }
    }),

    // Citizens
    citizen1: await prisma.user.create({
      data: {
        email: 'john.doe@email.com',
        password: hashPassword('password123'),
        name: 'John Doe',
        role: UserRole.CITIZEN,
        phone: '555-1001',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
        isActive: true,
      }
    }),
    citizen2: await prisma.user.create({
      data: {
        email: 'jane.smith@email.com',
        password: hashPassword('password123'),
        name: 'Jane Smith',
        role: UserRole.CITIZEN,
        phone: '555-1002',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
        isActive: true,
      }
    }),
    citizen3: await prisma.user.create({
      data: {
        email: 'robert.brown@email.com',
        password: hashPassword('password123'),
        name: 'Robert Brown',
        role: UserRole.CITIZEN,
        phone: '555-1003',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=robert',
        isActive: true,
      }
    }),
  };

  console.log('📋 Creating reports...');

  // Create reports with various statuses and types
  const reports = [];

  // Critical pollution report
  reports.push(await prisma.report.create({
    data: {
      title: 'Chemical Spill at Industrial Site',
      description: 'Major chemical leak detected at the Northside Industrial Complex. Strong chemical odor reported by multiple residents. Immediate investigation required.',
      type: ReportType.POLLUTION,
      status: ReportStatus.IN_PROGRESS,
      priority: Priority.CRITICAL,
      location: 'Northside Industrial Complex',
      latitude: 40.7580,
      longitude: -73.9855,
      address: '1234 Industrial Way, Plaza City',
      incidentDate: new Date('2024-01-14T14:30:00'),
      reportNumber: 'ENV-2024-0142',
      authorId: users.officer1.id,
      assigneeId: users.analyst1.id,
      tags: JSON.stringify(['chemical', 'hazmat', 'urgent', 'health-risk']),
      metadata: JSON.stringify({
        affectedRadius: '2km',
        evacuationRequired: true,
        hazmatTeamDispatched: true
      }),
      weatherData: JSON.stringify({
        temperature: 18,
        windSpeed: 12,
        windDirection: 'NE',
        humidity: 65
      }),
      photos: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce',
            thumbnail: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=200',
            caption: 'Visible chemical leak from storage tank',
            latitude: 40.7580,
            longitude: -73.9855,
            takenAt: new Date('2024-01-14T14:35:00'),
            aiAnalysis: JSON.stringify({
              detected: ['chemical_leak', 'storage_tank', 'hazard_sign'],
              confidence: 0.92,
              severity: 'high'
            })
          },
          {
            url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
            thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200',
            caption: 'Contaminated water runoff',
            latitude: 40.7582,
            longitude: -73.9853,
            takenAt: new Date('2024-01-14T14:40:00'),
          }
        ]
      }
    }
  }));

  // Wildlife incident
  reports.push(await prisma.report.create({
    data: {
      title: 'Injured Protected Species Found',
      description: 'Bald eagle found with injured wing near the river. Appears to have collided with power lines. Wildlife rescue team notified.',
      type: ReportType.WILDLIFE,
      status: ReportStatus.UNDER_REVIEW,
      priority: Priority.HIGH,
      location: 'Riverside Park',
      latitude: 40.7489,
      longitude: -73.9680,
      address: 'Riverside Park Trail, Plaza City',
      incidentDate: new Date('2024-01-13T10:15:00'),
      reportNumber: 'WLD-2024-0089',
      authorId: users.officer3.id,
      assigneeId: users.officer3.id,
      tags: JSON.stringify(['wildlife', 'protected-species', 'eagle', 'rescue']),
      photos: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4',
            thumbnail: 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=200',
            caption: 'Injured bald eagle',
            latitude: 40.7489,
            longitude: -73.9680,
            takenAt: new Date('2024-01-13T10:20:00'),
            aiAnalysis: JSON.stringify({
              detected: ['bald_eagle', 'injured_wing', 'protected_species'],
              confidence: 0.95,
              speciesIdentification: 'Haliaeetus leucocephalus'
            })
          }
        ]
      }
    }
  }));

  // Water quality issue
  reports.push(await prisma.report.create({
    data: {
      title: 'Algae Bloom in City Lake',
      description: 'Significant algae bloom observed in the eastern section of City Lake. Water appears green with visible foam. Swimming advisory should be issued.',
      type: ReportType.WATER_QUALITY,
      status: ReportStatus.IN_PROGRESS,
      priority: Priority.MEDIUM,
      location: 'City Lake East',
      latitude: 40.7614,
      longitude: -73.9776,
      address: 'City Lake Recreation Area',
      incidentDate: new Date('2024-01-12T08:00:00'),
      reportNumber: 'WQ-2024-0234',
      authorId: users.citizen1.id,
      assigneeId: users.officer2.id,
      tags: JSON.stringify(['water-quality', 'algae', 'public-health']),
      photos: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82',
            thumbnail: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=200',
            caption: 'Green algae bloom visible on water surface',
            latitude: 40.7614,
            longitude: -73.9776,
            takenAt: new Date('2024-01-12T08:10:00'),
          }
        ]
      }
    }
  }));

  // Illegal dumping
  reports.push(await prisma.report.create({
    data: {
      title: 'Construction Waste Illegally Dumped',
      description: 'Large amount of construction debris dumped in protected wetland area. Materials include concrete, rebar, and possibly asbestos-containing materials.',
      type: ReportType.WASTE,
      status: ReportStatus.SUBMITTED,
      priority: Priority.HIGH,
      location: 'Wetlands Reserve North Entrance',
      latitude: 40.7700,
      longitude: -73.9900,
      address: 'Wetlands Access Road',
      incidentDate: new Date('2024-01-11T16:45:00'),
      reportNumber: 'ID-2024-0456',
      authorId: users.citizen2.id,
      tags: JSON.stringify(['illegal-dumping', 'construction-waste', 'wetlands', 'asbestos-risk']),
      photos: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18',
            thumbnail: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=200',
            caption: 'Construction debris pile in wetland',
            latitude: 40.7700,
            longitude: -73.9900,
            takenAt: new Date('2024-01-11T16:50:00'),
          },
          {
            url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
            thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200',
            caption: 'Close-up of suspected hazardous materials',
            latitude: 40.7701,
            longitude: -73.9899,
            takenAt: new Date('2024-01-11T16:55:00'),
          }
        ]
      }
    }
  }));

  // Noise complaint
  reports.push(await prisma.report.create({
    data: {
      title: 'Industrial Noise Exceeding Limits',
      description: 'Factory operating heavy machinery during night hours. Noise levels measured at 85dB at property line, exceeding permitted 65dB limit.',
      type: ReportType.NOISE,
      status: ReportStatus.RESOLVED,
      priority: Priority.MEDIUM,
      location: 'Eastside Manufacturing District',
      latitude: 40.7450,
      longitude: -73.9500,
      address: '500 Factory Lane',
      incidentDate: new Date('2024-01-10T23:30:00'),
      reportNumber: 'NS-2024-0178',
      authorId: users.citizen3.id,
      assigneeId: users.officer1.id,
      tags: JSON.stringify(['noise', 'industrial', 'nighttime', 'violation']),
      metadata: JSON.stringify({
        measuredDecibels: 85,
        permittedLimit: 65,
        violationIssued: true,
        fineAmount: 5000
      })
    }
  }));

  // Add more varied reports
  for (let i = 0; i < 20; i++) {
    const types = Object.values(ReportType);
    const statuses = Object.values(ReportStatus);
    const priorities = Object.values(Priority);
    const officers = [users.officer1, users.officer2, users.officer3];
    const citizens = [users.citizen1, users.citizen2, users.citizen3];

    const isOfficerReport = Math.random() > 0.5;
    const author = isOfficerReport ? officers[Math.floor(Math.random() * officers.length)] : citizens[Math.floor(Math.random() * citizens.length)];

    reports.push(await prisma.report.create({
      data: {
        title: `Environmental Incident #${i + 100}`,
        description: `Description of environmental incident requiring investigation and follow-up action. Details about the nature and scope of the incident.`,
        type: types[Math.floor(Math.random() * types.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        location: `Location ${i + 1}`,
        latitude: 40.7 + (Math.random() * 0.1),
        longitude: -73.9 + (Math.random() * 0.1),
        address: `${100 + i} Main Street, Plaza City`,
        incidentDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        reportNumber: `REP-2024-${String(i + 1000).padStart(4, '0')}`,
        authorId: author.id,
        assigneeId: Math.random() > 0.3 ? officers[Math.floor(Math.random() * officers.length)].id : undefined,
        tags: JSON.stringify(['auto-generated', 'test-data']),
      }
    }));
  }

  console.log('📁 Creating cases...');

  // Create cases
  const case1 = await prisma.case.create({
    data: {
      caseNumber: 'CASE-2024-001',
      title: 'Industrial Complex Environmental Violations',
      description: 'Multiple violations at Northside Industrial Complex including illegal chemical discharge, improper waste disposal, and permit violations.',
      status: CaseStatus.WITH_PROSECUTOR,
      priority: Priority.CRITICAL,
      type: 'Environmental Crime',
      ownerId: users.prosecutor1.id,
      summary: 'Comprehensive investigation into systematic environmental violations by XYZ Industries.',
      findings: JSON.stringify({
        violations: ['Chemical discharge', 'Improper storage', 'Permit violations'],
        estimatedDamage: '$2.5 million',
        affectedArea: '5 square kilometers'
      }),
      legalStatus: 'Charges filed',
      courtDate: new Date('2024-02-15T09:00:00'),
      reports: {
        connect: [{ id: reports[0].id }]
      },
      team: {
        connect: [
          { id: users.analyst1.id },
          { id: users.officer1.id }
        ]
      }
    }
  });

  const case2 = await prisma.case.create({
    data: {
      caseNumber: 'CASE-2024-002',
      title: 'Protected Wetlands Illegal Dumping Investigation',
      description: 'Investigation into repeated illegal dumping activities in protected wetland areas.',
      status: CaseStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      type: 'Illegal Dumping',
      ownerId: users.officer1.id,
      reports: {
        connect: [{ id: reports[3].id }]
      },
      team: {
        connect: [
          { id: users.officer2.id },
          { id: users.analyst2.id }
        ]
      }
    }
  });

  console.log('🔬 Creating evidence...');

  // Create evidence
  await prisma.evidence.createMany({
    data: [
      {
        type: EvidenceType.PHOTO,
        title: 'Chemical Spill Documentation',
        description: 'Photographic evidence of chemical leak from storage tank',
        fileUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce',
        fileType: 'image/jpeg',
        fileSize: 2048576,
        hash: 'abc123def456',
        collectedBy: users.officer1.id,
        collectedAt: new Date('2024-01-14T15:00:00'),
        location: 'Northside Industrial Complex',
        latitude: 40.7580,
        longitude: -73.9855,
        reportId: reports[0].id,
        caseId: case1.id,
        metadata: JSON.stringify({ cameraModel: 'Canon EOS R5', iso: 400 })
      },
      {
        type: EvidenceType.DOCUMENT,
        title: 'Water Quality Test Results',
        description: 'Laboratory analysis of water samples from affected area',
        fileUrl: '/evidence/water-test-results.pdf',
        fileType: 'application/pdf',
        fileSize: 512000,
        hash: 'xyz789uvw123',
        collectedBy: users.analyst1.id,
        collectedAt: new Date('2024-01-14T18:00:00'),
        location: 'City Lake',
        reportId: reports[2].id,
        metadata: JSON.stringify({ labName: 'Environmental Testing Lab', testMethod: 'EPA Method 524.2' })
      },
      {
        type: EvidenceType.SAMPLE,
        title: 'Soil Sample #001',
        description: 'Contaminated soil sample from dumping site',
        collectedBy: users.officer2.id,
        collectedAt: new Date('2024-01-12T10:00:00'),
        location: 'Wetlands Reserve',
        latitude: 40.7700,
        longitude: -73.9900,
        reportId: reports[3].id,
        caseId: case2.id,
        metadata: JSON.stringify({ sampleId: 'SS-001', chainOfCustody: 'COC-2024-156' })
      }
    ]
  });

  console.log('📝 Creating notes...');

  // Create notes
  await prisma.note.createMany({
    data: [
      {
        content: 'Initial assessment complete. Hazmat team has contained the spill. EPA notification sent.',
        type: NoteType.UPDATE,
        isInternal: false,
        authorId: users.officer1.id,
        reportId: reports[0].id,
      },
      {
        content: 'Witness reported seeing unmarked truck dumping materials last Tuesday night around 11 PM.',
        type: NoteType.OBSERVATION,
        isInternal: true,
        authorId: users.officer2.id,
        reportId: reports[3].id,
        caseId: case2.id,
      },
      {
        content: 'Prosecutor review requested. Sufficient evidence for criminal charges.',
        type: NoteType.DECISION,
        isInternal: true,
        authorId: users.analyst1.id,
        caseId: case1.id,
      }
    ]
  });

  console.log('🤖 Creating AI analysis jobs...');

  // Create AI analysis jobs
  await prisma.analysisJob.createMany({
    data: [
      {
        type: AnalysisType.POLLUTION_DETECTION,
        status: AnalysisStatus.COMPLETED,
        priority: Priority.CRITICAL,
        reportId: reports[0].id,
        inputData: JSON.stringify({
          images: ['photo1.jpg', 'photo2.jpg'],
          location: { lat: 40.7580, lng: -73.9855 }
        }),
        startedAt: new Date('2024-01-14T15:00:00'),
        completedAt: new Date('2024-01-14T15:05:00'),
        progress: 100,
        result: JSON.stringify({
          pollutionType: 'chemical',
          severity: 'high',
          affectedArea: '2km radius',
          recommendations: ['Immediate containment', 'Evacuate nearby residents', 'Deploy hazmat team']
        }),
        confidence: 0.92,
        detections: JSON.stringify([
          { type: 'chemical_spill', bbox: [100, 100, 200, 200], confidence: 0.95 },
          { type: 'contaminated_water', bbox: [150, 250, 300, 350], confidence: 0.89 }
        ]),
        suggestions: JSON.stringify([
          'Deploy absorbent materials',
          'Install temporary containment barriers',
          'Monitor air quality'
        ]),
        explanation: JSON.stringify({
          factors: [
            { name: 'Visual indicators', weight: 0.4, value: 'Strong chemical discoloration' },
            { name: 'Pattern matching', weight: 0.3, value: 'Matches industrial spill pattern' },
            { name: 'Environmental context', weight: 0.3, value: 'Industrial facility location' }
          ],
          confidence_breakdown: {
            visual: 0.95,
            contextual: 0.90,
            historical: 0.88
          }
        }),
        heatmapUrl: 'https://example.com/heatmaps/analysis-001.png',
        requestedBy: users.analyst1.id,
      },
      {
        type: AnalysisType.WILDLIFE_IDENTIFICATION,
        status: AnalysisStatus.COMPLETED,
        priority: Priority.HIGH,
        reportId: reports[1].id,
        inputData: JSON.stringify({
          images: ['eagle.jpg'],
          location: { lat: 40.7489, lng: -73.9680 }
        }),
        startedAt: new Date('2024-01-13T10:30:00'),
        completedAt: new Date('2024-01-13T10:32:00'),
        progress: 100,
        result: JSON.stringify({
          species: 'Haliaeetus leucocephalus',
          commonName: 'Bald Eagle',
          protectionStatus: 'Protected',
          condition: 'Injured - wing damage'
        }),
        confidence: 0.95,
        detections: JSON.stringify([
          { type: 'bald_eagle', bbox: [50, 50, 400, 400], confidence: 0.95 },
          { type: 'wing_injury', bbox: [200, 150, 280, 200], confidence: 0.87 }
        ]),
        requestedBy: users.officer3.id,
      },
      {
        type: AnalysisType.PATTERN_ANALYSIS,
        status: AnalysisStatus.PROCESSING,
        priority: Priority.MEDIUM,
        inputData: JSON.stringify({
          timeRange: '30days',
          location: 'citywide',
          incidentTypes: ['ILLEGAL_DUMPING']
        }),
        startedAt: new Date('2024-01-15T09:00:00'),
        progress: 45,
        requestedBy: users.analyst2.id,
      }
    ]
  });

  console.log('📊 Creating activity logs...');

  // Create activity logs
  await prisma.activity.createMany({
    data: [
      {
        type: ActivityType.CREATE,
        action: 'Created incident report',
        description: 'New chemical spill report created',
        userId: users.officer1.id,
        reportId: reports[0].id,
      },
      {
        type: ActivityType.STATUS_CHANGE,
        action: 'Status updated to INVESTIGATING',
        description: 'Report status changed from SUBMITTED to INVESTIGATING',
        metadata: JSON.stringify({ oldStatus: 'SUBMITTED', newStatus: 'INVESTIGATING' }),
        userId: users.officer1.id,
        reportId: reports[0].id,
      },
      {
        type: ActivityType.ASSIGN,
        action: 'Assigned to analyst',
        description: 'Report assigned to Dr. Emily Watson for analysis',
        metadata: JSON.stringify({ assigneeId: users.analyst1.id }),
        userId: users.officer1.id,
        reportId: reports[0].id,
      },
      {
        type: ActivityType.UPLOAD,
        action: 'Evidence uploaded',
        description: 'New photographic evidence added',
        userId: users.officer1.id,
        caseId: case1.id,
      },
      {
        type: ActivityType.ANALYSIS,
        action: 'AI analysis completed',
        description: 'Pollution detection analysis completed with high confidence',
        metadata: JSON.stringify({ analysisType: 'POLLUTION_DETECTION', confidence: 0.92 }),
        userId: users.analyst1.id,
        reportId: reports[0].id,
      }
    ]
  });

  console.log('🔔 Creating notifications...');

  // Create notifications
  await prisma.notification.createMany({
    data: [
      {
        type: NotificationType.ASSIGNMENT,
        title: 'New Report Assigned',
        message: 'You have been assigned to investigate a chemical spill at Northside Industrial Complex',
        link: '/reports/ENV-2024-0142',
        userId: users.analyst1.id,
      },
      {
        type: NotificationType.STATUS_CHANGE,
        title: 'Case Status Updated',
        message: 'Case CASE-2024-001 has been forwarded to prosecution',
        link: '/cases/CASE-2024-001',
        userId: users.prosecutor1.id,
      },
      {
        type: NotificationType.WARNING,
        title: 'Critical Report Requires Attention',
        message: 'A critical priority chemical spill report needs immediate review',
        link: '/reports/ENV-2024-0142',
        isRead: true,
        userId: users.officer1.id,
        readAt: new Date('2024-01-14T15:30:00'),
      },
      {
        type: NotificationType.SUCCESS,
        title: 'Analysis Complete',
        message: 'AI pollution detection analysis has been completed successfully',
        link: '/reports/ENV-2024-0142/analysis',
        userId: users.analyst1.id,
      },
      {
        type: NotificationType.DEADLINE,
        title: 'Court Date Approaching',
        message: 'Case CASE-2024-001 court date is scheduled for February 15, 2024',
        link: '/cases/CASE-2024-001',
        userId: users.prosecutor1.id,
      }
    ]
  });

  console.log('✅ Seed completed successfully!');
  console.log(`
  Created:
  - ${Object.keys(users).length} users
  - ${reports.length} reports
  - 2 cases
  - Multiple photos, evidence, notes, activities, analysis jobs, and notifications

  You can now login with:
  - Officer: martinez@plaza.gov / password123
  - Analyst: analyst@plaza.gov / password123
  - Prosecutor: prosecutor@plaza.gov / password123
  - Admin: admin@plaza.gov / password123
  - Citizen: john.doe@email.com / password123
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });