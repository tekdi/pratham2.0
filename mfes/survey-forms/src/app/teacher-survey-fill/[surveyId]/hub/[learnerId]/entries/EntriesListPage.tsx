'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useParams, useRouter } from 'next/navigation';
import BackHeader from '../../../../../../Components/BackHeader/BackHeader';
import { fetchSurveyById, fetchSurveyEntries } from '../../../../../../utils/API/surveyService';
import { formatDDMMYYYYWithTime } from '../../../../../../utils/Helper/helper';
import type { Survey, SurveyResponse } from '../../../../../../types/survey';

const EntriesListPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const surveyId = params.surveyId as string;
  const learnerId = params.learnerId as string;

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [entries, setEntries] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [surveyResult, entryRows] = await Promise.all([
        fetchSurveyById(surveyId),
        fetchSurveyEntries(surveyId, learnerId),
      ]);
      if (surveyResult.params.status !== 'successful') {
        setError(surveyResult.params.errmsg || 'Failed to load survey');
        return;
      }
      setSurvey(surveyResult.result.data);
      setEntries(entryRows);
    } catch {
      setError('Failed to load entries.');
    } finally {
      setLoading(false);
    }
  }, [surveyId, learnerId]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress sx={{ color: '#FDBE16' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <BackHeader title="Error" />
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Box>
    );
  }

  // entries arrives newest-first (fetchSurveyEntries sorts submittedAt DESC);
  // entry numbers count chronologically from the oldest (Entry 1).
  const total = entries.length;

  return (
    <Box>
      <BackHeader
        title={`Previous entries — ${survey?.surveyTitle ?? ''}`}
        onBack={() => router.back()}
      />
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" sx={{ color: '#7C766F', mb: 2 }}>
          {total} {total === 1 ? 'entry' : 'entries'}, newest first. Entries are read-only once submitted.
        </Typography>
        <Box sx={{ border: '1px solid #E0E0E0', borderRadius: '12px', overflow: 'hidden' }}>
          {entries.map((entry, idx) => {
            const entryNumber = total - idx;
            return (
              <Box
                key={entry.responseId}
                onClick={() => router.push(`/teacher-survey-fill/${surveyId}/hub/${learnerId}/entries/${entry.responseId}`)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  cursor: 'pointer',
                  borderBottom: idx < entries.length - 1 ? '1px solid #F1F5F9' : 'none',
                  '&:hover': { backgroundColor: '#fafafa' },
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#1E1B16' }}>
                    Entry {entryNumber}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#7C766F' }}>
                    Submitted on {entry.submittedAt ? formatDDMMYYYYWithTime(entry.submittedAt) : '—'}
                  </Typography>
                </Box>
                <ChevronRightIcon sx={{ color: '#94a3b8' }} />
              </Box>
            );
          })}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => router.push(`/survey-fill/${surveyId}/${learnerId}?cohortId=`)}
            sx={{ backgroundColor: '#FDBE16', color: '#1E1B16', fontWeight: 600 }}
          >
            + New Entry
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EntriesListPage;
