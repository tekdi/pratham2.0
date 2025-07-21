import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import {
  Box,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Header from '../../../../../components/Header';
import {
  UploadOptionsPopup,
  UploadedImage,
} from '../../../../../components/assessment';
import {
  getAssessmentDetails,
  getOfflineAssessmentStatus,
} from '../../../../../services/AssesmentService';
import { getUserDetails } from '../../../../../services/ProfileService';
import ImageViewer from '../../../../../components/assessment/ImageViewer';

interface AssessmentRecord {
  id: string;
  questionId: string;
  answer: string;
  score?: number;
  maxScore?: number;
}

interface OfflineAssessmentData {
  userId: string;
  status: 'AI Pending' | 'AI Processed' | 'Approved';
  fileUrls: string[];
  records: AssessmentRecord[];
}

interface AssessmentDataResponse {
  result: OfflineAssessmentData[];
  responseCode?: string;
}

const FilesPage = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { assessmentId, userId } = router.query;

  const [loading, setLoading] = useState(true);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploadPopupOpen, setUploadPopupOpen] = useState(false);
  const [assessmentData, setAssessmentData] =
    useState<OfflineAssessmentData | null>(null);
  const [userDetails, setUserDetails] = useState<any>({
    firstName: '',
    lastName: '',
    enrollmentId: '',
  });
  const [assessmentName, setAssessmentName] = useState<string>('');
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!assessmentId || !userId) return;

      try {
        setLoading(true);

        // Fetch assessment data
        const userData = await getOfflineAssessmentStatus({
          userIds: [userId as string],
          questionSetId: assessmentId as string,
        });

        if (userData?.result && userData.result.length > 0) {
          const data = userData.result[0];
          setAssessmentData(data);

          // Convert fileUrls to UploadedImage format
          const images: UploadedImage[] = data.fileUrls.map(
            (url: any, index: any) => ({
              id: `image-${index}`,
              url: url,
              previewUrl: url,
              name: `Image ${index + 1}`,
              uploadedAt: new Date().toISOString(),
            })
          );
          setUploadedImages(images);
        }

        if (assessmentId) {
          const response = await getAssessmentDetails(assessmentId as string);
          setAssessmentName(response?.name);
        }
        // Fetch user details
        const userInfo = await getUserDetails(userId as string);
        if (userInfo?.result) {
          setUserDetails(userInfo.result.userData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load assessment data',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assessmentId, userId]);

  const handleBack = () => {
    router.back();
  };

  const handleUploadClick = () => {
    setUploadPopupOpen(true);
  };

  const handleCloseUploadPopup = () => {
    setUploadPopupOpen(false);
  };

  const handleImageUpload = (newImage: UploadedImage) => {
    setUploadedImages((prev) => [...prev, newImage]);

    // Update assessmentData with new file URL
    if (assessmentData) {
      setAssessmentData({
        ...assessmentData,
        fileUrls: [...assessmentData.fileUrls, newImage.url],
      });
    }

    setSnackbar({
      open: true,
      message: 'Image uploaded successfully',
      severity: 'success',
    });
  };

  const handleSelectClick = () => {
    setIsSelecting(!isSelecting);
    setSelectedImages(new Set());
  };

  const handleImageSelect = (imageId: string) => {
    if (!isSelecting) return;

    const newSelected = new Set(selectedImages);
    if (newSelected.has(imageId)) {
      newSelected.delete(imageId);
    } else {
      newSelected.add(imageId);
    }
    setSelectedImages(newSelected);
  };

  const handleImageClick = (imageUrl: string) => {
    if (!isSelecting) {
      setSelectedImageUrl(imageUrl);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Status Bar */}
      <Box
        sx={{
          width: '100%',
          height: '32px',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 16px',
          gap: '8px',
        }}
      >
        <Box
          sx={{
            width: '18px',
            height: '14px',
            backgroundColor: '#000000',
            opacity: 0.7,
          }}
        />
        <Box
          sx={{
            width: '14px',
            height: '14px',
            backgroundColor: '#000000',
            opacity: 0.7,
          }}
        />
        <Box
          sx={{
            width: '9px',
            height: '14px',
            backgroundColor: '#000000',
            opacity: 0.7,
          }}
        />
        <Box
          sx={{
            width: '33px',
            height: '10px',
            backgroundColor: '#000000',
            opacity: 0.7,
          }}
        />
      </Box>

      {/* App Header */}
      <Header />

      {/* Page Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 12px 16px 4px',
          backgroundColor: '#FFFFFF',
        }}
      >
        <IconButton
          onClick={handleBack}
          sx={{
            width: '48px',
            height: '48px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '100px',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          <KeyboardBackspaceOutlinedIcon
            sx={{
              width: '24px',
              height: '24px',
              color: '#4D4639',
            }}
          />
        </IconButton>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
          }}
        >
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: '22px',
              lineHeight: '28px',
              color: '#4D4639',
            }}
          >
            {uploadedImages.length} Images Uploaded
          </Typography>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '0.1px',
              color: '#7C766F',
            }}
          >
            {assessmentName}
          </Typography>
        </Box>
      </Box>

      {/* User Info */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '0 19px',
          marginBottom: '16px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              color: '#969088',
            }}
          >
            Learner
          </Typography>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              color: '#4D4639',
            }}
          >
            {userDetails.firstName} {userDetails.lastName}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              color: '#969088',
            }}
          >
            Enrollment ID
          </Typography>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              color: '#4D4639',
            }}
          >
            {userDetails.enrollmentId || '7018103814131'}
          </Typography>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box
        sx={{
          display: 'none',
          gap: '8px',
          padding: '0 8px',
          marginBottom: '16px',
        }}
      >
        <Button
          onClick={handleUploadClick}
          sx={{
            height: '40px',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px 16px 10px 12px',
            '&:hover': {
              backgroundColor: 'rgba(13, 89, 158, 0.04)',
            },
          }}
        >
          <FileUploadIcon
            sx={{
              width: '18px',
              height: '18px',
              color: '#0D599E',
            }}
          />
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '0.1px',
              color: '#0D599E',
              textTransform: 'none',
            }}
          >
            Upload
          </Typography>
        </Button>

        <Button
          onClick={handleSelectClick}
          sx={{
            height: '40px',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px 12px',
            marginLeft: 'auto',
            '&:hover': {
              backgroundColor: 'rgba(13, 89, 158, 0.04)',
            },
          }}
        >
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '0.1px',
              color: '#0D599E',
              textTransform: 'none',
            }}
          >
            {isSelecting ? 'Done' : 'Select'}
          </Typography>
        </Button>
      </Box>

      {/* Images Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns:
            uploadedImages.length === 0 ? '1fr' : 'repeat(2, 1fr)',
          gap: 0,
          flex: 1,
        }}
      >
        {uploadedImages.map((image: UploadedImage) => (
          <Box
            key={image.id}
            onClick={() =>
              isSelecting
                ? handleImageSelect(image.id)
                : handleImageClick(image.url)
            }
            sx={{
              position: 'relative',
              backgroundColor: '#F5F5F5',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              aspectRatio: '9/12',
              overflow: 'hidden',
              '&:hover': {
                opacity: isSelecting ? 0.8 : 0.9,
              },
            }}
          >
            <Box
              component="img"
              src={image.url}
              alt={image.name}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
            {isSelecting && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: selectedImages.has(image.id)
                    ? '#0D599E'
                    : 'rgba(255, 255, 255, 0.8)',
                  border: selectedImages.has(image.id)
                    ? 'none'
                    : '2px solid #FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {selectedImages.has(image.id) && (
                  <Box
                    sx={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '50%',
                    }}
                  />
                )}
              </Box>
            )}
          </Box>
        ))}

        {uploadedImages.length === 0 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '200px',
              width: '100%',
            }}
          >
            <Typography
              sx={{
                color: '#969088',
                fontSize: '16px',
                fontWeight: 500,
                textAlign: 'center',
                mb: 1,
              }}
            >
              No images uploaded yet
            </Typography>
            <Typography
              sx={{
                color: '#969088',
                fontSize: '14px',
                fontWeight: 400,
                textAlign: 'center',
              }}
            >
              Please upload assessment images to begin
            </Typography>
          </Box>
        )}
      </Box>

      {/* Image Viewer */}
      <ImageViewer
        open={!!selectedImageUrl}
        onClose={() => setSelectedImageUrl(null)}
        imageUrl={selectedImageUrl || ''}
      />

      {/* Upload Options Popup */}
      <UploadOptionsPopup
        isOpen={uploadPopupOpen}
        onClose={handleCloseUploadPopup}
        uploadedImages={uploadedImages}
        onImageUpload={handleImageUpload}
        userId={typeof userId === 'string' ? userId : undefined}
        questionSetId={
          typeof assessmentId === 'string' ? assessmentId : undefined
        }
        identifier={typeof assessmentId === 'string' ? assessmentId : undefined}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FilesPage;

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({
  params,
  locale,
}: {
  params: any;
  locale: string;
}) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
