// pages/content-details/[identifier].tsx

'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { useRouter, useParams } from 'next/navigation';
import LayoutPage from '@content-mfes/components/LayoutPage';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  createUserCertificateStatus,
  getUserCertificateStatus,
} from '@content-mfes/services/Certificate';
import InfoCard from '@content-mfes/components/Card/InfoCard';
import { hierarchyAPI } from '@content-mfes/services/Hierarchy';
import { ContentSearchResponse } from '@content-mfes/services/Search';
import { checkAuth } from '@shared-lib-v2/utils/AuthService';

interface ContentDetailsProps {
  isShowLayout: boolean;
  id?: string;
  getIfEnrolled?: (content: ContentSearchResponse) => void;
  _config?: any;
}

const ContentDetails = (props: ContentDetailsProps) => {
  const router = useRouter();
  const params = useParams();
  const identifier = props.id ?? params?.identifier; // string | string[] | undefined
  const [contentDetails, setContentDetails] =
    useState<ContentSearchResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  useEffect(() => {
    const fetchContentDetails = async () => {
      try {
        const result = await hierarchyAPI(identifier as string);
        const userId = localStorage.getItem('userId');
        if (checkAuth()) {
          const data = await getUserCertificateStatus({
            userId: userId as string,
            courseId: identifier as string,
          });
          if (
            data?.result?.status === 'enrolled' ||
            data?.result?.status === 'completed' ||
            data?.result?.status === 'viewCertificate'
          ) {
            if (props?.getIfEnrolled) {
              props?.getIfEnrolled(result as unknown as ContentSearchResponse);
            } else {
              router.replace(`/content/${identifier}`);
            }
          }
        }
        setContentDetails(result as unknown as ContentSearchResponse);
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
  }, [identifier, props, router]);

  const handleClick = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        await createUserCertificateStatus({
          userId,
          courseId: identifier as string,
        });
        router.replace(`/content/${identifier}`);
      } else {
        router.replace(`/login?redirectUrl=/content-details/${identifier}`);
      }
    } catch (error) {
      console.error('Failed to create user certificate:', error);
    }
  };
  const onBackClick = () => {
    router.back();
  };

  return (
    <LayoutPage isLoadingChildren={isLoading} isShow={props?.isShowLayout}>
      <InfoCard
        item={contentDetails}
        onBackClick={onBackClick}
        _config={{ onButtonClick: handleClick, ...props?._config }}
      />
      <Box sx={{ display: 'flex' }}>
        <Box
          sx={{
            flex: { xs: 6, md: 4, lg: 3, xl: 3 },
          }}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: { xs: 6, md: 8, lg: 9, xl: 9 },
          }}
        >
          {/* Section Header */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, py: 4 }}>
            <Box>
              <Typography fontSize={'14px'} fontWeight={400}>
                {contentDetails?.description ?? 'No description available'}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <Typography fontSize={'14px'} fontWeight={400}>
                What You’ll Learn
              </Typography>

              {contentDetails?.children &&
                contentDetails?.children?.length > 0 && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    {contentDetails?.children?.map((item: any) => (
                      <Accordion
                        key={item.identifier}
                        sx={{ backgroundColor: 'transparent' }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header"
                        >
                          <Typography component="span">{item?.name}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          {item?.description ?? 'No description available'}
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Box>
                )}
            </Box>
          </Box>
        </Box>
      </Box>
    </LayoutPage>
  );
};

export default ContentDetails;
