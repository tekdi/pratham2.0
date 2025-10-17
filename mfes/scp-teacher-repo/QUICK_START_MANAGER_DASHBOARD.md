# 🚀 Quick Start - Manager Dashboard

## View the Dashboard in 3 Steps

### Step 1: Navigate to the Dashboard
Add this route to your application:
```tsx
import ManagerDashboard from './src/pages/manager-dashboard';

// In your router
<Route path="/manager-dashboard" component={ManagerDashboard} />
```

### Step 2: Access the Page
Open your browser and go to:
```
http://localhost:3000/manager-dashboard
```

### Step 3: See It in Action! 🎉
The dashboard will load with dummy data showing:
- ✅ Course completion statistics
- ✅ Course allocation breakdown
- ✅ Achievement level charts
- ✅ Top performers carousel

---

## Connect Real APIs in 3 Steps

### Step 1: Open API Service File
```bash
src/services/managerDashboardApi.ts
```

### Step 2: Update API Endpoints
Replace the dummy data with your actual endpoints:
```tsx
export const getCourseCompletionData = async () => {
  // Replace this dummy return
  // return { mandatoryCourses: {...}, ... }
  
  // With actual API call
  const response = await fetch(`${API_BASE_URL}/manager/course-completion`);
  return response.json();
};
```

### Step 3: Set Environment Variable
Add to your `.env` file:
```
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com/api
```

Done! Your dashboard is now connected to real data. 🎊

---

## Component Usage Examples

### Use Individual Components
```tsx
import { CourseCompletion } from '@/components/ManagerDashboard';

function MyPage() {
  return (
    <CourseCompletion
      mandatoryCourses={{ completed: 20, inProgress: 32, overdue: 4 }}
      nonMandatoryCourses={{ completed: 20, inProgress: 32, overdue: 4 }}
    />
  );
}
```

### Use with API Service
```tsx
import { getDashboardData } from '@/services/managerDashboardApi';
import { CourseCompletion } from '@/components/ManagerDashboard';

function MyPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getDashboardData().then(setData);
  }, []);

  return <CourseCompletion {...data.courseCompletion} />;
}
```

---

## File Structure at a Glance

```
📦 Manager Dashboard
├── 📄 MANAGER_DASHBOARD_IMPLEMENTATION.md (Full docs)
├── 📄 QUICK_START_MANAGER_DASHBOARD.md (This file)
├── 📁 src/components/ManagerDashboard/
│   ├── CourseCompletion.tsx
│   ├── CourseAllocation.tsx
│   ├── CourseAchievement.tsx
│   ├── TopPerformers.tsx
│   ├── UserCard.tsx
│   ├── types.ts
│   ├── index.ts
│   └── README.md
├── 📁 src/pages/manager-dashboard/
│   ├── index.tsx
│   └── README.md
└── 📁 src/services/
    └── managerDashboardApi.ts
```

---

## Key Features

| Feature | Component | Description |
|---------|-----------|-------------|
| 📊 Course Completion | `CourseCompletion.tsx` | Donut charts showing completion stats |
| 📈 Course Allocation | `CourseAllocation.tsx` | Horizontal bar chart for course distribution |
| 🎯 Course Achievement | `CourseAchievement.tsx` | Performance level breakdown |
| 👥 Top Performers | `TopPerformers.tsx` | User rankings with carousel navigation |
| 👤 User Cards | `UserCard.tsx` | Individual user display component |

---

## Customization Quick Tips

### Change Colors
```tsx
// In any chart component
const COLORS = {
  completed: '#YOUR_COLOR',    // Change these
  inProgress: '#YOUR_COLOR',
  overdue: '#YOUR_COLOR',
};
```

### Adjust Layout
```tsx
// In index.tsx
<Grid item xs={12} lg={4}>  {/* Change breakpoint values */}
  <CourseAllocation {...props} />
</Grid>
```

### Modify Categories
```tsx
// In managerDashboardApi.ts
categories: [
  'Your Custom Category',
  'Another Category',
],
usersData: {
  'Your Custom Category': [/* users */],
}
```

---

## Testing Checklist

- [ ] Dashboard page loads without errors
- [ ] All four sections render correctly
- [ ] Charts display with proper data
- [ ] Carousel navigation works (< >)
- [ ] Date filter dropdown functions
- [ ] Responsive on mobile, tablet, desktop
- [ ] No console errors

---

## Common Issues & Solutions

### Charts Not Showing
**Solution:** Install recharts if missing
```bash
npm install recharts
```

### Type Errors
**Solution:** Import types from the barrel file
```tsx
import { CourseData, User } from '@/components/ManagerDashboard';
```

### API Not Connecting
**Solution:** Check your `.env` file and API endpoints
```bash
# Verify
echo $NEXT_PUBLIC_API_BASE_URL
```

---

## Need More Help?

📚 **Detailed Documentation:**
- Full implementation guide: `MANAGER_DASHBOARD_IMPLEMENTATION.md`
- Component API docs: `src/components/ManagerDashboard/README.md`
- Page integration: `src/pages/manager-dashboard/README.md`

💡 **Code Examples:**
- All files include inline comments
- Type definitions in `types.ts`
- API patterns in `managerDashboardApi.ts`

---

## What's Next?

1. ✅ View the dashboard
2. ✅ Test with dummy data
3. 🔄 Connect your APIs
4. 🎨 Customize styling
5. 🚀 Deploy!

**Happy Coding! 🎉**

