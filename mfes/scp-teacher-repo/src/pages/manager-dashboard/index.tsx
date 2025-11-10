import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import {
  CourseCompletion,
  CourseAllocation,
  CourseAchievement,
  TopPerformers,
  IndividualProgress,
  AchievementData,
  User,
  EmployeeProgress,
} from '../../components/ManagerDashboard';
import Header from '../../components/Header';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { fetchCourses } from '../../services/PlayerService';
import { fetchUserCertificateStatus } from '../../services/TrackingService';
import { getAssessmentStatus } from '../../services/AssesmentService';


const ManagerDashboard = () => {
  // State for API data
  const [mandatoryCertificateData, setMandatoryCertificateData] = useState<any[]>([]);
  const [optionalCertificateData, setOptionalCertificateData] = useState<any[]>([]);
  const [courseDataLoading, setCourseDataLoading] = useState(true);

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

  const [totalEmployees, setTotalEmployees] = useState(0);

  // Simulate API call with dummy data
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Simulate API delay for non-course data
    //  await new Promise((resolve) => setTimeout(resolve, 1000));

      // Dummy data - Replace this with actual API calls
    

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
const employeeData =[{
  id: '47b46af0-6447-4348-bef9-7cf12c67b22a',
  name: 'Rahul Somshekhar',
  role: 'Facilitator',
  department: 'Teaching',
  // mandatoryCourses: { completed: 3, inProgress: 8, overdue: 2, total: 15 },
  // nonMandatoryCourses: { completed: 5, inProgress: 3, notEnrolled: 8, total: 20 },

},
]

      try {
        const mandatoryCourses = await fetchCourses({
          filters: {
            primaryCategory: ["Course"],
            courseType: ["Mandatory"],
            status: ["live"],
            channel: "pragyanpath",
          },
        });

        const optionalCourses = await fetchCourses({
          filters: {
            primaryCategory: ["Course"],
            courseType: ["Optional"],
            status: ["live"],
            channel: "pragyanpath",
          },
        });

        const CourseAllocationData = {
          mandatory: mandatoryCourses.length,
          nonMandatory: optionalCourses.length,
          total: mandatoryCourses.length + optionalCourses.length,
        };

        console.log('mandatoryCourses', mandatoryCourses);
        const mandatoryIdentifiers = mandatoryCourses.map((item: any) => item.identifier);
        const optionalIdentifiers = optionalCourses.map((item: any) => item.identifier);
        const employeeUserIds = employeeData.map((item: any) => item.id);
        
        const userMandatoryCertificateStatus = await fetchUserCertificateStatus(employeeUserIds, mandatoryIdentifiers);
        const userOptionalCertificateStatus = await fetchUserCertificateStatus(employeeUserIds, optionalIdentifiers);
                console.log('userMandatoryCertificateStatus', userMandatoryCertificateStatus);

        const filteredMandatory = userMandatoryCertificateStatus.data
          .map((item: any) => {
            let finalStatus = null;

            if (item.status === "viewCertificate" || item.status === "completed") {
              finalStatus = "completed";
            } else if (item.status === "inprogress") {
              finalStatus = "inprogress";
            }

            return finalStatus
              ? {
                  userId: item.userId,
                  courseId: item.courseId,
                  status: finalStatus
                }
              : null;
          })
          .filter(Boolean);

        console.log('filteredMandatory', filteredMandatory);

        const filteredOptional = userOptionalCertificateStatus.data
          .map((item: any) => {
            let finalStatus = null;

            if (item.status === "viewCertificate" || item.status === "completed") {
              finalStatus = "completed";
            } else if (item.status === "inprogress") {
              finalStatus = "inprogress";
            }

            return finalStatus
              ? {
                  userId: item.userId,
                  courseId: item.courseId,
                  status: finalStatus
                }
              : null;
          })
          .filter(Boolean);

        console.log('filteredOptional', filteredOptional);

        // Set the filtered data to state
        setCourseAllocationData(CourseAllocationData);
        setMandatoryCertificateData(filteredMandatory);
        setOptionalCertificateData(filteredOptional);
        setCourseDataLoading(false);

      } catch (error) {
        console.error('Error fetching course data:', error);
        setCourseDataLoading(false);
      }

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

      try{
      //  const courseAchievementData = await fetchCourseAchievementData();
      const questionSets = await fetchCourses({
        filters: {
          status: [
            "Live"
        ],
        primaryCategory: [
            "Practice Question Set"
        ],
        channel: "pragyanpath",
        program: [
            "Pragyanpath"
            ],
            courseType: ["Mandatory"]

        },
      });
      const questionSetIdentifiers = questionSets.map((item: any) => item.identifier);
      console.log('questionSets', questionSetIdentifiers);
      const userDataAssessmentStatus = await getAssessmentStatus({
        userId: employeeData.map((item: any) => item.id),
       
        contentId: questionSetIdentifiers
      });
      console.log('userDataAssessmentStatus', userDataAssessmentStatus);
      } catch (error) {
        console.error('Error fetching course achievement data:', error);
      }

      // Set all data
      setCourseAchievementData(dummyCourseAchievementData);
      setTopPerformersData(dummyTopPerformersData);
      setIndividualProgressData(dummyIndividualProgressData);
      setTotalEmployees(56);
    };

    fetchDashboardData();
  }, []);

  return (
    <>
    <Box>
        <Header />
      </Box>
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
                {courseDataLoading ? (
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      minHeight: '300px',
                      border: '1px solid #e0e0e0',
                      borderRadius: 2,
                      backgroundColor: 'white'
                    }}
                  >
                    <Typography variant="h6">Loading Course Completion Data...</Typography>
                  </Box>
                ) : (
                  <CourseCompletion
                    mandatoryCourses={mandatoryCertificateData}
                    nonMandatoryCourses={optionalCertificateData}
                  />
                )}
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
                {courseDataLoading ? (
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      minHeight: '200px',
                      border: '1px solid #e0e0e0',
                      borderRadius: 2,
                      backgroundColor: 'white'
                    }}
                  >
                    <Typography variant="h6">Loading Course Allocation Data...</Typography>
                  </Box>
                ) : (
                  <CourseAllocation
                    mandatory={courseAllocationData.mandatory}
                    nonMandatory={courseAllocationData.nonMandatory}
                    total={courseAllocationData.total}
                  />
                )}
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
    </>
  );
};
export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
export default ManagerDashboard;


