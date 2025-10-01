# PLAZA Toolkit - Claude Code Instructions
**Next.js Monorepo with shadcn/ui Implementation**

## Project Overview
Build a role-based environmental incident investigation platform with AI analysis capabilities, explainable AI (xAI), and provenance tracking. Use mock data for all external dependencies (T3.1-T3.4).

---

## 1. Working with Existing Monorepo + Database Setup

### Expected Monorepo Structure
```
plaza-toolkit/                  # Your existing monorepo
├── apps/
│   ├── web/                    # Main web application (Officers, Analysts, Prosecutors, Admin)
│   ├── citizen/                # Citizen reporting app (mobile-first)
│   └── docs/                   # Documentation site (optional)
├── packages/
│   ├── ui/                     # Shared UI components (shadcn/ui + custom)
│   ├── lib/                    # Shared utilities, hooks, helpers
│   ├── config/                 # Shared configs (TypeScript, ESLint, Tailwind)
│   ├── types/                  # Shared TypeScript types
│   ├── database/               # NEW: Prisma database package
│   └── mock-data/              # REMOVED: We'll use real database with seed data
├── package.json
├── turbo.json
├── pnpm-workspace.yaml         # If using pnpm
└── README.md
```

### Database Package Setup with Prisma + SQLite

#### 1. Create Database Package
```bash
cd packages
mkdir database && cd database
pnpm init

# Package name should be @plaza/database
```

#### 2. Install Prisma Dependencies
```bash
# From packages/database directory
pnpm add @prisma/client
pnpm add -D prisma tsx @faker-js/faker
```

#### 3. Initialize Prisma
```bash
# From packages/database directory
npx prisma init --datasource-provider sqlite
```

This creates:
- `prisma/schema.prisma` - Database schema
- `.env` - Environment variables

#### 4. Update packages/database/package.json
```json
{
  "name": "@plaza/database",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio",
    "db:reset": "prisma migrate reset --force"
  },
  "dependencies": {
    "@prisma/client": "^5.7.0"
  },
  "devDependencies": {
    "@faker-js/faker": "^8.3.1",
    "prisma": "^5.7.0",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3"
  }
}
```

#### 5. Install Dependencies in Main Apps
```bash
# From apps/web directory
cd apps/web
pnpm add @plaza/database

# Install other required dependencies if not already present
pnpm add @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select
pnpm add @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-avatar
pnpm add class-variance-authority clsx tailwind-merge lucide-react
pnpm add date-fns recharts react-hook-form zod @hookform/resolvers zustand
pnpm add @tanstack/react-query mapbox-gl react-map-gl
pnpm add -D @types/mapbox-gl

# If shadcn/ui not initialized yet
npx shadcn-ui@latest init
```

#### 6. Install in Citizen App
```bash
cd apps/citizen
pnpm add @plaza/database
# Add other dependencies as needed
```

---

## 2. Database Schema Definition

### `packages/database/prisma/schema.prisma`
```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// ================================
// User Management & Authentication
// ================================

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  password  String   // In production, this would be hashed
  role      UserRole @default(CITIZEN)
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  lastLogin DateTime?

  // Relations
  submittedReports Report[]          @relation("ReportSubmitter")
  assignedReports  Report[]          @relation("AssignedOfficer")
  createdCases     Case[]            @relation("CaseCreator")
  assignedCases    CaseOfficer[]
  analysisJobs     AnalysisJob[]
  schedules        Schedule[]
  notifications    Notification[]
  roleRequests     RoleRequest[]
  statusChanges    StatusChange[]
  evidence         Evidence[]
  timelineEvents   TimelineEvent[]

  @@map("users")
}

enum UserRole {
  CITIZEN
  OFFICER
  ANALYST
  PROSECUTOR
  ADMIN
}

model RoleRequest {
  id            String          @id @default(uuid())
  userId        String
  user          User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  currentRole   UserRole
  requestedRole UserRole
  justification String
  status        RequestStatus   @default(PENDING)
  requestedAt   DateTime        @default(now())
  reviewedBy    String?
  reviewedAt    DateTime?
  reviewNotes   String?

  @@map("role_requests")
}

enum RequestStatus {
  PENDING
  APPROVED
  REJECTED
}

// ================================
// Reports (T3.1 - Citizen Science)
// ================================

model Report {
  id          String       @id @default(uuid())
  citizenId   String
  citizen     User         @relation("ReportSubmitter", fields: [citizenId], references: [id], onDelete: Cascade)
  type        ReportType
  status      ReportStatus @default(PENDING)
  title       String
  description String
  latitude    Float
  longitude   Float
  address     String?
  submittedAt DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  assignedTo  String?
  officer     User?        @relation("AssignedOfficer", fields: [assignedTo], references: [id], onDelete: SetNull)
  priority    Priority?    @default(MEDIUM)

  // Relations
  photos         ReportPhoto[]
  statusHistory  StatusChange[]
  evidence       Evidence[]

  @@index([status])
  @@index([type])
  @@index([citizenId])
  @@index([assignedTo])
  @@map("reports")
}

enum ReportType {
  ILLEGAL_DUMPING
  WATER_POLLUTION
  AIR_POLLUTION
  OIL_SPILL
  HAZARDOUS_WASTE
  NOISE_COMPLAINT
  OTHER
}

enum ReportStatus {
  PENDING
  UNDER_REVIEW
  ACCEPTED
  REJECTED
  ESCALATED
  RESOLVED
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}

model ReportPhoto {
  id       String @id @default(uuid())
  reportId String
  report   Report @relation(fields: [reportId], references: [id], onDelete: Cascade)
  url      String
  caption  String?
  order    Int    @default(0)

  @@map("report_photos")
}

model StatusChange {
  id        String       @id @default(uuid())
  reportId  String
  report    Report       @relation(fields: [reportId], references: [id], onDelete: Cascade)
  status    ReportStatus
  changedBy String
  user      User         @relation(fields: [changedBy], references: [id], onDelete: Cascade)
  changedAt DateTime     @default(now())
  reason    String?
  notes     String?

  @@map("status_changes")
}

// ================================
// Layers (T3.2 - Data Catalog)
// ================================

model Layer {
  id             String     @id @default(uuid())
  name           String
  type           LayerType
  url            String
  isVisible      Boolean    @default(true)
  opacity        Int        @default(100) // 0-100
  dateAcquired   DateTime?
  resolution     String?
  coverage       Int?       // percentage 0-100
  source         String
  creator        String
  license        String
  datasetVersion String?
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt

  // Provenance
  processingSteps String? // JSON array stored as string

  @@map("layers")
}

enum LayerType {
  EO_IMAGERY
  SENSOR_DATA
  AI_RESULTS
  CITIZEN_REPORTS
}

// ================================
// AI Analysis (T3.3 - AI Results)
// ================================

model AnalysisJob {
  id           String        @id @default(uuid())
  name         String
  status       AnalysisStatus @default(PENDING)
  modelType    ModelType
  modelVersion String
  progress     Int?          // 0-100
  eta          Int?          // seconds
  createdBy    String
  user         User          @relation(fields: [createdBy], references: [id], onDelete: Cascade)
  createdAt    DateTime      @default(now())
  startedAt    DateTime?
  completedAt  DateTime?
  error        String?

  // Area of Interest (stored as JSON)
  aoiType        String // rectangle, circle, polygon
  aoiCoordinates String // JSON array
  aoiArea        Float  // km²
  aoiCenterLat   Float
  aoiCenterLon   Float

  // Time Range
  timeFrom DateTime
  timeTo   DateTime

  // Results Summary (if completed)
  totalDetections   Int?
  avgConfidence     Float?
  highConfidence    Int?
  mediumConfidence  Int?
  lowConfidence     Int?
  heatmapUrl        String?
  rawDataUrl        String?

  // Relations
  detections Detection[]
  scheduleRuns ScheduleRun[]

  @@index([status])
  @@index([createdBy])
  @@index([modelType])
  @@map("analysis_jobs")
}

enum AnalysisStatus {
  PENDING
  RUNNING
  COMPLETED
  FAILED
  CANCELLED
}

enum ModelType {
  WASTE_DETECTION
  COASTAL_ANOMALY
  WATER_POLLUTION
  MULTI_TYPE
}

model Detection {
  id              String   @id @default(uuid())
  jobId           String
  job             AnalysisJob @relation(fields: [jobId], references: [id], onDelete: Cascade)
  type            String
  latitude        Float
  longitude       Float
  confidence      Float    // 0-1
  confidenceLevel String   // high, medium, low
  boundingBox     String?  // JSON array of coordinates
  metadata        String?  // JSON object
  detectedAt      DateTime @default(now())

  // Relations
  xaiExplanation XAIExplanation?
  evidence       Evidence[]

  @@index([jobId])
  @@index([confidenceLevel])
  @@map("detections")
}

// ================================
// xAI (T3.4 - Explainability)
// ================================

model XAIExplanation {
  id                  String   @id @default(uuid())
  detectionId         String   @unique
  detection           Detection @relation(fields: [detectionId], references: [id], onDelete: Cascade)
  explanation         String   // Plain language explanation
  confidence          Float
  confidenceLevel     String   // high, medium, low
  contributingFactors String   // JSON array of {name, score, description}
  modelName           String
  modelVersion        String
  trainingDate        DateTime
  validationAccuracy  Float
  saliencyMapUrl      String?
  similarCases        String?  // JSON array of IDs
  createdAt           DateTime @default(now())

  @@map("xai_explanations")
}

// ================================
// Cases
// ================================

model Case {
  id          String     @id @default(uuid())
  title       String
  status      CaseStatus @default(DRAFT)
  priority    Priority   @default(MEDIUM)
  createdBy   String
  creator     User       @relation("CaseCreator", fields: [createdBy], references: [id], onDelete: Cascade)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  latitude    Float
  longitude   Float
  address     String?
  notes       String?
  summary     String?
  recommendedAction String?

  // Relations
  assignedOfficers CaseOfficer[]
  tags            CaseTag[]
  evidence        Evidence[]
  timeline        TimelineEvent[]

  @@index([status])
  @@index([priority])
  @@index([createdBy])
  @@map("cases")
}

enum CaseStatus {
  DRAFT
  ACTIVE
  ESCALATED
  APPROVED
  CLOSED
}

model CaseOfficer {
  id       String @id @default(uuid())
  caseId   String
  case     Case   @relation(fields: [caseId], references: [id], onDelete: Cascade)
  userId   String
  user     User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  role     String @default("assigned") // lead, support, reviewer
  addedAt  DateTime @default(now())

  @@unique([caseId, userId])
  @@map("case_officers")
}

model CaseTag {
  id     String @id @default(uuid())
  caseId String
  case   Case   @relation(fields: [caseId], references: [id], onDelete: Cascade)
  tag    String

  @@index([caseId])
  @@map("case_tags")
}

model Evidence {
  id          String       @id @default(uuid())
  caseId      String
  case        Case         @relation(fields: [caseId], references: [id], onDelete: Cascade)
  type        EvidenceType
  name        String
  description String?
  addedBy     String
  user        User         @relation(fields: [addedBy], references: [id], onDelete: Cascade)
  addedAt     DateTime     @default(now())
  url         String?
  metadata    String?      // JSON object

  // References
  reportId    String?
  report      Report?      @relation(fields: [reportId], references: [id], onDelete: SetNull)
  detectionId String?
  detection   Detection?   @relation(fields: [detectionId], references: [id], onDelete: SetNull)

  @@index([caseId])
  @@map("evidence")
}

enum EvidenceType {
  REPORT
  PHOTO
  DOCUMENT
  AI_ANALYSIS
  LAYER
  NOTE
}

model TimelineEvent {
  id          String   @id @default(uuid())
  caseId      String
  case        Case     @relation(fields: [caseId], references: [id], onDelete: Cascade)
  type        String
  title       String
  description String?
  timestamp   DateTime @default(now())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  metadata    String?  // JSON object

  @@index([caseId])
  @@index([timestamp])
  @@map("timeline_events")
}

// ================================
// Schedules (Analyst)
// ================================

model Schedule {
  id               String            @id @default(uuid())
  name             String
  status           ScheduleStatus    @default(ACTIVE)
  frequency        ScheduleFrequency
  customCron       String?
  modelType        ModelType
  lookbackDays     Int               @default(7)
  createdBy        String
  user             User              @relation(fields: [createdBy], references: [id], onDelete: Cascade)
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt
  lastRun          DateTime?
  nextRun          DateTime?

  // Area of Interest
  aoiType        String // rectangle, circle, polygon
  aoiCoordinates String // JSON array
  aoiArea        Float  // km²
  aoiCenterLat   Float
  aoiCenterLon   Float

  // Triggers
  triggerNewData           Boolean @default(false)
  triggerSensorThreshold   Boolean @default(false)
  triggerReportCluster     Boolean @default(false)
  thresholdValue           Int?

  // Notifications
  notificationRecipients   String  // JSON array of emails
  notifyOnStart            Boolean @default(true)
  notifyOnComplete         Boolean @default(true)
  notifyOnFailure          Boolean @default(true)
  notifyOnDetectionThreshold Boolean @default(false)
  detectionThreshold       Int?

  // Relations
  runs ScheduleRun[]

  @@index([status])
  @@index([createdBy])
  @@map("schedules")
}

enum ScheduleStatus {
  ACTIVE
  PAUSED
  ERROR
}

enum ScheduleFrequency {
  HOURLY
  EVERY_6_HOURS
  DAILY
  WEEKLY
  CUSTOM
}

model ScheduleRun {
  id          String         @id @default(uuid())
  scheduleId  String
  schedule    Schedule       @relation(fields: [scheduleId], references: [id], onDelete: Cascade)
  startedAt   DateTime       @default(now())
  completedAt DateTime?
  status      AnalysisStatus @default(RUNNING)
  jobId       String?
  job         AnalysisJob?   @relation(fields: [jobId], references: [id], onDelete: SetNull)
  error       String?

  @@index([scheduleId])
  @@map("schedule_runs")
}

// ================================
// Notifications
// ================================

model Notification {
  id          String              @id @default(uuid())
  type        NotificationType
  priority    NotificationPriority @default(NORMAL)
  title       String
  description String
  timestamp   DateTime            @default(now())
  isRead      Boolean             @default(false)
  userId      String
  user        User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  actionUrl   String?
  metadata    String?             // JSON object

  @@index([userId, isRead])
  @@index([timestamp])
  @@map("notifications")
}

enum NotificationType {
  REPORT
  CASE
  JOB
  SYSTEM
  STATUS_CHANGE
}

enum NotificationPriority {
  LOW
  NORMAL
  HIGH
}
```

### `packages/database/.env`
```env
# SQLite Database URL
DATABASE_URL="file:./dev.db"
```

### Add to `.gitignore` (root and packages/database)
```gitignore
# Database
*.db
*.db-journal
/prisma/migrations

# Prisma
.env
```

---

## 3. Database Seeding

