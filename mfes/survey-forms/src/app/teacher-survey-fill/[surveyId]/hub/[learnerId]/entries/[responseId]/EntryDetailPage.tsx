'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography, CircularProgress, Divider } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import BackHeader from '../../../../../../../Components/BackHeader/BackHeader';
import ReadOnlyValue from '../../../../../../../Components/ResponseAnswer/ReadOnlyValue';
import { fetchSurveyById, fetchResponseById } from '../../../../../../../utils/API/surveyService';
import { isSectionVisible, isFieldVisible } from '../../../../../../../utils/conditionalLogic';
import { formatDDMMYYYYWithTime } from '../../../../../../../utils/Helper/helper';
import type { Survey, SurveyResponse } from '../../../../../../../types/survey';

const EntryDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const surveyId = params.surveyId as string;
  const responseId = params.responseId as string;

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [response, setResponse] = useState<SurveyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [surveyResult, responseResult] = await Promise.all([
        fetchSurveyById(surveyId),
        fetchResponseById(responseId),
      ]);
      if (surveyResult.params.status !== 'successful') {
        setError(surveyResult.params.errmsg || 'Failed to load survey');
        return;
      }
      setSurvey(surveyResult.result.data);
      setResponse(responseResult);
    } catch {
      setError('Failed to load this entry.');
    } finally {
      setLoading(false);
    }
  }, [surveyId, responseId]);

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

  if (error || !survey) {
    return (
      <Box>
        <BackHeader title="Error" />
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">{error || 'Entry not found'}</Typography>
        </Box>
      </Box>
    );
  }

  const idToName: Record<string, string> = {};
  (survey.sections ?? []).forEach((s) => s.fields.forEach((f) => { idToName[f.fieldId] = f.fieldName; }));
  const rawData: Record<string, any> = response?.responseData ?? {};
  const responseData: Record<string, any> = {};
  Object.entries(rawData).forEach(([key, val]) => {
    responseData[idToName[key] ?? key] = val;
  });

  const sortedSections = [...(survey.sections || [])].sort((a, b) => a.displayOrder - b.displayOrder);
  const visibleSections = sortedSections.filter((s) => isSectionVisible(s, responseData));

  return (
    <Box>
      <BackHeader
        title={survey.surveyTitle}
        subtitle={response?.submittedAt ? `Submitted on ${formatDDMMYYYYWithTime(response.submittedAt)}` : undefined}
        onBack={() => router.back()}
      />
      <Box sx={{ p: 2 }}>
        {visibleSections.map((section) => {
          const sortedFields = [...section.fields].sort((a, b) => a.displayOrder - b.displayOrder);
          const visibleFields = sortedFields.filter((f) => isFieldVisible(f, responseData));
          if (visibleFields.length === 0) return null;

          return (
            <Box
              key={section.sectionId}
              sx={{ mb: 3, p: 2, backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E0E0E0' }}
            >
              <Typography variant="h2" sx={{ color: '#1E1B16', fontWeight: 600, mb: 0.5 }}>
                {section.sectionTitle}
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {visibleFields.map((field, idx) => (
                  <Box key={field.fieldId}>
                    <Typography variant="body2" sx={{ color: '#1E1B16', fontWeight: 700, mb: 0.5 }}>
                      {idx + 1}. {field.fieldLabel}
                    </Typography>
                    <ReadOnlyValue field={field} value={responseData[field.fieldName]} />
                  </Box>
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default EntryDetailPage;
