'use client';

import React, { useEffect, useState } from 'react';
import { Alert, Box, Typography } from '@mui/material';
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
type FilterDetails = {
  status?: string[];
  tenantId?: string;
  userId?: string;
};
const ProfilePage = () => {
  const router = useRouter();

  const [filters] = useState<FilterDetails>({
    status: ['completed', 'viewCertificate'],
    tenantId:
      (typeof window !== 'undefined' && localStorage.getItem('tenantId')) || '',
    userId:
      (typeof window !== 'undefined' && localStorage.getItem('userId')) || '',
  });
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateId, setCertificateId] = useState('');

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
      const finalArray = [];

      const response = await courseWiseLernerList({ filters });
      console.log('response', response.data);
      for (const item of response.data) {
        try {
          const url = baseurl;
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
          };
          finalArray.push(obj);
        } catch (error) {
          console.error(
            `Failed to fetch course details for courseId: ${item.courseId}`,
            error
          );
        }
      }
      console.log('finalArray', finalArray);
      setCourseData(finalArray);
      // return finalArray;
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
            width: { xs: '100%', md: courseData.length === 0 ?'100%':'530px' },
            mb: { xs: 2, md: 0 },
          }}
        >
           {courseData.length === 0?
          (<UserProfileCard maxWidth='100%' />):
          (<UserProfileCard  />)
           }
        </Box>

        {/* Certificates Section */}
      {typeof window !== "undefined" && localStorage.getItem('userProgram') === "YouthNet" ? (
  <Box flexGrow={1} p={2}>
    <Typography color={'#78590C'}>YouthNet</Typography>
    

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
      gap={2}
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
) : null}

      </Box>
      <CertificateModal
        certificateId={certificateId?.toString()}
        open={showCertificate}
        setOpen={setShowCertificate}
      />
    </Layout>
  );
};

export default ProfilePage;
