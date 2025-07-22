import React, { useState, useEffect } from 'react';
import Header from '../../../../components/Header';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useRouter } from 'next/router';
import GenericModal from '../../../../components/GenericModal';
import ConfirmationModal from '../../../../components/ConfirmationModal';
import {
  getAssessmentDetails,
  getAssessmentTracking,
  getOfflineAssessmentStatus,
  updateAssessmentScore,
} from '../../../../services/AssesmentService';
import {
  UploadOptionsPopup,
  UploadedImage,
} from '../../../../components/assessment';
import { getUserDetails } from '../../../../services/ProfileService';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import {
  getStatusIcon,
  getStatusLabel,
  mapAnswerSheetStatusToInternalStatus,
} from '../index';
import AnswerSheet, {
  AssessmentTrackingData,
} from '../../../../components/assessment/AnswerSheet';
import MinimizeIcon from '@mui/icons-material/Minimize';
interface ScoreDetail {
  questionId: string | null;
  pass: string;
  sectionId: string;
  resValue: string;
  duration: number;
  score: number;
  maxScore: number;
  queTitle: string;
}

interface AssessmentSummaryItem {
  item: {
    id: string;
    title: string;
    type: string;
    maxscore: number;
    params: any[];
    sectionId: string;
  };
  index: number;
  pass: string;
  score: number;
  resvalues: Array<{
    label?: string;
    value: any;
    selected: boolean;
    AI_suggestion: string;
  }>;
  duration: number;
  sectionName: string;
}

interface AssessmentSection {
  sectionId: string;
  sectionName: string;
  data: AssessmentSummaryItem[];
}

interface UpdateAssessmentScorePayload {
  userId: string;
  courseId: string;
  contentId: string;
  attemptId: string;
  lastAttemptedOn: string;
  timeSpent: number;
  totalMaxScore: number;
  totalScore: number;
  unitId: string;
  assessmentSummary: AssessmentSection[];
}

interface AssessmentRecord {
  id: string;
  questionId: string;
  answer: string;
  score?: number;
  maxScore?: number;
  // Add other record properties as needed
}

interface OfflineAssessmentData {
  userId: string;
  status: 'AI Pending' | 'AI Processed' | 'Approved';
  fileUrls: string[];
  records: AssessmentRecord[];
  // Add other properties as needed based on API response
}

