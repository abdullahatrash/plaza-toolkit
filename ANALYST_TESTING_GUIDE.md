# Analyst Role - Testing Guide

## Overview
This guide helps you test the Analyst role functionality in the PLAZA Toolkit, focusing on officer assignment and notification features.

## Test Account
- **Email**: sarah.analyst@email.com
- **Password**: Password123!
- **Role**: ANALYST

## Fixed Issues
1. ✅ **Notification Navigation 404**: Fixed middleware to allow access to `/dashboard/reports/*` routes
2. ✅ **Officer Assignment UI**: Implemented interactive dialog for assigning officers to reports

## Test Flow 1: View and Assign Officer to New Report

### Step 1: Login as Analyst
1. Navigate to http://localhost:3001/login
2. Login with analyst credentials (sarah.analyst@email.com / Password123!)
3. You should be redirected to the analyst dashboard

### Step 2: Access Reports via Notification
1. Click the bell icon (🔔) in the top navigation bar
2. You should see notifications without getting a 404 error
3. Click on a notification about a new report
4. You should be navigated to the report detail page successfully

### Step 3: Assign an Officer to Report
1. On the report detail page, look for the "Assigned To" card
2. If no officer is assigned, you'll see:
   - "Not assigned" text
   - "Assign Officer" button
3. Click the "Assign Officer" button
4. A dialog should open with:
   - Report title shown in description
   - Dropdown to select an officer
   - List of available officers with their badge numbers and departments
5. Select an officer from the dropdown
6. Click "Assign Officer" button
7. You should see a success toast: "Officer assigned successfully."
8. The dialog closes and page refreshes
9. The "Assigned To" card now shows the officer's details

### Step 4: Reassign to Different Officer
1. With an officer already assigned, you'll see:
   - Officer's avatar and details
   - "Reassign Officer" button
2. Click "Reassign Officer"
3. Dialog opens showing:
   - "Currently assigned to: [Officer Name]"
   - Dropdown pre-selected with current officer
4. Select a different officer
5. Click "Assign Officer"
6. Verify the assignment updates successfully

## Test Flow 2: Verify Notifications Work

### Step 1: Check Notification Access
1. Login as analyst (sarah.analyst@email.com)
2. Click the bell icon in top navigation
3. Verify you can see the notifications dropdown (no 404)
4. Verify you can see notification count badge if there are unread items

### Step 2: Click Notification Links
1. Find a notification with a link to a report
2. Click on the notification
3. Verify it navigates to `/dashboard/reports/[id]` without 404 error
4. Verify the notification is marked as read (blue dot disappears)

## Test Flow 3: Analyst Permissions

### What Analysts CAN Do:
- ✅ View all reports in the system
- ✅ Assign officers to reports
- ✅ Reassign officers to different reports
- ✅ View report details (author, location, photos, evidence)
- ✅ Access notifications
- ✅ View user management (/dashboard/users)
- ✅ Manage cases

### What Analysts CANNOT Do:
- ❌ Submit new reports (that's for Citizens and Officers)
- ❌ Upload photos (that's for Citizens and Officers)
- ❌ Delete reports (Admin only)

## Expected API Calls

### 1. Fetch Officers for Assignment
```
GET /api/users?role=OFFICER&limit=100
```
**Expected Response:**
```json
{
  "users": [
    {
      "id": "user_id",
      "name": "Officer Name",
      "email": "officer@email.com",
      "badge": "12345",
      "department": "Environmental Crimes"
    }
  ],
  "total": 10,
  "page": 1,
  "limit": 100
}
```

### 2. Assign Officer to Report
```
PATCH /api/reports/[reportId]
Content-Type: application/json

{
  "assigneeId": "officer_user_id"
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "report_id",
    "assigneeId": "officer_user_id",
    "assignee": {
      "id": "officer_user_id",
      "name": "Officer Name",
      "email": "officer@email.com"
    }
  }
}
```

### 3. Notification Trigger
When an officer is assigned, a notification should be created for the report author (citizen):
```json
{
  "type": "ASSIGNMENT",
  "title": "Officer Assigned",
  "message": "An officer has been assigned to investigate your report \"[Report Title]\".",
  "link": "/dashboard/reports/[reportId]",
  "userId": "[citizen_user_id]"
}
```

## Quick 2-Minute Test

1. **Login**: sarah.analyst@email.com / Password123!
2. **Click Bell Icon**: Verify no 404, see notifications
3. **Click Notification**: Verify navigates to report successfully
4. **Click "Assign Officer"**: Dialog opens with officer list
5. **Select Officer & Assign**: Success toast, page refreshes, officer shown
6. **Verify Citizen Gets Notification**: Login as citizen, check notifications

## Troubleshooting

### Issue: 404 when clicking notifications
- **Solution**: Middleware has been updated to allow `/dashboard/reports/*` for all roles
- **Verify**: Check [apps/web/middleware.ts](apps/web/middleware.ts) line 23 includes `/dashboard/reports/*`

### Issue: "Assign Officer" button does nothing
- **Solution**: Button replaced with AssignOfficerDialog component
- **Verify**: Check [apps/web/app/dashboard/reports/[id]/page.tsx](apps/web/app/dashboard/reports/[id]/page.tsx) imports and uses AssignOfficerDialog

### Issue: No officers shown in dropdown
- **Possible causes**:
  1. No OFFICER role users in database
  2. API permission error (analysts can only fetch officers)
- **Solution**: Check database seed data or create officer users via admin panel

### Issue: Assignment succeeds but notification not sent
- **Check**: [apps/web/app/api/reports/[id]/route.ts](apps/web/app/api/reports/[id]/route.ts) lines 242-254
- **Verify**: `assigneeChanged` condition is true and notification creation succeeds

## Success Criteria

✅ **All tests pass when:**
1. Analyst can click notifications without 404 errors
2. Analyst can access report detail pages via notification links
3. "Assign Officer" dialog opens and shows list of officers
4. Officer assignment succeeds and UI updates
5. Success toast appears after assignment
6. Citizen receives notification when officer is assigned
7. Reassignment works correctly

## Next Steps

After analyst role is fully tested, we can move on to:
- [ ] Officer role workflow
- [ ] Prosecutor role workflow
- [ ] Case management features
- [ ] Evidence management features