### `packages/database/prisma/seed.ts`
```typescript
import { PrismaClient, UserRole, ReportType, ReportStatus, Priority, LayerType, ModelType, AnalysisStatus, CaseStatus, EvidenceType, ScheduleStatus, ScheduleFrequency, NotificationType, NotificationPriority } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// Seed for consistent data
faker.seed(12345);

// Paris coordinates
const PARIS_CENTER = { lat: 48.8566, lon: 2.3522 };

function generateParisLocation() {
  const latOffset = (faker.number.float() - 0.5) * 0.2; // ~20km range
  const lonOffset = (faker.number.float() - 0.5) * 0.2;
  return {
    lat: PARIS_CENTER.lat + latOffset,
    lon: PARIS_CENTER.lon + lonOffset,
  };
}

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.notification.deleteMany();
  await prisma.scheduleRun.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.timelineEvent.deleteMany();
  await prisma.evidence.deleteMany();
  await prisma.caseTag.deleteMany();
  await prisma.caseOfficer.deleteMany();
  await prisma.case.deleteMany();
  await prisma.xAIExplanation.deleteMany();
  await prisma.detection.deleteMany();
  await prisma.analysisJob.deleteMany();
  await prisma.layer.deleteMany();
  await prisma.statusChange.deleteMany();
  await prisma.reportPhoto.deleteMany();
  await prisma.report.deleteMany();
  await prisma.roleRequest.deleteMany();
  await prisma.user.deleteMany();

  // ================================
  // 1. Create Users
  // ================================
  console.log('👥 Creating users...');
  
  const users = {
    // Officers
    martinez: await prisma.user.create({
      data: {
        email: 'martinez@plaza.gov',
        name: 'Officer Martinez',
        password: 'password123', // In production, hash this!
        role: UserRole.OFFICER,
        avatar: faker.image.avatar(),
        lastLogin: new Date(),
      },
    }),
    chen: await prisma.user.create({
      data: {
        email: 'chen@plaza.gov',
        name: 'Officer Chen',
        password: 'password123',
        role: UserRole.OFFICER,
        avatar: faker.image.avatar(),
      },
    }),
    // Analysts
    analyst1: await prisma.user.create({
      data: {
        email: 'analyst@plaza.gov',
        name: 'Dr. Sarah Johnson',
        password: 'password123',
        role: UserRole.ANALYST,
        avatar: faker.image.avatar(),
      },
    }),
    // Prosecutors
    prosecutor: await prisma.user.create({
      data: {
        email: 'prosecutor@plaza.gov',
        name: 'Prosecutor Blanc',
        password: 'password123',
        role: UserRole.PROSECUTOR,
        avatar: faker.image.avatar(),
      },
    }),
    // Admin
    admin: await prisma.user.create({
      data: {
        email: 'admin@plaza.gov',
        name: 'System Admin',
        password: 'password123',
        role: UserRole.ADMIN,
        avatar: faker.image.avatar(),
      },
    }),
    // Citizens
    ...await Promise.all(
      Array.from({ length: 20 }, async (_, i) => 
        await prisma.user.create({
          data: {
            email: `citizen${i + 1}@example.com`,
            name: faker.person.fullName(),
            password: 'password123',
            role: UserRole.CITIZEN,
            avatar: faker.image.avatar(),
          },
        })
      )
    ),
  };

  const citizenUsers = Object.values(users).filter(u => u.role === UserRole.CITIZEN);
  const officers = [users.martinez, users.chen];

  console.log(`✅ Created ${Object.keys(users).length + 15} users`);

  // ================================
  // 2. Create Reports
  // ================================
  console.log('📋 Creating reports...');
  
  const reports = await Promise.all(
    Array.from({ length: 50 }, async () => {
      const location = generateParisLocation();
      const submittedAt = faker.date.recent({ days: 30 });
      const status = faker.helpers.arrayElement([
        ReportStatus.PENDING,
        ReportStatus.UNDER_REVIEW,
        ReportStatus.ACCEPTED,
        ReportStatus.REJECTED,
        ReportStatus.ESCALATED,
        ReportStatus.RESOLVED,
      ]);

      const report = await prisma.report.create({
        data: {
          citizenId: faker.helpers.arrayElement(citizenUsers).id,
          type: faker.helpers.arrayElement(Object.values(ReportType)),
          status,
          title: faker.helpers.arrayElement([
            'Illegal Dumping Observed',
            'Water Pollution Incident',
            'Oil Sheen in Harbor',
            'Construction Debris',
            'Chemical Smell Detected',
            'Waste Accumulation',
          ]),
          description: faker.lorem.sentences(3),
          latitude: location.lat,
          longitude: location.lon,
          address: faker.location.streetAddress({ useFullAddress: true }),
          submittedAt,
          assignedTo: status !== ReportStatus.PENDING ? faker.helpers.arrayElement(officers).id : undefined,
          priority: faker.helpers.arrayElement([Priority.LOW, Priority.MEDIUM, Priority.HIGH]),
          photos: {
            create: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, (_, i) => ({
              url: faker.image.url(),
              caption: faker.lorem.sentence(),
              order: i,
            })),
          },
          statusHistory: {
            create: {
              status: ReportStatus.PENDING,
              changedBy: faker.helpers.arrayElement(citizenUsers).id,
              changedAt: submittedAt,
            },
          },
        },
      });

      // Add status change if not pending
      if (status !== ReportStatus.PENDING) {
        await prisma.statusChange.create({
          data: {
            reportId: report.id,
            status,
            changedBy: faker.helpers.arrayElement(officers).id,
            changedAt: faker.date.between({ from: submittedAt, to: new Date() }),
            reason: status === ReportStatus.REJECTED ? faker.helpers.arrayElement([
              'Duplicate report',
              'Insufficient evidence',
              'Outside jurisdiction',
            ]) : undefined,
          },
        });
      }

      return report;
    })
  );

  console.log(`✅ Created ${reports.length} reports`);

  // ================================
  // 3. Create Layers
  // ================================
  console.log('🗺️  Creating layers...');
  
  const layers = await Promise.all([
    prisma.layer.create({
      data: {
        name: 'Sentinel-2 Imagery',
        type: LayerType.EO_IMAGERY,
        url: 'https://tiles.example.com/sentinel2/{z}/{x}/{y}.png',
        isVisible: true,
        opacity: 80,
        dateAcquired: faker.date.recent({ days: 7 }),
        resolution: '10m',
        coverage: 95,
        source: 'ESA Copernicus',
        creator: 'European Space Agency',
        license: 'Open Data',
        datasetVersion: 'v2.1',
        processingSteps: JSON.stringify(['Atmospheric correction', 'Cloud masking', 'Data normalization']),
      },
    }),
    prisma.layer.create({
      data: {
        name: 'Sensor Network Data',
        type: LayerType.SENSOR_DATA,
        url: 'https://tiles.example.com/sensors/{z}/{x}/{y}.png',
        isVisible: false,
        opacity: 70,
        dateAcquired: faker.date.recent({ days: 1 }),
        resolution: '50m',
        coverage: 88,
        source: 'Environmental Agency',
        creator: 'PLAZA Network',
        license: 'Proprietary',
        datasetVersion: 'v1.5',
      },
    }),
    prisma.layer.create({
      data: {
        name: 'AI Detection Results',
        type: LayerType.AI_RESULTS,
        url: 'https://tiles.example.com/ai-results/{z}/{x}/{y}.png',
        isVisible: true,
        opacity: 90,
        source: 'PLAZA AI',
        creator: 'WasteNet Model',
        license: 'Open Data',
        datasetVersion: 'v2.4.1',
      },
    }),
  ]);

  console.log(`✅ Created ${layers.length} layers`);

  // ================================
  // 4. Create Analysis Jobs
  // ================================
  console.log('🔬 Creating analysis jobs...');
  
  const analysisJobs = await Promise.all(
    Array.from({ length: 15 }, async () => {
      const location = generateParisLocation();
      const status = faker.helpers.arrayElement([
        AnalysisStatus.COMPLETED,
        AnalysisStatus.RUNNING,
        AnalysisStatus.PENDING,
        AnalysisStatus.FAILED,
      ]);
      const createdAt = faker.date.recent({ days: 7 });

      const job = await prisma.analysisJob.create({
        data: {
          name: faker.helpers.arrayElement([
            'Harbor District Analysis',
            'Coastal Monitoring',
            'Zone A-12 Scan',
            'Weekly Environmental Check',
          ]),
          status,
          modelType: faker.helpers.arrayElement(Object.values(ModelType)),
          modelVersion: `v${faker.number.int({ min: 2, max: 3 })}.${faker.number.int({ min: 0, max: 5 })}.1`,
          progress: status === AnalysisStatus.RUNNING ? faker.number.int({ min: 10, max: 90 }) : status === AnalysisStatus.COMPLETED ? 100 : 0,
          eta: status === AnalysisStatus.RUNNING ? faker.number.int({ min: 120, max: 3600 }) : undefined,
          createdBy: users.analyst1.id,
          createdAt,
          startedAt: status !== AnalysisStatus.PENDING ? createdAt : undefined,
          completedAt: status === AnalysisStatus.COMPLETED ? faker.date.recent({ days: 1 }) : undefined,
          error: status === AnalysisStatus.FAILED ? 'Insufficient data coverage in selected area' : undefined,
          aoiType: 'rectangle',
          aoiCoordinates: JSON.stringify([
            [[location.lon - 0.05, location.lat - 0.02]],
            [[location.lon + 0.05, location.lat - 0.02]],
            [[location.lon + 0.05, location.lat + 0.02]],
            [[location.lon - 0.05, location.lat + 0.02]],
            [[location.lon - 0.05, location.lat - 0.02]],
          ]),
          aoiArea: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
          aoiCenterLat: location.lat,
          aoiCenterLon: location.lon,
          timeFrom: faker.date.past({ years: 1 }),
          timeTo: new Date(),
          totalDetections: status === AnalysisStatus.COMPLETED ? faker.number.int({ min: 5, max: 25 }) : undefined,
          avgConfidence: status === AnalysisStatus.COMPLETED ? faker.number.float({ min: 0.7, max: 0.95, precision: 0.01 }) : undefined,
          highConfidence: status === AnalysisStatus.COMPLETED ? faker.number.int({ min: 3, max: 12 }) : undefined,
          mediumConfidence: status === AnalysisStatus.COMPLETED ? faker.number.int({ min: 2, max: 8 }) : undefined,
          lowConfidence: status === AnalysisStatus.COMPLETED ? faker.number.int({ min: 0, max: 5 }) : undefined,
          heatmapUrl: status === AnalysisStatus.COMPLETED ? faker.image.url() : undefined,
        },
      });

      // Create detections for completed jobs
      if (status === AnalysisStatus.COMPLETED) {
        const detectionCount = faker.number.int({ min: 5, max: 15 });
        await Promise.all(
          Array.from({ length: detectionCount }, async () => {
            const detLocation = generateParisLocation();
            const confidence = faker.number.float({ min: 0.5, max: 0.99, precision: 0.01 });

            const detection = await prisma.detection.create({
              data: {
                jobId: job.id,
                type: faker.helpers.arrayElement([
                  'waste_accumulation',
                  'coastal_anomaly',
                  'water_pollution',
                ]),
                latitude: detLocation.lat,
                longitude: detLocation.lon,
                confidence,
                confidenceLevel: confidence > 0.85 ? 'high' : confidence > 0.7 ? 'medium' : 'low',
                metadata: JSON.stringify({
                  area: faker.number.float({ min: 10, max: 500, precision: 0.1 }),
                  detectedAt: faker.date.recent({ days: 1 }),
                }),
              },
            });

            // Create xAI explanation
            await prisma.xAIExplanation.create({
              data: {
                detectionId: detection.id,
                explanation: faker.helpers.arrayElement([
                  'High reflectance and irregular shapes suggest mixed waste materials. Strong spectral signatures match known waste composition profiles.',
                  'Anomalous water color patterns detected with spectral analysis indicating potential pollution.',
                  'Shape and spectral characteristics consistent with illegal dumping.',
                ]),
                confidence,
                confidenceLevel: confidence > 0.85 ? 'high' : confidence > 0.75 ? 'medium' : 'low',
                contributingFactors: JSON.stringify([
                  { name: 'Shape irregularity', score: faker.number.float({ min: 0.8, max: 0.98, precision: 0.01 }), description: 'Irregular geometric patterns' },
                  { name: 'Spectral signature', score: faker.number.float({ min: 0.75, max: 0.95, precision: 0.01 }), description: 'Spectral analysis matches profiles' },
                  { name: 'Texture pattern', score: faker.number.float({ min: 0.7, max: 0.93, precision: 0.01 }), description: 'Surface texture analysis' },
                ]),
                modelName: 'WasteNet',
                modelVersion: 'v2.4.1',
                trainingDate: faker.date.past({ years: 1 }),
                validationAccuracy: faker.number.float({ min: 0.88, max: 0.96, precision: 0.001 }),
                saliencyMapUrl: faker.image.url(),
              },
            });
          })
        );
      }

      return job;
    })
  );

  console.log(`✅ Created ${analysisJobs.length} analysis jobs with detections`);

  // ================================
  // 5. Create Cases
  // ================================
  console.log('📁 Creating cases...');
  
  const cases = await Promise.all(
    Array.from({ length: 12 }, async () => {
      const location = generateParisLocation();
      const status = faker.helpers.arrayElement(Object.values(CaseStatus));

      const caseRecord = await prisma.case.create({
        data: {
          title: faker.helpers.arrayElement([
            'Harbor Oil Spill Investigation',
            'Zone A Illegal Dumping',
            'Coastal Pollution Incident',
            'Industrial Waste Violation',
          ]),
          status,
          priority: faker.helpers.arrayElement([Priority.LOW, Priority.MEDIUM, Priority.HIGH]),
          createdBy: users.martinez.id,
          latitude: location.lat,
          longitude: location.lon,
          address: faker.location.streetAddress({ useFullAddress: true }),
          notes: faker.lorem.paragraphs(2),
          summary: faker.lorem.paragraph(),
          recommendedAction: faker.helpers.arrayElement([
            'Approve for prosecution',
            'Request additional evidence',
            'Refer to specialist',
          ]),
          assignedOfficers: {
            create: [
              { userId: users.martinez.id, role: 'lead' },
              { userId: users.chen.id, role: 'support' },
            ],
          },
          tags: {
            create: faker.helpers.multiple(
              () => ({ tag: faker.helpers.arrayElement(['#oil-spill', '#harbor', '#urgent', '#industrial']) }),
              { count: { min: 1, max: 3 } }
            ),
          },
          evidence: {
            create: faker.helpers.multiple(() => {
              const evidenceType = faker.helpers.arrayElement([
                EvidenceType.REPORT,
                EvidenceType.PHOTO,
                EvidenceType.AI_ANALYSIS,
              ]);
              
              return {
                type: evidenceType,
                name: faker.system.fileName(),
                description: faker.lorem.sentence(),
                addedBy: users.martinez.id,
                url: evidenceType === EvidenceType.PHOTO ? faker.image.url() : undefined,
                reportId: evidenceType === EvidenceType.REPORT ? faker.helpers.arrayElement(reports).id : undefined,
                metadata: JSON.stringify({ addedVia: 'case_builder' }),
              };
            }, { count: { min: 3, max: 8 } }),
          },
          timeline: {
            create: [
              {
                type: 'case_created',
                title: 'Case Created',
                description: 'Initial case file opened',
                userId: users.martinez.id,
              },
              {
                type: 'evidence_added',
                title: 'Evidence Added',
                description: 'Added 5 evidence items',
                userId: users.martinez.id,
                timestamp: faker.date.recent({ days: 2 }),
              },
            ],
          },
        },
      });

      return caseRecord;
    })
  );

  console.log(`✅ Created ${cases.length} cases`);

  // ================================
  // 6. Create Schedules
  // ================================
  console.log('⏰ Creating schedules...');
  
  const schedules = await Promise.all(
    Array.from({ length: 5 }, async () => {
      const location = generateParisLocation();

      return await prisma.schedule.create({
        data: {
          name: faker.helpers.arrayElement([
            'Harbor Monitoring - Daily',
            'Zone A-12 Scan - Every 6 Hours',
            'Coastal Survey - Weekly',
          ]),
          status: faker.helpers.arrayElement([ScheduleStatus.ACTIVE, ScheduleStatus.PAUSED]),
          frequency: faker.helpers.arrayElement([
            ScheduleFrequency.DAILY,
            ScheduleFrequency.EVERY_6_HOURS,
            ScheduleFrequency.WEEKLY,
          ]),
          modelType: faker.helpers.arrayElement([ModelType.WASTE_DETECTION, ModelType.COASTAL_ANOMALY]),
          lookbackDays: faker.number.int({ min: 1, max: 14 }),
          createdBy: users.analyst1.id,
          lastRun: faker.date.recent({ days: 1 }),
          nextRun: faker.date.soon({ days: 1 }),
          aoiType: 'rectangle',
          aoiCoordinates: JSON.stringify([[[location.lon - 0.05, location.lat - 0.02]]]),
          aoiArea: 2.4,
          aoiCenterLat: location.lat,
          aoiCenterLon: location.lon,
          triggerNewData: faker.datatype.boolean(),
          triggerSensorThreshold: faker.datatype.boolean(),
          triggerReportCluster: faker.datatype.boolean(),
          thresholdValue: faker.number.int({ min: 3, max: 10 }),
          notificationRecipients: JSON.stringify([users.analyst1.email, users.martinez.email]),
          notifyOnStart: true,
          notifyOnComplete: true,
          notifyOnFailure: true,
          notifyOnDetectionThreshold: true,
          detectionThreshold: 10,
        },
      });
    })
  );

  console.log(`✅ Created ${schedules.length} schedules`);

  // ================================
  // 7. Create Notifications
  // ================================
  console.log('🔔 Creating notifications...');
  
  const notifications = await Promise.all(
    [...officers, users.analyst1, users.prosecutor].flatMap(user =>
      Array.from({ length: 8 }, () =>
        prisma.notification.create({
          data: {
            type: faker.helpers.arrayElement(Object.values(NotificationType)),
            priority: faker.helpers.arrayElement(Object.values(NotificationPriority)),
            title: faker.helpers.arrayElement([
              'New Report Submitted',
              'Analysis Complete',
              'Case Escalated',
              'Status Updated',
            ]),
            description: faker.lorem.sentence(),
            timestamp: faker.date.recent({ days: 3 }),
            isRead: faker.datatype.boolean(),
            userId: user.id,
            actionUrl: faker.helpers.maybe(() => `/reports/${faker.string.uuid()}`, { probability: 0.7 }),
          },
        })
      )
    )
  );

  console.log(`✅ Created ${notifications.length} notifications`);

  // ================================
  // 8. Create Role Requests
  // ================================
  console.log('📝 Creating role requests...');
  
  const roleRequests = await Promise.all(
    faker.helpers.multiple(() => {
      const citizen = faker.helpers.arrayElement(citizenUsers);
      const status = faker.helpers.arrayElement(['PENDING', 'APPROVED', 'REJECTED'] as const);
      const requestedAt = faker.date.recent({ days: 14 });

      return prisma.roleRequest.create({
        data: {
          userId: citizen.id,
          currentRole: UserRole.CITIZEN,
          requestedRole: faker.helpers.arrayElement([UserRole.OFFICER, UserRole.ANALYST]),
          justification: faker.lorem.sentences(3),
          status,
          requestedAt,
          reviewedBy: status !== 'PENDING' ? users.admin.id : undefined,
          reviewedAt: status !== 'PENDING' ? faker.date.between({ from: requestedAt, to: new Date() }) : undefined,
          reviewNotes: status === 'REJECTED' ? 'Insufficient credentials provided' : undefined,
        },
      });
    }, { count: 5 })
  );

  console.log(`✅ Created ${roleRequests.length} role requests`);

  console.log('✅ Database seeded successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Users: ${Object.keys(users).length + 15}`);
  console.log(`   - Reports: ${reports.length}`);
  console.log(`   - Cases: ${cases.length}`);
  console.log(`   - Analysis Jobs: ${analysisJobs.length}`);
  console.log(`   - Layers: ${layers.length}`);
  console.log(`   - Schedules: ${schedules.length}`);
  console.log(`   - Notifications: ${notifications.length}`);
  console.log(`   - Role Requests: ${roleRequests.length}`);
  console.log('\n🔑 Login Credentials (all passwords: password123):');
  console.log('   - Officer: martinez@plaza.gov');
  console.log('   - Analyst: analyst@plaza.gov');
  console.log('   - Prosecutor: prosecutor@plaza.gov');
  console.log('   - Admin: admin@plaza.gov');
  console.log('   - Citizen: citizen1@example.com (or citizen2-20)');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Update `packages/database/package.json` - Add to prisma config
