# Component Visual Map

## Dashboard Layout

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  Team Learning Overview                    Total: 56 👥    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                    COURSE COMPLETION                       ┃
┃  ┌──────────────────────────┬──────────────────────────┐  ┃
┃  │   Mandatory Courses      │  Non-mandatory Courses   │  ┃
┃  │                          │                          │  ┃
┃  │       🍩 Chart           │       🍩 Chart           │  ┃
┃  │     NO. EMPLOYEES        │     NO. EMPLOYEES        │  ┃
┃  │                          │                          │  ┃
┃  │  🟢 Completed: 20        │  🟢 Completed: 20        │  ┃
┃  │  🟡 In Progress: 32      │  🟡 In Progress: 32      │  ┃
┃  │  🔴 Overdue: 4           │  🔴 Overdue: 4           │  ┃
┃  └──────────────────────────┴──────────────────────────┘  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━┓ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ COURSE ALLOCATION ┃ ┃      TOP PERFORMERS & COHORTS      ┃
┃                   ┃ ┃                                    ┃
┃   TOTAL: 84       ┃ ┃  ┌────────────────────────────┐   ┃
┃                   ┃ ┃  │ < 5 Highest... (1 of 4) > │   ┃
┃  ██████████████   ┃ ┃  └────────────────────────────┘   ┃
┃  ▓▓▓▓▓▓▓▓▓▓▓      ┃ ┃                                    ┃
┃  ━━━━━━━━━━━━━━   ┃ ┃  ▼ As of today, 5th Sep ▼         ┃
┃                   ┃ ┃                                    ┃
┃  🟢 Mandatory: 46 ┃ ┃  5 HIGHEST COURSE COMPLETING...    ┃
┃  🟡 Non-Mand: 38  ┃ ┃  ┌───────────┬──────────────┐     ┃
┃                   ┃ ┃  │ 👤 User 1 │ 👤 User 4    │     ┃
┗━━━━━━━━━━━━━━━━━━━┛ ┃  │ 👤 User 2 │ 👤 User 5    │     ┃
                      ┃  │ 👤 User 3 │ 👤 User 6    │     ┃
                      ┃  └───────────┴──────────────┘     ┃
                      ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                   COURSE ACHIEVEMENT                       ┃
┃  ┌──────────────────────────┬──────────────────────────┐  ┃
┃  │   Mandatory Courses      │  Non-mandatory Courses   │  ┃
┃  │                          │                          │  ┃
┃  │       🍩 Chart           │       🍩 Chart           │  ┃
┃  │                          │                          │  ┃
┃  │  🟢 >40%                 │  🟢 >40%                 │  ┃
┃  │  🟡 40-60%               │  🟡 40-60%               │  ┃
┃  │  🟣 60-90%               │  🟣 60-90%               │  ┃
┃  │  ⚪ <90%                 │  ⚪ <90%                 │  ┃
┃  └──────────────────────────┴──────────────────────────┘  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

## Component Tree

```
ManagerDashboard (index.tsx)
│
├── Header Section
│   ├── Typography: "Team Learning Overview"
│   └── Typography: "Total Employees: 56"
│
├── Grid Container
│   │
│   ├── Grid Item (xs=12)
│   │   └── CourseCompletion.tsx
│   │       ├── Box (container)
│   │       ├── Typography (title)
│   │       └── Stack (horizontal)
│   │           ├── Box (mandatory section)
│   │           │   ├── Typography (subtitle)
│   │           │   ├── ResponsiveContainer
│   │           │   │   └── PieChart (recharts)
│   │           │   │       └── Pie (donut)
│   │           │   └── Stack (legend)
│   │           │       ├── Completed item
│   │           │       ├── In Progress item
│   │           │       └── Overdue item
│   │           │
│   │           └── Box (non-mandatory section)
│   │               └── [same structure as mandatory]
│   │
│   ├── Grid Item (xs=12, lg=4)
│   │   └── CourseAllocation.tsx
│   │       ├── Box (container)
│   │       ├── Typography (title)
│   │       ├── Typography (total)
│   │       ├── Box (bar chart)
│   │       │   ├── Box (mandatory bar)
│   │       │   └── Box (non-mandatory bar)
│   │       └── Stack (legend)
│   │           ├── Mandatory item
│   │           └── Non-mandatory item
│   │
│   ├── Grid Item (xs=12, lg=8)
│   │   └── TopPerformers.tsx
│   │       ├── Box (container)
│   │       ├── Typography (title)
│   │       ├── Box (category navigation)
│   │       │   ├── IconButton (previous)
│   │       │   ├── Typography (category name)
│   │       │   ├── Typography (counter)
│   │       │   └── IconButton (next)
│   │       ├── FormControl (date filter)
│   │       │   └── Select
│   │       ├── Typography (section title)
│   │       └── Grid (user grid)
│   │           ├── Grid Item (left column)
│   │           │   └── Stack
│   │           │       └── UserCard.tsx (x3)
│   │           │           ├── Avatar
│   │           │           └── Box
│   │           │               ├── Typography (name)
│   │           │               └── Typography (role)
│   │           │
│   │           └── Grid Item (right column)
│   │               └── Stack
│   │                   └── UserCard.tsx (x3)
│   │
│   └── Grid Item (xs=12)
│       └── CourseAchievement.tsx
│           ├── Box (container)
│           ├── Typography (title)
│           └── Stack (horizontal)
│               ├── Box (mandatory section)
│               │   ├── Typography (subtitle)
│               │   ├── ResponsiveContainer
│               │   │   └── PieChart (recharts)
│               │   │       └── Pie (donut)
│               │   └── Stack (legend)
│               │       ├── >40% item
│               │       ├── 40-60% item
│               │       ├── 60-90% item
│               │       └── <90% item
│               │
│               └── Box (non-mandatory section)
│                   └── [same structure as mandatory]
```

