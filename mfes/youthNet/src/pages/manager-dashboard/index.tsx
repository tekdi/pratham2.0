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
import { fetchCourses, getCourseHierarchy } from '../../services/PlayerService';
import { fetchUserCertificateStatus } from '../../services/TrackingService';
import { fetchUserList } from '../../services/ManageUser';
import { getAssessmentStatus } from '../../services/AssesmentService';


const ManagerDashboard = () => {
  // State for API data
  const [mandatoryCertificateData, setMandatoryCertificateData] = useState<any[]>([]);
  const [optionalCertificateData, setOptionalCertificateData] = useState<any[]>([]);
  const [courseDataLoading, setCourseDataLoading] = useState(true);
  console.log('mandatoryCertificateData', mandatoryCertificateData);
  
  // Store course identifiers for use in individual progress calculation
  const [mandatoryIdentifiers, setMandatoryIdentifiers] = useState<string[]>([]);
  const [optionalIdentifiers, setOptionalIdentifiers] = useState<string[]>([]);
  const[employeeUserIds, setEmployeeUserIds] = useState<string[]>([]);
const [employeeDataResponse, setEmployeeDataResponse] = useState<any[]>([]);
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
    usersData: { [key: string]: User[] };
  }>({
    usersData: {},
  });

  const [individualProgressData, setIndividualProgressData] = useState<EmployeeProgress[]>([]);

  const [totalEmployees, setTotalEmployees] = useState(0);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Function to find top 5 performers from assessment data
  const findTopPerformers = (assessmentData: any[]): string[] => {
    const userPerformance: { userId: string; avgPercentage: number }[] = [];
    
    assessmentData.forEach((user) => {
      // Check if user has assessments array
      if (user.userId && user.assessments && Array.isArray(user.assessments) && user.assessments.length > 0) {
        // Calculate average percentage for this user across all assessments
        const totalPercentage = user.assessments.reduce((sum: number, assessment: any) => {
          return sum + (assessment.percentage || 0);
        }, 0);
        
        const avgPercentage = totalPercentage / user.assessments.length;
        
        userPerformance.push({
          userId: user.userId,
          avgPercentage: avgPercentage
        });
      }
    });
    
    // Sort by average percentage in descending order and get top 5
    const top5Performers = userPerformance
      .sort((a, b) => b.avgPercentage - a.avgPercentage)
      .slice(0, 5)
      .map(performer => performer.userId);
    
    console.log('User Performance Data:', userPerformance);
    console.log('Top 5 Performers (UserIds):', top5Performers);
    
    return top5Performers;
  };

  // Function to extract structured data with courseId, unitIds, and contentIds
  const extractStructuredCourseData = (courseId: string, hierarchyChildren: any[]) => {
    const courseData = {
      courseId: courseId,
      units: [] as Array<{unitId: string, contentIds: string[]}>
    };
    
    // Function to recursively find Practice Question Sets within children
    const findPracticeQuestionSets = (children: any[]): string[] => {
      const contentIds: string[] = [];
      children?.forEach((child) => {
        if (child.primaryCategory === "Practice Question Set") {
          contentIds.push(child.identifier);
        } else if (child.children && child.children.length > 0) {
          // Recursively search deeper levels
          const nestedContentIds = findPracticeQuestionSets(child.children);
          contentIds.push(...nestedContentIds);
        }
      });
      return contentIds;
    };
    
    // Look for Course Units in the hierarchy
    const processCourseUnits = (objects: any[]) => {
      objects?.forEach((obj) => {
        if (obj.primaryCategory === "Course Unit") {
          // Found a Course Unit, get its contentIds
          const contentIds = findPracticeQuestionSets(obj.children || []);
          courseData.units.push({
            unitId: obj.identifier,
            contentIds: contentIds
          });
        } else if (obj.children && obj.children.length > 0) {
          // Continue searching for Course Units in children
          processCourseUnits(obj.children);
        }
      });
    };
    
    processCourseUnits(hierarchyChildren);
    return courseData;
  };

  // Extract completed course IDs without storing in state
  useEffect(() => {
    // Check if arrays are not empty
    if ((mandatoryCertificateData.length > 0 || optionalCertificateData.length > 0) && employeeUserIds.length > 0 && employeeDataResponse.length > 0) {
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
      console.log('All Completed Course IDs (with duplicates):', [...completedMandatoryCourseIds, ...completedOptionalCourseIds]);

      // Call getCourseHierarchy for each completed course ID and extract structured data
      // Remove duplicate course IDs using Set and Array.from
      const allCompletedCourseIds = Array.from(new Set([...completedMandatoryCourseIds, ...completedOptionalCourseIds]));
      console.log('Unique Completed Course IDs (duplicates removed):', allCompletedCourseIds);
      
      // Collect structured course data from all completed courses
      const getAllStructuredCourseData = async () => {
        const allStructuredData: Array<{courseId: string, units: Array<{unitId: string, contentIds: string[]}> }> = [];
        
        const promises = allCompletedCourseIds.map(async (courseId) => {
          try {
            const hierarchyResponse = await getCourseHierarchy(courseId);
            console.log(`Hierarchy response for course ${courseId}:`, hierarchyResponse?.children);
            
            // Extract structured data (courseId, unitIds, contentIds)
            const structuredData = extractStructuredCourseData(courseId, hierarchyResponse?.children || []);
            console.log(`Structured data for course ${courseId}:`, structuredData);
            
            return structuredData;
          } catch (error) {
            console.error(`Error fetching hierarchy for course ${courseId}:`, error);
            return { courseId: courseId, units: [] };
          }
        });
        
        const allResults = await Promise.all(promises);
        allStructuredData.push(...allResults);
        
        console.log('All structured course data from completed courses:', allStructuredData);
        
        // Extract all unit IDs from structured data
        const allUnitIds = allStructuredData.flatMap(course => 
          course.units.map(unit => unit.unitId)
        );
        
        // Extract all content IDs from structured data
        const allContentIds = allStructuredData.flatMap(course => 
          course.units.flatMap(unit => unit.contentIds)
        );
        
        console.log('All Unit IDs extracted:', allUnitIds);
        console.log('All Content IDs extracted:', allContentIds);
        
        const assessmentdata = await getAssessmentStatus({
          userId: employeeUserIds,
          contentId: allContentIds,
          courseId: allCompletedCourseIds,
          unitId: allUnitIds,
        });
        
        console.log('Assessment tracking data:', assessmentdata);
        
        // Find top 5 performers from assessment data
        const topPerformerUserIds = findTopPerformers(assessmentdata?.data || assessmentdata || []);
        console.log('topPerformerUserIds', topPerformerUserIds);
        console.log('employeeDataResponse', employeeDataResponse);
        
        // Filter employee data by top performer user IDs
        const topPerformerEmployees = employeeDataResponse.filter((employee: any) => 
          topPerformerUserIds.includes(employee.userId)
        );
        
        // Create TopPerformers data structure
        const topPerformersDataStructure = {
          usersData: {
            '5 Highest Course Completing Users': topPerformerEmployees.map((employee: any) => ({
              id: employee.userId,
              name: employee.name || `${employee.firstName} ${employee.lastName}`.trim(),
              role: 'Learner'
            }))
          }
        };
        
        console.log('topPerformerEmployees', topPerformerEmployees);
        console.log('topPerformersDataStructure', topPerformersDataStructure);
        
        // Set the top performers data
        setTopPerformersData(topPerformersDataStructure);
        
        return { allStructuredData, topPerformerUserIds };
      };
      
      // Call the function to get all structured course data and top performers
      getAllStructuredCourseData().then((result) => {
        console.log('Final Result:', result);
        console.log('Top 5 Performer User IDs:', result?.topPerformerUserIds);
      }).catch((error) => {
        console.error('Error processing structured course data:', error);
      });

      

      
    }
  }, [mandatoryCertificateData, optionalCertificateData, employeeUserIds, employeeDataResponse]);

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
          setEmployeeDataResponse(employeeDataResponse?.getUserDetails || []);
           employeeUserIds = employeeDataResponse?.getUserDetails?.map((item: any) => item.userId);
           setEmployeeUserIds(employeeUserIds);
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
            status: ["Live"],
            primaryCategory: ["Practice Question Set"],
            channel: "pragyanpath",
            program: ["Pragyanpath"],
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
     // setCourseAchievementData(dummyCourseAchievementData);
      
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
                  usersData={topPerformersData.usersData}
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