```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

---

## 4. Database Client Export

### `packages/database/src/index.ts`
```typescript
export * from '@prisma/client';
export { PrismaClient } from '@prisma/client';

// Create singleton instance
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### `packages/database/tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## 5. Running Database Setup

### Initial Setup Commands
```bash
# From packages/database directory
cd packages/database

# Generate Prisma Client
pnpm db:generate

# Push schema to database (creates tables)
pnpm db:push

# Run seed data
pnpm db:seed

# Open Prisma Studio to view data
pnpm db:studio
```

### Migration Workflow (for production)
```bash
# Create a migration
pnpm db:migrate

# Reset database (deletes all data and re-seeds)
pnpm db:reset
```

---

## 6. Configuration Files
```json
{
  "name": "plaza-toolkit",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "clean": "turbo run clean && rm -rf node_modules"
  },
  "devDependencies": {
    "turbo": "latest",
    "prettier": "latest",
    "eslint": "^8"
  }
}
```

### `turbo.json`
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    }
  }
}
```

### `pnpm-workspace.yaml`
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

---

## 3. Design System Setup

### Tailwind Configuration (`packages/config/tailwind.config.js`)
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: {
          DEFAULT: '#2563EB',
          dark: '#1E40AF',
          light: '#DBEAFE',
        },
        // Semantic Colors
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        // Role-Based Accents
        officer: '#8B5CF6',
        analyst: '#14B8A6',
        prosecutor: '#6366F1',
        citizen: '#22C55E',
        admin: '#6B7280',
        // AI Colors
        ai: {
          accent: '#8B5CF6',
          high: '#10B981',
          medium: '#F59E0B',
          low: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'level-1': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'level-2': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'level-3': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'level-4': '0 20px 25px rgba(0, 0, 0, 0.15)',
      },
      keyframes: {
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.1)' },
        },
      },
      animation: {
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-in',
        'pulse-dot': 'pulse-dot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/forms'),
  ],
}
```

---

## 7. TypeScript Types Package (Extends Prisma)

The `@plaza/types` package extends Prisma-generated types with additional helper types and utilities.

### `packages/types/src/index.ts`
```typescript
// Re-export Prisma types
export * from '@plaza/database';

// Additional helper types not in Prisma
export type Coordinates = {
  lat: number;
  lon: number;
};

export interface AreaOfInterest {
  type: 'rectangle' | 'circle' | 'polygon';
  coordinates: number[][][] | number[][];
  area: number; // km²
  center: [number, number]; // [lon, lat]
}

export interface MapViewport {
  latitude: number;
  longitude: number;
  zoom: number;
  bearing?: number;
  pitch?: number;
}

export interface MapMarker {
  id: string;
  type: 'report' | 'detection' | 'case';
  position: [number, number]; // [lon, lat]
  data: any;
}

export interface ReportFilters {
  status?: string[];
  type?: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  priority?: string[];
  assignedTo?: string;
}

export interface CaseFilters {
  status?: string[];
  priority?: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  assignedOfficers?: string[];
  tags?: string[];
}

export interface AnalysisJobFilters {
  status?: string[];
  modelType?: string[];
  createdBy?: string;
}

// Auth state (not stored in DB)
export interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  token?: string;
}

// xAI contributing factor (parsed from JSON)
export interface XAIContributingFactor {
  name: string;
  score: number;
  description: string;
}

// Provenance processing steps (parsed from JSON)
export interface ProvenanceStep {
  step: string;
  timestamp?: Date;
  parameters?: Record<string, any>;
}
```

---

## 8. Database API Functions (Replace Mock API)

