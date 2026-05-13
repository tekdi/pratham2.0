'use client';

import React, { useEffect, useCallback, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Pagination,
  Chip,
  Stack,
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
import { resolveTeacherPostListRoute } from '../../utils/resolveSurveyFillRoute';
import { bootstrapAuthFromUrl } from '../../utils/bootstrapAuth';

const ALL = '__all__';

const TeacherSurveyListPage: React.FC = () => {
  const router = useRouter();
  const { list, setListLoading, setSurveys, setListError } = useSurveyStore();
  const [page, setPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<string>(ALL);
  const [availableChips, setAvailableChips] = useState<string[]>([]);
  const limit = 20;

  // Seed localStorage from URL params when arriving from scp-teacher redirect
  useEffect(() => {
    bootstrapAuthFromUrl();
  }, []);

  const loadSurveys = useCallback(
    async (currentPage: number, contextType: string | null) => {
      setListLoading(true);
      try {
        const filters = contextType && contextType !== ALL ? { contextType } : {};
        const result = await fetchSurveyList(currentPage, limit, 'createdAt', 'DESC', filters);
        if (result.params.status === 'successful') {
          setSurveys(result.result.data, result.result.meta);

          // Derive available filter chips from returned surveys, restricted to localStorage categories
          if (currentPage === 1 && (!contextType || contextType === ALL)) {
            const allowedCats = parseSurveyCategoriesFromLocalStorage();
            const found = new Set<string>();
            (result.result.data as unknown as Survey[]).forEach((s: Survey) => {
              if (s.contextType && s.contextType !== 'none' && (allowedCats.length === 0 || allowedCats.includes(s.contextType))) {
                found.add(s.contextType);
              }
            });
            setAvailableChips(Array.from(found));
          }
        } else {
          setListError(result.params.errmsg || 'Failed to fetch surveys');
          toast.error(result.params.errmsg || 'Failed to fetch surveys');
        }
      } catch (err: any) {
        const msg = err?.response?.data?.params?.errmsg || 'Failed to fetch surveys';
        setListError(msg);
        toast.error(msg);
      }
    },
    [setListLoading, setSurveys, setListError]
  );

  useEffect(() => {
    loadSurveys(page, activeFilter);
  }, [page, activeFilter, loadSurveys]);

  const getContextLabel = (ctx: string) =>
    CONTEXT_TYPE_LABELS[ctx] || ctx.charAt(0).toUpperCase() + ctx.slice(1);

  const handleSurveyClick = (survey: Survey) => {
    router.push(resolveTeacherPostListRoute(survey));
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleFilterClick = (filter: string) => {
    if (filter === activeFilter) return;
    setActiveFilter(filter);
    setPage(1);
  };

  const surveys: Survey[] = Array.isArray(list.surveys)
    ? list.surveys
    : [];

  // Show chips only if there are multiple context types worth filtering
  const showChips = availableChips.length > 1;

  return (
    <Box>
      <BackHeader title="Surveys" subtitle="Fill surveys assigned to you" />

      <Box sx={{ p: 2 }}>
        {/* Filter chips — shown only when multiple context types exist */}
        {showChips && (
          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <Chip
              label="All"
              onClick={() => handleFilterClick(ALL)}
              variant={activeFilter === ALL ? 'filled' : 'outlined'}
              sx={{
                fontWeight: activeFilter === ALL ? 600 : 400,
                backgroundColor: activeFilter === ALL ? '#FDBE16' : 'transparent',
                color: activeFilter === ALL ? '#1E1B16' : '#7C766F',
                borderColor: activeFilter === ALL ? '#FDBE16' : '#C9C3BC',
                '&:hover': { backgroundColor: activeFilter === ALL ? '#e6ab0e' : '#F5F0EB' },
              }}
            />
            {availableChips.map((ctx) => (
              <Chip
                key={ctx}
                label={getContextLabel(ctx)}
                onClick={() => handleFilterClick(ctx)}
                variant={activeFilter === ctx ? 'filled' : 'outlined'}
                sx={{
                  fontWeight: activeFilter === ctx ? 600 : 400,
                  backgroundColor: activeFilter === ctx ? '#FDBE16' : 'transparent',
                  color: activeFilter === ctx ? '#1E1B16' : '#7C766F',
                  borderColor: activeFilter === ctx ? '#FDBE16' : '#C9C3BC',
                  '&:hover': { backgroundColor: activeFilter === ctx ? '#e6ab0e' : '#F5F0EB' },
                }}
              />
            ))}
          </Stack>
        )}

        {list.loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress sx={{ color: '#FDBE16' }} />
          </Box>
        ) : list.error ? (
          <Typography color="error" sx={{ textAlign: 'center', mt: 4 }}>
            {list.error}
          </Typography>
        ) : surveys.length === 0 ? (
          <NoDataFound message="No surveys found." />
        ) : (
          <>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 360px))' },
                gap: 2,
              }}
            >
              {surveys.map((survey) => (
                <SurveyCard
                  key={survey.surveyId}
                  survey={survey}
                  onClick={handleSurveyClick}
                />
              ))}
            </Box>

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

export default TeacherSurveyListPage;
