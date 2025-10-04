# PLAZA Toolkit - Next Steps & Development Guide

**Version**: MVP Post-Testing Phase
**Date**: 2025-10-04
**Status**: Ready for Production Preparation

---

## 🎯 Immediate Next Steps (Pre-Production)

### Phase 1: Production Readiness (Priority: CRITICAL)
**Timeline**: 1-2 weeks before launch

#### 1. Security Hardening ⚠️
- [ ] Add rate limiting to API endpoints
  - **Files to check**: `apps/web/middleware.ts`, all `/api/**/route.ts`
  - **Implementation**: Use `express-rate-limit` or Next.js middleware
  - **What I need from you**: Confirm rate limits (e.g., 100 requests/15min per IP)

- [ ] Implement CORS properly
  - **Files to check**: `apps/web/next.config.ts`
  - **What I need from you**: Approved domain list for production

- [ ] Add input validation middleware
  - **Files to check**: All API routes in `apps/web/app/api/`
  - **Implementation**: Use Zod schemas from `packages/types/src/forms.ts`
  - **What I need from you**: Review validation rules

- [ ] Environment variables security audit
  - **Files to check**: `.env.example`, deployment configs
  - **What I need from you**: Production environment variables (DB, JWT secret, etc.)

#### 2. Error Monitoring & Logging 📊
- [ ] Set up Sentry for error tracking
  - **Files to create**: `apps/web/lib/sentry.ts`
  - **Files to modify**: `apps/web/app/layout.tsx`, all API routes
  - **What I need from you**: Sentry DSN and project settings

- [ ] Implement logging (Winston/Pino)
  - **Files to create**: `packages/lib/src/logger.ts`
  - **Files to modify**: All API routes, critical functions
  - **What I need from you**: Log level preferences (info, warn, error)

#### 3. Performance Optimization 🚀
- [ ] Database query optimization review
  - **Files to check**: `packages/lib/src/db-api.ts`
  - **Action**: Add database indexes, optimize Prisma queries
  - **What I need from you**: Test with production-scale data

- [ ] Image optimization
  - **Files to check**: `apps/web/app/api/upload/route.ts`, `apps/web/app/api/photos/upload/route.ts`
  - **Action**: Add image compression, thumbnail generation
  - **What I need from you**: Max file sizes, supported formats

- [ ] Caching strategy
  - **Files to create**: `apps/web/lib/cache.ts`
  - **Action**: Implement Redis/in-memory caching for dashboard stats
  - **What I need from you**: Cache TTL preferences

#### 4. Testing & QA 🧪
- [ ] Write automated tests
  - **Files to create**: `apps/web/__tests__/` directory
  - **Coverage needed**: API endpoints, auth, RBAC
  - **What I need from you**: Test scenarios priority list

- [ ] Load testing
  - **Tools**: k6, Artillery, or JMeter
  - **What I need from you**: Expected concurrent users, peak load scenarios

- [ ] Cross-browser testing
  - **Browsers**: Chrome, Firefox, Safari, Edge
  - **What I need from you**: Supported browser versions

---

## 📋 Phase 2: Feature Enhancements (Post-Launch)

### Priority 1: Prosecutor Workflow Enhancement
**Timeline**: 2-4 weeks post-launch

#### Files to Modify:
- `apps/web/app/dashboard/cases/[id]/page.tsx` - Case details page
- `apps/web/components/cases/legal-status-dialog.tsx` - Create new
- `apps/web/components/cases/court-date-picker.tsx` - Create new
- `apps/web/app/api/cases/[id]/route.ts` - Add legal status updates

#### Features to Add:
- [ ] Legal status update dropdown
  - **What I need from you**: Legal status workflow (states and transitions)
- [ ] Court date picker with calendar integration
  - **What I need from you**: Court scheduling rules/constraints
- [ ] Verdict field with options
  - **What I need from you**: Verdict options list
- [ ] Legal document upload
  - **What I need from you**: Document types and requirements

