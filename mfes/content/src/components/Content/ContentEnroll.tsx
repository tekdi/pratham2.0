// pages/content-details/[identifier].tsx

'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
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
import { checkAuth, getUserId } from '@shared-lib-v2/utils/AuthService';
import SpeakableText from '@shared-lib-v2/lib/textToSpeech/SpeakableText';
import { useTranslation } from '@shared-lib-v2/lib/context/LanguageContext';
import { Loader } from '@shared-lib-v2/lib/Loader/Loader';
interface ContentDetailsProps {
  isShowLayout: boolean;
  id?: string;
  getIfEnrolled?: (content: ContentSearchResponse) => void;
  _config?: any;
}

const ContentDetails = (props: ContentDetailsProps) => {
  const [checkLocalAuth, setCheckLocalAuth] = useState(false);
  const [isProgressCompleted, setIsProgressCompleted] = useState(false);
  const router = useRouter();
  const params = useParams();
  const identifier = props.id ?? params?.identifier; // string | string[] | undefined
  const [contentDetails, setContentDetails] =
    useState<ContentSearchResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  let activeLink = null;
  if (typeof window !== 'undefined') {
    const searchParams = new URLSearchParams(window.location.search);
    activeLink = searchParams.get('activeLink');
    if (!activeLink) {
      activeLink = '';
    }
  }
  const { t } = useTranslation();
  useEffect(() => {
    const fetchContentDetails = async () => {
      try {
        const result = await hierarchyAPI(identifier as string);
        const userId = getUserId(props?._config?.userIdLocalstorageName);
        setCheckLocalAuth(checkAuth(Boolean(userId)));
        if (checkAuth(Boolean(userId))) {
          const data = await getUserCertificateStatus({
            userId: userId as string,
            courseId: identifier as string,
          });
          if (
            ['enrolled', 'inprogress', 'completed', 'viewCertificate'].includes(
              data?.result?.status
            )
          ) {
            if (props?.getIfEnrolled) {
              props?.getIfEnrolled(result as unknown as ContentSearchResponse);
            } else {
              router.replace(
                `${props?._config?.contentBaseUrl ?? '/content'}/${identifier}${
                  activeLink ? `?activeLink=${activeLink}` : ''
                }`
              );
            }
          } else {
            setIsProgressCompleted(true);
          }
        } else {
          setIsProgressCompleted(true);
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
  }, [identifier, activeLink, props, router]);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const userId = getUserId(props?._config?.userIdLocalstorageName);
      if (userId) {
        await createUserCertificateStatus({
          userId,
          courseId: identifier as string,
        });

        router.replace(
          `${props?._config?.contentBaseUrl ?? '/content'}/${identifier}${
            activeLink ? `?activeLink=${activeLink}` : ''
          }`
        );
      } else {
        router.replace(
          `/login?redirectUrl=${
            props?._config?.contentBaseUrl ?? '/content'
          }-details/${identifier}${
            activeLink ? `&activeLink=${activeLink}` : ''
          }`
        );
      }
    } catch (error) {
      console.error('Failed to create user certificate:', error);
    }
    setIsLoading(false);
  };
  const onBackClick = () => {
    router.back();
  };

  if (!isProgressCompleted) {
    return <Loader isLoading={true} />;
  } else {
    return (
      <LayoutPage
        isLoadingChildren={isLoading || activeLink === null}
        isShow={props?.isShowLayout}
      >
        <InfoCard
          item={contentDetails}
          topic={contentDetails?.se_subjects?.join(',')}
          onBackClick={onBackClick}
          _config={{ onButtonClick: handleClick, ...props?._config }}
          checkLocalAuth={checkLocalAuth}
        />
        <Box sx={{ display: 'flex' }}>
          <Box
            sx={{
              display: { xs: 'none', sm: 'none', md: 'flex' },
              flex: { xs: 6, md: 4, lg: 3, xl: 3 },
            }}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flex: { xs: 6, md: 8, lg: 9, xl: 9 },
              px: '18px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                py: 4,
                width: { sx: '100%', sm: '90%', md: '85%' },
              }}
            >
              <Box>
                <Typography
                  variant="body1"
                  component="div"
                  sx={{
                    fontWeight: 400,
                    // fontSize: '16px',
                    // lineHeight: '24px',
                    letterSpacing: '0.5px',
                    color: '#4D4639',
                    textTransform: 'capitalize',
                  }}
                  fontWeight={400}
                >
                  <SpeakableText>
                    {contentDetails?.description ?? 'No description available'}
                  </SpeakableText>
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 400,
                    // fontSize: '22px',
                    // lineHeight: '28px',
                    letterSpacing: '0px',
                    verticalAlign: 'middle',
                    color: '#1F1B13',
                  }}
                >
                  <SpeakableText>{t('COMMON.WHAT_YOU_LL_LEARN')}</SpeakableText>
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
                      {contentDetails?.children?.map(
                        (item: any, index: number) => (
                          <>
                            <Accordion
                              key={item.identifier}
                              sx={{
                                backgroundColor: 'transparent',
                                boxShadow: 'none',
                                '&:before': {
                                  display: 'none',
                                },
                                '&.MuiAccordion-root': {
                                  border: 'none',
                                },
                              }}
                            >
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                              >
                                <Typography
                                  variant="body1"
                                  component="div"
                                  sx={{
                                    fontWeight: 500,
                                    // fontSize: '16px',
                                    // letterSpacing: '0.15px',
                                  }}
                                >
                                  <SpeakableText>{item?.name}</SpeakableText>
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Typography
                                  variant="body1"
                                  component="div"
                                  sx={{
                                    fontWeight: 400,
                                    // fontSize: '16px',
                                    // lineHeight: '24px',
                                    letterSpacing: '0.5px',
                                    color: '#4D4639',
                                  }}
                                >
                                  <SpeakableText>
                                    {item?.description ??
                                      'No description available'}
                                  </SpeakableText>
                                </Typography>
                              </AccordionDetails>
                            </Accordion>

                            {index <
                              (contentDetails?.children?.length ?? 0) - 1 && (
                              <Divider />
                            )}
                          </>
                        )
                      )}
                    </Box>
                  )}
              </Box>
            </Box>
          </Box>
        </Box>
      </LayoutPage>
    );
  }
};

export default ContentDetails;