const AssessmentDetails = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { assessmentId, userId } = router.query;
  const [expandedPanel, setExpandedPanel] = useState<string | false>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [editScore, setEditScore] = useState<string>('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [assessmentTrackingData, setAssessmentTrackingData] =
    useState<AssessmentTrackingData | null>();

  // Upload Options Popup state
  const [uploadPopupOpen, setUploadPopupOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<any>({
    name: '',
    lastName: '',
  });
  const [assessmentName, setAssessmentName] = useState<any>('');

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedPanel(isExpanded ? panel : false);
    };

  // Sample uploaded images data
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  // Upload Options Popup handlers
  const handleUploadInfoClick = () => {
    if (assessmentData?.status === 'AI Pending') {
      // setSnackbar({
      //   open: true,
      //   message: 'Please wait for the AI to process the assessment.',
      //   severity: 'error',
      // });
      router.push(`/ai-assessments/${assessmentId}/${userId}/upload-files`);
    } else if (assessmentData?.status === 'AI Processed') {
      router.push(`/ai-assessments/${assessmentId}/${userId}/upload-files`);
    } else {
      setUploadPopupOpen(true);
    }
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
  };

  const handleImageRemove = (imageId: string) => {
    // Remove from uploadedImages state
    const imageToRemove = uploadedImages.find((img) => img.id === imageId);
    if (imageToRemove) {
      setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));

      // Update assessmentData by removing the file URL
      if (assessmentData) {
        setAssessmentData({
          ...assessmentData,
          fileUrls: assessmentData.fileUrls.filter(
            (url) => url !== imageToRemove.url
          ),
        });
      }
    }
  };

  const [assessmentData, setAssessmentData] =
    useState<OfflineAssessmentData | null>(null);

  // Sync uploadedImages with assessmentData.fileUrls when data is loaded
  useEffect(() => {
    if (assessmentData?.fileUrls) {
      const imagesFromFileUrls = assessmentData.fileUrls.map((url, index) => ({
        id: `existing-${index}`,
        url: url,
        previewUrl: url,
        name: `uploaded-image-${index + 1}`,
        uploadedAt: new Date().toISOString(),
      }));
      setUploadedImages(imagesFromFileUrls);
    }
  }, [assessmentData]);

  const fetchOfflineAssessmentData = async (showSuccessMessage = false) => {
    try {
      const userData = await getOfflineAssessmentStatus({
        userIds: [userId as string],
        questionSetId: assessmentId as string,
      });

      if (userData?.result?.length > 0) {
        // Find the assessment data for the current user
        const currentUserData = userData.result.find(
          (item: OfflineAssessmentData) => item.userId === userId
        );
        if (currentUserData) {
          // Ensure fileUrls and records are arrays
          const sanitizedData: OfflineAssessmentData = {
            ...currentUserData,
            fileUrls: Array.isArray(currentUserData.fileUrls)
              ? currentUserData.fileUrls
              : [],
            records: Array.isArray(currentUserData.records)
              ? currentUserData.records
              : [],
          };
          setAssessmentData(sanitizedData);

          if (showSuccessMessage) {
            setSnackbar({
              open: true,
              message: 'Assessment status updated successfully',
              severity: 'success',
            });
          }

          // Check if we should fetch assessment tracking data
          if (
            currentUserData.status &&
            currentUserData.status !== 'AI Pending'
          ) {
            const response = await getAssessmentTracking({
              userId: userId as string,
              contentId: assessmentId as string,
              courseId: assessmentId as string,
              unitId: assessmentId as string,
            });
            if (response?.data?.length > 0) {
              // Find the latest assessment data by comparing timestamps
              const latestAssessment = response.data.reduce(
                (
                  latest: AssessmentTrackingData,
                  current: AssessmentTrackingData
                ) => {
                  const currentDate = Math.max(
                    new Date(current.createdOn).getTime(),
                    new Date(current.lastAttemptedOn).getTime(),
                    new Date(current.updatedOn).getTime()
                  );

                  const latestDate = Math.max(
                    new Date(latest.createdOn).getTime(),
                    new Date(latest.lastAttemptedOn).getTime(),
                    new Date(latest.updatedOn).getTime()
                  );

                  return currentDate > latestDate ? current : latest;
                },
                response.data[0]
              );

              setAssessmentTrackingData(latestAssessment);
            }
          }
        }
      } else {
        console.log('No offline assessment data found for user:', userId);
      }
    } catch (error) {
      console.error('Error fetching offline assessment data:', error);
      if (showSuccessMessage) {
        setSnackbar({
          open: true,
          message: 'Failed to refresh assessment status',
          severity: 'error',
        });
      }
      throw error;
    }
  };

  useEffect(() => {
    const fetchAssessmentData = async () => {
      if (assessmentId && userId) {
        try {
          if (assessmentId) {
            const response1 = await getAssessmentDetails(
              assessmentId as string
            );
            setAssessmentName(response1?.name);
          }
          if (userId) {
            const userDetailsResponse = await getUserDetails(
              userId as string,
              true
            );
            setUserDetails({
              name: userDetailsResponse?.result?.userData?.firstName,
              lastName: userDetailsResponse?.result?.userData?.lastName,
            });
          }
          await fetchOfflineAssessmentData(false);
        } catch (error) {
          console.error('Error fetching assessment data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAssessmentData();
  }, [assessmentId, userId]);

  const handleBack = () => {
    router.back();
  };

  const handleScoreClick = (question: ScoreDetail) => {
    setSelectedQuestion(question);
    setEditScore(question.score.toString());
    setIsEditModalOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSaveScore = async () => {
    if (!selectedQuestion || !assessmentTrackingData) return;

    try {
      setEditLoading(true);

      // Find the question in the assessment summary
      const updatedAssessmentSummary = assessmentTrackingData.score_details.map(
        (detail) => {
          const section: AssessmentSection = {
            sectionId: detail.sectionId,
            sectionName: 'Section 1', // You might want to get this from somewhere
            data: [
              {
                item: {
                  id: detail.questionId || '',
                  title: detail.queTitle,
                  type: 'sa', // You might want to get this from somewhere
                  maxscore: detail.maxScore,
                  params: [],
                  sectionId: detail.sectionId,
                },
                index: 1, // You might want to calculate this
                pass: Number(editScore) > 0 ? 'yes' : 'no',
                score: Number(editScore),
                resvalues: [JSON.parse(detail.resValue)],
                duration: detail.duration,
                sectionName: 'Section 1', // You might want to get this from somewhere
              },
            ],
          };
          return section;
        }
      );

      const payload: UpdateAssessmentScorePayload = {
        userId: assessmentTrackingData.userId,
        courseId: assessmentTrackingData.courseId,
        contentId: assessmentTrackingData.contentId,
        attemptId: assessmentTrackingData.attemptId,
        lastAttemptedOn: assessmentTrackingData.lastAttemptedOn,
        timeSpent: parseInt(assessmentTrackingData.timeSpent),
        totalMaxScore: assessmentTrackingData.totalMaxScore,
        totalScore:
          assessmentTrackingData.totalScore -
          selectedQuestion.score +
          Number(editScore), // Update total score
        unitId: assessmentTrackingData.unitId,
        assessmentSummary: updatedAssessmentSummary,
      };

      await updateAssessmentScore(payload);

      // Update local state
      const updatedScoreDetails = assessmentTrackingData.score_details.map(
        (detail) => {
          if (detail === selectedQuestion) {
            return {
              ...detail,
              score: Number(editScore),
              pass: Number(editScore) > 0 ? 'yes' : 'no',
            };
          }
          return detail;
        }
      );

      setAssessmentTrackingData({
        ...assessmentTrackingData,
        totalScore: payload.totalScore,
        score_details: updatedScoreDetails,
      });

      setSnackbar({
        open: true,
        message: 'Score updated successfully',
        severity: 'success',
      });
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating assessment score:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update score. Please try again.',
        severity: 'error',
      });
    } finally {
      setEditLoading(false);
    }
  };

  const handleApproveClick = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmApprove = () => {
    // TODO: Add API call to approve marks
    console.log('Marks approved');
    setIsConfirmModalOpen(false);
  };

  const handleRefreshAssessmentData = async () => {
    await fetchOfflineAssessmentData(true);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Header />

      <Box
        component="header"
        sx={{
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          padding: { xs: '12px 12px 8px 4px', md: '16px 24px 12px 16px' },
          bgcolor: '#FFFFFF',
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
            '& .MuiSvgIcon-root': {
              color: '#4D4639',
              width: '24px',
              height: '24px',
            },
          }}
        >
          <KeyboardBackspaceOutlinedIcon />
        </IconButton>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: '12px 0 0',
            flex: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: '#4D4639',
              fontSize: { xs: '22px', md: '24px' },
              lineHeight: 1.27,
              fontWeight: 400,
            }}
          >
            {userDetails.name} {userDetails.lastName}
          </Typography>
          <Typography
            sx={{
              color: '#7C766F',
              fontSize: { xs: '14px', md: '16px' },
              lineHeight: 1.43,
              fontWeight: 500,
              letterSpacing: '0.71%',
            }}
          >
            {assessmentName}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mx: '16px', my: '16px' }}>
        {/* Assessment Status */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            pb: 2,
          }}
        >
          {assessmentData?.status ? (
            <>
              {getStatusIcon(
                mapAnswerSheetStatusToInternalStatus(assessmentData.status)
              )}
              <Typography
                sx={{
                  color: '#1F1B13',
                  fontSize: { xs: '14px', md: '16px' },
                  fontWeight: 400,
                }}
              >
                {getStatusLabel(assessmentData.status)}
              </Typography>
            </>
          ) : (
            <Typography
              sx={{
                color: '#1F1B13',
                fontSize: { xs: '14px', md: '16px' },
                fontWeight: 400,
              }}
            >
              <MinimizeIcon />
              Not Submitted
            </Typography>
          )}
        </Box>

        {/* Images Info */}
        <Box
          onClick={handleUploadInfoClick}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: '1px solid #DBDBDB',
            borderRadius: '12px',
            p: { xs: 2, md: 2 },
            mb: { xs: 2, md: 2 },
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: theme.palette.primary.main,
              backgroundColor: '#f5f5f5',
              transform: 'translateY(-1px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            },
          }}
        >
          <Box>
            <Typography
              sx={{
                color: '#635E57',
                fontSize: { xs: '14px', md: '16px' },
                fontWeight: 400,
                letterSpacing: '0.1px',
              }}
            >
              {assessmentData?.fileUrls && assessmentData.fileUrls.length > 0
                ? `${assessmentData.fileUrls.length} images uploaded`
                : 'No images uploaded'}
            </Typography>
            {assessmentData?.records && assessmentData.records.length > 0 && (
              <Typography
                sx={{
                  color: '#7C766F',
                  fontSize: { xs: '12px', md: '14px' },
                  fontWeight: 500,
                  letterSpacing: '4.17%',
                  lineHeight: 1.33,
                }}
              >
                {assessmentData.records.length} assessment record(s) available
              </Typography>
            )}
          </Box>
          <IconButton
            sx={{
              color: '#1F1B13',
              p: 0,
              '& .MuiSvgIcon-root': {
                fontSize: { xs: 24, md: 28 },
              },
            }}
          >
            {assessmentData?.status === 'AI Pending' ? (
              <CircularProgress size={24} />
            ) : assessmentData?.status === 'AI Processed' ? (
              <ArrowForwardIcon />
            ) : (
              <FileUploadIcon />
            )}
          </IconButton>
        </Box>
      </Box>

      {!assessmentTrackingData ? (
        assessmentData?.status === 'AI Pending' ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '200px',
              gap: 2,
              padding: '20px',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: '#1F1B13',
                fontSize: { xs: '18px', md: '20px' },
                fontWeight: 500,
                marginBottom: '16px',
              }}
            >
              Your answer sheets have been successfully uploaded
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#1F1B13',
                fontSize: { xs: '16px', md: '18px' },
                fontWeight: 400,
                marginBottom: '8px',
              }}
            >
              What's happening now:
            </Typography>
            <Box sx={{ textAlign: 'left', width: '100%', maxWidth: '400px' }}>
              <Typography
                sx={{
                  color: '#1F1B13',
                  fontSize: { xs: '14px', md: '16px' },
                  fontWeight: 400,
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  '&:before': {
                    content: '"•"',
                    marginRight: '8px',
                  },
                }}
              >
                Answers are being scanned and digitized
              </Typography>
              <Typography
                sx={{
                  color: '#1F1B13',
                  fontSize: { xs: '14px', md: '16px' },
                  fontWeight: 400,
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  '&:before': {
                    content: '"•"',
                    marginRight: '8px',
                  },
                }}
              >
                The AI is assigning marks based on the rubric
              </Typography>
              <Typography
                sx={{
                  color: '#1F1B13',
                  fontSize: { xs: '14px', md: '16px' },
                  fontWeight: 400,
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  '&:before': {
                    content: '"•"',
                    marginRight: '8px',
                  },
                }}
              >
                Question-wise feedback and an overall score will be available
                shortly
              </Typography>
            </Box>
            {/* <Typography
              sx={{
                color: '#1F1B13',
                fontSize: { xs: '14px', md: '16px' },
                fontWeight: 400,
                marginTop: '8px',
              }}
            >
              You'll be notified once the results are ready.
            </Typography> */}
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '200px',
            }}
          >
            <Typography>No answer sheet has been submitted yet</Typography>
          </Box>
        )
      ) : (
        <AnswerSheet
          assessmentTrackingData={assessmentTrackingData}
          onApprove={handleApproveClick}
          onScoreEdit={handleScoreClick}
          expandedPanel={expandedPanel}
          onAccordionChange={handleAccordionChange}
        />
      )}

      {/* Edit Modal */}
      <GenericModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Marks"
        onSave={handleSaveScore}
        maxWidth="400px"
      >
        <Box sx={{ width: '100%', position: 'relative' }}>
          <TextField
            label="Marks"
            type="number"
            value={editScore}
            onChange={(e) => {
              const value = e.target.value;
              if (
                selectedQuestion &&
                Number(value) <= selectedQuestion.maxScore
              ) {
                setEditScore(value);
              }
            }}
            fullWidth
            required
            inputProps={{
              min: 0,
              max: selectedQuestion?.maxScore || 0,
            }}
            helperText={`Maximum marks: ${selectedQuestion?.maxScore || 0}`}
            disabled={editLoading}
          />
          {editLoading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
              }}
            >
              <CircularProgress size={24} />
            </Box>
          )}
        </Box>
      </GenericModal>

      {/* Confirmation Modal */}
      <ConfirmationModal
        buttonNames={{ primary: 'Approve', secondary: 'Cancel' }}
        modalOpen={isConfirmModalOpen}
        handleCloseModal={() => setIsConfirmModalOpen(false)}
        handleAction={handleConfirmApprove}
        // title="Are you sure you want to approve Marks?"
        message="Be sure to review the answers and make any necessary changes to the marks before approving the final scores."
      />
      {/* Upload Options Popup */}
      <UploadOptionsPopup
        isOpen={uploadPopupOpen}
        onClose={handleCloseUploadPopup}
        uploadedImages={uploadedImages}
        onImageUpload={handleImageUpload}
        onImageRemove={handleImageRemove}
        userId={typeof userId === 'string' ? userId : undefined}
        questionSetId={
          typeof assessmentId === 'string' ? assessmentId : undefined
        }
        identifier={typeof assessmentId === 'string' ? assessmentId : undefined}
        onSubmissionSuccess={handleRefreshAssessmentData}
      />

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

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

export default AssessmentDetails;
