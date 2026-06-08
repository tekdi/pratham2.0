// ============================================================
// BULK IMPORT — MAIN STEPPER ORCHESTRATOR
// Pratham 2.0 — Workspace MFE
// ============================================================

import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import TemplateDownload from './TemplateDownload';
import FileUpload from './FileUpload';
import DataPreview from './DataPreview';
import ValidationResults from './ValidationResults';
import ImportProgress from './ImportProgress';
import ImportSummary from './ImportSummary';

import { parseImportExcel } from '../../utils/bulkImportParser';
import { validateImportData } from '../../utils/bulkImportValidator';
import { BulkImportQueue } from '../../utils/bulkImportQueue';
import {
  ParsedImportData,
  ValidationResult,
  ImportProgress as ImportProgressType,
  ImportSession,
} from '../../types/bulkImport.types';
import { v4 as uuidv4 } from 'uuid';

// ─── Steps ────────────────────────────────────────────────────

const STEPS = [
  { label: 'Download Template', description: 'Get the sample Excel file' },
  { label: 'Upload Excel', description: 'Upload your filled template' },
  { label: 'Preview Data', description: 'Review parsed data' },
  { label: 'Validate', description: 'Check for errors' },
  { label: 'Import', description: 'Process all entities' },
  { label: 'Summary', description: 'View results' },
];

// ─── Component ────────────────────────────────────────────────

const BulkImportStepper: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [session, setSession] = useState<ImportSession>({
    id: uuidv4(),
    fileName: '',
    uploadedAt: 0,
    phase: 'idle',
    parsedData: null,
    validationResult: null,
    progress: null,
    resolvedIds: {},
  });

  const [parseError, setParseError] = useState<string | null>(null);
  const queueRef = useRef<BulkImportQueue | null>(null);

  // ─── Step 1→2: File uploaded
  const handleFileAccepted = useCallback(async (file: File) => {
    setParseError(null);
    setSession((s) => ({
      ...s,
      fileName: file.name,
      uploadedAt: Date.now(),
      phase: 'parsing',
    }));

    try {
      const parsedData = await parseImportExcel(file);
      setSession((s) => ({ ...s, parsedData, phase: 'previewing' }));
      setActiveStep(2);
    } catch (err: any) {
      setParseError(err.message || 'Failed to parse Excel file');
      setSession((s) => ({ ...s, phase: 'idle' }));
    }
  }, []);

  // ─── Step 2→3: Preview confirmed
  const handlePreviewConfirmed = useCallback(() => {
    if (!session.parsedData) return;
    const validationResult = validateImportData(session.parsedData);
    setSession((s) => ({ ...s, validationResult, phase: 'validating' }));
    setActiveStep(3);
  }, [session.parsedData]);

  // ─── Step 3→4: Start import
  const handleStartImport = useCallback(async () => {
    if (!session.parsedData) return;

    const queue = new BulkImportQueue();
    queue.buildJobs(session.parsedData);
    queueRef.current = queue;

    setSession((s) => ({ ...s, phase: 'importing' }));
    setActiveStep(4);

    queue.onProgress((progress) => {
      setSession((s) => ({ ...s, progress }));
    });

    const finalProgress = await queue.run();

    setSession((s) => ({
      ...s,
      phase: finalProgress.failedJobs > 0 && finalProgress.completedJobs > 0
        ? 'partial'
        : finalProgress.failedJobs > 0 ? 'failed' : 'completed',
      progress: finalProgress,
      resolvedIds: queue.getResolvedIds(),
    }));

    setActiveStep(5);
  }, [session.parsedData]);

  const handleAbort = useCallback(() => {
    queueRef.current?.abort();
  }, []);

  const handleReset = useCallback(() => {
    setActiveStep(0);
    setParseError(null);
    queueRef.current = null;
    setSession({
      id: uuidv4(),
      fileName: '',
      uploadedAt: 0,
      phase: 'idle',
      parsedData: null,
      validationResult: null,
      progress: null,
      resolvedIds: {},
    });
  }, []);

  // ─── Render step content ───────────────────────────────────

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <TemplateDownload onProceed={() => setActiveStep(1)} />;
      case 1:
        return (
          <>
            {parseError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {parseError}
              </Alert>
            )}
            <FileUpload
              onFileAccepted={handleFileAccepted}
              isParsing={session.phase === 'parsing'}
              onBack={() => setActiveStep(0)}
            />
          </>
        );
      case 2:
        return (
          <DataPreview
            parsedData={session.parsedData!}
            fileName={session.fileName}
            onConfirm={handlePreviewConfirmed}
            onBack={() => setActiveStep(1)}
          />
        );
      case 3:
        return (
          <ValidationResults
            parsedData={session.parsedData!}
            validationResult={session.validationResult!}
            onStartImport={handleStartImport}
            onBack={() => setActiveStep(2)}
          />
        );
      case 4:
        return (
          <ImportProgress
            progress={session.progress}
            onAbort={handleAbort}
          />
        );
      case 5:
        return (
          <ImportSummary
            session={session}
            onReset={handleReset}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={600} sx={{ color: '#2E1500' }}>
          Bulk Import
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Import content, question sets, and courses in bulk using an Excel template
        </Typography>
      </Box>

      {/* Stepper */}
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        sx={{
          mb: 4,
          '& .MuiStepLabel-label': { fontSize: '12px' },
          '& .MuiStepIcon-root.Mui-active': { color: 'var(--mui-palette-primary-main)' },
          '& .MuiStepIcon-root.Mui-completed': { color: 'var(--mui-palette-primary-main)' },
        }}
      >
        {STEPS.map((step) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step Content */}
      <Paper
        elevation={0}
        sx={{
          border: '1px solid #E0E0E0',
          borderRadius: 2,
          p: { xs: 2, md: 3 },
          minHeight: 400,
          background: '#FAFAFA',
        }}
      >
        {renderStepContent()}
      </Paper>
    </Box>
  );
};

export default BulkImportStepper;
