import Header from '@/components/Header';
import { showToastMessage } from '@/components/Toastify';
import { getAssessmentAttemptDetails } from '@/services/AssesmentService';
import { getUserDetails } from '@/services/ProfileService';
import { Pagination } from '@/utils/app.constant';
import { logEvent } from '@/utils/googleAnalytics';
import { toPascalCase } from '@/utils/Helper';
import withAccessControl from '@/utils/hoc/withAccessControl';
import { IQuestion } from '@/utils/Interfaces';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import { Box, IconButton, Typography, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { accessControl } from '../../../../../../../../app.config';
import { useDirection } from '../../../../../../../hooks/useDirection';

function AssessmentAttemptDetail() {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [currentPage, setCurrentPage] = useState(1);
  const params = useParams<{ 
    userId: string; 
    assessmentTrackingId: string; 
    assessmentId: string 
  }>();
  const [userDetails, setUserDetails] = useState<any>({});
  const [attemptDetails, setAttemptDetails] = useState<any>({});
  const [totalPages, setTotalPages] = useState(0);
  const [paginatedQuestions, setPaginatedQuestions] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await getUserDetails(params.userId);
        if (response?.result?.userData) {
          setUserDetails(response?.result?.userData);
        }
      } catch (error) {
        showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
        console.error('Error fetching user details:', error);
      }
    };

    if (params?.userId) {
      getUserInfo();
    }
  }, [params?.userId]);

  useEffect(() => {
    const getAttemptDetails = async () => {
      setLoading(true);
      try {
        console.log('📡 Fetching attempt details for:', {
          userId: params.userId,
          assessmentId: params.assessmentId,
          assessmentTrackingId: params.assessmentTrackingId
        });

        const assessmentRes = await getAssessmentAttemptDetails(
          params.userId, 
          params.assessmentId
        );

        console.log('📡 Raw assessment response:', assessmentRes);

        if (assessmentRes?.length) {
          // Find the specific attempt using assessmentTrackingId
          const specificAttempt = assessmentRes.find(
            (attempt: any) => attempt.assessmentTrackingId === params.assessmentTrackingId
          );

          console.log('🎯 Found specific attempt:', specificAttempt);

          if (specificAttempt) {
            setAttemptDetails(specificAttempt);
            if (specificAttempt?.score_details?.length) {
              const totalPages = Math.ceil(
                specificAttempt.score_details.length / Pagination.ITEMS_PER_PAGE
              );
              setTotalPages(totalPages);
              setPagination(specificAttempt.score_details);
            }
          } else {
            console.warn('⚠️ No attempt found with assessmentTrackingId:', params.assessmentTrackingId);
            showToastMessage('Assessment attempt not found', 'error');
          }
        } else {
          console.warn('⚠️ No assessment data found');
          showToastMessage('No assessment data found', 'error');
        }
      } catch (error) {
        showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
        console.error('❌ Error fetching assessment attempt details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params?.userId && params?.assessmentId && params?.assessmentTrackingId) {
      getAttemptDetails();
    }
  }, [params]);

  const handleBackEvent = () => {
    window.history.back();
    logEvent({
      action: 'back-button-clicked-assessment-attempt-detail',
      category: 'Assessment Attempt Detail Page',
      label: 'Back Button Clicked',
    });
  };

  const handlePageChange = (
    _event: React.MouseEvent<HTMLElement> | null,
    newPage: number
  ) => {
    setCurrentPage(() => newPage);
    setPagination(attemptDetails?.score_details, newPage);
  };

  const setPagination = (questions: IQuestion[], pageNumber?: number) => {
    const activePage = pageNumber || currentPage;
    const paginatedQuestions = questions.slice(
      (activePage - 1) * Pagination.ITEMS_PER_PAGE,
      activePage * Pagination.ITEMS_PER_PAGE
    );
    setPaginatedQuestions(paginatedQuestions);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return (
      date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }) +
      ' ' +
      date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      })
    );
  };

  const getScoreColor = (pass: string) => {
    return pass === 'Yes' ? '#2E7D32' : '#D32F2F';
  };

  if (loading) {
    return (
      <>
        <Header />
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography>Loading assessment details...</Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <Header />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'flex-start',
          color: theme.palette.warning['A200'],
          padding: '15px 20px 0px',
        }}
        width={'100%'}
        onClick={handleBackEvent}
      >
        <KeyboardBackspaceOutlinedIcon
          cursor={'pointer'}
          sx={{
            color: theme.palette.warning['A200'],
            marginTop: '14px',
            transform: isRTL ? ' rotate(180deg)' : 'unset',
          }}
        />
        <Box
          sx={{ display: 'flex', flexDirection: 'column', margin: '0.8rem' }}
        >
          <Typography textAlign={'left'} fontSize={'22px'}>
          Eligibility Test - Attempt Details
          </Typography>
          <Typography
            color={theme.palette.warning['A200']}
            textAlign={'left'}
            fontWeight={'500'}
            fontSize={'11px'}
          >
            {toPascalCase(userDetails?.name)}
          </Typography>
        </Box>
      </Box>

      {/* Attempt Summary Card */}
      {attemptDetails && (
        <Box sx={{ m: 2, mb: 1 }}>
          <Box
            sx={{
              padding: '12px 16px',
              background: theme.palette.warning['800'],
              border: `1px solid ${theme.palette.warning['A100']}`,
              borderRadius: '12px',
            }}
          >
            <Typography variant="h6" sx={{ mb: 1, fontSize: '16px', fontWeight: 600 }}>
              Attempt Summary
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
              <Chip 
                label={`Score: ${attemptDetails.totalScore}/${attemptDetails.totalMaxScore}`}
                sx={{ 
                  backgroundColor: attemptDetails.totalScore >= (attemptDetails.totalMaxScore * 0.6) ? '#E8F5E8' : '#FFEBEE',
                  color: attemptDetails.totalScore >= (attemptDetails.totalMaxScore * 0.6) ? '#2E7D32' : '#D32F2F',
                  fontWeight: 600
                }}
              />
              <Chip 
                label={`Percentage: ${Math.round((attemptDetails.totalScore / attemptDetails.totalMaxScore) * 100)}%`}
                variant="outlined"
              />
              <Chip 
                label={`Time: ${attemptDetails.timeSpent || 'N/A'}s`}
                variant="outlined"
              />
            </Box>
            <Typography variant="body2" sx={{ fontSize: '12px', color: theme.palette.warning['300'] }}>
              Attempted on: {formatDate(attemptDetails.lastAttemptedOn)}
            </Typography>
          </Box>
        </Box>
      )}

      <Box
        sx={{
          m: 2,
          padding: '4px 16px 16px',
          background: theme.palette.warning['800'],
          border: `1px solid ${theme.palette.warning['A100']}`,
          borderRadius: '16px',
        }}
      >
        {/* Assessment questions */}
        {paginatedQuestions.map((questionItem: IQuestion, index: number) => (
          <Box key={questionItem?.questionId}>
            <Box
              sx={{
                mt: 1.5,
                fontSize: '14px',
                fontWeight: '400',
                color: theme.palette.warning['300'],
              }}
            >
              <span>{`Q${
                (currentPage - 1) * Pagination.ITEMS_PER_PAGE + 1 + index
              }. `}</span>
              <span
                dangerouslySetInnerHTML={{ __html: questionItem?.queTitle }}
              />
            </Box>
            
            {/* Score indicator */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, mb: 0.5 }}>
              <Chip 
                label={questionItem?.pass === 'Yes' ? 'Correct' : 'Incorrect'}
                size="small"
                sx={{ 
                  backgroundColor: questionItem?.pass === 'Yes' ? '#E8F5E8' : '#FFEBEE',
                  color: getScoreColor(questionItem?.pass),
                  fontSize: '11px',
                  fontWeight: 600
                }}
              />
              <Typography sx={{ fontSize: '11px', color: theme.palette.warning['300'] }}>
                Score: {questionItem?.score}/{questionItem?.maxScore}
              </Typography>
              <Typography sx={{ fontSize: '11px', color: theme.palette.warning['300'] }}>
                Time: {questionItem?.duration || 0}s
              </Typography>
            </Box>

            <Box
              sx={{
                mt: 0.8,
                fontSize: '16px',
                fontWeight: '500',
                color: getScoreColor(questionItem?.pass),
              }}
            >
              <span
                dangerouslySetInnerHTML={{
                  __html:
                    JSON.parse(questionItem?.resValue)?.[0]
                      ?.label.replace(/<\/?[^>]+(>|$)/g, '') //NOSONAR
                      .replace(/^\d+\.\s*/, '') || 'No Answer',
                }}
              />
            </Box>
          </Box>
        ))}
      </Box>

      {totalPages > 1 && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            my: 2,
            px: '20px',
            '@media (max-width: 500px)': {
              justifyContent: 'space-between',
            },
          }}
        >
          <IconButton
            disabled={currentPage === 1}
            onClick={() => handlePageChange(null, currentPage - 1)}
          >
            <ArrowBackIosNewIcon
              sx={{ fontSize: '20px', color: theme.palette.warning['300'] }}
            />
          </IconButton>
          <Typography
            sx={{
              mx: 2,
              fontSize: '14px',
              fontWeight: '400',
              color: theme.palette.warning['300'],
            }}
          >
            {`${(currentPage - 1) * Pagination.ITEMS_PER_PAGE + 1}-${Math.min(
              currentPage * Pagination.ITEMS_PER_PAGE,
              attemptDetails?.score_details?.length || 0
            )} of ${attemptDetails?.score_details?.length || 0}`}
          </Typography>
          <IconButton
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(null, currentPage + 1)}
          >
            <ArrowForwardIosIcon
              sx={{ fontSize: '20px', color: theme.palette.warning['300'] }}
            />
          </IconButton>
        </Box>
      )}
    </>
  );
}

export default withAccessControl(
  'accessAssessments',
  accessControl
)(AssessmentAttemptDetail);