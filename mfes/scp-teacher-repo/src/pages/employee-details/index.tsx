import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Stack,
  Grid,
  Tabs,
  Tab,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/router';
import ContactInformation from '../../components/EmployeeDetails/ContactInformation';
import { CourseCompletion } from '../../components/ManagerDashboard';
import ExpandableCourseSection from '../../components/EmployeeDetails/ExpandableCourseSection';
import { EmployeeDetailsData } from '../../components/EmployeeDetails/types';
import Header from '../../components/Header';
import { fetchUserCertificateStatus } from '../../services/TrackingService';
import { getUserDetails } from '../../services/ProfileService';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getData } from '@shared-lib-v2/utils/DataClient';
import { fetchCourses } from '../../services/PlayerService';

interface CourseStatus {
  userId: string;
  courseId: string;
  status: 'completed' | 'inprogress';
}

interface UserData {
  name: string;
  email: string;
  phone: string;
  employeeId?: string;
  firstName?: string;
  lastName?: string;
}

const EmployeeDetailsPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [employeeData, setEmployeeData] = useState<EmployeeDetailsData | null>(null);
  
  // State for real user data from API
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userDataLoading, setUserDataLoading] = useState(true);
  
  // State for API data - similar to manager-dashboard
  const [mandatoryCertificateData, setMandatoryCertificateData] = useState<CourseStatus[]>([]);
  const [optionalCertificateData, setOptionalCertificateData] = useState<CourseStatus[]>([]);
  const [courseDataLoading, setCourseDataLoading] = useState(true);
  
  // Granular loading states for different sections
  const [courseDetailsLoading, setCourseDetailsLoading] = useState(true);
  const [contactInfoLoading, setContactInfoLoading] = useState(true);
  
  // State for storing retrieved course identifiers from IndexedDB
  const [mandatoryInProgressIdentifiers, setMandatoryInProgressIdentifiers] = useState<string[]>([]);
  const [optionalInProgressIdentifiers, setOptionalInProgressIdentifiers] = useState<string[]>([]);
  const [mandatoryCompletedIdentifiers, setMandatoryCompletedIdentifiers] = useState<string[]>([]);
  const [optionalCompletedIdentifiers, setOptionalCompletedIdentifiers] = useState<string[]>([]);
  
  // State for storing transformed course data
  const [transformedMandatoryInProgressCourses, setTransformedMandatoryInProgressCourses] = useState<any[]>([]);
  const [transformedMandatoryCompletedCourses, setTransformedMandatoryCompletedCourses] = useState<any[]>([]);
  const [transformedOptionalInProgressCourses, setTransformedOptionalInProgressCourses] = useState<any[]>([]);
  const [transformedOptionalCompletedCourses, setTransformedOptionalCompletedCourses] = useState<any[]>([]);
  

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      // Get userId from router query
      const userId = router.query.userId as string;
      
      if (!userId) {
        console.warn('No userId found in route query');
        setCourseDataLoading(false);
        setCourseDetailsLoading(false);
        setContactInfoLoading(false);
        return;
      }

      console.log('Fetching employee details for userId:', userId);

      // Retrieve course identifiers from IndexedDB
      try {
        const [
          storedMandatoryInProgress,
          storedOptionalInProgress,
          storedMandatoryCompleted,
          storedOptionalCompleted
        ] = await Promise.all([
          getData('mandatoryInProgressIdentifiers'),
          getData('optionalInProgressIdentifiers'),
          getData('mandatoryCompletedIdentifiers'),
          getData('optionalCompletedIdentifiers')
        ]);

        // Set retrieved identifiers to state
        setMandatoryInProgressIdentifiers(storedMandatoryInProgress || []);
        setOptionalInProgressIdentifiers(storedOptionalInProgress || []);
        setMandatoryCompletedIdentifiers(storedMandatoryCompleted || []);
        setOptionalCompletedIdentifiers(storedOptionalCompleted || []);

        console.log('Retrieved course identifiers from IndexedDB:');
        console.log('Mandatory In Progress:', storedMandatoryInProgress);
        console.log('Optional In Progress:', storedOptionalInProgress);
        console.log('Mandatory Completed:', storedMandatoryCompleted);
        console.log('Optional Completed:', storedOptionalCompleted);
        const IdentifierArray = [...storedMandatoryInProgress, ...storedOptionalInProgress, ...storedMandatoryCompleted, ...storedOptionalCompleted];
        const CoursesData = await fetchCourses({
          filters: {
            primaryCategory: ["Course"],
            status: ["live"],
            identifier: IdentifierArray,
          },
        });
        console.log('CoursesData', CoursesData);

        // Filter course data into 4 separate arrays based on identifiers and transform to expected format
        const mandatoryInProgressCourses = CoursesData
          .filter((course: any) => storedMandatoryInProgress?.includes(course.identifier))
          .map((course: any) => ({
            id: course.identifier,
            title: course.name,
            description: course.description,
            image: (course.appIcon) 
              ? course.appIcon 
              : '/scp-teacher-repo/images/image_ver.png'
          }));
        
        const optionalInProgressCourses = CoursesData
          .filter((course: any) => storedOptionalInProgress?.includes(course.identifier))
          .map((course: any) => ({
            id: course.identifier,
            title: course.name,
            description: course.description,
            image: (course.appIcon ) 
              ? course.appIcon 
              : '/scp-teacher-repo/images/image_ver.png'
          }));
        
        const mandatoryCompletedCourses = CoursesData
          .filter((course: any) => storedMandatoryCompleted?.includes(course.identifier))
          .map((course: any) => ({
            id: course.identifier,
            title: course.name,
            description: course.description,
            completedDate: null, // null as requested
            image: (course.appIcon ) 
              ? course.appIcon 
              : '/scp-teacher-repo/images/image_ver.png',
            certificateUrl: `https://example.com/certificate/${course.identifier}` // placeholder
          }));
        
        const optionalCompletedCourses = CoursesData
          .filter((course: any) => storedOptionalCompleted?.includes(course.identifier))
          .map((course: any) => ({
            id: course.identifier,
            title: course.name,
            description: course.description,
            completedDate: null, // null as requested
            image: (course.appIcon) 
              ? course.appIcon 
              : '/scp-teacher-repo/images/image_ver.png',
            certificateUrl: `https://example.com/certificate/${course.identifier}` // placeholder
          }));

        console.log('Filtered and Transformed Course Data:');
        console.log('Mandatory In Progress Courses:', mandatoryInProgressCourses);
        console.log('Optional In Progress Courses:', optionalInProgressCourses);
        console.log('Mandatory Completed Courses:', mandatoryCompletedCourses);
        console.log('Optional Completed Courses:', optionalCompletedCourses);

        // Store transformed course data in state
        setTransformedMandatoryInProgressCourses(mandatoryInProgressCourses);
        setTransformedMandatoryCompletedCourses(mandatoryCompletedCourses);
        setTransformedOptionalInProgressCourses(optionalInProgressCourses);
        setTransformedOptionalCompletedCourses(optionalCompletedCourses);
        setCourseDetailsLoading(false);
      } catch (error) {
        console.error('Error retrieving course identifiers from IndexedDB:', error);
        setCourseDetailsLoading(false);
      }

      // Fetch real user data from API
      try {
        const userResponse = await getUserDetails(userId, true);
        console.log('User details API response:', userResponse);
        
        if (userResponse?.result?.userData) {
          const user = userResponse.result.userData;
          const userInfo: UserData = {
            name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            email: user.email || '',
            phone: user.mobile || user.phone || '',
            employeeId: user.employeeId || user.userId || userId,
            firstName: user.firstName || '',
            lastName: user.lastName || ''
          };
          setUserData(userInfo);
        }
        setUserDataLoading(false);
        setContactInfoLoading(false);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setUserDataLoading(false);
        setContactInfoLoading(false);
      }

      try {
        // Get course IDs from localStorage (stored by manager-dashboard)
        const storedMandatoryIds = localStorage.getItem('mandatoryCourseIds');
        const storedOptionalIds = localStorage.getItem('optionalCourseIds');
        
        if (!storedMandatoryIds || !storedOptionalIds) {
          console.warn('Course IDs not found in localStorage. Please visit manager dashboard first.');
          setCourseDataLoading(false);
          setCourseDetailsLoading(false);
          return;
        }

        const mandatoryIds: string[] = JSON.parse(storedMandatoryIds);
        const optionalIds: string[] = JSON.parse(storedOptionalIds);
        
        console.log('Using stored mandatoryIds:', mandatoryIds);
        console.log('Using stored optionalIds:', optionalIds);

        // Check if tenantId is available before calling certificate status APIs
        const tenantId = localStorage.getItem('tenantId');
        let userMandatoryCertificateStatus = { data: [] };
        let userOptionalCertificateStatus = { data: [] };
        
        if (tenantId && mandatoryIds.length > 0 && optionalIds.length > 0) {
          [userMandatoryCertificateStatus, userOptionalCertificateStatus] = await Promise.all([
            fetchUserCertificateStatus([userId], mandatoryIds),
            fetchUserCertificateStatus([userId], optionalIds)
          ]);
          console.log('userMandatoryCertificateStatus', userMandatoryCertificateStatus);
          console.log('userOptionalCertificateStatus', userOptionalCertificateStatus);
        } else {
          console.warn('TenantId not found in localStorage, skipping certificate status API calls');
        }

        // Transform data to match CourseCompletion interface
        const filteredMandatory: CourseStatus[] = userMandatoryCertificateStatus.data
          .map((item: any) => {
            let finalStatus: 'completed' | 'inprogress' | null = null;

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
          .filter((item): item is CourseStatus => item !== null);

        const filteredOptional: CourseStatus[] = userOptionalCertificateStatus.data
          .map((item: any) => {
            let finalStatus: 'completed' | 'inprogress' | null = null;

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
          .filter((item): item is CourseStatus => item !== null);

        console.log('filteredMandatory', filteredMandatory);
        console.log('filteredOptional', filteredOptional);

        // Set the filtered data to state
        setMandatoryCertificateData(filteredMandatory);
        setOptionalCertificateData(filteredOptional);
        setCourseDataLoading(false);

      } catch (error) {
        console.error('Error fetching course data:', error);
        setCourseDataLoading(false);
        setCourseDetailsLoading(false);
      }

      // Keep dummy data for other employee details for now
      const dummyData: EmployeeDetailsData = {
        id: userId,
        name: userData?.name || 'Employee Name',
        email: userData?.email || 'email@example.com',
        phone: userData?.phone || 'Phone Number',
        employeeId: userData?.employeeId || userId,
        dateOfJoining: '28 Dec, 2020',
        jobType: 'Permanent',
        department: 'Teaching',
        reportingManager: 'Shreya Desai',
        courseCompletion: {
          mandatory: {
            completed: 20,
            inProgress: 32,
            overdue: 4,
          },
          nonMandatory: {
            completed: 20,
            inProgress: 32,
            overdue: 4,
          },
        },
        overdueCourses: [
          {
            id: '1',
            title: 'Safety Training Module',
            description: 'Workplace safety and emergency procedures',
            image: 'https://via.placeholder.com/300x180/f44336/ffffff?text=Overdue+Course',
          },
        ],
        ongoingCourses: transformedMandatoryInProgressCourses,
        completedCourses: transformedMandatoryCompletedCourses,
      };

      setEmployeeData(dummyData);
    };

    fetchEmployeeDetails();
  }, [router.query.userId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleBack = () => {
    router.back();
  };

  // Removed full-page loader to allow granular loading of individual components

  return (
    <>
    <Box>
        <Header />
      </Box>
      <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <IconButton onClick={handleBack} sx={{ backgroundColor: 'white' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" fontWeight={600}>
            {userDataLoading ? "Loading Employee..." : (userData?.name || "Employee Details")}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {/* <IconButton
            sx={{
              backgroundColor: '#e3f2fd',
              '&:hover': { backgroundColor: '#bbdefb' },
            }}
          >
            <AddIcon sx={{ color: '#1976d2' }} />
          </IconButton>
          <IconButton
            sx={{
              backgroundColor: '#fce4ec',
              '&:hover': { backgroundColor: '#f8bbd0' },
            }}
          >
            <AccessTimeIcon sx={{ color: '#c2185b' }} />
          </IconButton> */}
        </Stack>

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Left Column - Course Completion and Tabs */}
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              {/* Course Completion Charts */}
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

              {/* Tabs for Mandatory/Non-mandatory */}
              <Box sx={{ backgroundColor: 'white', borderRadius: 2, p: 2 }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  sx={{
                    borderBottom: 2,
                    borderColor: 'divider',
                    mb: 3,
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1rem',
                    },
                    '& .MuiTabs-indicator': {
                      backgroundColor: '#F4A012',
                      height: 3,
                    },
                  }}
                >
                  <Tab label="Mandatory Courses" />
                  <Tab label="Non-mandatory Courses" />
                </Tabs>

                {/* Tab Content */}
                {activeTab === 0 && (
                  <Stack spacing={2}>
                    {courseDetailsLoading ? (
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          minHeight: '200px',
                          p: 3
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">Loading Mandatory Course Details...</Typography>
                      </Box>
                    ) : (
                      <>
                        <ExpandableCourseSection
                          title="Ongoing Mandatory Courses"
                          count={transformedMandatoryInProgressCourses.length}
                          courses={transformedMandatoryInProgressCourses}
                          defaultExpanded={false}
                        />
                        
                        <ExpandableCourseSection
                          title="Completed Mandatory Courses"
                          count={transformedMandatoryCompletedCourses.length}
                          courses={transformedMandatoryCompletedCourses}
                          defaultExpanded={false}
                        />
                      </>
                    )}
                  </Stack>
                )}

                {activeTab === 1 && (
                  <Stack spacing={2}>
                    {courseDetailsLoading ? (
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          minHeight: '200px',
                          p: 3
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">Loading Optional Course Details...</Typography>
                      </Box>
                    ) : (
                      <>
                        <ExpandableCourseSection
                          title="Ongoing Optional Courses"
                          count={transformedOptionalInProgressCourses.length}
                          courses={transformedOptionalInProgressCourses}
                          defaultExpanded={false}
                        />
                        
                        <ExpandableCourseSection
                          title="Completed Optional Courses"
                          count={transformedOptionalCompletedCourses.length}
                          courses={transformedOptionalCompletedCourses}
                          defaultExpanded={false}
                        />
                      </>
                    )}
                  </Stack>
                )}
              </Box>
            </Stack>
          </Grid>

          {/* Right Column - Contact Information and Learner Details */}
          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              {contactInfoLoading ? (
                <Box 
                  sx={{ 
                    backgroundColor: 'white', 
                    borderRadius: 2, 
                    p: 2,
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    minHeight: '120px'
                  }}
                >
                  <Typography variant="body2" color="text.secondary">Loading Contact Information...</Typography>
                </Box>
              ) : (
                <ContactInformation
                  email={userData?.email || ""}
                  phone={userData?.phone || ""}
                />
              )}
              
              {/* Course Identifiers from IndexedDB */}
              {/* <Box sx={{ backgroundColor: 'white', borderRadius: 2, p: 2 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Course Status Details
                </Typography>
                
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} color="primary">
                      Mandatory In Progress ({mandatoryInProgressIdentifiers.length})
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      {mandatoryInProgressIdentifiers.length > 0 
                        ? mandatoryInProgressIdentifiers.join(', ') 
                        : 'No courses in progress'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} color="success.main">
                      Mandatory Completed ({mandatoryCompletedIdentifiers.length})
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      {mandatoryCompletedIdentifiers.length > 0 
                        ? mandatoryCompletedIdentifiers.join(', ') 
                        : 'No courses completed'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} color="primary">
                      Optional In Progress ({optionalInProgressIdentifiers.length})
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      {optionalInProgressIdentifiers.length > 0 
                        ? optionalInProgressIdentifiers.join(', ') 
                        : 'No courses in progress'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} color="success.main">
                      Optional Completed ({optionalCompletedIdentifiers.length})
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      {optionalCompletedIdentifiers.length > 0 
                        ? optionalCompletedIdentifiers.join(', ') 
                        : 'No courses completed'}
                    </Typography>
                  </Box>
                </Stack>
              </Box> */}
              
              {/* <LearnerDetails
                employeeId={employeeData.employeeId}
                dateOfJoining={employeeData.dateOfJoining}
                jobType={employeeData.jobType}
                department={employeeData.department}
                reportingManager={employeeData.reportingManager}
              /> */}
            </Stack>
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
export default EmployeeDetailsPage;
