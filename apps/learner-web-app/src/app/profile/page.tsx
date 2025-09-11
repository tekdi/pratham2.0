'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { Alert, Box, Typography, CircularProgress, Skeleton } from '@mui/material';
import Layout from '../../components/Layout';
import UserProfileCard from '@learner/components/UserProfileCard/UserProfileCard';
import CourseCertificateCard from '@learner/components/CourseCertificateCard/CourseCertificateCard';
import { courseWiseLernerList } from '@shared-lib-v2/utils/CertificateService/coursesCertificates';
import { CertificateModal, get } from '@shared-lib';
import { useRouter } from 'next/navigation';
import { checkAuth } from '@shared-lib-v2/utils/AuthService';
import InfoIcon from '@mui/icons-material/Info';

import { baseurl } from '@learner/utils/API/EndUrls';
import { Info } from '@mui/icons-material';
import { showToastMessage } from '@learner/components/ToastComponent/Toastify';

// Suspense Fallback Component to maintain layout
const ProfileSkeleton = () => {
  return (
    <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
      {/* User Profile Skeleton */}
      <Box
        sx={{
          flexShrink: 0,
          width: { xs: '100%', md: '100%' }, // Always 100% during loading
          mb: { xs: 2, md: 0 },
        }}
      >
        <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2 }} />
      </Box>

      {/* Certificates Skeleton */}
      <Box flexGrow={1} p={1}>
        <Skeleton variant="text" width="60%" height={30} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="80%" height={25} sx={{ mb: 2 }} />
        
        <Box display="flex" justifyContent="center" alignItems="center" p="40px">
          <CircularProgress sx={{ color: '#78590C' }} />
          <Typography sx={{ ml: 2, color: '#78590C' }}>Loading certificates...</Typography>
        </Box>
      </Box>
    </Box>
  );
};

type FilterDetails = {
  status?: string[];
  tenantId?: string;
  userId?: string;
};

