'use client';

import React, { useEffect, useState } from 'react';
import { Alert, Box, Grid, Typography } from '@mui/material';
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
 const tenantName =      (typeof window !== 'undefined' && localStorage.getItem('userProgram')) || '';

  const [filters] = useState<FilterDetails>({
    status: [ 'viewCertificate'],
   
    userId:
      (typeof window !== 'undefined' && localStorage.getItem('userId')) || '',
  });
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateId, setCertificateId] = useState('');
  const [certificateTemplate, setCertificateTemplate] = useState<string>();

  const [courseData, setCourseData] = useState<any>([]);

  const handlePreview = async (id: string, courseCertificateTemplate?: string) => {
    console.log(id);

    try {
      if (id === null) {
        showToastMessage('Certification Id not found', 'error');
        return;
      }
      setShowCertificate(false);
      setCertificateId(id);
      // Course-level template when the course has one; otherwise the modal falls
      // back to the tenant template in localStorage.
      setCertificateTemplate(courseCertificateTemplate);
      setTimeout(() => {
        setShowCertificate(true);
      }, 2); // open modal in next tick
    } catch (error) {
      console.log(id);
      console.error('Error fetching certificate data:', error);
    }
  };

  useEffect(() => {
    const fetchCertificateData = async () => {
      try {
        const response = await courseWiseLernerList({ filters });
        console.log('response', response.data);
        
        // Filter out items that don't have certificateId
        const validCertificates = (response.data || []).filter((item: any) => 
          item?.certificateId
        );
        
        setCourseData(validCertificates);
      } catch (error) {
        console.error('Failed to fetch certificate data:', error);
        setCourseData([]);
      }
    };
    fetchCertificateData();
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
      <Grid container spacing={2}>
        {/* User Profile Card — 4 cols always (12 only if right panel is hidden) */}
        <Grid item xs={12} md={4}>
          <UserProfileCard />
        </Grid>

        {/* Certificates Section — always visible at 8 cols */}
        <Grid item xs={12} md={8}>
          <Box p={1}>
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
                xs: '1fr 1fr',
                sm: '1fr 1fr',
                md: '1fr 1fr',
                lg: '1fr 1fr 1fr',
                xl: '1fr 1fr 1fr 1fr',
              }}
              gap={2}
              sx={{ '& > *': { margin: '0 !important', padding: '0 !important' } }}
            >
              {courseData.map((cert: any, index: any) => (
                <CourseCertificateCard
                  key={index}
                  certificateData={cert}
                  onPreviewCertificate={(courseCertificateTemplate) =>
                    handlePreview(cert.certificateId, courseCertificateTemplate)
                  }
                />
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>
      <CertificateModal
        certificateId={certificateId?.toString()}
        certificateTemplate={certificateTemplate}
        open={showCertificate}
        setOpen={setShowCertificate}
      />
    </Layout>
  );
};

export default ProfilePage;