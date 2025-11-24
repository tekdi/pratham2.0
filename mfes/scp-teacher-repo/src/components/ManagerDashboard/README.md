# Manager Dashboard Components

This directory contains reusable components for the Manager Dashboard feature.

## Components Overview

### 1. CourseCompletion.tsx
Displays course completion statistics for both mandatory and non-mandatory courses using donut charts.

**Props:**
```typescript
interface CourseCompletionProps {
  mandatoryCourses: {
    completed: number;
    inProgress: number;
    overdue: number;
  };
  nonMandatoryCourses: {
    completed: number;
    inProgress: number;
    overdue: number;
  };
}
```

**API Integration Point:**
- Endpoint: `/api/manager/course-completion`
- Method: GET
- Response: Should return data matching the CourseData interface

### 2. CourseAllocation.tsx
Shows the distribution of mandatory vs non-mandatory courses using a horizontal bar chart.

**Props:**
```typescript
interface CourseAllocationProps {
  mandatory: number;
  nonMandatory: number;
  total: number;
}
```

**API Integration Point:**
- Endpoint: `/api/manager/course-allocation`
- Method: GET
- Response: Should return counts for mandatory, non-mandatory, and total courses

### 3. CourseAchievement.tsx
Displays course achievement percentages for both course types using donut charts.

**Props:**
```typescript
interface CourseAchievementProps {
  mandatoryCourses: {
    above40: number;
    between40and60: number;
    between60and90: number;
    below90: number;
  };
  nonMandatoryCourses: {
    above40: number;
    between40and60: number;
    between60and90: number;
    below90: number;
  };
}
```

**API Integration Point:**
- Endpoint: `/api/manager/course-achievement`
- Method: GET
- Response: Should return achievement data for both course types

### 4. TopPerformers.tsx
A carousel component that shows different categories of users (top performers, attention cohorts, etc.)

**Props:**
```typescript
interface TopPerformersProps {
  categories: string[];
  usersData: { [key: string]: User[] };
  dateOptions: string[];
}

interface User {
  id: string;
  name: string;
  role: string;
}
```

**API Integration Point:**
- Endpoint: `/api/manager/top-performers`
- Method: GET
- Query Params: `date` (optional)
- Response: Should return categories and user lists for each category

### 5. UserCard.tsx
A simple component for displaying user information with an avatar.

**Props:**
```typescript
interface UserCardProps {
  name: string;
  role: string;
  avatarText?: string;
}
```

## Usage Example

```tsx
import ManagerDashboard from './pages/manager-dashboard';

// The dashboard page handles all API calls and passes data to components
<ManagerDashboard />
```

## API Integration Guide

The main dashboard page (`/pages/manager-dashboard/index.tsx`) currently uses dummy data. To integrate with real APIs:

1. Replace the `fetchDashboardData` function with actual API calls
2. Use your API client (axios, fetch, etc.)
3. Handle loading and error states appropriately
4. Update the dummy data structure to match your API responses

Example:
```tsx
const fetchDashboardData = async () => {
  setLoading(true);
  try {
    const [completion, allocation, achievement, performers] = await Promise.all([
      fetch('/api/manager/course-completion').then(r => r.json()),
      fetch('/api/manager/course-allocation').then(r => r.json()),
      fetch('/api/manager/course-achievement').then(r => r.json()),
      fetch('/api/manager/top-performers').then(r => r.json()),
    ]);

    setCourseCompletionData(completion);
    setCourseAllocationData(allocation);
    setCourseAchievementData(achievement);
    setTopPerformersData(performers);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  } finally {
    setLoading(false);
  }
};
```

## Dependencies

- Material-UI (MUI) - for UI components
- Recharts - for data visualization (donut charts)
- React - core framework

## Styling

All components use Material-UI's `sx` prop for styling and follow a consistent design system with:
- White backgrounds with subtle shadows
- Rounded corners (borderRadius: 2)
- Consistent spacing (padding: 3)
- Responsive layouts using Grid and Stack components

