# 🧪 Citizen Notification System - Testing Guide

## Overview
This guide provides step-by-step instructions to test the complete notification system for citizen users in the PLAZA Toolkit.

---

## Test Environment Setup

### Test Accounts Available

**Citizen Account:**
- Email: `john.doe@email.com`
- Password: `password123`
- Has: 4 existing reports

**Officer Account:**
- Email: `officer.smith@email.com`
- Password: `password123`
- Can: Update report status, assign officers

**Analyst Account:**
- Email: `analyst.jones@email.com`
- Password: `password123`
- Can: Assign officers, update status

---

## 🎯 Test Flow 1: New Report Submission (5 minutes)

### Step 1: Login as Citizen

1. Go to: `http://localhost:3000/login`
2. Email: `john.doe@email.com`
3. Password: `password123`
4. Click "Login"

**✅ Expected**: You're redirected to `/dashboard`

---

### Step 2: Check Initial Notification State

Look at the top-right corner of the TopNav

**✅ Expected**:
- You should see a bell icon 🔔
- Badge shows number of unread notifications (might be 0 or existing count)

**📸 Screenshot checkpoint**: Note the current notification count

---

### Step 3: Submit a New Report

1. Click "Submit Report" in sidebar (or from dashboard button)
2. Fill out the form:
   - **Title**: "Test Notification - Illegal Dumping on Main St"
   - **Description**: "Large pile of construction waste dumped at intersection"
   - **Type**: Select "Waste"
   - **Priority**: Select "Medium"
   - **Location**: "123 Main Street"
   - **Incident Date**: Select today
3. Click "Create Report"

**✅ Expected**:
- Success toast: "Report created successfully"
- Redirected to report detail page

---

### Step 4: Check for Submission Notification

1. Look at bell icon in TopNav
2. Wait up to 30 seconds (for polling)

**✅ Expected**:
- Badge count increased by +1
- Bell icon shows red badge with new count

---

### Step 5: Open Notification Panel

1. Click the bell icon 🔔

**✅ Expected**: Dropdown panel opens showing:

```
┌─ Notifications ──────────────────────┐
│ Notifications    [Mark all read]     │
│ ──────────────────────────────────── │
│ 🔔 Report Submitted Successfully [✓] │
│ Your report "Test Notification -...  │
│ Just now                        ●    │ ← Blue dot (unread)
└──────────────────────────────────────┘
```

**📸 Screenshot checkpoint**: Notification shows in panel

---

### Step 6: Click Notification

1. Click on "Report Submitted Successfully" notification

**✅ Expected**:
- Navigate to your new report detail page
- Blue dot disappears (marked as read)
- Badge count decreases by 1

---

## 🎯 Test Flow 2: Status Change Notifications (10 minutes)

### Step 7: Keep Report ID Handy

1. You're on the report detail page
2. Note the URL: `/dashboard/reports/[REPORT_ID]`
3. Copy that REPORT_ID (or just leave tab open)

---

### Step 8: Logout and Login as Officer

1. Click your name in TopNav → "Logout"
2. Login with:
   - Email: `officer.smith@email.com`
   - Password: `password123`

**✅ Expected**: Officer dashboard loads

---

### Step 9: Find the New Report

1. Go to sidebar → "Reports" → "All Reports"
2. Look for your report: "Test Notification - Illegal Dumping..."
3. Click on it to open

**✅ Expected**: Report detail page opens (officer view with Quick Actions)

---

### Step 10: Change Report Status

1. Scroll down to right sidebar
2. Find "Quick Actions" card
3. Under "Update Status" dropdown:
   - Change from "SUBMITTED"
   - Select "UNDER_REVIEW"
4. Click "Update Status" button

**✅ Expected**:
- Success toast: "Status updated successfully"
- Status timeline updates

---

### Step 11: Switch Back to Citizen Account

1. Logout officer
2. Login as citizen (`john.doe@email.com` / `password123`)
3. Immediately check bell icon

**✅ Expected**:
- Badge count increased by +1
- New notification waiting

---

### Step 12: Check Status Change Notification

1. Click bell icon 🔔

**✅ Expected**: New notification appears:

```
┌─ Notifications ──────────────────────┐
│ 🔔 Report Under Review          [✓]  │
│ Your report "Test Notification..."   │
│ is now being reviewed by our team    │
│ Just now                        ●    │
└──────────────────────────────────────┘
```

---

### Step 13: Test More Status Changes

Repeat Steps 8-12 with different statuses:
- Change to "IN_PROGRESS" → Notification: "Investigation Started"
- Change to "RESOLVED" → Notification: "Report Resolved" (green)
- Change to "DISMISSED" → Notification: "Report Status Updated" (yellow)

---

## 🎯 Test Flow 3: Officer Assignment (5 minutes)

### Step 14: Login as Analyst

1. Logout citizen
2. Login as `analyst.jones@email.com` / `password123`

---

### Step 15: Assign Officer to Report

1. Go to "Reports" → "All Reports"
2. Find citizen's report
3. Click on it
4. In right sidebar "People" section:
   - Under "Assigned To"
   - Click "Assign Officer" button
   - Select an officer from dropdown (if UI supports it)

**Note**: If assign UI doesn't work, manually update via Quick Actions or database

---

### Step 16: Check Citizen Notification

1. Logout analyst
2. Login as citizen
3. Check bell icon

**✅ Expected**:
- New notification: "Officer Assigned"
- Message: "An officer has been assigned to investigate your report"