### Priority 2: Map & Location Services
**Timeline**: 3-4 weeks post-launch

#### Files to Modify:
- `apps/web/components/map/map-component.tsx`
- `apps/web/app/dashboard/map/page.tsx`
- `apps/web/app/dashboard/reports/new/page.tsx` - Location picker

#### Features to Add:
- [ ] Reverse geocoding (coordinates → address)
  - **What I need from you**: Preferred geocoding service (Google Maps, Mapbox, OpenStreetMap)
- [ ] Address autocomplete
  - **What I need from you**: API keys for location service
- [ ] Drawing tools for incident areas
  - **What I need from you**: Area drawing requirements
- [ ] Location clustering improvements
  - **What I need from you**: Clustering preferences

### Priority 3: Settings & User Preferences
**Timeline**: 2-3 weeks post-launch

#### Files to Create:
- `apps/web/app/dashboard/settings/profile/page.tsx`
- `apps/web/app/dashboard/settings/notifications/page.tsx`
- `apps/web/app/dashboard/settings/security/page.tsx`
- `apps/web/components/settings/` - Settings components

#### Features to Add:
- [ ] User profile editing (name, email, avatar)
  - **What I need from you**: Editable fields list
- [ ] Notification preferences
  - **What I need from you**: Notification channel preferences (email, SMS, in-app)
- [ ] Password change
  - **What I need from you**: Password policy requirements
- [ ] Theme selection (light/dark mode)
  - **What I need from you**: Design system approval

### Priority 4: Export & Reporting
**Timeline**: 3-4 weeks post-launch

#### Files to Create:
- `apps/web/lib/pdf-generator.ts`
- `apps/web/app/api/reports/[id]/export/route.ts`
- `apps/web/app/api/cases/[id]/export/route.ts`

#### Features to Add:
- [ ] PDF report generation
  - **Tools**: PDFKit or Puppeteer
  - **What I need from you**: Report template design/format
- [ ] CSV export for data analytics
  - **What I need from you**: Export field requirements
- [ ] Batch export functionality
  - **What I need from you**: Batch size limits

---

## 🔮 Phase 3: Advanced Features (3+ months)

### AI & Analytics
- [ ] AI-powered pollution detection from photos
  - **What I need from you**: AI service provider choice, budget
- [ ] Trend analysis and predictions
  - **What I need from you**: Analysis requirements
- [ ] Pattern recognition for recurring incidents
  - **What I need from you**: Pattern definitions

### Real-time Features
- [ ] WebSocket notifications
  - **Files to create**: `apps/web/lib/websocket.ts`
  - **What I need from you**: Real-time requirements
- [ ] Live case collaboration
  - **What I need from you**: Collaboration features needed

### Mobile Application
- [ ] React Native app development
  - **What I need from you**: Platform priorities (iOS, Android, both)

---

## 📁 Key Files Reference for Future Development

### Core Architecture Files
```
ALWAYS CHECK THESE FILES WHEN DEVELOPING:
├── CLAUDE.md                          # Project overview & conventions
├── IMPLEMENTATION_PLAN.md             # System architecture
├── PLAZA_USER_ROLES_AND_WORKFLOWS.md  # User role definitions
├── TEST_REPORT.md                     # Current system status
└── NEXT_STEPS.md                      # This file
```

### Database & Types
```
WHEN ADDING/MODIFYING DATA MODELS:
├── packages/database/prisma/schema.prisma  # Database schema
├── packages/database/src/enums.ts          # Enums (UserRole, Status, etc.)
├── packages/types/src/                     # TypeScript types
│   ├── api.ts                              # API response types
│   ├── forms.ts                            # Zod validation schemas
│   └── ui.ts                               # UI component types
└── packages/lib/src/db-api.ts              # Database query functions
```

