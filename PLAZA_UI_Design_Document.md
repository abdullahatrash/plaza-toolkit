# PLAZA Toolkit UI Design Document
**Environmental Incident Investigation Platform**  
Version 1.0 | Design Specification for Implementation

---

## Table of Contents
1. [Design System Foundation](#design-system-foundation)
2. [User Flows & Navigation](#user-flows--navigation)
3. [Screen-by-Screen Specifications](#screen-by-screen-specifications)
4. [Component Library](#component-library)
5. [Interaction Patterns](#interaction-patterns)
6. [Responsive Behavior](#responsive-behavior)
7. [Accessibility Requirements](#accessibility-requirements)

---

## 1. Design System Foundation

### 1.1 Color Palette

**Primary Colors**
- Primary Blue: `#2563EB` - Main actions, links, active states
- Primary Dark: `#1E40AF` - Hover states, emphasis
- Primary Light: `#DBEAFE` - Backgrounds, subtle highlights

**Semantic Colors**
- Success Green: `#10B981` - Approved reports, successful operations
- Warning Orange: `#F59E0B` - Pending actions, attention needed
- Error Red: `#EF4444` - Rejected reports, errors, critical alerts
- Info Blue: `#3B82F6` - Information, neutral notifications

**Role-Based Accent Colors**
- Officer Purple: `#8B5CF6` - Officer-specific UI elements
- Analyst Teal: `#14B8A6` - Analyst dashboards and tools
- Prosecutor Indigo: `#6366F1` - Prosecutor case views
- Citizen Green: `#22C55E` - Citizen-facing elements
- Admin Gray: `#6B7280` - Administrative functions

**Neutral Palette**
- Gray 900: `#111827` - Primary text
- Gray 700: `#374151` - Secondary text
- Gray 500: `#6B7280` - Placeholder text
- Gray 300: `#D1D5DB` - Borders, dividers
- Gray 100: `#F3F4F6` - Background surfaces
- Gray 50: `#F9FAFB` - Page background
- White: `#FFFFFF` - Cards, modals, elevated surfaces

**Confidence/AI Colors**
- High Confidence: `#10B981` (Green)
- Medium Confidence: `#F59E0B` (Orange)
- Low Confidence: `#EF4444` (Red)
- AI Accent: `#8B5CF6` (Purple) - AI/xAI indicators

### 1.2 Typography

**Font Family**
- Primary: Inter (sans-serif) for UI elements
- Monospace: JetBrains Mono for coordinates, IDs, technical data

**Text Styles**

| Style | Size | Weight | Line Height | Use Case |
|-------|------|--------|-------------|----------|
| H1 | 32px | 700 | 40px | Page titles |
| H2 | 24px | 600 | 32px | Section headers |
| H3 | 20px | 600 | 28px | Card titles, subsections |
| H4 | 18px | 600 | 24px | Component headers |
| Body Large | 16px | 400 | 24px | Primary content |
| Body Regular | 14px | 400 | 20px | Standard text |
| Body Small | 12px | 400 | 16px | Captions, metadata |
| Label | 14px | 500 | 20px | Form labels, buttons |
| Caption | 11px | 400 | 16px | Timestamps, help text |
| Code | 13px | 400 | 20px | Coordinates, IDs |

### 1.3 Spacing System

**Base Unit: 4px**

- XS: 4px (0.25rem)
- SM: 8px (0.5rem)
- MD: 16px (1rem)
- LG: 24px (1.5rem)
- XL: 32px (2rem)
- 2XL: 48px (3rem)
- 3XL: 64px (4rem)

**Layout Spacing**
- Page margin: 24px
- Card padding: 20px
- Section gap: 32px
- Component gap: 16px

### 1.4 Elevation & Shadows

**Shadow Levels**
- Level 1 (Subtle): `0 1px 3px rgba(0, 0, 0, 0.08)`
- Level 2 (Default): `0 4px 6px rgba(0, 0, 0, 0.1)`
- Level 3 (Elevated): `0 10px 15px rgba(0, 0, 0, 0.1)`
- Level 4 (Modal): `0 20px 25px rgba(0, 0, 0, 0.15)`

### 1.5 Border Radius

- Small: 4px - Inputs, small buttons
- Medium: 8px - Cards, buttons
- Large: 12px - Modals, large cards
- Full: 9999px - Pills, avatars

### 1.6 Icons

**Icon Library:** Lucide Icons (or Heroicons)

**Icon Sizes**
- XS: 14px - Inline icons
- SM: 16px - Button icons
- MD: 20px - Default UI icons
- LG: 24px - Section headers
- XL: 32px - Feature icons

---

## 2. User Flows & Navigation

### 2.1 Application Structure

```
PLAZA Toolkit
│
├── Authentication Layer
│   ├── Login Screen
│   ├── Password Change Modal
│   └── Role Request Modal
│
├── Main Application (Role-Based)
│   │
│   ├── Top Navigation Bar (Persistent)
│   │   ├── Logo & Platform Name
│   │   ├── Role Indicator Badge
│   │   ├── Global Search
│   │   ├── Notifications Panel Toggle
│   │   └── User Menu
│   │
│   ├── Side Navigation (Collapsible)
│   │   ├── Dashboard
│   │   ├── Explore (Map)
│   │   ├── Reports (Officer/Prosecutor)
│   │   ├── Cases (Officer/Prosecutor)
│   │   ├── Analysis (Officer/Analyst)
│   │   ├── Jobs & Schedules (Analyst)
│   │   └── Admin Console (Admin only)
│   │
│   ├── Notifications Side Panel (Slide-in)
│   │   ├── Real-time alerts list
│   │   ├── Filter by type
│   │   └── Mark as read/clear
│   │
│   └── Main Content Area (Role-Specific)
│
└── External Citizen App (Simplified)
    ├── Submit Report
    ├── My Reports
    └── Report Status
```

### 2.2 Primary User Flows

#### Flow 1: Officer Investigates Area (On-Demand AI)
```
1. Login → Dashboard
2. Click "Explore" → Map View
3. Draw Area of Interest (Rectangle/Circle/Polygon)
4. Select Time Window (Date Range Picker)
5. Toggle Data Layers (Citizen Reports, EO Imagery, Sensors)
6. Review Existing Reports in Area
7. Click "Predict" Button → Analysis Request Modal
8. Select Analysis Type (or use Default)
9. Submit Analysis Request
10. View Processing Status (Loading State)
11. Results Appear on Map (Detections/Heatmap)
12. Click Detection → View xAI Panel
13. Review Confidence, Explanation, Model Info
14. Click "Add to Case" → Case Builder
15. Add Notes, Additional Evidence
16. Export Case as PDF
```

#### Flow 2: Analyst Schedules Proactive Monitoring
```
1. Login → Dashboard
2. Navigate to "Jobs & Schedules"
3. Click "Create New Schedule"
4. Define Area of Inspection (Map Selector)
5. Select AI Model Profile
6. Set Threshold Parameters
7. Define Schedule (Cron Expression or Simple Scheduler)
8. Set Notification Recipients
9. Save Schedule
10. Monitor Job Queue
11. View Job Results
12. Publish Validated Outputs to Officers
```

#### Flow 3: Prosecutor Reviews Escalated Case
```
1. Login → Dashboard (Shows Escalated Cases Count)
2. Navigate to "Cases"
3. Filter by "Escalated"
4. Click Case Card → Case Detail View
5. Review Officer's Advice (Text Document)
6. View xAI Context Panel
7. Examine Evidence Timeline
8. Review Rejected Reports (Transparency)
9. Click "Approve Case" or "Close Case"
10. Add Decision Notes
11. Submit Decision → Officer Notified
```

#### Flow 4: Citizen Submits Report (External App)
```
1. Open Citizen App
2. Click "Submit Report"
3. Capture Photo (or Upload)
4. Auto-detect GPS Location (or Manual Pin)
5. Select Report Type (Dropdown)
6. Add Description (Text Area)
7. Review Summary
8. Submit Report
9. Receive Confirmation & Tracking ID
10. View "My Reports" → Track Status
11. Receive Status Updates (Push Notifications)
```

#### Flow 5: Admin Manages Role Request
```
1. Login → Admin Console
2. View "Pending Role Requests" (Badge Count)
3. Click Request → User Profile Modal
4. Review Request Justification
5. Verify User Identity (Optional)
6. Approve or Reject with Reason
7. User Notified of Decision
```

---

## 3. Screen-by-Screen Specifications

### 3.1 Authentication Screens

#### Screen: Login
**Layout Type:** Centered card on gradient background  
**Dimensions:** Card 440px wide, vertically centered

**Visual Structure:**
```
┌─────────────────────────────────────────┐
│         [PLAZA Logo - 64px]             │
│                                         │
│     Environmental Incident Platform      │
│                                         │
│  ┌───────────────────────────────┐    │
│  │ Email Address                 │    │
│  │ [Input Field]                 │    │
│  └───────────────────────────────┘    │
│                                         │
│  ┌───────────────────────────────┐    │
│  │ Password                      │    │
│  │ [Input Field with show/hide]  │    │
│  └───────────────────────────────┘    │
│                                         │
│  [ ] Remember me    [Forgot Password?] │
│                                         │
│  ┌───────────────────────────────┐    │
│  │      [Sign In Button]         │    │
│  └───────────────────────────────┘    │
│                                         │
│  Don't have an account? [Contact Admin]│
└─────────────────────────────────────────┘
```

**Component Details:**
- **Logo**: Centered, 64x64px, with 24px bottom margin
- **Title**: H2, Gray-900, centered, 16px bottom margin
- **Input Fields**: 
  - Height: 44px
  - Border: 1px solid Gray-300
  - Border radius: 8px
  - Padding: 12px 16px
  - Focus state: Primary Blue border, shadow
- **Sign In Button**:
  - Full width
  - Height: 48px
  - Background: Primary Blue
  - Text: White, 16px, weight 500
  - Hover: Primary Dark
  - Border radius: 8px
- **Background**: Gradient from Primary Light to Gray-50

**Error State:**
- Red border on invalid field
- Error message below field in Error Red, 12px
- Icon: Alert circle (16px) before message

**Loading State:**
- Button shows spinner icon
- Text changes to "Signing in..."
- Button disabled

---

#### Modal: Password Change
**Trigger:** User menu → "Change Password"  
**Size:** 480px wide, auto height, centered

**Visual Structure:**
```
┌─────────────────────────────────────────┐
│ Change Password                    [×]  │
├─────────────────────────────────────────┤
│                                         │
│  Current Password                       │
│  [Input Field with show/hide]          │
│                                         │
│  New Password                           │
│  [Input Field with show/hide]          │
│  Password strength: [====____] Medium   │
│                                         │
│  Confirm New Password                   │
│  [Input Field with show/hide]          │
│                                         │
│  Password requirements:                 │
│  ✓ At least 8 characters                │
│  ✓ Contains uppercase letter            │
│  ✗ Contains number                      │
│  ✗ Contains special character           │
│                                         │
├─────────────────────────────────────────┤
│                    [Cancel] [Update]    │
└─────────────────────────────────────────┘
```

**Component Details:**
- **Header**: H3, Gray-900, 20px padding
- **Close Button**: Top-right, 24px icon, Gray-500
- **Password Strength Bar**:
  - Width: 100%
  - Height: 4px
  - Colors: Red (weak), Orange (medium), Green (strong)
  - Below new password field, 8px margin
- **Requirements List**:
  - 12px text
  - Checkmark (green) or X (gray) icons
  - Gray-600 text
- **Buttons**:
  - Cancel: Secondary style (Gray-100 bg, Gray-700 text)
  - Update: Primary Blue, disabled until valid
  - Height: 40px, padding: 0 24px

---

#### Modal: Request Role Change
**Trigger:** User menu → "Request Role Change"  
**Size:** 520px wide, auto height

**Visual Structure:**
```
┌─────────────────────────────────────────┐
│ Request Role Change                [×]  │
├─────────────────────────────────────────┤
│                                         │
│  Current Role: Citizen                  │
│  [Gray badge with icon]                 │
│                                         │
│  Requested Role                         │
│  [Dropdown: Officer/Analyst/Prosecutor] │
│                                         │
│  Justification (required)               │
│  [Text Area - 4 rows]                   │
│  Tell us why you need this role...      │
│                                         │
│  ⓘ Your request will be reviewed by an  │
│     administrator. You will be notified │
│     of the decision via email.          │
│                                         │
├─────────────────────────────────────────┤
│                    [Cancel] [Submit]    │
└─────────────────────────────────────────┘
```

**Component Details:**
- **Current Role Badge**:
  - Background: Gray-100
  - Text: Gray-700, 14px
  - Icon: 16px (user icon)
  - Padding: 6px 12px
  - Border radius: 6px
- **Dropdown**:
  - Height: 44px
  - Shows role icon + name
  - Disabled options for roles user cannot request
- **Text Area**:
  - Min height: 96px
  - Max length: 500 characters
  - Character count below
- **Info Box**:
  - Background: Info Blue (10% opacity)
  - Border-left: 3px solid Info Blue
  - Padding: 12px
  - 14px text, Gray-700
  - Info icon (20px) aligned left

---

### 3.2 Main Application Layout

#### Layout: Application Shell
**Structure:** Fixed top bar + collapsible side nav + main content + slide-in notifications

**Dimensions:**
- Top Nav: Full width, 64px height
- Side Nav: 240px wide (expanded), 64px (collapsed)
- Main Content: Fills remaining space with 24px padding
- Notifications Panel: 360px wide, slides from right

**Visual Structure:**
```
┌──────────────────────────────────────────────────────────┐
│  [Logo] PLAZA    [Search]    [🔔3] [User▼]              │ Top Nav (64px)
├────────┬─────────────────────────────────────────────────┤
│ 📊 Dash│                                                 │
│ 🗺️ Map │         Main Content Area                       │
│ 📋 Repo│         (Role-specific screens)                 │
│ 📁 Case│                                                 │
│ 🔬 Anal│                                                 │
│        │                                                 │
│ [<]    │                                                 │
│        │                                                 │
│ Side   │                                                 │
│ Nav    │                                                 │
│ (240px)│                                                 │
└────────┴─────────────────────────────────────────────────┘
```

#### Component: Top Navigation Bar
**Height:** 64px  
**Background:** White  
**Shadow:** Level 1  
**Border-bottom:** 1px solid Gray-200

**Left Section (Logo & Branding):**
- PLAZA logo: 32px height
- Platform name: 16px, weight 600, Gray-900
- Total width: ~180px
- Left margin: 24px

**Center Section (Global Search):**
- Width: 400px max
- Height: 40px
- Border radius: 8px
- Background: Gray-100
- Placeholder: "Search reports, cases, areas..."
- Search icon: 20px, left side
- Keyboard shortcut hint: "⌘K" on right (12px, Gray-500)

**Right Section:**
1. **Role Badge**:
   - Background: Role-specific accent color (20% opacity)
   - Text: Role-specific accent color
   - Icon: 16px
   - Padding: 6px 12px
   - Border radius: 6px
   - Example: "Officer" with shield icon

2. **Notification Bell**:
   - Icon: 24px
   - Badge: Red dot if unread (8px circle, top-right)
   - Counter: If >0, show number in badge
   - Click: Opens notification panel

3. **User Menu** (Dropdown):
   - Avatar: 36px circle with initials or photo
   - Name: 14px, Gray-700 (hidden on mobile)
   - Dropdown arrow: 16px
   - Menu items:
     - Profile
     - Change Password
     - Request Role Change
     - Settings
     - Help & Documentation
     - Sign Out

**Spacing:** 16px between right section items, 24px right margin

---

#### Component: Side Navigation
**Width:** 240px (expanded), 64px (collapsed)  
**Background:** Gray-50  
**Border-right:** 1px solid Gray-200

**Navigation Items:**
Each item has:
- Icon: 24px (left aligned, 16px from edge)
- Label: 14px, weight 500 (hidden when collapsed)
- Height: 44px
- Padding: 12px 16px
- Border-radius: 8px (8px margin from sides)
- Hover: Gray-100 background
- Active: Primary Light background, Primary Blue text, 3px left border (Primary Blue)

**Navigation Structure by Role:**

**Officer/Authority:**
```
📊 Dashboard
🗺️ Explore Map
📋 Reports
📁 My Cases
🔬 Analysis
```

**Data Analyst:**
```
📊 Dashboard
🗺️ Explore Map
🔬 Analysis
⚙️ Jobs & Schedules
📦 Data Management
```

**Prosecutor:**
```
📊 Dashboard
📁 Cases (Escalated)
📋 Reports Archive
📊 Statistics
```

**Admin:**
```
📊 Dashboard
👥 User Management
🔐 Role Requests
⚙️ System Settings
```

**Collapse Toggle:**
- Bottom of side nav
- Icon: ChevronLeft (expanded) / ChevronRight (collapsed)
- 40px height
- Full width
- Hover: Gray-100

**Badge Indicators:**
- Position: Top-right of nav item
- Size: 20px circle (or pill if count >9)
- Background: Error Red (urgent), Warning Orange (attention), Info Blue (info)
- Text: White, 11px, weight 600
- Example: Reports (3 pending)

---

#### Component: Notifications Side Panel
**Width:** 360px  
**Animation:** Slide in from right  
**Background:** White  
**Shadow:** Level 4  
**Height:** Full viewport height minus top nav

**Visual Structure:**
```
┌────────────────────────────────────┐
│ Notifications              [×]     │
│ ──────────────────────────────     │
│                                    │
│ [All] [Reports] [Cases] [Jobs]     │
│                                    │
│ ┌────────────────────────────┐    │
│ │ 🔵 New Report Submitted     │    │
│ │ Area: Zone A-12             │    │
│ │ 2 minutes ago          [→]  │    │
│ └────────────────────────────┘    │
│                                    │
│ ┌────────────────────────────┐    │
│ │ ✅ Analysis Complete        │    │
│ │ 15 detections found         │    │
│ │ 1 hour ago             [→]  │    │
│ └────────────────────────────┘    │
│                                    │
│ ┌────────────────────────────┐    │
│ │ ⚠️ Case Escalated           │    │
│ │ Case #2847 needs review     │    │
│ │ 3 hours ago            [→]  │    │
│ └────────────────────────────┘    │
│                                    │
│                                    │
│ [Mark All as Read] [Clear All]     │
└────────────────────────────────────┘
```

**Header:**
- Title: H3, Gray-900
- Close button: 24px, top-right
- Bottom border: 1px solid Gray-200
- Padding: 20px

**Filter Tabs:**
- Horizontal tabs: All, Reports, Cases, Jobs, System
- Active tab: Primary Blue underline (2px), Primary Blue text
- Inactive: Gray-600 text
- Height: 40px
- 16px padding between tabs

**Notification Card:**
- Padding: 16px
- Border-radius: 8px
- Border: 1px solid Gray-200
- Margin: 12px (sides and bottom)
- Hover: Gray-50 background

**Notification Types:**
- **New Report**: Blue dot, Report icon
- **Analysis Complete**: Green checkmark, AI icon
- **Case Escalated**: Orange warning, Alert icon
- **Status Change**: Blue info, Refresh icon
- **System**: Gray gear, Settings icon

**Card Structure:**
- Icon: 20px, colored, left side
- Title: 14px, weight 600, Gray-900
- Description: 13px, Gray-600, max 2 lines
- Timestamp: 12px, Gray-500, bottom-left
- Action arrow: 16px, Gray-400, bottom-right (on hover)

**Footer Actions:**
- Two text buttons
- 14px, Primary Blue
- Height: 40px
- Separated by divider
- Fixed to bottom

**Empty State:**
- Centered icon: Bell with checkmark, 48px, Gray-400
- Text: "All caught up!" (16px, Gray-600)
- Subtext: "No new notifications" (14px, Gray-500)

---

### 3.3 Dashboard Screens (Role-Specific)

#### Screen: Officer Dashboard
**Layout:** Grid of cards with real-time metrics and action items

**Visual Structure:**
```
┌──────────────────────────────────────────────────────────┐
│ Good morning, Officer Martinez                           │
│ Wednesday, October 01, 2025                              │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
│ │ 🔵 12       │ │ ⚠️ 5        │ │ ✅ 28       │        │
│ │ New Reports │ │ Pending     │ │ Resolved    │        │
│ │             │ │ Review      │ │ This Week   │        │
│ └─────────────┘ └─────────────┘ └─────────────┘        │
│                                                          │
│ ┌────────────────────────────────────────────┐          │
│ │ Recent Reports (Last 24h)                  │          │
│ │ ────────────────────────────────────       │          │
│ │ 🟢 #2891 Illegal Dumping - Zone A-12       │          │
│ │    2 hours ago · Pending Review    [View]  │          │
│ │                                             │          │
│ │ 🟡 #2890 Water Pollution - Coastal B       │          │
│ │    4 hours ago · Under Investigation [View]│          │
│ │                                             │          │
│ │ 🔴 #2889 Oil Spill - Harbor District       │          │
│ │    6 hours ago · Escalated          [View] │          │
│ │                                             │          │
│ │                          [View All Reports]│          │
│ └────────────────────────────────────────────┘          │
│                                                          │
│ ┌─────────────────────┐  ┌────────────────────┐        │
│ │ My Active Cases (3) │  │ Quick Actions      │        │
│ │ ─────────────────   │  │ ──────────────     │        │
│ │ Case #2847          │  │ 🗺️ Explore Map     │        │
│ │ Harbor Oil Spill    │  │                    │        │
│ │ [Continue]          │  │ 🔬 Run Analysis    │        │
│ │                     │  │                    │        │
│ │ Case #2839          │  │ 📋 View Reports    │        │
│ │ Zone A Dumping      │  │                    │        │
│ │ [Continue]          │  │ 📁 Create Case     │        │
│ └─────────────────────┘  └────────────────────┘        │
└──────────────────────────────────────────────────────────┘
```

**Component Details:**

**Greeting Section:**
- H1: "Good morning, [Name]"
- Subtitle: Current date (14px, Gray-600)
- Padding: 32px bottom

**Metric Cards (Top Row):**
- Width: Flexible (3 columns on desktop, 1 on mobile)
- Height: 120px
- Background: White
- Border-radius: 12px
- Shadow: Level 1
- Padding: 20px
- Icon: 32px, colored, top-left
- Number: 32px, weight 700, Gray-900, centered
- Label: 14px, Gray-600, centered below number
- Hover: Slight lift (shadow Level 2)

**Recent Reports Card:**
- Width: 66% (8 columns in 12-column grid)
- Background: White
- Border-radius: 12px
- Padding: 24px
- Header: H3, 16px bottom margin

**Report List Item:**
- Height: 56px
- Padding: 12px 0
- Border-bottom: 1px solid Gray-200 (except last)
- Status dot: 8px circle (green/yellow/red), left side
- Report ID: 14px, weight 600, Gray-900, monospace
- Title: 14px, Gray-700
- Metadata: 12px, Gray-500 (time + status)
- View button: 32px height, Ghost style, right side
- Hover: Gray-50 background on entire row

**Active Cases Card:**
- Width: 33% (4 columns)
- Similar styling to Reports card
- Case items: 64px height, border-bottom
- "Continue" button: Full width, Secondary style

**Quick Actions Card:**
- Width: 33% (4 columns)
- Similar styling
- Action buttons: 48px height, full width, icon + text
- 12px gap between buttons
- Hover: Primary Light background

---

#### Screen: Analyst Dashboard
**Layout:** Focus on job queue, schedules, and data pipeline status

**Visual Structure:**
```
┌──────────────────────────────────────────────────────────┐
│ Data Analyst Dashboard                                   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
│ │ ⚙️ 8        │ │ ✅ 15       │ │ ⏱️ 2.4h     │        │
│ │ Jobs Running│ │ Completed   │ │ Avg Process │        │
│ │             │ │ Today       │ │ Time        │        │
│ └─────────────┘ └─────────────┘ └─────────────┘        │
│                                                          │
│ ┌────────────────────────────────────────────┐          │
│ │ Active Jobs Queue                          │          │
│ │ ────────────────────────────────────       │          │
│ │ Job #J-1847 | Coastal Anomaly Detection    │          │
│ │ [████████░░] 80% · ETA 12 minutes   [View] │          │
│ │                                             │          │
│ │ Job #J-1848 | Zone A-12 Analysis            │          │
│ │ [██░░░░░░░░] 20% · ETA 45 minutes   [View] │          │
│ │                                             │          │
│ │                         [View All Jobs]     │          │
│ └────────────────────────────────────────────┘          │
│                                                          │
│ ┌──────────────────────────────────────────────┐        │
│ │ Scheduled Analyses                           │        │
│ │ ──────────────────────────────────           │        │
│ │ 🟢 Harbor Monitoring · Daily 06:00     [Edit]│        │
│ │ 🟢 Zone A-12 Scan · Every 6 hours      [Edit]│        │
│ │ 🟡 Coastal Survey · Weekly Mon 08:00   [Edit]│        │
│ │                                              │        │
│ │                  [+ Create New Schedule]     │        │
│ └──────────────────────────────────────────────┘        │
│                                                          │
│ ┌─────────────────────┐  ┌────────────────────┐        │
│ │ Data Pipeline       │  │ Model Performance  │        │
│ │ ─────────────────   │  │ ──────────────     │        │
│ │ ✅ EO Data: Fresh   │  │ [Chart: Accuracy]  │        │
│ │ ✅ Sensors: Online  │  │ Model v2.4.1       │        │
│ │ ⚠️ Citizen: Delayed │  │ 94.2% accuracy     │        │
│ └─────────────────────┘  └────────────────────┘        │
└──────────────────────────────────────────────────────────┘
```

**Unique Components:**

**Job Queue Progress Bar:**
- Width: Full width of card
- Height: 8px
- Background: Gray-200
- Fill: Primary Blue gradient
- Border-radius: 4px
- Percentage text: 12px, Gray-700, right side
- ETA: 12px, Gray-500, monospace

**Schedule Status Indicators:**
- Green dot: Active
- Yellow dot: Paused
- Red dot: Error
- Schedule name: 14px, weight 500
- Frequency: 12px, Gray-500
- Edit button: Ghost style, 32px

---

#### Screen: Prosecutor Dashboard
**Layout:** Focused on escalated cases and decision-making

**Visual Structure:**
```
┌──────────────────────────────────────────────────────────┐
│ Prosecutor Dashboard                                     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
│ │ ⚠️ 5        │ │ ✅ 12       │ │ ❌ 3        │        │
│ │ Awaiting    │ │ Approved    │ │ Closed      │        │
│ │ Review      │ │ This Week   │ │ This Week   │        │
│ └─────────────┘ └─────────────┘ └─────────────┘        │
│                                                          │
│ ┌────────────────────────────────────────────┐          │
│ │ Escalated Cases (Urgent Review)            │          │
│ │ ────────────────────────────────────       │          │
│ │ 🔴 Case #2847 · Harbor Oil Spill           │          │
│ │    Escalated 2 days ago                    │          │
│ │    Officer: Martinez · 8 evidence items    │          │
│ │    [Review Case]                    [xAI]  │          │
│ │                                             │          │
│ │ 🔴 Case #2839 · Zone A Illegal Dumping     │          │
│ │    Escalated 5 days ago                    │          │
│ │    Officer: Chen · 12 evidence items       │          │
│ │    [Review Case]                    [xAI]  │          │
│ └────────────────────────────────────────────┘          │
│                                                          │
│ ┌──────────────────────────────────────────────┐        │
│ │ Recent Decisions                             │        │
│ │ ──────────────────────────────────           │        │
│ │ ✅ Case #2831 · Approved                     │        │
│ │    Coastal Pollution · 1 day ago             │        │
│ │                                              │        │
│ │ ❌ Case #2828 · Closed - Insufficient       │        │
│ │    Zone B Report · 3 days ago                │        │
│ └──────────────────────────────────────────────┘        │
└──────────────────────────────────────────────────────────┘
```

**Unique Components:**

**Urgency Indicators:**
- Red dot: >3 days old (urgent)
- Orange dot: 1-3 days old
- Blue dot: <1 day old
- Timer visual: Days since escalation

**xAI Quick Link:**
- Small button: 32px height
- Icon: Brain/Lightbulb
- Text: "xAI"
- Background: AI Accent (purple) 10% opacity
- Opens xAI side panel

---

### 3.4 Explore Map Screen

**This is the core screen where officers investigate areas and trigger AI analysis.**

#### Screen: Explore Map (Main Investigation Interface)
**Layout:** Full-width map with left sidebar and floating controls

**Visual Structure:**
```
┌────────────────────────────────────────────────────────────────┐
│ ← Back to Dashboard                        [Save View] [Export]│ Top Bar
├────────────┬───────────────────────────────────────────────────┤
│            │                                                    │
│  Layers    │                                                    │
│  ──────    │                                                    │
│  📷 EO     │                                                    │
│  Imagery   │              MAP CANVAS                            │
│  ☑️ Show    │              Interactive Map Area                  │
│            │              (Leaflet/Mapbox)                      │
│  🌊 Sensor │                                                    │
│  Data      │              [Drawing tools overlay]               │
│  ☐ Show    │              [Detection markers]                   │
│            │              [Citizen report pins]                 │
│  📍 Citizen│                                                    │
│  Reports   │                                                    │
│  ☑️ Show    │                                                    │
│            │                                                    │
│  🔬 AI     │                                                    │
│  Results   │                                                    │
│  ☑️ Show    │                                                    │
│            │ ┌──────────────────┐                              │
│ [Filters]  │ │ Time Range       │  Floating controls            │
│            │ │ Jan 1 - Oct 1    │  (draggable)                  │
│ Sidebar    │ │ [Calendar icon]  │                              │
│ 280px      │ └──────────────────┘                              │
│            │                                                    │
│            │ ┌────────────────────────┐                        │
│            │ │ Draw Area of Inspection│  Drawing tools          │
│            │ │ [⬜][⚪][✏️][🗑️]         │  (bottom-left)         │
│            │ └────────────────────────┘                        │
│            │                                                    │
│            │                                    ┌───────────┐  │
│            │                                    │ [🔬]      │  │
│            │                                    │ Predict   │  │
│            │                                    │ Analysis  │  │
│            │                                    └───────────┘  │
│            │                                    (bottom-right) │
└────────────┴───────────────────────────────────────────────────┘
```

**Component Details:**

#### Left Sidebar: Layers Panel
**Width:** 280px  
**Background:** White  
**Shadow:** Level 2  
**Padding:** 20px

**Layer Item Structure:**
```
┌────────────────────────────────┐
│ [Checkbox] 📷 EO Imagery       │
│ ─────────────────────────      │
│ Source: Sentinel-2             │
│ Updated: 2 hours ago           │
│ Coverage: 95%          [ⓘ][⚙️] │
│                                │
│ [Opacity slider: 80%]          │
└────────────────────────────────┘
```

**Layer Item Components:**
- **Checkbox**: 20px, Primary Blue when checked
- **Icon**: 24px, represents data type
- **Title**: 14px, weight 600, Gray-900
- **Metadata**: 12px, Gray-500, 2-3 key facts
- **Info button** (ⓘ): Opens provenance modal
- **Settings button** (⚙️): Layer-specific options
- **Opacity slider**: 0-100%, only visible when layer is active
- **Divider**: 1px solid Gray-200 between layers

**Provenance Info Modal (triggered by ⓘ):**
- Size: 400px wide
- Shows: Source, License, Date acquired, Processing steps
- Link to full lineage graph

**Filter Section (Collapsible):**
- Location filters: Zone, District, Coordinates
- Time filters: Date range, Time of day
- Report filters: Type, Status, Severity
- Apply/Reset buttons

---

#### Map Canvas
**Library:** Mapbox GL JS or Leaflet  
**Base Map:** Satellite or Street view (user toggle)  
**Controls:** Zoom, Rotate, Pitch (3D), Fullscreen

**Map Overlays:**

**1. Citizen Report Pins:**
- Icon: Marker pin, 32px
- Color coded by status:
  - Blue: New/Pending
  - Orange: Under Review
  - Green: Accepted
  - Red: Escalated
- Cluster: When >10 pins in close proximity
  - Circle with count
  - Size scales with count
  - Click to zoom/expand
- Click behavior: Opens report card popup

**Report Popup Card:**
```
┌──────────────────────────────┐
│ Report #2891                 │
│ Illegal Dumping              │
│ ──────────────────────       │
│ 📸 [Thumbnail image]         │
│                              │
│ Status: Pending Review       │
│ Submitted: 2 hours ago       │
│ Location: 48.8566, 2.3522    │
│                              │
│ Description:                 │
│ Large pile of construction   │
│ debris blocking access...    │
│                              │
│ [View Full Report] [Update]  │
└──────────────────────────────┘
```

**2. AI Detection Markers:**
- Icon: Custom icon based on detection type
  - Waste: Trash can icon
  - Pollution: Droplet icon
  - Anomaly: Warning triangle
- Size: 28px
- Color: AI Accent (purple)
- Pulsing animation on new detections
- Confidence indicator: Border thickness (thin=low, thick=high)

**Detection Popup:**
```
┌──────────────────────────────┐
│ 🔬 AI Detection #D-4721      │
│ Waste Accumulation           │
│ ──────────────────────       │
│ Confidence: 87% (High)       │
│ Model: WasteNet v2.4.1       │
│ Detected: 5 minutes ago      │
│                              │
│ 💡 Explanation (xAI):        │
│ High reflectance and         │
│ irregular shapes suggest     │
│ mixed waste materials.       │
│                              │
│ [View Details] [Add to Case] │
└──────────────────────────────┘
```

**3. Area of Inspection (AOI) Overlay:**
- When drawn: Semi-transparent fill
- Border: 2px solid Primary Blue
- Corners: Draggable handles (8px circles)
- Label: Shows area size (e.g., "2.4 km²")
- Edit mode: Highlighted handles, delete button appears

---

#### Floating Controls

**Time Range Selector (Top of Map):**
```
┌──────────────────────────────┐
│ 📅 Time Range                │
│ ──────────────────────       │
│ From: Jan 1, 2025            │
│ To:   Oct 1, 2025            │
│                              │
│ [Quick picks:]               │
│ [Last 7 days] [Last 30 days] │
│ [This Year] [Custom]         │
└──────────────────────────────┘
```
- Background: White
- Shadow: Level 3
- Border-radius: 12px
- Padding: 16px
- Draggable by header

**Drawing Tools (Bottom-Left):**
```
┌─────────────────────────────┐
│ Draw Area of Inspection     │
│ ─────────────────────       │
│ [⬜] Rectangle              │
│ [⚪] Circle                 │
│ [✏️] Polygon (Free draw)    │
│ [🗑️] Clear drawing          │
└─────────────────────────────┘
```
- Button size: 44x44px
- Icon: 24px
- Active state: Primary Blue background
- Tooltip on hover

**Predict Button (Bottom-Right):**
```
┌──────────────┐
│ 🔬 Predict   │
│              │
│ Run Analysis │
└──────────────┘
```
- Size: 140px x 60px
- Background: Primary Blue gradient
- Icon: 28px
- Text: 14px, weight 600, White
- Disabled when no AOI drawn (grayed out)
- Hover: Scale 1.05, shadow Level 3
- Pulsing glow when AOI is ready

---

#### Modal: Analysis Request (Triggered by Predict Button)
**Size:** 600px wide, auto height  
**Background:** White  
**Shadow:** Level 4

**Visual Structure:**
```
┌────────────────────────────────────────────┐
│ 🔬 Request AI Analysis               [×]   │
├────────────────────────────────────────────┤
│                                            │
│ Area of Inspection                         │
│ ┌────────────────────────────────────┐    │
│ │ [Map thumbnail with AOI highlighted]│   │
│ │ Size: 2.4 km²                       │   │
│ │ Center: 48.8566° N, 2.3522° E       │   │
│ └────────────────────────────────────┘    │
│                                            │
│ Time Range                                 │
│ From: Jan 1, 2025 → To: Oct 1, 2025        │
│                                            │
│ Analysis Type                              │
│ [Dropdown: Select analysis type]           │
│ Options:                                   │
│ • Waste Detection (Default)                │
│ • Coastal Anomaly Detection                │
│ • Water Pollution Analysis                 │
│ • Multi-type Analysis                      │
│                                            │
│ ⓘ Using model: WasteNet v2.4.1             │
│    Expected runtime: 5-10 minutes          │
│                                            │
│ Advanced Options (Optional)                │
│ [▼ Expand]                                 │
│                                            │
│ Notification Preferences                   │
│ ☑️ Notify me when complete                 │
│ ☑️ Email summary of results                │
│                                            │
├────────────────────────────────────────────┤
│                  [Cancel] [Run Analysis]   │
└────────────────────────────────────────────┘
```

**Component Details:**
- **Map Thumbnail**: 400x200px, static image with AOI overlay
- **Analysis Type Dropdown**: Shows model info on selection
- **Advanced Options** (when expanded):
  - Confidence threshold slider
  - Processing priority (Low/Normal/High)
  - Output format options
- **Run Analysis Button**:
  - Primary Blue
  - Full width option or right-aligned
  - Shows loading spinner when processing

---

#### Loading State: Analysis in Progress
**Overlay on map with progress modal**

```
┌────────────────────────────────┐
│ 🔬 Analysis in Progress        │
│ ────────────────────────       │
│                                │
│ [████████████░░░░░] 75%        │
│                                │
│ Processing satellite imagery...│
│ ETA: 2 minutes                 │
│                                │
│ Step 3 of 4: Running model     │
│                                │
│ [Cancel Analysis]              │
└────────────────────────────────┘
```

**Progress Indicators:**
- Progress bar: Animated, Primary Blue
- Status text: Updates in real-time
- Step counter: Shows current phase
- Cancel option: Confirms before canceling

---

#### Results Display: AI Detections on Map

**When analysis completes:**
1. Detection markers appear on map (animated entry)
2. Results panel slides in from right
3. Notification appears: "Analysis complete: 15 detections found"

**Results Side Panel (Right Side):**
**Width:** 400px  
**Height:** Full viewport  
**Background:** White  
**Shadow:** Level 4

```
┌────────────────────────────────────┐
│ Analysis Results            [×]    │
│ ────────────────────────            │
│                                    │
│ 🔬 Waste Detection Analysis         │
│ Model: WasteNet v2.4.1             │
│ Completed: Just now                │
│                                    │
│ Summary                            │
│ ─────────────────                  │
│ 15 detections found                │
│ Confidence: 82% average            │
│ Area coverage: 2.4 km²             │
│                                    │
│ Confidence Distribution            │
│ [Mini bar chart]                   │
│ High: 8 | Medium: 5 | Low: 2       │
│                                    │
│ Detections                         │
│ ─────────────────                  │
│ [Filter: All | High | Med | Low]   │
│                                    │
│ ┌──────────────────────────┐      │
│ │ 🟢 Detection #D-4721     │      │
│ │ Confidence: 94%          │      │
│ │ Location: 48.856, 2.352  │      │
│ │ [View on Map] [xAI] [+]  │      │
│ └──────────────────────────┘      │
│                                    │
│ ┌──────────────────────────┐      │
│ │ 🟢 Detection #D-4722     │      │
│ │ Confidence: 89%          │      │
│ │ Location: 48.857, 2.351  │      │
│ │ [View on Map] [xAI] [+]  │      │
│ └──────────────────────────┘      │
│                                    │
│ [Load more...]                     │
│                                    │
│ Actions                            │
│ ─────────────────                  │
│ [Export Results]                   │
│ [Create Case from All]             │
│ [Download Report]                  │
└────────────────────────────────────┘
```

**Detection Card in List:**
- Height: 96px
- Border: 1px solid Gray-200
- Border-left: 4px solid confidence color
- Padding: 12px
- Hover: Gray-50 background, cursor pointer
- Click: Centers map on detection and shows xAI

**Action Buttons:**
- **View on Map**: Centers and zooms to detection
- **xAI**: Opens explainability panel
- **+ Add**: Adds to case builder (icon changes to checkmark)

---

### 3.5 xAI (Explainability) Panel

**This is a critical component that appears whenever AI results are shown.**

#### Component: xAI Side Panel
**Width:** 360px  
**Position:** Slides in from right (over results panel if present)  
**Background:** White with AI Accent (purple) header  
**Shadow:** Level 4

**Visual Structure:**
```
┌────────────────────────────────────┐
│ 💡 Explainability (xAI)      [×]   │ Purple header
├────────────────────────────────────┤
│                                    │
│ Detection #D-4721                  │
│ Waste Accumulation                 │
│ ────────────────────────            │
│                                    │
│ Why this detection?                │
│ ─────────────────                  │
│ The model identified irregular     │
│ shapes and high reflectance        │
│ patterns consistent with mixed     │
│ waste materials. Strong spectral   │
│ signatures match known waste       │
│ composition profiles.              │
│                                    │
│ Confidence Breakdown               │
│ ─────────────────                  │
│ Overall: 94% (High)                │
│                                    │
│ Contributing Factors:              │
│ • Shape irregularity: 96%          │
│ • Spectral signature: 92%          │
│ • Texture pattern: 91%             │
│ • Context clues: 88%               │
│                                    │
│ Visual Explanation                 │
│ ─────────────────                  │
│ [Saliency map overlay image]       │
│ Red areas: High influence          │
│ Blue areas: Low influence          │
│                                    │
│ Model Information                  │
│ ─────────────────                  │
│ Model: WasteNet v2.4.1             │
│ Training date: Aug 2025            │
│ Dataset: 120K samples              │
│ Validation acc: 94.2%              │
│                                    │
│ Similar Cases                      │
│ ─────────────────                  │
│ • Report #2847 (89% match)         │
│ • Detection #D-4102 (85% match)    │
│                                    │
│ [View Full Analysis Report]        │
└────────────────────────────────────┘
```

**Component Details:**

**Header:**
- Background: AI Accent (purple) gradient
- Text: White, 16px, weight 600
- Icon: Lightbulb, 24px, White
- Close button: White, 24px

**Why Section:**
- Plain language explanation
- 14px text, Gray-700
- Max 3-4 sentences
- No jargon

**Confidence Breakdown:**
- Overall confidence: Large number, 32px, with color coding
- Bar chart: Shows factor contributions
- Each factor: Name + percentage + mini bar

**Visual Explanation (Saliency Map):**
- Image: 320x180px (16:9 ratio)
- Overlay: Heat map colors (red=high, blue=low)
- Caption: 12px, explains color coding
- Click to enlarge

**Model Information:**
- Collapsible section
- Technical details in small text
- Link to model documentation

**Similar Cases:**
- List of 3-5 related detections/reports
- Click to view
- Match percentage shown

---

### 3.6 Report Management Screens

#### Screen: Reports List (Officer View)
**Layout:** Table/list view with filters and bulk actions

**Visual Structure:**
```
┌──────────────────────────────────────────────────────────┐
│ Citizen Reports                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ [Search reports...] [🔍]  [Filter ▼] [Sort: Recent ▼]   │
│                                                          │
│ Showing 47 reports · [Select All] [Bulk Actions ▼]      │
│                                                          │
│ ┌────────────────────────────────────────────────────┐  │
│ │ Report List Header                                 │  │
│ │ [☐] | ID | Type | Location | Status | Date | Actions│  │
│ ├────────────────────────────────────────────────────┤  │
│ │ [☐] #2891 Illegal Dumping Zone A-12                │  │
│ │     🔵 Pending Review · 2 hours ago        [View]  │  │
│ │                                                     │  │
│ │ [☐] #2890 Water Pollution Coastal B                │  │
│ │     🟡 Under Investigation · 4 hours ago   [View]  │  │
│ │                                                     │  │
│ │ [☐] #2889 Oil Spill Harbor District                │  │
│ │     🔴 Escalated · 6 hours ago             [View]  │  │
│ │                                                     │  │
│ │ [☐] #2888 Noise Complaint Industrial Zone          │  │
│ │     🟢 Resolved · 8 hours ago              [View]  │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ [← Previous] Page 1 of 5 [Next →]                        │
└──────────────────────────────────────────────────────────┘
```

**Filter Options (Dropdown):**
- Status: All, Pending, Under Review, Escalated, Resolved, Rejected
- Type: All report types from citizen app
- Date Range: Today, Last 7 days, Last 30 days, Custom
- Location: Zone/district filter
- Priority: All, High, Medium, Low

**Bulk Actions:**
- Accept selected
- Reject selected
- Escalate selected
- Assign to officer
- Export selection

---

#### Screen: Report Detail View
**Layout:** Split view - Report info left, Actions right

**Visual Structure:**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back to Reports                                        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ ┌────────────────────────────┐  ┌──────────────────┐   │
│ │ Report #2891               │  │ Actions          │   │
│ │ ────────────────────       │  │ ──────────────   │   │
│ │                            │  │                  │   │
│ │ 📸 [Report Photo]          │  │ Current Status   │   │
│ │    [Full size view]        │  │ 🔵 Pending Review│   │
│ │                            │  │                  │   │
│ │ Type: Illegal Dumping      │  │ Change Status    │   │
│ │ Location: Zone A-12        │  │ [Dropdown]       │   │
│ │ Coordinates:               │  │                  │   │
│ │ 48.8566° N, 2.3522° E      │  │ [Accept]         │   │
│ │ [View on Map]              │  │ [Reject]         │   │
│ │                            │  │ [Escalate]       │   │
│ │ Submitted By               │  │                  │   │
│ │ Citizen ID: C-4721         │  │ Reason (required)│   │
│ │ Date: Oct 1, 2025 08:15    │  │ [Text area]      │   │
│ │                            │  │                  │   │
│ │ Description                │  │ [Add to Case]    │   │
│ │ ────────────────────       │  │ [Download Report]│   │
│ │ Large pile of construction │  │                  │   │
│ │ debris blocking road access│  │ Assigned to      │   │
│ │ to park area. Appears to   │  │ Officer Martinez │   │
│ │ have been here for several │  │                  │   │
│ │ days. Strong odor present. │  │ Priority: Medium │   │
│ │                            │  │ [Change]         │   │
│ │ History                    │  │                  │   │
│ │ ────────────────────       │  │ Similar Reports  │   │
│ │ Oct 1, 08:15 - Submitted   │  │ ──────────────   │   │
│ │ Oct 1, 08:30 - Assigned    │  │ #2847 (2km away) │   │
│ │ Oct 1, 09:00 - Under Review│  │ #2802 (3km away) │   │
│ └────────────────────────────┘  └──────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

**Accept/Reject/Escalate Modals:**

When officer clicks "Reject":
```
┌────────────────────────────────┐
│ Reject Report #2891      [×]   │
├────────────────────────────────┤
│                                │
│ Reason for Rejection (required)│
│ [Dropdown:]                    │
│ • Duplicate report             │
│ • Insufficient evidence        │
│ • Outside jurisdiction         │
│ • Resolved already             │
│ • Other                        │
│                                │
│ Additional Notes               │
│ [Text area]                    │
│ (Optional, visible to citizen) │
│                                │
│ ⚠️ The citizen will be notified│
│    of this decision.           │
│                                │
├────────────────────────────────┤
│      [Cancel] [Confirm Reject] │
└────────────────────────────────┘
```

---

### 3.7 Case Management Screens

#### Screen: My Cases (Officer View)
**Layout:** Card grid with filters and search

**Visual Structure:**
```
┌──────────────────────────────────────────────────────────┐
│ My Cases                                   [+ Create Case]│
├──────────────────────────────────────────────────────────┤
│                                                          │
│ [Search cases...] [🔍]  [Filter: All ▼] [Sort: Recent ▼]│
│                                                          │
│ Active Cases (3)                                         │
│                                                          │
│ ┌─────────────────┐ ┌─────────────────┐ ┌────────────┐ │
│ │ Case #2847      │ │ Case #2839      │ │ Case #2831 │ │
│ │ ───────────     │ │ ───────────     │ │ ─────────  │ │
│ │ Harbor Oil Spill│ │ Zone A Dumping  │ │ Coastal    │ │
│ │                 │ │                 │ │ Pollution  │ │
│ │ 🔴 Escalated    │ │ 🟡 Active       │ │ ✅ Approved│ │
│ │                 │ │                 │ │            │ │
│ │ 8 Evidence items│ │ 12 Evidence     │ │ 6 Evidence │ │
│ │ 3 Reports       │ │ 5 Reports       │ │ 2 Reports  │ │
│ │ 2 AI Analyses   │ │ 3 AI Analyses   │ │ 1 Analysis │ │
│ │                 │ │                 │ │            │ │
│ │ Updated: 2h ago │ │ Updated: 1d ago │ │ 3 days ago │ │
│ │                 │ │                 │ │            │ │
│ │ [Open Case →]   │ │ [Open Case →]   │ │ [View →]   │ │
│ └─────────────────┘ └─────────────────┘ └────────────┘ │
│                                                          │
│ Closed Cases (12)                          [View All →] │
│ [Brief list of closed cases...]                         │
└──────────────────────────────────────────────────────────┘
```

**Case Card:**
- Width: 300px (responsive)
- Height: 280px
- Border-left: 4px solid status color
- Shadow: Level 2
- Hover: Lift effect (shadow Level 3)
- Status badge: Top-right corner

---

#### Screen: Case Detail View (Case Builder)
**Layout:** Evidence library with case compilation tools

**This is where officers build their case from collected evidence.**

**Visual Structure:**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back to Cases          Case #2847: Harbor Oil Spill   │
│                          [Save Draft] [Export] [Escalate]│
├────────────────────────┬─────────────────────────────────┤
│                        │                                 │
│ Case Information       │ Evidence Timeline               │
│ ────────────────       │ ─────────────────               │
│                        │                                 │
│ Title                  │ [Sort: Chronological ▼]         │
│ Harbor Oil Spill       │                                 │
│                        │ ┌─────────────────────────┐     │
│ Status: Escalated      │ │ Oct 1, 08:00            │     │
│ Created: Sep 28, 2025  │ │ 📍 Citizen Report #2891 │     │
│ Last Updated: 2h ago   │ │ Oil sheen observed...   │     │
│                        │ │ [View] [Remove]         │     │
│ Priority: High         │ └─────────────────────────┘     │
│ [Change]               │                                 │
│                        │ ┌─────────────────────────┐     │
│ Assigned Officers      │ │ Oct 1, 10:00            │     │
│ • Martinez (Lead)      │ │ 📸 Photo Evidence       │     │
│ • Chen (Support)       │ │ [Thumbnail]             │     │
│ [+ Add Officer]        │ │ [View] [Remove]         │     │
│                        │ └─────────────────────────┘     │
│ Location               │                                 │
│ Harbor District        │ ┌─────────────────────────┐     │
│ 48.8566° N, 2.3522° E  │ │ Oct 1, 14:00            │     │
│ [View on Map]          │ │ 🔬 AI Analysis Result   │     │
│                        │ │ 15 detections, 87% conf │     │
│ Case Notes             │ │ [View] [xAI] [Remove]   │     │
│ ────────────────       │ └─────────────────────────┘     │
│ [Rich text editor]     │                                 │
│ Add observations,      │ [+ Add Evidence]                │
│ conclusions, next      │ • Upload Photo/Document         │
│ steps...               │ • Link Report                   │
│                        │ • Add Analysis Result           │
│ Tags                   │ • Add Map Layer                 │
│ #oil-spill #harbor     │                                 │
│ [+ Add Tag]            │                                 │
│                        │                                 │
└────────────────────────┴─────────────────────────────────┘
```

**Component Details:**

**Evidence Item Card:**
- Height: 80px
- Shows: Type icon, timestamp, preview/summary
- Actions: View, Remove, Annotate
- Drag to reorder in timeline

**Add Evidence Modal:**
```
┌────────────────────────────────┐
│ Add Evidence to Case     [×]   │
├────────────────────────────────┤
│                                │
│ Evidence Type                  │
│ [Tabs:]                        │
│ [Reports] [Photos] [AI] [Docs] │
│                                │
│ Available Reports (12)         │
│ ┌──────────────────────────┐  │
│ │ ☐ Report #2891           │  │
│ │   Citizen report, 2h ago │  │
│ └──────────────────────────┘  │
│ ┌──────────────────────────┐  │
│ │ ☐ Report #2890           │  │
│ │   EO observation, 4h ago │  │
│ └──────────────────────────┘  │
│                                │
│ [Search or filter...]          │
│                                │
├────────────────────────────────┤
│         [Cancel] [Add Selected]│
└────────────────────────────────┘
```

**Export Case Options:**
```
┌────────────────────────────────┐
│ Export Case #2847        [×]   │
├────────────────────────────────┤
│                                │
│ Export Format                  │
│ ◉ PDF Report (Recommended)     │
│ ○ Word Document (.docx)        │
│ ○ Data Bundle (.zip)           │
│                                │
│ Include in Export              │
│ ☑️ Case summary                │
│ ☑️ All evidence items          │
│ ☑️ Timeline visualization      │
│ ☑️ xAI explanations            │
│ ☑️ Provenance information      │
│ ☑️ Officer notes               │
│ ☐ Raw data files               │
│                                │
│ ⓘ Provenance and chain-of-     │
│   custody will be automatically│
│   included for compliance.     │
│                                │
├────────────────────────────────┤
│       [Cancel] [Export Case]   │
└────────────────────────────────┘
```

**Escalate Case Modal:**
```
┌────────────────────────────────┐
│ Escalate Case to Prosecutor [×]│
├────────────────────────────────┤
│                                │
│ Case Summary (required)        │
│ [Text area - 300 chars min]   │
│ Summarize findings and         │
│ recommend next steps...        │
│                                │
│ Evidence Completeness Check    │
│ ☑️ All reports reviewed        │
│ ☑️ AI analysis complete        │
│ ☑️ Photos documented           │
│ ☑️ Location verified           │
│ ☐ Expert consultation needed   │
│                                │
│ Recommended Action             │
│ [Dropdown:]                    │
│ • Approve for prosecution      │
│ • Request additional evidence  │
│ • Refer to specialist          │
│                                │
│ ⚠️ Prosecutor will review this │
│    case and make final decision│
│                                │
├────────────────────────────────┤
│      [Cancel] [Escalate Case]  │
└────────────────────────────────┘
```

---

### 3.8 Jobs & Schedules (Analyst View)

#### Screen: Jobs & Schedules Dashboard
**Layout:** Queue on left, details/scheduler on right

**Visual Structure:**
```
┌──────────────────────────────────────────────────────────┐
│ Jobs & Schedules                   [+ Create New Schedule]│
├────────────┬─────────────────────────────────────────────┤
│            │                                             │
│ Job Queue  │ Active Job Details                          │
│ ──────     │ ───────────────────                         │
│            │                                             │
│ 🔄 Running │ Job #J-1847                                 │
│            │ Coastal Anomaly Detection                   │
│ J-1847     │                                             │
│ Coastal... │ Status: Running                             │
│ 80%        │ Progress: 80% (ETA 12 minutes)              │
│ [View]     │                                             │
│            │ [Progress bar with live updates]            │
│ J-1848     │                                             │
│ Zone A-12  │ Configuration                               │
│ 20%        │ ─────────────                               │
│ [View]     │ AOI: Harbor District (2.4 km²)              │
│            │ Time Range: Sep 1 - Oct 1, 2025             │
│ ⏳ Queued  │ Model: CoastalNet v3.1.2                    │
│            │ Priority: High                              │
│ J-1849     │                                             │
│ Sensor...  │ Resources                                   │
│ Queue: 3rd │ ─────────────                               │
│ [View]     │ CPU: 64% │ Memory: 8.2GB │ GPU: 45%         │
│            │                                             │
│ ✅ Complete│ Logs (Live)                                 │
│            │ ────────                                    │
│ J-1846     │ [12:34:15] Loading EO imagery...            │
│ Harbor...  │ [12:34:28] Preprocessing complete           │
│ [Results]  │ [12:35:01] Running inference...             │
│            │ [12:36:44] Postprocessing detections...     │
│ [Filter▼]  │                                             │
│            │ [Pause Job] [Cancel Job] [View Full Log]    │
│            │                                             │
│ Sidebar    │                                             │
│ 280px      │                                             │
└────────────┴─────────────────────────────────────────────┘
```

---

#### Screen: Create/Edit Schedule
**Layout:** Multi-step wizard or single-page form

**Visual Structure:**
```
┌──────────────────────────────────────────────────────────┐
│ Create Analysis Schedule                            [×]  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ [1. Area] [2. Analysis] [3. Schedule] [4. Review]       │
│ ════════  ─────────────  ────────────  ──────────       │
│                                                          │
│ Step 1: Define Area of Inspection                        │
│                                                          │
│ ┌────────────────────────────────────────────────┐      │
│ │                                                │      │
│ │        [Interactive map for AOI selection]     │      │
│ │        Draw or select predefined area          │      │
│ │                                                │      │
│ └────────────────────────────────────────────────┘      │
│                                                          │
│ Predefined Areas                                         │
│ ◉ Harbor District (2.4 km²)                              │
│ ○ Zone A-12 (1.8 km²)                                    │
│ ○ Coastal Region B (5.6 km²)                             │
│ ○ Custom (draw on map)                                   │
│                                                          │
│ Time Window for Each Run                                 │
│ Look back: [7] days                                      │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                            [Cancel] [Next: Analysis →]   │
└──────────────────────────────────────────────────────────┘
```

**Step 2: Select Analysis**
```
┌──────────────────────────────────────────────────────────┐
│ Step 2: Select Analysis Type                             │
│                                                          │
│ Model Profile                                            │
│ [Dropdown: Select model]                                 │
│                                                          │
│ Available Models:                                        │
│ ┌──────────────────────────────────────┐                │
│ │ ◉ Waste Detection (WasteNet v2.4.1)  │                │
│ │   Best for: Illegal dumping, landfill│                │
│ │   Runtime: ~5 minutes per km²        │                │
│ │   Confidence: 94.2% validation acc   │                │
│ └──────────────────────────────────────┘                │
│                                                          │
│ ┌──────────────────────────────────────┐                │
│ │ ○ Coastal Anomaly (CoastalNet v3.1.2)│                │
│ │   Best for: Coastal pollution, spills│                │
│ │   Runtime: ~8 minutes per km²        │                │
│ │   Confidence: 91.8% validation acc   │                │
│ └──────────────────────────────────────┘                │
│                                                          │
│ Advanced Settings (Optional)                             │
│ [▼ Expand]                                               │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                       [← Back] [Cancel] [Next: Schedule →│
└──────────────────────────────────────────────────────────┘
```

**Step 3: Schedule Configuration**
```
┌──────────────────────────────────────────────────────────┐
│ Step 3: Configure Schedule                               │
│                                                          │
│ Schedule Type                                            │
│ ◉ Recurring                                              │
│ ○ One-time                                               │
│                                                          │
│ Frequency                                                │
│ [Dropdown: Daily]                                        │
│ • Every hour                                             │
│ • Every 6 hours                                          │
│ • Daily                                                  │
│ • Weekly                                                 │
│ • Custom (cron expression)                               │
│                                                          │
│ Run at                                                   │
│ [Time picker: 06:00] UTC                                 │
│                                                          │
│ Days (if weekly)                                         │
│ [M] [T] [W] [T] [F] [S] [S]                              │
│                                                          │
│ Trigger Conditions (Optional)                            │
│ ☑️ Run if new data available                             │
│ ☑️ Run if sensor threshold exceeded                      │
│ ☐ Run if citizen reports cluster detected                │
│                                                          │
│ Threshold value: [5] reports in [1] hour                 │
│                                                          │
│ Notifications                                            │
│ Send alerts to:                                          │
│ ☑️ Me (analyst@example.com)                              │
│ ☑️ Officer Martinez                                      │
│ ☐ All officers in zone                                   │
│                                                          │
│ When to notify:                                          │
│ ☑️ Job starts                                            │
│ ☑️ Job completes                                         │
│ ☑️ Job fails                                             │
│ ☑️ Detections above threshold ([10] detections)          │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                       [← Back] [Cancel] [Next: Review →] │
└──────────────────────────────────────────────────────────┘
```

**Step 4: Review & Confirm**
```
┌──────────────────────────────────────────────────────────┐
│ Step 4: Review Schedule                                  │
│                                                          │
│ Schedule Summary                                         │
│ ────────────────                                         │
│                                                          │
│ Name: Harbor District Daily Monitoring                   │
│ [Edit name]                                              │
│                                                          │
│ Area of Inspection                                       │
│ Harbor District (2.4 km²)                                │
│ Look back: 7 days per run                                │
│ [Edit]                                                   │
│                                                          │
│ Analysis                                                 │
│ Model: WasteNet v2.4.1                                   │
│ Expected runtime: ~12 minutes                            │
│ [Edit]                                                   │
│                                                          │
│ Schedule                                                 │
│ Frequency: Daily at 06:00 UTC                            │
│ Triggers: New data, Sensor threshold                     │
│ Notifications: 2 recipients                              │
│ [Edit]                                                   │
│                                                          │
│ Estimated Resource Usage                                 │
│ ────────────────────────                                 │
│ Compute: ~12 minutes/day                                 │
│ Storage: ~500MB/month (results)                          │
│ API calls: ~30/month                                     │
│                                                          │
│ ⓘ This schedule will start immediately after creation.   │
│   You can pause or delete it anytime.                    │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                 [← Back] [Cancel] [Create Schedule]      │
└──────────────────────────────────────────────────────────┘
```

---

### 3.9 Admin Console

#### Screen: Admin Dashboard
**Layout:** Simple management interface for role requests and system settings

**Visual Structure:**
```
┌──────────────────────────────────────────────────────────┐
│ Admin Console                                            │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
│ │ 🔔 3        │ │ 👥 24       │ │ ⚙️ 2        │        │
│ │ Pending     │ │ Active      │ │ System      │        │
│ │ Requests    │ │ Users       │ │ Alerts      │        │
│ └─────────────┘ └─────────────┘ └─────────────┘        │
│                                                          │
│ Pending Role Requests (3)                                │
│ ────────────────────────                                 │
│                                                          │
│ ┌────────────────────────────────────────────────┐      │
│ │ Request from: Marie Dupont (C-4892)           │      │
│ │ ──────────────────────────────────────         │      │
│ │ Current Role: Citizen                          │      │
│ │ Requested: Environmental Officer               │      │
│ │ Submitted: Oct 1, 2025 09:00                   │      │
│ │                                                │      │
│ │ Justification:                                 │      │
│ │ "I work for the Environmental Agency and need  │      │
│ │ officer access to investigate reports in my    │      │
│ │ assigned district..."                          │      │
│ │                                                │      │
│ │ [View Profile] [Approve] [Reject]              │      │
│ └────────────────────────────────────────────────┘      │
│                                                          │
│ [Similar cards for other requests]                       │
│                                                          │
│ Recent Activity                                          │
│ ────────────────────                                     │
│ • Officer Martinez created Case #2847 (2h ago)           │
│ • Analyst Chen completed Job #J-1846 (3h ago)            │
│ • Prosecutor Blanc approved Case #2831 (5h ago)          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Approve/Reject Modal:**
```
┌────────────────────────────────┐
│ Review Role Request      [×]   │
├────────────────────────────────┤
│                                │
│ User: Marie Dupont             │
│ Email: marie.d@agency.gov      │
│ Current: Citizen               │
│ Requested: Officer             │
│                                │
│ Justification:                 │
│ "I work for the Environmental  │
│ Agency and need officer access │
│ to investigate reports..."     │
│                                │
│ Verification (Optional)        │
│ ☑️ Email domain verified       │
│ ☐ ID documents reviewed        │
│ ☐ Manager approval received    │
│                                │
│ Decision                       │
│ ◉ Approve                      │
│ ○ Reject                       │
│                                │
│ Notes (if rejecting)           │
│ [Text area]                    │
│                                │
│ ⓘ User will be notified via    │
│   email of your decision.      │
│                                │
├────────────────────────────────┤
│        [Cancel] [Submit]       │
└────────────────────────────────┘
```

---

### 3.10 Citizen App (External/Simplified)

**This is a separate, simplified application for citizens to submit reports.**

#### Screen: Citizen App Home
**Layout:** Mobile-first, simple card-based interface

**Visual Structure (Mobile):**
```
┌─────────────────────────┐
│ PLAZA Citizen           │
│ Environmental Reporting │
├─────────────────────────┤
│                         │
│ ┌─────────────────────┐ │
│ │     📸              │ │
│ │  Submit a Report    │ │
│ │                     │ │
│ │  Report an          │ │
│ │  environmental issue│ │
│ │                     │ │
│ │  [Tap to start →]   │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │     📋              │ │
│ │  My Reports (3)     │ │
│ │                     │ │
│ │  Track your         │ │
│ │  submitted reports  │ │
│ │                     │ │
│ │  [View →]           │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │     ℹ️              │ │
│ │  Information        │ │
│ │                     │ │
│ │  Learn about types  │ │
│ │  of reports         │ │
│ │                     │ │
│ │  [Learn more →]     │ │
│ └─────────────────────┘ │
│                         │
└─────────────────────────┘
```

---

#### Screen: Submit Report (Multi-Step)
**Layout:** Wizard-style flow with progress indicator

**Step 1: Capture Photo**
```
┌─────────────────────────┐
│ ←  Submit Report        │
│ ● ○ ○ ○                 │ Progress dots
├─────────────────────────┤
│                         │
│ Step 1: Add Photo       │
│                         │
│ ┌─────────────────────┐ │
│ │                     │ │
│ │   [Camera Preview]  │ │
│ │   or                │ │
│ │   [Uploaded Image]  │ │
│ │                     │ │
│ └─────────────────────┘ │
│                         │
│ [📸 Take Photo]         │
│ [🖼️ Choose from Gallery]│
│                         │
│ ⓘ Photo helps us verify │
│   and prioritize your   │
│   report.               │
│                         │
│         [Skip] [Next →] │
└─────────────────────────┘
```

**Step 2: Location**
```
┌─────────────────────────┐
│ ←  Submit Report        │
│ ● ● ○ ○                 │
├─────────────────────────┤
│                         │
│ Step 2: Location        │
│                         │
│ ┌─────────────────────┐ │
│ │                     │ │
│ │  [Mini map with pin]│ │
│ │                     │ │
│ └─────────────────────┘ │
│                         │
│ 📍 Current Location     │
│ 48.8566° N, 2.3522° E   │
│                         │
│ [Use Current Location]  │
│ [Move Pin on Map]       │
│                         │
│ Address (Optional)      │
│ [Text input]            │
│                         │
│         [← Back] [Next →│
└─────────────────────────┘
```

**Step 3: Report Type**
```
┌─────────────────────────┐
│ ←  Submit Report        │
│ ● ● ● ○                 │
├─────────────────────────┤
│                         │
│ Step 3: What did you see?│
│                         │
│ Select Report Type      │
│                         │
│ ◉ Illegal Dumping       │
│ ○ Water Pollution       │
│ ○ Air Pollution         │
│ ○ Oil Spill             │
│ ○ Hazardous Waste       │
│ ○ Noise Complaint       │
│ ○ Other                 │
│                         │
│ Description (Optional)  │
│ [Text area]             │
│ Tell us more about what │
│ you observed...         │
│                         │
│         [← Back] [Next →│
└─────────────────────────┘
```

**Step 4: Review & Submit**
```
┌─────────────────────────┐
│ ←  Submit Report        │
│ ● ● ● ●                 │
├─────────────────────────┤
│                         │
│ Step 4: Review          │
│                         │
│ ┌─────────────────────┐ │
│ │ [Photo thumbnail]   │ │
│ └─────────────────────┘ │
│                         │
│ Type: Illegal Dumping   │
│ [Edit]                  │
│                         │
│ Location:               │
│ 48.8566° N, 2.3522° E   │
│ [Edit]                  │
│                         │
│ Description:            │
│ Large pile of           │
│ construction debris...  │
│ [Edit]                  │
│                         │
│ ☑️ I confirm this       │
│    information is       │
│    accurate             │
│                         │
│ ⓘ You'll receive a      │
│   tracking number and   │
│   status updates.       │
│                         │
│   [← Back] [Submit Report│
└─────────────────────────┘
```

**Confirmation Screen:**
```
┌─────────────────────────┐
│    ✅ Report Submitted  │
├─────────────────────────┤
│                         │
│ Thank you for helping   │
│ protect the environment!│
│                         │
│ Your Tracking Number    │
│ ┌─────────────────────┐ │
│ │     #2891           │ │
│ └─────────────────────┘ │
│                         │
│ What happens next?      │
│ ──────────────────      │
│ 1. Your report is being │
│    reviewed             │
│ 2. An officer will      │
│    investigate          │
│ 3. You'll receive status│
│    updates              │
│                         │
│ [View My Reports]       │
│ [Submit Another Report] │
│ [Back to Home]          │
└─────────────────────────┘
```

---

#### Screen: My Reports (Citizen View)
**Layout:** Simple list with status indicators

```
┌─────────────────────────┐
│ ←  My Reports           │
├─────────────────────────┤
│                         │
│ ┌─────────────────────┐ │
│ │ Report #2891        │ │
│ │ ──────────────      │ │
│ │ 🟡 Under Review     │ │
│ │                     │ │
│ │ Illegal Dumping     │ │
│ │ Submitted: 2h ago   │ │
│ │                     │ │
│ │ Last Update:        │ │
│ │ "Being reviewed by  │ │
│ │ Officer Martinez"   │ │
│ │                     │ │
│ │ [View Details →]    │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Report #2847        │ │
│ │ ──────────────      │ │
│ │ ✅ Resolved         │ │
│ │                     │ │
│ │ Water Pollution     │ │
│ │ Submitted: 5 days   │ │
│ │                     │ │
│ │ Resolution:         │ │
│ │ "Issue addressed,   │ │
│ │ thank you"          │ │
│ │                     │ │
│ │ [View Details →]    │ │
│ └─────────────────────┘ │
│                         │
│ [Load more...]          │
│                         │
└─────────────────────────┘
```

**Status Indicators for Citizens:**
- 🔵 Blue: Received/Pending Review
- 🟡 Yellow: Under Investigation
- 🟢 Green: Resolved
- 🔴 Red: Requires More Information
- ⚫ Gray: Closed (no action needed)

**Report Detail (Citizen View):**
- Shows: Photo, type, location, submission time
- Timeline: Simple status history (no internal details)
- No access to: AI analysis, xAI, case information, officer notes
- Actions: None (read-only for citizens)

---

## 4. Component Library

### 4.1 Buttons

#### Primary Button
- **Use:** Main actions (Submit, Save, Confirm)
- **Background:** Primary Blue (`#2563EB`)
- **Text:** White, 14px, weight 500
- **Height:** 40px (default), 48px (large), 32px (small)
- **Padding:** 16px horizontal (24px for large)
- **Border-radius:** 8px
- **Hover:** Primary Dark (`#1E40AF`), scale 1.02
- **Active:** Primary Dark, scale 0.98
- **Disabled:** Gray-300 background, Gray-500 text, no hover
- **Loading:** Spinner icon (16px) replaces text

```
[Primary Button]  [Primary Large]  [Primary Small]
    40px               48px             32px
```

#### Secondary Button
- **Use:** Alternative actions (Cancel, Back)
- **Background:** Gray-100
- **Text:** Gray-700, 14px, weight 500
- **Border:** 1px solid Gray-300
- **Other specs:** Same as Primary
- **Hover:** Gray-200 background

#### Ghost Button
- **Use:** Tertiary actions (View, Edit, More)
- **Background:** Transparent
- **Text:** Primary Blue, 14px, weight 500
- **Hover:** Primary Light (`#DBEAFE`) background
- **No border**

#### Danger Button
- **Use:** Destructive actions (Delete, Reject)
- **Background:** Error Red (`#EF4444`)
- **Text:** White
- **Other specs:** Same as Primary
- **Hover:** Darker red (`#DC2626`)

#### Icon Button
- **Use:** Actions with icon only
- **Size:** 40x40px (default), 32x32px (small)
- **Icon:** 20px (default), 16px (small)
- **Background:** Transparent
- **Hover:** Gray-100 background, circular
- **Border-radius:** Full (circular)

```
[🔍] [⚙️] [×]  ← Icon buttons
```

---

### 4.2 Form Elements

#### Text Input
```
Label (14px, weight 500, Gray-700)
┌─────────────────────────────────┐
│ Placeholder text (Gray-400)     │
└─────────────────────────────────┘
Helper text (12px, Gray-500)
```

**Specs:**
- Height: 44px
- Padding: 12px 16px
- Border: 1px solid Gray-300
- Border-radius: 8px
- Font: 14px, Gray-900
- Focus: Primary Blue border (2px), shadow (0 0 0 3px rgba(37, 99, 235, 0.1))
- Error: Error Red border, red helper text, alert icon
- Disabled: Gray-100 background, Gray-400 text

#### Text Area
- Same as Text Input but:
- Min-height: 96px (adjustable)
- Resize: Vertical only
- Character counter: Bottom-right (12px, Gray-500)

#### Dropdown/Select
```
┌─────────────────────────────────┐
│ Selected option            [▼]  │
└─────────────────────────────────┘

Dropdown open:
┌─────────────────────────────────┐
│ Selected option            [▲]  │
├─────────────────────────────────┤
│ Option 1 (hover: Gray-50)       │
│ Option 2                        │
│ Option 3                        │
│ Option 4                        │
└─────────────────────────────────┘
```

**Specs:**
- Same base as Text Input
- Dropdown icon: 16px, Gray-500, right side
- Menu: Shadow Level 3, max-height 300px, scroll if needed
- Option: Height 40px, padding 12px 16px
- Selected option: Primary Blue background, white text
- Hover: Gray-50 background
- Keyboard navigation: Arrow keys, Enter to select

#### Checkbox
```
☐ Unchecked (20px, Gray-300 border)
☑️ Checked (20px, Primary Blue bg, white checkmark)
◼️ Indeterminate (Primary Blue, white dash)
```

**Specs:**
- Size: 20x20px
- Border-radius: 4px
- Border: 2px solid Gray-300 (unchecked)
- Focus: Primary Blue ring
- Label: 14px, Gray-700, left margin 8px
- Hover: Gray-400 border (unchecked), Primary Dark (checked)

#### Radio Button
```
○ Unselected (20px, Gray-300 border)
◉ Selected (20px, Primary Blue outer, white center dot)
```

**Specs:**
- Size: 20x20px (outer), 10px (inner dot)
- Border-radius: Full (circular)
- Similar states as Checkbox

#### Toggle Switch
```
OFF: [○    ] (Gray-300 bg)
ON:  [    ○] (Primary Blue bg)
```

**Specs:**
- Width: 44px, Height: 24px
- Border-radius: Full (pill shape)
- Knob: 20px circle, white, 2px margin
- Transition: 0.2s ease
- Label: 14px, right side, 8px margin

#### Slider
```
Min ─────────●────────── Max
    |----80%--|
```

**Specs:**
- Track: Height 4px, Gray-300
- Fill: Primary Blue
- Thumb: 16px circle, white, shadow Level 2
- Focus: Primary Blue ring
- Value label: Above thumb (optional)

---

### 4.3 Feedback Elements

#### Alert/Banner
```
┌────────────────────────────────────────┐
│ ⓘ Information message here       [×]   │
└────────────────────────────────────────┘

Types:
Info (Blue), Success (Green), Warning (Orange), Error (Red)
```

**Specs:**
- Padding: 12px 16px
- Border-radius: 8px
- Border-left: 4px solid (semantic color)
- Background: Semantic color at 10% opacity
- Icon: 20px, semantic color, left side
- Text: 14px, Gray-900
- Close button: 20px icon, right side (optional)

#### Toast Notification
```
┌────────────────────────────────┐
│ ✅ Action completed successfully│
└────────────────────────────────┘
```

**Specs:**
- Position: Top-right corner (or bottom-right)
- Width: 360px max
- Padding: 16px
- Shadow: Level 4
- Border-radius: 8px
- Auto-dismiss: 5 seconds (configurable)
- Slide-in animation from right
- Stack vertically if multiple

#### Progress Bar
```
[████████████░░░░░░░░] 60%
```

**Specs:**
- Height: 8px (default), 4px (slim), 12px (thick)
- Background: Gray-200
- Fill: Primary Blue (or gradient)
- Border-radius: 4px
- Percentage: 12px text, Gray-700, right side (optional)
- Animated: Indeterminate style for unknown duration

#### Skeleton Loader
```
┌────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░       │ Pulsing animation
│ ▓▓▓▓▓▓░░░░░░░░░░░░░░░░         │
│ ▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░           │
└────────────────────────────────┘
```

**Use:** Loading placeholder for content  
**Color:** Gray-200 → Gray-300 pulse  
**Animation:** 1.5s ease-in-out loop

#### Spinner/Loader
```
◐ Rotating spinner (20px default)
```

**Sizes:** 16px (small), 20px (default), 32px (large)  
**Color:** Primary Blue or context-appropriate  
**Animation:** 0.6s linear infinite rotation

---

### 4.4 Navigation Elements

#### Tabs
```
[Active Tab] [Inactive Tab] [Inactive Tab]
──────────── 
```

**Specs:**
- Tab height: 44px
- Padding: 12px 20px
- Font: 14px, weight 500
- Active: Primary Blue text, 2px bottom border (Primary Blue)
- Inactive: Gray-600 text
- Hover: Gray-100 background, Gray-900 text
- Focus: Primary Blue ring

#### Breadcrumbs
```
Home > Cases > Case #2847 > Evidence
```

**Specs:**
- Font: 14px, Gray-600
- Separator: Chevron or "/" (Gray-400)
- Current page: Gray-900, weight 500
- Links: Hover underline
- Height: 32px

#### Pagination
```
[← Previous]  1  [2]  3  4  5  [Next →]
```

**Specs:**
- Button height: 36px, width: 36px (numbers), auto (prev/next)
- Active page: Primary Blue background, white text
- Inactive: Gray-100 background on hover
- Disabled: Gray-300 text, no hover
- Ellipsis: "..." for skipped pages

---

### 4.5 Data Display

#### Table
```
┌──────────────────────────────────────────┐
│ Column 1  | Column 2  | Column 3  | ...  │ Header
├──────────────────────────────────────────┤
│ Data 1    | Data 2    | Data 3    | ...  │ Row (hover: Gray-50)
│ Data 1    | Data 2    | Data 3    | ...  │
└──────────────────────────────────────────┘
```

**Specs:**
- Header: Background Gray-50, text 14px weight 600, Gray-700
- Row: Height 56px (default), border-bottom 1px Gray-200
- Cell: Padding 12px 16px
- Hover: Gray-50 background
- Selected: Primary Light background
- Sortable columns: Arrow icon in header

#### Card
```
┌────────────────────────────────┐
│ Card Title (16px, Gray-900)    │
│ ────────────────────────       │
│                                │
│ Card content area with text,   │
│ data, or other components.     │
│                                │
│ [Action Button]                │
└────────────────────────────────┘
```

**Specs:**
- Background: White
- Border: 1px solid Gray-200 (optional)
- Border-radius: 12px
- Shadow: Level 1 (Level 2 on hover)
- Padding: 20px
- Title: H3 (20px), 12px bottom margin

#### Badge/Chip
```
[Status Badge] [Count: 3] [Role: Officer]
```

**Specs:**
- Height: 24px (default), 20px (small), 28px (large)
- Padding: 4px 12px
- Border-radius: Full (pill) or 6px (rounded)
- Font: 12px, weight 500
- Colors: Based on semantic or role colors
- Icon: 14px (optional), left side

#### Avatar
```
[JD] ← Initials
[📷] ← Photo
```

**Specs:**
- Sizes: 24px (xs), 32px (small), 40px (default), 48px (large), 64px (xl)
- Border-radius: Full (circular)
- Background: Primary Blue (if initials)
- Text: White, centered, 14px (16px for large)
- Image: Cover fit
- Border: 2px white (if overlapping)

#### Stat/Metric Display
```
┌─────────────┐
│ 🔵          │
│    47       │ Large number
│ New Reports │ Label
└─────────────┘
```

**Specs:**
- Number: 32-48px, weight 700, Gray-900
- Label: 14px, Gray-600, centered
- Icon: 32px, colored, top-left or top-center
- Background: White or light color
- Padding: 20px

---

### 4.6 Modal & Overlay

#### Modal Dialog
```
[Dark overlay 50% opacity]
      ┌────────────────────────────┐
      │ Modal Title          [×]   │
      ├────────────────────────────┤
      │                            │
      │ Modal content area         │
      │                            │
      ├────────────────────────────┤
      │          [Cancel] [Action] │
      └────────────────────────────┘
```

**Specs:**
- Overlay: Background rgba(0,0,0,0.5)
- Modal: Background White, shadow Level 4
- Width: 400px (small), 600px (default), 800px (large), 1000px (xl)
- Border-radius: 12px
- Padding: 24px
- Header: 20px title, close button top-right
- Footer: Right-aligned buttons, 16px top border

#### Drawer/Side Panel
```
[Slides in from right or left]
┌────────────────┐
│ Panel Title [×]│
├────────────────┤
│                │
│ Panel content  │
│                │
└────────────────┘
```

**Specs:**
- Width: 360px (default), 480px (wide)
- Height: 100vh
- Background: White
- Shadow: Level 4
- Animation: Slide from side (0.3s ease)
- Overlay: Optional dark background

#### Popover/Tooltip
```
        ▲
┌───────────────┐
│ Popover text  │
└───────────────┘
```

**Specs:**
- Max-width: 280px
- Padding: 12px
- Background: Gray-900 (tooltip), White (popover)
- Text: 13px, White (tooltip), Gray-700 (popover)
- Shadow: Level 3 (popover only)
- Arrow: 8px triangle
- Border-radius: 6px
- Show delay: 0.3s (tooltip)

---

### 4.7 Map Components

#### Map Marker
```
📍 Standard pin (citizen report)
🔬 AI detection marker
⚠️ Alert/incident marker
```

**Specs:**
- Size: 32px (default), 40px (large)
- Shadow: Soft drop shadow
- Color-coded by status/type
- Pulse animation for new items

#### Map Popup
- Width: 280px
- Max-height: 400px
- Shadow: Level 3
- Border-radius: 8px
- Arrow: 10px triangle pointing to marker
- Padding: 16px

#### Drawing Tools
- Rectangle: Click to start, drag to size
- Circle: Click center, drag radius
- Polygon: Click points, double-click to close
- Active tool: Primary Blue stroke (2px)
- Handles: 8px circles, draggable

#### Layer Control
```
☑️ Layer Name
   ├─ Opacity: 80%
   └─ [ⓘ] [⚙️]
```

---

## 5. Interaction Patterns

### 5.1 Loading States

**Immediate Feedback:**
- Button clicks: Spinner replaces text instantly
- Form submissions: Disable form + show progress
- Page loads: Full-page skeleton loader

**Progressive Disclosure:**
- Load critical content first (above fold)
- Lazy load images and secondary content
- Show skeleton for loading sections

**Timeout Handling:**
- If >10 seconds: Show "Taking longer than expected" message
- Option to cancel or retry
- Error state if timeout exceeded

---

### 5.2 Error Handling

**Form Validation:**
- Real-time: After field blur (not on every keystroke)
- Inline errors: Below field, red text + icon
- Summary: At top of form if multiple errors
- Prevent submission: Disable button until valid

**API Errors:**
- Toast notification for transient errors
- Modal for critical errors requiring action
- Retry button for recoverable errors
- Clear error messages (avoid technical jargon)

**Offline Detection:**
- Banner at top: "You're offline. Some features unavailable."
- Disable actions requiring network
- Queue actions when possible, sync on reconnect

---

### 5.3 Confirmation Patterns

**Destructive Actions:**
- Always require confirmation modal
- Explain consequences: "This will permanently delete..."
- Confirm button: Red (danger), explicit label ("Yes, Delete")
- Cancel: Secondary, prominent
- Optional: "Type DELETE to confirm" for critical actions

**Bulk Actions:**
- Show count: "Delete 5 reports?"
- List affected items (first 3-5)
- Clear undo option if possible

**Auto-save:**
- Save drafts automatically every 30 seconds
- Show "Saved" indicator with timestamp
- No confirmation needed for auto-saves

---

### 5.4 Search & Filter

**Search Pattern:**
- Search-as-you-type with debounce (300ms)
- Show results count: "47 results for 'harbor'"
- Highlight matches in results
- Clear button (X) when text present
- Recent searches dropdown (optional)

**Filter Pattern:**
- Filters in dropdown or sidebar
- Apply on change (instant) or "Apply Filters" button
- Show active filter count: "Filters (3)"
- Clear all filters option
- Persist filters in URL parameters

**Sort Pattern:**
- Dropdown: "Sort by: Most Recent"
- Options: Date, Relevance, Status, Priority
- Ascending/Descending toggle
- Remember user preference

---

### 5.5 Drag & Drop

**Evidence Timeline (Case Builder):**
- Drag cards to reorder
- Drag handle: 6 dots icon, left side
- Drop zone: Blue dashed border appears
- Drop feedback: Card slides into position

**File Upload:**
- Drag files into drop zone
- Drop zone: Dashed border, highlights on drag over
- Show file preview after drop
- Progress bar during upload

---

### 5.6 Keyboard Shortcuts

**Global:**
- `⌘/Ctrl + K`: Open global search
- `⌘/Ctrl + N`: New (context-aware: report, case, etc.)
- `Esc`: Close modal/panel
- `⌘/Ctrl + S`: Save (if editing)

**Navigation:**
- `⌘/Ctrl + 1-9`: Navigate to sections
- `Tab/Shift+Tab`: Focus navigation
- `Arrow keys`: Navigate lists/maps

**Map:**
- `+/-`: Zoom in/out
- `Arrow keys`: Pan map
- `Shift + Drag`: Draw rectangle
- `Delete`: Remove selected drawing

**Accessibility:**
- All interactions keyboard-accessible
- Focus indicators visible (Primary Blue ring)
- Screen reader announcements for dynamic content

---

## 6. Responsive Behavior

### 6.1 Breakpoints

**Standard Breakpoints:**
- XS: 0-639px (Mobile)
- SM: 640-767px (Large Mobile)
- MD: 768-1023px (Tablet)
- LG: 1024-1279px (Desktop)
- XL: 1280-1535px (Large Desktop)
- 2XL: 1536px+ (Extra Large)

---

### 6.2 Layout Adaptations

**Desktop (LG+):**
- Side nav: Visible, 240px
- Content: Max-width 1400px, centered
- Modals: Centered overlay
- Tables: Full width, scrollable
- Cards: 3-4 column grid

**Tablet (MD):**
- Side nav: Collapsible, 64px icons only
- Content: Full width minus margins
- Modals: 90% width, max 600px
- Tables: Horizontal scroll
- Cards: 2 column grid

**Mobile (SM/XS):**
- Side nav: Hidden, hamburger menu
- Bottom navigation: Main actions (optional)
- Content: Full width, 16px margins
- Modals: Full screen or bottom sheet
- Tables: Transform to cards/list
- Cards: Single column

---

### 6.3 Mobile-Specific Patterns

**Touch Targets:**
- Minimum: 44x44px
- Spacing: 8px between targets
- Larger buttons: 48px height

**Gestures:**
- Swipe left: Delete/archive (with confirmation)
- Swipe right: Back navigation
- Pull to refresh: Update data
- Pinch: Zoom (map)

**Mobile Navigation:**
- Top: Fixed header with menu
- Bottom: Tab bar for main sections (optional)
- Full-screen overlays for complex interactions

**Map on Mobile:**
- Larger touch controls (48px)
- Bottom sheet for details (not side panel)
- Simplified drawing tools
- GPS button prominent

---

## 7. Accessibility Requirements

### 7.1 WCAG 2.1 Level AA Compliance

**Color Contrast:**
- Text: Minimum 4.5:1 (normal), 3:1 (large text)
- UI components: Minimum 3:1
- Test all color combinations

**Text:**
- Minimum font size: 14px (body text)
- Line height: 1.5 minimum
- Resizable up to 200% without loss of functionality

**Focus Indicators:**
- Visible on all interactive elements
- 2px Primary Blue outline with offset
- Never remove focus styles

**Keyboard Navigation:**
- All functionality keyboard-accessible
- Logical tab order
- Skip links for main content
- Escape key closes modals/menus

---

### 7.2 Screen Reader Support

**Semantic HTML:**
- Use proper heading hierarchy (H1 → H6)
- `<nav>`, `<main>`, `<article>`, `<aside>` landmarks
- `<button>` for buttons, not `<div onclick>`

**ARIA Labels:**
- `aria-label` for icon-only buttons
- `aria-labelledby` for complex components
- `aria-describedby` for error messages
- `role` attributes when semantic HTML insufficient

**Dynamic Content:**
- `aria-live` regions for notifications
- Announce loading states
- Announce form errors
- Announce page changes

**Images:**
- Alt text for all meaningful images
- Decorative images: `alt=""`
- Complex images: Detailed description via `aria-describedby`

---

### 7.3 Inclusive Design

**Language:**
- Plain language, no jargon
- Clear error messages
- Consistent terminology

**Forms:**
- Labels for all inputs
- Clear instructions
- Error messages associated with fields
- Success confirmation

**Time Limits:**
- Extend or disable timeouts when possible
- Warn before session expiry (5 min notice)
- Allow user to extend session

**Motion:**
- Respect `prefers-reduced-motion`
- Disable animations if user preference set
- Essential animations still functional

---

## 8. Design File Structure

### 8.1 Figma/Design Tool Organization

**Recommended Structure:**
```
PLAZA UI Design
├─ 📁 Cover & Overview
│  ├─ Design system summary
│  └─ Changelog
│
├─ 📁 Design System
│  ├─ Colors
│  ├─ Typography
│  ├─ Spacing & Grid
│  ├─ Icons
│  ├─ Elevation & Shadows
│  └─ Components (all from section 4)
│
├─ 📁 User Flows
│  ├─ Flow diagrams for each role
│  └─ Journey maps
│
├─ 📁 Screens - Authentication
│  ├─ Login
│  ├─ Password Change Modal
│  └─ Role Request Modal
│
├─ 📁 Screens - Officer
│  ├─ Dashboard
│  ├─ Explore Map (all states)
│  ├─ Reports List
│  ├─ Report Detail
│  ├─ Cases List
│  └─ Case Detail/Builder
│
├─ 📁 Screens - Analyst
│  ├─ Dashboard
│  ├─ Jobs Queue
│  ├─ Create Schedule
│  └─ Data Management
│
├─ 📁 Screens - Prosecutor
│  ├─ Dashboard
│  ├─ Case Review
│  └─ Decision Modal
│
├─ 📁 Screens - Admin
│  ├─ Dashboard
│  ├─ Role Requests
│  └─ User Management
│
├─ 📁 Screens - Citizen App
│  ├─ Home
│  ├─ Submit Report (all steps)
│  └─ My Reports
│
├─ 📁 Components (Reusable)
│  ├─ Notifications Panel
│  ├─ xAI Panel
│  ├─ Map Components
│  └─ Modals & Overlays
│
├─ 📁 Responsive Variants
│  ├─ Mobile versions
│  ├─ Tablet versions
│  └─ Desktop versions
│
└─ 📁 States & Edge Cases
   ├─ Loading states
   ├─ Error states
   ├─ Empty states
   └─ Success states
```

---

### 8.2 Component Variants

**Each component should include:**
- Default state
- Hover state
- Active/Pressed state
- Focus state
- Disabled state
- Error state (if applicable)
- Loading state (if applicable)
- Mobile variant (if different)

---

### 8.3 Annotations

**Include on designs:**
- Spacing values (padding, margins)
- Font sizes and weights
- Color values (hex codes)
- Interactive behavior notes
- Responsive breakpoint notes
- Accessibility notes (ARIA, keyboard)
- Animation timing/easing

---

## 9. Implementation Notes for Developers

### 9.1 Frontend Stack Recommendations

**Framework:** React (with TypeScript)  
**Styling:** Tailwind CSS (matches spacing/color system)  
**Map:** Mapbox GL JS or Leaflet  
**Charts:** Recharts or Chart.js  
**State:** Zustand or React Context  
**Forms:** React Hook Form + Zod validation  
**Date/Time:** date-fns or Day.js  
**Icons:** Lucide React or Heroicons

---

### 9.2 CSS Architecture

**Use Design Tokens:**
```css
:root {
  /* Colors */
  --color-primary: #2563EB;
  --color-primary-dark: #1E40AF;
  --color-primary-light: #DBEAFE;
  
  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  
  /* Typography */
  --font-size-body: 14px;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  
  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
}
```

---

### 9.3 Component Development Priority

**Phase 1 (Critical Path):**
1. Design system components (buttons, inputs, cards)
2. Authentication screens
3. Application shell (nav, top bar)
4. Map with basic layers
5. Notifications panel

**Phase 2 (Core Features):**
1. Officer dashboard
2. Explore map with AI prediction
3. xAI panel
4. Report management
5. Case builder

**Phase 3 (Additional Roles):**
1. Analyst dashboard and jobs
2. Prosecutor review interface
3. Admin console
4. Citizen app

---

### 9.4 API Integration Points

**Expected API Endpoints:**
```
Authentication:
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/change-password
- POST /api/auth/request-role

Reports (T3.1):
- GET /api/reports?aoi=&time=&status=
- GET /api/reports/:id
- PUT /api/reports/:id/status
- POST /api/reports (citizen submit)

Layers (T3.2):
- GET /api/layers?aoi=&time=
- GET /api/layers/:id/provenance
- GET /api/layers/:id/tiles/{z}/{x}/{y}

AI Analysis (T3.3):
- POST /api/analysis/predict
- GET /api/analysis/jobs/:id
- GET /api/analysis/results/:id

xAI (T3.4):
- GET /api/xai/explanation/:detection_id
- GET /api/xai/saliency/:detection_id

Cases:
- GET /api/cases
- GET /api/cases/:id
- POST /api/cases
- PUT /api/cases/:id
- POST /api/cases/:id/escalate
- POST /api/cases/:id/export

Jobs (Analyst):
- GET /api/jobs
- POST /api/jobs/schedule
- PUT /api/jobs/:id
- DELETE /api/jobs/:id

Admin:
- GET /api/admin/role-requests
- PUT /api/admin/role-requests/:id/approve
- PUT /api/admin/role-requests/:id/reject

Notifications:
- GET /api/notifications
- PUT /api/notifications/:id/read
- DELETE /api/notifications/:id
- WebSocket: ws://api/notifications/stream
```

---

### 9.5 Performance Optimization

**Map:**
- Tile caching (service worker)
- Lazy load markers (cluster at high zoom)
- Throttle map move events (200ms)
- Use vector tiles when possible

**Images:**
- Lazy load below fold
- Responsive images (srcset)
- WebP with fallback
- Compress uploads

**Data:**
- Paginate lists (20-50 items)
- Virtual scrolling for long lists
- Debounce search (300ms)
- Cache API responses (SWR or React Query)

**Code Splitting:**
- Route-based splitting
- Lazy load heavy components (map, charts)
- Dynamic imports for modals

---

## 10. Appendix

### 10.1 Glossary

- **AOI**: Area of Inspection - geographic area for analysis
- **xAI**: Explainable AI - transparency into AI decisions
- **EO**: Earth Observation - satellite imagery
- **Provenance**: Data lineage and source information
- **Detection**: AI-identified potential incident
- **Case**: Compiled evidence package for prosecution
- **Escalation**: Elevation of case to prosecutor
- **Job**: Scheduled or on-demand AI analysis task

---

### 10.2 Design Decisions Log

**Why role-specific dashboards?**
- Different users have different priorities
- Reduces cognitive load
- Enables role-based access control

**Why map-centric interface?**
- Environmental issues are inherently spatial
- Visual context critical for decision-making
- Unified view of disparate data sources

**Why separate citizen app?**
- Simplified UX for non-technical users
- Reduced feature set minimizes confusion
- Mobile-first approach for field reporting

**Why xAI as separate panel?**
- Technical detail shouldn't clutter main interface
- On-demand access for those who need it
- Modular: can be enhanced without affecting core UI

---

### 10.3 Future Enhancements

**Version 2.0 Considerations:**
- Collaborative features (shared cases, comments)
- Advanced analytics dashboard (trends, hotspots)
- Mobile apps (native iOS/Android)
- Multi-language support (i18n)
- Dark mode
- Customizable dashboards (drag-drop widgets)
- Integration with GIS tools (QGIS, ArcGIS)
- Public transparency portal (anonymized data)
- AI model comparison tools
- Augmented reality (AR) for field work

---

## End of Document

**Total Screens Specified:** 40+  
**Components Defined:** 50+  
**User Flows:** 5 primary, multiple secondary  
**Ready for:** Design agent processing and screen generation

---

**Next Steps for Design Agent:**
1. Review design system foundation (colors, typography, spacing)
2. Create component library in design tool
3. Generate screens section by section (start with authentication)
4. Ensure consistency across all screens
5. Create responsive variants for key screens
6. Add interaction annotations
7. Build prototype with primary user flows
8. Export assets and specifications for developers

**Questions? Contact:**
[Project Lead Name]
[Email/Slack]

---

**Document Version:** 1.0  
**Last Updated:** October 1, 2025  
**Status:** Ready for Implementation