## Component Dependencies

```
┌─────────────────────────────────────────────────────────┐
│                   External Libraries                    │
│  • @mui/material (Box, Typography, Stack, Grid, etc.)  │
│  • @mui/icons-material (ChevronLeft, ChevronRight)     │
│  • recharts (PieChart, Pie, Cell, Tooltip)             │
│  • react (useState, useEffect)                          │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                      Type System                        │
│           src/components/ManagerDashboard/types.ts      │
│  • CourseData                                           │
│  • CourseCompletionData                                 │
│  • CourseAllocationData                                 │
│  • AchievementData                                      │
│  • CourseAchievementData                                │
│  • User                                                 │
│  • TopPerformersData                                    │
│  • DashboardData                                        │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                    Component Layer                      │
│         src/components/ManagerDashboard/                │
│  ┌───────────────────────────────────────────────────┐ │
│  │ CourseCompletion.tsx                              │ │
│  │ CourseAllocation.tsx                              │ │
│  │ CourseAchievement.tsx                             │ │
│  │ TopPerformers.tsx  ──uses──> UserCard.tsx        │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                     Service Layer                       │
│           src/services/managerDashboardApi.ts           │
│  • getCourseCompletionData()                            │
│  • getCourseAllocationData()                            │
│  • getCourseAchievementData()                           │
│  • getTopPerformersData()                               │
│  • getDashboardData()                                   │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                       Page Layer                        │
│         src/pages/manager-dashboard/index.tsx           │
│  • State Management (useState)                          │
│  • Data Fetching (useEffect)                            │
│  • Component Composition                                │
│  • Layout Grid                                          │
└─────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌──────────────┐
│   API Call   │ (Future)
└──────┬───────┘
       │
       ↓
┌──────────────────────────────────┐
│  managerDashboardApi.ts          │
│  • getDashboardData()            │
│  Returns: DashboardData          │
└──────┬───────────────────────────┘
       │
       ↓
┌──────────────────────────────────┐
│  index.tsx (Page)                │
│  State Management:               │
│  • courseCompletionData          │
│  • courseAllocationData          │
│  • courseAchievementData         │
│  • topPerformersData             │
│  • totalEmployees                │
└──────┬───────────────────────────┘
       │
       ├─────────────┬─────────────┬─────────────┐
       ↓             ↓             ↓             ↓
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│CourseCompl..│ │CourseAlloc..│ │CourseAchie..│ │TopPerform...│
│   Props ↓   │ │   Props ↓   │ │   Props ↓   │ │   Props ↓   │
└─────────────┘ └─────────────┘ └─────────────┘ └──────┬──────┘
                                                        │
                                                        ↓
                                                 ┌─────────────┐
                                                 │  UserCard   │
                                                 │   Props ↓   │
                                                 └─────────────┘
```

## State Management Flow

```
Component Mount
    ↓
useEffect triggers
    ↓
fetchDashboardData()
    ↓
Simulate API delay (1000ms)
    ↓
Set dummy data to state:
    ↓
    ├── setCourseCompletionData()
    ├── setCourseAllocationData()
    ├── setCourseAchievementData()
    ├── setTopPerformersData()
    └── setTotalEmployees()
    ↓
setLoading(false)
    ↓
Components re-render with data
    ↓
UI displays charts & data
```

## Interactive Elements

### CourseCompletion
- ✅ Clickable legend items (underlined, primary color)
- ✅ Hover tooltips on chart segments

### CourseAllocation
- ✅ Animated bar chart (transition on load)

### CourseAchievement
- ✅ Hover tooltips on chart segments

### TopPerformers
- ✅ Previous button (◀)
- ✅ Next button (▶)
- ✅ Date filter dropdown
- ✅ Category carousel (auto-updates user list)

## Responsive Breakpoints

```
Mobile (xs: 0px)
├── Single column
├── Stacked components
└── Full width charts

Tablet (md: 900px)
├── 2-column where applicable
├── Optimized spacing
└── Adjusted chart sizes

Desktop (lg: 1200px)
├── Multi-column grid
├── Side-by-side sections
└── Maximum chart visibility

XL (xl: 1536px)
└── Contained max-width layout
```

## Color Palette Reference

```
🟢 Green (#4caf50)   - Success/Completed
🟡 Yellow (#ffc107)  - Warning/In Progress  
🔴 Red (#f44336)     - Error/Overdue
🟣 Purple (#9c27b0)  - Achievement Level
⚪ Gray (#bdbdbd)    - Neutral/Low
🟦 Blue (theme)      - Interactive elements
```

