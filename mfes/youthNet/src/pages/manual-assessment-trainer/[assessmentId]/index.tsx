import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import ErrorIcon from '@mui/icons-material/Error';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { GetStaticPaths } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import NoDataFound from '../../../components/common/NoDataFound';
import Header from '../../../components/Header';
import Loader from '../../../components/Loader';
import SearchBar from '../../../components/Searchbar';
import { showToastMessage } from '../../../components/Toastify';
import { useDirection } from '../../../hooks/useDirection';
import {
  getAssessmentDetails,
  getAssessmentStatus,
  getOfflineAssessmentStatus,
} from '../../../services/AssesmentService';
import { getBatchLearners } from '../../../services/myTeachingCenter/LearnerListService';
import { accessControl, AttendanceAPILimit } from '../../../utils/app.config';
import { toPascalCase } from '../../../utils/helper';
import withAccessControl from '../../../utils/hoc/withAccessControl';

// Learner list for one manual (offline) assessment.
// Ported from scp-teacher-repo, minus its console instrumentation and mock-data fallback: when the
// metadata call fails this surfaces the error rather than rendering invented questions/scores.

type AnswerSheetStatus = 'Not_Started' | 'Image_Uploaded' | 'Completed';

type TabKey = 'all' | 'awaiting_approval' | 'marks_approved' | 'not_submitted';

interface LearnerRow {
  userId: string;
  name: string;
  answerSheetStatus: AnswerSheetStatus;
  score: number;
  maxScore: number;
}

const TABS: { key: TabKey; labelKey: string }[] = [
  { key: 'all', labelKey: 'AI.ALL_LEARNERS' },
  { key: 'awaiting_approval', labelKey: 'AI.AWAITING_YOUR_APPROVAL' },
  { key: 'marks_approved', labelKey: 'AI.MARKS_APPROVED' },
  { key: 'not_submitted', labelKey: 'AI.NOT_SUBMITTED' },
];

const SORT_OPTIONS = [
  { value: 'name_asc', labelKey: 'AI.NAME_A_TO_Z' },
  { value: 'name_desc', labelKey: 'AI.NAME_Z_TO_A' },
  { value: 'score_desc', labelKey: 'AI.SCORE_HIGH_TO_LOW' },
  { value: 'score_asc', labelKey: 'AI.SCORE_LOW_TO_HIGH' },
];

const statusForTab = (status: AnswerSheetStatus): TabKey => {
  if (status === 'Completed') return 'marks_approved';
  if (status === 'Image_Uploaded') return 'awaiting_approval';
  return 'not_submitted';
};

