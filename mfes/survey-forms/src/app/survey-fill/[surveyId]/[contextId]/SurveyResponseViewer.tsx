'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Chip,
  Divider,
  Button,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import BackHeader from '../../../../Components/BackHeader/BackHeader';
import { fetchSurveyById, fetchSubmittedResponse } from '../../../../utils/API/surveyService';
import { isSectionVisible, isFieldVisible } from '../../../../utils/conditionalLogic';
import type { Survey, SurveyField, SurveyResponse } from '../../../../types/survey';

// ── Render a single submitted value in a human-readable way ──────────────────

const ReadOnlyValue: React.FC<{ field: SurveyField; value: any }> = ({ field, value }) => {
  const isEmpty =
    value === null ||
    value === undefined ||
    value === '' ||
    (Array.isArray(value) && value.length === 0);

  if (isEmpty) {
    return (
      <Typography variant="body2" sx={{ color: '#9E9E9E', fontStyle: 'italic' }}>
        No answer provided
      </Typography>
    );
  }

  // Resolve option label from field options/dataSource
  const resolveLabel = (val: string | number): string => {
    const options =
      field.options ??
      (field.dataSource?.type === 'static' ? field.dataSource.options : null) ??
      [];
    const found = options?.find((o) => String(o.value) === String(val));
    return found ? found.label : String(val);
  };

  switch (field.fieldType) {
    case 'checkbox':
    case 'multi_select': {
      const vals: any[] = Array.isArray(value) ? value : [value];
      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {vals.map((v, i) => (
            <Chip key={i} label={resolveLabel(v)} size="small" sx={{ backgroundColor: '#FFF8E1' }} />
          ))}
        </Box>
      );
    }
    case 'radio':
    case 'select':
      return (
        <Typography variant="body1" sx={{ color: '#1E1B16' }}>
          {resolveLabel(value)}
        </Typography>
      );
    case 'rating': {
      const max = field.validations?.max ?? 5;
      const num = Number(value);
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {Array.from({ length: max }).map((_, i) => (
            <Typography
              key={i}
              sx={{ fontSize: 22, color: i < num ? '#FDBE16' : '#E0E0E0' }}
            >
              ★
            </Typography>
          ))}
          <Typography variant="body2" sx={{ color: '#7C766F', ml: 0.5 }}>
            {num}/{max}
          </Typography>
        </Box>
      );
    }
    case 'scale': {
      const min = field.validations?.min ?? 1;
      const max = field.validations?.max ?? 10;
      return (
        <Typography variant="body1" sx={{ color: '#1E1B16' }}>
          {value} <Typography component="span" sx={{ color: '#7C766F', fontSize: 13 }}>/ {max} (range {min}–{max})</Typography>
        </Typography>
      );
    }
    case 'date':
    case 'time':
    case 'datetime':
      return (
        <Typography variant="body1" sx={{ color: '#1E1B16' }}>
          {String(value)}
        </Typography>
      );
    case 'image_upload':
    case 'video_upload':
    case 'file_upload': {
      const urls: string[] = Array.isArray(value) ? value : [value];
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {urls.map((url, i) => (
            <Typography key={i} variant="body2" sx={{ color: '#0D599E', wordBreak: 'break-all' }}>
              <a href={url} target="_blank" rel="noreferrer">{url}</a>
            </Typography>
          ))}
        </Box>
      );
    }
    default:
      return (
        <Typography variant="body1" sx={{ color: '#1E1B16', whiteSpace: 'pre-wrap' }}>
          {String(value)}
        </Typography>
      );
  }
};

// ── Main viewer ───────────────────────────────────────────────────────────────

