# Reports vs Cases - Role Clarity Document

## Overview
This document clarifies the distinction between **Reports** and **Cases** in the PLAZA Toolkit, and defines the boundaries between Officer and Analyst roles to prevent functionality overlap and confusion.

---

## **Reports vs Cases - The Key Difference**

### **REPORT** (Individual Incident)
- **Created by**: Citizens (witness an incident)
- **What it is**: A single incident report documenting one environmental violation
- **Database Model**: `Report` model (schema.prisma lines 42-85)
  - Has `title`, `description`, `location`, `incidentDate`
  - Has `assigneeId` - ONE Officer assigned for field investigation
  - Has optional `caseId` - Can be linked to a Case
- **Assigned to**: ONE Officer (field investigator)
- **Purpose**: Document a single environmental violation/incident with evidence

**Example Reports**:
- Report #1: "Oil spill at River Park" (assigned to Officer A)
- Report #2: "Dead fish downstream at River Park" (assigned to Officer B)
- Report #3: "Chemical smell near factory outflow" (assigned to Officer A)

---

### **CASE** (Investigation)
- **Created by**: Analysts (connect the dots across multiple incidents)
- **What it is**: A comprehensive investigation linking multiple related reports
- **Database Model**: `Case` model (schema.prisma lines 112-146)
  - Has `caseNumber`, `title`, `description`, `status`
  - Has `ownerId` - The Analyst who owns/leads the case
  - Has `team[]` - Multiple Officers can be part of the investigation team
  - Has `findings`, `legalStatus`, `courtDate`, `verdict`
- **Owner**: Analyst (investigation coordinator)
- **Team**: Multiple Officers can be assigned to the case team
- **Purpose**: Build a prosecution-ready case from multiple related incidents

**Example Case**:
```
Case #101: "Industrial Pollution at River Park"
├── Report #1: Oil spill (Officer A investigated)
├── Report #2: Dead fish (Officer B investigated)
└── Report #3: Chemical smell (Officer A investigated)

Owner: Analyst Sarah Chen
Team: [Officer A, Officer B]
Status: READY_FOR_PROSECUTION
Legal Status: Evidence reviewed, ready for court
```

---

## **Real-World Use Case Example**

### **Scenario: Factory Illegal Dumping Investigation**

#### **Phase 1: Citizen Reports (Individual Incidents)**
```
Day 1: Citizen John reports "Strange colored water in creek"
→ Creates Report #R001
→ System assigns to Officer Martinez

Day 3: Citizen Sarah reports "Dead fish found in creek"
→ Creates Report #R002
→ System assigns to Officer Johnson

Day 7: Citizen Mike reports "Chemical smell near factory fence"
→ Creates Report #R003
→ System assigns to Officer Martinez
```

#### **Phase 2: Officer Field Investigation (Report Level)**
```
Officer Martinez (R001 & R003):
1. Visits creek location
2. Takes water samples
3. Photographs discolored water
4. Adds investigation notes to R001: "Sample sent to lab"
5. Updates R001 status: UNDER_INVESTIGATION
6. Investigates R003, finds discharge pipe
7. Links evidence between R001 and R003

Officer Johnson (R002):
1. Visits fish kill site
2. Collects dead fish samples
3. Photographs evidence
4. Adds notes to R002: "Fish sent to toxicology"
5. Updates R002 status: UNDER_INVESTIGATION
```

#### **Phase 3: Analyst Pattern Recognition (Case Creation)**
```
Analyst Chen reviews dashboard:
1. Sees 3 reports in same geographic area (River Park)
2. Reviews all evidence from Officers Martinez & Johnson
3. Recognizes pattern: All incidents point to Factory X
4. Creates Case #C100: "Factory X Illegal Chemical Dumping"
5. Links Reports R001, R002, R003 to Case C100
6. Adds Officers Martinez & Johnson to case team
7. Requests AI analysis of water samples
8. Requests additional evidence from both officers
```

#### **Phase 4: Case Building (Multi-Report Analysis)**
```
Case #C100 Dashboard (Analyst Chen):
├── Timeline: 7-day pollution pattern
├── Evidence Summary:
│   ├── From R001: Water samples (toxic chemicals detected)
│   ├── From R002: Dead fish (chemical poisoning confirmed)
│   └── From R003: Photos of discharge pipe
├── Geographic Analysis: All incidents within 500m radius
├── AI Analysis: Pattern matches industrial chemical waste
├── Legal Assessment: Strong evidence for prosecution
└── Team: Officers Martinez, Johnson coordinating collection

Status: READY_FOR_PROSECUTION
```

