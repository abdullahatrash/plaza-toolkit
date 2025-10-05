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

  console.log('📋 Creating reports for 8 pilot case study locations...');

  // Create reports with various statuses and types
  const reports = [];

  // ========================================
  // CASE STUDY 1: Valle Galeria, Italy
  // Environmental and health challenges
  // ========================================
  console.log('  📍 Case Study 1: Valle Galeria, Italy');

  reports.push(await prisma.report.create({
    data: {
      title: 'Illegal Waste Dumping in Valle Galeria',
      description: 'Multiple illegal waste disposal sites detected in Valle Galeria area. Toxic materials found including heavy metals and industrial waste. Significant health risk to local population.',
      type: ReportType.WASTE,
      status: ReportStatus.IN_PROGRESS,
      priority: Priority.CRITICAL,
      location: 'Valle Galeria, Rome',
      latitude: 41.8697,
      longitude: 12.3526,
      address: 'Valle Galeria Industrial Zone, Rome, Italy',
      incidentDate: new Date('2024-01-10T11:00:00'),
      reportNumber: 'IT-VG-2024-001',
      authorId: users.officer1.id,
      assigneeId: users.analyst1.id,
      tags: JSON.stringify(['italy', 'valle-galeria', 'toxic-waste', 'health-risk', 'illegal-dumping']),
      metadata: JSON.stringify({
        affectedPopulation: '15000 residents',
        contaminants: ['Heavy metals', 'Industrial solvents', 'Plastic waste'],
        soilContamination: 'severe',
        waterSourcesAffected: 3
      }),
      photos: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18',
            thumbnail: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=200',
            caption: 'Illegal waste dump site in Valle Galeria',
            latitude: 41.8697,
            longitude: 12.3526,
            takenAt: new Date('2024-01-10T11:15:00'),
            aiAnalysis: JSON.stringify({
              detected: ['illegal_dump', 'toxic_waste', 'soil_contamination'],
              confidence: 0.89,
              severity: 'critical',
              estimatedVolume: '500 cubic meters'
            })
          }
        ]
      }
    }
  }));

  reports.push(await prisma.report.create({
    data: {
      title: 'Air Quality Alert - Valle Galeria Incinerator',
      description: 'Hazardous air emissions detected from nearby waste incinerator. Particulate matter levels exceed EU safety standards.',
      type: ReportType.AIR_QUALITY,
      status: ReportStatus.UNDER_REVIEW,
      priority: Priority.HIGH,
      location: 'Valle Galeria Incinerator Area',
      latitude: 41.8710,
      longitude: 12.3540,
      address: 'Near Waste Treatment Facility, Valle Galeria, Italy',
      incidentDate: new Date('2024-01-12T09:00:00'),
      reportNumber: 'IT-VG-2024-002',
      authorId: users.citizen1.id,
      assigneeId: users.officer2.id,
      tags: JSON.stringify(['italy', 'air-pollution', 'incinerator', 'public-health']),
      metadata: JSON.stringify({
        pm25Level: 75,
        pm10Level: 120,
        euLimit: 'Exceeded by 40%',
        windDirection: 'SE'
      })
    }
  }));

  reports.push(await prisma.report.create({
    data: {
      title: 'Soil Contamination - Valle Galeria South',
      description: 'High levels of lead and mercury detected in soil samples.',
      type: ReportType.POLLUTION,
      status: ReportStatus.SUBMITTED,
      priority: Priority.MEDIUM,
      location: 'Valle Galeria South',
      latitude: 41.8685,
      longitude: 12.3515,
      address: 'Southern Valle Galeria, Rome, Italy',
      incidentDate: new Date('2024-01-14T14:00:00'),
      reportNumber: 'IT-VG-2024-003',
      authorId: users.citizen2.id,
      tags: JSON.stringify(['italy', 'soil-contamination', 'heavy-metals'])
    }
  }));

  reports.push(await prisma.report.create({
    data: {
      title: 'Water Contamination - Valle Galeria Stream',
      description: 'Chemical runoff detected in local stream near residential area.',
      type: ReportType.WATER_QUALITY,
      status: ReportStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      location: 'Valle Galeria Stream',
      latitude: 41.8705,
      longitude: 12.3535,
      address: 'Valle Galeria Water Source, Rome, Italy',
      incidentDate: new Date('2024-01-15T10:30:00'),
      reportNumber: 'IT-VG-2024-004',
      authorId: users.officer2.id,
      assigneeId: users.analyst1.id,
      tags: JSON.stringify(['italy', 'water-contamination', 'chemical-runoff'])
    }
  }));

  reports.push(await prisma.report.create({
    data: {
      title: 'Illegal Burning - Valle Galeria Industrial',
      description: 'Uncontrolled burning of waste materials observed in industrial zone.',
      type: ReportType.WASTE,
      status: ReportStatus.UNDER_REVIEW,
      priority: Priority.CRITICAL,
      location: 'Valle Galeria Industrial Zone',
      latitude: 41.8692,
      longitude: 12.3520,
      address: 'Industrial Zone, Valle Galeria, Italy',
      incidentDate: new Date('2024-01-16T18:00:00'),
      reportNumber: 'IT-VG-2024-005',
      authorId: users.officer1.id,
      assigneeId: users.analyst2.id,
      tags: JSON.stringify(['italy', 'illegal-burning', 'air-pollution'])
    }
  }));

  // ========================================
  // CASE STUDY 2: Brasov, Romania
  // Sustainable forest management
  // ========================================
  console.log('  📍 Case Study 2: Brasov, Romania');

  reports.push(await prisma.report.create({
    data: {
      title: 'Illegal Logging Detected in Brasov Forest',
      description: 'Satellite imagery and ground reports confirm illegal deforestation activity in protected forest area near Brasov. Approximately 5 hectares affected.',
      type: ReportType.DEFORESTATION,
      status: ReportStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      location: 'Brasov Forest Reserve',
      latitude: 45.6579,
      longitude: 25.6012,
      address: 'Protected Forest Zone, Brasov County, Romania',
      incidentDate: new Date('2024-01-08T07:30:00'),
      reportNumber: 'RO-BR-2024-001',
      authorId: users.officer3.id,
      assigneeId: users.analyst2.id,
      tags: JSON.stringify(['romania', 'brasov', 'deforestation', 'illegal-logging', 'protected-area']),
      metadata: JSON.stringify({
        affectedArea: '5 hectares',
        treeCount: 'Estimated 450 trees',
        forestType: 'Mixed deciduous',
        protectionStatus: 'Natura 2000 site'
      }),
      photos: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09',
            thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200',
            caption: 'Clear-cut area in protected forest',
            latitude: 45.6579,
            longitude: 25.6012,
            takenAt: new Date('2024-01-08T08:00:00'),
            aiAnalysis: JSON.stringify({
              detected: ['deforestation', 'logging_equipment', 'access_road'],
              confidence: 0.94,
              deforestationArea: '5.2 hectares',
              treeSpeciesDetected: ['Oak', 'Beech', 'Pine']
            })
          }
        ]
      }
    }
  }));

  reports.push(await prisma.report.create({
    data: {
      title: 'Wildlife Habitat Disruption - Brasov',
      description: 'Brown bear habitat affected by recent logging activity. Multiple bear tracks and dens found in disturbed areas.',
      type: ReportType.WILDLIFE,
      status: ReportStatus.SUBMITTED,
      priority: Priority.MEDIUM,
      location: 'Brasov Mountain Forest',
      latitude: 45.6600,
      longitude: 25.6050,
      address: 'Brasov Mountain Wildlife Corridor, Romania',
      incidentDate: new Date('2024-01-13T14:00:00'),
      reportNumber: 'RO-BR-2024-002',
      authorId: users.citizen2.id,
      tags: JSON.stringify(['romania', 'wildlife', 'brown-bear', 'habitat-loss'])
    }
  }));

  reports.push(await prisma.report.create({
    data: {
      title: 'Erosion from Logging Roads - Brasov',
      description: 'New logging roads causing severe soil erosion and water runoff.',
      type: ReportType.DEFORESTATION,
      status: ReportStatus.UNDER_REVIEW,
      priority: Priority.MEDIUM,
      location: 'Brasov Forest Access Road',
      latitude: 45.6590,
      longitude: 25.6025,
      address: 'Forest Access Zone, Brasov, Romania',
      incidentDate: new Date('2024-01-14T11:00:00'),
      reportNumber: 'RO-BR-2024-003',
      authorId: users.officer1.id,
      tags: JSON.stringify(['romania', 'erosion', 'forest-management'])
    }
  }));

  reports.push(await prisma.report.create({
    data: {
      title: 'Illegal Timber Stockpile - Brasov',
      description: 'Large stockpile of illegally harvested timber discovered near forest edge.',
      type: ReportType.DEFORESTATION,
      status: ReportStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      location: 'Brasov Forest Edge',
      latitude: 45.6570,
      longitude: 25.6005,
      address: 'Edge of Protected Forest, Brasov, Romania',
      incidentDate: new Date('2024-01-17T09:30:00'),
      reportNumber: 'RO-BR-2024-004',
      authorId: users.officer3.id,
      assigneeId: users.analyst1.id,
      tags: JSON.stringify(['romania', 'illegal-timber', 'law-enforcement'])
    }
  }));

  reports.push(await prisma.report.create({
    data: {
      title: 'Protected Species at Risk - Brasov',
      description: 'Lynx habitat under threat from continued logging activity.',
      type: ReportType.WILDLIFE,
      status: ReportStatus.SUBMITTED,
      priority: Priority.CRITICAL,
      location: 'Brasov Lynx Habitat',
      latitude: 45.6585,
      longitude: 25.6030,
      address: 'Protected Wildlife Zone, Brasov, Romania',
      incidentDate: new Date('2024-01-18T15:00:00'),
      reportNumber: 'RO-BR-2024-005',
      authorId: users.citizen1.id,
      tags: JSON.stringify(['romania', 'lynx', 'endangered-species'])
    }
  }));

  // ========================================
  // CASE STUDY 3: Crete, Greece
  // Preventing land clearing
  // ========================================
  console.log('  📍 Case Study 3: Crete, Greece');

  reports.push(await prisma.report.create({
    data: {
      title: 'Unauthorized Land Clearing for Agriculture',
      description: 'Illegal clearing of protected Mediterranean scrubland for olive grove expansion. Native vegetation destroyed, erosion risk increased.',
      type: ReportType.DEFORESTATION,
      status: ReportStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      location: 'Rural Crete',
      latitude: 35.2401,
      longitude: 24.8093,
      address: 'Protected Natural Area, Heraklion Prefecture, Crete, Greece',
      incidentDate: new Date('2024-01-05T10:00:00'),
      reportNumber: 'GR-CR-2024-001',
      authorId: users.officer1.id,
      assigneeId: users.analyst1.id,
      tags: JSON.stringify(['greece', 'crete', 'land-clearing', 'agriculture', 'erosion-risk']),
      metadata: JSON.stringify({
        clearedArea: '3.8 hectares',
        vegetationType: 'Mediterranean scrubland',
        erosionRisk: 'High',
        ownerStatus: 'Under investigation'
      }),
      photos: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449',
            thumbnail: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=200',
            caption: 'Cleared Mediterranean scrubland',
            latitude: 35.2401,
            longitude: 24.8093,
            takenAt: new Date('2024-01-05T10:30:00'),
            aiAnalysis: JSON.stringify({
              detected: ['land_clearing', 'vegetation_removal', 'soil_exposure'],
              confidence: 0.91,
              clearingMethod: 'mechanical',
              erosionRisk: 'high'
            })
          }
        ]
      }
    }
  }));

  reports.push(await prisma.report.create({
    data: {
      title: 'Soil Erosion Following Land Clearing',
      description: 'Significant soil erosion observed after recent land clearing. Heavy rainfall has caused gullying and sediment runoff into nearby streams.',
      type: ReportType.POLLUTION,
      status: ReportStatus.UNDER_REVIEW,
      priority: Priority.MEDIUM,
      location: 'Crete Agricultural Zone',
      latitude: 35.2425,
      longitude: 24.8110,
      address: 'Rural Heraklion, Crete, Greece',
      incidentDate: new Date('2024-01-14T16:00:00'),
      reportNumber: 'GR-CR-2024-002',
      authorId: users.citizen3.id,
      assigneeId: users.officer2.id,
      tags: JSON.stringify(['greece', 'erosion', 'water-pollution', 'sediment'])
    }
  }));

  reports.push(await prisma.report.create({
    data: {
      title: 'Native Vegetation Destruction - Crete',
      description: 'Protected Mediterranean plants cleared for agricultural expansion.',
      type: ReportType.DEFORESTATION,
      status: ReportStatus.SUBMITTED,
      priority: Priority.HIGH,
      location: 'Crete Protected Area',
      latitude: 35.2410,
      longitude: 24.8085,
      address: 'Protected Scrubland, Crete, Greece',
      incidentDate: new Date('2024-01-15T10:00:00'),
      reportNumber: 'GR-CR-2024-003',
      authorId: users.officer1.id,
      tags: JSON.stringify(['greece', 'vegetation', 'protected-species'])
    }
  }));

  reports.push(await prisma.report.create({
    data: {
      title: 'Water Runoff Contamination - Crete',
      description: 'Pesticides and fertilizers from cleared land entering water systems.',
      type: ReportType.WATER_QUALITY,
      status: ReportStatus.IN_PROGRESS,
      priority: Priority.MEDIUM,
      location: 'Crete Watershed',
      latitude: 35.2395,
      longitude: 24.8100,
      address: 'Agricultural Runoff Zone, Crete, Greece',
      incidentDate: new Date('2024-01-16T14:30:00'),
      reportNumber: 'GR-CR-2024-004',
      authorId: users.officer2.id,
      assigneeId: users.analyst2.id,
      tags: JSON.stringify(['greece', 'water-contamination', 'agriculture'])
    }
  }));

  reports.push(await prisma.report.create({
    data: {
      title: 'Illegal Olive Grove Expansion - Crete',
      description: 'Unauthorized expansion of olive groves into protected land.',
      type: ReportType.DEFORESTATION,
      status: ReportStatus.UNDER_REVIEW,
      priority: Priority.HIGH,
      location: 'Crete Olive Cultivation',
      latitude: 35.2415,
      longitude: 24.8075,
      address: 'Rural Expansion Zone, Crete, Greece',
      incidentDate: new Date('2024-01-17T11:00:00'),
      reportNumber: 'GR-CR-2024-005',
      authorId: users.citizen2.id,
      tags: JSON.stringify(['greece', 'illegal-expansion', 'agriculture'])
    }
  }));

  // ========================================
  // CASE STUDY 4: Barcelona Urban Beaches, Spain
  // Safeguarding beaches through citizen engagement
  // ========================================
  console.log('  📍 Case Study 4: Barcelona, Spain');

  reports.push(await prisma.report.create({
    data: {
      title: 'Beach Water Quality Decline - Barceloneta',
      description: 'Citizen science monitoring reveals declining water quality at Barceloneta Beach. E. coli levels above safe swimming thresholds.',
      type: ReportType.WATER_QUALITY,
      status: ReportStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      location: 'Barceloneta Beach',
      latitude: 41.3809,
      longitude: 2.1909,
      address: 'Barceloneta Beach, Barcelona, Spain',
      incidentDate: new Date('2024-01-11T08:00:00'),
      reportNumber: 'ES-BCN-2024-001',
      authorId: users.citizen1.id,
      assigneeId: users.analyst2.id,
      tags: JSON.stringify(['spain', 'barcelona', 'water-quality', 'beach', 'citizen-science']),
      metadata: JSON.stringify({
        eColiLevel: 420,
        safeLimit: 250,
        beachStatus: 'Swimming not advised',
        citizenMonitors: 12
      }),
      photos: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19',
            thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200',
            caption: 'Water sample collection at Barceloneta',
            latitude: 41.3809,
            longitude: 2.1909,
            takenAt: new Date('2024-01-11T08:30:00'),
            aiAnalysis: JSON.stringify({
              detected: ['water_discoloration', 'turbidity', 'citizen_monitoring'],
              confidence: 0.86,
              waterQuality: 'poor'
            })
          }
        ]
      }
    }
  }));

  reports.push(await prisma.report.create({
    data: {
      title: 'Marine Plastic Debris Accumulation',
      description: 'Significant accumulation of plastic waste along Barcelona beaches following storm event. Citizen cleanup organized.',
      type: ReportType.WASTE,
      status: ReportStatus.RESOLVED,
      priority: Priority.MEDIUM,
      location: 'Mar Bella Beach',
      latitude: 41.4036,
      longitude: 2.2069,
      address: 'Mar Bella Beach, Barcelona, Spain',
      incidentDate: new Date('2024-01-09T12:00:00'),
      reportNumber: 'ES-BCN-2024-002',
      authorId: users.citizen2.id,
      assigneeId: users.officer1.id,
      tags: JSON.stringify(['spain', 'barcelona', 'plastic-pollution', 'marine-debris', 'cleanup']),
      metadata: JSON.stringify({
        debrisVolume: '2.5 tons',
        volunteers: 85,
        cleanupDate: '2024-01-10',
        recyclablePercentage: 65
      })
    }
  }));

  // ========================================
  // CASE STUDY 5: East Devon Catchment, UK
  // Mitigating agricultural impacts on water quality
  // ========================================
  console.log('  📍 Case Study 5: East Devon, UK');

  reports.push(await prisma.report.create({
    data: {
      title: 'Agricultural Runoff Contamination',
      description: 'Excessive nutrient pollution detected in East Devon watercourse. Agricultural runoff from nearby farms causing algal blooms and fish kills.',
      type: ReportType.WATER_QUALITY,
      status: ReportStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      location: 'East Devon River Catchment',
      latitude: 50.7184,
      longitude: -3.5339,
      address: 'River Otter Catchment, East Devon, UK',
      incidentDate: new Date('2024-01-07T11:00:00'),
      reportNumber: 'UK-ED-2024-001',
      authorId: users.officer2.id,
      assigneeId: users.analyst1.id,
      tags: JSON.stringify(['uk', 'east-devon', 'agricultural-runoff', 'water-pollution', 'nutrients']),
      metadata: JSON.stringify({
        nitrateLevel: 85,
        phosphateLevel: 3.2,
        safeLimit: 'Exceeded',
        affectedWaterway: 'River Otter',
        farmlandArea: '250 hectares'
      }),
      photos: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82',
            thumbnail: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=200',
            caption: 'Algal bloom in river from agricultural runoff',
            latitude: 50.7184,
            longitude: -3.5339,
            takenAt: new Date('2024-01-07T11:30:00'),
            aiAnalysis: JSON.stringify({
              detected: ['algal_bloom', 'water_discoloration', 'agricultural_runoff'],
              confidence: 0.88,
              pollutionSource: 'agricultural',
              severity: 'high'
            })
          }
        ]
      }
    }
  }));

  reports.push(await prisma.report.create({
    data: {
      title: 'Fish Kill Event - East Devon',
      description: 'Mass fish mortality event reported in East Devon stream. Over 500 fish found dead, likely due to oxygen depletion from algal bloom.',
      type: ReportType.POLLUTION,
      status: ReportStatus.UNDER_REVIEW,
      priority: Priority.CRITICAL,
      location: 'Devon Stream',
      latitude: 50.7200,
      longitude: -3.5360,
      address: 'East Devon Stream Network, UK',
      incidentDate: new Date('2024-01-09T07:00:00'),
      reportNumber: 'UK-ED-2024-002',
      authorId: users.citizen1.id,
      assigneeId: users.officer3.id,
      tags: JSON.stringify(['uk', 'fish-kill', 'oxygen-depletion', 'ecosystem-damage'])
    }
  }));

  // ========================================
  // CASE STUDY 6: Puglia Region, Italy
  // Combating waste dumping and uncontrolled fires
  // ========================================
  console.log('  📍 Case Study 6: Puglia, Italy');

  reports.push(await prisma.report.create({
    data: {
      title: 'Illegal Waste Burning - Puglia Agricultural Area',
      description: 'Uncontrolled burning of agricultural and plastic waste detected. Toxic smoke affecting nearby communities. Multiple fire incidents reported.',
      type: ReportType.AIR_QUALITY,
      status: ReportStatus.IN_PROGRESS,
      priority: Priority.CRITICAL,
      location: 'Puglia Agricultural Zone',
      latitude: 40.8359,
      longitude: 17.5872,
      address: 'Rural Puglia, Southern Italy',
      incidentDate: new Date('2024-01-06T15:00:00'),
      reportNumber: 'IT-PG-2024-001',
      authorId: users.officer1.id,
      assigneeId: users.analyst2.id,
      tags: JSON.stringify(['italy', 'puglia', 'waste-burning', 'toxic-smoke', 'illegal-fire']),
      metadata: JSON.stringify({
        fireCount: 8,
        affectedArea: '12 hectares',
        materialsDetected: ['Plastic', 'Agricultural waste', 'Rubber'],
        windDirection: 'NW',
        populationAtRisk: 3000
      }),
      photos: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59',
            thumbnail: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=200',
            caption: 'Illegal waste fire producing toxic smoke',
            latitude: 40.8359,
            longitude: 17.5872,
            takenAt: new Date('2024-01-06T15:30:00'),
            aiAnalysis: JSON.stringify({
              detected: ['waste_fire', 'toxic_smoke', 'plastic_burning'],
              confidence: 0.93,
              toxicityLevel: 'high',
              fireIntensity: 'severe'
            })
          }
        ]
      }
    }
  }));

  reports.push(await prisma.report.create({
    data: {
      title: 'Illegal Dumping Site - Puglia Countryside',
      description: 'Large illegal dump site discovered in rural Puglia. Mixed waste including hazardous materials, construction debris, and household waste.',
      type: ReportType.WASTE,
      status: ReportStatus.SUBMITTED,
      priority: Priority.HIGH,
      location: 'Puglia Rural Area',
      latitude: 40.8380,
      longitude: 17.5900,
      address: 'Rural Road, Puglia Region, Italy',
      incidentDate: new Date('2024-01-12T10:00:00'),
      reportNumber: 'IT-PG-2024-002',
      authorId: users.citizen2.id,
      tags: JSON.stringify(['italy', 'puglia', 'illegal-dumping', 'hazardous-waste']),
      metadata: JSON.stringify({
        wasteVolume: '150 cubic meters',
        hazardousMaterials: true,
        accessibilityRating: 'Remote location'
      })
    }
  }));

  // ========================================
  // CASE STUDY 7: Amsterdam, Netherlands
  // Enhancing biodiversity and ecosystem services
  // ========================================
  console.log('  📍 Case Study 7: Amsterdam, Netherlands');

  reports.push(await prisma.report.create({
    data: {
      title: 'Urban Green Space Degradation',
      description: 'Decline in biodiversity observed in Amsterdam urban park. Native plant species being outcompeted by invasive species. Requires habitat restoration.',
      type: ReportType.WILDLIFE,
      status: ReportStatus.IN_PROGRESS,
      priority: Priority.MEDIUM,
      location: 'Amsterdamse Bos',
      latitude: 52.3376,
      longitude: 4.8300,
      address: 'Amsterdamse Bos, Amsterdam, Netherlands',
      incidentDate: new Date('2024-01-04T09:00:00'),
      reportNumber: 'NL-AMS-2024-001',
      authorId: users.officer3.id,
      assigneeId: users.analyst1.id,
      tags: JSON.stringify(['netherlands', 'amsterdam', 'biodiversity', 'invasive-species', 'habitat-restoration']),
      metadata: JSON.stringify({
        parkArea: '45 hectares',
        invasiveSpecies: ['Japanese knotweed', 'Himalayan balsam'],
        nativePlantLoss: '35%',
        birdSpeciesDecline: 12
      }),
      photos: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b',
            thumbnail: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=200',
            caption: 'Invasive species overtaking native vegetation',
            latitude: 52.3376,
            longitude: 4.8300,
            takenAt: new Date('2024-01-04T09:30:00'),
            aiAnalysis: JSON.stringify({
              detected: ['invasive_species', 'vegetation_stress', 'habitat_degradation'],
              confidence: 0.87,
              biodiversityScore: 'declining'
            })
          }
        ]
      }
    }
  }));

  reports.push(await prisma.report.create({
    data: {
      title: 'Urban Canal Water Quality Decline',
      description: 'Amsterdam canal system showing signs of pollution. Reduced water clarity, debris accumulation, and declining aquatic life.',
      type: ReportType.WATER_QUALITY,
      status: ReportStatus.UNDER_REVIEW,
      priority: Priority.MEDIUM,
      location: 'Amsterdam Canal Ring',
      latitude: 52.3667,
      longitude: 4.8945,
      address: 'Canal Ring, Amsterdam City Center, Netherlands',
      incidentDate: new Date('2024-01-11T14:00:00'),
      reportNumber: 'NL-AMS-2024-002',
      authorId: users.citizen3.id,
      assigneeId: users.officer2.id,
      tags: JSON.stringify(['netherlands', 'amsterdam', 'canal', 'water-quality', 'urban-pollution'])
    }
  }));

  // ========================================
  // CASE STUDY 8: Flanders, Belgium
  // Improving soil remediation
  // ========================================
  console.log('  📍 Case Study 8: Flanders, Belgium');

  reports.push(await prisma.report.create({
    data: {
      title: 'Historical Industrial Soil Contamination',
      description: 'Legacy industrial contamination detected at former factory site in Flanders. Heavy metal contamination requires soil remediation before redevelopment.',
      type: ReportType.POLLUTION,
      status: ReportStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      location: 'Antwerp Industrial Zone',
      latitude: 51.2194,
      longitude: 4.4025,
      address: 'Former Industrial Site, Antwerp, Flanders, Belgium',
      incidentDate: new Date('2024-01-03T10:00:00'),
      reportNumber: 'BE-FL-2024-001',
      authorId: users.officer1.id,
      assigneeId: users.analyst2.id,
      tags: JSON.stringify(['belgium', 'flanders', 'soil-contamination', 'heavy-metals', 'remediation']),
      metadata: JSON.stringify({
        contaminatedArea: '8 hectares',
        contaminants: ['Lead', 'Arsenic', 'Cadmium', 'Mercury'],
        concentrationLevel: '15x safe limits',
        remediationRequired: true,
        estimatedCost: '€2.5 million'
      }),
      photos: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
            thumbnail: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200',
            caption: 'Contaminated soil at former industrial site',
            latitude: 51.2194,
            longitude: 4.4025,
            takenAt: new Date('2024-01-03T10:30:00'),
            aiAnalysis: JSON.stringify({
              detected: ['soil_contamination', 'industrial_waste', 'heavy_metals'],
              confidence: 0.90,
              contaminationLevel: 'severe',
              remediationPriority: 'high'
            })
          }
        ]
      }
    }
  }));

  reports.push(await prisma.report.create({
    data: {
      title: 'Agricultural Soil Degradation - Flanders',
      description: 'Long-term intensive farming has led to soil degradation in Flanders agricultural region. Soil structure loss and reduced fertility observed.',
      type: ReportType.POLLUTION,
      status: ReportStatus.SUBMITTED,
      priority: Priority.MEDIUM,
      location: 'Flanders Agricultural Belt',
      latitude: 51.0500,
      longitude: 3.7304,
      address: 'Agricultural Region, West Flanders, Belgium',
      incidentDate: new Date('2024-01-13T08:00:00'),
      reportNumber: 'BE-FL-2024-002',
      authorId: users.citizen1.id,
      tags: JSON.stringify(['belgium', 'soil-degradation', 'agriculture', 'sustainability']),
      metadata: JSON.stringify({
        affectedFarmland: '120 hectares',
        soilOrganicMatter: 'Below 2%',
        erosionRate: 'High',
        sustainablePracticesNeeded: true
      })
    }
  }));

  console.log(`  ✅ Created ${reports.length} reports for 8 pilot case study locations`);

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

  console.log('🤖 Creating AI analysis jobs for pilot locations...');

  // Create AI analysis jobs with fake predictions
  await prisma.analysisJob.createMany({
    data: [
      // Valle Galeria, Italy - Waste Detection
      {
        type: AnalysisType.POLLUTION_DETECTION,
        status: AnalysisStatus.COMPLETED,
        priority: Priority.CRITICAL,
        reportId: reports[0].id, // Valle Galeria illegal dumping
        inputData: JSON.stringify({
          images: ['valle_galeria_dump.jpg'],
          location: { lat: 41.8697, lng: 12.3526 },
          analysisArea: '500m radius'
        }),
        startedAt: new Date('2024-01-10T12:00:00'),
        completedAt: new Date('2024-01-10T12:08:00'),
        progress: 100,
        result: JSON.stringify({
          pollutionType: 'toxic_waste',
          severity: 'critical',
          affectedArea: '2.5 hectares',
          estimatedVolume: '500 cubic meters',
          healthRisk: 'severe',
          recommendations: ['Immediate evacuation of area', 'Deploy hazmat specialists', 'Soil contamination testing', 'Water source protection']
        }),
        confidence: 0.89,
        detections: JSON.stringify([
          { type: 'illegal_dump_site', bbox: [100, 120, 450, 480], confidence: 0.91, severity: 'critical' },
          { type: 'toxic_waste', bbox: [150, 200, 400, 420], confidence: 0.87 },
          { type: 'soil_contamination', bbox: [80, 300, 500, 550], confidence: 0.89 }
        ]),
        suggestions: JSON.stringify([
          'Establish 500m safety perimeter',
          'Conduct soil and groundwater testing',
          'Deploy waste removal specialists',
          'Monitor air quality continuously',
          'Notify local health authorities'
        ]),
        explanation: JSON.stringify({
          factors: [
            { name: 'Visual contamination indicators', weight: 0.35, value: 'Multiple waste types detected including industrial solvents' },
            { name: 'Spatial pattern analysis', weight: 0.30, value: 'Dump site shows organized disposal indicating repeated activity' },
            { name: 'Environmental risk assessment', weight: 0.35, value: 'Proximity to residential areas increases health risk' }
          ],
          confidence_breakdown: {
            visual: 0.91,
            contextual: 0.88,
            historical: 0.89,
            satellite_correlation: 0.90
          }
        }),
        heatmapUrl: 'https://example.com/heatmaps/valle-galeria-001.png',
        requestedBy: users.analyst1.id,
      },

      // Brasov, Romania - Deforestation Detection
      {
        type: AnalysisType.DAMAGE_ASSESSMENT,
        status: AnalysisStatus.COMPLETED,
        priority: Priority.HIGH,
        reportId: reports[2].id, // Brasov illegal logging
        inputData: JSON.stringify({
          satelliteImages: ['sentinel2_brasov_t1.tif', 'sentinel2_brasov_t2.tif'],
          location: { lat: 45.6579, lng: 25.6012 },
          timeComparison: '2023-12 vs 2024-01',
          protectedArea: true
        }),
        startedAt: new Date('2024-01-08T09:00:00'),
        completedAt: new Date('2024-01-08T09:15:00'),
        progress: 100,
        result: JSON.stringify({
          deforestationType: 'clear_cutting',
          affectedArea: '5.2 hectares',
          estimatedTreeLoss: 450,
          forestType: 'Mixed deciduous (Oak, Beech, Pine)',
          protectionViolation: 'Natura 2000 site',
          carbonLoss: '23 tonnes CO2',
          recommendations: ['Immediate logging cessation', 'Deploy forest rangers', 'Legal prosecution', 'Reforestation plan required']
        }),
        confidence: 0.94,
        detections: JSON.stringify([
          { type: 'clear_cut_area', bbox: [200, 180, 650, 580], confidence: 0.96, area_hectares: 5.2 },
          { type: 'logging_equipment', bbox: [300, 250, 380, 320], confidence: 0.92 },
          { type: 'access_road', bbox: [150, 400, 700, 450], confidence: 0.90 },
          { type: 'tree_stumps', bbox: [250, 200, 600, 500], confidence: 0.94 }
        ]),
        suggestions: JSON.stringify([
          'Deploy drone surveillance for ongoing monitoring',
          'Establish checkpoints on access roads',
          'GPS tagging of remaining valuable trees',
          'Community forest watch program',
          'Immediate reforestation with native species'
        ]),
        explanation: JSON.stringify({
          factors: [
            { name: 'NDVI change detection', weight: 0.40, value: 'Vegetation index dropped by 78% in target area' },
            { name: 'Canopy cover analysis', weight: 0.35, value: 'Forest canopy reduced from 85% to 12%' },
            { name: 'Temporal comparison', weight: 0.25, value: 'Clear-cutting occurred between Dec 2023 and Jan 2024' }
          ],
          confidence_breakdown: {
            satellite_analysis: 0.96,
            ground_truth: 0.94,
            temporal_correlation: 0.92,
            protected_area_violation: 1.00
          }
        }),
        heatmapUrl: 'https://example.com/heatmaps/brasov-deforestation-001.png',
        requestedBy: users.analyst2.id,
      },

      // Crete, Greece - Land Clearing Detection
      {
        type: AnalysisType.DAMAGE_ASSESSMENT,
        status: AnalysisStatus.COMPLETED,
        priority: Priority.HIGH,
        reportId: reports[4].id, // Crete land clearing
        inputData: JSON.stringify({
          satelliteImages: ['planet_crete_jan.tif'],
          location: { lat: 35.2401, lng: 24.8093 },
          vegetationType: 'mediterranean_scrubland'
        }),
        startedAt: new Date('2024-01-05T11:00:00'),
        completedAt: new Date('2024-01-05T11:10:00'),
        progress: 100,
        result: JSON.stringify({
          clearingType: 'agricultural_expansion',
          affectedArea: '3.8 hectares',
          vegetationType: 'Mediterranean scrubland',
          erosionRisk: 'high',
          soilExposure: '95%',
          recommendations: ['Stop further clearing', 'Erosion control measures', 'Vegetation restoration', 'Legal enforcement']
        }),
        confidence: 0.91,
        detections: JSON.stringify([
          { type: 'land_clearing', bbox: [120, 150, 520, 480], confidence: 0.93 },
          { type: 'soil_exposure', bbox: [130, 160, 510, 470], confidence: 0.95 },
          { type: 'mechanical_clearing', bbox: [200, 220, 450, 400], confidence: 0.89 }
        ]),
        suggestions: JSON.stringify([
          'Immediate terracing to prevent erosion',
          'Sediment barriers installation',
          'Native vegetation replanting',
          'Establish buffer zones',
          'Monitor soil runoff after rain events'
        ]),
        explanation: JSON.stringify({
          factors: [
            { name: 'Vegetation removal extent', weight: 0.40, value: '95% native scrubland removed' },
            { name: 'Soil exposure analysis', weight: 0.35, value: 'High erosion vulnerability detected' },
            { name: 'Slope and topography', weight: 0.25, value: '12-degree slope increases runoff risk' }
          ],
          confidence_breakdown: {
            visual: 0.93,
            erosion_modeling: 0.91,
            vegetation_analysis: 0.90
          }
        }),
        heatmapUrl: 'https://example.com/heatmaps/crete-clearing-001.png',
        requestedBy: users.analyst1.id,
      },

      // Barcelona, Spain - Water Quality Analysis
      {
        type: AnalysisType.POLLUTION_DETECTION,
        status: AnalysisStatus.COMPLETED,
        priority: Priority.HIGH,
        reportId: reports[6].id, // Barcelona beach water quality
        inputData: JSON.stringify({
          waterSamples: ['barceloneta_sample_001.csv'],
          location: { lat: 41.3809, lng: 2.1909 },
          citizenScienceData: true,
          sampleCount: 12
        }),
        startedAt: new Date('2024-01-11T09:00:00'),
        completedAt: new Date('2024-01-11T09:25:00'),
        progress: 100,
        result: JSON.stringify({
          waterQuality: 'poor',
          eColiLevel: 420,
          safeLimit: 250,
          exceedancePercentage: 68,
          pollutionSource: 'likely_sewage',
          swimmingSafe: false,
          recommendations: ['Issue no-swim advisory', 'Identify pollution source', 'Increase water testing frequency', 'Public health notification']
        }),
        confidence: 0.86,
        detections: JSON.stringify([
          { type: 'bacterial_contamination', value: 420, unit: 'CFU/100ml', confidence: 0.89 },
          { type: 'turbidity_increase', value: 12.5, unit: 'NTU', confidence: 0.84 },
          { type: 'water_discoloration', severity: 'moderate', confidence: 0.85 }
        ]),
        suggestions: JSON.stringify([
          'Deploy rapid response water testing team',
          'Trace sewage overflow points',
          'Install warning signage at beach',
          'Coordinate with sanitation department',
          'Establish citizen monitoring network',
          'Daily water quality updates'
        ]),
        explanation: JSON.stringify({
          factors: [
            { name: 'Bacterial indicators', weight: 0.45, value: 'E. coli levels 68% above safe threshold' },
            { name: 'Citizen science validation', weight: 0.30, value: '12 independent samples confirm contamination' },
            { name: 'Environmental conditions', weight: 0.25, value: 'Recent storm may have caused sewage overflow' }
          ],
          confidence_breakdown: {
            lab_analysis: 0.92,
            citizen_data: 0.82,
            visual_assessment: 0.84
          }
        }),
        heatmapUrl: 'https://example.com/heatmaps/barcelona-water-001.png',
        requestedBy: users.analyst2.id,
      },

      // East Devon, UK - Agricultural Runoff
      {
        type: AnalysisType.POLLUTION_DETECTION,
        status: AnalysisStatus.COMPLETED,
        priority: Priority.HIGH,
        reportId: reports[8].id, // East Devon agricultural runoff
        inputData: JSON.stringify({
          waterSamples: ['river_otter_samples.csv'],
          location: { lat: 50.7184, lng: -3.5339 },
          nutrientAnalysis: true
        }),
        startedAt: new Date('2024-01-07T12:00:00'),
        completedAt: new Date('2024-01-07T12:20:00'),
        progress: 100,
        result: JSON.stringify({
          pollutionType: 'agricultural_runoff',
          nitrateLevel: 85,
          phosphateLevel: 3.2,
          algalBloomRisk: 'high',
          oxygenDepletion: 'moderate',
          recommendations: ['Farm practice audit', 'Buffer zone enforcement', 'Nutrient management plan', 'Wetland restoration']
        }),
        confidence: 0.88,
        detections: JSON.stringify([
          { type: 'nutrient_pollution', severity: 'high', confidence: 0.91 },
          { type: 'algal_bloom_precursor', risk_level: 'high', confidence: 0.86 },
          { type: 'agricultural_indicator', source: 'livestock_farming', confidence: 0.87 }
        ]),
        suggestions: JSON.stringify([
          'Implement vegetated buffer strips (10m minimum)',
          'Manure management improvements on upstream farms',
          'Wetland creation for nutrient filtering',
          'Farmer education on best practices',
          'Regular monitoring downstream'
        ]),
        explanation: JSON.stringify({
          factors: [
            { name: 'Nitrate concentration', weight: 0.40, value: '85 mg/L significantly exceeds EU standard of 50 mg/L' },
            { name: 'Phosphate levels', weight: 0.35, value: '3.2 mg/L indicates agricultural source' },
            { name: 'Land use correlation', weight: 0.25, value: '250 hectares of intensive farmland upstream' }
          ],
          confidence_breakdown: {
            chemical_analysis: 0.92,
            source_attribution: 0.85,
            impact_assessment: 0.87
          }
        }),
        heatmapUrl: 'https://example.com/heatmaps/devon-runoff-001.png',
        requestedBy: users.analyst1.id,
      },

      // Puglia, Italy - Waste Fire Detection
      {
        type: AnalysisType.POLLUTION_DETECTION,
        status: AnalysisStatus.COMPLETED,
        priority: Priority.CRITICAL,
        reportId: reports[10].id, // Puglia waste burning
        inputData: JSON.stringify({
          images: ['puglia_fire_thermal.jpg', 'puglia_fire_visible.jpg'],
          location: { lat: 40.8359, lng: 17.5872 },
          fireCount: 8,
          thermalData: true
        }),
        startedAt: new Date('2024-01-06T16:00:00'),
        completedAt: new Date('2024-01-06T16:12:00'),
        progress: 100,
        result: JSON.stringify({
          fireType: 'illegal_waste_burning',
          toxicMaterials: ['plastic', 'rubber', 'agricultural_waste'],
          smokeDispersion: 'NW direction, 5km radius',
          airQualityImpact: 'severe',
          populationExposure: 3000,
          recommendations: ['Immediate fire suppression', 'Evacuate downwind areas', 'Air quality monitoring', 'Identify perpetrators']
        }),
        confidence: 0.93,
        detections: JSON.stringify([
          { type: 'illegal_fire', count: 8, confidence: 0.95 },
          { type: 'plastic_burning', severity: 'high', confidence: 0.92 },
          { type: 'toxic_smoke', dispersion_km: 5, confidence: 0.91 },
          { type: 'waste_pile', volume_estimate: '40 cubic meters', confidence: 0.89 }
        ]),
        suggestions: JSON.stringify([
          'Deploy fire brigade immediately',
          'Establish air quality monitoring stations',
          'Health advisory for affected population',
          'Investigate waste source and perpetrators',
          'Install surveillance cameras in area',
          'Community waste collection programs'
        ]),
        explanation: JSON.stringify({
          factors: [
            { name: 'Thermal signature analysis', weight: 0.35, value: 'Multiple high-temperature points indicate active burning' },
            { name: 'Smoke composition', weight: 0.35, value: 'Black smoke indicates plastic/rubber combustion' },
            { name: 'Pattern recognition', weight: 0.30, value: 'Repeated incidents suggest organized illegal activity' }
          ],
          confidence_breakdown: {
            thermal_imaging: 0.96,
            visual_analysis: 0.92,
            toxicity_assessment: 0.91
          }
        }),
        heatmapUrl: 'https://example.com/heatmaps/puglia-fire-001.png',
        requestedBy: users.analyst2.id,
      },

      // Amsterdam, Netherlands - Biodiversity Assessment
      {
        type: AnalysisType.WILDLIFE_IDENTIFICATION,
        status: AnalysisStatus.COMPLETED,
        priority: Priority.MEDIUM,
        reportId: reports[12].id, // Amsterdam biodiversity
        inputData: JSON.stringify({
          images: ['amsterdamse_bos_vegetation.jpg'],
          location: { lat: 52.3376, lng: 4.8300 },
          parkArea: '45 hectares'
        }),
        startedAt: new Date('2024-01-04T10:00:00'),
        completedAt: new Date('2024-01-04T10:18:00'),
        progress: 100,
        result: JSON.stringify({
          biodiversityStatus: 'declining',
          invasiveSpecies: ['Japanese knotweed', 'Himalayan balsam'],
          nativePlantLoss: '35%',
          habitatQuality: 'degraded',
          recommendations: ['Invasive species removal program', 'Native planting initiative', 'Habitat restoration', 'Ongoing monitoring']
        }),
        confidence: 0.87,
        detections: JSON.stringify([
          { type: 'invasive_japanese_knotweed', coverage: '15%', confidence: 0.91 },
          { type: 'invasive_himalayan_balsam', coverage: '12%', confidence: 0.88 },
          { type: 'native_vegetation_stress', severity: 'moderate', confidence: 0.85 },
          { type: 'habitat_fragmentation', level: 'medium', confidence: 0.84 }
        ]),
        suggestions: JSON.stringify([
          'Immediate removal of Japanese knotweed (legal requirement)',
          'Restore native plant communities',
          'Create pollinator corridors',
          'Install bird nesting boxes',
          'Community biodiversity monitoring program',
          'Educational signage about invasive species'
        ]),
        explanation: JSON.stringify({
          factors: [
            { name: 'Invasive species coverage', weight: 0.40, value: '27% of area affected by invasive plants' },
            { name: 'Native species decline', weight: 0.35, value: '35% reduction in native plant diversity' },
            { name: 'Ecosystem services', weight: 0.25, value: 'Pollination and bird habitat compromised' }
          ],
          confidence_breakdown: {
            species_identification: 0.90,
            coverage_analysis: 0.86,
            biodiversity_index: 0.85
          }
        }),
        heatmapUrl: 'https://example.com/heatmaps/amsterdam-biodiversity-001.png',
        requestedBy: users.analyst1.id,
      },

      // Flanders, Belgium - Soil Contamination
      {
        type: AnalysisType.POLLUTION_DETECTION,
        status: AnalysisStatus.COMPLETED,
        priority: Priority.HIGH,
        reportId: reports[14].id, // Flanders soil contamination
        inputData: JSON.stringify({
          soilSamples: ['antwerp_site_samples.csv'],
          location: { lat: 51.2194, lng: 4.4025 },
          historicalSite: 'former_chemical_plant'
        }),
        startedAt: new Date('2024-01-03T11:00:00'),
        completedAt: new Date('2024-01-03T11:30:00'),
        progress: 100,
        result: JSON.stringify({
          contaminationType: 'heavy_metals',
          contaminants: ['Lead', 'Arsenic', 'Cadmium', 'Mercury'],
          concentrationLevel: '15x safe limits',
          affectedArea: '8 hectares',
          remediationCost: '€2.5 million',
          healthRisk: 'high',
          recommendations: ['Site quarantine', 'Remediation plan required', 'Health risk assessment', 'No development until cleanup']
        }),
        confidence: 0.90,
        detections: JSON.stringify([
          { type: 'lead_contamination', concentration: '2400 mg/kg', safe_limit: '150 mg/kg', confidence: 0.94 },
          { type: 'arsenic_contamination', concentration: '180 mg/kg', safe_limit: '12 mg/kg', confidence: 0.91 },
          { type: 'cadmium_contamination', concentration: '45 mg/kg', safe_limit: '2 mg/kg', confidence: 0.89 },
          { type: 'mercury_contamination', concentration: '12 mg/kg', safe_limit: '0.8 mg/kg', confidence: 0.87 }
        ]),
        suggestions: JSON.stringify([
          'Comprehensive soil excavation and disposal',
          'Phytoremediation for lower concentration areas',
          'Groundwater monitoring wells installation',
          'Vapor intrusion assessment for nearby buildings',
          'Long-term environmental monitoring plan',
          'Community health screening program'
        ]),
        explanation: JSON.stringify({
          factors: [
            { name: 'Heavy metal concentrations', weight: 0.45, value: 'Multiple contaminants at 10-15x safe limits' },
            { name: 'Historical industrial use', weight: 0.30, value: 'Chemical manufacturing 1950-1985' },
            { name: 'Contamination extent', weight: 0.25, value: '8 hectares affected, 2-3m depth' }
          ],
          confidence_breakdown: {
            lab_analysis: 0.96,
            spatial_extent: 0.88,
            risk_assessment: 0.87
          }
        }),
        heatmapUrl: 'https://example.com/heatmaps/flanders-soil-001.png',
        requestedBy: users.analyst2.id,
      },

      // Pattern Analysis - Cross-location trends
      {
        type: AnalysisType.PATTERN_ANALYSIS,
        status: AnalysisStatus.COMPLETED,
        priority: Priority.MEDIUM,
        inputData: JSON.stringify({
          timeRange: '30 days',
          locations: 'all_pilot_sites',
          incidentTypes: ['WASTE', 'DEFORESTATION', 'WATER_QUALITY', 'AIR_QUALITY']
        }),
        startedAt: new Date('2024-01-15T09:00:00'),
        completedAt: new Date('2024-01-15T09:45:00'),
        progress: 100,
        result: JSON.stringify({
          patterns: {
            waste_dumping: 'Concentrated in Italy (Valle Galeria, Puglia)',
            deforestation: 'Active in Eastern Europe (Brasov) and Mediterranean (Crete)',
            water_pollution: 'Agricultural runoff primary concern in UK and Spain',
            soil_issues: 'Legacy contamination in industrial areas (Flanders)'
          },
          trends: [
            'Illegal waste disposal increasing in rural areas',
            'Agricultural pollution affecting multiple water bodies',
            'Climate-related incidents (fires, erosion) rising'
          ],
          recommendations: [
            'Enhanced cross-border information sharing',
            'Targeted enforcement in high-risk areas',
            'Citizen science expansion for early detection',
            'Agricultural best practices training programs'
          ]
        }),
        confidence: 0.85,
        detections: JSON.stringify([
          { pattern: 'illegal_dumping_hotspots', locations: ['Valle Galeria', 'Puglia'], count: 4, confidence: 0.88 },
          { pattern: 'agricultural_impact', locations: ['East Devon', 'Barcelona', 'Flanders'], count: 5, confidence: 0.86 },
          { pattern: 'deforestation_clusters', locations: ['Brasov', 'Crete'], count: 3, confidence: 0.84 }
        ]),
        requestedBy: users.analyst1.id,
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

  console.log('\n✅ Seed completed successfully!');
  console.log(`
  ════════════════════════════════════════════════════════════
  🌍 PLAZA TOOLKIT - 8 PILOT CASE STUDY LOCATIONS 🌍
  ════════════════════════════════════════════════════════════

  Created:
  ────────────────────────────────────────────────────────────
  👥 ${Object.keys(users).length} Users (Officers, Analysts, Prosecutors, Citizens)
  📋 ${reports.length} Reports across 8 European pilot locations:
     • Valle Galeria, Italy (waste/health)
     • Brasov, Romania (forest management)
     • Crete, Greece (land clearing)
     • Barcelona, Spain (beach protection)
     • East Devon, UK (water quality)
     • Puglia, Italy (waste fires)
     • Amsterdam, Netherlands (biodiversity)
     • Flanders, Belgium (soil remediation)

  🤖 9 AI Analysis Jobs with fake predictions
  📁 2 Case investigations
  📸 Multiple photos with AI detection metadata
  🔬 Evidence, notes, activities, and notifications

  ════════════════════════════════════════════════════════════
  🔑 LOGIN CREDENTIALS
  ════════════════════════════════════════════════════════════
  Officer:     martinez@plaza.gov / password123
  Analyst:     analyst@plaza.gov / password123
  Prosecutor:  prosecutor@plaza.gov / password123
  Admin:       admin@plaza.gov / password123
  Citizen:     john.doe@email.com / password123

  ════════════════════════════════════════════════════════════
  🗺️  MAP FUNCTIONALITY
  ════════════════════════════════════════════════════════════
  Navigate to: /dashboard/map
  - View all 16 reports across Europe
  - Explore AI analysis results with confidence scores
  - Filter by location, type, priority, and status
  - Click on markers to see detailed predictions
  - View heatmap and cluster visualizations

  ════════════════════════════════════════════════════════════
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