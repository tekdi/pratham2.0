'use client';

import React, { useEffect, useCallback, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Pagination,
  Tabs,
  Tab,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useSurveyStore } from '../../store/surveyFormStore';
import { fetchSurveyList } from '../../utils/API/surveyService';
import { Survey } from '../../types/survey';
import SurveyCard from '../../Components/SurveyCard/SurveyCard';
import NoDataFound from '../../Components/NoDataFound/NoDataFound';
import BackHeader from '../../Components/BackHeader/BackHeader';
import { CONTEXT_TYPE_LABELS } from '../../../app.config';
import { parseSurveyCategoriesFromLocalStorage } from '../../utils/Helper/helper';
import { readSurveyEntryConfig } from '../../utils/surveyEntryConfig';
import { resolvePostSurveyListRoute } from '../../utils/resolveSurveyFillRoute';

const SurveyListPage: React.FC = () => {
  const router = useRouter();
  const { list, setListLoading, setSurveys, setListError } = useSurveyStore();
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const limit = 20;

  useEffect(() => {
    const cats = parseSurveyCategoriesFromLocalStorage();
    setCategories(cats);
    if (cats.length > 0) {
      setActiveTab(cats[0]);
    }
    setCategoriesLoaded(true);
  }, []);

  const loadSurveys = useCallback(
    async (currentPage: number, contextType: string) => {
      setListLoading(true);
      try {
        const result = await fetchSurveyList(currentPage, limit, 'createdAt', 'DESC', {
          contextType,
        });
        if (result.params.status === 'successful') {
          setSurveys(result.result.data, result.result.meta);
        } else {
          setListError(result.params.errmsg || 'Failed to fetch surveys');
          toast.error(result.params.errmsg || 'Failed to fetch surveys');
        }
      } catch (err: any) {
        const msg =
          err?.response?.data?.params?.errmsg || 'Failed to fetch surveys';
        setListError(msg);
        toast.error(msg);
      }
    },
    [setListLoading, setSurveys, setListError]
  );

  useEffect(() => {
    if (!categoriesLoaded || !activeTab) return;
    loadSurveys(page, activeTab);
  }, [page, activeTab, categoriesLoaded, loadSurveys]);

  const getContextLabel = (ctx: string) =>
    CONTEXT_TYPE_LABELS[ctx] || ctx.charAt(0).toUpperCase() + ctx.slice(1);

  const handleSurveyClick = (survey: Survey) => {
    const entryConfig = readSurveyEntryConfig(survey.surveyId);
    router.push(resolvePostSurveyListRoute(survey, entryConfig));
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
    setPage(1);
  };

  if (!categoriesLoaded) {
    return (
      <Box>
        <BackHeader title="Surveys" subtitle="Fill surveys assigned to you" />
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress sx={{ color: '#FDBE16' }} />
        </Box>
      </Box>
    );
  }

  if (categories.length === 0) {
    return (
      <Box>
        <BackHeader title="Surveys" subtitle="Fill surveys assigned to you" />
        <Box sx={{ p: 2 }}>
          <NoDataFound message='Set localStorage key "surveyCategory" to a JSON array of context types (e.g. ["learner","self"]) or a comma-separated list.' />
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <BackHeader title="Surveys" subtitle="Fill surveys assigned to you" />

      <Box sx={{ p: 2 }}>
        {list.loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress sx={{ color: '#FDBE16' }} />
          </Box>
        ) : list.error ? (
          <Typography color="error" sx={{ textAlign: 'center', mt: 4 }}>
            {list.error}
          </Typography>
        ) : (
          <>
            <Box
              sx={{
                mb: 2,
                borderBottom: 1,
                borderColor: 'divider',
                backgroundColor: '#fff',
                borderRadius: '12px 12px 0 0',
              }}
            >
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'capitalize',
                    fontWeight: 500,
                    fontSize: '13px',
                    minHeight: '42px',
                    color: '#7C766F',
                  },
                  '& .Mui-selected': {
                    color: '#0D599E !important',
                    fontWeight: 600,
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#FDBE16',
                    height: 3,
                    borderRadius: '3px 3px 0 0',
                  },
                }}
              >
                {categories.map((ctx) => (
                  <Tab
                    key={ctx}
                    label={getContextLabel(ctx)}
                    value={ctx}
                  />
                ))}
              </Tabs>
            </Box>

            {!list.surveys || list.surveys.length === 0 ? (
              <NoDataFound
                message={`No surveys found for "${getContextLabel(activeTab)}"`}
              />
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: '1fr 1fr',
                    md: '1fr 1fr 1fr',
                  },
                  gap: 2,
                }}
              >
                {list.surveys.map((survey) => (
                  <SurveyCard
                    key={survey.surveyId}
                    survey={survey}
                    onClick={handleSurveyClick}
                  />
                ))}
              </Box>
            )}

            {list.pagination && list.pagination.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={list.pagination.totalPages}
                  page={page}
                  onChange={handlePageChange}
                  sx={{
                    '& .Mui-selected': {
                      backgroundColor: '#FDBE16 !important',
                      color: '#1E1B16',
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default SurveyListPage;