#### **Phase 5: Prosecution (Legal Proceedings)**
```
Prosecutor Reviews Case C100:
1. Reviews consolidated evidence from 3 reports
2. Sees chain of custody documentation
3. Reviews officer field notes and lab results
4. Assesses legal viability: STRONG CASE
5. Prepares legal documentation
6. Files charges against Factory X
7. Updates case legal status: FILED
```

---

## **Officer vs Analyst - Role Boundaries**

### **OFFICER** 👮 (Field Investigator)
**Primary Focus**: Individual REPORTS (single incidents)

**Responsibilities**:
- Receive assigned REPORTS from Analyst
- Conduct field investigations
- Collect physical evidence (samples, photos, measurements)
- Add investigation notes to REPORTS
- Update REPORT status
- Submit findings back to Analyst

**Access Level**:
- ❌ Cannot see ALL reports in system
- ✅ Can see reports assigned to them
- ✅ Can see reports they created (if any)
- ❌ Cannot create CASES
- ✅ Can be part of a CASE team
- ✅ Can view cases they're on as team members

**Workflow**:
```
1. Receive assigned REPORT from Analyst
2. Review incident details and location
3. Travel to field location
4. Collect evidence (photos, samples, measurements)
5. Add investigation notes to REPORT
6. Update REPORT status
7. Submit REPORT back to Analyst for review
```