const ManualAssessmentLearners = () => {
  const theme = useTheme<any>();
  const router = useRouter();
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const { assessmentId, cohortId, subject, parentId } = router.query;

  const [assessmentTitle, setAssessmentTitle] = useState<string>('');
  const [maxScore, setMaxScore] = useState<number>(0);
  // The unit (sub-collection) inside the parent Course that actually holds this assessment.
  // Tracking calls key off course + unit, so the learner page needs it alongside parentId.
  const [unitId, setUnitId] = useState<string>('');
  const [learners, setLearners] = useState<LearnerRow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [sortOption, setSortOption] = useState<string>('name_asc');
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  // Assessment metadata.
  useEffect(() => {
    const fetchAssessmentData = async () => {
      if (!assessmentId) return;
      try {
        const response = await getAssessmentDetails(assessmentId as string);
        if (response) {
          setAssessmentTitle(
            response.name || response.title || (subject as string) || ''
          );
          setMaxScore(response.maxScore || response.maxMarks || 0);
        }

        // Walk the parent Course's hierarchy to find the unit holding this assessment.
        // Falls back to the assessment id itself, matching the existing volunteer flow.
        if (parentId) {
          const courseResponse = await getAssessmentDetails(parentId as string);
          let foundChild: any = null;
          for (const item of courseResponse?.children || []) {
            for (const child of item?.children || []) {
              if (child.identifier === assessmentId) {
                foundChild = child;
                break;
              }
            }
            if (foundChild) break;
          }
          setUnitId(foundChild?.parent || (assessmentId as string));
        } else {
          setUnitId(assessmentId as string);
        }
      } catch (error) {
        console.error('Error fetching assessment details:', error);
        showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
      }
    };

    fetchAssessmentData();
  }, [assessmentId, parentId]);

  // Learners plus their upload/approval state.
  useEffect(() => {
    const fetchLearnerData = async () => {
      if (!assessmentId || !cohortId) return;

      setLoading(true);
      try {
        // getBatchLearners, not getMyCohortMemberList + a `status === 'active'` filter: in the
        // YouthNet Trainer context cohortmember/list's `status` carries the learner-progress enum
        // (in_training / course_completed / placed / retention_complete / dropout), so nothing is
        // ever 'active' here and that filter silently removed every learner.
        const { userDetails: activeUsers } = await getBatchLearners({
          batchCohortId: cohortId as string,
          limit: AttendanceAPILimit,
          offset: 0,
        });

        if (!activeUsers.length) {
          setLearners([]);
          return;
        }

        const userIds = activeUsers.map((user: any) => user.userId);

        const [uploadFlags, markStatuses] = await Promise.all([
          getOfflineAssessmentStatus({
            userIds,
            questionSetId: assessmentId as string,
          }),
          getAssessmentStatus({
            userId: userIds,
            courseId: [assessmentId as string],
            unitId: [assessmentId as string],
            contentId: [assessmentId as string],
          }),
        ]);

        // userId -> whether that learner has at least one uploaded answer-sheet image.
        const hasUploadByUserId = new Map<string, boolean>(
          (uploadFlags?.result || []).map((row: any) => [
            row?.userId,
            Array.isArray(row?.fileUrls) && row.fileUrls.length > 0,
          ])
        );

        const rows: LearnerRow[] = activeUsers.map((user: any) => {
          const marks = Array.isArray(markStatuses)
            ? markStatuses.find((entry: any) => entry.userId === user.userId)
            : undefined;

          const isApproved = marks?.status === 'Completed';
          const hasUpload = Boolean(hasUploadByUserId.get(user.userId));

          let answerSheetStatus: AnswerSheetStatus = 'Not_Started';
          if (isApproved) {
            answerSheetStatus = 'Completed';
          } else if (hasUpload) {
            answerSheetStatus = 'Image_Uploaded';
          }

          const name =
            [user.firstName, user.middleName, user.lastName]
              .filter(Boolean)
              .map((part: string) => toPascalCase(part))
              .join(' ') ||
            user.username ||
            '';

          return {
            userId: user.userId,
            name,
            answerSheetStatus,
            score: Number(marks?.totalScore ?? 0),
            maxScore: Number(marks?.totalMaxScore ?? 0),
          };
        });

        setLearners(rows);
      } catch (error) {
        console.error('Error fetching learner data:', error);
        showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
        setLearners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLearnerData();
  }, [assessmentId, cohortId]);

  const tabCounts = useMemo(() => {
    const counts: Record<TabKey, number> = {
      all: learners.length,
      awaiting_approval: 0,
      marks_approved: 0,
      not_submitted: 0,
    };
    learners.forEach((learner) => {
      counts[statusForTab(learner.answerSheetStatus)] += 1;
    });
    return counts;
  }, [learners]);

  const visibleLearners = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    const filtered = learners.filter((learner) => {
      if (activeTab !== 'all' && statusForTab(learner.answerSheetStatus) !== activeTab) {
        return false;
      }
      if (!term) return true;
      return learner.name.toLowerCase().includes(term);
    });

    const sorted = [...filtered];
    switch (sortOption) {
      case 'name_asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      // Learners with no score sort last in both directions, so an unmarked learner never
      // displaces a marked one at the top of the list.
      case 'score_desc':
        sorted.sort((a, b) => b.score - a.score);
        break;
      case 'score_asc':
        sorted.sort((a, b) => {
          if (a.maxScore === 0 && b.maxScore === 0) return 0;
          if (a.maxScore === 0) return 1;
          if (b.maxScore === 0) return -1;
          return a.score - b.score;
        });
        break;
    }
    return sorted;
  }, [learners, searchTerm, activeTab, sortOption]);

  const getStatusIcon = (status: AnswerSheetStatus) => {
    switch (status) {
      case 'Completed':
        return <CheckCircleIcon sx={{ color: '#4CAF50', fontSize: 24 }} />;
      case 'Image_Uploaded':
        return <ErrorIcon sx={{ color: '#2196F3', fontSize: 24 }} />;
      default:
        return <RemoveIcon sx={{ color: '#9E9E9E', fontSize: 24 }} />;
    }
  };

  const handleDownloadQuestionPaper = () => {
    try {
      setDownloading(true);

      const playerUrl = process.env.NEXT_PUBLIC_ADMIN_SBPLAYER;
      if (!playerUrl || !assessmentId) {
        showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
        return;
      }

      const baseUrl = playerUrl.replace('sbplayer', '');
      const newWindow = window.open(
        `${baseUrl}/qp?do_id=${assessmentId}`,
        '_blank',
        'noopener,noreferrer'
      );
      if (newWindow) newWindow.focus();

      showToastMessage(t('ASSESSMENTS.DOWNLOAD_SUCCESS'), 'success');
    } catch (error) {
      console.error('Error downloading question paper:', error);
      showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
    } finally {
      setDownloading(false);
    }
  };

  const handleLearnerClick = (learnerId: string) => {
    router.push({
      pathname: `/manual-assessment-trainer/${assessmentId}/${learnerId}`,
      query: {
        cohortId: cohortId as string,
        ...(parentId ? { parentId: parentId as string } : {}),
        ...(unitId ? { unitId } : {}),
      },
    });
  };

  return (
    <>
      <Header />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: theme.palette.warning['A200'],
          padding: '15px 20px 5px',
          cursor: 'pointer',
        }}
        width={'100%'}
        onClick={() => router.back()}
      >
        <KeyboardBackspaceOutlinedIcon
          sx={{
            color: theme.palette.warning['A200'],
            transform: isRTL ? 'rotate(180deg)' : 'unset',
          }}
        />
        <Typography fontSize={'22px'} m={'1rem'}>
          {assessmentTitle || (subject as string)}
        </Typography>
      </Box>

      <Box sx={{ px: '20px', pb: '10px' }}>
        <Button
          variant="contained"
          disabled={downloading}
          startIcon={
            downloading ? <CircularProgress size={16} color="inherit" /> : <DownloadIcon />
          }
          onClick={handleDownloadQuestionPaper}
        >
          {t('AI.DOWNLOAD_QUESTION_PAPER')}
        </Button>
      </Box>

      <SearchBar onSearch={setSearchTerm} placeholder={t('ASSESSMENTS.SEARCH_LEARNER')} />

      <Box
        sx={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          px: '20px',
          mt: 2,
        }}
      >
        {TABS.map((tab) => (
          <Chip
            key={tab.key}
            label={`${t(tab.labelKey)} (${tabCounts[tab.key]})`}
            onClick={() => setActiveTab(tab.key)}
            color={activeTab === tab.key ? 'primary' : 'default'}
            variant={activeTab === tab.key ? 'filled' : 'outlined'}
          />
        ))}
      </Box>

      <Box sx={{ px: '20px', mt: 2, maxWidth: '320px' }}>
        <FormControl fullWidth size="small">
          <InputLabel id="learner-sort-label">{t('COMMON.SORT_BY')}</InputLabel>
          <Select
            labelId="learner-sort-label"
            label={t('COMMON.SORT_BY')}
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            {SORT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {t(option.labelKey)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading && (
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            mt: 2,
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Loader showBackdrop={false} loadingText={t('COMMON.LOADING')} />
        </Box>
      )}

      {!loading && visibleLearners.length === 0 && (
        <Box sx={{ mt: 2 }}>
          {searchTerm.trim() ? (
            <Typography sx={{ textAlign: 'center', px: '20px' }}>
              {t('AI.NO_LEARNERS_FOUND_MATCHING_SEARCH')}
            </Typography>
          ) : (
            <NoDataFound />
          )}
        </Box>
      )}

      {!loading && visibleLearners.length > 0 && (
        <Box sx={{ background: '#FBF4E4', padding: '20px', mt: 2 }}>
          <Grid container spacing={2}>
            {visibleLearners.map((learner) => (
              <Grid item xs={12} sm={12} md={6} lg={4} key={learner.userId}>
                <Box
                  sx={{
                    border: `1px solid ${theme.palette.warning['A100']}`,
                    background: theme.palette.warning['A400'],
                    borderRadius: '8px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleLearnerClick(learner.userId)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {getStatusIcon(learner.answerSheetStatus)}
                    <Box>
                      <Typography
                        sx={{
                          fontSize: '16px',
                          color: theme.palette.warning['300'],
                        }}
                        className="one-line-text"
                      >
                        {learner.name}
                      </Typography>
                      <Typography
                        sx={{ fontSize: '12px', color: theme.palette.warning['400'] }}
                      >
                        {learner.answerSheetStatus === 'Completed'
                          ? t('AI.MARKS_APPROVED_SCORE', {
                              score: learner.score,
                              maxScore: learner.maxScore || maxScore,
                            })
                          : t(
                              learner.answerSheetStatus === 'Image_Uploaded'
                                ? 'AI.AWAITING_YOUR_APPROVAL'
                                : 'AI.NOT_SUBMITTED'
                            )}
                      </Typography>
                    </Box>
                  </Box>
                  <NavigateNextIcon
                    sx={{
                      color: theme.palette.warning['300'],
                      transform: isRTL ? 'rotate(180deg)' : 'unset',
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </>
  );
};

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export async function getStaticProps({ locale }: { params: any; locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default withAccessControl(
  'accessAssessments',
  accessControl
)(ManualAssessmentLearners);