### `packages/lib/src/db-api.ts`
```typescript
import { prisma } from '@plaza/database';
import type { 
  Report, 
  Case, 
  AnalysisJob, 
  Layer, 
  Notification,
  Schedule,
  Detection,
  XAIExplanation,
  User,
  RoleRequest,
  Prisma
} from '@plaza/database';

// ================================
// User API
// ================================

export async function getUserById(id: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: { id },
  });
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function updateUserLastLogin(userId: string): Promise<User> {
  return await prisma.user.update({
    where: { id: userId },
    data: { lastLogin: new Date() },
  });
}

// ================================
// Reports API
// ================================

export async function fetchReports(filters?: {
  status?: string[];
  type?: string[];
  assignedTo?: string;
  citizenId?: string;
}): Promise<Report[]> {
  const where: Prisma.ReportWhereInput = {};
  
  if (filters?.status?.length) {
    where.status = { in: filters.status as any[] };
  }
  if (filters?.type?.length) {
    where.type = { in: filters.type as any[] };
  }
  if (filters?.assignedTo) {
    where.assignedTo = filters.assignedTo;
  }
  if (filters?.citizenId) {
    where.citizenId = filters.citizenId;
  }

  return await prisma.report.findMany({
    where,
    include: {
      photos: true,
      citizen: { select: { id: true, name: true, email: true } },
      officer: { select: { id: true, name: true } },
      statusHistory: {
        include: { user: { select: { name: true } } },
        orderBy: { changedAt: 'desc' },
      },
    },
    orderBy: { submittedAt: 'desc' },
  });
}

export async function fetchReportById(id: string) {
  return await prisma.report.findUnique({
    where: { id },
    include: {
      photos: true,
      citizen: { select: { id: true, name: true, email: true, avatar: true } },
      officer: { select: { id: true, name: true } },
      statusHistory: {
        include: { user: { select: { name: true } } },
        orderBy: { changedAt: 'desc' },
      },
      evidence: true,
    },
  });
}

export async function createReport(data: {
  citizenId: string;
  type: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  address?: string;
  photos?: { url: string; caption?: string }[];
}) {
  return await prisma.report.create({
    data: {
      ...data,
      type: data.type as any,
      photos: data.photos ? {
        create: data.photos.map((photo, i) => ({
          url: photo.url,
          caption: photo.caption,
          order: i,
        })),
      } : undefined,
      statusHistory: {
        create: {
          status: 'PENDING',
          changedBy: data.citizenId,
        },
      },
    },
    include: {
      photos: true,
    },
  });
}

export async function updateReportStatus(
  id: string,
  status: string,
  changedBy: string,
  reason?: string,
  notes?: string
) {
  // Update report
  const report = await prisma.report.update({
    where: { id },
    data: { status: status as any },
  });

  // Add status change history
  await prisma.statusChange.create({
    data: {
      reportId: id,
      status: status as any,
      changedBy,
      reason,
      notes,
    },
  });

  return report;
}

export async function assignReportToOfficer(reportId: string, officerId: string) {
  return await prisma.report.update({
    where: { id: reportId },
    data: { assignedTo: officerId },
  });
}

// ================================
// Cases API
// ================================

export async function fetchCases(filters?: {
  status?: string[];
  priority?: string[];
  createdBy?: string;
  assignedTo?: string;
}) {
  const where: Prisma.CaseWhereInput = {};
  
  if (filters?.status?.length) {
    where.status = { in: filters.status as any[] };
  }
  if (filters?.priority?.length) {
    where.priority = { in: filters.priority as any[] };
  }
  if (filters?.createdBy) {
    where.createdBy = filters.createdBy;
  }
  if (filters?.assignedTo) {
    where.assignedOfficers = {
      some: { userId: filters.assignedTo },
    };
  }

  return await prisma.case.findMany({
    where,
    include: {
      creator: { select: { id: true, name: true } },
      assignedOfficers: {
        include: { user: { select: { id: true, name: true } } },
      },
      tags: true,
      evidence: true,
      _count: {
        select: { evidence: true, timeline: true },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });
}

export async function fetchCaseById(id: string) {
  return await prisma.case.findUnique({
    where: { id },
    include: {
      creator: { select: { id: true, name: true, avatar: true } },
      assignedOfficers: {
        include: { user: { select: { id: true, name: true, avatar: true } } },
      },
      tags: true,
      evidence: {
        include: {
          user: { select: { name: true } },
          report: { select: { id: true, title: true } },
          detection: { select: { id: true, type: true } },
        },
        orderBy: { addedAt: 'desc' },
      },
      timeline: {
        include: { user: { select: { name: true } } },
        orderBy: { timestamp: 'asc' },
      },
    },
  });
}

export async function createCase(data: {
  title: string;
  createdBy: string;
  latitude: number;
  longitude: number;
  address?: string;
  priority?: string;
  notes?: string;
  assignedOfficerIds?: string[];
}) {
  return await prisma.case.create({
    data: {
      title: data.title,
      createdBy: data.createdBy,
      latitude: data.latitude,
      longitude: data.longitude,
      address: data.address,
      priority: (data.priority as any) || 'MEDIUM',
      notes: data.notes,
      assignedOfficers: data.assignedOfficerIds ? {
        create: data.assignedOfficerIds.map((userId, i) => ({
          userId,
          role: i === 0 ? 'lead' : 'support',
        })),
      } : undefined,
      timeline: {
        create: {
          type: 'case_created',
          title: 'Case Created',
          description: 'Initial case file opened',
          userId: data.createdBy,
        },
      },
    },
    include: {
      assignedOfficers: {
        include: { user: { select: { name: true } } },
      },
    },
  });
}

export async function updateCase(id: string, data: Partial<Case>) {
  return await prisma.case.update({
    where: { id },
    data,
  });
}

export async function addEvidenceToCase(data: {
  caseId: string;
  type: string;
  name: string;
  description?: string;
  addedBy: string;
  url?: string;
  reportId?: string;
  detectionId?: string;
  metadata?: any;
}) {
  const evidence = await prisma.evidence.create({
    data: {
      ...data,
      type: data.type as any,
      metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
    },
  });

  // Add timeline event
  await prisma.timelineEvent.create({
    data: {
      caseId: data.caseId,
      type: 'evidence_added',
      title: 'Evidence Added',
      description: `Added ${data.type}: ${data.name}`,
      userId: data.addedBy,
    },
  });

  return evidence;
}

export async function escalateCase(caseId: string, userId: string, summary?: string) {
  const caseRecord = await prisma.case.update({
    where: { id: caseId },
    data: {
      status: 'ESCALATED',
      summary: summary || undefined,
    },
  });

  await prisma.timelineEvent.create({
    data: {
      caseId,
      type: 'case_escalated',
      title: 'Case Escalated',
      description: 'Case escalated to prosecutor for review',
      userId,
    },
  });

  return caseRecord;
}

// ================================
// Analysis Jobs API
// ================================

export async function fetchAnalysisJobs(filters?: {
  status?: string[];
  createdBy?: string;
  modelType?: string[];
}) {
  const where: Prisma.AnalysisJobWhereInput = {};
  
  if (filters?.status?.length) {
    where.status = { in: filters.status as any[] };
  }
  if (filters?.createdBy) {
    where.createdBy = filters.createdBy;
  }
  if (filters?.modelType?.length) {
    where.modelType = { in: filters.modelType as any[] };
  }

  return await prisma.analysisJob.findMany({
    where,
    include: {
      user: { select: { id: true, name: true } },
      _count: { select: { detections: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function fetchAnalysisJobById(id: string) {
  return await prisma.analysisJob.findUnique({
    where: { id },
    include: {
      user: { select: { name: true } },
      detections: {
        include: { xaiExplanation: true },
        orderBy: { confidence: 'desc' },
      },
    },
  });
}

export async function createAnalysisJob(data: {
  name: string;
  modelType: string;
  createdBy: string;
  aoi: any; // AreaOfInterest object
  timeFrom: Date;
  timeTo: Date;
}) {
  return await prisma.analysisJob.create({
    data: {
      name: data.name,
      modelType: data.modelType as any,
      modelVersion: 'v2.4.1', // Default version
      createdBy: data.createdBy,
      aoiType: data.aoi.type,
      aoiCoordinates: JSON.stringify(data.aoi.coordinates),
      aoiArea: data.aoi.area,
      aoiCenterLat: data.aoi.center[1],
      aoiCenterLon: data.aoi.center[0],
      timeFrom: data.timeFrom,
      timeTo: data.timeTo,
      status: 'PENDING',
    },
  });
}

export async function updateAnalysisJobStatus(
  id: string,
  status: string,
  updates?: {
    progress?: number;
    eta?: number;
    error?: string;
  }
) {
  return await prisma.analysisJob.update({
    where: { id },
    data: {
      status: status as any,
      startedAt: status === 'RUNNING' ? new Date() : undefined,
      completedAt: status === 'COMPLETED' ? new Date() : undefined,
      ...updates,
    },
  });
}

// ================================
// Detections & xAI API
// ================================

export async function fetchDetectionsByJobId(jobId: string) {
  return await prisma.detection.findMany({
    where: { jobId },
    include: { xaiExplanation: true },
    orderBy: { confidence: 'desc' },
  });
}

export async function fetchXAIExplanation(detectionId: string) {
  return await prisma.xAIExplanation.findUnique({
    where: { detectionId },
  });
}

// ================================
// Layers API
// ================================

export async function fetchLayers(type?: string) {
  return await prisma.layer.findMany({
    where: type ? { type: type as any } : undefined,
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateLayerVisibility(id: string, isVisible: boolean) {
  return await prisma.layer.update({
    where: { id },
    data: { isVisible },
  });
}

export async function updateLayerOpacity(id: string, opacity: number) {
  return await prisma.layer.update({
    where: { id },
    data: { opacity },
  });
}

// ================================
// Schedules API
// ================================

export async function fetchSchedules(createdBy?: string) {
  return await prisma.schedule.findMany({
    where: createdBy ? { createdBy } : undefined,
    include: {
      user: { select: { name: true } },
      _count: { select: { runs: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function fetchScheduleById(id: string) {
  return await prisma.schedule.findUnique({
    where: { id },
    include: {
      user: { select: { name: true } },
      runs: {
        include: { job: true },
        orderBy: { startedAt: 'desc' },
        take: 10,
      },
    },
  });
}

export async function createSchedule(data: any) {
  return await prisma.schedule.create({
    data: {
      name: data.name,
      frequency: data.frequency,
      customCron: data.customCron,
      modelType: data.modelType,
      lookbackDays: data.lookbackDays,
      createdBy: data.createdBy,
      aoiType: data.aoi.type,
      aoiCoordinates: JSON.stringify(data.aoi.coordinates),
      aoiArea: data.aoi.area,
      aoiCenterLat: data.aoi.center[1],
      aoiCenterLon: data.aoi.center[0],
      triggerNewData: data.triggers.newData,
      triggerSensorThreshold: data.triggers.sensorThreshold,
      triggerReportCluster: data.triggers.reportCluster,
      thresholdValue: data.triggers.thresholdValue,
      notificationRecipients: JSON.stringify(data.notifications.recipients),
      notifyOnStart: data.notifications.onStart,
      notifyOnComplete: data.notifications.onComplete,
      notifyOnFailure: data.notifications.onFailure,
      notifyOnDetectionThreshold: data.notifications.onDetectionThreshold,
      detectionThreshold: data.notifications.detectionThreshold,
    },
  });
}

export async function updateScheduleStatus(id: string, status: string) {
  return await prisma.schedule.update({
    where: { id },
    data: { status: status as any },
  });
}

// ================================
// Notifications API
// ================================

export async function fetchNotifications(userId: string, unreadOnly = false) {
  return await prisma.notification.findMany({
    where: {
      userId,
      ...(unreadOnly ? { isRead: false } : {}),
    },
    orderBy: { timestamp: 'desc' },
    take: 50,
  });
}

export async function markNotificationRead(id: string) {
  return await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
}

export async function markAllNotificationsRead(userId: string) {
  return await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
}

export async function createNotification(data: {
  userId: string;
  type: string;
  priority?: string;
  title: string;
  description: string;
  actionUrl?: string;
  metadata?: any;
}) {
  return await prisma.notification.create({
    data: {
      ...data,
      type: data.type as any,
      priority: (data.priority as any) || 'NORMAL',
      metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
    },
  });
}

// ================================
// Role Requests API (Admin)
// ================================

export async function fetchRoleRequests(status?: string) {
  return await prisma.roleRequest.findMany({
    where: status ? { status: status as any } : undefined,
    include: {
      user: { select: { id: true, name: true, email: true, role: true } },
    },
    orderBy: { requestedAt: 'desc' },
  });
}

export async function approveRoleRequest(id: string, reviewedBy: string, notes?: string) {
  const request = await prisma.roleRequest.update({
    where: { id },
    data: {
      status: 'APPROVED',
      reviewedBy,
      reviewedAt: new Date(),
      reviewNotes: notes,
    },
  });

  // Update user role
  await prisma.user.update({
    where: { id: request.userId },
    data: { role: request.requestedRole },
  });

  return request;
}

export async function rejectRoleRequest(id: string, reviewedBy: string, notes: string) {
  return await prisma.roleRequest.update({
    where: { id },
    data: {
      status: 'REJECTED',
      reviewedBy,
      reviewedAt: new Date(),
      reviewNotes: notes,
    },
  });
}
```

---

## 9. Shared UI Components Package
```typescript
// User and Authentication Types
export type UserRole = 'citizen' | 'officer' | 'analyst' | 'prosecutor' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token?: string;
}

// Report Types (T3.1 - Citizen Science Data)
export type ReportStatus = 'pending' | 'under_review' | 'accepted' | 'rejected' | 'escalated' | 'resolved';
export type ReportType = 'illegal_dumping' | 'water_pollution' | 'air_pollution' | 'oil_spill' | 'hazardous_waste' | 'noise_complaint' | 'other';

export interface Report {
  id: string;
  citizenId: string;
  type: ReportType;
  status: ReportStatus;
  title: string;
  description: string;
  location: {
    lat: number;
    lon: number;
    address?: string;
  };
  photos: string[];
  submittedAt: Date;
  updatedAt: Date;
  assignedTo?: string; // Officer ID
  priority?: 'low' | 'medium' | 'high';
  statusHistory: StatusChange[];
}

export interface StatusChange {
  status: ReportStatus;
  changedBy: string;
  changedAt: Date;
  reason?: string;
  notes?: string;
}

// Layer Types (T3.2 - Catalog & Provenance)
export type LayerType = 'eo_imagery' | 'sensor_data' | 'ai_results' | 'citizen_reports';

export interface Layer {
  id: string;
  name: string;
  type: LayerType;
  url: string; // Tile URL or file URL
  isVisible: boolean;
  opacity: number;
  provenance: Provenance;
  metadata: {
    dateAcquired?: Date;
    resolution?: string;
    coverage?: number; // percentage
    source?: string;
  };
}

export interface Provenance {
  source: string;
  creator: string;
  createdAt: Date;
  license: string;
  processingSteps?: string[];
  datasetVersion?: string;
}

// AI Analysis Types (T3.3 - Spatial/AI Results)
export type AnalysisStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
export type ModelType = 'waste_detection' | 'coastal_anomaly' | 'water_pollution' | 'multi_type';

export interface AnalysisJob {
  id: string;
  name: string;
  status: AnalysisStatus;
  modelType: ModelType;
  modelVersion: string;
  aoi: AreaOfInterest;
  timeRange: {
    from: Date;
    to: Date;
  };
  progress?: number; // 0-100
  eta?: number; // seconds
  createdBy: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
  results?: AnalysisResults;
}

export interface AreaOfInterest {
  type: 'rectangle' | 'circle' | 'polygon';
  coordinates: number[][][] | number[][]; // GeoJSON format
  area: number; // km²
  center: [number, number]; // [lon, lat]
}

export interface AnalysisResults {
  detections: Detection[];
  summary: {
    totalDetections: number;
    avgConfidence: number;
    highConfidence: number;
    mediumConfidence: number;
    lowConfidence: number;
  };
  heatmapUrl?: string;
  rawDataUrl?: string;
}

export interface Detection {
  id: string;
  type: string;
  location: {
    lat: number;
    lon: number;
  };
  confidence: number; // 0-1
  confidenceLevel: 'high' | 'medium' | 'low';
  boundingBox?: number[][]; // [[lon,lat], [lon,lat], ...]
  metadata: Record<string, any>;
  xai?: XAIExplanation;
}

// xAI Types (T3.4 - Explainability)
export interface XAIExplanation {
  detectionId: string;
  explanation: string; // Plain language explanation
  confidence: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  contributingFactors: {
    name: string;
    score: number; // 0-1
    description: string;
  }[];
  modelInfo: {
    name: string;
    version: string;
    trainingDate: Date;
    validationAccuracy: number;
  };
  saliencyMapUrl?: string;
  similarCases?: string[]; // IDs of similar detections/reports
}

// Case Types
export type CaseStatus = 'draft' | 'active' | 'escalated' | 'approved' | 'closed';

export interface Case {
  id: string;
  title: string;
  status: CaseStatus;
  priority: 'low' | 'medium' | 'high';
  createdBy: string;
  assignedOfficers: string[];
  createdAt: Date;
  updatedAt: Date;
  location: {
    lat: number;
    lon: number;
    address?: string;
  };
  notes: string;
  tags: string[];
  evidence: Evidence[];
  timeline: TimelineEvent[];
  summary?: string;
  recommendedAction?: string;
}

export interface Evidence {
  id: string;
  type: 'report' | 'photo' | 'document' | 'ai_analysis' | 'layer' | 'note';
  name: string;
  description?: string;
  addedBy: string;
  addedAt: Date;
  metadata: Record<string, any>;
  url?: string;
  referenceId?: string; // ID of the report, detection, etc.
}

export interface TimelineEvent {
  id: string;
  type: string;
  title: string;
  description?: string;
  timestamp: Date;
  userId: string;
  metadata?: Record<string, any>;
}

// Schedule Types (Analyst)
export type ScheduleFrequency = 'hourly' | 'every_6_hours' | 'daily' | 'weekly' | 'custom';
export type ScheduleStatus = 'active' | 'paused' | 'error';

export interface Schedule {
  id: string;
  name: string;
  status: ScheduleStatus;
  frequency: ScheduleFrequency;
  customCron?: string;
  modelType: ModelType;
  aoi: AreaOfInterest;
  lookbackDays: number;
  triggers: {
    newData: boolean;
    sensorThreshold: boolean;
    reportCluster: boolean;
    thresholdValue?: number;
  };
  notifications: {
    recipients: string[];
    onStart: boolean;
    onComplete: boolean;
    onFailure: boolean;
    onDetectionThreshold: boolean;
    detectionThreshold?: number;
  };
  createdBy: string;
  createdAt: Date;
  lastRun?: Date;
  nextRun?: Date;
  runHistory: ScheduleRun[];
}

export interface ScheduleRun {
  id: string;
  scheduleId: string;
  startedAt: Date;
  completedAt?: Date;
  status: 'running' | 'completed' | 'failed';
  jobId?: string;
  error?: string;
}

// Notification Types
export type NotificationType = 'report' | 'case' | 'job' | 'system' | 'status_change';
export type NotificationPriority = 'low' | 'normal' | 'high';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  description: string;
  timestamp: Date;
  isRead: boolean;
  userId: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

// Role Request Types
export interface RoleRequest {
  id: string;
  userId: string;
  currentRole: UserRole;
  requestedRole: UserRole;
  justification: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewNotes?: string;
}

// Map Types
export interface MapViewport {
  latitude: number;
  longitude: number;
  zoom: number;
  bearing?: number;
  pitch?: number;
}

export interface MapMarker {
  id: string;
  type: 'report' | 'detection' | 'case';
  position: [number, number]; // [lon, lat]
  data: Report | Detection | Case;
}

// Filter Types
export interface ReportFilters {
  status?: ReportStatus[];
  type?: ReportType[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  priority?: ('low' | 'medium' | 'high')[];
  assignedTo?: string;
}

export interface CaseFilters {
  status?: CaseStatus[];
  priority?: ('low' | 'medium' | 'high')[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  assignedOfficers?: string[];
  tags?: string[];
}
```

---

## 10. Authentication Store with Database

