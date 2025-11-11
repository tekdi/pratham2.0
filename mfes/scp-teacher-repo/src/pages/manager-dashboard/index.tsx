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
import { fetchCourses, getCourseHierarchy, getHierarchy } from '../../services/PlayerService';
import { fetchUserCertificateStatus } from '../../services/TrackingService';
import { fetchUserList } from '../../services/ManageUser';


const ManagerDashboard = () => {
  // State for API data
  const [mandatoryCertificateData, setMandatoryCertificateData] = useState<any[]>([]);
  const [optionalCertificateData, setOptionalCertificateData] = useState<any[]>([]);
  const [courseDataLoading, setCourseDataLoading] = useState(true);
  console.log('mandatoryCertificateData', mandatoryCertificateData);
  
  // Store course identifiers for use in individual progress calculation
  const [mandatoryIdentifiers, setMandatoryIdentifiers] = useState<string[]>([]);
  const [optionalIdentifiers, setOptionalIdentifiers] = useState<string[]>([]);

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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Extract completed course IDs without storing in state
  useEffect(() => {
    // Check if arrays are not empty
    if (mandatoryCertificateData.length > 0 || optionalCertificateData.length > 0) {
      // Find completed course IDs from mandatory courses
      const completedMandatoryCourseIds = mandatoryCertificateData
        .filter(course => course.status === 'completed')
        .map(course => course.courseId);
      
      // Find completed course IDs from optional courses  
      const completedOptionalCourseIds = optionalCertificateData
        .filter(course => course.status === 'completed')
        .map(course => course.courseId);
      
      // Log the completed course IDs (since we're not storing them)
      console.log('Completed Mandatory Course IDs:', completedMandatoryCourseIds);
      console.log('Completed Optional Course IDs:', completedOptionalCourseIds);
      console.log('All Completed Course IDs:', [...completedMandatoryCourseIds, ...completedOptionalCourseIds]);

      // Call getHierarchy for each completed course ID
      const allCompletedCourseIds = [...completedMandatoryCourseIds, ...completedOptionalCourseIds];
      allCompletedCourseIds.forEach(async (courseId) => {
        try {
          const hierarchyResponse = await getCourseHierarchy(courseId);
          console.log(`Hierarchy response for course ${courseId}:`, hierarchyResponse);
        } catch (error) {
          console.error(`Error fetching hierarchy for course ${courseId}:`, error);
        }
      });

      

      
    }
  }, [mandatoryCertificateData, optionalCertificateData]);

  // Function to fetch individual progress data with pagination and search
  const fetchIndividualProgressData = async (page = 1, search = '', mandatoryIds: string[] = [], optionalIds: string[] = []) => {
    try {
      const managerUserId = localStorage.getItem('managrUserId');
      if (managerUserId) {
        const offset = (page - 1) * itemsPerPage;
        
        // Build filters object
        const filters: any = {
          emp_manager: managerUserId
        };
        
        // Add name filter if search query exists
        if (search.trim()) {
          filters.name = search.trim();
        }
        
        const apiResponse = await fetchUserList({
          limit: itemsPerPage,
          offset: offset,
          filters: filters,
        });
        
        console.log('individualProgressData', apiResponse?.getUserDetails);
        console.log('totalCount', apiResponse?.totalCount);
        const currentEmployeeIds = apiResponse?.getUserDetails?.map((item: any) => item.userId);
        
        // Fetch certificate status for current employees if course identifiers are available
        let userMandatoryCertificateStatus = { data: [] };
        let userOptionalCertificateStatus = { data: [] };
        // Use parameters if provided, otherwise fall back to state
        const activeMandatoryIds = mandatoryIds.length > 0 ? mandatoryIds : mandatoryIdentifiers;
        const activeOptionalIds = optionalIds.length > 0 ? optionalIds : optionalIdentifiers;
        
        console.log('activeMandatoryIds', activeMandatoryIds);
        console.log('activeOptionalIds', activeOptionalIds);
        console.log('currentEmployeeIds', currentEmployeeIds);
        
        if (activeMandatoryIds.length > 0 && activeOptionalIds.length > 0 && currentEmployeeIds.length > 0) {
          try {
            [userMandatoryCertificateStatus, userOptionalCertificateStatus] = await Promise.all([
              fetchUserCertificateStatus(currentEmployeeIds, activeMandatoryIds),
              fetchUserCertificateStatus(currentEmployeeIds, activeOptionalIds)
            ]);
            console.log('Individual Progress - userMandatoryCertificateStatus', userMandatoryCertificateStatus);
            console.log('Individual Progress - userOptionalCertificateStatus', userOptionalCertificateStatus);
          } catch (error) {
            console.error('Error fetching certificate status for individual progress:', error);
          }
        }

        // Process certificate status data for easier lookup
        const mandatoryStatusMap = new Map();
        const optionalStatusMap = new Map();

        // Process mandatory certificate status
        userMandatoryCertificateStatus.data?.forEach((item: any) => {
          if (!mandatoryStatusMap.has(item.userId)) {
            mandatoryStatusMap.set(item.userId, {
              completed: 0,
              inProgress: 0,
              notStarted: 0,
              total: 0,
              completedIdentifiers: [],
              inProgressIdentifiers: [],
              notStartedIdentifiers: []
            });
          }
          
          const userStats = mandatoryStatusMap.get(item.userId);
          userStats.total++;
          
          if (item.status === "viewCertificate" || item.status === "completed") {
            userStats.completed++;
            userStats.completedIdentifiers.push(item.courseId);
          } else if (item.status === "inprogress") {
            userStats.inProgress++;
            userStats.inProgressIdentifiers.push(item.courseId);
          } else if (item.status === "enrolled") {
            userStats.notStarted++;
            userStats.notStartedIdentifiers.push(item.courseId);
          }
        });

        // Process optional certificate status
        userOptionalCertificateStatus.data?.forEach((item: any) => {
          if (!optionalStatusMap.has(item.userId)) {
            optionalStatusMap.set(item.userId, {
              completed: 0,
              inProgress: 0,
              notStarted: 0,
              total: 0,
              completedIdentifiers: [],
              inProgressIdentifiers: [],
              notStartedIdentifiers: []
            });
          }
          
          const userStats = optionalStatusMap.get(item.userId);
          userStats.total++;
          
          if (item.status === "viewCertificate" || item.status === "completed") {
            userStats.completed++;
            userStats.completedIdentifiers.push(item.courseId);
          } else if (item.status === "inprogress") {
            userStats.inProgress++;
            userStats.inProgressIdentifiers.push(item.courseId);
          } else if (item.status === "enrolled") {
            userStats.notStarted++;
            userStats.notStartedIdentifiers.push(item.courseId);
          }
        });
        
        // Transform API data to EmployeeProgress format with calculated progress
        const transformedProgressData: EmployeeProgress[] = apiResponse?.getUserDetails?.map((user: any) => {
          const mandatoryStats = mandatoryStatusMap.get(user.userId) || { 
            completed: 0, 
            inProgress: 0, 
            notStarted: 0, 
            total: 0,
            completedIdentifiers: [],
            inProgressIdentifiers: [],
            notStartedIdentifiers: []
          };
          const optionalStats = optionalStatusMap.get(user.userId) || { 
            completed: 0, 
            inProgress: 0, 
            notStarted: 0, 
            total: 0,
            completedIdentifiers: [],
            inProgressIdentifiers: [],
            notStartedIdentifiers: []
          };
          
          // Calculate not started courses = courses with "enrolled" status + courses not in API response
          const mandatoryNotStarted = mandatoryStats.notStarted + Math.max(0, activeMandatoryIds.length - mandatoryStats.total);
          const optionalNotStarted = optionalStats.notStarted + Math.max(0, activeOptionalIds.length - optionalStats.total);
          
          return {
            id: user.userId,
            name: user.name || `${user.firstName} ${user.lastName}`.trim(),
            role: user.role,
            department: '', // Remove department as requested
            mandatoryCourses: {
              completed: mandatoryStats.completed,
              inProgress: mandatoryStats.inProgress, 
              notStarted: mandatoryNotStarted,
              total: activeMandatoryIds.length // Total available mandatory courses
            },
            nonMandatoryCourses: {
              completed: optionalStats.completed,
              inProgress: optionalStats.inProgress,
              notStarted: optionalNotStarted, 
              total: activeOptionalIds.length // Total available optional courses
            },
            // Add the requested course identifiers
            mandatoryInProgressIdentifiers: mandatoryStats.inProgressIdentifiers || [],
            optionalInProgressIdentifiers: optionalStats.inProgressIdentifiers || [],
            mandatoryCompletedIdentifiers: mandatoryStats.completedIdentifiers || [],
            optionalCompletedIdentifiers: optionalStats.completedIdentifiers || []
          };
        }) || [];

        
        console.log('transformedProgressData with calculated progress', transformedProgressData);
        setIndividualProgressData(transformedProgressData);
        setTotalEmployees(apiResponse?.totalCount || 0);
        setTotalPages(Math.ceil((apiResponse?.totalCount || 0) / itemsPerPage));
      } else {
        console.warn('No manager user ID found in localStorage');
        setIndividualProgressData([]);
        setTotalEmployees(0);
        setTotalPages(0);
      }
    } catch (error) {
      console.error('Error fetching individual progress data:', error);
      setIndividualProgressData([]);
      setTotalEmployees(0);
      setTotalPages(0);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchIndividualProgressData(page, searchQuery, mandatoryIdentifiers, optionalIdentifiers);
  };

  // Handle search - reset to page 1 when search changes
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page
    fetchIndividualProgressData(1, query, mandatoryIdentifiers, optionalIdentifiers); // Fetch with search and page 1
  };

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Variables to store employee user IDs and course identifiers for use across try blocks
      let employeeUserIds: string[] = [];
      let mandatoryIds: string[] = [];
      let optionalIds: string[] = [];
    

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
        mandatoryIds = mandatoryCourses.map((item: any) => item.identifier);
        optionalIds = optionalCourses.map((item: any) => item.identifier);
        
        // Store identifiers in state for use in individual progress calculation
        setMandatoryIdentifiers(mandatoryIds);
        setOptionalIdentifiers(optionalIds);
        
        // Store course IDs in localStorage for use in employee-details page
        localStorage.setItem('mandatoryCourseIds', JSON.stringify(mandatoryIds));
        localStorage.setItem('optionalCourseIds', JSON.stringify(optionalIds));
        const userId = localStorage.getItem('managrUserId');
        let employeeDataResponse: any = [];
        if(userId) {
           employeeDataResponse = await fetchUserList({
           
            filters: {emp_manager:userId},
          });
          console.log('employeeDataResponse', employeeDataResponse);
           employeeUserIds = employeeDataResponse?.getUserDetails?.map((item: any) => item.userId);
        }
        console.log('employeeUserIds', employeeUserIds);
        // Check if tenantId is available before calling certificate status APIs
        const tenantId = localStorage.getItem('tenantId');
        let userMandatoryCertificateStatus = { data: [] };
        let userOptionalCertificateStatus = { data: [] };
        
        if (tenantId) {
          userMandatoryCertificateStatus = await fetchUserCertificateStatus(employeeUserIds, mandatoryIds);
          userOptionalCertificateStatus = await fetchUserCertificateStatus(employeeUserIds, optionalIds);
          console.log('userMandatoryCertificateStatus', userMandatoryCertificateStatus);
        } else {
          console.warn('TenantId not found in localStorage, skipping certificate status API calls');
        }

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


      try {
        // Fetch assessment/question sets data
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
      
        // Check if tenantId is available before calling assessment status API
        const tenantId = localStorage.getItem('tenantId');
        if ( employeeUserIds.length > 0) {
          // TODO: Implement assessment status tracking
          // const userDataAssessmentStatus = await getAssessmentStatus({
          //   userId: employeeUserIds,
          //   contentId: questionSetIdentifiers
          // });
          // console.log('userDataAssessmentStatus', userDataAssessmentStatus);
        } else {
          console.warn('TenantId not found in localStorage, skipping assessment status API call');
        }
      } catch (error) {
        console.error('Error fetching course achievement data:', error);
      }

      // Set all data
      setCourseAchievementData(dummyCourseAchievementData);
      setTopPerformersData(dummyTopPerformersData);
      
      // Fetch individual progress data with pagination - pass the course identifiers
      fetchIndividualProgressData(1, '', mandatoryIds || [], optionalIds || []);
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
          <Grid item xs={12} sx={{ mt: 2, mb: 2 }}>
            <IndividualProgress 
              data={individualProgressData}
              currentPage={currentPage}
              totalPages={totalPages}
              totalEmployees={totalEmployees}
              onPageChange={handlePageChange}
              onSearch={handleSearch}
            />
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


