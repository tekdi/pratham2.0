'use client';

import React, { useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import { useSurveyStore } from '../../../../store/surveyFormStore';
import {
  fetchSurveyById,
  fetchInProgressResponse,
  createResponse,
  saveDraft,
  submitResponse,
} from '../../../../utils/API/surveyService';
import { validateForm, ValidationError } from '../../../../utils/validation';
import { isSectionVisible, isFieldVisible } from '../../../../utils/conditionalLogic';
import SurveySection from '../../../../Components/SurveySection/SurveySection';
import BackHeader from '../../../../Components/BackHeader/BackHeader';

const AUTO_SAVE_INTERVAL = 30000;

// Build fieldName ↔ fieldId maps from survey sections
function buildFieldMaps(sections: import('../../../../types/survey').SurveySection[]) {
  const nameToId: Record<string, string> = {};
  const idToName: Record<string, string> = {};
  sections.forEach((s) =>
    s.fields.forEach((f) => {
      nameToId[f.fieldName] = f.fieldId;
      idToName[f.fieldId] = f.fieldName;
    })
  );
  return { nameToId, idToName };
}

// Transform formValues (keyed by fieldName) → API payload (keyed by fieldId)
function toApiPayload(
  values: Record<string, any>,
  nameToId: Record<string, string>
): Record<string, any> {
  const out: Record<string, any> = {};
  Object.entries(values).forEach(([name, val]) => {
    const id = nameToId[name];
    if (id) out[id] = val;
  });
  return out;
}

// Transform API responseData (keyed by fieldId) → formValues (keyed by fieldName)
function fromApiPayload(
  data: Record<string, any>,
  idToName: Record<string, string>
): Record<string, any> {
  const out: Record<string, any> = {};
  Object.entries(data).forEach(([id, val]) => {
    const name = idToName[id];
    if (name) out[name] = val;
  });
  return out;
}

const SurveyRenderer: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const surveyId = params.surveyId as string;
  const contextId = params.contextId as string;

  const {
    form,
    setFormLoading,
    setSurvey,
    setResponse,
    setFormValues,
    updateFieldValue,
    setValidationErrors,
    setSaving,
    setSubmitting,
    setSubmitted,
    setFormError,
    resetForm,
    setLastAutoSavedAt,
    setHasUnsavedChanges,
  } = useSurveyStore();

  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const formValuesRef = useRef(form.formValues);
  const isUnmountedRef = useRef(false);
  const isSubmittingRef = useRef(false); // BUG-007: guard against double-click
  formValuesRef.current = form.formValues;

  const isSubmittedRef = useRef(form.submitted);
  const isSavingRef = useRef(form.saving);
  const isSubmittingFlagRef = useRef(form.submitting);
  const hasUnsavedChangesRef = useRef(form.hasUnsavedChanges);
  isSubmittedRef.current = form.submitted;
  isSavingRef.current = form.saving;
  isSubmittingFlagRef.current = form.submitting;
  hasUnsavedChangesRef.current = form.hasUnsavedChanges;

  // ── Step 1: Load survey structure + restore any existing draft ───────────
  const initializeSurvey = useCallback(async () => {
    setFormLoading(true);
    try {
      const surveyResult = await fetchSurveyById(surveyId);
      if (surveyResult.params.status !== 'successful') {
        setFormError(surveyResult.params.errmsg || 'Failed to load survey');
        return;
      }

      const survey = surveyResult.result.data;

      // Normalize options: API returns options in dataSource.options as { key, value };
      // field components expect options as { value, label }.
      survey.sections?.forEach((section) => {
        section.fields.forEach((field) => {
          if (!field.options?.length && field.dataSource?.options?.length) {
            field.options = (field.dataSource.options as any[]).map((opt) => ({
              value: opt.key ?? opt.value,
              label: opt.value ?? opt.label,
            }));
          }
        });
      });

      setSurvey(survey);

      // Seed form with field defaults
      const initialValues: Record<string, any> = {};
      survey.sections?.forEach((section) => {
        section.fields.forEach((field) => {
          if (field.defaultValue !== null && field.defaultValue !== undefined) {
            initialValues[field.fieldName] = field.defaultValue;
          }
        });
      });
      setFormValues(initialValues);

      // BUG-002: restore draft if one exists for this learner
      const resolvedContextId = contextId === 'self' ? '' : contextId;
      const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
      const draft = await fetchInProgressResponse(surveyId, resolvedContextId, userId);
      if (draft) {
        setResponse(draft);
        if (draft.responseData && Object.keys(draft.responseData).length > 0) {
          const { idToName } = buildFieldMaps(survey.sections ?? []);
          const restored = fromApiPayload(draft.responseData, idToName);
          setFormValues({ ...initialValues, ...restored });
        }
      }
    } catch (err: any) {
      const msg = err?.response?.data?.params?.errmsg || 'Failed to load survey';
      setFormError(msg);
      toast.error(msg, { containerId: 'survey-renderer-toast' });
    } finally {
      setFormLoading(false);
    }
  }, [surveyId, contextId, setFormLoading, setSurvey, setResponse, setFormValues, setFormError]);

  useEffect(() => {
    isUnmountedRef.current = false;
    resetForm();
    initializeSurvey();
    return () => {
      isUnmountedRef.current = true;
      if (autoSaveTimerRef.current) clearInterval(autoSaveTimerRef.current);
      toast.dismiss({ containerId: 'survey-renderer-toast' }); // BUG-005: clear stale toasts on navigation
    };
  }, [initializeSurvey, resetForm]);

  // ── Auto-save: only starts after user has created a response (first save) ─
  useEffect(() => {
    if (!form.response?.responseId) return;

    autoSaveTimerRef.current = setInterval(async () => {
      if (isUnmountedRef.current) return;
      if (isSubmittedRef.current || isSavingRef.current || isSubmittingFlagRef.current) return;
      if (!hasUnsavedChangesRef.current) return;
      try {
        const responseId = form.response?.responseId;
        if (!responseId) return;
        const { nameToId } = buildFieldMaps(form.survey?.sections ?? []);
        await saveDraft(responseId, toApiPayload(formValuesRef.current, nameToId));
        setLastAutoSavedAt(new Date());
      } catch {
        // Silent fail for auto-save
      }
    }, AUTO_SAVE_INTERVAL);

    return () => {
      if (autoSaveTimerRef.current) clearInterval(autoSaveTimerRef.current);
    };
  }, [form.response?.responseId]); // Only recreate when responseId changes

  // ── Step 2 (lazy): Create response the first time user explicitly acts ────
  const ensureResponse = useCallback(async (): Promise<string | null> => {
    if (form.response?.responseId) return form.response.responseId;

    const resolvedContextId = contextId === 'self' ? '' : contextId;
    try {
      const result = await createResponse(surveyId, resolvedContextId);
      if (result.params.status === 'successful') {
        const resp = result.result.data;
        setResponse(resp);
        // Merge any existing draft data
        if (resp.responseData && Object.keys(resp.responseData).length > 0) {
          const { idToName } = buildFieldMaps(form.survey?.sections ?? []);
          const restored = fromApiPayload(resp.responseData, idToName);
          setFormValues({ ...formValuesRef.current, ...restored });
        }
        return resp.responseId;
      }
      toast.error(result.params.errmsg || 'Failed to start response', { containerId: 'survey-renderer-toast' });
      return null;
    } catch (err: any) {
      if (err?.response?.status === 409) {
        router.replace(`/survey-fill/${surveyId}/${contextId}/view`);
        return null;
      }
      const msg = err?.response?.data?.params?.errmsg || 'Failed to start response';
      toast.error(msg, { containerId: 'survey-renderer-toast' });
      return null;
    }
  }, [
    form.response?.responseId,
    surveyId,
    contextId,
    setResponse,
    setFormValues,
    router,
  ]);

  const handleFieldChange = useCallback(
    (fieldName: string, value: any) => {
      updateFieldValue(fieldName, value);
    },
    [updateFieldValue]
  );

  const handleSaveDraft = useCallback(async (navigateBack = false) => {
    setSaving(true);
    try {
      const responseId = await ensureResponse();
      if (!responseId) return;
      const { nameToId } = buildFieldMaps(form.survey?.sections ?? []);
      await saveDraft(responseId, toApiPayload(formValuesRef.current, nameToId));
      setHasUnsavedChanges(false);
      toast.success('Draft saved successfully', { containerId: 'survey-renderer-toast' });
      if (navigateBack) {
        setTimeout(() => router.back(), 1200);
      }
    } catch {
      toast.error('Failed to save draft', { containerId: 'survey-renderer-toast' });
    } finally {
      setSaving(false);
    }
  }, [ensureResponse, setSaving, setHasUnsavedChanges, form.survey, router]);

  const handleBack = useCallback(() => {
    toast.dismiss({ containerId: 'survey-renderer-toast' });
    if (form.hasUnsavedChanges) {
      const confirmed = window.confirm(
        'You have unsaved changes. Save a draft before leaving?'
      );
      if (confirmed) {
        handleSaveDraft(/* navigateBack= */ true);
        return;
      }
    }
    router.back();
  }, [form.hasUnsavedChanges, handleSaveDraft, router]);

  const handleSubmit = useCallback(async () => {
    if (isSubmittingRef.current) return; // BUG-007: prevent double-click
    if (!form.survey?.sections) return;

    const errors = validateForm(form.survey.sections, form.formValues);
    if (errors.length > 0) {
      setValidationErrors(errors);
      toast.error('Please fix the errors before submitting', { containerId: 'survey-renderer-toast' });
      const firstErrorField = document.querySelector(
        `[name="${errors[0].fieldName}"]`
      );
      firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const responseId = await ensureResponse();
    if (!responseId) return;

    // Exclude hidden fields and empty/null values — API rejects null for most field types
    const cleanData: Record<string, any> = {};
    form.survey.sections.forEach((section) => {
      if (!isSectionVisible(section, form.formValues)) return;
      section.fields.forEach((field) => {
        if (!isFieldVisible(field, form.formValues)) return;
        const val = form.formValues[field.fieldName];
        if (val !== null && val !== undefined && val !== '' && !(Array.isArray(val) && val.length === 0)) {
          cleanData[field.fieldName] = val;
        }
      });
    });

    const { nameToId } = buildFieldMaps(form.survey.sections ?? []);
    isSubmittingRef.current = true;
    setSubmitting(true);
    try {
      const result = await submitResponse(responseId, toApiPayload(cleanData, nameToId));
      if (result.params.status === 'successful') {
        toast.dismiss({ containerId: 'survey-renderer-toast' });
        setSubmitted(true);
      } else {
        toast.error(result.params.errmsg || 'Failed to submit', { containerId: 'survey-renderer-toast' });
      }
    } catch (err: any) {
      const serverData = err?.response?.data;
      const errmsg: string = serverData?.params?.errmsg || 'Failed to submit survey';

      // Try to map server field-level errors back to fieldNames
      const serverFieldErrors: Array<{ field: string; message: string }> =
        serverData?.result?.errors ?? serverData?.errors ?? [];

      if (serverFieldErrors.length > 0) {
        const { idToName } = buildFieldMaps(form.survey?.sections ?? []);
        const mapped: ValidationError[] = serverFieldErrors
          .map((e) => ({
            fieldName: idToName[e.field] ?? e.field,
            message: e.message,
          }))
          .filter((e) => !!e.fieldName);

        if (mapped.length > 0) {
          setValidationErrors(mapped);
          toast.error(`Please fix ${mapped.length} field error(s) before submitting`, { containerId: 'survey-renderer-toast' });
          const firstField = document.getElementById(mapped[0].fieldName)
            ?? document.querySelector(`[name="${mapped[0].fieldName}"]`);
          firstField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }
      }

      // No field-level detail — show the full server message
      toast.error(errmsg, { autoClose: 5000, containerId: 'survey-renderer-toast' });
      console.error('[SurveyRenderer] Submit 400:', serverData);
    } finally {
      isSubmittingRef.current = false;
      setSubmitting(false);
    }
  }, [
    form.survey,
    form.formValues,
    ensureResponse,
    setValidationErrors,
    setSubmitting,
    setSubmitted,
  ]);

  const calculateProgress = useCallback((): number => {
    if (!form.survey?.sections) return 0;
    let total = 0;
    let filled = 0;
    form.survey.sections.forEach((section) => {
      if (!isSectionVisible(section, form.formValues)) return;
      section.fields.forEach((field) => {
        if (!isFieldVisible(field, form.formValues)) return;
        if (field.isRequired) {
          total++;
          const val = form.formValues[field.fieldName];
          if (
            val !== null &&
            val !== undefined &&
            val !== '' &&
            !(Array.isArray(val) && val.length === 0)
          ) {
            filled++;
          }
        }
      });
    });
    return total === 0 ? 100 : Math.round((filled / total) * 100);
  }, [form.survey, form.formValues]);

  if (form.loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress sx={{ color: '#FDBE16' }} />
      </Box>
    );
  }

  if (form.error) {
    return (
      <Box>
        <BackHeader title="Error" />
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">{form.error}</Typography>
          <Button
            variant="contained"
            onClick={() => { toast.dismiss({ containerId: 'survey-renderer-toast' }); router.back(); }}
            sx={{ mt: 2, backgroundColor: '#FDBE16', color: '#1E1B16' }}
          >
            Go Back
          </Button>
        </Box>
      </Box>
    );
  }

  if (form.submitted) {
    return (
      <Box>
        <BackHeader title="Survey Submitted" />
        <Box
          sx={{
            p: 4,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            mt: 4,
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              backgroundColor: '#E8F5E9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ fontSize: 32, color: '#2E7D32' }}>&#10003;</Typography>
          </Box>
          <Typography variant="h1" sx={{ color: '#1E1B16' }}>
            Thank you!
          </Typography>
          <Typography variant="body1" sx={{ color: '#7C766F' }}>
            Your survey response has been submitted successfully.
          </Typography>
          <Button
            variant="contained"
            onClick={() => { toast.dismiss({ containerId: 'survey-renderer-toast' }); router.push('/teacher-survey-list'); }}
            sx={{
              mt: 2,
              backgroundColor: '#FDBE16',
              color: '#1E1B16',
              fontWeight: 600,
              '&:hover': { backgroundColor: '#e6ab0e' },
            }}
          >
            Back to Surveys
          </Button>
        </Box>
      </Box>
    );
  }

  const survey = form.survey;
  if (!survey) return null;

  const sortedSections = [...(survey.sections || [])].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );
  const visibleSections = sortedSections.filter((s) =>
    isSectionVisible(s, form.formValues)
  );

  // Build a global question number map (fieldId → 1-based number) across all visible fields
  const fieldNumberMap: Record<string, number> = {};
  let questionCounter = 1;
  visibleSections.forEach((section) => {
    [...section.fields]
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .forEach((field) => {
        if (isFieldVisible(field, form.formValues)) {
          fieldNumberMap[field.fieldId] = questionCounter++;
        }
      });
  });

  const progress = calculateProgress();

  return (
    <Box>
      <BackHeader
        title={survey.surveyTitle}
        subtitle={survey.surveyDescription || undefined}
        onBack={handleBack}
      />

      <Box sx={{ px: 2, pt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" sx={{ color: '#7C766F' }}>
            Progress
          </Typography>
          <Typography variant="caption" sx={{ color: '#7C766F' }}>
            {progress}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: '#E0E0E0',
            '& .MuiLinearProgress-bar': {
              backgroundColor: progress === 100 ? '#4CAF50' : '#FDBE16',
              borderRadius: 3,
            },
          }}
        />
      </Box>

      <Box sx={{ p: 2 }}>
        {visibleSections.map((section) => (
          <SurveySection
            key={section.sectionId}
            section={section}
            formValues={form.formValues}
            errors={form.errors}
            onChange={handleFieldChange}
            fieldNumberMap={fieldNumberMap}
          />
        ))}

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mt: 2,
            mb: 4,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Button
            variant="outlined"
            onClick={() => handleSaveDraft()}
            disabled={form.saving || form.submitting}
            sx={{
              borderColor: '#FDBE16',
              color: '#1E1B16',
              fontWeight: 600,
              minWidth: 140,
              '&:hover': { borderColor: '#e6ab0e', backgroundColor: '#FFF8E1' },
            }}
          >
            {form.saving ? (
              <CircularProgress size={20} sx={{ color: '#1E1B16' }} />
            ) : (
              'Save Draft'
            )}
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={form.saving || form.submitting}
            sx={{
              backgroundColor: '#FDBE16',
              color: '#1E1B16',
              fontWeight: 600,
              minWidth: 140,
              '&:hover': { backgroundColor: '#e6ab0e' },
            }}
          >
            {form.submitting ? (
              <CircularProgress size={20} sx={{ color: '#1E1B16' }} />
            ) : (
              'Submit'
            )}
          </Button>
        </Box>
        {form.lastAutoSavedAt && (
          <Typography
            variant="caption"
            sx={{ display: 'block', textAlign: 'center', color: '#7C766F', mt: 1 }}
          >
            Auto-saved at {form.lastAutoSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Typography>
        )}
      </Box>
      <ToastContainer
        containerId="survey-renderer-toast"
        position="top-center"
        autoClose={3000}
        hideProgressBar
        closeButton={false}
        newestOnTop
      />
    </Box>
  );
};

export default SurveyRenderer;
