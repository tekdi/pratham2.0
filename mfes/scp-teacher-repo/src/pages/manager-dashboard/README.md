# Manager Dashboard - Implementation Guide

## Overview
The Manager Dashboard provides a comprehensive view of team learning progress, course completion statistics, and employee performance metrics.

## File Structure
```
mfes/scp-teacher-repo/src/
├── components/
│   └── ManagerDashboard/
│       ├── CourseCompletion.tsx      # Donut charts for course completion
│       ├── CourseAllocation.tsx      # Horizontal bar chart for allocation
│       ├── CourseAchievement.tsx     # Donut charts for achievement levels
│       ├── TopPerformers.tsx         # Carousel for user categories
│       ├── UserCard.tsx              # User display component
│       ├── types.ts                  # TypeScript type definitions
│       ├── index.ts                  # Component exports
│       └── README.md                 # Component documentation
├── pages/
│   └── manager-dashboard/
│       ├── index.tsx                 # Main dashboard page
│       └── README.md                 # This file
└── services/
    └── managerDashboardApi.ts        # API service layer
```

## Features

### 1. Course Completion Section
- **Mandatory Courses**: Shows completed, in-progress, and overdue counts
- **Non-mandatory Courses**: Shows completed, in-progress, and overdue counts
- **Visualization**: Donut charts with color-coded segments
  - Green: Completed
  - Yellow: In Progress
  - Red: Overdue

### 2. Course Allocation Section
- **Distribution**: Shows split between mandatory and non-mandatory courses
- **Visualization**: Horizontal bar chart
- **Total Count**: Displays total allocated courses

### 3. Course Achievement Section
- **Performance Ranges**: Four achievement brackets
  - >40%
  - 40-60%
  - 60-90%
  - <90%
- **Visualization**: Donut charts for both course types

### 4. Top Performers & Attention Cohorts
- **Categories**: Multiple user groupings (top performers, low performers, active, inactive)
- **Navigation**: Carousel with previous/next buttons
- **Date Filter**: Dropdown to filter by time period
- **User Display**: Grid layout with avatars and roles

## Getting Started

### Installation
All dependencies are already part of the project. The components use:
- Material-UI (MUI)
- Recharts for charts
- React hooks for state management

### Usage

#### Import the dashboard page in your routing:
```tsx
import ManagerDashboard from './pages/manager-dashboard';

// In your router
<Route path="/manager-dashboard" element={<ManagerDashboard />} />
```

#### Or use individual components:
```tsx
import {
  CourseCompletion,
  CourseAllocation,
  CourseAchievement,
  TopPerformers
} from './components/ManagerDashboard';

function MyCustomDashboard() {
  return (
    <div>
      <CourseCompletion
        mandatoryCourses={{ completed: 20, inProgress: 32, overdue: 4 }}
        nonMandatoryCourses={{ completed: 20, inProgress: 32, overdue: 4 }}
      />
    </div>
  );
}
```

## API Integration

### Current State
The dashboard currently uses dummy data defined in the component. All data is static for demonstration purposes.

### Integration Steps

#### Option 1: Use the API service layer (Recommended)
```tsx
import { getDashboardData } from '../../services/managerDashboardApi';

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getDashboardData();
      setCourseCompletionData(data.courseCompletion);
      setCourseAllocationData(data.courseAllocation);
      setCourseAchievementData(data.courseAchievement);
      setTopPerformersData(data.topPerformers);
      setTotalEmployees(data.totalEmployees);
    } catch (error) {
      console.error('Error:', error);
      // Handle error state
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
```

#### Option 2: Direct API calls
1. Open `/services/managerDashboardApi.ts`
2. Replace the dummy data with actual fetch/axios calls
3. Update API endpoints to match your backend
4. Configure API_BASE_URL in environment variables

### Expected API Endpoints

```
GET /api/manager/course-completion
Response: {
  mandatoryCourses: { completed, inProgress, overdue },
  nonMandatoryCourses: { completed, inProgress, overdue }
}

GET /api/manager/course-allocation
Response: {
  mandatory: number,
  nonMandatory: number,
  total: number
}

GET /api/manager/course-achievement
Response: {
  mandatoryCourses: { above40, between40and60, between60and90, below90 },
  nonMandatoryCourses: { above40, between40and60, between60and90, below90 }
}

GET /api/manager/top-performers?date=<filter>
Response: {
  categories: string[],
  usersData: { [category]: User[] },
  dateOptions: string[]
}
```

## Customization

### Styling
All components use Material-UI's `sx` prop. To customize:
```tsx
<CourseCompletion
  mandatoryCourses={data}
  nonMandatoryCourses={data}
  sx={{ backgroundColor: 'custom-color' }} // Add custom styles
/>
```

### Chart Colors
Update colors in the component files:
```tsx
const COLORS = {
  completed: '#4caf50',    // Change to your brand colors
  inProgress: '#ffc107',
  overdue: '#f44336',
};
```

### Adding New Categories
In TopPerformers component, categories are dynamic based on API response:
```tsx
// API should return
{
  categories: [
    'Your Custom Category 1',
    'Your Custom Category 2'
  ],
  usersData: {
    'Your Custom Category 1': [/* users */],
    'Your Custom Category 2': [/* users */]
  }
}
```

## Responsive Design
All components are responsive and will adapt to different screen sizes:
- **Desktop**: Multi-column layout
- **Tablet**: Adjusted grid with 2 columns
- **Mobile**: Single column stack layout

## Performance Considerations
- All API calls are made once on mount
- Data is cached in component state
- Consider adding React Query or SWR for better caching
- Charts use ResponsiveContainer for optimal rendering

## Testing
To test the dashboard:
1. Navigate to `/manager-dashboard`
2. Verify all sections render correctly
3. Check carousel navigation in Top Performers
4. Test date filter functionality
5. Verify responsive behavior on different screen sizes

## Future Enhancements
- [ ] Add data refresh button
- [ ] Implement real-time updates using WebSockets
- [ ] Add export to PDF functionality
- [ ] Include date range picker for custom filters
- [ ] Add drill-down functionality on chart clicks
- [ ] Implement error boundaries
- [ ] Add skeleton loaders for better UX
- [ ] Include tooltips with more detailed information

## Troubleshooting

### Charts not rendering
- Ensure recharts is installed: `npm install recharts`
- Check browser console for errors

### Styling issues
- Verify Material-UI theme is properly configured
- Check if MUI components are imported correctly

### Type errors
- Ensure all types are imported from `types.ts`
- Verify API responses match expected interfaces

## Support
For questions or issues, please contact the development team or refer to:
- Component README: `/components/ManagerDashboard/README.md`
- Type definitions: `/components/ManagerDashboard/types.ts`
- API service: `/services/managerDashboardApi.ts`

