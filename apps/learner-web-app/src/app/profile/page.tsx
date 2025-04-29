'use client';

import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Layout from '../../components/Layout';
import UserProfileCard from '@learner/components/UserProfileCard/UserProfileCard';
import CourseCertificateCard from '@learner/components/CourseCertificateCard/CourseCertificateCard';
import { courseWiseLernerList } from '@shared-lib-v2/utils/CertificateService/coursesCertificates';
import { CertificateModal, get } from '@shared-lib';

import { baseurl } from '@learner/utils/API/EndUrls';
type FilterDetails = {
  status?: string[];
  tenantId?: string;
  userId?: string;
};
const ProfilePage = () => {
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
    try {
      setShowCertificate(false);
      setCertificateId(id);
      setTimeout(() => {
        setShowCertificate(true);
      }, 2); // open modal in next tick
    } catch (error) {
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

  return (
    <Layout>
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
        {/* User Profile Card */}
        <Box
          sx={{
            flexShrink: 0,
            width: { xs: '100%', md: '500px' },
            mb: { xs: 2, md: 0 },
          }}
        >
          <UserProfileCard />
        </Box>

        {/* Certificates Section */}
        <Box flexGrow={1} p={2}>
          <Box
            display="grid"
            gridTemplateColumns={{
              xs: '1fr', // 1 column for mobile
              sm: '1fr 1fr', // 2 columns for small screens
              md: '1fr 1fr', // 2 columns for medium
              lg: '1fr 1fr 1fr', // 3 columns for large screens
              xl: '1fr 1fr 1fr 1fr', // 4 columns for extra-large screens
            }}
            gap={2}
          >
            {courseData &&
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
      </Box>
      <CertificateModal
        certificateId={certificateId.toString()}
        open={showCertificate}
        setOpen={setShowCertificate}
      />
    </Layout>
  );
};

export default ProfilePage;
