// pages/content-details/[identifier].tsx

'use client';
import React, { useEffect, useState } from 'react';
import { Box, Button, Divider, Typography, Grid, Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter, useParams } from 'next/navigation';
import { fetchContent } from '../../services/Read';
import AppConst from '../../utils/AppConst/AppConst';
import LayoutPage from '../../components/LayoutPage';
import {
  createUserCertificateStatus,
  getUserCertificateStatus,
} from '../../services/Certificate';
interface ContentDetailsObject {
  name: string;
  [key: string]: any;
}

interface isShowLayout {
  isShowLayout: boolean;
}

const ContentDetails = (props: isShowLayout) => {
  const router = useRouter();
  const params = useParams();
  const identifier = params?.identifier; // string | string[] | undefined
  const [contentDetails, setContentDetails] =
    useState<ContentDetailsObject | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchContentDetails = async () => {
      try {
        const result = await fetchContent(identifier as string);
        const data = await getUserCertificateStatus({
          userId: localStorage.getItem('userId') || '',
          courseId: identifier as string,
        });
        if (
          data?.result?.status === 'enrolled' ||
          data?.result?.status === 'completed'
        ) {
          router.replace(`/details/${identifier}`);
        } else {
          setContentDetails(result);
        }
      } catch (error) {
        console.error('Failed to fetch content:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (identifier) {
      fetchContentDetails();
    } else {
      setIsLoading(false);
    }
  }, [identifier]);

  const handleClick = async () => {
    try {
      await createUserCertificateStatus({
        userId: localStorage.getItem('userId') || '',
        courseId: identifier as string,
      });
      router.replace(`/details/${identifier}`);
    } catch (error) {
      console.error('Failed to create user certificate:', error);
    }
  };

  return (
    <LayoutPage isLoadingChildren={isLoading} isShow={props?.isShowLayout}>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Typography fontSize={'22px'} fontWeight={400}>
              {contentDetails?.name}
            </Typography>
            <Box
              sx={{
                margin: 'auto',
                textAlign: 'center',
                width: { xs: '100%', sm: '100%', md: '500px', lg: '500px' },
                // height: { xs: 'auto', md: 'auto', lg: '100vh' },
              }}
            >
              <Avatar
                src={
                  contentDetails?.posterImage &&
                  contentDetails?.posterImage !== 'undefined'
                    ? contentDetails?.posterImage
                    : `${AppConst.BASEPATH}/assests/images/default_hori.png`
                }
                alt="Course Thumbnail"
                sx={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '8px',
                  marginBottom: '16px',
                }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Section Header */}
        <Grid item xs={12} sx={{ p: '16px' }}>
          <Typography fontSize={'22px'} fontWeight={400}>
            Description
          </Typography>
          <Typography fontSize={'14px'} fontWeight={400}>
            {contentDetails?.description
              ? contentDetails.description
              : 'No description available'}
          </Typography>
        </Grid>
        <Grid container spacing={2} sx={{ p: '16px' }}>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
            <Typography fontSize={'22px'} fontWeight={400}>
              Language
            </Typography>
            <Typography fontSize={'14px'} fontWeight={400}>
              {contentDetails?.language?.join(', ') || 'No language available'}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
            <Typography fontSize={'22px'} fontWeight={400}>
              Author
            </Typography>
            <Typography fontSize={'14px'} fontWeight={400}>
              {contentDetails?.author || 'No author available'}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
            <Typography fontSize={'22px'} fontWeight={400}>
              License
            </Typography>
            <Typography fontSize={'14px'} fontWeight={400}>
              {contentDetails?.license || 'No license available'}
            </Typography>
          </Grid>

          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography fontSize={'22px'} fontWeight={400}>
              Tags
            </Typography>
            <Grid item xs={12}>
              {contentDetails?.keywords?.map((tag: string) => (
                <Button
                  key={tag}
                  variant="contained"
                  sx={{
                    bgcolor: '#49454F1F',
                    color: '#1D1B20',
                    margin: '3px',
                    fontSize: '12px',
                    backgroundColor: '#E9E9EA',
                    borderRadius: '5px',
                    boxShadow: 'none',
                    textTransform: 'none',
                  }}
                >
                  {tag}
                </Button>
              ))}
            </Grid>
          </Grid>
        </Grid>
        <Divider
          sx={{ borderWidth: '1px', width: '100%', marginTop: '16px' }}
        />
        <Grid container justifyContent="center" sx={{ marginBottom: '16px' }}>
          <Button
            variant="contained"
            sx={{
              // bgcolor: '#6750A4',

              bgcolor: theme.palette.primary.main,
              color: theme.palette.text.secondary,
              margin: '12px',
              borderRadius: '100px',
              textTransform: 'none',
              boxShadow: 'none',
            }}
            onClick={handleClick}
          >
            Join Now/Start Course
          </Button>
        </Grid>
      </Box>
    </LayoutPage>
  );
};

export default ContentDetails;
