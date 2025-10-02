# PLAZA User Roles & Workflows

## Overview
PLAZA is an Environmental Incident Investigation Platform with 5 distinct user roles that work together in a coordinated workflow from incident reporting to legal prosecution.

---

## User Roles

### 1. **Citizen** 👤
**Purpose**: General public who report environmental incidents

**Responsibilities**:
- Report environmental incidents they witness
- Upload photos and evidence of violations
- Track status of their submitted reports
- View updates on their cases
- Provide additional information when requested

**Access Level**: Limited
- Can only view/edit their own reports
- Cannot see other citizens' reports
- Cannot access investigation tools
- No administrative capabilities

**Key Features**:
- Submit new incident reports
- Upload photos/evidence
- View personal report history
- Track report status
- Receive notifications on case updates

---

### 2. **Officer** 👮
**Purpose**: Field officers who investigate and verify incidents

**Responsibilities**:
- Review and verify citizen-reported incidents
- Conduct field investigations
- Collect additional evidence
- Document findings in report notes
- Update report status (submit, under review, in progress)
- Request analysis when needed

**Access Level**: Moderate
- View reports assigned to them
- View reports they created
- Cannot see all system reports (unless assigned)
- Can update assigned reports
- Can add notes and evidence

**Key Features**:
- Dashboard with assigned cases
- My Reports section (personal reports)
- Field investigation tools
- Evidence upload and management
- Report status updates
- Map view for incident locations
- Note-taking on investigations

**Workflow**:
1. Receive assigned report from system/analyst
2. Review incident details and location
3. Conduct field investigation
4. Collect evidence (photos, samples, measurements)
5. Add investigation notes
6. Update report status
7. Submit for analysis or escalation

---

### 3. **Analyst** 🔍
**Purpose**: Investigation specialists who analyze evidence and build cases

**Responsibilities**:
- Review all incoming reports
- Assign reports to field officers
- Analyze evidence and patterns
- Link related incidents
- Build comprehensive cases
- Coordinate investigations
- Prepare cases for prosecution

**Access Level**: High
- View ALL reports in the system
- Access all evidence and notes
- Can update any report
- Assign officers to cases
- Create and manage cases
- Access analytics and patterns

**Key Features**:
- Full report dashboard (all reports)
- Advanced filtering and search
- Case management system
- Evidence analysis tools
- Officer assignment
- Pattern recognition (AI-powered)
- Link related incidents
- Case building interface

**Workflow**:
1. Monitor incoming reports dashboard
2. Review new incident reports
3. Assign appropriate officer for field investigation
4. Review officer findings and evidence
5. Conduct analysis using AI tools
6. Link related incidents into cases
7. Build comprehensive case file
8. Prepare case for prosecutor
9. Coordinate with officers for additional evidence

---

### 4. **Prosecutor** ⚖️
**Purpose**: Legal professionals who prepare cases for court

**Responsibilities**:
- Review prepared cases
- Assess legal viability
- Request additional evidence if needed
- Prepare legal documentation
- Coordinate with analysts
- Track case outcomes
- Manage legal proceedings

**Access Level**: High
- View all reports and cases
- Access all evidence and documentation
- Can update case legal status
- View investigation history
- Access chain of custody records

**Key Features**:
- Case dashboard (ready for prosecution)
- Legal case file builder
- Evidence chain of custody
- Case priority management
- Legal documentation tools
- Case outcome tracking
- Collaboration with analysts

**Workflow**:
1. Review cases prepared by analysts
2. Assess evidence quality and legal strength
3. Request additional evidence if needed
4. Prepare legal case documentation
5. Update case legal status
6. Coordinate court proceedings
7. Track case outcomes (resolved/dismissed)

---

### 5. **Admin** 🔧
**Purpose**: System administrators who manage the platform

**Responsibilities**:
- Manage all users
- Configure system settings
- Monitor platform health
- Manage departments and locations
- Handle data export/backup
- System configuration
- User role assignment

**Access Level**: Full
- Complete system access
- User management (CRUD)
- System configuration
- Data management
- Delete capabilities
- Audit logs access

**Key Features**:
- User management dashboard
- Role assignment interface
- Department management
- System settings configuration
- Data export tools
- Platform analytics
- Audit log viewer
- System health monitoring