### Authentication & Authorization
```
WHEN MODIFYING AUTH/PERMISSIONS:
├── apps/web/lib/auth-utils.ts              # Auth helper functions
├── apps/web/lib/auth-middleware.ts         # Auth middleware
├── apps/web/lib/with-auth.ts               # Auth HOC
├── apps/web/middleware.ts                  # Next.js middleware (RBAC)
└── apps/web/app/api/auth/                  # Auth endpoints
    ├── login/route.ts
    ├── logout/route.ts
    └── session/route.ts
```

### API Routes
```
WHEN ADDING NEW ENDPOINTS:
├── apps/web/app/api/
│   ├── reports/                # Report CRUD
│   ├── cases/                  # Case management
│   ├── evidence/               # Evidence handling
│   ├── users/                  # User management
│   ├── notifications/          # Notifications
│   ├── dashboard/              # Dashboard stats
│   └── upload/                 # File uploads
```

### UI Components
```
WHEN BUILDING UI:
├── packages/ui/src/components/             # shadcn components
├── apps/web/components/                    # App-specific components
│   ├── auth/                               # Login, etc.
│   ├── dashboards/                         # Role dashboards
│   ├── reports/                            # Report components
│   ├── cases/                              # Case components
│   ├── evidence/                           # Evidence components
│   ├── map/                                # Map components
│   └── layout/                             # Layout components
```

### State Management
```
WHEN MANAGING STATE:
├── apps/web/lib/stores/
│   ├── auth.store.ts           # User session state
│   └── notification.store.ts   # Notifications state
```

---

## 🔄 Development Workflow

### When Starting a New Feature:

1. **Read Context**
   ```bash
   Read: CLAUDE.md, PLAZA_USER_ROLES_AND_WORKFLOWS.md
   Review: Relevant section in IMPLEMENTATION_PLAN.md
   ```

2. **Plan Changes**
   - Identify affected files (use Key Files Reference above)
   - Check if database changes needed → Update `schema.prisma`
   - Check if new types needed → Update `packages/types/`
   - Check if new API needed → Create in `apps/web/app/api/`

3. **Development**
   ```bash
   # Always run from project root
   pnpm dev          # Start dev server
   pnpm typecheck    # Check TypeScript errors
   pnpm lint         # Check linting
   ```

4. **Testing**
   - Manual test the feature
   - Test affected user roles
   - Test on different screen sizes
   - Check browser console for errors

5. **Documentation**
   - Update IMPLEMENTATION_PLAN.md if architecture changed
   - Update TEST_REPORT.md with test results
   - Update this file (NEXT_STEPS.md) with completed tasks

---

## 💬 What I Need From You During Development

### For Each New Feature/Task:

1. **Requirements Clarification**
   - User stories or use cases
   - Acceptance criteria
   - Priority level (Critical/High/Medium/Low)

2. **Design Decisions**
   - UI/UX mockups or descriptions
   - Workflow diagrams for complex features
   - Data model changes approval

3. **Business Rules**
   - Validation rules
   - Permission/access rules
   - Status transition rules
   - Notification triggers

4. **Testing Feedback**
   - After I implement, you test manually
   - Report bugs with steps to reproduce
   - Provide feedback on UX

5. **Deployment Information**
   - Environment details (staging, production)
   - Database connection strings
   - Third-party API keys
   - Domain names

---

## 🚨 Common Gotchas & Reminders

### Database Changes
```bash
# After modifying schema.prisma:
cd packages/database
pnpm db:push           # Push to DB
pnpm db:generate       # Regenerate Prisma client

# If you need to reset DB:
pnpm db:reset          # ⚠️ Deletes all data!
pnpm db:seed           # Re-seed with test data
```

### Adding shadcn Components
```bash
# From project root:
pnpm dlx shadcn@latest add [component-name] -c apps/web

# Components go to: packages/ui/src/components/
```