---

## 🎯 Test Flow 4: Notification Features (5 minutes)

### Step 17: Mark Individual Notification as Read

1. Open notification panel
2. Find an unread notification (blue dot)
3. Click the [✓] checkmark button on the right

**✅ Expected**:
- Blue dot disappears
- Badge count decreases
- Notification stays in list but marked as read

---

### Step 18: Mark All as Read

1. Have multiple unread notifications
2. Click "Mark all read" button at top of panel

**✅ Expected**:
- All blue dots disappear
- Badge count goes to 0
- All notifications marked as read

---

### Step 19: Test Auto-Polling

1. Keep citizen logged in
2. In another browser/incognito: Login as officer
3. As officer: Change report status
4. As citizen: Wait 30 seconds (don't refresh page)

**✅ Expected**:
- Badge count automatically updates after ~30 seconds
- No page refresh needed

---

### Step 20: Test Notification Links

1. Click on any notification in the panel

**✅ Expected**:
- Navigate to: `/dashboard/reports/{id}`
- Shows the related report
- Notification marked as read

---

## 📋 Complete Testing Checklist

- [ ] Citizen sees notification after submitting report
- [ ] Notification badge shows correct unread count
- [ ] Notification panel opens on bell click
- [ ] Notifications show correct title/message/time
- [ ] Unread notifications have blue dot indicator
- [ ] Officer can change report status
- [ ] Citizen receives notification for status change
- [ ] Different statuses show different notification messages
- [ ] Notification types have correct colors (info/success/warning)
- [ ] Clicking notification navigates to report
- [ ] Clicking notification marks it as read
- [ ] Mark single notification as read works
- [ ] Mark all notifications as read works
- [ ] Badge count updates correctly
- [ ] Auto-polling works (wait 30s after status change)
- [ ] Notifications persist across page refreshes

---

## 🐛 Troubleshooting

### Issue: Bell icon not showing
- Check TopNav component
- Verify NotificationsPanel is imported and rendered
- Check browser console for errors

### Issue: No notification after report submission
- Check browser console for API errors
- Verify notification was created in database:
  ```bash
  sqlite3 packages/database/prisma/dev.db
  SELECT * FROM Notification ORDER BY createdAt DESC LIMIT 5;
  ```

### Issue: Badge count not updating
- Wait 30 seconds for polling
- Refresh page manually
- Check `/api/notifications` endpoint in Network tab

### Issue: Notification panel empty
- Check API response in Network tab
- Verify user ID matches in database
- Check notification userId field

---

## 💡 Quick Test (2 minutes)

If you just want to quickly verify it works:

1. Login as citizen (`john.doe@email.com`)
2. Click "Submit Report" button
3. Fill minimal info → Submit
4. Look at bell icon → Should show +1
5. Click bell → Should see "Report Submitted Successfully"
6. Click notification → Should go to report page
7. ✅ DONE!

---

## 📊 Notification Types Reference

| Status Change | Notification Title | Notification Type | Color |
|---------------|-------------------|-------------------|-------|
| Report Created | "Report Submitted Successfully" | SUCCESS | Green |
| UNDER_REVIEW | "Report Under Review" | INFO | Blue |
| IN_PROGRESS | "Investigation Started" | INFO | Blue |
| RESOLVED | "Report Resolved" | SUCCESS | Green |
| DISMISSED | "Report Status Updated" | WARNING | Yellow |
| Officer Assigned | "Officer Assigned" | ASSIGNMENT | Blue |

---

## 🔔 Expected Notification Messages

### Report Submission
```
Title: Report Submitted Successfully
Message: Your report "{title}" ({reportNumber}) has been submitted and is awaiting review.
Link: /dashboard/reports/{id}
```

### Status: Under Review
```
Title: Report Under Review
Message: Your report "{title}" is now being reviewed by our team.
Link: /dashboard/reports/{id}
```

### Status: In Progress
```
Title: Investigation Started
Message: Investigation has started on your report "{title}". An officer has been assigned.
Link: /dashboard/reports/{id}
```

### Status: Resolved
```
Title: Report Resolved
Message: Your report "{title}" has been resolved. Thank you for your contribution!
Link: /dashboard/reports/{id}
```

### Status: Dismissed
```
Title: Report Status Updated
Message: Your report "{title}" has been reviewed and dismissed.
Link: /dashboard/reports/{id}
```

### Officer Assignment
```
Title: Officer Assigned
Message: An officer has been assigned to investigate your report "{title}".
Link: /dashboard/reports/{id}
```

---

## 🎯 Success Criteria

The notification system is working correctly if:

1. ✅ Citizens receive immediate feedback when submitting reports
2. ✅ Citizens are notified of all status changes to their reports
3. ✅ Notification bell badge accurately reflects unread count
4. ✅ Notifications are clickable and navigate to the correct report
5. ✅ Auto-polling updates notifications without page refresh
6. ✅ Mark as read functionality works for individual and all notifications
7. ✅ Different notification types display with appropriate colors
8. ✅ Notifications persist across sessions and page refreshes

---

## 📝 Notes

- Notifications poll every 30 seconds automatically
- Maximum of 50 notifications are displayed in the panel
- Notifications are user-specific (each user only sees their own)
- Clicking a notification automatically marks it as read
- The system prevents duplicate notifications for the same event
- Officers and citizens don't receive notifications for actions they perform themselves

---

**Last Updated**: 2025-10-02
**Version**: 1.0
**Status**: Ready for Testing ✅