### Authentication Store (`src/store/auth-store.ts`)
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@plaza/database';
import { getUserByEmail, updateUserLastLogin } from '@plaza/lib/db-api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token?: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  requestRoleChange: (requestedRole: string, justification: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: undefined,
      
      login: async (email: string, password: string) => {
        // In production, this would verify password hash
        // For now, we accept any password for demo purposes
        
        const user = await getUserByEmail(email.toLowerCase());
        
        if (!user) {
          throw new Error('User not found');
        }
        
        // Simple password check (in production, use bcrypt)
        if (password !== 'password123') {
          throw new Error('Invalid password');
        }
        
        // Update last login
        const updatedUser = await updateUserLastLogin(user.id);
        
        set({
          user: updatedUser,
          isAuthenticated: true,
          token: `token-${user.id}`, // In production, generate JWT
        });
      },
      
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          token: undefined,
        });
      },
      
      updatePassword: async (currentPassword: string, newPassword: string) => {
        // TODO: Implement password update in database
        await new Promise(resolve => setTimeout(resolve, 1000));
      },
      
      requestRoleChange: async (requestedRole: string, justification: string) => {
        // TODO: Create role request in database
        await new Promise(resolve => setTimeout(resolve, 1000));
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
      }),
    }
  )
);
```

---

## 11. Development Workflow
```typescript
import { faker } from '@faker-js/faker';
import { 
  Report, 
  ReportStatus, 
  ReportType, 
  User, 
  UserRole,
  Detection,
  AnalysisJob,
  Case,
  Layer,
  Notification,
  Schedule,
  XAIExplanation,
  RoleRequest
} from '@plaza/types';

// Seed for consistent data
faker.seed(12345);

// Paris coordinates for location context
const PARIS_CENTER = { lat: 48.8566, lon: 2.3522 };

// Helper function to generate random location near Paris
function generateParisLocation() {
  const latOffset = (faker.number.float() - 0.5) * 0.2; // ~20km range
  const lonOffset = (faker.number.float() - 0.5) * 0.2;
  return {
    lat: PARIS_CENTER.lat + latOffset,
    lon: PARIS_CENTER.lon + lonOffset,
    address: faker.location.streetAddress({ useFullAddress: true }),
  };
}

// User Generators
export function generateUser(role?: UserRole): User {
  const selectedRole = role || faker.helpers.arrayElement<UserRole>([
    'citizen', 'officer', 'analyst', 'prosecutor', 'admin'
  ]);
  
  return {
    id: `U-${faker.string.alphanumeric(8)}`,
    email: faker.internet.email().toLowerCase(),
    name: faker.person.fullName(),
    role: selectedRole,
    avatar: faker.image.avatar(),
    createdAt: faker.date.past({ years: 2 }),
    lastLogin: faker.date.recent({ days: 7 }),
  };
}

export function generateUsers(count: number): User[] {
  return Array.from({ length: count }, () => generateUser());
}

// Report Generators
export function generateReport(overrides?: Partial<Report>): Report {
  const submittedAt = faker.date.recent({ days: 30 });
  const status = faker.helpers.arrayElement<ReportStatus>([
    'pending', 'under_review', 'accepted', 'rejected', 'escalated', 'resolved'
  ]);
  
  const statusHistory = [
    {
      status: 'pending' as ReportStatus,
      changedBy: 'system',
      changedAt: submittedAt,
    }
  ];
  
  if (status !== 'pending') {
    statusHistory.push({
      status,
      changedBy: `U-${faker.string.alphanumeric(8)}`,
      changedAt: faker.date.between({ from: submittedAt, to: new Date() }),
      reason: status === 'rejected' ? faker.helpers.arrayElement([
        'Duplicate report',
        'Insufficient evidence',
        'Outside jurisdiction',
        'Resolved already'
      ]) : undefined,
    });
  }

  return {
    id: `R-${faker.number.int({ min: 1000, max: 9999 })}`,
    citizenId: `C-${faker.string.alphanumeric(8)}`,
    type: faker.helpers.arrayElement<ReportType>([
      'illegal_dumping', 'water_pollution', 'air_pollution', 
      'oil_spill', 'hazardous_waste', 'noise_complaint'
    ]),
    status,
    title: faker.helpers.arrayElement([
      'Illegal Dumping Observed',
      'Water Pollution Incident',
      'Oil Sheen in Harbor',
      'Construction Debris',
      'Chemical Smell Detected',
      'Waste Accumulation',
      'Hazardous Materials',
    ]),
    description: faker.lorem.sentences(3),
    location: generateParisLocation(),
    photos: faker.helpers.multiple(() => faker.image.url(), { count: { min: 1, max: 3 } }),
    submittedAt,
    updatedAt: faker.date.recent({ days: 1 }),
    assignedTo: status !== 'pending' ? `U-${faker.string.alphanumeric(8)}` : undefined,
    priority: faker.helpers.arrayElement(['low', 'medium', 'high'] as const),
    statusHistory,
    ...overrides,
  };
}

export function generateReports(count: number): Report[] {
  return Array.from({ length: count }, () => generateReport());
}

// Detection Generators
export function generateDetection(): Detection {
  const confidence = faker.number.float({ min: 0.5, max: 0.99, precision: 0.01 });
  
  return {
    id: `D-${faker.number.int({ min: 1000, max: 9999 })}`,
    type: faker.helpers.arrayElement([
      'waste_accumulation',
      'coastal_anomaly',
      'water_pollution',
      'illegal_dumping'
    ]),
    location: {
      lat: PARIS_CENTER.lat + (faker.number.float() - 0.5) * 0.1,
      lon: PARIS_CENTER.lon + (faker.number.float() - 0.5) * 0.1,
    },
    confidence,
    confidenceLevel: confidence > 0.85 ? 'high' : confidence > 0.7 ? 'medium' : 'low',
    metadata: {
      detectedAt: faker.date.recent({ days: 1 }),
      area: faker.number.float({ min: 10, max: 500, precision: 0.1 }), // m²
    },
  };
}

export function generateDetections(count: number): Detection[] {
  return Array.from({ length: count }, () => generateDetection());
}

// xAI Explanation Generator
export function generateXAIExplanation(detectionId: string): XAIExplanation {
  const confidence = faker.number.float({ min: 0.7, max: 0.98, precision: 0.01 });
  
  return {
    detectionId,
    explanation: faker.helpers.arrayElement([
      'High reflectance and irregular shapes suggest mixed waste materials. Strong spectral signatures match known waste composition profiles.',
      'Anomalous water color patterns detected with spectral analysis indicating potential pollution. Confirmed by texture irregularities.',
      'Shape and spectral characteristics consistent with illegal dumping. High confidence based on training data similarity.',
      'Coastal region shows deviation from baseline conditions. Multiple indicators suggest environmental incident.',
    ]),
    confidence,
    confidenceLevel: confidence > 0.85 ? 'high' : confidence > 0.75 ? 'medium' : 'low',
    contributingFactors: [
      {
        name: 'Shape irregularity',
        score: faker.number.float({ min: 0.8, max: 0.98, precision: 0.01 }),
        description: 'Irregular geometric patterns detected',
      },
      {
        name: 'Spectral signature',
        score: faker.number.float({ min: 0.75, max: 0.95, precision: 0.01 }),
        description: 'Spectral analysis matches known profiles',
      },
      {
        name: 'Texture pattern',
        score: faker.number.float({ min: 0.7, max: 0.93, precision: 0.01 }),
        description: 'Surface texture analysis',
      },
      {
        name: 'Context clues',
        score: faker.number.float({ min: 0.65, max: 0.9, precision: 0.01 }),
        description: 'Surrounding area analysis',
      },
    ],
    modelInfo: {
      name: faker.helpers.arrayElement(['WasteNet', 'CoastalNet', 'PollutionDetector']),
      version: `v${faker.number.int({ min: 2, max: 3 })}.${faker.number.int({ min: 0, max: 5 })}.${faker.number.int({ min: 0, max: 9 })}`,
      trainingDate: faker.date.past({ years: 1 }),
      validationAccuracy: faker.number.float({ min: 0.88, max: 0.96, precision: 0.001 }),
    },
    saliencyMapUrl: faker.image.url(),
    similarCases: faker.helpers.multiple(
      () => `${faker.helpers.arrayElement(['R', 'D'])}-${faker.number.int({ min: 1000, max: 9999 })}`,
      { count: { min: 2, max: 5 } }
    ),
  };
}

// Analysis Job Generator
export function generateAnalysisJob(overrides?: Partial<AnalysisJob>): AnalysisJob {
  const status = faker.helpers.arrayElement(['pending', 'running', 'completed', 'failed'] as const);
  const createdAt = faker.date.recent({ days: 7 });
  
  return {
    id: `J-${faker.number.int({ min: 1000, max: 9999 })}`,
    name: faker.helpers.arrayElement([
      'Harbor District Analysis',
      'Coastal Monitoring',
      'Zone A-12 Scan',
      'Weekly Environmental Check',
    ]),
    status,
    modelType: faker.helpers.arrayElement(['waste_detection', 'coastal_anomaly', 'water_pollution'] as const),
    modelVersion: `v${faker.number.int({ min: 2, max: 3 })}.${faker.number.int({ min: 0, max: 5 })}.1`,
    aoi: {
      type: 'rectangle',
      coordinates: [[
        [2.3, 48.85],
        [2.4, 48.85],
        [2.4, 48.87],
        [2.3, 48.87],
        [2.3, 48.85],
      ]],
      area: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
      center: [2.35, 48.86],
    },
    timeRange: {
      from: faker.date.past({ years: 1 }),
      to: new Date(),
    },
    progress: status === 'running' ? faker.number.int({ min: 10, max: 90 }) : status === 'completed' ? 100 : 0,
    eta: status === 'running' ? faker.number.int({ min: 120, max: 3600 }) : undefined,
    createdBy: `U-${faker.string.alphanumeric(8)}`,
    createdAt,
    startedAt: status !== 'pending' ? faker.date.between({ from: createdAt, to: new Date() }) : undefined,
    completedAt: status === 'completed' ? faker.date.recent({ days: 1 }) : undefined,
    error: status === 'failed' ? 'Insufficient data coverage in selected area' : undefined,
    results: status === 'completed' ? {
      detections: generateDetections(faker.number.int({ min: 5, max: 20 })),
      summary: {
        totalDetections: 15,
        avgConfidence: 0.87,
        highConfidence: 8,
        mediumConfidence: 5,
        lowConfidence: 2,
      },
      heatmapUrl: faker.image.url(),
    } : undefined,
    ...overrides,
  };
}

export function generateAnalysisJobs(count: number): AnalysisJob[] {
  return Array.from({ length: count }, () => generateAnalysisJob());
}

// Case Generator
export function generateCase(overrides?: Partial<Case>): Case {
  const createdAt = faker.date.recent({ days: 30 });
  
  return {
    id: `CASE-${faker.number.int({ min: 1000, max: 9999 })}`,
    title: faker.helpers.arrayElement([
      'Harbor Oil Spill Investigation',
      'Zone A Illegal Dumping',
      'Coastal Pollution Incident',
      'Industrial Waste Violation',
      'Water Contamination Case',
    ]),
    status: faker.helpers.arrayElement(['draft', 'active', 'escalated', 'approved', 'closed'] as const),
    priority: faker.helpers.arrayElement(['low', 'medium', 'high'] as const),
    createdBy: `U-${faker.string.alphanumeric(8)}`,
    assignedOfficers: faker.helpers.multiple(
      () => `U-${faker.string.alphanumeric(8)}`,
      { count: { min: 1, max: 3 } }
    ),
    createdAt,
    updatedAt: faker.date.recent({ days: 1 }),
    location: generateParisLocation(),
    notes: faker.lorem.paragraphs(2),
    tags: faker.helpers.multiple(
      () => faker.helpers.arrayElement(['#oil-spill', '#harbor', '#urgent', '#industrial', '#coastal']),
      { count: { min: 1, max: 3 } }
    ),
    evidence: faker.helpers.multiple(() => ({
      id: `E-${faker.string.alphanumeric(8)}`,
      type: faker.helpers.arrayElement(['report', 'photo', 'ai_analysis'] as const),
      name: faker.system.fileName(),
      addedBy: `U-${faker.string.alphanumeric(8)}`,
      addedAt: faker.date.between({ from: createdAt, to: new Date() }),
      metadata: {},
    }), { count: { min: 3, max: 12 } }),
    timeline: [],
    summary: faker.lorem.paragraph(),
    recommendedAction: faker.helpers.arrayElement([
      'Approve for prosecution',
      'Request additional evidence',
      'Refer to specialist',
      'Close case - insufficient evidence',
    ]),
    ...overrides,
  };
}

export function generateCases(count: number): Case[] {
  return Array.from({ length: count }, () => generateCase());
}

// Layer Generator
export function generateLayer(): Layer {
  return {
    id: `L-${faker.string.alphanumeric(8)}`,
    name: faker.helpers.arrayElement([
      'Sentinel-2 Imagery',
      'Sensor Network Data',
      'AI Detection Results',
      'Citizen Reports',
      'Coastal Monitoring',
    ]),
    type: faker.helpers.arrayElement(['eo_imagery', 'sensor_data', 'ai_results', 'citizen_reports'] as const),
    url: faker.internet.url(),
    isVisible: faker.datatype.boolean(),
    opacity: faker.number.int({ min: 60, max: 100 }),
    provenance: {
      source: faker.helpers.arrayElement(['ESA Copernicus', 'Environmental Agency', 'PLAZA AI', 'Citizen Network']),
      creator: faker.company.name(),
      createdAt: faker.date.recent({ days: 30 }),
      license: faker.helpers.arrayElement(['CC BY 4.0', 'Open Data', 'Proprietary', 'Public Domain']),
      processingSteps: faker.helpers.multiple(
        () => faker.helpers.arrayElement([
          'Atmospheric correction',
          'Cloud masking',
          'Data normalization',
          'Quality control',
        ]),
        { count: { min: 2, max: 4 } }
      ),
      datasetVersion: `v${faker.number.int({ min: 1, max: 3 })}.${faker.number.int({ min: 0, max: 9 })}`,
    },
    metadata: {
      dateAcquired: faker.date.recent({ days: 7 }),
      resolution: faker.helpers.arrayElement(['10m', '20m', '30m', '50m']),
      coverage: faker.number.int({ min: 85, max: 100 }),
      source: faker.company.name(),
    },
  };
}

export function generateLayers(count: number): Layer[] {
  return Array.from({ length: count }, () => generateLayer());
}

// Notification Generator
export function generateNotification(): Notification {
  return {
    id: `N-${faker.string.alphanumeric(8)}`,
    type: faker.helpers.arrayElement(['report', 'case', 'job', 'system', 'status_change'] as const),
    priority: faker.helpers.arrayElement(['low', 'normal', 'high'] as const),
    title: faker.helpers.arrayElement([
      'New Report Submitted',
      'Analysis Complete',
      'Case Escalated',
      'Status Updated',
      'System Maintenance',
    ]),
    description: faker.lorem.sentence(),
    timestamp: faker.date.recent({ days: 3 }),
    isRead: faker.datatype.boolean(),
    userId: `U-${faker.string.alphanumeric(8)}`,
    actionUrl: faker.datatype.boolean() ? `/reports/${faker.number.int({ min: 1000, max: 9999 })}` : undefined,
    metadata: {},
  };
}

