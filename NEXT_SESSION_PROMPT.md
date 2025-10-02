# Next Session Prompt - PLAZA Toolkit Development

## Context
You are continuing development on the PLAZA Environmental Incident Investigation Platform. This is a Turborepo monorepo using Next.js 15, Prisma, and shadcn/ui components.

## What Has Been Completed

### ✅ Citizen Role (85% Complete)
- Dashboard with stats cards and recent reports
- "My Reports" page showing citizen's submitted reports
- Submit new report functionality with photo uploads
- Role-based navigation (simplified for citizens)
- Notification system for:
  - Report submission confirmation
  - Status changes (UNDER_REVIEW, IN_PROGRESS, RESOLVED, DISMISSED)
  - Officer assignment notifications
- Status timeline visualization on report detail page
- Restricted permissions (cannot assign officers, update status/priority)
- Smart back/cancel navigation based on role
- Report detail page with citizen-specific actions (Download PDF only)

### ✅ Analyst Role (Core Features Complete)
- Fixed notification navigation 404 error
- Implemented officer assignment UI:
  - AssignOfficerDialog component with dropdown selection
  - Shows officer details (name, badge, department)
  - Supports both initial assignment and reassignment
  - Auto-creates notifications for citizens when officer assigned
  - Success/error toasts with proper feedback
- Updated middleware to allow proper route access
- Updated users API to allow analysts to fetch officers

### 🔄 What Still Needs Work

#### 1. Officer Role (Priority: HIGH)
**Current Status**: Basic structure exists but workflow incomplete

**Required Features**:
- [ ] Officer dashboard showing assigned reports
- [ ] Quick access to reports assigned to them
- [ ] Evidence upload and management for assigned reports
- [ ] Case creation from reports
- [ ] Update report status (UNDER_REVIEW → IN_PROGRESS → RESOLVED)
- [ ] Add notes/comments to investigations
- [ ] Photo upload during investigation
- [ ] Link evidence to reports
- [ ] View case details and progress

**Key User Story**:
> As an Officer, when I login, I should see all reports assigned to me. I can click a report, review details, upload evidence photos, update the status, add investigation notes, and create a case if warranted.

#### 2. Prosecutor Role (Priority: MEDIUM)
**Current Status**: Structure exists but no workflow implemented

**Required Features**:
- [ ] Prosecutor dashboard showing cases ready for legal action
- [ ] View cases with all linked reports and evidence
- [ ] Filter cases by status (OPEN, UNDER_REVIEW, FILED, CLOSED)
- [ ] Download case files as PDF
- [ ] Add legal notes to cases
- [ ] Update case status
- [ ] View evidence chain of custody
- [ ] Generate case summary reports

#### 3. Admin Role (Priority: MEDIUM)
**Current Status**: User management exists but incomplete

**Required Features**:
- [ ] Complete user management (already partially implemented)
- [ ] System-wide analytics dashboard
- [ ] Audit logs for all actions
- [ ] Configure system settings
- [ ] Manage departments and badges
- [ ] Deactivate/reactivate users
- [ ] View all reports, cases, and evidence across system
- [ ] Export data for compliance

## Technical Debt & Improvements

### Notifications
- [ ] Add real-time notifications (currently polling every 30s)
- [ ] Implement notification preferences
- [ ] Add notification for comments/notes on reports
- [ ] Group notifications by type

### Map Integration
- [ ] Complete Leaflet.js map integration
- [ ] Show all reports on map with markers
- [ ] Filter reports by location/radius
- [ ] Cluster markers for better performance
- [ ] Click marker to view report details

### Evidence Management
- [ ] Evidence upload page exists but needs testing
- [ ] Chain of custody tracking
- [ ] Evidence tagging and categorization
- [ ] Link evidence to multiple reports/cases
- [ ] Evidence photo gallery view

### Case Management
- [ ] Case creation workflow (link multiple reports)
- [ ] Case status timeline
- [ ] Case assignment to prosecutors
- [ ] Case notes and legal documentation
- [ ] Case closure workflow

### Testing & Quality
- [ ] Add unit tests for API routes
- [ ] Add integration tests for workflows
- [ ] Add E2E tests with Playwright
- [ ] Fix TypeScript strict mode errors
- [ ] Add error boundaries
- [ ] Improve loading states

## Next Immediate Task: Officer Role Implementation

### Step-by-Step Plan

#### Phase 1: Officer Dashboard (Estimated: 1-2 hours)

1. **Update Officer Dashboard Page** (`apps/web/app/dashboard/page.tsx`)
   - Create `renderOfficerDashboard()` function
   - Show stats:
     - Total assigned reports
     - Reports by status (Assigned, In Progress, Completed)
     - Recent activity
   - Add quick actions:
     - View assigned reports
     - Upload evidence
     - View cases
   - Show list of assigned reports (last 5)

