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
  hierarchyContent,
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
import {
  createQuestionNumberingMap,
  createSectionMapping,
} from '../../../../utils/questionNumbering';
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
  submitedBy?: string; // Optional field for evaluation source
}

interface AssessmentRecord {
  assessmentTrackingId: string;
  userId: string;
  courseId: string;
  contentId: string;
  attemptId: string;
  createdOn: string;
  lastAttemptedOn: string;
  assessmentSummary: {
    data: {
      item: {
        id: string;
        title: string;
        maxscore: number;
        sectionId: string;
      };
      pass: string;
      duration: number;
      score: number;
      resvalues: Array<{
        value: any;
        selected: boolean;
        AI_suggestion: string;
      }>;
    }[];
  }[];
  totalMaxScore: number;
  totalScore: number;
  updatedOn: string;
  timeSpent: string;
  unitId: string;
  submitedBy: string;
}

interface OfflineAssessmentData {
  userId: string;
  status: 'AI Pending' | 'AI Processed' | 'Approved';
  fileUrls: string[];
  records: AssessmentRecord[];
  // Add other properties as needed based on API response
}

const stripHtmlTags = (html: string) => {
  return html.replace(/<[^>]*>/g, '');
};

const AssessmentDetails = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { assessmentId, userId } = router.query;
  const [expandedPanel, setExpandedPanel] = useState<string | false>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [editScore, setEditScore] = useState<string>('');
  const [editSuggestion, setEditSuggestion] = useState<string>('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [assessmentTrackingData, setAssessmentTrackingData] =
    useState<AssessmentTrackingData | null>();

  // Hierarchy data for question numbering
  const [hierarchyData, setHierarchyData] = useState<any>(null);
  const [questionNumberingMap, setQuestionNumberingMap] = useState<
    Record<string, string>
  >({});
  const [sectionMapping, setSectionMapping] = useState<Record<string, string>>(
    {}
  );

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
    if (
      assessmentData?.status === 'AI Pending' ||
      assessmentData?.status === 'Approved'
    ) {
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
            // If status is AI Processed and we have records with evaluatedBy: "AI"
            if (
              currentUserData.status === 'AI Processed' &&
              currentUserData.records?.length > 0 &&
              currentUserData.records[0].evaluatedBy === 'AI'
            ) {
              // Get the latest record based on updatedOn timestamp
              const latestRecord = currentUserData.records.reduce(
                (latest: AssessmentRecord, current: AssessmentRecord) => {
                  const currentDate = new Date(current.updatedOn).getTime();
                  const latestDate = new Date(latest.updatedOn).getTime();
                  return currentDate > latestDate ? current : latest;
                },
                currentUserData.records[0]
              );

              // Transform the record into AssessmentTrackingData format
              const transformedData: AssessmentTrackingData = {
                assessmentTrackingId: latestRecord.assessmentTrackingId,
                userId: latestRecord.userId,
                courseId: latestRecord.courseId,
                contentId: latestRecord.contentId,
                attemptId: latestRecord.attemptId,
                createdOn: latestRecord.createdOn,
                lastAttemptedOn: latestRecord.lastAttemptedOn,
                updatedOn: latestRecord.updatedOn,
                timeSpent: latestRecord.timeSpent,
                totalMaxScore: latestRecord.totalMaxScore,
                totalScore: latestRecord.totalScore,
                unitId: latestRecord.unitId,
                score_details: latestRecord.assessmentSummary.flatMap(
                  (section: {
                    data: Array<{
                      item: {
                        id: string;
                        title: string;
                        maxscore: number;
                        sectionId: string;
                      };
                      pass: string;
                      duration: number;
                      score: number;
                      resvalues: Array<{
                        value: any;
                        selected: boolean;
                        AI_suggestion: string;
                      }>;
                    }>;
                  }) =>
                    section.data.map(
                      (item: {
                        item: {
                          id: string;
                          title: string;
                          maxscore: number;
                          sectionId: string;
                        };
                        pass: string;
                        duration: number;
                        score: number;
                        resvalues: Array<{
                          value: any;
                          selected: boolean;
                          AI_suggestion: string;
                        }>;
                      }) => {
                        // Check localStorage for edited score and suggestion
                        const savedData = localStorage.getItem(
                          `tracking_${userId}_${item.item.id}`
                        );
                        const savedScore = savedData
                          ? JSON.parse(savedData).score
                          : item.score;

                        // Update resValue with saved suggestion if available
                        let updatedResValue = { ...item.resvalues[0] };
                        if (savedData) {
                          const parsedSavedData = JSON.parse(savedData);
                          if (parsedSavedData.suggestion) {
                            updatedResValue.AI_suggestion =
                              parsedSavedData.suggestion;
                          }
                        }

                        return {
                          questionId: item.item.id,
                          pass: savedScore > 0 ? 'yes' : 'no',
                          sectionId: item.item.sectionId,
                          resValue: JSON.stringify(updatedResValue),
                          duration: item.duration,
                          score: savedScore,
                          maxScore: item.item.maxscore,
                          queTitle: stripHtmlTags(item.item.title),
                        };
                      }
                    )
                ),
              };

              // Recalculate total score based on localStorage values
              transformedData.totalScore = transformedData.score_details.reduce(
                (total, detail) => total + detail.score,
                0
              );

              setAssessmentTrackingData(transformedData);
            } else {
              // Fallback to existing assessment tracking API call
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

                // Check localStorage for any edited scores before setting the state
                if (latestAssessment.score_details) {
                  latestAssessment.score_details =
                    latestAssessment.score_details.map(
                      (detail: ScoreDetail) => {
                        const savedData = localStorage.getItem(
                          `tracking_${userId}_${detail.questionId}`
                        );
                        if (savedData) {
                          const parsedSavedData = JSON.parse(savedData);
                          const savedScore = parsedSavedData.score;

                          // Update resValue with saved suggestion if available
                          let updatedResValue = detail.resValue
                            ? JSON.parse(detail.resValue)
                            : {};
                          if (parsedSavedData.suggestion) {
                            updatedResValue.AI_suggestion =
                              parsedSavedData.suggestion;
                          }

                          return {
                            ...detail,
                            score: savedScore,
                            pass: savedScore > 0 ? 'yes' : 'no',
                            resValue: JSON.stringify(updatedResValue),
                          };
                        }
                        return detail;
                      }
                    );

                  // Recalculate total score
                  latestAssessment.totalScore =
                    latestAssessment.score_details.reduce(
                      (total: number, detail: ScoreDetail) =>
                        total + detail.score,
                      0
                    );
                }

                setAssessmentTrackingData(latestAssessment);
              }
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

          // Fetch hierarchy data for question numbering
          if (assessmentId) {
            try {
              const hierarchyResponse = await hierarchyContent(
                assessmentId as string
              );
              if (hierarchyResponse) {
                setHierarchyData(hierarchyResponse);
                const numberingMap =
                  createQuestionNumberingMap(hierarchyResponse);
                const sectionMap = createSectionMapping(hierarchyResponse);
                setQuestionNumberingMap(numberingMap);
                setSectionMapping(sectionMap);
                console.log('Question numbering map created:', numberingMap);
                console.log('Section mapping created:', sectionMap);
              }
            } catch (error) {
              console.error('Error fetching hierarchy data:', error);
            }
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
    // Check if there's a saved score and suggestion in localStorage
    const savedData = localStorage.getItem(
      `tracking_${userId}_${question.questionId}`
    );
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setEditScore(parsedData.score.toString());
      setEditSuggestion(
        parsedData.suggestion ||
          (question.resValue ? JSON.parse(question.resValue).AI_suggestion : '')
      );
    } else {
      setEditScore(question.score.toString());
      setEditSuggestion(
        question.resValue ? JSON.parse(question.resValue).AI_suggestion : ''
      );
    }
    setIsEditModalOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSaveScore = async () => {
    if (!selectedQuestion || !assessmentTrackingData) return;

    try {
      setEditLoading(true);

      // If status is AI Processed, only save to localStorage
      if (assessmentData?.status === 'AI Processed') {
        const resValue = selectedQuestion.resValue
          ? JSON.parse(selectedQuestion.resValue)
          : {};
        localStorage.setItem(
          `tracking_${userId}_${selectedQuestion.questionId}`,
          JSON.stringify({
            score: Number(editScore),
            suggestion: editSuggestion,
            answer: resValue.value || '',
            editedAt: new Date().toISOString(),
          })
        );

        // Update local state without API call
        const updatedLocalScoreDetails =
          assessmentTrackingData.score_details.map((detail) => {
            if (detail.questionId === selectedQuestion.questionId) {
              const updatedResValue = {
                ...JSON.parse(detail.resValue),
                AI_suggestion: editSuggestion,
              };
              return {
                ...detail,
                score: Number(editScore),
                pass: Number(editScore) > 0 ? 'yes' : 'no',
                resValue: JSON.stringify(updatedResValue),
              };
            }
            return detail;
          });

        // Calculate new total score by summing all scores
        const newTotalScore = updatedLocalScoreDetails.reduce(
          (total, detail) => total + detail.score,
          0
        );

        setAssessmentTrackingData({
          ...assessmentTrackingData,
          totalScore: newTotalScore,
          score_details: updatedLocalScoreDetails,
        });

        setSnackbar({
          open: true,
          message: 'Score and suggestion saved successfully',
          severity: 'success',
        });
        setIsEditModalOpen(false);
        return;
      }

      // For other statuses, proceed with API call
      const updatedAssessmentSummary = assessmentTrackingData.score_details.map(
        (detail) => {
          const resValue = detail.resValue ? JSON.parse(detail.resValue) : {};
          if (detail.questionId === selectedQuestion.questionId) {
            resValue.AI_suggestion = editSuggestion;
          }

          const section: AssessmentSection = {
            sectionId: detail.sectionId,
            sectionName: 'Section 1',
            data: [
              {
                item: {
                  id: detail.questionId || '',
                  title: stripHtmlTags(detail.queTitle),
                  type: 'sa',
                  maxscore: detail.maxScore,
                  params: [],
                  sectionId: detail.sectionId,
                },
                index: 1,
                pass:
                  detail.questionId === selectedQuestion.questionId
                    ? Number(editScore) > 0
                      ? 'yes'
                      : 'no'
                    : detail.pass,
                score:
                  detail.questionId === selectedQuestion.questionId
                    ? Number(editScore)
                    : detail.score,
                resvalues: [resValue],
                duration: detail.duration,
                sectionName: 'Section 1',
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
          Number(editScore),
        unitId: assessmentTrackingData.unitId,
        assessmentSummary: updatedAssessmentSummary,
      };

      await updateAssessmentScore(payload);

      // Update local state
      const updatedApiScoreDetails = assessmentTrackingData.score_details.map(
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
        score_details: updatedApiScoreDetails,
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

  const handleConfirmApprove = async () => {
    if (!assessmentTrackingData) return;

    try {
      setEditLoading(true);

      // Create payload with all current scores including any edited ones from localStorage
      const updatedAssessmentSummary = assessmentTrackingData.score_details.map(
        (detail) => {
          // Check if there's an edited score in localStorage
          const savedData = localStorage.getItem(
            `tracking_${userId}_${detail.questionId}`
          );
          const score = savedData ? JSON.parse(savedData).score : detail.score;

          const section: AssessmentSection = {
            sectionId: detail.sectionId,
            sectionName: 'Section 1',
            data: [
              {
                item: {
                  id: detail.questionId || '',
                  title: stripHtmlTags(detail.queTitle),
                  type: 'sa',
                  maxscore: detail.maxScore,
                  params: [],
                  sectionId: detail.sectionId,
                },
                index: 1,
                pass: Number(score) > 0 ? 'yes' : 'no',
                score: Number(score),
                resvalues: [JSON.parse(detail.resValue)],
                duration: detail.duration,
                sectionName: 'Section 1',
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
        totalScore: assessmentTrackingData.score_details.reduce(
          (total, detail) => {
            const savedData = localStorage.getItem(
              `tracking_${userId}_${detail.questionId}`
            );
            return (
              total + (savedData ? JSON.parse(savedData).score : detail.score)
            );
          },
          0
        ),
        unitId: assessmentTrackingData.unitId,
        assessmentSummary: updatedAssessmentSummary,
        submitedBy: 'Manual',
      };

      await updateAssessmentScore(payload);

      // After successful approval, fetch fresh data from tracking API
      const response = await getAssessmentTracking({
        userId: userId as string,
        contentId: assessmentId as string,
        courseId: assessmentId as string,
        unitId: assessmentId as string,
      });

      if (response?.data?.length > 0) {
        setAssessmentTrackingData(response.data[0]);
      }

      setSnackbar({
        open: true,
        message: 'Assessment approved successfully',
        severity: 'success',
      });

      // Clear localStorage after approval
      assessmentTrackingData.score_details.forEach((detail) => {
        localStorage.removeItem(`tracking_${userId}_${detail.questionId}`);
      });

      await handleRefreshAssessmentData();
      setIsConfirmModalOpen(false);
    } catch (error) {
      console.error('Error approving assessment:', error);
      setSnackbar({
        open: true,
        message: 'Failed to approve assessment. Please try again.',
        severity: 'error',
      });
    } finally {
      setEditLoading(false);
    }
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
            ) : assessmentData?.status === 'AI Processed' ||
              assessmentData?.status === 'Approved' ? (
              <ArrowForwardIcon />
            ) : (
              <FileUploadIcon />
            )}
          </IconButton>
        </Box>
      </Box>

      {!assessmentTrackingData ? (
        assessmentData?.status === 'AI Pending' ||
        assessmentData?.status === 'Approved' ? (
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
          isApproved={assessmentData?.status === 'Approved'}
          questionNumberingMap={questionNumberingMap}
          sectionMapping={sectionMapping}
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
          {selectedQuestion && (
            <>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Answer:{' '}
                {selectedQuestion.resValue
                  ? JSON.parse(selectedQuestion.resValue).value
                  : 'No answer provided'}
              </Typography>
              <TextField
                label="Suggestion"
                multiline
                rows={4}
                value={editSuggestion}
                onChange={(e) => setEditSuggestion(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                disabled={editLoading || assessmentData?.status === 'Approved'}
              />
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
                disabled={editLoading || assessmentData?.status === 'Approved'}
              />
            </>
          )}
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
