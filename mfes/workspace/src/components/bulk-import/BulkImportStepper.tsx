// ============================================================
// BULK IMPORT — MAIN STEPPER ORCHESTRATOR
// Pratham 2.0 — Workspace MFE
// ============================================================

import React, { useCallback, useSyncExternalStore } from 'react';
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
import * as importSession from '../../utils/bulkImportSession';

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
  // State lives in a module-level store, not in this component. Navigating away
  // and back remounts the stepper but the import keeps running untouched, and
  // this simply re-renders whatever the store currently holds.
  const { activeStep, session, parseError } = useSyncExternalStore(
    importSession.subscribe,
    importSession.getSnapshot,
    importSession.getServerSnapshot
  );

  const setActiveStep = importSession.setActiveStep;

  // ─── Step 1→2: File uploaded
  const handleFileAccepted = useCallback(async (file: File) => {
    importSession.setParseError(null);
    importSession.setFileMeta(file.name);

    try {
      const parsedData = await parseImportExcel(file);
      importSession.setParsedData(parsedData);
      importSession.setActiveStep(2);
    } catch (err: any) {
      importSession.setParseError(err.message || 'Failed to parse Excel file');
      importSession.setPhase('idle');
    }
  }, []);

  // ─── Step 2→3: Preview confirmed
  const handlePreviewConfirmed = useCallback(() => {
    const parsed = importSession.getSnapshot().session.parsedData;
    if (!parsed) return;
    importSession.setValidationResult(validateImportData(parsed));
    importSession.setActiveStep(3);
  }, []);

  // ─── Step 3→4: Start import
  // The store owns the queue and the await, so the run is no longer tied to
  // this component being mounted.
  const handleStartImport = useCallback(() => {
    void importSession.startImport();
  }, []);

  const handleAbort = useCallback(() => {
    importSession.abortImport();
  }, []);

  const handleReset = useCallback(() => {
    importSession.resetSession();
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
