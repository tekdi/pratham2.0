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
  Grid,
  IconButton,
  Snackbar,
  Alert,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { ContentSearch } from '@learner/utils/API/contentService';
import { checkAuth } from '@shared-lib-v2/utils/AuthService';
import { isDownloadContentEnabled } from '@shared-lib-v2/SwitchAccount/DownloadContent.config';
import {
  ExpandableText,
  findCourseUnitPath,
  useTranslation,
} from '@shared-lib';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import { fetchContent } from '@learner/utils/API/contentService';
import BreadCrumb from '@content-mfes/components/BreadCrumb';
import { hierarchyAPI } from '@content-mfes/services/Hierarchy';
import JotFormEmbedWithSubmit from '@learner/components/JotFormEmbed/JotFormEmbedWithSubmit';
import { CONTENT_DOWNLOAD_JOTFORM_ID } from '../../../app.config';

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
  const [isShowMoreContent, setIsShowMoreContent] = useState(false);
  const [mimeType, setMemetype] = useState('');
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
      const rt = (await hierarchyAPI(courseId as string)) as any;
      console.log('rt=======>', rt);
      const currentPath =
        typeof window !== 'undefined' ? window.location.pathname : '';
      const isThematicPath = currentPath.includes('/themantic');
      const isPosPath = currentPath.includes('/pos');

      if (!isThematicPath && !isPosPath && rt?.program) {
        console.log('response=======>', rt?.program);
        if(localStorage.getItem('channelId')==="pos-channel"){
        if (
          !rt?.program?.includes(localStorage.getItem('userProgram')) &&
          !rt.program.includes('Open School')
        ) {
          router.push('/unauthorized');
          return;
        }
      }
      }
      if(localStorage.getItem('channelId')!==rt.channel)
      {
        router.push('/unauthorized');
        return;
      }

      const response2 = await ContentSearch({
        filters: {
          identifier: [identifier],
        },
        limit: 1,
        offset: 0,
      });
      const resultKeys = Object.keys(response2.result).filter(
        (k) => k !== 'count'
      );
      const firstKey = resultKeys[0];

      const mimeType = response2.result[firstKey][0].mimeType;
      console.log('response2=======>', mimeType);

      setMemetype(mimeType);
      setItem({ content: response });
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
        setBreadCrumbs(breadcrum?.slice(0, -1));
      } else {
        setBreadCrumbs([]);
      }
    };
    fetch();
  }, [identifier, unitId, courseId, activeLink, contentBaseUrl]);

  if (!identifier) {
    return <div>Loading...</div>;
  }
  const onBackClick = () => {
    // if (breadCrumbs?.length > 1) {
    //   if (breadCrumbs?.[breadCrumbs.length - 1]?.link) {
    //     router.push(breadCrumbs?.[breadCrumbs.length - 1]?.link);
    //   }
    // } else if (contentBaseUrl) {
    //   router.back();
    // } else {
    //   router.push(`${activeLink ? activeLink : '/content'}`);
    // }
    router.back();
  };

  // Handle download after form submission
  const handleDownloadContent = async () => {
    if (!pendingDownload) {
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
      } catch (error) {
        setIsDownloading(false);
        setPendingDownload(null);
      }
      return;
    }

    setIsDownloading(true);

    try {
      // Fetch the file as a blob to force download
      const response = await fetch(pendingDownload.url);
      const blob = await response.blob();

      // Create a blob URL
      const blobUrl = window.URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement('a');
      link.href = blobUrl;

      // Set filename with proper extension
      const extension = getFileExtension(pendingDownload.mimeType) || '.bin';
      const fileName = pendingDownload.name
        ? `${pendingDownload.name}${extension}`
        : `content${extension}`;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
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
    } catch (error) {
      setIsDownloading(false);
      setPendingDownload(null);
    }
  };

  // Handle JotForm submission
  const handleJotFormSubmit = () => {
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
    // Store download info and show form
    const downloadData = {
      url: item.content.artifactUrl,
      name: item.content.name,
      mimeType: item.content.mimeType || mimeType,
    };
    setPendingDownload(downloadData);
    setShowJotFormModal(true);
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        px: { xs: 2 },
        pb: { xs: 1 },
        pt: { xs: 2, sm: 2, md: 1 },
      }}
    >
      <Grid
        sx={{
          display: 'flex',
          flex: { xs: 1, md: 15 },
          gap: 1,
          flexDirection: 'column',
          width: isShowMoreContent ? 'initial' : '100%',
        }}
        item
        xs={12}
        sm={12}
        md={isShowMoreContent ? 8 : 12}
        lg={isShowMoreContent ? 8 : 12}
        xl={isShowMoreContent ? 8 : 12}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <IconButton
            aria-label="back"
            onClick={onBackClick}
            sx={{ width: '24px', height: '24px' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <BreadCrumb breadCrumbs={breadCrumbs} isShowLastLink />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            // pb: 2,
          }}
        >
          <Typography
            variant="body8"
            component="h2"
            sx={{
              fontWeight: 700,
              // fontSize: '24px',
              // lineHeight: '44px',
            }}
          >
            {item?.content?.name ?? '-'}
          </Typography>
          {item?.content?.description && (
            <ExpandableText
              text={item?.content?.description}
              maxWords={60}
              maxLines={2}
              _text={{
                fontSize: { xs: '14px', sm: '16px', md: '18px' },
                lineHeight: { xs: '20px', sm: '22px', md: '26px' },
              }}
            />
          )}
        </Box>
        <PlayerBox
          isShowMoreContent={isShowMoreContent}
          userIdLocalstorageName={userIdLocalstorageName}
          item={item}
          identifier={identifier}
          courseId={courseId}
          unitId={unitId}
          mimeType={mimeType}
          {..._config?.player}
        />
        {item?.content?.artifactUrl &&
          isDownloadableMimeType(item?.content?.mimeType || mimeType) &&
          isDownloadContentEnabled() && (
            <Box
              sx={{
                my: 3,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '60px',
              }}
            >
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
                  ? (item?.content?.mimeType || mimeType) === 'video/x-youtube'
                    ? 'Opening...'
                    : 'Downloading...'
                  : (item?.content?.mimeType || mimeType) === 'video/x-youtube'
                  ? 'Open in New Tab'
                  : 'Download Content'}
              </Button>
            </Box>
          )}
      </Grid>

      <Grid
        sx={{
          display: isShowMoreContent ? 'flex' : 'none',
          flexDirection: 'column',
          flex: { xs: 1, sm: 1, md: 9 },
        }}
        xs={12}
        sm={12}
        md={isShowMoreContent ? 4 : 12}
        lg={isShowMoreContent ? 4 : 12}
        xl={isShowMoreContent ? 4 : 12}
      >
        <Box
          sx={{
            mb: 2,
            px: {
              xs: 2,
              sm: 3,
              md: 4,
              lg: 0,
              xl: 0,
            },
          }}
        >
          <Typography
            variant="body5"
            component="h2"
            sx={{
              mb: 2,
              fontWeight: 500,
              // fontSize: '18px',
              // lineHeight: '24px',
              mt: 3,
            }}
          >
            {t('LEARNER_APP.PLAYER.MORE_RELATED_RESOURCES')}
          </Typography>

          <CourseUnitDetails
            isShowLayout={false}
            isHideInfoCard={true}
            _box={{
              pt: 1,
              pb: 1,
              px: { md: 1 },
              height: 'calc(100vh - 185px)',
            }}
            _config={{
              ...(_config?.courseUnitDetails || {}),
              getContentData: (item: any) => {
                setIsShowMoreContent(
                  item.children.filter(
                    (item: any) => item.identifier !== identifier
                  )?.length > 0
                );
              },
              _parentGrid: { pb: 2 },
              default_img: '/images/image_ver.png',
              _grid: { xs: 6, sm: 4, md: 6, lg: 6, xl: 6 },
              _card: {
                isHideProgress: true,
                ...(_config?.courseUnitDetails?._card || {}),
              },
            }}
          />
        </Box>
      </Grid>

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
          {(item?.content?.mimeType || mimeType) === 'video/x-youtube'
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
    </Grid>
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
  isShowMoreContent,
  mimeType,
}: any) => {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [play, setPlay] = useState(false);

  // Determine aspectRatio based on mimeType and mobile mode
  const getAspectRatio = () => {
    if (mimeType === 'application/vnd.sunbird.questionset' && isMobile) {
      return '9/16';
    }
    return '16/9';
  };

  useEffect(() => {
    if (checkAuth() || userIdLocalstorageName) {
      setPlay(true);
    }
  }, []);

  const handlePlay = () => {
    if (checkAuth() || userIdLocalstorageName) {
      setPlay(true);
    } else {
      router.push(
        `/login?redirectUrl=${
          courseId ? `/content-details/${courseId}` : `/player/${identifier}`
        }`
      );
    }
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
      {!play && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <Avatar
            src={item?.posterImage ?? `/images/image_ver.png`}
            alt={item?.identifier}
            style={{
              height: 'calc(100vh - 235px)',
              width: '100%',
              borderRadius: 0,
            }}
          />
          <Button
            variant="contained"
            onClick={handlePlay}
            sx={{
              mt: 2,
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            {t('Play')}
          </Button>
        </Box>
      )}

      {play && (
        <Box
          sx={{
            width: isShowMoreContent
              ? '100%'
              : { xs: '100%', sm: '100%', md: '90%', lg: '80%', xl: '70%' },
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
              aspectRatio: getAspectRatio(),
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