**Workflow**:
1. Manage user accounts and roles
2. Configure system settings
3. Monitor platform usage
4. Handle user access requests
5. Maintain data integrity
6. Generate system reports
7. Coordinate with all roles for support

---

## Collaborative Workflows

### **Workflow 1: Citizen Report → Resolution**

```
1. CITIZEN submits incident report
   ↓
2. ANALYST reviews and assigns to OFFICER
   ↓
3. OFFICER investigates and collects evidence
   ↓
4. OFFICER updates report, adds notes/evidence
   ↓
5. ANALYST reviews findings and analysis
   ↓
6. ANALYST builds case (may link multiple incidents)
   ↓
7. PROSECUTOR reviews case for legal action
   ↓
8. PROSECUTOR prepares legal documentation
   ↓
9. Case goes to court/resolution
   ↓
10. CITIZEN receives updates throughout process
```

### **Workflow 2: Pattern Detection & Case Building**

```
1. Multiple CITIZENS report similar incidents
   ↓
2. ANALYST views all reports dashboard
   ↓
3. AI Analysis identifies patterns/connections
   ↓
4. ANALYST assigns multiple OFFICERS to investigate
   ↓
5. OFFICERS collect evidence independently
   ↓
6. ANALYST links reports into single case
   ↓
7. ANALYST prepares comprehensive case file
   ↓
8. PROSECUTOR reviews multi-incident case
   ↓
9. Stronger legal case built from pattern
```

### **Workflow 3: Escalation Path**

```
Low Priority Report:
CITIZEN → OFFICER → ANALYST (monitoring)

Medium Priority Report:
CITIZEN → ANALYST → OFFICER → ANALYST (review)

High Priority Report:
CITIZEN → ANALYST (immediate) → Multiple OFFICERS → PROSECUTOR (fast-track)

Critical Report:
CITIZEN → ADMIN (alert) → ANALYST → PROSECUTOR (emergency procedures)
```

---

## Report Status Flow

### Status Progression:
1. **DRAFT** - Citizen creating report (not submitted)
2. **SUBMITTED** - Citizen submitted, waiting for review
3. **UNDER_REVIEW** - Analyst reviewing report
4. **IN_PROGRESS** - Officer actively investigating
5. **PENDING_ANALYSIS** - Waiting for AI/analyst review
6. **RESOLVED** - Case completed successfully
7. **DISMISSED** - Case closed without action
8. **ARCHIVED** - Historical record

### Who Can Update Status:
- **DRAFT → SUBMITTED**: Citizen
- **SUBMITTED → UNDER_REVIEW**: Analyst
- **UNDER_REVIEW → IN_PROGRESS**: Analyst (when assigning officer)
- **IN_PROGRESS → PENDING_ANALYSIS**: Officer (when requesting analysis)
- **PENDING_ANALYSIS → IN_PROGRESS**: Analyst (if more investigation needed)
- **Any → RESOLVED**: Prosecutor/Analyst (case completed)
- **Any → DISMISSED**: Prosecutor/Analyst (case closed)
- **RESOLVED/DISMISSED → ARCHIVED**: Admin (after retention period)

---

## Key Interactions Between Roles

### **Citizen ↔ Officer**
- Citizen reports incident
- Officer investigates and may request more info
- Citizen receives updates on investigation
- Officer closes report or escalates

### **Officer ↔ Analyst**
- Analyst assigns cases to officers
- Officer submits findings to analyst
- Analyst provides guidance and analysis
- Officer requests additional resources/analysis
- Collaborative case building

### **Analyst ↔ Prosecutor**
- Analyst prepares cases for prosecution
- Prosecutor reviews and requests additional evidence
- Analyst coordinates evidence collection
- Prosecutor provides legal guidance
- Joint case strategy development

### **Admin ↔ All Roles**
- Manages user accounts and permissions
- Provides technical support
- Configures system settings
- Handles data requests
- Monitors platform usage

---

## Role-by-Role Implementation Analysis

### 1. 👤 **CITIZEN** - Implementation Status: **85%** ⬆️