export function generateNotifications(count: number): Notification[] {
  return Array.from({ length: count }, () => generateNotification());
}

// Schedule Generator
export function generateSchedule(): Schedule {
  const createdAt = faker.date.past({ months: 3 });
  
  return {
    id: `S-${faker.string.alphanumeric(8)}`,
    name: faker.helpers.arrayElement([
      'Harbor Monitoring - Daily',
      'Zone A-12 Scan - Every 6 Hours',
      'Coastal Survey - Weekly',
      'Industrial District Check',
    ]),
    status: faker.helpers.arrayElement(['active', 'paused', 'error'] as const),
    frequency: faker.helpers.arrayElement(['daily', 'every_6_hours', 'weekly'] as const),
    modelType: faker.helpers.arrayElement(['waste_detection', 'coastal_anomaly'] as const),
    aoi: {
      type: 'rectangle',
      coordinates: [[
        [2.3, 48.85],
        [2.4, 48.85],
        [2.4, 48.87],
        [2.3, 48.87],
        [2.3, 48.85],
      ]],
      area: 2.4,
      center: [2.35, 48.86],
    },
    lookbackDays: faker.number.int({ min: 1, max: 14 }),
    triggers: {
      newData: faker.datatype.boolean(),
      sensorThreshold: faker.datatype.boolean(),
      reportCluster: faker.datatype.boolean(),
      thresholdValue: faker.number.int({ min: 3, max: 10 }),
    },
    notifications: {
      recipients: faker.helpers.multiple(() => faker.internet.email(), { count: { min: 1, max: 3 } }),
      onStart: true,
      onComplete: true,
      onFailure: true,
      onDetectionThreshold: true,
      detectionThreshold: 10,
    },
    createdBy: `U-${faker.string.alphanumeric(8)}`,
    createdAt,
    lastRun: faker.date.recent({ days: 1 }),
    nextRun: faker.date.soon({ days: 1 }),
    runHistory: [],
  };
}

export function generateSchedules(count: number): Schedule[] {
  return Array.from({ length: count }, () => generateSchedule());
}

// Role Request Generator
export function generateRoleRequest(): RoleRequest {
  const requestedAt = faker.date.recent({ days: 14 });
  const status = faker.helpers.arrayElement(['pending', 'approved', 'rejected'] as const);
  
  return {
    id: `RR-${faker.string.alphanumeric(8)}`,
    userId: `U-${faker.string.alphanumeric(8)}`,
    currentRole: 'citizen',
    requestedRole: faker.helpers.arrayElement(['officer', 'analyst'] as const),
    justification: faker.lorem.sentences(3),
    status,
    requestedAt,
    reviewedBy: status !== 'pending' ? `U-${faker.string.alphanumeric(8)}` : undefined,
    reviewedAt: status !== 'pending' ? faker.date.between({ from: requestedAt, to: new Date() }) : undefined,
    reviewNotes: status === 'rejected' ? 'Insufficient credentials provided' : undefined,
  };
}

export function generateRoleRequests(count: number): RoleRequest[] {
  return Array.from({ length: count }, () => generateRoleRequest());
}
```

### `packages/mock-data/src/index.ts`
```typescript
export * from './generators';

// Pre-generated datasets for quick use
import {
  generateUsers,
  generateReports,
  generateCases,
  generateAnalysisJobs,
  generateLayers,
  generateNotifications,
  generateSchedules,
  generateRoleRequests,
  generateUser,
} from './generators';

// Mock current user (Officer)
export const mockCurrentUser = generateUser('officer');

// Mock data collections
export const mockUsers = generateUsers(50);
export const mockReports = generateReports(100);
export const mockCases = generateCases(25);
export const mockJobs = generateAnalysisJobs(20);
export const mockLayers = generateLayers(10);
export const mockNotifications = generateNotifications(30);
export const mockSchedules = generateSchedules(8);
export const mockRoleRequests = generateRoleRequests(5);

// Helper to get mock data by ID
export function getMockReportById(id: string) {
  return mockReports.find(r => r.id === id);
}

export function getMockCaseById(id: string) {
  return mockCases.find(c => c.id === id);
}

export function getMockJobById(id: string) {
  return mockJobs.find(j => j.id === id);
}
```

---

## 6. Shared UI Components Package

### Install shadcn/ui Components
```bash
cd packages/ui

# Install all needed shadcn components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add select
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add radio-group
npx shadcn-ui@latest add slider
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add skeleton
npx shadcn-ui@latest add tooltip
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add table
```

### Create Custom Components

#### `packages/ui/src/status-badge.tsx`
```typescript
import { Badge } from './badge';
import { cn } from '@plaza/lib';
import type { ReportStatus, CaseStatus } from '@plaza/types';

interface StatusBadgeProps {
  status: ReportStatus | CaseStatus;
  className?: string;
}

const statusConfig: Record<string, { label: string; variant: string; className: string }> = {
  pending: {
    label: 'Pending',
    variant: 'default',
    className: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  },
  under_review: {
    label: 'Under Review',
    variant: 'default',
    className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
  },
  accepted: {
    label: 'Accepted',
    variant: 'default',
    className: 'bg-green-100 text-green-700 hover:bg-green-100',
  },
  rejected: {
    label: 'Rejected',
    variant: 'default',
    className: 'bg-red-100 text-red-700 hover:bg-red-100',
  },
  escalated: {
    label: 'Escalated',
    variant: 'default',
    className: 'bg-red-100 text-red-700 hover:bg-red-100',
  },
  resolved: {
    label: 'Resolved',
    variant: 'default',
    className: 'bg-green-100 text-green-700 hover:bg-green-100',
  },
  draft: {
    label: 'Draft',
    variant: 'default',
    className: 'bg-gray-100 text-gray-700 hover:bg-gray-100',
  },
  active: {
    label: 'Active',
    variant: 'default',
    className: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  },
  approved: {
    label: 'Approved',
    variant: 'default',
    className: 'bg-green-100 text-green-700 hover:bg-green-100',
  },
  closed: {
    label: 'Closed',
    variant: 'default',
    className: 'bg-gray-100 text-gray-700 hover:bg-gray-100',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;
  
  return (
    <Badge className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
```

#### `packages/ui/src/role-badge.tsx`
```typescript
import { Badge } from './badge';
import { cn } from '@plaza/lib';
import type { UserRole } from '@plaza/types';
import { Shield, LineChart, Scale, User, Settings } from 'lucide-react';

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
  showIcon?: boolean;
}

const roleConfig: Record<UserRole, { label: string; icon: any; className: string }> = {
  officer: {
    label: 'Officer',
    icon: Shield,
    className: 'bg-officer/20 text-officer hover:bg-officer/20',
  },
  analyst: {
    label: 'Analyst',
    icon: LineChart,
    className: 'bg-analyst/20 text-analyst hover:bg-analyst/20',
  },
  prosecutor: {
    label: 'Prosecutor',
    icon: Scale,
    className: 'bg-prosecutor/20 text-prosecutor hover:bg-prosecutor/20',
  },
  citizen: {
    label: 'Citizen',
    icon: User,
    className: 'bg-citizen/20 text-citizen hover:bg-citizen/20',
  },
  admin: {
    label: 'Admin',
    icon: Settings,
    className: 'bg-admin/20 text-admin hover:bg-admin/20',
  },
};

export function RoleBadge({ role, className, showIcon = true }: RoleBadgeProps) {
  const config = roleConfig[role];
  const Icon = config.icon;
  
  return (
    <Badge className={cn(config.className, 'gap-1', className)}>
      {showIcon && <Icon className="h-3 w-3" />}
      {config.label}
    </Badge>
  );
}
```

#### `packages/ui/src/confidence-badge.tsx`
```typescript
import { Badge } from './badge';
import { cn } from '@plaza/lib';

interface ConfidenceBadgeProps {
  confidence: number; // 0-1
  level?: 'high' | 'medium' | 'low';
  className?: string;
}

export function ConfidenceBadge({ confidence, level, className }: ConfidenceBadgeProps) {
  const percentage = Math.round(confidence * 100);
  const confidenceLevel = level || (confidence > 0.85 ? 'high' : confidence > 0.7 ? 'medium' : 'low');
  
  const levelConfig = {
    high: 'bg-ai-high/20 text-ai-high',
    medium: 'bg-ai-medium/20 text-ai-medium',
    low: 'bg-ai-low/20 text-ai-low',
  };
  
  return (
    <Badge className={cn(levelConfig[confidenceLevel], className)}>
      {percentage}% {confidenceLevel}
    </Badge>
  );
}
```

#### `packages/ui/src/empty-state.tsx`
```typescript
import { LucideIcon } from 'lucide-react';
import { cn } from '@plaza/lib';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4', className)}>
      <Icon className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-600 text-center max-w-md mb-6">{description}</p>
      )}
      {action}
    </div>
  );
}
```

---

## 7. Main Web App Structure

### Folder Structure (`apps/web/src`)
```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx              # Main app layout with nav
│   │   ├── page.tsx                # Dashboard (role-based)
│   │   ├── explore/
│   │   │   └── page.tsx            # Map exploration
│   │   ├── reports/
│   │   │   ├── page.tsx            # Reports list
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Report detail
│   │   ├── cases/
│   │   │   ├── page.tsx            # Cases list
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Case detail
│   │   ├── analysis/
│   │   │   └── page.tsx            # Analysis request
│   │   ├── jobs/
│   │   │   └── page.tsx            # Jobs & Schedules (Analyst)
│   │   └── admin/
│   │       └── page.tsx            # Admin console
│   ├── api/                        # API routes (if needed for mock)
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── layout/
│   │   ├── app-shell.tsx
│   │   ├── top-nav.tsx
│   │   ├── side-nav.tsx
│   │   └── notifications-panel.tsx
│   ├── map/
│   │   ├── map-view.tsx
│   │   ├── map-marker.tsx
│   │   ├── map-controls.tsx
│   │   ├── drawing-tools.tsx
│   │   └── layer-control.tsx
│   ├── reports/
│   │   ├── report-card.tsx
│   │   ├── report-list.tsx
│   │   └── report-detail.tsx
│   ├── cases/
│   │   ├── case-card.tsx
│   │   ├── case-builder.tsx
│   │   └── evidence-timeline.tsx
│   ├── analysis/
│   │   ├── analysis-request-modal.tsx
│   │   ├── analysis-progress.tsx
│   │   └── results-panel.tsx
│   ├── xai/
│   │   ├── xai-panel.tsx
│   │   └── xai-explanation.tsx
│   └── ui/                         # Re-exports from @plaza/ui
├── hooks/
│   ├── use-auth.ts
│   ├── use-reports.ts
│   ├── use-cases.ts
│   ├── use-analysis.ts
│   └── use-notifications.ts
├── lib/
│   ├── api.ts                      # Mock API functions
│   ├── utils.ts
│   └── constants.ts
└── store/
    ├── auth-store.ts               # Zustand store for auth
    ├── notification-store.ts
    └── map-store.ts
```

---

## 8. Key Implementation Files

### Authentication Store (`src/store/auth-store.ts`)
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthState } from '@plaza/types';
import { mockCurrentUser } from '@plaza/mock-data';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  requestRoleChange: (requestedRole: string, justification: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: undefined,
      
      login: async (email: string, password: string) => {
        // Mock login - in real app, call API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Use mock user
        set({
          user: mockCurrentUser,
          isAuthenticated: true,
          token: 'mock-jwt-token',
        });
      },
      
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          token: undefined,
        });
      },
      
      updatePassword: async (currentPassword: string, newPassword: string) => {
        // Mock password update
        await new Promise(resolve => setTimeout(resolve, 1000));
        // In real app, call API
      },
      
      requestRoleChange: async (requestedRole: string, justification: string) => {
        // Mock role change request
        await new Promise(resolve => setTimeout(resolve, 1000));
        // In real app, call API
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

### Mock API Functions (`src/lib/api.ts`)
```typescript
import {
  mockReports,
  mockCases,
  mockJobs,
  mockLayers,
  mockNotifications,
  mockSchedules,
  mockRoleRequests,
  generateXAIExplanation,
  generateDetections,
  getMockReportById,
  getMockCaseById,
  getMockJobById,
} from '@plaza/mock-data';
import type { Report, Case, AnalysisJob, Layer, Notification } from '@plaza/types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Reports API
export async function fetchReports(filters?: any): Promise<Report[]> {
  await delay(500);
  let results = [...mockReports];
  
  // Apply filters
  if (filters?.status) {
    results = results.filter(r => filters.status.includes(r.status));
  }
  if (filters?.type) {
    results = results.filter(r => filters.type.includes(r.type));
  }
  
  return results;
}

export async function fetchReportById(id: string): Promise<Report | undefined> {
  await delay(300);
  return getMockReportById(id);
}

export async function updateReportStatus(
  id: string,
  status: string,
  reason?: string
): Promise<Report> {
  await delay(500);
  const report = getMockReportById(id);
  if (!report) throw new Error('Report not found');
  
  return {
    ...report,
    status: status as any,
    updatedAt: new Date(),
  };
}

// Cases API
export async function fetchCases(filters?: any): Promise<Case[]> {
  await delay(500);
  let results = [...mockCases];
  
  if (filters?.status) {
    results = results.filter(c => filters.status.includes(c.status));
  }
  
  return results;
}

export async function fetchCaseById(id: string): Promise<Case | undefined> {
  await delay(300);
  return getMockCaseById(id);
}

export async function createCase(data: Partial<Case>): Promise<Case> {
  await delay(800);
  // Return mock case with provided data
  return {
    ...mockCases[0],
    ...data,
    id: `CASE-${Date.now()}`,
  };
}

export async function updateCase(id: string, data: Partial<Case>): Promise<Case> {
  await delay(500);
  const existingCase = getMockCaseById(id);
  if (!existingCase) throw new Error('Case not found');
  
  return {
    ...existingCase,
    ...data,
    updatedAt: new Date(),
  };
}

// Analysis API
export async function submitAnalysisJob(data: any): Promise<AnalysisJob> {
  await delay(1000);
  // Create mock job with running status
  const job: AnalysisJob = {
    id: `J-${Date.now()}`,
    name: data.name || 'New Analysis',
    status: 'running',
    modelType: data.modelType,
    modelVersion: 'v2.4.1',
    aoi: data.aoi,
    timeRange: data.timeRange,
    progress: 0,
    eta: 600, // 10 minutes
    createdBy: 'current-user',
    createdAt: new Date(),
    startedAt: new Date(),
  };
  
  return job;
}

export async function fetchAnalysisJob(id: string): Promise<AnalysisJob | undefined> {
  await delay(300);
  return getMockJobById(id);
}

export async function fetchAnalysisJobs(): Promise<AnalysisJob[]> {
  await delay(500);
  return mockJobs;
}

// xAI API
export async function fetchXAIExplanation(detectionId: string) {
  await delay(400);
  return generateXAIExplanation(detectionId);
}

