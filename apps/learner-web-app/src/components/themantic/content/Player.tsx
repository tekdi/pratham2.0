// pages/content-details/[identifier].tsx

'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Snackbar,
  Alert,
  Typography,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { isDownloadContentEnabled } from '@shared-lib-v2/SwitchAccount/DownloadContent.config';
import {
  ExpandableText,
  findCourseUnitPath,
  useTranslation,
} from '@shared-lib';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import { fetchContent } from '@learner/utils/API/contentService';
import BreadCrumb from '@content-mfes/components/BreadCrumb';
import { hierarchyAPI } from '@content-mfes/services/Hierarchy';
import { CardComponent } from './List';
import DownloadIcon from '@mui/icons-material/Download';
import JotFormEmbedWithSubmit from '@learner/components/JotFormEmbed/JotFormEmbedWithSubmit';
import { CONTENT_DOWNLOAD_JOTFORM_ID } from '../../../../app.config';

const CourseUnitDetails = dynamic(() => import('@CourseUnitDetails'), {
  ssr: false,
});
const App = ({
  userIdLocalstorageName,
  contentBaseUrl,
  _config,
}: {
  userIdLocalstorageName?: string;
  contentBaseUrl?: string;
  _config?: any;
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const { identifier, courseId, unitId } = params || {}; // string | string[] | undefined
  const [item, setItem] = useState<{ [key: string]: any }>({});
  const [breadCrumbs, setBreadCrumbs] = useState<any>();
  const [isDownloading, setIsDownloading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showJotFormModal, setShowJotFormModal] = useState(false);
  const [pendingDownload, setPendingDownload] = useState<{
    url: string;
    name: string;
    mimeType: string;
  } | null>(null);

  let activeLink = null;
  if (typeof window !== 'undefined') {
    const searchParams = new URLSearchParams(window.location.search);
    activeLink = searchParams.get('activeLink');
  }
  useEffect(() => {
    const fetch = async () => {
      const response = await fetchContent(identifier);
      setItem({ content: response });
      // console.log('response=======>', { content: response });
      if (unitId) {
        const course = await hierarchyAPI(courseId as string);
        const breadcrum = findCourseUnitPath({
          contentBaseUrl: contentBaseUrl,
          node: course,
          targetId: identifier as string,
          keyArray: [
            'name',
            'identifier',
            'mimeType',
            {
              key: 'link',
              suffix: activeLink
                ? `?activeLink=${encodeURIComponent(activeLink)}`
                : '',
            },
          ],
        });
        setBreadCrumbs([
          { label: 'Home', link: '/themantic' },
          ...(breadcrum?.slice(0, -1) || []),
        ]);
      } else {
        setBreadCrumbs([
          { label: 'Home', link: '/themantic' },
          { label: response?.name },
        ]);
      }
    };
    fetch();
  }, [identifier, unitId, courseId, activeLink, contentBaseUrl]);

  if (!identifier) {
    return <div>Loading...</div>;
  }

  // Handle download after form submission
  const handleDownloadContent = async () => {
    // console.log('handleDownloadContent called');
    // console.log('Pending download data:', pendingDownload);

    if (!pendingDownload) {
      // console.error('No pending download data');
      return;
    }

    // For YouTube videos, open URL in new tab instead of downloading
    if (pendingDownload.mimeType === 'video/x-youtube') {
      setIsDownloading(true);
      try {
        // Open URL in new tab
        window.open(pendingDownload.url, '_blank', 'noopener,noreferrer');

        // Show success message after a small delay
        setIsDownloading(false);
        setPendingDownload(null);

        setTimeout(() => {
          setShowSuccessMessage(true);
        }, 300);
        // console.log('YouTube URL opened in new tab');
      } catch (error) {
        // console.error('Failed to open URL:', error);
        setIsDownloading(false);
        setPendingDownload(null);
      }
      return;
    }

    setIsDownloading(true);
    // console.log('Starting download from URL:', pendingDownload.url);

    try {
      // Fetch the file as a blob to force download
      // console.log('Fetching file...');
      const response = await fetch(pendingDownload.url);
      // console.log('Fetch response:', response);

      const blob = await response.blob();
      // console.log('Blob created:', blob);

      // Create a blob URL
      const blobUrl = window.URL.createObjectURL(blob);
      // console.log('Blob URL created:', blobUrl);

      // Create download link
      const link = document.createElement('a');
      link.href = blobUrl;

      // Set filename with proper extension
      const extension = getFileExtension(pendingDownload.mimeType) || '.bin';
      const fileName = pendingDownload.name
        ? `${pendingDownload.name}${extension}`
        : `content${extension}`;
      link.download = fileName;

      // console.log('Download filename:', fileName);

      document.body.appendChild(link);
      link.click();
      // console.log('Download link clicked');

      document.body.removeChild(link);

      // Clean up the blob URL
      window.URL.revokeObjectURL(blobUrl);

      // Show success message after a small delay to ensure modal is closed
      setIsDownloading(false);
      setPendingDownload(null);

      // Delay showing toast to ensure modal is fully closed and UI is ready
      setTimeout(() => {
        setShowSuccessMessage(true);
      }, 300);
      // console.log('Download completed successfully');
    } catch (error) {
      // console.error('Download failed:', error);
      setIsDownloading(false);
      setPendingDownload(null);
    }
  };

  // Handle JotForm submission
  const handleJotFormSubmit = () => {
    // console.log('/handleJotFormSubmit called - Form submitted!');
    // console.log('Closing modal and starting download...');
    setShowJotFormModal(false);
    // Small delay to ensure modal closes before starting download
    setTimeout(() => {
      handleDownloadContent();
    }, 100);
  };

  // Get file extension based on mimeType
  const getFileExtension = (mimeType: string): string => {
    const extensionMap: Record<string, string> = {
      'video/mp4': '.mp4',
      'video/webm': '.webm',
      'video/x-youtube': '.mp4', // YouTube videos are typically mp4
      'application/pdf': '.pdf',
      'application/epub': '.epub',
      'application/vnd.ekstep.ecml-archive': '.ecml',
      'application/vnd.ekstep.html-archive': '.zip', // HTML archives are typically zipped
      'application/vnd.ekstep.h5p-archive': '.h5p',
      'application/vnd.sunbird.question': '.json', // Questions are typically JSON
    };
    return extensionMap[mimeType] || '';
  };

  // Check if mimeType is downloadable
  const isDownloadableMimeType = (mimeType: string): boolean => {
    const downloadableTypes = [
      'video/mp4',
      'video/webm',
      'video/x-youtube',
      'application/pdf',
      'application/epub',
      'application/vnd.ekstep.ecml-archive',
      'application/vnd.ekstep.html-archive',
      'application/vnd.ekstep.h5p-archive',
      'application/vnd.sunbird.question',
    ];
    return downloadableTypes.includes(mimeType);
  };

  // Get program value from subdomain or domain
  const getProgramValue = () => {
    if (typeof window === 'undefined') {
      return '';
    }

    try {
      const hostname = window.location.hostname;

      // Check if hostname is an IP address (contains only numbers and dots)
      const isIPAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);

      // If it's an IP address, return the full IP
      if (isIPAddress) {
        return hostname;
      }

      const parts = hostname.split('.');

      // If we have more than 2 parts, there's likely a subdomain
      // e.g., subdomain.example.com -> subdomain
      // e.g., example.com -> example.com
      if (parts.length > 2) {
        // Return the subdomain (first part)
        return parts[0];
      } else {
        // Return the domain (e.g., example.com)
        return hostname;
      }
    } catch (error) {
      // Fallback to current hostname
      return window.location.hostname || '';
    }
  };

  // Handle download button click
  const handleDownloadButtonClick = () => {
    // console.log('Download button clicked');
    // Store download info and show form
    const downloadData = {
      url: item.content.artifactUrl,
      name: item.content.name,
      mimeType: item.content.mimeType,
    };
    // console.log('Setting pending download:', downloadData);
    setPendingDownload(downloadData);
    setShowJotFormModal(true);
    // console.log('Modal should now open');
  };

  // const onBackClick = () => {
  //   if (breadCrumbs?.length > 1) {
  //     if (breadCrumbs?.[breadCrumbs.length - 1]?.link) {
  //       router.push(breadCrumbs?.[breadCrumbs.length - 1]?.link);
  //     }
  //   } else if (contentBaseUrl) {
  //     router.back();
  //   } else {
  //     router.push(`${activeLink ? activeLink : '/content'}`);
  //   }
  // };

  return (
    <Box className="bs-px-5" sx={{ mx: '2vh', position: 'relative' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 3,
          position: 'relative',
          zIndex: 10,
          '& .MuiBreadcrumbs-root': {
            position: 'relative',
            zIndex: 11,
          },
          '& .MuiBreadcrumbs-ol': {
            position: 'relative',
            zIndex: 11,
          },
          '& .MuiBreadcrumbs-li': {
            position: 'relative',
            zIndex: 11,
          },
        }}
      >
        <BreadCrumb
          breadCrumbs={breadCrumbs}
          isShowLastLink
          customPlayerStyle={true}
          customPlayerMarginTop={25}
        />
      </Box>
      <Box sx={{ pb: 5, px: '12px', position: 'relative', zIndex: 1 }}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={12} md={3.5} lg={3.5}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                // pb: 2,
              }}
            >
              <Box
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease-in-out',
                  boxShadow: '0 0.15rem 1.75rem 0 rgba(33, 40, 50, 0.15)',
                  border: '1px solid rgba(0, 0, 0, .125)',
                  borderRadius: '5px',
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 3,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <Box>
                    <Grid
                      container
                      sx={{
                        px: 3,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Grid item xs={9}>
                        <img
                          // height={'200px'}
                          src={
                            item?.content?.posterImage ||
                            '/images/image_ver.png'
                          }
                          alt={
                            item?.content?.name ||
                            item?.content?.title ||
                            'Content'
                          }
                          style={{ width: '100%', objectFit: 'cover' }}
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Title */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: '600',
                      textAlign: 'center',
                      color: '#000',
                      fontSize: '23px',
                      letterSpacing: '1px',
                      lineHeight: 1.2,
                      mt: 2,
                      mb: 2,
                      px: 2,
                      fontFamily: '"Montserrat", sans-serif',
                      textDecoration: 'underline',
                    }}
                  >
                    {item?.content?.name || item?.content?.title || 'Untitled'}
                  </Typography>

                  <Divider
                    sx={{
                      width: '100%',
                      mt: 2,
                      mb: 2,
                      height: '4px',
                      backgroundColor: '#9EB6BE',
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: '16px',
                      color: '#363d47',
                      fontWeight: '400',
                      px: 2,
                      fontFamily: '"Montserrat", sans-serif',
                    }}
                  >
                    {item?.content?.description || 'No description'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={8.5} lg={8.5}>
            <PlayerBox
              userIdLocalstorageName={userIdLocalstorageName}
              item={item}
              identifier={identifier}
              courseId={courseId}
              unitId={unitId}
              {..._config?.player}
            />
            {item?.content?.artifactUrl &&
              isDownloadableMimeType(item?.content?.mimeType) &&
              isDownloadContentEnabled() && (
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    onClick={handleDownloadButtonClick}
                    disabled={isDownloading}
                    startIcon={
                      isDownloading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <DownloadIcon />
                      )
                    }
                    sx={{
                      backgroundColor: '#000',
                      color: '#fff',
                      padding: '12px 24px',
                      fontSize: '16px',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#333',
                      },
                      '&:disabled': {
                        backgroundColor: '#666',
                        color: '#fff',
                      },
                    }}
                  >
                    {isDownloading
                      ? item?.content?.mimeType === 'video/x-youtube'
                        ? 'Opening...'
                        : 'Downloading...'
                      : item?.content?.mimeType === 'video/x-youtube'
                      ? 'Open in New Tab'
                      : 'Download Content'}
                  </Button>
                </Box>
              )}
          </Grid>
        </Grid>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={3000}
        onClose={() => setShowSuccessMessage(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ zIndex: 9999 }}
      >
        <Alert
          onClose={() => setShowSuccessMessage(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          {item?.content?.mimeType === 'video/x-youtube'
            ? 'Content opened in new tab successfully!'
            : 'Content downloaded successfully!'}
        </Alert>
      </Snackbar>

      {/* JotForm Modal */}
      <Dialog
        open={showJotFormModal}
        onClose={() => setShowJotFormModal(false)}
        fullScreen
        sx={{
          '& .MuiDialog-paper': {
            margin: 0,
            maxHeight: '100vh',
          },
        }}
        PaperProps={{
          sx: {
            width: {
              xs: '100%',
              sm: '80%',
              md: '60%',
              lg: '50%',
            },
            maxWidth: '100%',
            maxHeight: '100vh',
          },
        }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h1" sx={{ fontWeight: 800 }}>
            Download Content Form
          </Typography>
          <IconButton
            aria-label="close"
            onClick={() => setShowJotFormModal(false)}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, height: '100%' }}>
          <JotFormEmbedWithSubmit
            formId={CONTENT_DOWNLOAD_JOTFORM_ID}
            queryParams={{
              programName: item?.content?.name || 'Unknown Program',
              program: getProgramValue(),
            }}
            onSubmit={handleJotFormSubmit}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default App;

const PlayerBox = ({
  item,
  identifier,
  courseId,
  unitId,
  userIdLocalstorageName,
  isGenerateCertificate,
  trackable,
}: any) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [play, setPlay] = useState(false);

  useEffect(() => {
    setPlay(true);
  }, []);

  const handlePlay = () => {
    setPlay(true);
  };
  return (
    <Box
      sx={{
        flex: { xs: 1, sm: 1, md: 8 },
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {!play ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            // alignItems: 'center',
            position: 'relative',
            width: '85%',
            backgroundColor: '#f5f5f5',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          {/* Show content poster image as preview instead of iframe */}
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <img
              src={item?.content?.posterImage || '/images/image_ver.png'}
              alt={
                item?.content?.name || item?.content?.title || 'Content Preview'
              }
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            {/* Play button overlay */}
            <Button
              variant="contained"
              onClick={handlePlay}
              sx={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '50px',
                height: '50px',
                minWidth: 'unset',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '3px solid #666666',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                  transform: 'translate(-50%, -50%) scale(1.05)',
                  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4)',
                },
                '&::before': {
                  content: '""',
                  width: 0,
                  height: 0,
                  borderLeft: '25px solid #000000',
                  borderTop: '15px solid transparent',
                  borderBottom: '15px solid transparent',
                  marginLeft: '6px',
                },
              }}
            >
              <span style={{ display: 'none' }}>{t('Play')}</span>
            </Button>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            width: '100%',
          }}
        >
          <iframe
            name={JSON.stringify({
              isGenerateCertificate: isGenerateCertificate,
              trackable: trackable,
            })}
            src={`${
              process.env.NEXT_PUBLIC_LEARNER_SBPLAYER
            }?identifier=${identifier}${
              courseId && unitId ? `&courseId=${courseId}&unitId=${unitId}` : ''
            }${
              userIdLocalstorageName
                ? `&userId=${localStorage.getItem(userIdLocalstorageName)}`
                : ''
            }`}
            style={{
              border: 'none',
              objectFit: 'contain',
              aspectRatio: '16 / 9',
            }}
            allowFullScreen
            width="100%"
            height="100%"
            title="Embedded Localhost"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
            frameBorder="0"
            scrolling="no"
            sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation"
          />
        </Box>
      )}
    </Box>
  );
};
