Test Plan: Feature-by-Feature Manual Testing
Phase 1: CITIZEN Role Testing 👤
Test 1.1: Login & Authentication
Action: Log in as a Citizen user
Expected: Successfully log in and see Citizen dashboard
Test credentials: Use a CITIZEN role user from the seed data
Report back: ✅ Working / ❌ Not Working / 🟡 Partial
Test 1.2: View Dashboard
Action: Check if dashboard shows citizen-specific content
Expected: See "My Reports" stats, submit report button, recent reports
Report back: ✅ / ❌ / 🟡
Test 1.3: Submit New Report
Action: Navigate to Submit Report page
Steps:
Click "Submit Report" or navigate to /dashboard/reports/new
Fill out the form (title, description, type, location)
Upload a photo
Submit the report
Expected: Report created with status SUBMITTED
Report back: ✅ / ❌ / 🟡
Test 1.4: View My Reports
Action: Navigate to "My Reports" page
Expected: See list of reports you submitted, with filters and search
Report back: ✅ / ❌ / 🟡
Test 1.5: View Report Details
Action: Click on a report to view details
Expected: See report details, photos, status timeline, notes
Report back: ✅ / ❌ / 🟡
Test 1.6: Check Notifications
Action: Check notification bell icon
Expected: See notification for report submission
Report back: ✅ / ❌ / 🟡


Phase 2: ANALYST Role Testing 🔍
Test 2.1: Login & Dashboard
Action: Log out and log in as an ANALYST user
Expected: See analyst-specific dashboard with all reports access
Report back: ✅ / ❌ / 🟡
Test 2.2: View All Reports
Action: Navigate to Reports page
Expected: See ALL reports in the system (not just own reports)
Report back: ✅ / ❌ / 🟡
Test 2.3: See New Report Notification
Action: Check if analyst received notification about the citizen's report
Expected: Notification showing new report submitted
Report back: ✅ / ❌ / 🟡
Test 2.4: Open Report Details
Action: Click on the citizen's submitted report
Expected: See full report details with all evidence
Report back: ✅ / ❌ / 🟡
Test 2.5: Assign Officer to Report
Action: Try to assign an OFFICER to the report
Expected: UI to select an officer and assign them
Report back: ✅ / ❌ / 🟡
Test 2.6: Change Report Status
Action: Change report status from SUBMITTED → UNDER_REVIEW
Expected: Status updates successfully, timeline updated
Report back: ✅ / ❌ / 🟡
Test 2.7: Create Case from Report
Action: Try to create a case and link this report
Expected: Case creation UI available
Report back: ✅ / ❌ / 🟡
Test 2.8: View Analytics Dashboard
Action: Navigate to /dashboard/analytics
Expected: See analytics page with charts
Report back: ✅ / ❌ / 🟡
Test 2.9: Access AI Analysis
Action: Navigate to /dashboard/analysis or try to run AI analysis
Expected: AI analysis interface exists
Report back: ✅ / ❌ / 🟡


Phase 3: OFFICER Role Testing 👮
Test 3.1: Login & Dashboard
Action: Log in as an OFFICER user
Expected: See officer-specific dashboard
Report back: ✅ / ❌ / 🟡
Test 3.2: View Assigned Reports
Action: Navigate to "Assigned to Me" page
Expected: See reports assigned by analyst
Report back: ✅ / ❌ / 🟡
Test 3.3: Receive Assignment Notification
Action: Check notifications
Expected: Notification about report assignment
Report back: ✅ / ❌ / 🟡
Test 3.4: View Report Details
Action: Open assigned report
Expected: See report details with investigation actions
Report back: ✅ / ❌ / 🟡
Test 3.5: Update Report Status
Action: Change status to IN_PROGRESS
Expected: Status update dialog with mandatory notes
Report back: ✅ / ❌ / 🟡
Test 3.6: Add Investigation Notes
Action: Add internal investigation notes
Expected: Notes saved and visible in timeline
Report back: ✅ / ❌ / 🟡
Test 3.7: Upload Evidence
Action: Upload additional photos/evidence
Expected: Evidence uploaded and linked to report
Report back: ✅ / ❌ / 🟡
Test 3.8: Create Case
Action: Try to create a case from the report
Expected: Case creation dialog available
Report back: ✅ / ❌ / 🟡
Test 3.9: View Map
Action: Navigate to Map view
Expected: See report locations on map
Report back: ✅ / ❌ / 🟡

Phase 4: PROSECUTOR Role Testing ⚖️
Test 4.1: Login & Dashboard
Action: Log in as a PROSECUTOR user
Expected: See prosecutor-specific dashboard
Report back: ✅ / ❌ / 🟡
Test 4.2: View All Cases
Action: Navigate to Cases page
Expected: See all cases in the system
Report back: ✅ / ❌ / 🟡
Test 4.3: View Case Details
Action: Open a case created by analyst/officer
Expected: See case details with linked reports
Report back: ✅ / ❌ / 🟡
Test 4.4: View My Cases
Action: Navigate to /dashboard/cases/my
Expected: See cases assigned to me
Report back: ✅ / ❌ / 🟡
Test 4.5: View Court Calendar
Action: Navigate to /dashboard/cases/calendar
Expected: See calendar with court dates
Report back: ✅ / ❌ / 🟡
Test 4.6: Update Case Legal Status
Action: Try to update case status (e.g., to IN_COURT)
Expected: Status updates successfully
Report back: ✅ / ❌ / 🟡

Phase 5: ADMIN Role Testing 🔧
Test 5.1: Login & Dashboard
Action: Log in as an ADMIN user
Expected: See admin dashboard with system metrics
Report back: ✅ / ❌ / 🟡
Test 5.2: View All Users
Action: Navigate to User Management page
Expected: See list of all users
Report back: ✅ / ❌ / 🟡
Test 5.3: Create New User
Action: Create a new user with a specific role
Expected: User created successfully
Report back: ✅ / ❌ / 🟡
Test 5.4: Edit User
Action: Edit an existing user's details or role
Expected: User updated successfully
Report back: ✅ / ❌ / 🟡
Test 5.5: Deactivate User
Action: Deactivate a user account
Expected: User marked as inactive
Report back: ✅ / ❌ / 🟡
Test 5.6: Access Settings
Action: Navigate to /settings
Expected: Settings page exists
Report back: ✅ / ❌ / 🟡
Test 5.7: Full Data Access
Action: Verify admin can see all reports, cases, evidence
Expected: Complete visibility
Report back: ✅ / ❌ / 🟡
How to Report Results
For each test, respond with:
✅ Working: Feature works as expected
❌ Not Working: Feature is broken or missing
🟡 Partial: Feature exists but has issues
Example response format:
Test 1.1: ✅ Working - Logged in successfully
Test 1.2: 🟡 Partial - Dashboard shows but stats are incorrect
Test 1.3: ❌ Not Working - Submit button doesn't work