// Layers API
export async function fetchLayers(filters?: any): Promise<Layer[]> {
  await delay(400);
  return mockLayers;
}

// Notifications API
export async function fetchNotifications(): Promise<Notification[]> {
  await delay(300);
  return mockNotifications;
}

export async function markNotificationRead(id: string): Promise<void> {
  await delay(200);
}

// Schedules API
export async function fetchSchedules() {
  await delay(500);
  return mockSchedules;
}

export async function createSchedule(data: any) {
  await delay(800);
  return {
    ...mockSchedules[0],
    ...data,
    id: `S-${Date.now()}`,
  };
}

// Admin API
export async function fetchRoleRequests() {
  await delay(400);
  return mockRoleRequests;
}

export async function approveRoleRequest(id: string, notes?: string) {
  await delay(600);
}

export async function rejectRoleRequest(id: string, notes: string) {
  await delay(600);
}
```

---

## 9. Component Examples

### Login Page (`app/(auth)/login/page.tsx`)
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@plaza/ui/button';
import { Input } from '@plaza/ui/input';
import { Label } from '@plaza/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@plaza/ui/card';
import { useAuthStore } from '@/store/auth-store';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const login = useAuthStore(state => state.login);
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light to-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-white">P</span>
          </div>
          <CardTitle className="text-2xl">PLAZA Toolkit</CardTitle>
          <CardDescription>Environmental Incident Investigation Platform</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="officer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            {error && (
              <div className="text-sm text-error bg-error/10 border border-error/20 rounded-lg p-3">
                {error}
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Demo Credentials:</p>
            <p className="font-mono text-xs mt-1">Any email / Any password</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Dashboard Layout (`app/(dashboard)/layout.tsx`)
```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { TopNav } from '@/components/layout/top-nav';
import { SideNav } from '@/components/layout/side-nav';
import { NotificationsPanel } from '@/components/layout/notifications-panel';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const router = useRouter();
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      <div className="flex">
        <SideNav />
        <main className="flex-1 ml-0 lg:ml-60 mt-16 p-6">
          {children}
        </main>
      </div>
      <NotificationsPanel />
    </div>
  );
}
```

### Top Navigation (`components/layout/top-nav.tsx`)
```typescript
'use client';

import { useState } from 'react';
import { Bell, Search, ChevronDown, LogOut, Settings, User as UserIcon } from 'lucide-react';
import { Button } from '@plaza/ui/button';
import { Input } from '@plaza/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@plaza/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@plaza/ui/dropdown-menu';
import { RoleBadge } from '@plaza/ui/role-badge';
import { useAuthStore } from '@/store/auth-store';
import { useNotificationStore } from '@/store/notification-store';

export function TopNav() {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const toggleNotifications = useNotificationStore(state => state.togglePanel);
  const unreadCount = useNotificationStore(state => state.unreadCount);
  
  if (!user) return null;
  
  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
  
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left: Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-xl font-bold text-white">P</span>
          </div>
          <span className="text-lg font-semibold text-gray-900 hidden sm:inline">
            PLAZA
          </span>
        </div>
        
        {/* Center: Search */}
        <div className="flex-1 max-w-md mx-6 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search reports, cases, areas..."
              className="pl-10 bg-gray-100 border-0"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-gray-500 bg-white border border-gray-200 rounded">
              ⌘K
            </kbd>
          </div>
        </div>
        
        {/* Right: Role, Notifications, User Menu */}
        <div className="flex items-center gap-4">
          <RoleBadge role={user.role} />
          
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={toggleNotifications}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-5 w-5 bg-error text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline">{user.name}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <UserIcon className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-error">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
```

### Side Navigation (`components/layout/side-nav.tsx`)
```typescript
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Map, 
  FileText, 
  FolderOpen, 
  LineChart,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@plaza/lib';
import { Button } from '@plaza/ui/button';
import { useAuthStore } from '@/store/auth-store';

export function SideNav() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const user = useAuthStore(state => state.user);
  
  if (!user) return null;
  
  // Navigation items based on role
  const getNavItems = () => {
    const commonItems = [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
      { icon: Map, label: 'Explore Map', href: '/explore' },
    ];
    
    if (user.role === 'officer') {
      return [
        ...commonItems,
        { icon: FileText, label: 'Reports', href: '/reports' },
        { icon: FolderOpen, label: 'My Cases', href: '/cases' },
        { icon: LineChart, label: 'Analysis', href: '/analysis' },
      ];
    }
    
    if (user.role === 'analyst') {
      return [
        ...commonItems,
        { icon: LineChart, label: 'Analysis', href: '/analysis' },
        { icon: Settings, label: 'Jobs & Schedules', href: '/jobs' },
      ];
    }
    
    if (user.role === 'prosecutor') {
      return [
        ...commonItems,
        { icon: FolderOpen, label: 'Cases', href: '/cases' },
        { icon: FileText, label: 'Reports Archive', href: '/reports' },
      ];
    }
    
    if (user.role === 'admin') {
      return [
        ...commonItems,
        { icon: Settings, label: 'Admin Console', href: '/admin' },
      ];
    }
    
    return commonItems;
  };
  
  const navItems = getNavItems();
  
  return (
    <>
      <aside
        className={cn(
          'fixed left-0 top-16 bottom-0 bg-gray-50 border-r border-gray-200 transition-all duration-300 z-40',
          isCollapsed ? 'w-16' : 'w-60'
        )}
      >
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary-light text-primary font-medium border-l-4 border-primary'
                      : 'text-gray-700 hover:bg-gray-100',
                    isCollapsed && 'justify-center'
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="text-sm">{item.label}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-4 left-1/2 -translate-x-1/2"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </aside>
    </>
  );
}
```


### Commands to Run
```bash
# === DATABASE SETUP (First time) ===
# From packages/database directory
cd packages/database

# Generate Prisma Client
pnpm db:generate

# Push schema to database (creates SQLite file and tables)
pnpm db:push

# Seed database with demo data
pnpm db:seed

# Open Prisma Studio to view/edit data
pnpm db:studio

# === DEVELOPMENT ===
# Install all dependencies (from root)
cd ../..  # back to root
pnpm install

# Run development server for main app
cd apps/web
pnpm dev

# Run development server for citizen app
cd apps/citizen
pnpm dev

# Run all apps in development (from root)
pnpm dev

# === DATABASE OPERATIONS ===
# Reset database (deletes all data and re-seeds)
cd packages/database
pnpm db:reset

# Create a new migration (for production)
pnpm db:migrate

# View database in browser
pnpm db:studio

# === BUILD & DEPLOY ===
# Build all packages (from root)
pnpm build

# Lint all code
pnpm lint

# Type check
pnpm type-check
```

### Environment Variables Setup

#### `apps/web/.env.local`
```env
# Database (relative path from web app to database package)
DATABASE_URL="file:../../packages/database/prisma/dev.db"

# App
NEXT_PUBLIC_APP_NAME=PLAZA Toolkit
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Mapbox (get free token from mapbox.com)
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here

# API Base URL (optional, for future external API)
# NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

#### `apps/citizen/.env.local`
```env
# Database
DATABASE_URL="file:../../packages/database/prisma/dev.db"

# App
NEXT_PUBLIC_APP_NAME=PLAZA Citizen
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

---

## 12. Priority Implementation Order with Database
```bash
# Install all dependencies
pnpm install

# Run development server for main app
cd apps/web
pnpm dev

# Run development server for citizen app
cd apps/citizen
pnpm dev

# Run all apps in development (from root)
pnpm dev

# Build all packages
pnpm build

# Lint all code
pnpm lint

# Type check
pnpm type-check
```


### Phase 0: Database Foundation (Day 1)
1. ✅ Setup database package with Prisma
2. ✅ Define complete schema
3. ✅ Create seed file with realistic data
4. ✅ Run migrations and seed
5. ✅ Test database queries with Prisma Studio
6. ✅ Create database API functions in lib package

### Phase 1: Foundation (Week 1)
1. ✅ Configure Tailwind & shadcn/ui
2. ✅ Create types package (extending Prisma types)
3. ✅ Build authentication flow with database
4. ✅ Create app shell (TopNav, SideNav)
5. ✅ Setup Zustand stores

### Phase 2: Core Features (Week 2-3)
1. Dashboard (role-specific views with real data)
2. Map exploration with layers from database
3. Reports list and detail (from database)
4. Basic case management (from database)
5. Notifications system (from database)

### Phase 3: Advanced Features (Week 3-4)
1. AI analysis workflow with database persistence
2. xAI panel with database explanations
3. Case builder with evidence timeline
4. Drawing tools on map
5. Results visualization

### Phase 4: Role-Specific (Week 4-5)
1. Analyst: Jobs & Schedules with database
2. Prosecutor: Case review interface
3. Admin: Role management with database
4. Citizen app (mobile-first) with database

### Phase 5: Polish (Week 5-6)
1. Loading states & animations
2. Error handling
3. Responsive design refinements
4. Accessibility improvements
5. Performance optimization

---

## 13. Claude Code Task Breakdown (Updated for Database)

### Task 1: Database Setup ⚡ START HERE
```
Setup the database infrastructure:

1. Create packages/database directory
2. Install Prisma and dependencies: @prisma/client, prisma, tsx, @faker-js/faker
3. Initialize Prisma with SQLite: npx prisma init --datasource-provider sqlite
4. Copy the complete Prisma schema from the instructions
5. Create the seed.ts file with all data generators
6. Update package.json with database scripts
7. Run: pnpm db:generate
8. Run: pnpm db:push
9. Run: pnpm db:seed
10. Verify data in Prisma Studio: pnpm db:studio

You should see 25+ users, 50+ reports, 12 cases, 15 analysis jobs, and all related data.
```

### Task 2: Database API Layer
```
Create the database API functions in packages/lib:

1. Create src/db-api.ts
2. Copy all database API functions from instructions
3. These replace the mock API - use real Prisma queries
4. Export all functions from packages/lib/src/index.ts
5. Test a few functions in Prisma Studio or Node console

Key functions to implement:
- User: getUserById, getUserByEmail, updateUserLastLogin
- Reports: fetchReports, fetchReportById, updateReportStatus, createReport
- Cases: fetchCases, fetchCaseById, createCase, addEvidenceToCase
- Analysis: fetchAnalysisJobs, createAnalysisJob, updateAnalysisJobStatus
- Notifications: fetchNotifications, createNotification
- All others from the db-api.ts file
```

### Task 3: Authentication with Database
```
Build the authentication system using real database:

1. Update apps/web to use @plaza/database package
2. Create auth store in apps/web/src/store/auth-store.ts
3. Use getUserByEmail from db-api for login
4. Login page with form validation
5. Protected routes with authentication check
6. Password verification (simple for demo: password123)
7. Store user in Zustand with persist

Test with seeded users:
- martinez@plaza.gov / password123 (Officer)
- analyst@plaza.gov / password123 (Analyst)
- prosecutor@plaza.gov / password123 (Prosecutor)
- admin@plaza.gov / password123 (Admin)
```

### Task 4: App Shell & Layout
```
Create the main application layout:

1. TopNav with user info from database
2. SideNav with role-based menu (read from user.role)
3. Notifications panel (will integrate database later)
4. Main layout wrapper
5. Responsive behavior

The user object comes from database, so role badge shows actual role.
```

### Task 5: Dashboard with Real Data
```
Create role-specific dashboards using database queries:

Officer Dashboard:
- Use fetchReports with filters for recent reports
- Use fetchCases with filter for assigned officer
- Show real counts and statistics

Analyst Dashboard:
- Use fetchAnalysisJobs for job queue
- Use fetchSchedules for schedules list
- Real-time job progress from database

Prosecutor Dashboard:
- Use fetchCases with status filter for escalated
- Real case data with evidence counts

All data comes from Prisma via db-api functions.
```

### Task 6: Map with Database Layers
```
Build map exploration with database:

1. Integrate Mapbox GL or Leaflet
2. Use fetchLayers() to get all layers from database
3. Display citizen reports from fetchReports() as markers
4. Show AI detections from database when available
5. Drawing tools for AOI
6. Time range selector
7. Layer controls with database updates

Markers show real report/detection data from database.
```

### Task 7: Reports Management with Database
```
Create reports interface with real data:

1. Reports list using fetchReports() with filters
2. Status badges from database enum
3. Report detail using fetchReportById() with all relations
4. Status update using updateReportStatus()
5. Assign officer using assignReportToOfficer()
6. Photo gallery from database
7. Status history from database

All CRUD operations go through database.
```

### Task 8: AI Analysis with Database Persistence
```
Implement AI workflow with database:

1. Analysis request modal
2. Create job using createAnalysisJob()
3. Simulate job processing (update status to RUNNING, then COMPLETED)
4. Fetch results using fetchAnalysisJobById()
5. Display detections from database
6. Results panel with real detection data
7. Confidence badges from database values

All jobs and detections are persisted in SQLite.
```

### Task 9: xAI Panel with Database
```
Create explainability interface:

1. Slide-in xAI panel
2. Fetch explanation using fetchXAIExplanation(detectionId)
3. Display contributing factors (parse JSON from database)
4. Model info from database
5. Saliency map URL from database
6. Similar cases from database

All xAI data comes from xai_explanations table.
```

### Task 10: Case Management with Database
```
Build case system with full database integration:

1. Cases list using fetchCases()
2. Case detail using fetchCaseById() with all relations
3. Create case using createCase()
4. Add evidence using addEvidenceToCase()
5. Evidence timeline from database
6. Escalate case using escalateCase()
7. Timeline events from database
8. Tags and assigned officers from database

Full CRUD with all relations handled by Prisma.
```

### Task 11: Jobs & Schedules (Analyst) with Database
```
Create analyst tools with persistence:

1. Jobs queue from fetchAnalysisJobs()
2. Job detail with logs
3. Create schedule wizard using createSchedule()
4. Schedule list using fetchSchedules()
5. Schedule runs history from database
6. Update schedule status

All schedules and runs stored in database.
```

### Task 12: Notifications with Database
```
Implement notifications system:

1. Fetch notifications using fetchNotifications(userId)
2. Notification panel with real data
3. Mark as read using markNotificationRead()
4. Create notifications when actions happen
5. Badge count from unread notifications

All notifications from database with real-time updates.
```

### Task 13: Admin Console with Database
```
Build admin interface:

1. Role requests using fetchRoleRequests()
2. Approve/reject using approveRoleRequest/rejectRoleRequest()
3. Updates user role in database
4. User activity logs
5. System stats from database queries

All admin operations persist to database.
```

### Task 14: Citizen App with Database
```
Create mobile-first citizen app:

1. Simple home screen
2. Report submission using createReport()
3. Photo upload (store URL in database)
4. GPS location
5. My reports using fetchReports(citizenId)
6. Report status from database
7. Status indicators

All reports saved to database and visible to officers.
```

### Task 15: Polish & Real-Time Updates
```
Add finishing touches:

1. Loading states everywhere
2. Error handling for database operations
3. Optimistic updates
4. Toast notifications on success/error
5. Responsive design
6. Accessibility
7. Consider adding real-time with WebSockets for notifications