#### ✅ What Works:
- **Authentication**: Login and session management working
- **Navigation**: Citizen-specific sidebar (Dashboard, My Reports, Submit Report)
- **New Report Submission**: Full form with validation ([/dashboard/reports/new](apps/web/app/dashboard/reports/new/page.tsx))
- **Photo Upload**: Multi-file upload with metadata tracking
- **Dashboard**: Citizen-specific dashboard with stats cards and recent reports
- **My Reports**: Complete list view with filters, search, and CSV export ([/dashboard/reports/my](apps/web/app/dashboard/reports/my/page.tsx))
- **Report Detail**: Read-only view with status timeline ([/dashboard/reports/[id]](apps/web/app/dashboard/reports/[id]/page.tsx))
- **Status Tracking Timeline**: ✨ **NEW** - Visual timeline showing progress (Submitted → Under Review → In Progress → Resolved)
- **Notifications**: ✨ **NEW** - In-app notification system
  - Bell icon with unread badge count
  - Notifications for report submission, status changes, officer assignment
  - Auto-polling every 30 seconds
  - Clickable notifications navigate to reports
  - Mark as read functionality
- **Role-Based Access**: Citizens can only see/edit their own reports
- **Smart Navigation**: Back buttons go to "My Reports" not "All Reports"

#### 🚧 Partially Working:
- **Report Edit**: Can edit only if status is SUBMITTED (locked after investigation starts)
- **Communication**: Can view officer notes but cannot reply yet

#### ❌ Missing Features (Nice-to-Have):
- **Email Notifications**: No email/SMS alerts for report updates (in-app only)
- **Two-Way Communication**: Can't reply to officer questions directly
- **Report Withdrawal**: Can't delete/withdraw submitted reports
- **Anonymous Reporting**: All reports require authentication
- **Mobile App**: No native mobile app (web only)

#### 🔥 Current Blockers:
None - Core citizen workflow is fully functional!

**Next Enhancements**:
1. Email notifications for status changes
2. Two-way communication with officers
3. Mobile app for field reporting

---

### 2. 👮 **OFFICER** - Implementation Status: **100%** ✅ COMPLETE

#### ✅ What Works (Fully Functional):
- **Authentication & Authorization**: Role-based access working perfectly
- **Enhanced Dashboard**: Role-specific dashboard with comprehensive stats ([/dashboard](apps/web/app/dashboard/page.tsx))
  - My Reports counter
  - Assigned Reports counter with active cases count
  - Recent activity feed
  - Reports by status breakdown
  - Quick action buttons (Map, New Report, Cases, Evidence)
- **Reports Management**:
  - View all reports ([/dashboard/reports](apps/web/app/dashboard/reports/page.tsx))
  - **NEW**: Dedicated "Assigned to Me" page ([/dashboard/reports/assigned](apps/web/app/dashboard/reports/assigned/page.tsx))
  - View personal reports ([/dashboard/reports/my](apps/web/app/dashboard/reports/my/page.tsx))
  - Create new reports ([/dashboard/reports/new](apps/web/app/dashboard/reports/new/page.tsx))
  - View report details with investigation actions ([/dashboard/reports/[id]](apps/web/app/dashboard/reports/[id]/page.tsx))
  - Edit reports ([/dashboard/reports/[id]/edit](apps/web/app/dashboard/reports/[id]/edit/page.tsx))
- **Investigation Actions** (NEW):
  - **Status Update Dialog**: Update status with mandatory notes and validation
  - **Investigation Notes**: Add internal notes to assigned reports
  - **Create Case**: Bundle reports into investigation cases
  - **Upload Evidence**: Link evidence to reports
  - **Permission Checks**: Only assigned officers can take actions
- **Evidence Management**: Can upload and view photos with metadata
- **Case Creation**: Can create cases from reports with auto-linking
- **Map View**: Geospatial view of incidents ([/dashboard/map](apps/web/app/dashboard/map/page.tsx))
- **Navigation**: Enhanced sidebar with nested Reports menu
- **Notifications**: Receive notifications when assigned reports
- **Status Timeline**: View investigation progress timeline

#### ✅ Enhanced Features (This Session):
- **Assigned Reports Page**: Dedicated page with search, filter, and sort
- **Status Update Dialog**: Validates transitions, requires notes, creates timeline
- **Investigation Notes Section**: Internal notes system for team collaboration
- **Case Creation Dialog**: Create cases directly from reports
- **Permission System**: Role-based action restrictions
- **Smart Navigation**: "Assigned to Me" in nested menu

