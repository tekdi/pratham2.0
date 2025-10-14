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
import AddIcon from '@mui/icons-material/Add';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useRouter } from 'next/router';
import ContactInformation from '../../components/EmployeeDetails/ContactInformation';
import LearnerDetails from '../../components/EmployeeDetails/LearnerDetails';
import CourseCompletionDetail from '../../components/EmployeeDetails/CourseCompletionDetail';
import ExpandableCourseSection from '../../components/EmployeeDetails/ExpandableCourseSection';
import { EmployeeDetailsData } from '../../components/EmployeeDetails/types';

const EmployeeDetailsPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [employeeData, setEmployeeData] = useState<EmployeeDetailsData | null>(null);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const dummyData: EmployeeDetailsData = {
        id: '1',
        name: 'Rahul Somshekhar',
        email: 'arun_deshpande2000@email.com',
        phone: '7830301312',
        employeeId: '1423',
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
        ongoingCourses: [
          {
            id: '2',
            title: 'Advanced Teaching Methods',
            description: 'Modern pedagogical approaches and techniques',
            image: 'https://via.placeholder.com/300x180/2196f3/ffffff?text=Ongoing+Course+1',
          },
          {
            id: '3',
            title: 'Digital Literacy Program',
            description: 'Technology integration in education',
            image: 'https://via.placeholder.com/300x180/2196f3/ffffff?text=Ongoing+Course+2',
          },
          {
            id: '4',
            title: 'Student Psychology',
            description: 'Understanding student behavior and motivation',
            image: 'https://via.placeholder.com/300x180/2196f3/ffffff?text=Ongoing+Course+3',
          },
        ],
        completedCourses: [
          {
            id: '5',
            title: 'Critical Thinking for Decision Making',
            description: 'Description: Lorem ipsum dolor sit amet, consectetur dipiscing...',
            completedDate: '15 Mar, 2025',
            image: 'https://via.placeholder.com/300x180/4caf50/ffffff?text=Completed+Course+1',
            certificateUrl: 'https://example.com/certificate/5',
          },
          {
            id: '6',
            title: 'Effective Communication',
            description: 'Description: Lorem ipsum dolor sit amet, consectetur dipiscing...',
            completedDate: '5 Jan, 2025',
            image: 'https://via.placeholder.com/300x180/4caf50/ffffff?text=Completed+Course+2',
            certificateUrl: 'https://example.com/certificate/6',
          },
        ],
      };

      setEmployeeData(dummyData);
    };

    fetchEmployeeDetails();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleBack = () => {
    router.back();
  };

  if (!employeeData) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Typography variant="h6">Loading Employee Details...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <IconButton onClick={handleBack} sx={{ backgroundColor: 'white' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" fontWeight={600}>
            {employeeData.name}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
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
          </IconButton>
        </Stack>

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Left Column - Course Completion and Tabs */}
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              {/* Course Completion Charts */}
              <CourseCompletionDetail
                mandatory={employeeData.courseCompletion.mandatory}
                nonMandatory={employeeData.courseCompletion.nonMandatory}
              />

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
                    <ExpandableCourseSection
                      title="Overdue Courses"
                      count={employeeData.overdueCourses.length}
                      courses={employeeData.overdueCourses}
                      defaultExpanded={true}
                    />
                    
                    <ExpandableCourseSection
                      title="Ongoing Courses"
                      count={employeeData.ongoingCourses.length}
                      courses={employeeData.ongoingCourses}
                      defaultExpanded={false}
                    />
                    
                    <ExpandableCourseSection
                      title="Completed Courses"
                      count={employeeData.completedCourses.length}
                      courses={employeeData.completedCourses}
                      defaultExpanded={false}
                    />
                  </Stack>
                )}

                {activeTab === 1 && (
                  <Stack spacing={2}>
                    <Typography variant="body2" color="text.secondary">
                      Non-mandatory courses content will be displayed here.
                    </Typography>
                  </Stack>
                )}
              </Box>
            </Stack>
          </Grid>

          {/* Right Column - Contact Information and Learner Details */}
          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              <ContactInformation
                email={employeeData.email}
                phone={employeeData.phone}
              />
              <LearnerDetails
                employeeId={employeeData.employeeId}
                dateOfJoining={employeeData.dateOfJoining}
                jobType={employeeData.jobType}
                department={employeeData.department}
                reportingManager={employeeData.reportingManager}
              />
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default EmployeeDetailsPage;
