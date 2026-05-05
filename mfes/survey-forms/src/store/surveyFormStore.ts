'use client';

import { create } from 'zustand';
import { Survey, SurveyResponse, PaginationMeta } from '../types/survey';
import { ValidationError } from '../utils/validation';

interface SurveyListState {
  surveys: Survey[];
  pagination: PaginationMeta | null;
  loading: boolean;
  error: string | null;
}

interface SurveyFormState {
  survey: Survey | null;
  response: SurveyResponse | null;
  formValues: Record<string, any>;
  errors: Record<string, string>;
  validationErrors: ValidationError[];
  loading: boolean;
  saving: boolean;
  submitting: boolean;
  submitted: boolean;
  error: string | null;
  lastAutoSavedAt: Date | null;
  hasUnsavedChanges: boolean;
}

interface SurveyStore {
  list: SurveyListState;
  form: SurveyFormState;

  // List actions
  setListLoading: (loading: boolean) => void;
  setSurveys: (surveys: Survey[], pagination: PaginationMeta) => void;
  setListError: (error: string | null) => void;

  // Form actions
  setFormLoading: (loading: boolean) => void;
  setSurvey: (survey: Survey) => void;
  setResponse: (response: SurveyResponse) => void;
  setFormValues: (values: Record<string, any>) => void;
  updateFieldValue: (fieldName: string, value: any) => void;
  setFieldError: (fieldName: string, error: string) => void;
  clearFieldError: (fieldName: string) => void;
  setValidationErrors: (errors: ValidationError[]) => void;
  setSaving: (saving: boolean) => void;
  setSubmitting: (submitting: boolean) => void;
  setSubmitted: (submitted: boolean) => void;
  setFormError: (error: string | null) => void;
  resetForm: () => void;
  setLastAutoSavedAt: (date: Date) => void;
  setHasUnsavedChanges: (value: boolean) => void;
}

const initialFormState: SurveyFormState = {
  survey: null,
  response: null,
  formValues: {},
  errors: {},
  validationErrors: [],
  loading: false,
  saving: false,
  submitting: false,
  submitted: false,
  error: null,
  lastAutoSavedAt: null,
  hasUnsavedChanges: false,
};

export const useSurveyStore = create<SurveyStore>((set) => ({
  list: {
    surveys: [],
    pagination: null,
    loading: false,
    error: null,
  },
  form: { ...initialFormState },

  // List actions
  setListLoading: (loading) =>
    set((state) => ({ list: { ...state.list, loading } })),
  setSurveys: (surveys, pagination) =>
    set((state) => ({
      list: { ...state.list, surveys, pagination, loading: false, error: null },
    })),
  setListError: (error) =>
    set((state) => ({ list: { ...state.list, error, loading: false } })),

  // Form actions
  setFormLoading: (loading) =>
    set((state) => ({ form: { ...state.form, loading } })),
  setSurvey: (survey) =>
    set((state) => ({ form: { ...state.form, survey } })),
  setResponse: (response) =>
    set((state) => ({ form: { ...state.form, response } })),
  setFormValues: (values) =>
    set((state) => ({ form: { ...state.form, formValues: values } })),
  updateFieldValue: (fieldName, value) =>
    set((state) => ({
      form: {
        ...state.form,
        formValues: { ...state.form.formValues, [fieldName]: value },
        errors: { ...state.form.errors, [fieldName]: '' },
        hasUnsavedChanges: true,
      },
    })),
  setFieldError: (fieldName, error) =>
    set((state) => ({
      form: {
        ...state.form,
        errors: { ...state.form.errors, [fieldName]: error },
      },
    })),
  clearFieldError: (fieldName) =>
    set((state) => {
      const errors = { ...state.form.errors };
      delete errors[fieldName];
      return { form: { ...state.form, errors } };
    }),
  setValidationErrors: (validationErrors) =>
    set((state) => {
      const errors: Record<string, string> = {};
      validationErrors.forEach((ve) => {
        errors[ve.fieldName] = ve.message;
      });
      return { form: { ...state.form, validationErrors, errors } };
    }),
  setSaving: (saving) =>
    set((state) => ({ form: { ...state.form, saving } })),
  setSubmitting: (submitting) =>
    set((state) => ({ form: { ...state.form, submitting } })),
  setSubmitted: (submitted) =>
    set((state) => ({ form: { ...state.form, submitted } })),
  setFormError: (error) =>
    set((state) => ({ form: { ...state.form, error } })),
  resetForm: () => set({ form: { ...initialFormState } }),
  setLastAutoSavedAt: (date) =>
    set((state) => ({ form: { ...state.form, lastAutoSavedAt: date, hasUnsavedChanges: false } })),
  setHasUnsavedChanges: (value) =>
    set((state) => ({ form: { ...state.form, hasUnsavedChanges: value } })),
}));