#### 🎉 Complete Officer Workflow:
1. **Login** → View dashboard with assigned reports count
2. **Navigate** → Click "Assigned to Me" to see all assigned reports
3. **Investigate** → Click report to view details and evidence
4. **Update Status** → Change status with mandatory note (SUBMITTED → UNDER_REVIEW → IN_PROGRESS → RESOLVED)
5. **Add Notes** → Document investigation findings (internal only)
6. **Upload Evidence** → Link photos and files to report
7. **Create Case** → Bundle report into investigation case
8. **Notify Citizen** → Automatic notifications sent on status changes

#### 🟢 Nice-to-Have Enhancements (Future):
- **Field Investigation Tools**:
  - Offline mode for remote areas
  - GPS auto-capture for current location
  - Voice notes or quick capture
- **Evidence Chain of Custody**: Formal tracking of evidence handling
- **Report Templates**: Standardized investigation forms
- **Task Management**: Checklist for investigation steps
- **Mobile App**: Native iOS/Android for field work
- **Batch Operations**: Update multiple reports at once
- **Advanced Search**: Search by location radius, date range, etc.

**Overall Completeness**: 100% for core workflow ✅
**Next Enhancements**: Mobile optimization, offline mode, investigation templates

---

### 3. 🔍 **ANALYST** - Implementation Status: **55%**

#### ✅ What Works:
- **Authentication & Authorization**: Full access to all reports
- **Dashboard**: Analyst-specific dashboard ([/dashboard](apps/web/app/dashboard/page.tsx))
  - Active analyses counter
  - Completed analyses counter
  - Assigned reports counter
  - Cases involved counter
  - Quick action buttons (though some link to non-existent pages)
- **Reports Management**:
  - View ALL reports in system (full access)
  - Filter by status, type, priority
  - Search reports
  - View report details with full evidence
- **Map View**: Can see all incidents geospatially
- **Case Management**: Basic list view exists ([/dashboard/cases](apps/web/app/dashboard/cases/page.tsx))
- **Evidence View**: Can review all evidence

#### 🚧 Partially Working:
- **Case Management UI**: List exists but no case builder interface
- **Officer Assignment**: No UI to assign reports to officers
- **Analysis Jobs**: Database structure exists but no UI

