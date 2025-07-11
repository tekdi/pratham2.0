import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ErrorIcon from '@mui/icons-material/Error';
import RemoveIcon from '@mui/icons-material/Remove';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SortIcon from '@mui/icons-material/Sort';
import { showToastMessage } from '../../../components/Toastify';
import Header from '../../../components/Header';
import Loader from '../../../components/Loader';
import {
  getAssessmentStatus,
  getAssessmentDetails,
  getOfflineAssessmentStatus,
} from '../../../services/AssesmentService';
import { getMyCohortMemberList } from '../../../services/MyClassDetailsService';
import { AssessmentStatus } from '../../../utils/app.constant';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

interface LearnerData {
  learnerId: string;
  name: string;
  score: number;
  submittedAt: string | null;
  timeSpent: number;
  userId: string;
  progress?: string;
  username?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  role?: string;
  mobile?: string;
  cohortMembershipId?: string;
  customField?: any[];
  answerSheetStatus: 'AI Pending' | 'AI Processed' | 'Approved';
}

interface AssessmentData {
  assessmentId: string;
  title: string;
  description: string;
  totalQuestions: number;
  maxScore: number;
  hasLongShortAnswers: boolean;
  duration: number;
  createdDate: string;
  subject: string;
  grade: string;
  contentId?: string;
  courseId?: string;
}

type SortOption =
  | 'all'
  | 'completed'
  | 'awaiting_approval'
  | 'not_started'
  | 'in_progress'
  | 'name_asc'
  | 'name_desc'
  | 'score_desc'
  | 'score_asc';

