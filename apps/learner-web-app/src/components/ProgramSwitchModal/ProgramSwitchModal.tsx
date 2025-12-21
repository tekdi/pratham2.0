'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Link, Divider, Popover } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {
  getUserDetails,
  profileComplitionCheck,
} from '@learner/utils/API/userService';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@shared-lib';
import { getAcademicYear } from '@learner/utils/API/AcademicYearService';
import { TenantName } from '@learner/utils/app.constant';

interface TenantData {
  tenantId: string;
  tenantName: string;
  templateId?: string;
  channelId?: string;
  collectionFramework?: string;
  roles?: Array<{ roleName: string; roleId: string }>;
  createdAt?: string;
  createdOn?: string;
  enrolledAt?: string;
  enrollmentDate?: string;
  params?: {
    uiConfig?: {
      landingPage?: string;
      [key: string]: any;
    };
    [key: string]: any;
  };
}

interface ProgramSwitchModalProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onSignOut: () => void;
}

const ProgramSwitchModal: React.FC<ProgramSwitchModalProps> = ({
  open,
  anchorEl,
  onClose,
  onSignOut,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [enrolledPrograms, setEnrolledPrograms] = useState<TenantData[]>([]);
  const [currentProgram, setCurrentProgram] = useState<TenantData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledPrograms = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('userId');
        const currentTenantId = localStorage.getItem('tenantId');
        const currentProgramName = localStorage.getItem('userProgram');

        if (!userId) {
          setLoading(false);
          return;
        }

        const userResponse = await getUserDetails(userId, true);
        const tenantData = userResponse?.result?.userData?.tenantData || [];

        // Find current program
        const current =
          tenantData.find(
            (tenant: TenantData) => tenant.tenantId === currentTenantId
          ) ||
          tenantData.find(
            (tenant: TenantData) => tenant.tenantName === currentProgramName
          );

        setCurrentProgram(current || null);

        // Get other enrolled programs (excluding current)
        const otherPrograms = tenantData.filter(
          (tenant: TenantData) => tenant.tenantId !== currentTenantId
        );

        setEnrolledPrograms(otherPrograms);
      } catch (error) {
        console.error('Failed to fetch enrolled programs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchEnrolledPrograms();
    }
  }, [open]);

  const handleProgramSwitch = async (program: TenantData) => {
    try {
      localStorage.removeItem('learnerCourseFilters');

      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      if (!userId || !token) {
        console.error('Missing userId or token');
        return;
      }

      // Get user details to get full tenant data with all fields
      const userResponse = await getUserDetails(userId, true);
      const userData = userResponse?.result?.userData;
      const tenantData = userData?.tenantData?.find(
        (tenant: TenantData) => tenant.tenantId === program.tenantId
      );

      if (!tenantData) {
        console.error('Tenant data not found for this program');
        return;
      }

      // Set all localStorage values for the selected program (same as handleAccessProgram)
      localStorage.setItem('userId', userId);
      if (tenantData.templateId) {
        localStorage.setItem('templtateId', tenantData.templateId);
      }
      if (userData?.username) {
        localStorage.setItem('userIdName', userData.username);
      }
      if (userData?.firstName) {
        localStorage.setItem('firstName', userData.firstName);
      }

      // Set tenant-specific data
      const tenantId = tenantData.tenantId;
      const tenantName = tenantData.tenantName;
      const uiConfig = tenantData.params?.uiConfig;
      const landingPage = tenantData.params?.uiConfig?.landingPage;

      localStorage.setItem('tenantId', tenantId);
      localStorage.setItem('userProgram', tenantName);
      localStorage.setItem('landingPage', landingPage || '');
      localStorage.setItem('uiConfig', JSON.stringify(uiConfig || {}));

      // Set channel and collection framework
      if (tenantData.channelId) {
        localStorage.setItem('channelId', tenantData.channelId);
      }

      if (tenantData.collectionFramework) {
        localStorage.setItem(
          'collectionFramework',
          tenantData.collectionFramework
        );
      }

      // Set cookie
      document.cookie = `token=${token}; path=/; secure; SameSite=Strict`;

      // Check profile completion (this sets additional custom fields)
      try {
        await profileComplitionCheck();
      } catch (error) {
        console.error('Profile completion check failed:', error);
        // Continue even if this fails
      }

      // Handle academic year for YOUTHNET
      if (tenantName === TenantName.YOUTHNET) {
        try {
          const academicYearResponse = await getAcademicYear();
          if (academicYearResponse?.[0]?.id) {
            localStorage.setItem('academicYearId', academicYearResponse[0].id);
          }
        } catch (error) {
          console.error('Failed to get academic year:', error);
        }
      }

      // Close modal
      onClose();

      // Navigate to landing page to avoid unauthorized issues
      router.push(landingPage || '/home');
    } catch (error) {
      console.error('Failed to switch program:', error);
    }
  };

  const handleShowAllPrograms = () => {
    localStorage.removeItem('learnerCourseFilters');
    onClose();
    router.push('/programs');
  };

  const handleHomeClick = () => {
    onClose();
    const landingPage =
      typeof window !== 'undefined'
        ? localStorage.getItem('landingPage')
        : null;
    if (landingPage) {
      router.push(landingPage);
    } else {
      router.push('/home');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      return `${day} ${month}, ${year}`;
    } catch {
      return '';
    }
  };

  // Get registration date from tenantData - check multiple possible field names
  const getRegistrationDate = (tenant: TenantData) => {
    return (
      tenant.createdAt ||
      tenant.createdOn ||
      tenant.enrolledAt ||
      tenant.enrollmentDate
    );
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      PaperProps={{
        sx: {
          mt: 1,
          minWidth: '300px',
          maxWidth: '400px',
          borderRadius: '8px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
        },
      }}
    >
      {/* Top Section with Background Color */}
      {currentProgram && (
        <Box
          sx={{
            backgroundColor: '#FDF2E5',
            p: 2,
            borderRadius: '8px 8px 0 0',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: '20px',
              mb: 0.5,
              color: '#1F1B13',
            }}
          >
            {currentProgram.tenantName}
          </Typography>
          {getRegistrationDate(currentProgram) && (
            <Typography
              variant="body2"
              sx={{
                color: '#666',
                fontSize: '14px',
              }}
            >
              Registered on {formatDate(getRegistrationDate(currentProgram))}
            </Typography>
          )}
        </Box>
      )}

      <Box sx={{ p: 2 }}>
        {/* Other Programs */}
        {enrolledPrograms.length > 0 && (
          <>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                fontSize: '16px',
                mb: 2,
                color: '#1F1B13',
              }}
            >
              Other programs you are enrolled in
            </Typography>
            <Box
              sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}
            >
              {enrolledPrograms.map((program) => (
                <Box
                  key={program.tenantId}
                  component="button"
                  onClick={() => handleProgramSwitch(program)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    width: '100%',
                    p: 1.5,
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      borderColor: '#fdbe16',
                      backgroundColor: '#FDF2E5',
                      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#1F1B13',
                      flex: 1,
                    }}
                  >
                    {program.tenantName}
                  </Typography>
                  <ArrowForwardIosIcon
                    sx={{
                      fontSize: '16px',
                      color: '#666',
                      ml: 1,
                    }}
                  />
                </Box>
              ))}
            </Box>
          </>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Actions */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleHomeClick}
            startIcon={<HomeIcon />}
            sx={{
              borderColor: '#000',
              color: '#000',
              backgroundColor: '#fff',
              textTransform: 'none',
              fontWeight: 500,
              py: 1,
              '&:hover': {
                borderColor: '#000',
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            Home
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleShowAllPrograms}
            sx={{
              borderColor: '#000',
              color: '#000',
              backgroundColor: '#fff',
              textTransform: 'none',
              fontWeight: 500,
              py: 1,
              '&:hover': {
                borderColor: '#000',
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            Show All Programs
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={onSignOut}
            endIcon={<LogoutIcon />}
            sx={{
              borderColor: '#fdbe16',
              color: '#1F1B13',
              backgroundColor: '#fff',
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: '50px',
              py: 1,
              '&:hover': {
                borderColor: '#fdbe16',
                backgroundColor: '#FDF2E5',
              },
            }}
          >
            {t('COMMON.LOGOUT')}
          </Button>
        </Box>
      </Box>
    </Popover>
  );
};

export default ProgramSwitchModal;