#### ❌ Missing Critical Features:
- **AI Analysis Module**: ⚠️ **COMPLETELY MISSING** - Priority #1
  - No pattern detection
  - No risk scoring
  - No similarity matching
  - No predictive analysis
  - No xAI (Explainable AI) integration
  - Routes exist in nav ([/dashboard/analysis/*](apps/web/components/layout/side-nav.tsx)) but **pages don't exist**:
    - `/dashboard/analysis` - **404**
    - `/dashboard/analysis/new` - **404**
    - `/dashboard/analysis/history` - **404**
    - `/dashboard/analysis/xai` - **404**
- **Case Builder Interface**: Can't link multiple reports into case
- **Officer Assignment Tool**: No way to assign reports to officers via UI
- **Analytics Dashboard**: Route exists but **page missing** ([/dashboard/analytics](apps/web/components/layout/side-nav.tsx))
- **Pattern Alerts**: No automated pattern detection
- **Collaboration Tools**: Can't coordinate with multiple officers
- **Report Linking**: Can't manually link related incidents
- **Priority Scoring**: No automated priority calculation

#### 🔥 Blocks Analyst Workflow:
1. **NO AI ANALYSIS** - The core feature for analysts doesn't exist
2. **Can't build cases** - Can't group related reports into comprehensive cases
3. **Can't assign officers** - Have to manually communicate assignments
4. **No analytics** - Can't identify trends, patterns, hotspots

**Priority Fix**:
1. **Build AI Analysis Module** (Phase 6-7 from IMPLEMENTATION_PLAN.md)
2. **Create Case Builder UI**
3. **Add Officer Assignment Interface**
4. **Build Analytics Dashboard**

---

### 4. ⚖️ **PROSECUTOR** - Implementation Status: **45%**

#### ✅ What Works:
- **Authentication & Authorization**: Full access to reports and cases
- **Dashboard**: Prosecutor-specific dashboard ([/dashboard](apps/web/app/dashboard/page.tsx))
  - Active cases counter
  - In court cases counter
  - Pending review counter
  - Upcoming court dates counter
  - Upcoming deadlines list (when data exists)
- **Reports Access**: Can view all reports and evidence
- **Case Access**: Can view case list ([/dashboard/cases](apps/web/app/dashboard/cases/page.tsx))
- **Evidence Access**: Full evidence viewing capability

#### 🚧 Partially Working:
- **Case Detail View**: Basic view exists ([/dashboard/cases/[id]](apps/web/app/dashboard/cases/[id]/page.tsx))
- **Case Status Updates**: Can update but no legal workflow

#### ❌ Missing Critical Features:
- **Legal Case Builder**: No interface to prepare court documentation
- **My Cases View**: Route exists in nav but **page missing** ([/dashboard/cases/my](apps/web/components/layout/side-nav.tsx))
- **Court Calendar**: Route exists but **page missing** ([/dashboard/cases/calendar](apps/web/components/layout/side-nav.tsx))
- **Evidence Chain of Custody**: No formal legal evidence tracking
- **Case Strength Assessment**: No tools to evaluate legal viability
- **Document Generation**: No templates for legal docs
- **Collaboration with Analysts**: No formal review/request system
- **Case Outcome Tracking**: No verdict/resolution recording
- **Legal Status Workflow**: No progression from review → filing → court → verdict
- **Discovery Management**: No opposing counsel document sharing

#### 🔥 Blocks Prosecutor Workflow:
1. **Can't manage case pipeline** - No My Cases or calendar view
2. **No legal documentation tools** - Manual work outside system
3. **Can't track case outcomes** - No historical data on results
4. **No chain of custody** - Evidence may not be admissible

**Priority Fix**:
1. **Create My Cases page** with legal status workflow
2. **Build Court Calendar** with deadline tracking
3. **Add Chain of Custody** for evidence
4. **Create Case Outcome tracking**

---

### 5. 🔧 **ADMIN** - Implementation Status: **75%**

#### ✅ What Works:
- **Authentication & Authorization**: Full system access
- **Dashboard**: Admin sees officer-style dashboard (functional but not admin-specific)
- **User Management**:
  - Full CRUD operations ([/dashboard/users](apps/web/app/dashboard/users/page.tsx))
  - View all users
  - Create new users ([/dashboard/users/new](apps/web/app/dashboard/users/new/page.tsx))
  - Edit users ([/dashboard/users/[id]](apps/web/app/dashboard/users/[id]/page.tsx))
  - Activate/deactivate users
  - API routes working ([/api/users/*](apps/web/app/api/users))
- **Full Data Access**: Can see all reports, cases, evidence
- **All Features**: Can access all role features

#### 🚧 Partially Working:
- **Admin Dashboard**: Currently shows officer dashboard, needs admin-specific view
- **System Settings**: No dedicated settings page exists

#### ❌ Missing Critical Features:
- **Admin-Specific Dashboard**: Should show:
  - Total users by role
  - System health metrics
  - Platform usage statistics
  - Recent user activity
  - Security alerts
- **System Settings Page**: Route exists but **page missing** ([/settings](apps/web/components/layout/side-nav.tsx))
  - No system configuration UI
  - No feature flags
  - No environment settings
- **Audit Logs**: No tracking of user actions
- **Department Management**: Database has department field but no CRUD UI
- **Location Management**: No UI to manage predefined locations
- **Data Export**: No bulk export functionality
- **Backup/Restore**: No data management tools
- **Report Templates**: No admin control over report types/fields
- **Role Permissions**: No granular permission management
- **Email Settings**: No SMTP configuration UI

#### 🔥 Blocks Admin Workflow:
1. **No audit logs** - Can't track who did what
2. **No system settings** - Have to modify database directly
3. **Limited user management** - Can't manage departments/permissions granularly

**Priority Fix**:
1. **Create Admin Dashboard** with system metrics
2. **Build Settings Page** for system configuration
3. **Add Audit Logging** for compliance
4. **Create Department Management** UI

---

## Current Implementation Status Summary

### ✅ Fully Implemented (Working End-to-End):
- **Authentication System**: Login, logout, session management, JWT tokens
- **Authorization**: Role-based access control at route and API level
- **Report CRUD**: Create, read, update reports with validation
- **Evidence Upload**: Photo upload and viewing
- **Notes System**: Activity timeline and updates on reports
- **User Management**: Full CRUD for admin users
- **Map View**: Geospatial visualization of incidents
- **Basic Dashboards**: Role-specific stats and counters

### 🚧 Partially Implemented (Exists but Incomplete):
- **Case Management**: Database + API + List UI exist, but no case builder or workflow
- **Evidence Management**: Standalone page exists but not integrated into workflow
- **Prosecutor Tools**: Basic access exists but no legal workflow
- **Citizen Portal**: Can submit reports but limited tracking/communication
- **Mobile Experience**: Responsive design but not optimized for field use

### ❌ Not Implemented (Critical Gaps):
- **AI Analysis Module**: 0% - Routes in nav but no pages/API
  - `/dashboard/analysis` - doesn't exist
  - `/dashboard/analysis/new` - doesn't exist
  - `/dashboard/analysis/history` - doesn't exist
  - `/dashboard/analysis/xai` - doesn't exist
- **Analytics Dashboard**: 0% - Route exists but no page
  - `/dashboard/analytics` - doesn't exist
- **Notification System**: 0% - API structure exists but no implementation
- **Settings Pages**: 0% - Routes exist but no pages
  - `/settings` - doesn't exist
  - `/help` - doesn't exist
- **Prosecutor-Specific Pages**: 0%
  - `/dashboard/cases/my` - doesn't exist
  - `/dashboard/cases/calendar` - doesn't exist
- **Advanced Features**: 0%
  - Officer assignment UI
  - Case builder interface
  - Chain of custody tracking
  - Document generation
  - Advanced search/filtering
  - Batch operations
  - Audit logging
  - Department management

---

## Workflow Completeness Assessment

### ✅ Workflow 1 (Citizen → Resolution): **50% Complete**
- ✅ Step 1: Citizen submits report - **WORKING**
- ❌ Step 2: Analyst assigns to officer - **NO UI** (can update DB manually)
- ✅ Step 3: Officer investigates - **WORKING**
- ✅ Step 4: Officer adds evidence/notes - **WORKING**
- ❌ Step 5: Analyst runs AI analysis - **NOT IMPLEMENTED**
- 🚧 Step 6: Analyst builds case - **PARTIAL** (can create case but no linking UI)
- 🚧 Step 7: Prosecutor reviews case - **PARTIAL** (can view but no legal workflow)
- ❌ Step 8: Legal documentation - **NOT IMPLEMENTED**
- ❌ Step 10: Citizen receives updates - **NOT IMPLEMENTED** (no notifications)

### ❌ Workflow 2 (Pattern Detection): **20% Complete**
- ✅ Step 1: Citizens report incidents - **WORKING**
- ✅ Step 2: Analyst views dashboard - **WORKING**
- ❌ Step 3: AI identifies patterns - **NOT IMPLEMENTED**
- ❌ Step 4: Assign multiple officers - **NO UI**
- ✅ Step 5: Officers collect evidence - **WORKING**
- ❌ Step 6: Link reports into case - **NO UI**
- 🚧 Step 7: Build case file - **PARTIAL**
- 🚧 Step 8: Prosecutor review - **PARTIAL**

### 🚧 Workflow 3 (Escalation): **60% Complete**
- ✅ Reports can be created and viewed - **WORKING**
- ❌ No automated escalation rules - **NOT IMPLEMENTED**
- ❌ No priority-based assignment - **NOT IMPLEMENTED**
- ❌ No admin alerts for critical reports - **NOT IMPLEMENTED**

---

## User Journey Examples

### Example 1: Factory Pollution Report

**Day 1 - Citizen Report**:
- **Maria (Citizen)** sees factory dumping waste into river
- Logs into PLAZA platform
- Submits new report with photos and location
- Report status: SUBMITTED

**Day 2 - Analyst Review**:
- **Sarah (Analyst)** reviews new reports dashboard
- Sees Maria's factory pollution report
- Marks as high priority
- Assigns to **John (Officer)** in that district
- Report status: IN_PROGRESS

**Day 3-5 - Field Investigation**:
- **John (Officer)** receives assignment
- Reviews report details and location
- Conducts site visit to factory
- Takes additional photos and water samples
- Documents findings in report notes
- Updates evidence with sample results

**Day 6 - Analysis**:
- **Sarah (Analyst)** reviews John's findings
- Runs AI analysis to check for patterns
- Finds 3 other similar reports from same factory
- Links all 4 reports into single case
- Prepares comprehensive case file

**Day 7 - Legal Review**:
- **David (Prosecutor)** reviews prepared case
- Assesses evidence strength
- Confirms legal violations
- Prepares legal documentation
- Updates case status: RESOLVED
- Legal action initiated against factory

**Throughout Process**:
- **Maria (Citizen)** receives updates at each stage
- Can view investigation progress
- Sees when case is resolved
- Platform transparency maintained

### Example 2: Multiple Citizen Reports Pattern

**Week 1**:
- 10 **Citizens** independently report illegal logging in forest area
- All reports marked SUBMITTED

**Week 1 - Pattern Detection**:
- **Analyst** AI system identifies pattern (same location, similar timeframe)
- **Analyst (Tom)** reviews pattern alert
- Assigns 3 **Officers** to investigate different areas

**Week 2 - Coordinated Investigation**:
- 3 **Officers** collect evidence independently
- Each adds notes and evidence to their assigned reports
- **Analyst (Tom)** monitors all investigations

**Week 3 - Case Building**:
- **Tom (Analyst)** links all 10 reports into single case
- Compiles evidence from all officers
- Identifies organized illegal operation
- Prepares major case file

**Week 4 - Prosecution**:
- **Prosecutor (Lisa)** reviews major case
- Strong evidence from multiple sources
- Prepares charges for organized crime
- Case goes to court with solid evidence

---

## Role-Specific Dashboards

### **Citizen Dashboard**:
- My Reports (submitted incidents)
- Report Status Tracking
- Notifications/Updates
- Submit New Report Button

### **Officer Dashboard**:
- Assigned to Me (active investigations)
- My Reports (reports I created)
- Map View (incident locations)
- Recent Activity
- Quick Actions (add evidence, update status)

### **Analyst Dashboard**:
- All Reports (system-wide view)
- Cases I'm Managing
- Pattern Alerts (AI-detected)
- Officer Assignments
- Pending Analysis Queue
- Analytics & Statistics

### **Prosecutor Dashboard**:
- Cases Ready for Review
- Legal Status Tracking
- Evidence Chain of Custody
- Court Calendar
- Case Outcomes
- Priority Cases

### **Admin Dashboard**:
- User Management
- System Health
- Platform Statistics
- Department Management
- Audit Logs
- Configuration Settings

---

## Data Visibility Matrix

| Role | Own Reports | Assigned Reports | All Reports | Cases | Users | Settings |
|------|------------|------------------|-------------|-------|-------|----------|
| Citizen | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Officer | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Analyst | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Prosecutor | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Security & Access Control

### Authentication:
- JWT-based authentication
- HTTP-only secure cookies
- Token refresh mechanism
- Session management

### Authorization:
- Role-based access control (RBAC)
- Route-level protection
- API endpoint validation
- Data-level permissions

### Data Access Rules:
1. **Citizens**: Own reports only
2. **Officers**: Own + Assigned reports
3. **Analysts**: All reports + cases
4. **Prosecutors**: All reports + cases
5. **Admins**: Complete access

### Field-Level Restrictions:
- Citizens: Limited update fields (title, description, location)
- Officers: Can update status, add evidence/notes
- Analysts: Can update all fields, assign officers
- Prosecutors: Can update legal status, case outcomes
- Admins: No restrictions

---

## Next Phase Priorities

### Phase A: Critical Pre-Launch (Current Focus)
1. **AI Analysis Module** - Enable pattern detection
2. **Case Management UI** - Build case interface for analysts
3. **Prosecutor Dashboard** - Complete legal workflow
4. **Citizen Portal** - Enhanced tracking and notifications

### Phase B: Platform Completion
1. **Advanced Analytics** - Dashboards and insights
2. **Search & Filters** - Enhanced discovery
3. **Notification System** - Email/SMS alerts
4. **Mobile Optimization** - Responsive improvements

### Phase C: Enhancement
1. **Mobile Apps** - Native iOS/Android
2. **Performance** - Optimization and caching
3. **Advanced Features** - Predictive analysis, automation
4. **Integration** - Third-party systems

---

*Document Last Updated: Based on implementation as of current session*
*Platform Version: v0.9 (65% complete)*