Database is production-ready with all relationships.
```

---

## 14. Database Schema Visualization

```
Users ────┬──> Reports (citizen)
          ├──> Reports (officer assigned)
          ├──> Cases (creator)
          ├──> CaseOfficers
          ├──> AnalysisJobs
          ├──> Schedules
          ├──> Notifications
          ├──> RoleRequests
          └──> Evidence, StatusChanges, TimelineEvents

Reports ──┬──> ReportPhotos
          ├──> StatusChanges
          └──> Evidence (references)

Cases ────┬──> CaseOfficers
          ├──> CaseTags
          ├──> Evidence
          └──> TimelineEvents

AnalysisJobs ──┬──> Detections
               └──> ScheduleRuns

Detections ────┬──> XAIExplanations
               └──> Evidence (references)

Schedules ─────> ScheduleRuns ────> AnalysisJobs
```

---

## 15. Testing Your Database Setup

### Quick Database Health Check
```bash
# 1. Open Prisma Studio
cd packages/database
pnpm db:studio

# 2. Verify data:
# - Check Users table: Should have ~25 users with different roles
# - Check Reports table: Should have ~50 reports with photos
# - Check Cases table: Should have ~12 cases with evidence
# - Check AnalysisJobs: Should have ~15 jobs
# - Check Detections: Should have multiple detections linked to jobs
# - Check XAIExplanations: Should match detection count
# - Check Layers: Should have 3 layers
# - Check Schedules: Should have 5 schedules
# - Check Notifications: Should have ~30+ notifications

# 3. Test a query in Node:
node
> const { prisma } = require('./src/index.ts')
> await prisma.user.findMany({ where: { role: 'OFFICER' } })
> await prisma.report.count()
> await prisma.case.findMany({ include: { evidence: true } })
```

### Common Issues & Solutions

**Issue: "prisma command not found"**
```bash
# Solution: Install dependencies first
pnpm install
```

**Issue: "Database file not found"**
```bash
# Solution: Run db push to create the database
pnpm db:push
```

**Issue: "No data in database"**
```bash
# Solution: Run the seed script
pnpm db:seed
```

**Issue: "Prisma Client not generated"**
```bash
# Solution: Generate the client
pnpm db:generate
```

---

## 16. Next Steps After Database Setup
1. ✅ Setup monorepo structure
2. ✅ Configure Tailwind & shadcn/ui
3. ✅ Create types package
4. ✅ Create mock data package
5. ✅ Build authentication flow
6. ✅ Create app shell (TopNav, SideNav)

### Phase 2: Core Features (Week 2-3)
1. Dashboard (role-specific views)
2. Map exploration with layers
3. Reports list and detail
4. Basic case management
5. Notifications system

### Phase 3: Advanced Features (Week 3-4)
1. AI analysis workflow
2. xAI panel
3. Case builder with evidence timeline
4. Drawing tools on map
5. Results visualization

### Phase 4: Role-Specific (Week 4-5)
1. Analyst: Jobs & Schedules
2. Prosecutor: Case review interface
3. Admin: Role management
4. Citizen app (mobile-first)

### Phase 5: Polish (Week 5-6)
1. Loading states & animations
2. Error handling
3. Responsive design refinements
4. Accessibility improvements
5. Performance optimization

---

## 12. Claude Code Task Breakdown

### Task 1: Initial Setup
```
Create a Next.js monorepo for PLAZA Toolkit using turborepo with:
- apps/web (main application)
- apps/citizen (citizen app)
- packages/ui (shadcn/ui components)
- packages/types (TypeScript types)
- packages/mock-data (data generators)
- packages/lib (shared utilities)

Configure Tailwind CSS with the design system colors from the UI doc.
Setup shadcn/ui with all base components installed.
```

### Task 2: Types & Mock Data
```
Implement the complete TypeScript types package from the specification.
Create mock data generators using @faker-js/faker for:
- Users (all roles)
- Reports (citizen submissions)
- Cases (investigation files)
- AI detections & xAI explanations
- Analysis jobs
- Layers (map data)
- Notifications
- Schedules

Include helper functions to query mock data by ID.
```

### Task 3: Authentication & Layout
```
Build the authentication system:
- Login page with form validation
- Zustand store for auth state
- Protected routes
- Mock login (any email/password works)

Create the app shell:
- Top navigation with search, notifications, user menu
- Side navigation with role-based menu items
- Collapsible sidebar
- Responsive layout
```

### Task 4: Dashboard Views
```
Create role-specific dashboard pages:
- Officer: New reports, active cases, quick actions
- Analyst: Job queue, schedules, data pipeline status
- Prosecutor: Escalated cases, decision queue
- Admin: Role requests, system stats

Use metric cards, recent activity lists, and quick action buttons.
Display mock data from the mock-data package.
```

### Task 5: Map Exploration
```
Build the map exploration interface:
- Integrate Mapbox GL or Leaflet
- Layer control panel (toggle visibility, opacity)
- Display citizen reports as markers
- Display AI detections
- Implement drawing tools (rectangle, circle, polygon)
- Time range selector
- "Predict" button to trigger analysis

Use mock layer data and display mock reports on the map.
```

### Task 6: Reports Management
```
Create reports management:
- Reports list with filters (status, type, date)
- Report card component with status badge
- Report detail view with photo, location, description
- Status update actions (Accept, Reject, Escalate)
- Modal for status change with reason input

Use mock reports from the mock-data package.
```

### Task 7: AI Analysis Workflow
```
Implement AI analysis workflow:
- Analysis request modal (triggered from map)
- Pre-fill AOI and time range from map
- Model selection dropdown
- Analysis progress modal with progress bar
- Results panel with detection list
- Detection confidence badges
- "Add to Case" action

Simulate job submission with mock data.
Display mock detections when "completed".
```

### Task 8: xAI Panel
```
Create explainability panel:
- Slide-in panel from right
- Display plain language explanation
- Confidence breakdown with contributing factors
- Visual explanation (saliency map placeholder)
- Model information
- Similar cases list

Use generateXAIExplanation from mock data.
```

### Task 9: Case Management
```
Build case management:
- Cases list (card grid)
- Case status badges
- Case detail/builder view
- Evidence timeline (chronological list)
- Add evidence modal (link reports, photos, analysis)
- Case notes (rich text editor)
- Export case button
- Escalate case modal

Use mock cases and allow building cases from mock evidence.
```

### Task 10: Jobs & Schedules (Analyst)
```
Create analyst tools:
- Jobs queue with live progress
- Job detail view with logs
- Create schedule wizard (4 steps: AOI, Model, Schedule, Review)
- Schedule list with active/paused status
- Edit/delete schedule actions

Use mock schedules and jobs data.
```

### Task 11: Notifications System
```
Implement notifications:
- Notifications side panel (slide from right)
- Notification cards with types (report, case, job, system)
- Filter tabs (All, Reports, Cases, Jobs)
- Mark as read action
- Clear all action
- Real-time badge count on bell icon

Use mock notifications data.
```

### Task 12: Admin Console
```
Build admin interface:
- Role requests list
- Request review modal with approve/reject
- User verification checklist
- Recent activity log
- System stats cards

Use mock role requests data.
```

### Task 13: Citizen App
```
Create mobile-first citizen app:
- Simple home with submit report card
- Multi-step report submission:
  1. Photo capture/upload
  2. Location (GPS or manual)
  3. Report type selection
  4. Review & submit
- My reports list with status tracking
- Report detail view (read-only)
- Status indicators for citizens

Use mock reports and simulate submission.
```

### Task 14: Polish & Responsiveness
```
Add finishing touches:
- Loading states (skeletons, spinners)
- Empty states for lists
- Error handling and messages
- Toast notifications for actions
- Animations (slide-in, fade, etc.)
- Mobile responsive behavior for all screens
- Accessibility (ARIA labels, keyboard nav)
```

---

## 13. Environment Setup

### `.env.local` (apps/web)
```bash
# App
NEXT_PUBLIC_APP_NAME=PLAZA Toolkit
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Mock mode (set to 'false' when ready to integrate real APIs)
NEXT_PUBLIC_USE_MOCK_DATA=true

# Mapbox (get free token from mapbox.com)
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here

# API Base URL (for future use)
# NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## 14. Testing Strategy

### Manual Testing Checklist
- [ ] Login flow works
- [ ] Navigation between pages
- [ ] Role-specific dashboards show correct content
- [ ] Map displays and markers render
- [ ] Drawing tools work on map
- [ ] Reports list loads and filters work
- [ ] Report detail shows all information
- [ ] Status update modals work
- [ ] Case creation and evidence addition
- [ ] AI analysis request flow
- [ ] xAI panel displays explanations
- [ ] Notifications panel updates
- [ ] Jobs queue shows progress
- [ ] Schedule creation wizard completes
- [ ] Admin role requests work
- [ ] Citizen app submission flow
- [ ] Responsive design on mobile
- [ ] Keyboard navigation works

---

## 15. Next Steps After Initial Build



1. **Production Database Migration**
   - Switch from SQLite to PostgreSQL for production
   - Update DATABASE_URL in .env
   - Run migrations: `pnpm db:migrate`
   - Deploy with proper database hosting (Supabase, Railway, etc.)

2. **Authentication Enhancement**
   - Add password hashing with bcrypt
   - Implement JWT tokens
   - Add refresh tokens
   - Session management
   - Password reset flow

3. **Real-time Features**
   - WebSocket connection for live updates
   - Real-time notification delivery
   - Live job progress updates
   - Collaborative case editing

4. **Advanced Features**
   - File upload to S3/Cloud Storage
   - Email notifications (SendGrid/AWS SES)
   - PDF export for cases
   - CSV/Excel export
   - Search with full-text indexing

5. **Performance & Scale**
   - Database query optimization
   - Add indexes for common queries
   - Implement caching (Redis)
   - Pagination for all lists
   - Virtual scrolling for large datasets

6. **Testing**
   - Unit tests for database functions
   - Integration tests for API routes
   - E2E tests with Playwright
   - Load testing

---

## 17. Summary for Claude Code

**Project:** PLAZA Toolkit - Environmental Incident Investigation Platform

**Tech Stack:**
- Next.js 14 (App Router)
- TypeScript
- Prisma ORM + SQLite (→ PostgreSQL for production)
- Tailwind CSS + shadcn/ui
- Zustand (state management)
- Mapbox GL / Leaflet
- Turborepo (monorepo)

**Database:**
- ✅ SQLite for development (file-based, zero config)
- ✅ Full Prisma schema with 15+ models
- ✅ Seed file with realistic faker data
- ✅ 25+ users across all roles
- ✅ 50+ reports with photos and status history
- ✅ 12 cases with evidence and timelines
- ✅ 15 analysis jobs with detections and xAI
- ✅ Complete relationships and foreign keys

**Key Instructions:**
1. ⚡ **START WITH DATABASE SETUP (Task 1)** - Everything depends on this
2. Use existing monorepo structure (don't create new one)
3. All data from SQLite database via Prisma
4. No mock data - real database queries everywhere
5. Follow the UI Design Document for visual specifications
6. Implement role-based access control using user.role from database
7. Focus on officer workflow first (most complex)
8. Map is central to UX - integrate with database layers
9. xAI panel shows database explanations
10. Mobile-first for citizen app
11. Use shadcn/ui components everywhere
12. Follow phase-by-phase implementation order

**Database Commands (memorize these):**
```bash
cd packages/database
pnpm db:generate    # Generate Prisma Client
pnpm db:push        # Create tables
pnpm db:seed        # Populate data
pnpm db:studio      # View/edit data
pnpm db:reset       # Reset everything
```

**Login Credentials (after seeding):**
```
Officer:    martinez@plaza.gov / password123
Analyst:    analyst@plaza.gov / password123
Prosecutor: prosecutor@plaza.gov / password123
Admin:      admin@plaza.gov / password123
Citizen:    citizen1@example.com / password123
```

**Development Flow:**
1. Setup database (Task 1) ✅ CRITICAL
2. Create database API functions (Task 2)
3. Build auth with database (Task 3)
4. Work through Tasks 4-15 sequentially
5. Each feature reads/writes to real database
6. Test in Prisma Studio as you build

Ready to start? Begin with **Task 1: Database Setup** 🚀

---

## Appendix A: Prisma Quick Reference

### Common Prisma Queries
```typescript
// Find many with filters
await prisma.report.findMany({
  where: { 
    status: 'PENDING',
    type: { in: ['ILLEGAL_DUMPING', 'WATER_POLLUTION'] }
  },
  include: { 
    citizen: true,
    photos: true 
  },
  orderBy: { submittedAt: 'desc' },
  take: 20,
  skip: 0
});

// Find unique
await prisma.user.findUnique({
  where: { email: 'user@example.com' }
});

// Create with relations
await prisma.case.create({
  data: {
    title: 'New Case',
    createdBy: userId,
    latitude: 48.8566,
    longitude: 2.3522,
    assignedOfficers: {
      create: [
        { userId: officer1Id, role: 'lead' }
      ]
    },
    timeline: {
      create: {
        type: 'case_created',
        title: 'Case Created',
        userId: userId
      }
    }
  }
});

// Update
await prisma.report.update({
  where: { id: reportId },
  data: { status: 'ACCEPTED' }
});

// Delete
await prisma.notification.delete({
  where: { id: notificationId }
});

// Aggregate/Count
await prisma.report.count({
  where: { status: 'PENDING' }
});

// Group by
await prisma.report.groupBy({
  by: ['status'],
  _count: { status: true }
});
```

### Prisma Relations
```typescript
// One-to-Many
model User {
  reports Report[]  // One user has many reports
}
model Report {
  citizenId String
  citizen   User @relation(fields: [citizenId], references: [id])
}

// Many-to-Many (via join table)
model Case {
  assignedOfficers CaseOfficer[]
}
model User {
  assignedCases CaseOfficer[]
}
model CaseOfficer {
  caseId String
  case   Case @relation(fields: [caseId], references: [id])
  userId String
  user   User @relation(fields: [userId], references: [id])
}

// One-to-One
model Detection {
  xaiExplanation XAIExplanation?
}
model XAIExplanation {
  detectionId String @unique
  detection   Detection @relation(fields: [detectionId], references: [id])
}
```

---

## Appendix B: Database Migration to PostgreSQL (Production)

When ready to deploy to production:

### 1. Update Schema
```prisma
datasource db {
  provider = "postgresql"  // Changed from sqlite
  url      = env("DATABASE_URL")
}
```

### 2. Update Connection String
```env
# PostgreSQL connection string
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"
```

### 3. Run Migrations
```bash
pnpm db:migrate
```

### 4. Deploy & Seed
```bash
# In production environment
pnpm db:push
pnpm db:seed  # Optional: seed with demo data
```

---

**END OF DOCUMENT**

This comprehensive guide provides everything needed to build PLAZA Toolkit with a real SQLite database using Prisma ORM. Start with Task 1 and build incrementally! 🎉
