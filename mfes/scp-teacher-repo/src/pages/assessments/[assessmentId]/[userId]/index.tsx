import React, { useState, useEffect } from 'react';
import Header from '../../../../components/Header';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useRouter } from 'next/router';
import GenericModal from '../../../../components/GenericModal';
import ConfirmationModal from '../../../../components/ConfirmationModal';
import {
  getAssessmentDetails,
  getAssessmentTracking,
  updateAssessmentScore,
} from '../../../../services/AssesmentService';
import {
  UploadOptionsPopup,
  UploadedImage,
} from '../../../../components/assessment';
import { getUserDetails } from '../../../../services/ProfileService';
import FileUploadIcon from '@mui/icons-material/FileUpload';

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

interface AssessmentTrackingData {
  assessmentTrackingId: string;
  userId: string;
  courseId: string;
  contentId: string;
  attemptId: string;
  createdOn: string;
  lastAttemptedOn: string;
  totalMaxScore: number;
  totalScore: number;
  updatedOn: string;
  timeSpent: string;
  unitId: string;
  score_details: ScoreDetail[];
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
    setUploadPopupOpen(true);
  };

  const handleCloseUploadPopup = () => {
    setUploadPopupOpen(false);
  };

  const handleReupload = () => {
    console.log('Re-upload images');
    // Implement re-upload logic
  };

  const handleViewImages = () => {
    console.log('View all images');
    // Implement view images logic
  };

  const handleDownload = () => {
    console.log('Download all images');
    // Implement download logic
  };

  const handleImageUpload = (newImage: UploadedImage) => {
    setUploadedImages((prev) => [...prev, newImage]);
  };

  const [assessmentData, setAssessmentData] = useState({
    studentName: 'Bharat Kumar',
    examType: 'Mid Term Exam',
    date: '2 Feb, 2024',
    totalMarks: 250,
    marksObtained: 210,
    percentage: 88,
    uploadedImages: 4,
    questions: [
      {
        id: 1,
        question: 'What is the derivative of x²?',
        marks: 3,
        score: 0,
        answer: '788',
        explanation:
          'The derivative of x² is 2x. This is because to find the derivative you take the number x is being powered to, in this case 2, and move it to the front of the variable. After doing this you subtract the number x is being powered to by one.',
        isCorrect: false,
      },
      {
        id: 2,
        question: 'What is the derivative of x⁵?',
        marks: 3,
        score: 3,
        answer: '2x',
        isCorrect: true,
      },
      {
        id: 3,
        question: 'What is the derivative of x³?',
        marks: 3,
        score: 3,
        answer: 'A long question answer here just for example.',
        isCorrect: true,
      },
      {
        id: 4,
        question: 'What is the derivative of x⁴?',
        marks: 3,
        score: 0,
        answer: '788',
        explanation:
          'The derivative of x² is 2x. This is because to find the derivative you take the number x is being powered to, in this case 2, and move it to the front of the variable. After doing this you subtract the number x is being powered to by one.',
        isCorrect: false,
      },
    ],
  });

  useEffect(() => {
    console.log('assessmentId', assessmentId);
    console.log('userId', userId);
    const fetchAssessmentData = async () => {
      if (assessmentId && userId) {
        try {
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

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (userId) {
        const userDetailsResponse = await getUserDetails(
          userId as string,
          true
        );
        console.log('userDetailsResponse', userDetailsResponse);
        setUserDetails({
          name: userDetailsResponse?.result?.userData?.firstName,
          lastName: userDetailsResponse?.result?.userData?.lastName,
        });
      }
    };
    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchAssessmentDetails = async () => {
      if (assessmentId) {
        const response = await getAssessmentDetails(assessmentId as string);
        console.log('response', response.name);
        setAssessmentName(response?.name);
      }
    };
    fetchAssessmentDetails();
  }, []);

  // Update parseResValue function
  const parseResValue = (
    resValue: string
  ): { response: string; aiSuggestion: string } => {
    try {
      const parsed = JSON.parse(resValue);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const response = parsed[0];
        return {
          response: response.label
            ? response.label.replace(/<\/?p>/g, '')
            : response.value || 'No response',
          aiSuggestion: response.AI_suggestion || 'No AI suggestion available',
        };
      }
      return {
        response: 'No response',
        aiSuggestion: 'No AI suggestion available',
      };
    } catch (error) {
      console.error('Error parsing resValue:', error);
      return {
        response: 'Invalid response format',
        aiSuggestion: 'No AI suggestion available',
      };
    }
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
        {/* Images Info */}
        <Box
          onClick={handleUploadInfoClick}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: '1px solid #DBDBDB',
            borderRadius: '12px',
            p: { xs: 2, md: 3 },
            mb: { xs: 2, md: 3 },
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: '#1976d2',
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
              {/* {assessmentData.uploadedImages} images uploaded */}
              No images uploaded
            </Typography>
            {/* <Typography
              sx={{
                color: '#7C766F',
                fontSize: { xs: '12px', md: '14px' },
                fontWeight: 500,
                letterSpacing: '4.17%',
                lineHeight: 1.33,
              }}
            >
              {assessmentData.date}
            </Typography> */}
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
            <FileUploadIcon />
          </IconButton>
        </Box>
      </Box>

      {!assessmentData || !assessmentTrackingData ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography>No assessment data found</Typography>
        </Box>
      ) : (
        <>
          <Typography
            sx={{
              color: '#1F1B13',
              fontSize: { xs: '14px', md: '16px' },
              fontWeight: 500,
              letterSpacing: '0.71%',
              lineHeight: 1.43,
              mb: { xs: 2, md: 3 },
              mx: { xs: 2, md: 3 },
            }}
          >
            {assessmentTrackingData ? (
              <>
                Marks:{' '}
                <span style={{ color: '#1A8825' }}>
                  {assessmentTrackingData.totalScore || 0}/
                  {assessmentTrackingData.totalMaxScore || 0} (
                  {assessmentTrackingData.totalMaxScore > 0
                    ? Math.round(
                        (assessmentTrackingData.totalScore /
                          assessmentTrackingData.totalMaxScore) *
                          100
                      )
                    : 0}
                  %)
                </span>
              </>
            ) : (
              'Marks: Not Available'
            )}
          </Typography>
          <Box
            sx={{
              px: { xs: 2, md: 3 },
            }}
          >
            <Button
              variant="contained"
              fullWidth
              onClick={handleApproveClick}
              sx={{
                bgcolor: '#FDBE16',
                color: '#4D4639',
                textTransform: 'none',
                borderRadius: '100px',
                height: { xs: '40px', md: '48px' },
                fontSize: { xs: '14px', md: '16px' },
                fontWeight: 500,
                letterSpacing: '0.71%',
                maxWidth: { xs: '100%', md: '400px' },
                display: 'block',
                margin: '0 auto 24px',
                '&:hover': {
                  bgcolor: '#FDBE16',
                },
              }}
            >
              Approve Marks & Notify Learner
            </Button>
          </Box>

          <Box
            sx={{
              px: { xs: 2, md: 3 },
            }}
          >
            <Box
              sx={{
                bgcolor: '#F8EFE7',
                border: '1px solid #D0C5B4',
                borderRadius: '16px',
                width: '100%',
                pt: { xs: 2, md: 3 },
                pb: { xs: 4, md: 6 },
              }}
            >
              {/* Approve Button */}

              <Box
                sx={{
                  margin: '0 auto',
                  px: { xs: 2, md: 3 },
                }}
              >
                {/* Questions List */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: { xs: '16px', md: '24px' },
                  }}
                >
                  {assessmentTrackingData.score_details.map(
                    (question, index) => (
                      <Box key={index}>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              gap: { xs: '16px', md: '24px' },
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                            }}
                          >
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                sx={{
                                  fontFamily: 'Poppins',
                                  fontWeight: 400,
                                  fontSize: { xs: '14px', md: '16px' },
                                  letterSpacing: '0.25px',
                                  color: '#1F1B13',
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: `Q${index + 1}. ${question.queTitle}`,
                                }}
                              />
                            </Box>
                            <Box
                              onClick={() => handleScoreClick(question)}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: { xs: '4px 8px', md: '6px 12px' },
                                bgcolor:
                                  question.pass.toLowerCase() === 'yes'
                                    ? question.score === question.maxScore
                                      ? '#1A8825'
                                      : '#987100'
                                    : '#BA1A1A',
                                borderRadius: '4px',
                                border: '1px solid #FFFFFF',
                                cursor: 'pointer',
                              }}
                            >
                              <Typography
                                sx={{
                                  color: '#FFFFFF',
                                  fontSize: { xs: '14px', md: '16px' },
                                }}
                              >
                                {question.score}/{question.maxScore}
                              </Typography>
                              <BorderColorIcon
                                sx={{
                                  color: '#FFFFFF',
                                  fontSize: { xs: 18, md: 20 },
                                }}
                              />
                            </Box>
                          </Box>
                          {/* Student Response and AI Suggestion */}
                          <Typography
                            sx={{
                              fontFamily: 'Poppins',
                              fontWeight: 500,
                              fontSize: { xs: '16px', md: '18px' },
                              letterSpacing: '0.15px',
                              color:
                                question.pass.toLowerCase() === 'yes'
                                  ? question.score === question.maxScore
                                    ? '#1A8825'
                                    : '#987100'
                                  : '#BA1A1A',
                            }}
                          >
                            {parseResValue(question.resValue).response}
                          </Typography>
                          {parseResValue(question.resValue).aiSuggestion &&
                            parseResValue(question.resValue).aiSuggestion !==
                              'No AI suggestion available' && (
                              <Accordion
                                expanded={expandedPanel === `panel-${index}`}
                                onChange={handleAccordionChange(
                                  `panel-${index}`
                                )}
                                sx={{
                                  backgroundColor: '#FFF5F5',
                                  boxShadow: 'none',
                                  borderRadius: '8px',
                                  border: '1px solid #FFE6E6',
                                  '&:before': {
                                    display: 'none',
                                  },
                                  '&.Mui-expanded': {
                                    margin: 0,
                                  },
                                }}
                              >
                                <AccordionSummary
                                  expandIcon={
                                    <KeyboardArrowDownIcon
                                      sx={{ color: '#666666' }}
                                    />
                                  }
                                  sx={{
                                    padding: '12px 16px',
                                    minHeight: 'unset',
                                    '&.Mui-expanded': {
                                      minHeight: '48px',
                                    },
                                    '& .MuiAccordionSummary-content': {
                                      margin: 0,
                                      '&.Mui-expanded': {
                                        margin: '0px 0',
                                      },
                                    },
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      color: '#666666',
                                      fontSize: { xs: '14px', md: '16px' },
                                      fontWeight: 500,
                                      letterSpacing: '0.5px',
                                      textTransform: 'uppercase',
                                    }}
                                  >
                                    Explanation:
                                  </Typography>
                                </AccordionSummary>
                                <AccordionDetails
                                  sx={{ padding: '0px 16px 16px 16px' }}
                                >
                                  <Typography
                                    sx={{
                                      color: '#666666',
                                      fontSize: { xs: '14px', md: '16px' },
                                      fontWeight: 400,
                                      lineHeight: 1.6,
                                    }}
                                  >
                                    {
                                      parseResValue(question.resValue)
                                        .aiSuggestion
                                    }
                                  </Typography>
                                </AccordionDetails>
                              </Accordion>
                            )}
                        </Box>
                      </Box>
                    )
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </>
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
        open={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmApprove}
        title="Are you sure you want to approve Marks?"
        message="Be sure to review the answers and make any necessary changes to the marks before approving the final scores."
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