### API Development Pattern
```typescript
// Always use this pattern for API routes:
import { withAuth } from '@/lib/with-auth';
import type { ApiResponse } from '@workspace/types/api';

export async function GET(request: NextRequest) {
  const authResult = await withAuth(request);
  if ('error' in authResult) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: authResult.error },
      { status: authResult.status }
    );
  }

  const { user } = authResult;
  // Your logic here
}
```

### TypeScript Errors
```bash
# Check type errors before committing:
cd apps/web
pnpm typecheck

# Common fixes:
# 1. Regenerate Prisma client: pnpm db:generate
# 2. Check import paths use @workspace/* aliases
# 3. Update type definitions in packages/types/
```

---

## 📊 Progress Tracking Template

### Feature: [Feature Name]
**Started**: [Date]
**Completed**: [Date]
**Status**: 🟢 Complete / 🟡 In Progress / 🔴 Blocked

**Files Modified**:
- [ ] File 1
- [ ] File 2

**Tests**:
- [ ] Manual testing completed
- [ ] User role X tested
- [ ] User role Y tested

**Notes**:
- Any issues encountered
- Design decisions made
- Follow-up tasks needed

---

## 🎯 Current MVP Status

✅ **Completed & Working**:
- Authentication & Authorization (JWT, RBAC)
- All 5 user role dashboards
- Report management (CRUD)
- Case management (CRUD)
- Evidence upload & management
- Photo uploads
- Notifications system
- User management (Admin)
- Status workflows
- Role-based data access

🟡 **Deferred to Phase 2**:
- AI Analysis features
- Prosecutor legal workflow UI enhancements
- Map location services integration
- Settings page full implementation
- Advanced analytics

⏳ **Needs Immediate Attention** (Pre-Production):
- Security hardening
- Error monitoring
- Performance optimization
- Load testing

---

## 📞 Communication Protocol

### When Reporting Issues:
1. **Error messages**: Copy exact error text
2. **Steps to reproduce**: Detailed steps
3. **Expected vs Actual**: What should happen vs what happened
4. **User role**: Which role were you testing?
5. **Browser**: Which browser/device?

### When Requesting Features:
1. **User story**: "As a [role], I want to [action], so that [benefit]"
2. **Priority**: Critical/High/Medium/Low
3. **Mockup**: Screenshot or description of UI
4. **Related**: Link to any related features/issues

### Quick Response Format:
```markdown
## Issue/Feature: [Name]
**Type**: Bug 🐛 / Feature ✨ / Enhancement 🔧
**Priority**: 🔴 Critical / 🟡 High / 🟢 Medium / ⚪ Low
**User Role**: CITIZEN/OFFICER/ANALYST/PROSECUTOR/ADMIN

**Description**:
[Clear description]

**Steps** (for bugs):
1. Step 1
2. Step 2
3. Error occurs

**Acceptance Criteria** (for features):
- [ ] Criterion 1
- [ ] Criterion 2
```

---

## 🎓 Learning Resources

### Next.js 15 (App Router)
- [Next.js Docs](https://nextjs.org/docs)
- [App Router Migration](https://nextjs.org/docs/app/building-your-application/upgrading)

### Prisma
- [Prisma Docs](https://www.prisma.io/docs)
- [Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

### shadcn/ui
- [Component Docs](https://ui.shadcn.com)
- [Customization](https://ui.shadcn.com/docs/theming)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

---

**Last Updated**: 2025-10-04
**Next Review**: Before Phase 2 planning
**Maintainer**: Development Team

---

## Quick Command Reference

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Build for production
pnpm lint                   # Lint all packages
pnpm typecheck             # Type check (from apps/web)

# Database
pnpm db:push               # Push schema changes
pnpm db:generate           # Generate Prisma client
pnpm db:studio             # Open Prisma Studio
pnpm db:seed               # Seed test data
pnpm db:reset              # Reset database

# Testing
pnpm test                  # Run tests (when added)

# Adding components
pnpm dlx shadcn@latest add [component] -c apps/web
```

**Ready to build the future of environmental protection! 🌍🚀**
