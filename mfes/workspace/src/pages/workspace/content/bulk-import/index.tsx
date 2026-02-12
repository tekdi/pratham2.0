import React, { useCallback, useEffect, useRef, useState } from 'react';
import Layout from '../../../../components/Layout';
import {
  Typography,
  Box,
  useTheme,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Alert,
  AlertTitle,
  IconButton,
  Collapse,
  Divider,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import WorkspaceText from '../../../../components/WorkspaceText';
import WorkspaceHeader from '../../../../components/WorkspaceHeader';
import useTenantConfig from '../../../../hooks/useTenantConfig';
import {
  parseCSVFile,
  validateHeaders,
  validateRows,
  groupByQuestionSet,
  getCSVSummary,
  CSVRow,
  ValidationError,
  ParsedQuestionSet,
} from '@workspace/utils/bulkImportValidation';
import {
  bulkImportQuestionSets,
  ImportProgress,
} from '@workspace/services/BulkImportService';

const STEPS = ['Upload CSV', 'Validate', 'Review & Import', 'Complete'];

const BulkImportPage = () => {
  const tenantConfig = useTenantConfig();
  const theme = useTheme();
  const [selectedKey, setSelectedKey] = useState('bulk-import');
  const [showHeader, setShowHeader] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [activeStep, setActiveStep] = useState(0);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [headerErrors, setHeaderErrors] = useState<string[]>([]);
  const [questionSets, setQuestionSets] = useState<ParsedQuestionSet[]>([]);
  const [importProgress, setImportProgress] = useState<ImportProgress | null>(
    null
  );
  const [isImporting, setIsImporting] = useState(false);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [showAllErrors, setShowAllErrors] = useState(false);

  useEffect(() => {
    const headerValue = localStorage.getItem('showHeader');
    setShowHeader(headerValue === 'true');
  }, []);

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (
        !file.name.endsWith('.csv') &&
        !file.type.includes('csv') &&
        !file.type.includes('text/plain')
      ) {
        setParseErrors(['Please upload a valid CSV file']);
        return;
      }

      setCsvFile(file);
      setParseErrors([]);
      setValidationErrors([]);
      setHeaderErrors([]);
      setQuestionSets([]);
      setImportProgress(null);
      setActiveStep(1);

      try {
        const { data, errors } = await parseCSVFile(file);

        if (errors.length > 0) {
          setParseErrors(errors);
        }

        if (data.length === 0) {
          setParseErrors((prev) => [...prev, 'CSV file is empty or has no data rows']);
          return;
        }

        // Validate headers
        const headers = Object.keys(data[0]);
        const missingHeaders = validateHeaders(headers);
        if (missingHeaders.length > 0) {
          setHeaderErrors(missingHeaders);
          return;
        }

        setCsvData(data);

        // Validate rows
        const rowErrors = validateRows(data);
        setValidationErrors(rowErrors);

        // Group by question set
        const grouped = groupByQuestionSet(data);
        setQuestionSets(grouped);

        if (rowErrors.length === 0) {
          setActiveStep(2);
        }
      } catch (error: any) {
        setParseErrors([`Failed to parse CSV: ${error?.message || 'Unknown error'}`]);
      }
    },
    []
  );

  const handleImport = async () => {
    if (!tenantConfig?.QUESTION_SET_FRAMEWORK) {
      setParseErrors(['Tenant configuration not loaded. Please refresh the page.']);
      return;
    }

    setIsImporting(true);
    setActiveStep(3);

    try {
      const result = await bulkImportQuestionSets(
        questionSets,
        tenantConfig.QUESTION_SET_FRAMEWORK,
        (progress) => {
          setImportProgress({ ...progress });
        }
      );

      setImportProgress(result);
    } catch (error: any) {
      setParseErrors([`Import failed: ${error?.message || 'Unknown error'}`]);
    } finally {
      setIsImporting(false);
    }
  };

  const handleReset = () => {
    setCsvFile(null);
    setCsvData([]);
    setParseErrors([]);
    setValidationErrors([]);
    setHeaderErrors([]);
    setQuestionSets([]);
    setImportProgress(null);
    setIsImporting(false);
    setActiveStep(0);
    setExpandedSections({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const downloadTemplate = () => {
    const headers = [
      'domain',
      'language',
      'subDomain',
      'subject',
      'testName',
      'description',
      'Question count',
      'sectionName',
      'question',
      'question_image',
      'option0',
      'option0_image',
      'option1',
      'option1_image',
      'option2',
      'option2_image',
      'option3',
      'option3_image',
      'ansOption',
      'maxScore',
      'questionType',
      'assessmentType',
      'program',
      'Question Format',
    ];

    const sampleRow = [
      'Learning for Work',
      'Hindi',
      'Career Exploration',
      'Healthcare',
      'Sample Test',
      'Sample Description',
      '1',
      'Section 1',
      'What is 2+2?',
      '',
      '3',
      '',
      '4',
      '',
      '5',
      '',
      '6',
      '',
      '2',
      '1',
      'MULTIPLE CHOICE',
      '',
      '',
      '',
    ];

    const csvContent =
      headers.join(',') + '\n' + sampleRow.join(',') + '\n';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bulk_import_template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const summary = questionSets.length > 0 ? getCSVSummary(questionSets) : null;

  const progressPercentage =
    importProgress && importProgress.totalQuestions > 0
      ? Math.round(
          (importProgress.questionsProcessed / importProgress.totalQuestions) *
            100
        )
      : 0;

  const getStepStatusMessage = () => {
    if (!importProgress) return '';
    switch (importProgress.currentStep) {
      case 'creating':
        return `Creating question set: ${importProgress.currentQuestionSetName}`;
      case 'sections':
        return `Adding sections to: ${importProgress.currentQuestionSetName}`;
      case 'questions':
        return `Adding questions to: ${importProgress.currentQuestionSetName}`;
      case 'review':
        return `Sending for review: ${importProgress.currentQuestionSetName}`;
      case 'done':
        return 'Import completed';
      case 'error':
        return 'Import encountered errors';
      default:
        return '';
    }
  };

  return (
    <>
      {showHeader && <WorkspaceHeader />}
      <Layout selectedKey={selectedKey} onSelect={setSelectedKey}>
        <WorkspaceText />

        <Box
          sx={{
            background: 'linear-gradient(to bottom, white, #F8EFDA)',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: theme.shadows[3],
          }}
          m={3}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h4" fontSize="16px" fontWeight={600}>
              Bulk Import Question Sets
            </Typography>
            <Button
              startIcon={<DownloadIcon />}
              variant="outlined"
              size="small"
              onClick={downloadTemplate}
            >
              Download Template
            </Button>
          </Box>

          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step 0: Upload */}
          {activeStep === 0 && (
            <Paper
              elevation={0}
              sx={{
                border: '2px dashed #D0C5B4',
                borderRadius: '12px',
                padding: '3rem',
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: 'rgba(0,0,0,0.02)',
                },
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <CloudUploadIcon
                sx={{ fontSize: 48, color: '#635E57', mb: 1 }}
              />
              <Typography variant="h6" gutterBottom>
                Upload CSV File
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Drag and drop or click to select a CSV file
              </Typography>
              <Typography
                variant="caption"
                color="textSecondary"
                display="block"
              >
                Supported format: .csv
              </Typography>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
              />
            </Paper>
          )}

          {/* Parse Errors */}
          {parseErrors.length > 0 && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <AlertTitle>Parsing Errors</AlertTitle>
              {parseErrors.map((err, i) => (
                <Typography key={i} variant="body2">
                  {err}
                </Typography>
              ))}
            </Alert>
          )}

          {/* Header Errors */}
          {headerErrors.length > 0 && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <AlertTitle>Missing Required Columns</AlertTitle>
              <Typography variant="body2">
                The following required columns are missing from the CSV:
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
                {headerErrors.map((h) => (
                  <Chip
                    key={h}
                    label={h}
                    color="error"
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Alert>
          )}

          {/* Step 1: Validation Results */}
          {activeStep === 1 && validationErrors.length > 0 && (
            <Box mt={2}>
              <Alert severity="warning" sx={{ mb: 2 }}>
                <AlertTitle>
                  Validation Issues ({validationErrors.length} errors found)
                </AlertTitle>
                <Typography variant="body2">
                  Please fix the following issues in your CSV file and re-upload.
                </Typography>
              </Alert>

              <TableContainer
                component={Paper}
                sx={{ maxHeight: 400 }}
                elevation={0}
              >
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Row</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Field</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Error</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(showAllErrors
                      ? validationErrors
                      : validationErrors.slice(0, 20)
                    ).map((err, i) => (
                      <TableRow key={i}>
                        <TableCell>{err.row}</TableCell>
                        <TableCell>
                          <Chip
                            label={err.field}
                            size="small"
                            color="warning"
                          />
                        </TableCell>
                        <TableCell>{err.message}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {validationErrors.length > 20 && (
                <Button
                  size="small"
                  onClick={() => setShowAllErrors(!showAllErrors)}
                  sx={{ mt: 1 }}
                >
                  {showAllErrors
                    ? 'Show Less'
                    : `Show All ${validationErrors.length} Errors`}
                </Button>
              )}

              <Box display="flex" gap={2} mt={2}>
                <Button variant="outlined" onClick={handleReset}>
                  Upload Different File
                </Button>
                {questionSets.length > 0 && (
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={() => setActiveStep(2)}
                  >
                    Proceed Anyway (skip invalid rows)
                  </Button>
                )}
              </Box>
            </Box>
          )}

          {/* Step 1: Validation passed */}
          {activeStep >= 1 &&
            validationErrors.length === 0 &&
            headerErrors.length === 0 &&
            parseErrors.length === 0 &&
            csvData.length > 0 && (
              <Alert severity="success" sx={{ mt: 2 }}>
                <AlertTitle>Validation Passed</AlertTitle>
                <Typography variant="body2">
                  All {csvData.length} rows validated successfully.
                </Typography>
              </Alert>
            )}

          {/* Step 2: Review */}
          {activeStep === 2 && summary && (
            <Box mt={2}>
              <Paper elevation={0} sx={{ p: 2, mb: 2, border: '1px solid #D0C5B4' }}>
                <Typography variant="h6" fontSize="14px" fontWeight={600} gutterBottom>
                  Import Summary
                </Typography>
                <Box display="flex" gap={3} flexWrap="wrap">
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Question Sets
                    </Typography>
                    <Typography variant="h5" fontSize="24px" fontWeight={600}>
                      {summary.totalQuestionSets}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Sections
                    </Typography>
                    <Typography variant="h5" fontSize="24px" fontWeight={600}>
                      {summary.totalSections}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Questions
                    </Typography>
                    <Typography variant="h5" fontSize="24px" fontWeight={600}>
                      {summary.totalQuestions}
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Question Set Details */}
              {questionSets.map((qs, qsIndex) => (
                <Paper
                  key={qsIndex}
                  elevation={0}
                  sx={{ mb: 1, border: '1px solid #D0C5B4' }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    p={1.5}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => toggleSection(`qs-${qsIndex}`)}
                  >
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600} fontSize="14px">
                        {qs.testName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {qs.language} | {qs.subject} | {qs.sections.length}{' '}
                        section(s) |{' '}
                        {qs.sections.reduce(
                          (a, s) => a + s.questions.length,
                          0
                        )}{' '}
                        question(s)
                      </Typography>
                    </Box>
                    <IconButton size="small">
                      {expandedSections[`qs-${qsIndex}`] ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </IconButton>
                  </Box>
                  <Collapse in={expandedSections[`qs-${qsIndex}`]}>
                    <Divider />
                    <Box p={1.5}>
                      {qs.sections.map((section, sIndex) => (
                        <Box key={sIndex} mb={1}>
                          <Typography
                            variant="subtitle2"
                            fontWeight={600}
                            fontSize="13px"
                            color="textSecondary"
                          >
                            {section.name} ({section.questions.length} questions)
                          </Typography>
                          <TableContainer sx={{ maxHeight: 300 }}>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell sx={{ fontWeight: 600, width: 50 }}>
                                    #
                                  </TableCell>
                                  <TableCell sx={{ fontWeight: 600 }}>
                                    Question
                                  </TableCell>
                                  <TableCell sx={{ fontWeight: 600, width: 100 }}>
                                    Answer
                                  </TableCell>
                                  <TableCell sx={{ fontWeight: 600, width: 80 }}>
                                    Score
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {section.questions.map((q, qIndex) => (
                                  <TableRow key={qIndex}>
                                    <TableCell>{qIndex + 1}</TableCell>
                                    <TableCell>
                                      <Typography variant="body2" noWrap sx={{ maxWidth: 400 }}>
                                        {q.question}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      Option {q.ansOption}
                                    </TableCell>
                                    <TableCell>{q.maxScore}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      ))}
                    </Box>
                  </Collapse>
                </Paper>
              ))}

              <Box display="flex" gap={2} mt={3}>
                <Button variant="outlined" onClick={handleReset}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleImport}
                  disabled={isImporting}
                >
                  Start Import & Send for Review
                </Button>
              </Box>
            </Box>
          )}

          {/* Step 3: Import Progress */}
          {activeStep === 3 && importProgress && (
            <Box mt={2}>
              <Paper elevation={0} sx={{ p: 3, border: '1px solid #D0C5B4' }}>
                <Typography
                  variant="h6"
                  fontSize="14px"
                  fontWeight={600}
                  gutterBottom
                >
                  Import Progress
                </Typography>

                <Box mb={2}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                  >
                    <Typography variant="body2" color="textSecondary">
                      {getStepStatusMessage()}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {importProgress.currentQuestionSet} /{' '}
                      {importProgress.totalQuestionSets} Question Sets
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={progressPercentage}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      mb: 1,
                    }}
                  />
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    display="block"
                    textAlign="right"
                  >
                    {importProgress.questionsProcessed} /{' '}
                    {importProgress.totalQuestions} questions processed (
                    {progressPercentage}%)
                  </Typography>
                </Box>

                {importProgress.currentStep === 'done' && (
                  <Alert
                    severity={
                      importProgress.errors.length > 0 ? 'warning' : 'success'
                    }
                    sx={{ mb: 2 }}
                    icon={
                      importProgress.errors.length > 0 ? (
                        <WarningIcon />
                      ) : (
                        <CheckCircleIcon />
                      )
                    }
                  >
                    <AlertTitle>
                      {importProgress.errors.length > 0
                        ? 'Import Completed with Warnings'
                        : 'Import Completed Successfully'}
                    </AlertTitle>
                    <Typography variant="body2">
                      {importProgress.completedIds.length} question set(s) created
                      and sent for review.
                      {importProgress.errors.length > 0 &&
                        ` ${importProgress.errors.length} error(s) encountered.`}
                    </Typography>
                  </Alert>
                )}

                {/* Error Log */}
                {importProgress.errors.length > 0 && (
                  <Box mt={2}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      gutterBottom
                      color="error"
                    >
                      Error Log ({importProgress.errors.length})
                    </Typography>
                    <TableContainer
                      component={Paper}
                      sx={{ maxHeight: 300 }}
                      elevation={0}
                    >
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>
                              Question Set
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Step</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Error</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {importProgress.errors.map((err, i) => (
                            <TableRow key={i}>
                              <TableCell>{err.questionSetName}</TableCell>
                              <TableCell>
                                <Chip
                                  label={err.step}
                                  size="small"
                                  color="error"
                                />
                              </TableCell>
                              <TableCell>{err.message}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}

                {importProgress.currentStep === 'done' && (
                  <Box mt={3}>
                    <Button variant="contained" onClick={handleReset}>
                      Import Another File
                    </Button>
                  </Box>
                )}
              </Paper>
            </Box>
          )}

          {/* File info bar */}
          {csvFile && activeStep > 0 && activeStep < 3 && (
            <Paper
              elevation={0}
              sx={{
                mt: 2,
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid #D0C5B4',
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Chip
                  label="CSV"
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                <Typography variant="body2">{csvFile.name}</Typography>
                <Typography variant="caption" color="textSecondary">
                  ({(csvFile.size / 1024).toFixed(1)} KB)
                </Typography>
              </Box>
              <IconButton size="small" onClick={handleReset} title="Remove file">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Paper>
          )}
        </Box>
      </Layout>
    </>
  );
};

export default BulkImportPage;
