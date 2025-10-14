import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import {
  CourseCompletion,
  CourseAllocation,
  CourseAchievement,
  TopPerformers,
  IndividualProgress,
  CourseData,
  AchievementData,
  User,
  EmployeeProgress,
} from '../../components/ManagerDashboard';

const ManagerDashboard = () => {
  // State for API data
  const [courseCompletionData, setCourseCompletionData] = useState<{
    mandatoryCourses: CourseData;
    nonMandatoryCourses: CourseData;
  }>({
    mandatoryCourses: {
      completed: 0,
      inProgress: 0,
      overdue: 0,
    },
    nonMandatoryCourses: {
      completed: 0,
      inProgress: 0,
      overdue: 0,
    },
  });

  const [courseAllocationData, setCourseAllocationData] = useState({
    mandatory: 0,
    nonMandatory: 0,
    total: 0,
  });

  const [courseAchievementData, setCourseAchievementData] = useState<{
    mandatoryCourses: AchievementData;
    nonMandatoryCourses: AchievementData;
  }>({
    mandatoryCourses: {
      above40: 0,
      between40and60: 0,
      between60and90: 0,
      below90: 0,
    },
    nonMandatoryCourses: {
      above40: 0,
      between40and60: 0,
      between60and90: 0,
      below90: 0,
    },
  });

  const [topPerformersData, setTopPerformersData] = useState<{
    categories: string[];
    usersData: { [key: string]: User[] };
    dateOptions: string[];
  }>({
    categories: [],
    usersData: {},
    dateOptions: [],
  });

  const [individualProgressData, setIndividualProgressData] = useState<EmployeeProgress[]>([]);

  const [loading, setLoading] = useState(true);
  const [totalEmployees, setTotalEmployees] = useState(0);

  // Simulate API call with dummy data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Dummy data - Replace this with actual API calls
      const dummyCourseCompletionData = {
        mandatoryCourses: {
          completed: 20,
          inProgress: 32,
          overdue: 4,
        },
        nonMandatoryCourses: {
          completed: 20,
          inProgress: 32,
          overdue: 4,
        },
      };

      const dummyCourseAllocationData = {
        mandatory: 46,
        nonMandatory: 38,
        total: 84,
      };

      const dummyCourseAchievementData = {
        mandatoryCourses: {
          above40: 15,
          between40and60: 20,
          between60and90: 12,
          below90: 9,
        },
        nonMandatoryCourses: {
          above40: 18,
          between40and60: 22,
          between60and90: 10,
          below90: 6,
        },
      };

      const dummyTopPerformersData = {
        categories: [
          '5 Highest Course Completing Users',
          '5 Lowest Course Completing Users',
          'Most Active Users',
          'Least Active Users',
        ],
        usersData: {
          '5 Highest Course Completing Users': [
            { id: '1', name: 'Rahul Somshekhar', role: 'Facilitator' },
            { id: '2', name: 'Rahul Somshekhar', role: 'Facilitator' },
            { id: '3', name: 'Rahul Somshekhar', role: 'Facilitator' },
            { id: '4', name: 'Rahul Somshekhar', role: 'Facilitator' },
            { id: '5', name: 'Rahul Somshekhar', role: 'Facilitator' },
            { id: '6', name: 'Rahul Somshekhar', role: 'Facilitator' },
          ],
          '5 Lowest Course Completing Users': [
            { id: '1', name: 'Priya Sharma', role: 'Teacher' },
            { id: '2', name: 'Amit Patel', role: 'Teacher' },
            { id: '3', name: 'Sneha Reddy', role: 'Facilitator' },
            { id: '4', name: 'Vikram Singh', role: 'Teacher' },
            { id: '5', name: 'Anjali Mehta', role: 'Facilitator' },
          ],
          'Most Active Users': [
            { id: '1', name: 'Karan Verma', role: 'Facilitator' },
            { id: '2', name: 'Divya Nair', role: 'Teacher' },
            { id: '3', name: 'Rohit Kumar', role: 'Facilitator' },
            { id: '4', name: 'Pooja Gupta', role: 'Teacher' },
          ],
          'Least Active Users': [
            { id: '1', name: 'Sanjay Desai', role: 'Teacher' },
            { id: '2', name: 'Meera Iyer', role: 'Facilitator' },
            { id: '3', name: 'Arjun Rao', role: 'Teacher' },
          ],
        },
        dateOptions: [
          'As of today, 5th Sep',
          'Last 7 days',
          'Last 30 days',
          'Last 90 days',
        ],
      };

      const dummyIndividualProgressData: EmployeeProgress[] = [
        {
          id: '1',
          name: 'Rahul Somshekhar',
          role: 'Facilitator',
          department: 'Teaching',
          mandatoryCourses: { completed: 3, inProgress: 8, overdue: 2, total: 15 },
          nonMandatoryCourses: { completed: 5, inProgress: 3, notEnrolled: 8, total: 20 },
        },
        {
          id: '2',
          name: 'Rahul Somshekhar',
          role: 'Facilitator',
          department: 'Teaching',
          mandatoryCourses: { completed: 4, inProgress: 8, overdue: 1, total: 15 },
          nonMandatoryCourses: { completed: 6, inProgress: 2, notEnrolled: 8, total: 20 },
        },
        {
          id: '3',
          name: 'Rahul Somshekhar',
          role: 'Facilitator',
          department: 'Teaching',
          mandatoryCourses: { completed: 3, inProgress: 8, overdue: 2, total: 15 },
          nonMandatoryCourses: { completed: 5, inProgress: 3, notEnrolled: 8, total: 20 },
        },
        {
          id: '4',
          name: 'Rahul Somshekhar',
          role: 'Facilitator',
          department: 'Teaching',
          mandatoryCourses: { completed: 3, inProgress: 8, overdue: 2, total: 15 },
          nonMandatoryCourses: { completed: 5, inProgress: 3, notEnrolled: 8, total: 20 },
        },
        {
          id: '5',
          name: 'Rahul Somshekhar',
          role: 'Facilitator',
          department: 'Teaching',
          mandatoryCourses: { completed: 3, inProgress: 8, overdue: 2, total: 15 },
          nonMandatoryCourses: { completed: 5, inProgress: 3, notEnrolled: 8, total: 20 },
        },
        {
          id: '6',
          name: 'Rahul Somshekhar',
          role: 'Facilitator',
          department: 'Teaching',
          mandatoryCourses: { completed: 3, inProgress: 8, overdue: 2, total: 15 },
          nonMandatoryCourses: { completed: 5, inProgress: 3, notEnrolled: 8, total: 20 },
        },
        {
          id: '7',
          name: 'Rahul Somshekhar',
          role: 'Facilitator',
          department: 'Teaching',
          mandatoryCourses: { completed: 3, inProgress: 8, overdue: 2, total: 15 },
          nonMandatoryCourses: { completed: 5, inProgress: 3, notEnrolled: 8, total: 20 },
        },
        {
          id: '8',
          name: 'Rahul Somshekhar',
          role: 'Facilitator',
          department: 'Teaching',
          mandatoryCourses: { completed: 3, inProgress: 8, overdue: 2, total: 15 },
          nonMandatoryCourses: { completed: 5, inProgress: 3, notEnrolled: 8, total: 20 },
        },
      ];

      // Set all data
      setCourseCompletionData(dummyCourseCompletionData);
      setCourseAllocationData(dummyCourseAllocationData);
      setCourseAchievementData(dummyCourseAchievementData);
      setTopPerformersData(dummyTopPerformersData);
      setIndividualProgressData(dummyIndividualProgressData);
      setTotalEmployees(56);

      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Typography variant="h6">Loading Dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', p: 2 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" fontWeight={600} display="inline">
            Team Learning Overview
          </Typography>
          <Typography variant="body2" color="text.secondary" display="inline" sx={{ ml: 2 }}>
            Total Employees : {totalEmployees}
          </Typography>
        </Box>

        {/* Dashboard Grid */}
        <Grid container spacing={2}>
          {/* Left Column: Course Completion and Course Achievement */}
          <Grid item xs={12} md={7}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <CourseCompletion
                  mandatoryCourses={courseCompletionData.mandatoryCourses}
                  nonMandatoryCourses={courseCompletionData.nonMandatoryCourses}
                />
              </Grid>
              <Grid item xs={12}>
                <CourseAchievement
                  mandatoryCourses={courseAchievementData.mandatoryCourses}
                  nonMandatoryCourses={courseAchievementData.nonMandatoryCourses}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Right Column: Course Allocation and Top Performers */}
          <Grid item xs={12} md={5}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <CourseAllocation
                  mandatory={courseAllocationData.mandatory}
                  nonMandatory={courseAllocationData.nonMandatory}
                  total={courseAllocationData.total}
                />
              </Grid>
              <Grid item xs={12}>
                <TopPerformers
                  categories={topPerformersData.categories}
                  usersData={topPerformersData.usersData}
                  dateOptions={topPerformersData.dateOptions}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Individual Progress Table */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <IndividualProgress data={individualProgressData} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ManagerDashboard;