2. **Create Officer Reports Page** (`apps/web/app/dashboard/reports/assigned/page.tsx`)
   - List all reports assigned to the logged-in officer
   - Filter by status (UNDER_REVIEW, IN_PROGRESS, RESOLVED)
   - Search by report number or title
   - Sort by date, priority, status
   - Click report to view details

3. **Update Report Detail Page for Officers** (`apps/web/app/dashboard/reports/[id]/page.tsx`)
   - Add "Investigation Actions" card for officers
   - Show buttons:
     - Update Status
     - Add Note
     - Upload Evidence
     - Create Case
   - Show investigation timeline/notes section
   - Display all evidence linked to report

#### Phase 2: Status Update Functionality (Estimated: 1 hour)

4. **Create Status Update Dialog Component** (`apps/web/components/reports/update-status-dialog.tsx`)
   - Dropdown with allowed status transitions:
     - SUBMITTED → UNDER_REVIEW
     - UNDER_REVIEW → IN_PROGRESS
     - IN_PROGRESS → RESOLVED
     - Any status → DISMISSED
   - Require note/reason for status change
   - Show current status
   - Submit PATCH to `/api/reports/[id]`
   - Auto-create notification for report author

5. **Update Report API** (`apps/web/app/api/reports/[id]/route.ts`)
   - Validate status transitions
   - Ensure only assigned officer or analyst can update status
   - Create activity log entry for status change
   - Trigger notification to citizen

#### Phase 3: Investigation Notes (Estimated: 1 hour)