// Main Profile Content Component
const ProfileContent = () => {
  const router = useRouter();
 const tenantName =      (typeof window !== 'undefined' && localStorage.getItem('userProgram')) || '';

  const [filters] = useState<FilterDetails>({
    status: [  'viewCertificate'],
    tenantId:
      (typeof window !== 'undefined' && localStorage.getItem('tenantId')) || '',
    userId:
      (typeof window !== 'undefined' && localStorage.getItem('userId')) || '',
  });
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateId, setCertificateId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasCertificates, setHasCertificates] = useState<boolean | null>(null);

  const [courseData, setCourseData] = useState<any>([]);

  const handlePreview = async (id: string) => {
    console.log(id);

    try {
      if (id === null) {
        showToastMessage('Certification Id not found', 'error');
        return;
      }
      setShowCertificate(false);
      setCertificateId(id);
      setTimeout(() => {
        setShowCertificate(true);
      }, 2); // open modal in next tick
    } catch (error) {
      console.log(id);
      console.error('Error fetching certificate data:', error);
    }
  };

  useEffect(() => {
    const prepareCertificateData = async () => {
      try {
        setIsLoading(true);
        
        const response = await courseWiseLernerList({ filters });
        console.log('response', response.data);
        
        // First determine if any certificates exist (without fetching full course details)
        const certificateCount = response.data.filter((item: any) => item.certificateId !== null).length;
        setHasCertificates(certificateCount > 0);
        
        // If no certificates, we can stop here
        if (certificateCount === 0) {
          setCourseData([]);
          return;
        }
        
        // If certificates exist, fetch full course details
        const finalArray = [];
        for (const item of response.data) {
          try {
            if (item.certificateId === null) continue; // Skip items without certificates
            
            const Details: any = await get(
              `${baseurl}/action/content/v3/read/${item.courseId}`,
              {
                tenantId: localStorage.getItem('tenantId') || '',
                Authorization: `Bearer ${localStorage.getItem('accToken') || ''}`,
              }
            );
            console.log('courseDetails', Details);
            let courseDetails = Details.data.result.content;
            const obj = {
              usercertificateId: item.usercertificateId,
              userId: item.userId,
              courseId: item.courseId,
              certificateId: item.certificateId,
              completedOn: item.issuedOn,
              description: courseDetails.description || '',
              posterImage: courseDetails.posterImage || '',
              program: courseDetails.program || [],
              name: courseDetails.name || "",
            };
            
            finalArray.push(obj);

          } catch (error) {
            console.error(
              `Failed to fetch course details for courseId: ${item.courseId}`,
              error
            );
          }
        }
        
        setCourseData(finalArray);
        console.log('finalArray', finalArray);
      } catch (error) {
        console.error('Error preparing certificate data:', error);
        setHasCertificates(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    prepareCertificateData();
  }, []);
  useEffect(() => {
    // const token = localStorage.getItem('token');
    if (!checkAuth()) {
      router.push('/login');
    }
  }, []);
  console.log('courseData', courseData);
  return (
    <Layout>

      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
        {/* User Profile Card */}
        <Box
          sx={{
            flexShrink: 0,
            width: { xs: '100%', md: (hasCertificates === null || !hasCertificates) ? '100%' : '530px' },
            mb: { xs: 2, md: 0 },
          }}
        >
           {(hasCertificates === null || !hasCertificates) ?
          (<UserProfileCard maxWidth='100%' />):
          (<UserProfileCard  />)
           }
        </Box>

        {/* Certificates Section */}
      {/* {typeof window !== "undefined" && localStorage.getItem('userProgram') === "YouthNet" ? (
  <Box flexGrow={1} p={2}>
    <Typography color={'#78590C'}>{tenantName}</Typography>
    

    <Typography color={'#78590C'}>
      Completed Courses & Certificates
    </Typography>

    {courseData.length === 0 && (
      <Box display="flex" alignItems="center" p="20px">
        <InfoIcon color="info" sx={{ color: '#FDBE16', mr: 1 }} />
        <Typography>Certification has not been completed yet.</Typography>
      </Box>
    )}

    <Box
      mt="20px"
      display="grid"
      gridTemplateColumns={{
        xs: '1fr',
        sm: '1fr 1fr',
        md: '1fr 1fr',
        lg: '1fr 1fr 1fr',
        xl: '1fr 1fr 1fr 1fr',
      }}
      gap={1}
    >
      {courseData.length !== 0 &&
        courseData?.map((cert: any, index: any) => (
          <CourseCertificateCard
            key={index}
            title={cert.program}
            description={cert.description}
            imageUrl={cert.posterImage}
            completionDate={cert.completedOn}
            onPreviewCertificate={() => handlePreview(cert.certificateId)}
          />
        ))}
    </Box>
  </Box>
) : null} */}
 <Box flexGrow={1} p={1}>
    <Typography color={'#78590C'}>{tenantName}</Typography>
    

    <Typography color={'#78590C'}>
      Completed Courses & Certificates
    </Typography>

    {hasCertificates === null || (hasCertificates === true && courseData?.length === 0) ? (
      <Box display="flex" justifyContent="center" alignItems="center" p="40px">
        <CircularProgress sx={{ color: '#78590C' }} />
        <Typography sx={{ ml: 2, color: '#78590C' }}>Loading certificates...</Typography>
      </Box>
    ) : !hasCertificates ? (
      <Box display="flex" alignItems="center" p="20px">
        <InfoIcon color="info" sx={{ color: '#FDBE16', mr: 1 }} />
        <Typography>Certification has not been completed yet.</Typography>
      </Box>
    ) : (
      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns={{
          xs: '1fr 1fr',
          sm: '1fr 1fr',
          md: '1fr 1fr 1fr',
          lg: '1fr 1fr 1fr 1fr',
          xl: '1fr 1fr 1fr 1fr 1fr',
        }}
        p={'5px'}
        gap={2}
        sx={{
          '& > *': {
            margin: '0 !important',
            padding: '0 !important'
          }
        }}
      >
        {courseData?.map((cert: any, index: any) => (
          <CourseCertificateCard
            key={index}
            title={cert.name}
            description={cert.description}
            imageUrl={cert.posterImage}
            completionDate={cert.completedOn}
            onPreviewCertificate={() => handlePreview(cert.certificateId)}
          />
        ))}
      </Box>
    )}
  </Box>

      </Box>
      <CertificateModal
        certificateId={certificateId?.toString()}
        open={showCertificate}
        setOpen={setShowCertificate}
      />
    </Layout>
  );
};

// Main ProfilePage with Suspense wrapper
const ProfilePage = () => {
  return (
    <Suspense fallback={<Layout><ProfileSkeleton /></Layout>}>
      <ProfileContent />
    </Suspense>
  );
};

export default ProfilePage;