**Dashboard Features**:
- My Assigned Reports (reports assigned to them)
- My Reports (reports they created, if any)
- Team Cases (cases where they're on the team - supporting role)
- Evidence management
- Map view for incident locations

---

### **ANALYST** 🔍 (Investigation Coordinator)
**Primary Focus**: CASES (multi-report investigations)

**Responsibilities**:
- Monitor ALL incoming reports system-wide
- Assign reports to field officers
- Review officer findings and evidence
- Identify patterns across multiple reports
- Link related incidents into CASES
- Build comprehensive case files
- Coordinate investigation teams
- Prepare cases for prosecution

**Access Level**:
- ✅ Can see ALL reports in system
- ✅ Can assign reports to officers
- ✅ Can create and manage CASES
- ✅ Can update any report
- ✅ Can add/remove officers from case teams
- ✅ Can use AI analysis tools
- ✅ Access to analytics and pattern recognition

**Workflow**:
```
1. Monitor ALL incoming reports dashboard
2. Review new incident reports
3. Assign appropriate officer for field investigation
4. Review officer findings and evidence
5. Conduct analysis using AI tools
6. Identify patterns across reports
7. Link related incidents into CASES
8. Build comprehensive case file
9. Prepare case for prosecutor
10. Coordinate with officers for additional evidence
```

**Dashboard Features**:
- All Reports (system-wide view)
- Case Management (create, link, build cases)
- Officer Assignment interface
- AI Analysis tools
- Pattern Recognition
- Evidence Analysis
- Advanced Filtering and Search

---

## **Database Schema Relationships**

### **Report → Officer Assignment**
```prisma
model Report {
  assigneeId  String?
  assignee    User?   @relation("ReportAssignee", fields: [assigneeId], references: [id])
}
```
- **One Report** → **One Officer** (or null if unassigned)
- Officer investigates individual report

---

### **Case → Analyst Owner + Team**
```prisma
model Case {
  ownerId  String
  owner    User    @relation("CaseOwner", fields: [ownerId], references: [id])
  team     User[]  @relation("CaseTeam")
}
```
- **One Case** → **One Analyst** (owner/coordinator)
- **One Case** → **Multiple Officers** (team members)
- Analyst leads investigation, officers support

---

### **Report → Case Linking**
```prisma
model Report {
  caseId  String?
  case    Case?   @relation(fields: [caseId], references: [id])
}

model Case {
  reports  Report[]
}
```
- **Multiple Reports** → **One Case**
- Analyst links related reports together

---

## **Common Misunderstandings**

### ❌ **WRONG: "Officers own cases"**
- Officers are **team members** on cases
- Analysts **own** cases (investigation coordinators)
- Officers focus on individual report investigations

### ❌ **WRONG: "Officers create incident reports like citizens"**
- Citizens create initial incident reports
- Officers **investigate** those reports
- Officers add notes/evidence to existing reports
- Officers don't create new incident reports (except rare field reports)

### ❌ **WRONG: "Officers see all reports"**
- Officers only see reports **assigned to them**
- Analysts see **all reports** in the system
- This maintains proper access control

### ❌ **WRONG: "Cases and Reports are the same thing"**
- Reports = Individual incidents (1:1)
- Cases = Multi-report investigations (1:many)
- Cases aggregate multiple related reports

---

## **Implementation Corrections**

### **Officer Dashboard Changes**

#### **Before (Incorrect)**:
```typescript
Quick Actions:
- ❌ New Report (officers shouldn't create incident reports)
- ✅ Explore Map
- ❌ My Cases (officers don't own cases)
- ✅ Evidence
```

#### **After (Correct)**:
```typescript
Quick Actions:
- ✅ Explore Map (view incident locations)
- ✅ My Cases → "Team Cases" (cases they support as team members)
- ✅ Evidence (evidence from their reports/cases)

Stats Cards:
- ✅ My Reports (reports they created, if any)
- ✅ Assigned to Me (reports assigned for investigation)
- ✅ Team Cases (cases where they're team members)
- ✅ Notifications
```

---

### **Officer Navigation Changes**

#### **Before (Incorrect)**:
```typescript
Navigation:
- Dashboard
- Explore Map
- Reports
  - Assigned to Me
  - All Reports ❌ (officers can't see all reports)
- My Cases ❌ (implies ownership)
- Evidence
```

#### **After (Correct)**:
```typescript
Navigation:
- Dashboard
- Explore Map
- Reports
  - Assigned to Me (their field investigations)
  - My Reports (reports they created)
- Team Cases (cases they support, not own)
- Evidence (scoped to their reports/cases)
```

---

## **Data Scoping Requirements**

### **Officer Report Access**
```typescript
// Officers can only see:
const accessibleReports = await db.report.findMany({
  where: {
    OR: [
      { assigneeId: officerId },  // Reports assigned to them
      { authorId: officerId }      // Reports they created
    ]
  }
});
```

### **Officer Case Access**
```typescript
// Officers can only see cases they're on:
const accessibleCases = await db.case.findMany({
  where: {
    team: {
      some: {
        id: officerId  // Cases where they're team members
      }
    }
  }
});
```

### **Analyst Report Access**
```typescript
// Analysts see ALL reports:
const allReports = await db.report.findMany({
  // No filtering - analysts have system-wide access
});
```

### **Analyst Case Access**
```typescript
// Analysts see ALL cases:
const allCases = await db.case.findMany({
  where: {
    OR: [
      { ownerId: analystId },  // Cases they own
      // Can also see cases owned by other analysts for coordination
    ]
  }
});
```

---

## **Summary**

### **Mental Model**:
```
Citizen → Report → Officer → Analyst → Case → Prosecutor

Individual        Field          Pattern         Legal
Incident    →  Investigation → Recognition  → Proceedings
```

### **Key Principles**:

1. **Reports** are individual incidents
2. **Cases** are multi-report investigations
3. **Officers** investigate reports (field work)
4. **Analysts** build cases (coordination & analysis)
5. **Officers** support cases as team members
6. **Analysts** own and lead cases
7. **Citizens** create initial incident reports
8. **Officers** don't create incident reports (focus on investigation)

### **Data Flow**:
```
1. Citizen witnesses incident
2. Citizen creates Report
3. Analyst assigns Report to Officer
4. Officer investigates Report (field work)
5. Officer adds evidence/notes to Report
6. Analyst reviews Officer findings
7. Analyst links multiple Reports into Case
8. Analyst adds Officers to Case team
9. Team collaborates on Case
10. Analyst prepares Case for Prosecutor
11. Prosecutor reviews Case for legal action
```

---

## **Reference**
- Source: PLAZA_USER_ROLES_AND_WORKFLOWS.md
- Database Schema: packages/database/prisma/schema.prisma
- Implementation: IMPLEMENTATION_PLAN.md
- Design: PLAZA_UI_Design_Document.md