6. **Create Notes Section Component** (`apps/web/components/reports/notes-section.tsx`)
   - Display all notes/comments on report
   - Show author, timestamp, content
   - Add new note form (textarea + submit)
   - Real-time updates when new notes added
   - Role-based visibility (citizens can't see internal notes)

7. **Create Notes API** (`apps/web/app/api/reports/[id]/notes/route.ts`)
   - GET: Fetch all notes for report
   - POST: Create new note
   - Validate officer is assigned or user is analyst/admin
   - Store note with userId, timestamp, content

#### Phase 4: Evidence Upload for Officers (Estimated: 1-2 hours)

8. **Update Evidence Upload Page** (`apps/web/app/dashboard/evidence/new/page.tsx`)
   - Auto-link to report if coming from report detail page
   - Show report details when linked
   - Upload multiple photos
   - Add evidence type (Photo, Document, Physical Item)
   - Add description and tags
   - Store uploadedBy officer ID

9. **Create Evidence API Enhancements** (`apps/web/app/api/evidence/route.ts`)
   - Link evidence to report via reportId
   - Support multiple file uploads
   - Validate file types (images, PDFs)
   - Create thumbnail for images
   - Return evidence with photo URLs

10. **Display Evidence on Report Detail Page**
    - Create `EvidenceGallery` component
    - Grid view of all evidence photos
    - Click to enlarge (lightbox)
    - Show evidence metadata (uploaded by, date, description)
    - Download evidence button

#### Phase 5: Case Creation (Estimated: 1-2 hours)

11. **Create Case Creation Dialog** (`apps/web/components/cases/create-case-dialog.tsx`)
    - Auto-include current report
    - Option to link additional reports
    - Case title and description
    - Priority level
    - Auto-assign to prosecutor (optional)
    - Submit to `/api/cases`

12. **Update Cases API** (`apps/web/app/api/cases/route.ts`)
    - POST: Create new case
    - Link reports to case via junction table
    - Set initial status to OPEN
    - Create notification for assigned prosecutor
    - Return case with linked reports

13. **Update Report Detail to Show Linked Case**
    - If report is part of a case, show case card
    - Display case number, title, status
    - Link to case detail page

#### Phase 6: Testing & Refinement (Estimated: 1 hour)

14. **Create Officer Testing Guide** (`OFFICER_TESTING_GUIDE.md`)
    - Login credentials (mike.officer@email.com)
    - Test flows for all officer features
    - Expected behaviors and permissions
    - API call examples
    - Troubleshooting section

15. **Test Complete Officer Workflow**
    - Login as officer
    - View assigned reports
    - Update report status
    - Add investigation note
    - Upload evidence
    - Create case from report
    - Verify notifications sent to citizen
    - Verify UI updates correctly

16. **Update Documentation**
    - Update `PLAZA_USER_ROLES_AND_WORKFLOWS.md`
    - Mark Officer role as complete
    - Document completed features
    - Update implementation percentage

### Files to Create

```
apps/web/app/dashboard/reports/assigned/page.tsx
apps/web/components/reports/update-status-dialog.tsx
apps/web/components/reports/notes-section.tsx
apps/web/components/reports/evidence-gallery.tsx
apps/web/components/cases/create-case-dialog.tsx
apps/web/app/api/reports/[id]/notes/route.ts
OFFICER_TESTING_GUIDE.md
```

### Files to Modify

```
apps/web/app/dashboard/page.tsx (add renderOfficerDashboard)
apps/web/app/dashboard/reports/[id]/page.tsx (add officer actions)
apps/web/app/api/reports/[id]/route.ts (enhance status updates)
apps/web/app/api/evidence/route.ts (enhance evidence linking)
apps/web/app/api/cases/route.ts (already exists, needs completion)
apps/web/components/layout/side-nav.tsx (add officer nav items)
PLAZA_USER_ROLES_AND_WORKFLOWS.md (update officer status)
```

## Key Technical Considerations

### Authentication & Permissions
- Officers can only update status on reports assigned to them
- Officers can view all reports but only take action on assigned ones
- Analysts can assign/reassign reports to different officers
- Citizens should receive notifications for all status changes

### Database Relations
- Report → Officer (assigneeId)
- Report → Many Photos
- Report → Many Evidence
- Report → Many Notes (internal, not visible to citizens)
- Report → Many Cases (via ReportCase junction)
- Case → Many Reports
- Case → Prosecutor (assignedToId)

### Notifications to Trigger
- When officer updates status → notify citizen
- When officer adds evidence → notify citizen (optional)
- When officer creates case → notify prosecutor
- When officer adds note → do NOT notify citizen (internal only)

## Environment Setup

```bash
# Start dev server
pnpm dev

# Server runs on: http://localhost:3000 (or 3001 if 3000 is busy)

# Database operations
pnpm db:push      # Push schema changes
pnpm db:generate  # Generate Prisma client
pnpm db:seed      # Seed test data
```

## Test Accounts

```
Citizen: john.doe@email.com / Password123!
Officer: mike.officer@email.com / Password123!
Analyst: sarah.analyst@email.com / Password123!
Prosecutor: david.prosecutor@email.com / Password123!
Admin: admin@plaza.gov / admin123!
```

## Success Criteria

The Officer role implementation is complete when:
- [x] Officer can login and see dashboard with assigned reports
- [x] Officer can view list of all reports assigned to them
- [x] Officer can update report status with required note
- [x] Officer can add investigation notes (internal only)
- [x] Officer can upload evidence and link to reports
- [x] Officer can create cases from reports
- [x] Citizens receive notifications for status changes
- [x] Prosecutors receive notifications for new cases
- [x] All actions are logged and visible in activity timeline
- [x] UI is responsive and provides clear feedback
- [x] Testing guide is complete and all tests pass

## Starting Prompt for Next Session

```
Continue implementing the Officer role workflow in the PLAZA Toolkit.

Completed so far:
- Citizen role (85% complete) with notifications and status timeline
- Analyst role with officer assignment dialog and notification fixes

Next task: Implement Officer role features

Follow the step-by-step plan in NEXT_SESSION_PROMPT.md starting with Phase 1: Officer Dashboard.

Key requirements:
1. Create officer-specific dashboard showing assigned reports
2. Add status update functionality with notifications
3. Implement investigation notes (internal only)
4. Enable evidence upload linked to reports
5. Create case creation workflow
6. Test complete officer workflow end-to-end

Test account: mike.officer@email.com / Password123!

Start by creating the officer dashboard in apps/web/app/dashboard/page.tsx
```

## Related Documentation

- [CLAUDE.md](CLAUDE.md) - Codebase overview and commands
- [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) - Full project roadmap
- [PLAZA_USER_ROLES_AND_WORKFLOWS.md](PLAZA_USER_ROLES_AND_WORKFLOWS.md) - User roles and permissions
- [CITIZEN_NOTIFICATION_TESTING_GUIDE.md](CITIZEN_NOTIFICATION_TESTING_GUIDE.md) - Citizen testing flows
- [ANALYST_TESTING_GUIDE.md](ANALYST_TESTING_GUIDE.md) - Analyst testing flows
- [SESSION_SUMMARY.md](SESSION_SUMMARY.md) - Previous session summary

## Notes

- The codebase uses **sonner** for toasts, not shadcn/ui toast
- All components use **client components** ("use client") when interactive
- Follow existing patterns in `apps/web/app/dashboard/reports/[id]/page.tsx`
- Use `useAuthStore` from `@/lib/stores/auth.store` for current user
- API routes use `verifyAuth()` from `@/lib/auth-utils`
- Database operations use APIs from `@workspace/lib/db-api`

---

**Last Updated**: 2025-10-02
**Current Focus**: Officer Role Implementation
**Next Priority**: After Officer → Prosecutor → Admin roles