const AssessmentDetails: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { assessmentId, cohortId } = router.query;

  // Status mapping for labels
  const statusMapping = {
    'AI Pending': 'Evaluating with AI',
    'AI Processed': 'Awaiting Your Approval',
    Approved: 'Marks Approved',
  };

  // State management
  const [loading, setLoading] = useState(true);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(
    null
  );
  const [learnerList, setLearnerList] = useState<LearnerData[]>([]);
  const [filteredLearners, setFilteredLearners] = useState<LearnerData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sort functionality state
  const [showSortPopup, setShowSortPopup] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('all');

  // Fetch assessment data and learner list
  useEffect(() => {
    if (assessmentId && cohortId) {
      fetchAssessmentData();
      fetchLearnerData();
    }
  }, [assessmentId, cohortId]);

  // Helper function to get display label from answerSheetStatus
  const getStatusLabel = (
    answerSheetStatus: 'AI Pending' | 'AI Processed' | 'Approved'
  ): string => {
    return statusMapping[answerSheetStatus] || 'Not Submitted';
  };

  // Helper function to map answerSheetStatus to internal status for filtering/sorting
  const mapAnswerSheetStatusToInternalStatus = (
    answerSheetStatus: 'AI Pending' | 'AI Processed' | 'Approved'
  ): 'completed' | 'in_progress' | 'not_started' | 'awaiting_approval' => {
    switch (answerSheetStatus) {
      case 'Approved':
        return 'completed';
      case 'AI Pending':
        return 'in_progress';
      case 'AI Processed':
        return 'awaiting_approval';
      default:
        return 'not_started';
    }
  };

  // Filter and sort learners based on search and sort options
  useEffect(() => {
    let filtered = [...learnerList];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((learner) =>
        learner.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sort/filter
    switch (sortOption) {
      case 'completed':
        filtered = filtered.filter(
          (learner) =>
            mapAnswerSheetStatusToInternalStatus(learner.answerSheetStatus) ===
            'completed'
        );
        break;
      case 'awaiting_approval':
        filtered = filtered.filter(
          (learner) =>
            mapAnswerSheetStatusToInternalStatus(learner.answerSheetStatus) ===
            'awaiting_approval'
        );
        break;
      case 'not_started':
        filtered = filtered.filter(
          (learner) =>
            mapAnswerSheetStatusToInternalStatus(learner.answerSheetStatus) ===
            'not_started'
        );
        break;
      case 'in_progress':
        filtered = filtered.filter(
          (learner) =>
            mapAnswerSheetStatusToInternalStatus(learner.answerSheetStatus) ===
            'in_progress'
        );
        break;
      case 'name_asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'score_desc':
        filtered.sort((a, b) => b.score - a.score);
        break;
      case 'score_asc':
        filtered.sort((a, b) => a.score - b.score);
        break;
      case 'all':
      default: {
        // Sort by status priority: "Evaluating with AI" → "Awaiting Your Approval" → "Marks Approved"
        const statusOrder = {
          in_progress: 1, // "Evaluating with AI"
          awaiting_approval: 2, // "Awaiting Your Approval"
          completed: 3, // "Marks Approved"
          not_started: 4, // "Not Submitted"
        };
        filtered.sort((a, b) => {
          const orderA =
            statusOrder[
              mapAnswerSheetStatusToInternalStatus(
                a.answerSheetStatus
              ) as keyof typeof statusOrder
            ] || 5;
          const orderB =
            statusOrder[
              mapAnswerSheetStatusToInternalStatus(
                b.answerSheetStatus
              ) as keyof typeof statusOrder
            ] || 5;
          return orderA - orderB;
        });
        break;
      }
    }

    setFilteredLearners(filtered);
  }, [learnerList, searchTerm, sortOption]);

  const fetchAssessmentData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use getAssessmentDetails with assessmentId as doId
      const response = await getAssessmentDetails(assessmentId as string);
      console.log('Assessment Details Response:', response);

      if (response) {
        // Calculate total questions from nested children arrays
        let totalQuestions = 0;
        if (response.children && Array.isArray(response.children)) {
          response.children.forEach((questionSet: any) => {
            if (questionSet.children && Array.isArray(questionSet.children)) {
              totalQuestions += questionSet.children.length;
            }
          });
        }

        // Calculate duration from timeLimits (convert seconds to minutes)
        let duration = 60; // default 60 minutes
        if (response.timeLimits?.questionSet?.max) {
          duration = Math.round(response.timeLimits.questionSet.max / 60); // convert seconds to minutes
        } else if (response.duration) {
          duration = response.duration;
        }

        const assessmentData: AssessmentData = {
          assessmentId: response.identifier || (assessmentId as string),
          title: response.name || response.title || 'Assessment',
          description:
            response.description ||
            response.instructions ||
            'Assessment Description',
          totalQuestions: totalQuestions || response.totalQuestions || 0,
          maxScore: response.maxScore || response.maxMarks || 100,
          hasLongShortAnswers:
            response.questionCategories?.includes('SA') ||
            response.questionCategories?.includes('LA') ||
            response.primaryCategory === 'Practice Question Set' ||
            false,
          duration: duration,
          createdDate:
            response.createdOn ||
            response.createdAt ||
            new Date().toISOString(),
          subject: Array.isArray(response.subject)
            ? response.subject[0]
            : response.subject || 'General',
          grade: Array.isArray(response.gradeLevel)
            ? response.gradeLevel[0]
            : response.gradeLevel || 'Not specified',
          contentId: response.identifier,
          courseId: response.courseId || response.course,
        };
        console.log('Mapped Assessment Data:', assessmentData);
        console.log('Total Questions calculated:', totalQuestions);
        console.log('Duration calculated (minutes):', duration);
        setAssessmentData(assessmentData);
      } else {
        console.warn('No assessment data received from API');
        // Fallback to mock data if API doesn't return data
        const mockAssessmentData: AssessmentData = {
          assessmentId: assessmentId as string,
          title: 'Assessment',
          description: 'Assessment Description',
          totalQuestions: 25,
          maxScore: 130,
          hasLongShortAnswers: true,
          duration: 90,
          createdDate: '2024-01-15',
          subject: 'General',
          grade: 'Not specified',
        };
        setAssessmentData(mockAssessmentData);
      }
    } catch (error) {
      console.error('Error fetching assessment data:', error);
      setError('Failed to load assessment data');
      showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');

      // Fallback to mock data on error
      const mockAssessmentData: AssessmentData = {
        assessmentId: assessmentId as string,
        title: 'Assessment',
        description: 'Assessment Description',
        totalQuestions: 25,
        maxScore: 130,
        hasLongShortAnswers: true,
        duration: 90,
        createdDate: '2024-01-15',
        subject: 'General',
        grade: 'Not specified',
      };
      setAssessmentData(mockAssessmentData);
    } finally {
      setLoading(false);
    }
  };

  const fetchLearnerData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use getMyCohortMemberList to fetch learners
      const filters = { cohortId: cohortId as string };
      const cohortResponse = await getMyCohortMemberList({ filters });

      if (cohortResponse?.result?.userDetails) {
        const userData = await getOfflineAssessmentStatus({
          userIds: cohortResponse.result.userDetails.map(
            (user: any) => user.userId
          ),
          questionSetId: assessmentId as string,
        });

        // Directly use cohortResponse data without complex mapping
        const learners = cohortResponse.result.userDetails.map((user: any) => {
          const matchingUserData = userData.result?.find(
            (data: any) => data.userId === user.userId
          );

          return {
            ...user,
            learnerId: user.userId,
            name:
              [user.firstName, user.middleName, user.lastName]
                .filter(Boolean)
                .join(' ') ||
              user.username ||
              'Unknown Learner',
            answerSheetStatus: matchingUserData?.status,
          };
        });

        // Fetch assessment status for all learners in a single call
        try {
          const allUserIds = learners.map(
            (learner: LearnerData) => learner.userId
          );
          const statusResponse = await getAssessmentStatus({
            userId: allUserIds,
            courseId: [assessmentId as string],
            unitId: [assessmentId as string],
            contentId: [assessmentId as string],
          });

          console.log('Assessment Status Response:', statusResponse);

          // Map status data to learners
          const learnersWithStatus = learners.map((learner: LearnerData) => {
            // Find status data for this learner
            const learnerStatus =
              statusResponse?.result?.find?.(
                (status: any) => status.userId === learner.userId
              ) || statusResponse?.result; // fallback if result is not an array

            if (learnerStatus) {
              const apiStatus = learnerStatus.status;
              const mappedStatus = mapApiStatusToLocal(apiStatus);
              return {
                ...learner,
                status: mappedStatus,
                score: learnerStatus.score || 0,
                submittedAt: learnerStatus.submittedAt || null,
                timeSpent: learnerStatus.timeSpent || 0,
              };
            }
            return learner;
          });

          setLearnerList(learnersWithStatus);
        } catch (error) {
          console.error(
            'Error fetching assessment status for learners:',
            error
          );
          // If status fetching fails, use learners with default status
          setLearnerList(learners);
        }
      }
    } catch (error) {
      console.error('Error fetching learner data:', error);
      setError('Failed to load learner data');
      showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const mapApiStatusToLocal = (
    apiStatus: string
  ): 'completed' | 'in_progress' | 'not_started' | 'awaiting_approval' => {
    switch (apiStatus) {
      case AssessmentStatus.COMPLETED:
      case AssessmentStatus.COMPLETED_SMALL:
        return 'completed';
      case AssessmentStatus.IN_PROGRESS:
        return 'in_progress';
      case AssessmentStatus.NOT_STARTED:
        return 'not_started';
      default:
        return 'awaiting_approval';
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleDownloadQuestionPaper = async () => {
    try {
      setDownloading(true);
      // Simulate download delay
      /*await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create download link
      const element = document.createElement('a');
      element.href =
        'data:text/plain;charset=utf-8,' +
        encodeURIComponent('Sample Assessment Question Paper Content');
      element.download = `${
        assessmentData?.title?.replace(/\s+/g, '_').toLowerCase() ||
        'assessment'
      }.pdf`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);*/

      const downloadUrl =
        process.env.NEXT_PUBLIC_ADMIN_SBPLAYER?.replace('sbplayer', '') +
        '/qp?do_id=' +
        assessmentId;
      const newWindow = window.open(
        downloadUrl,
        '_blank',
        'noopener,noreferrer'
      );
      if (newWindow) newWindow.focus();

      showToastMessage(
        t('ASSESSMENTS.DOWNLOAD_SUCCESS') ||
          'Question paper downloaded successfully',
        'success'
      );
      setShowDownloadPopup(false);
    } catch (error) {
      console.error('Error downloading question paper:', error);
      showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
    } finally {
      setDownloading(false);
    }
  };

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setShowSortPopup(true);
  };

  const handleSortClose = () => {
    setShowSortPopup(false);
  };

  const handleSortOptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSortOption(event.target.value as SortOption);
  };

  const applySortAndClose = () => {
    setShowSortPopup(false);
  };

  const getSortButtonText = () => {
    switch (sortOption) {
      case 'completed':
        return statusMapping['Approved']; // 'Marks Approved'
      case 'awaiting_approval':
        return statusMapping['AI Processed']; // 'Awaiting Your Approval'
      case 'not_started':
        return 'Not Submitted';
      case 'in_progress':
        return statusMapping['AI Pending']; // 'Evaluating with AI'
      case 'name_asc':
        return 'Name (A-Z)';
      case 'name_desc':
        return 'Name (Z-A)';
      case 'score_desc':
        return 'Score (High to Low)';
      case 'score_asc':
        return 'Score (Low to High)';
      case 'all':
      default:
        return 'All Learners';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon sx={{ color: '#4CAF50', fontSize: 24 }} />;
      case 'in_progress':
        return <MoreHorizIcon sx={{ color: '#FF9800', fontSize: 24 }} />;
      case 'awaiting_approval':
        return <ErrorIcon sx={{ color: '#FF5722', fontSize: 24 }} />;
      case 'not_started':
        return <RemoveIcon sx={{ color: '#9E9E9E', fontSize: 24 }} />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string, score?: number, maxScore?: number) => {
    switch (status) {
      case 'completed':
        return `Marks approved: ${score || 125}/${
          maxScore || assessmentData?.maxScore || 130
        }`;
      case 'in_progress':
        return 'Evaluating with AI';
      case 'awaiting_approval':
        return 'Awaiting Your Approval';
      case 'not_started':
        return 'Not Submitted';
      default:
        return '';
    }
  };

  const getStatusDate = (learner: LearnerData) => {
    const internalStatus = mapAnswerSheetStatusToInternalStatus(
      learner.answerSheetStatus
    );
    if (internalStatus === 'completed' && learner.submittedAt) {
      const date = new Date(learner.submittedAt);
      return `Approved on: ${date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })}`;
    } else if (internalStatus === 'awaiting_approval' && learner.submittedAt) {
      const date = new Date(learner.submittedAt);
      return `Uploaded on: ${date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })}`;
    }
    return '';
  };

  const getStatusCounts = () => {
    const counts = {
      not_started: learnerList.filter(
        (l) =>
          mapAnswerSheetStatusToInternalStatus(l.answerSheetStatus) ===
          'not_started'
      ).length,
      in_progress: learnerList.filter(
        (l) =>
          mapAnswerSheetStatusToInternalStatus(l.answerSheetStatus) ===
          'in_progress'
      ).length,
      awaiting_approval: learnerList.filter(
        (l) =>
          mapAnswerSheetStatusToInternalStatus(l.answerSheetStatus) ===
          'awaiting_approval'
      ).length,
      completed: learnerList.filter(
        (l) =>
          mapAnswerSheetStatusToInternalStatus(l.answerSheetStatus) ===
          'completed'
      ).length,
    };
    return [
      {
        count: counts.not_started,
        label: 'Not Submitted',
      },
      {
        count: counts.in_progress,
        label: statusMapping['AI Pending'], // 'Evaluating with AI'
      },
      {
        count: counts.awaiting_approval,
        label: statusMapping['AI Processed'], // 'Awaiting Your Approval'
      },
      {
        count: counts.completed,
        label: statusMapping['Approved'], // 'Marks Approved'
      },
    ];
  };

  const handleLearnerClick = (learnerId: string) => {
    router.push(`/ai-assessments/${assessmentId}/${learnerId}`);
  };

  if (loading) {
    return <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />;
  }

  const statusCounts = getStatusCounts();

  return (
    <>
      <Header />
      <Box>
        {/* Header Section */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: '16px 16px 12px 8px',
          }}
        >
          <IconButton onClick={handleBack} sx={{ mr: 1 }}>
            <ArrowBackIcon sx={{ color: '#4D4639' }} />
          </IconButton>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 500,
              fontSize: '22px',
              lineHeight: '28px',
              color: '#4D4639',
            }}
          >
            {assessmentData?.title}
          </Typography>
        </Box>

        {/* Error Message */}
        {error && (
          <Box sx={{ px: 2, mb: 2 }}>
            <Card
              sx={{ backgroundColor: '#FFEBEE', border: '1px solid #F44336' }}
            >
              <CardContent sx={{ p: 2 }}>
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Assessment Info Chip */}
        {/* <Box sx={{ px: 2, mb: 2 }}>
          <Chip
            label={`${assessmentData?.totalQuestions} Questions • ${assessmentData?.duration} mins • ${assessmentData?.subject}`}
            sx={{
              backgroundColor: '#E8F5E8',
              color: '#2E7D32',

              fontSize: '12px',
              height: '28px',
            }}
          />
        </Box> */}

        {/* Search Bar */}
        <Box sx={{ px: 2, mb: 2 }}>
          <TextField
            placeholder="Search Learner.."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            size="small"
            sx={{
              backgroundColor: '#EDEDED',
              borderRadius: '24px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '24px',
                '& fieldset': {
                  borderColor: '#D0C5B4',
                },
                '&:hover fieldset': {
                  borderColor: '#4D4639',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4D4639',
                },
              },
              '& .MuiInputBase-input': {
                padding: '10px 16px',
                fontSize: '14px',
                height: '28px',
                color: '#4D4639',
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end">
                    <SearchIcon sx={{ color: '#4D4639' }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Download PDF Card */}
        {assessmentData?.hasLongShortAnswers && (
          <Box sx={{ px: 2, mb: 2 }}>
            <Card
              sx={{
                backgroundColor: '#ECE6F0',
                border: '1px solid #D0C5B4',
                borderRadius: '8px',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#E1D5E7',
                },
              }}
              onClick={() => setShowDownloadPopup(true)}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: '12px !important',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <PictureAsPdfIcon
                    sx={{ color: '#D32F2F', width: 24, height: 24 }}
                  />
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: '14px',
                      color: '#1F1B13',
                    }}
                  >
                    {assessmentData?.title
                      ?.replace(/\s+/g, '_')
                      .toLowerCase() || 'mid_term_exam'}
                    .pdf
                  </Typography>
                </Box>
                <DownloadIcon sx={{ color: '#4D4639' }} />
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Total Learners and Sort */}
        <Box
          sx={{
            px: 2,
            mb: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '14px',
              color: '#7C766F',
            }}
          >
            {filteredLearners.length} of {learnerList.length} Learners
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={handleSortClick}
            startIcon={<SortIcon />}
            sx={{
              borderColor: '#D0C5B4',
              color: '#4D4639',
              fontWeight: 500,
              fontSize: '14px',
              textTransform: 'none',
              borderRadius: '8px',
              height: '32px',
              '&:hover': {
                borderColor: '#4D4639',
                backgroundColor: 'rgba(77, 70, 57, 0.04)',
              },
            }}
          >
            {getSortButtonText()}
          </Button>
        </Box>

        {/* Status Summary Cards */}
        <Box sx={{ px: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {statusCounts?.map((item, index) => (
              <Card
                key={index}
                sx={{
                  backgroundColor: '#FDF2E5',
                  borderRadius: '12px',
                  minWidth: 100,
                  flex: 1,
                }}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: '16px !important',
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: '20px',
                      color: '#1F1B13',
                      mb: 0.5,
                    }}
                  >
                    {item.count}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: '12px',
                      color: '#7C766F',
                      textAlign: 'center',
                      lineHeight: '16px',
                    }}
                  >
                    {item.label}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Learner List */}
        <Box sx={{ px: 2, pb: 2 }}>
          <Card
            sx={{
              backgroundColor: '#FBF4E4',
              borderRadius: '12px',
              border: '1px solid #E0E0E0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <List sx={{ p: 0 }}>
                {filteredLearners.map((learner, index) => (
                  <ListItem
                    key={learner.learnerId}
                    sx={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E0E0E0',
                      borderRadius: '12px',
                      mb: index < filteredLearners.length - 1 ? 2 : 0,
                      cursor: 'pointer',
                      p: 0,
                      minHeight:
                        mapAnswerSheetStatusToInternalStatus(
                          learner.answerSheetStatus
                        ) === 'awaiting_approval' ||
                        mapAnswerSheetStatusToInternalStatus(
                          learner.answerSheetStatus
                        ) === 'completed'
                          ? '80px'
                          : '64px',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: '#F5F5F5',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      },
                    }}
                    onClick={() => handleLearnerClick(learner.learnerId)}
                  >
                    {/* Leading Icon */}
                    <Box
                      sx={{
                        backgroundColor: '#FFDEA1',
                        borderRadius: '12px 0px 0px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 48,
                        py: 3,
                        height: '101%',
                        minHeight: 'inherit',
                      }}
                    >
                      {getStatusIcon(
                        mapAnswerSheetStatusToInternalStatus(
                          learner.answerSheetStatus
                        )
                      )}
                    </Box>

                    {/* Content */}
                    <ListItemText
                      sx={{
                        ml: 2,
                        flex: 1,
                      }}
                      primary={
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: '16px',
                            color: '#1F1B13',
                            lineHeight: '24px',
                          }}
                        >
                          {learner.name}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography
                            sx={{
                              fontWeight:
                                mapAnswerSheetStatusToInternalStatus(
                                  learner.answerSheetStatus
                                ) === 'completed'
                                  ? 500
                                  : 400,
                              fontSize: '14px',
                              color: '#4D4639',
                              lineHeight: '20px',
                            }}
                          >
                            {getStatusLabel(learner.answerSheetStatus) ||
                              getStatusText(
                                mapAnswerSheetStatusToInternalStatus(
                                  learner.answerSheetStatus
                                ),
                                learner.score,
                                assessmentData?.maxScore
                              )}
                          </Typography>
                          {getStatusDate(learner) && (
                            <Typography
                              sx={{
                                fontWeight: 400,
                                fontSize: '12px',
                                color: '#7C766F',
                                lineHeight: '16px',
                                mt: 0.5,
                              }}
                            >
                              {getStatusDate(learner)}
                            </Typography>
                          )}
                        </Box>
                      }
                    />

                    {/* Trailing Icon */}
                    <ListItemIcon
                      sx={{
                        minWidth: 'auto',
                        mr: 2,
                      }}
                    >
                      <NavigateNextIcon sx={{ color: '#4D4639' }} />
                    </ListItemIcon>
                  </ListItem>
                ))}
              </List>

              {filteredLearners.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#7C766F',

                      fontSize: '16px',
                    }}
                  >
                    {searchTerm
                      ? 'No learners found matching your search.'
                      : t('ASSESSMENTS.NO_DATA_FOUND')}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Download Question Paper Popup */}
        <Dialog
          open={showDownloadPopup}
          onClose={() => !downloading && setShowDownloadPopup(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '16px',
              p: 1,
            },
          }}
        >
          <DialogTitle>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, fontFamily: 'Poppins' }}
            >
              {t('ASSESSMENTS.OFFLINE_ASSESSMENT') || 'Offline Assessment'}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 3, fontFamily: 'Poppins' }}>
              {t('ASSESSMENTS.DOWNLOAD_ASSESSMENT_MESSAGE') ||
                'This assessment contains Long/Short Answer questions. Would you like to download the offline question paper?'}
            </Typography>
            <Box
              sx={{
                backgroundColor: '#F5F5F5',
                padding: 2,
                borderRadius: 2,
                border: '1px solid #E0E0E0',
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 500, fontFamily: 'Poppins' }}
              >
                {assessmentData?.title}
              </Typography>
              <Typography variant="body2" sx={{ color: '#7C766F', mt: 0.5 }}>
                {assessmentData?.totalQuestions} Questions •{' '}
                {assessmentData?.duration} minutes
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => setShowDownloadPopup(false)}
              disabled={downloading}
              sx={{
                color: '#7C766F',

                textTransform: 'none',
              }}
            >
              {t('ASSESSMENTS.CANCEL') || 'Cancel'}
            </Button>
            <Button
              onClick={handleDownloadQuestionPaper}
              variant="contained"
              disabled={downloading}
              startIcon={
                downloading ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <DownloadIcon />
                )
              }
              sx={{
                backgroundColor: '#4D4639',
                color: '#FFFFFF',

                textTransform: 'none',
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: '#3A3529',
                },
                '&:disabled': {
                  backgroundColor: '#E0E0E0',
                  color: '#9E9E9E',
                },
              }}
            >
              {downloading
                ? 'Downloading...'
                : t('ASSESSMENTS.DOWNLOAD') || 'Download'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Sort by Status Popup */}
        <Dialog
          open={showSortPopup}
          onClose={handleSortClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '16px',
              p: 1,
              maxWidth: '400px',
            },
          }}
        >
          <DialogTitle>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontFamily: 'Poppins',
                fontSize: '18px',
                color: '#1F1B13',
              }}
            >
              Sort & Filter Learners
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pb: 1 }}>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={sortOption}
                onChange={handleSortOptionChange}
                sx={{ gap: 1 }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    color: '#4D4639',
                    mt: 1,
                    mb: 1,
                    fontSize: '14px',
                  }}
                >
                  Filter by Status
                </Typography>

                <FormControlLabel
                  value="all"
                  control={<Radio size="small" sx={{ color: '#4D4639' }} />}
                  label={
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      <Typography sx={{ fontSize: '14px', color: '#1F1B13' }}>
                        All Learners
                      </Typography>
                      <Typography sx={{ fontSize: '14px', color: '#7C766F' }}>
                        ({learnerList.length})
                      </Typography>
                    </Box>
                  }
                  sx={{
                    mx: 0,
                    width: '100%',
                    '& .MuiFormControlLabel-label': { width: '100%' },
                  }}
                />

                <FormControlLabel
                  value="completed"
                  control={<Radio size="small" sx={{ color: '#4D4639' }} />}
                  label={
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      <Typography sx={{ fontSize: '14px', color: '#1F1B13' }}>
                        {statusMapping['Approved']}
                      </Typography>
                      <Typography sx={{ fontSize: '14px', color: '#7C766F' }}>
                        (
                        {getStatusCounts().find(
                          (item) => item.label === statusMapping['Approved']
                        )?.count || 0}
                        )
                      </Typography>
                    </Box>
                  }
                  sx={{
                    mx: 0,
                    width: '100%',
                    '& .MuiFormControlLabel-label': { width: '100%' },
                  }}
                />

                <FormControlLabel
                  value="awaiting_approval"
                  control={<Radio size="small" sx={{ color: '#4D4639' }} />}
                  label={
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      <Typography sx={{ fontSize: '14px', color: '#1F1B13' }}>
                        {statusMapping['AI Processed']}
                      </Typography>
                      <Typography sx={{ fontSize: '14px', color: '#7C766F' }}>
                        (
                        {getStatusCounts().find(
                          (item) => item.label === statusMapping['AI Processed']
                        )?.count || 0}
                        )
                      </Typography>
                    </Box>
                  }
                  sx={{
                    mx: 0,
                    width: '100%',
                    '& .MuiFormControlLabel-label': { width: '100%' },
                  }}
                />

                <FormControlLabel
                  value="in_progress"
                  control={<Radio size="small" sx={{ color: '#4D4639' }} />}
                  label={
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      <Typography sx={{ fontSize: '14px', color: '#1F1B13' }}>
                        {statusMapping['AI Pending']}
                      </Typography>
                      <Typography sx={{ fontSize: '14px', color: '#7C766F' }}>
                        (
                        {getStatusCounts().find(
                          (item) => item.label === statusMapping['AI Pending']
                        )?.count || 0}
                        )
                      </Typography>
                    </Box>
                  }
                  sx={{
                    mx: 0,
                    width: '100%',
                    '& .MuiFormControlLabel-label': { width: '100%' },
                  }}
                />

                <FormControlLabel
                  value="not_started"
                  control={<Radio size="small" sx={{ color: '#4D4639' }} />}
                  label={
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      <Typography sx={{ fontSize: '14px', color: '#1F1B13' }}>
                        Not Submitted
                      </Typography>
                      <Typography sx={{ fontSize: '14px', color: '#7C766F' }}>
                        (
                        {getStatusCounts().find(
                          (item) => item.label === 'Not Submitted'
                        )?.count || 0}
                        )
                      </Typography>
                    </Box>
                  }
                  sx={{
                    mx: 0,
                    width: '100%',
                    '& .MuiFormControlLabel-label': { width: '100%' },
                  }}
                />

                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    color: '#4D4639',
                    mt: 2,
                    mb: 1,
                    fontSize: '14px',
                  }}
                >
                  Sort by Name
                </Typography>

                <FormControlLabel
                  value="name_asc"
                  control={<Radio size="small" sx={{ color: '#4D4639' }} />}
                  label={
                    <Typography sx={{ fontSize: '14px', color: '#1F1B13' }}>
                      Name (A to Z)
                    </Typography>
                  }
                  sx={{ mx: 0 }}
                />

                <FormControlLabel
                  value="name_desc"
                  control={<Radio size="small" sx={{ color: '#4D4639' }} />}
                  label={
                    <Typography sx={{ fontSize: '14px', color: '#1F1B13' }}>
                      Name (Z to A)
                    </Typography>
                  }
                  sx={{ mx: 0 }}
                />

                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    color: '#4D4639',
                    mt: 2,
                    mb: 1,
                    fontSize: '14px',
                  }}
                >
                  Sort by Score
                </Typography>

                <FormControlLabel
                  value="score_desc"
                  control={<Radio size="small" sx={{ color: '#4D4639' }} />}
                  label={
                    <Typography sx={{ fontSize: '14px', color: '#1F1B13' }}>
                      Score (High to Low)
                    </Typography>
                  }
                  sx={{ mx: 0 }}
                />

                <FormControlLabel
                  value="score_asc"
                  control={<Radio size="small" sx={{ color: '#4D4639' }} />}
                  label={
                    <Typography sx={{ fontSize: '14px', color: '#1F1B13' }}>
                      Score (Low to High)
                    </Typography>
                  }
                  sx={{ mx: 0 }}
                />
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 2 }}>
            <Button
              onClick={handleSortClose}
              sx={{
                color: '#7C766F',
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={applySortAndClose}
              variant="contained"
              sx={{
                backgroundColor: '#4D4639',
                color: '#FFFFFF',
                textTransform: 'none',
                borderRadius: '8px',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: '#3A3529',
                },
              }}
            >
              Apply
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
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