const SurveyResponseViewer: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const surveyId = params.surveyId as string;
  const contextId = params.contextId as string;

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [response, setResponse] = useState<SurveyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [surveyResult, submittedResponse] = await Promise.all([
        fetchSurveyById(surveyId),
        fetchSubmittedResponse(
          surveyId,
          contextId,
          typeof window !== 'undefined' ? localStorage.getItem('userId') : null
        ),
      ]);

      if (surveyResult.params.status !== 'successful') {
        throw new Error(surveyResult.params.errmsg || 'Failed to load survey');
      }

      // Normalize options: API returns dataSource.options as {key, value};
      // resolveLabel expects {value, label}
      const surveyData = surveyResult.result.data;
      surveyData.sections?.forEach((section) => {
        section.fields.forEach((field) => {
          if (!field.options?.length && field.dataSource?.options?.length) {
            field.options = (field.dataSource.options as any[]).map((opt) => ({
              value: opt.key ?? opt.value,
              label: opt.value ?? opt.label,
            }));
          }
        });
      });

      setSurvey(surveyData);
      setResponse(submittedResponse);
    } catch (err: any) {
      const msg = err?.response?.data?.params?.errmsg || err?.message || 'Failed to load response';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [surveyId, contextId]);

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
          <Button
            variant="contained"
            onClick={() => router.back()}
            sx={{ mt: 2, backgroundColor: '#FDBE16', color: '#1E1B16' }}
          >
            Go Back
          </Button>
        </Box>
      </Box>
    );
  }

  if (!survey) return null;

  // API stores responseData keyed by fieldId; build idToName map and convert
  const idToName: Record<string, string> = {};
  (survey.sections ?? []).forEach((s) =>
    s.fields.forEach((f) => { idToName[f.fieldId] = f.fieldName; })
  );
  const rawData: Record<string, any> = response?.responseData ?? {};
  const responseData: Record<string, any> = {};
  Object.entries(rawData).forEach(([key, val]) => {
    const name = idToName[key];
    responseData[name ?? key] = val;
  });
  const submittedAt = response?.submittedAt
    ? new Date(response.submittedAt).toLocaleDateString()
    : null;

  const sortedSections = [...(survey.sections || [])].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );
  const visibleSections = sortedSections.filter((s) =>
    isSectionVisible(s, responseData)
  );

  return (
    <Box>
      <BackHeader
        title={survey.surveyTitle}
        subtitle={survey.surveyDescription || undefined}
      />

      {/* Submitted banner */}
      <Box
        sx={{
          mx: 2,
          mt: 2,
          p: 1.5,
          borderRadius: '8px',
          backgroundColor: '#E8F5E9',
          border: '1px solid #C8E6C9',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography sx={{ fontSize: 18, color: '#2E7D32' }}>&#10003;</Typography>
        <Box>
          <Typography variant="body2" sx={{ color: '#2E7D32', fontWeight: 600 }}>
            Response submitted
          </Typography>
          {submittedAt && (
            <Typography variant="caption" sx={{ color: '#4CAF50' }}>
              {submittedAt}
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ p: 2 }}>
        {visibleSections.map((section) => {
          const sortedFields = [...section.fields].sort(
            (a, b) => a.displayOrder - b.displayOrder
          );
          const visibleFields = sortedFields.filter((f) =>
            isFieldVisible(f, responseData)
          );
          if (visibleFields.length === 0) return null;

          return (
            <Box
              key={section.sectionId}
              sx={{
                mb: 3,
                p: 2,
                backgroundColor: '#fff',
                borderRadius: '12px',
                border: '1px solid #E0E0E0',
              }}
            >
              <Typography variant="h2" sx={{ color: '#1E1B16', fontWeight: 600, mb: 0.5 }}>
                {section.sectionTitle}
              </Typography>
              {section.sectionDescription && (
                <Typography variant="body2" sx={{ color: '#7C766F', mb: 0 }}>
                  {section.sectionDescription}
                </Typography>
              )}
              <Divider sx={{ my: 1.5 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {visibleFields.map((field) => (
                  <Box key={field.fieldId}>
                    <Typography
                      variant="body2"
                      sx={{ color: '#7C766F', fontWeight: 500, mb: 0.5 }}
                    >
                      {field.fieldLabel}
                    </Typography>
                    <ReadOnlyValue field={field} value={responseData[field.fieldName]} />
                  </Box>
                ))}
              </Box>
            </Box>
          );
        })}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 4 }}>
          <Button
            variant="contained"
            onClick={() => router.back()}
            sx={{
              backgroundColor: '#FDBE16',
              color: '#1E1B16',
              fontWeight: 600,
              minWidth: 140,
              '&:hover': { backgroundColor: '#e6ab0e' },
            }}
          >
            Back
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SurveyResponseViewer;
