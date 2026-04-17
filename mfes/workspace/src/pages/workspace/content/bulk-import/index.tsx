import React, { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Papa from 'papaparse';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Divider,
  IconButton,
  LinearProgress,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ReplayIcon from '@mui/icons-material/Replay';
import Layout from '../../../../components/Layout';
import WorkspaceText from '../../../../components/WorkspaceText';
import WorkspaceHeader from '../../../../components/WorkspaceHeader';
import useTenantConfig from '../../../../hooks/useTenantConfig';
import {
  CSVRow,
  ImportProgress,
  ImportResult,
  ParsedQuestionSet,
  ValidationError,
  ValidationResult,
  downloadCSVTemplate,
  importSingleQuestionSet,
  validateCSVData,
} from '../../../../services/BulkImportService';

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

const StatusBadge: React.FC<{ status: ImportProgress['status'] }> = ({ status }) => {
  const map: Record<
    ImportProgress['status'],
    { label: string; color: 'default' | 'info' | 'warning' | 'success' | 'error' }
  > = {
    pending:           { label: 'Pending',            color: 'default' },
    creating:          { label: 'Creating QS…',       color: 'info' },
    adding_sections:   { label: 'Adding sections…',   color: 'info' },
    submitting_review: { label: 'Sending for review…',color: 'warning' },
    done:              { label: 'Done',                color: 'success' },
    failed:            { label: 'Failed',              color: 'error' },
  };
  const { label, color } = map[status];
  return <Chip label={label} color={color} size="small" />;
};

// ─────────────────────────────────────────────
// Preview accordion per question set
// ─────────────────────────────────────────────

const QuestionSetPreview: React.FC<{ qs: ParsedQuestionSet; idx: number }> = ({
  qs,
  idx,
}) => {
  const [open, setOpen] = useState(idx === 0);
  const totalQ = qs.sections.reduce((s, sec) => s + sec.questions.length, 0);
  const totalMarks = qs.sections.reduce(
    (s, sec) => s + sec.questions.reduce((ss, q) => ss + q.marks, 0),
    0
  );

  return (
    <Paper variant="outlined" sx={{ mb: 1 }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        px={2}
        py={1}
        sx={{ cursor: 'pointer' }}
        onClick={() => setOpen((o) => !o)}
      >
        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
          <Typography fontWeight={600}>{qs.name}</Typography>
          <Chip
            label={`${qs.sections.length} section${qs.sections.length !== 1 ? 's' : ''}`}
            size="small"
          />
          <Chip
            label={`${totalQ} Q`}
            size="small"
            color="primary"
            variant="outlined"
          />
          <Chip
            label={`${totalMarks} marks`}
            size="small"
            color="secondary"
            variant="outlined"
          />
          {qs.meta.language && (
            <Chip label={qs.meta.language} size="small" variant="outlined" />
          )}
          {qs.meta.subject && (
            <Chip label={qs.meta.subject} size="small" variant="outlined" />
          )}
        </Box>
        <IconButton size="small">
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={open}>
        <Divider />
        {(qs.meta.domain || qs.meta.subDomain || qs.meta.description) && (
          <Box px={2} py={1} bgcolor="action.hover" display="flex" gap={1} flexWrap="wrap" alignItems="center">
            {qs.meta.domain && (
              <Typography variant="caption" color="text.secondary">
                Domain: <strong>{qs.meta.domain}</strong>
              </Typography>
            )}
            {qs.meta.subDomain && (
              <Typography variant="caption" color="text.secondary">
                Sub-domain: <strong>{qs.meta.subDomain}</strong>
              </Typography>
            )}
            {qs.meta.description && (
              <Typography variant="caption" color="text.secondary">
                | {qs.meta.description}
              </Typography>
            )}
          </Box>
        )}
        {qs.sections.map((section, si) => (
          <Box key={si} px={2} pb={1}>
            <Typography variant="subtitle2" fontWeight={600} mt={1} mb={0.5}>
              {section.name}{' '}
              <Typography component="span" variant="caption" color="text.secondary">
                ({section.questions.length} question
                {section.questions.length !== 1 ? 's' : ''})
              </Typography>
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell width={30}>#</TableCell>
                    <TableCell>Question</TableCell>
                    <TableCell>Options (option0–3)</TableCell>
                    <TableCell>Correct</TableCell>
                    <TableCell>Marks</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {section.questions.map((q, qi) => (
                    <TableRow key={qi}>
                      <TableCell>{qi + 1}</TableCell>
                      <TableCell sx={{ maxWidth: 280 }}>{q.text}</TableCell>
                      <TableCell>
                        {q.options.map((o, oi) =>
                          o ? (
                            <Chip
                              key={oi}
                              label={`${oi}: ${o}`}
                              size="small"
                              variant={oi === q.correctIndex ? 'filled' : 'outlined'}
                              color={oi === q.correctIndex ? 'success' : 'default'}
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          ) : null
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={q.options[q.correctIndex]}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{q.marks}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))}
      </Collapse>
    </Paper>
  );
};

// ─────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────

const BulkImportPage: React.FC = () => {
  const theme = useTheme();
  const tenantConfig = useTenantConfig();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showHeader, setShowHeader] = useState<boolean | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  // Step 0
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Step 1
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [showAllErrors, setShowAllErrors] = useState(false);

  // Step 2
  const [progressMap, setProgressMap] = useState<Map<string, ImportProgress>>(new Map());
  const [isImporting, setIsImporting] = useState(false);

  // Step 3
  const [results, setResults] = useState<ImportResult[]>([]);

  React.useEffect(() => {
    const v = localStorage.getItem('showHeader');
    setShowHeader(v === 'true');
  }, []);

  // ── File handling ──────────────────────────────────────────────────────────

  const parseFile = useCallback((file: File) => {
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.CSV')) {
      setValidationResult({
        valid: false,
        errors: [
          {
            row: 0,
            column: 'file',
            message: 'Only .csv files are accepted. If you have an Excel file, save it as CSV first.',
            severity: 'error',
          },
        ],
        questionSets: [],
      });
      setActiveStep(1);
      return;
    }

    setFileName(file.name);

    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
      transform: (v) => v.trim(),
      complete: (result) => {
        const headers: string[] = result.meta.fields ?? [];
        const rows = result.data as CSVRow[];
        const validation = validateCSVData(rows, headers);
        setValidationResult(validation);
        setActiveStep(1);
      },
      error: (err) => {
        setValidationResult({
          valid: false,
          errors: [
            {
              row: 0,
              column: 'file',
              message: `Failed to parse CSV: ${err.message}`,
              severity: 'error',
            },
          ],
          questionSets: [],
        });
        setActiveStep(1);
      },
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) parseFile(file);
    e.target.value = '';
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) parseFile(file);
    },
    [parseFile]
  );

  // ── Import ─────────────────────────────────────────────────────────────────

  const startImport = async () => {
    if (!validationResult?.questionSets.length || !tenantConfig) return;

    setIsImporting(true);
    setActiveStep(2);

    const frameworkId = tenantConfig.QUESTION_SET_FRAMEWORK;
    const channelId = tenantConfig.CHANNEL_ID;

    // Initialise progress map
    const initMap = new Map<string, ImportProgress>(
      validationResult.questionSets.map((qs) => [
        qs.name,
        { questionSetName: qs.name, status: 'pending' },
      ])
    );
    setProgressMap(new Map(initMap));

    const importResults: ImportResult[] = [];

    // Sequential processing to avoid API rate limiting
    for (const qs of validationResult.questionSets) {
      const result = await importSingleQuestionSet(
        qs,
        frameworkId,
        channelId,
        (status) => {
          setProgressMap((prev) => {
            const next = new Map(prev);
            next.set(qs.name, { ...next.get(qs.name)!, status });
            return next;
          });
        }
      );
      importResults.push(result);
    }

    setResults(importResults);
    setIsImporting(false);
    setActiveStep(3);
  };

  // ── Reset ──────────────────────────────────────────────────────────────────

  const resetAll = () => {
    setFileName(null);
    setValidationResult(null);
    setProgressMap(new Map());
    setResults([]);
    setShowAllErrors(false);
    setIsImporting(false);
    setActiveStep(0);
  };

  // ─────────────────────────────────────────────
  // Derived state
  // ─────────────────────────────────────────────

  const allErrors: ValidationError[] = validationResult?.errors ?? [];
  const visibleErrors = showAllErrors ? allErrors : allErrors.slice(0, 10);
  const successCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;

  // ─────────────────────────────────────────────
  // Step panels
  // ─────────────────────────────────────────────

  const renderUploadStep = () => (
    <Box>
      {/* Template + guide */}
      <Box display="flex" gap={1} mb={2} flexWrap="wrap">
        <Button
          startIcon={<DownloadIcon />}
          variant="outlined"
          size="small"
          onClick={downloadCSVTemplate}
        >
          Download CSV Template
        </Button>
      </Box>

      {/* Drop zone */}
      <Box
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        sx={{
          border: `2px dashed ${
            isDragging ? theme.palette.primary.main : theme.palette.divider
          }`,
          borderRadius: 2,
          p: 5,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: isDragging ? 'action.hover' : 'background.paper',
          transition: 'all 0.2s',
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
        <CloudUploadOutlinedIcon
          sx={{ fontSize: 52, color: 'text.secondary', mb: 1 }}
        />
        <Typography variant="h6" gutterBottom>
          Drag &amp; drop a CSV file here
        </Typography>
        <Typography variant="body2" color="text.secondary">
          or click to browse &nbsp;·&nbsp; Only .csv files accepted
        </Typography>
        {fileName && (
          <Chip label={fileName} color="primary" sx={{ mt: 2 }} />
        )}
      </Box>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Format guide */}
      <Box mt={3}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          CSV Column Reference
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><strong>Column</strong></TableCell>
                <TableCell><strong>Required</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                { col: 'testName',     req: 'Yes', desc: 'Name of the question set (groups rows into one QS).' },
                { col: 'description',  req: 'No',  desc: 'Optional description for the question set.' },
                { col: 'sectionName',  req: 'Yes', desc: 'Section name within the question set.' },
                { col: 'question',     req: 'Yes', desc: 'MCQ question text.' },
                { col: 'option0',      req: 'Yes', desc: 'First answer choice (index 0).' },
                { col: 'option1',      req: 'Yes', desc: 'Second answer choice (index 1).' },
                { col: 'option2',      req: 'No',  desc: 'Third answer choice (index 2).' },
                { col: 'option3',      req: 'No',  desc: 'Fourth answer choice (index 3).' },
                { col: 'ansOption',    req: 'Yes', desc: '0-indexed correct option (0, 1, 2, or 3).' },
                { col: 'maxScore',     req: 'Yes', desc: 'Marks for this question (positive number).' },
                { col: 'domain',       req: 'No',  desc: 'Content domain (e.g. Learning for Life).' },
                { col: 'subDomain',    req: 'No',  desc: 'Content sub-domain.' },
                { col: 'subject',      req: 'No',  desc: 'Subject (e.g. Healthcare).' },
                { col: 'language',     req: 'No',  desc: 'Language of questions (e.g. Hindi, Marathi).' },
                { col: 'assessmentType', req: 'No', desc: 'Assessment type (e.g. Mock Test).' },
                { col: 'program',      req: 'No',  desc: 'Program name.' },
              ].map(({ col, req, desc }) => (
                <TableRow key={col}>
                  <TableCell>
                    <code>{col}</code>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={req}
                      size="small"
                      color={req === 'Yes' ? 'error' : 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Alert severity="info" sx={{ mt: 2 }} icon={<InfoOutlinedIcon />}>
          <AlertTitle>Tips</AlertTitle>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>
              Rows with the <strong>same testName</strong> are grouped into one question set.
            </li>
            <li>
              Rows with the <strong>same sectionName</strong> (within a testName) go into
              the same section.
            </li>
            <li>
              <strong>ansOption</strong> is 0-indexed: 0 = option0, 1 = option1, 2 = option2,
              3 = option3.
            </li>
            <li>
              Limits: max <strong>10 question sets</strong>, <strong>20 sections/set</strong>,{' '}
              <strong>500 questions/set</strong> per import.
            </li>
            <li>
              Each imported question set is automatically sent for review after creation.
            </li>
            <li>
              If your file is an Excel (.xlsx), open it in Excel/Sheets and export as CSV
              first.
            </li>
          </ul>
        </Alert>
      </Box>
    </Box>
  );

  const renderValidationStep = () => {
    if (!validationResult) return null;
    const { valid, errors, questionSets } = validationResult;
    const errCount = errors.filter((e) => e.severity === 'error').length;
    const warnCount = errors.filter((e) => e.severity === 'warning').length;

    return (
      <Box>
        {/* Result banner */}
        {valid ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            <AlertTitle>Validation Passed</AlertTitle>
            {questionSets.length} question set
            {questionSets.length !== 1 ? 's' : ''} ready to import.
            {warnCount > 0 && ` (${warnCount} warning${warnCount !== 1 ? 's' : ''})`}
          </Alert>
        ) : (
          <Alert severity="error" sx={{ mb: 2 }}>
            <AlertTitle>Validation Failed — {errCount} error{errCount !== 1 ? 's' : ''}</AlertTitle>
            Fix the issues below and upload the CSV again.
          </Alert>
        )}

        {/* Errors table */}
        {errors.length > 0 && (
          <Box mb={3}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Issues ({errors.length})
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Severity</TableCell>
                    <TableCell>Row</TableCell>
                    <TableCell>Column</TableCell>
                    <TableCell>Message</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleErrors.map((e, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Chip
                          label={e.severity}
                          size="small"
                          color={e.severity === 'error' ? 'error' : 'warning'}
                        />
                      </TableCell>
                      <TableCell>{e.row === 0 ? '—' : e.row}</TableCell>
                      <TableCell>
                        <code>{e.column}</code>
                      </TableCell>
                      <TableCell>{e.message}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {errors.length > 10 && (
              <Button
                size="small"
                onClick={() => setShowAllErrors((v) => !v)}
                sx={{ mt: 1 }}
              >
                {showAllErrors
                  ? 'Show fewer'
                  : `Show all ${errors.length} issues`}
              </Button>
            )}
          </Box>
        )}

        {/* Preview */}
        {questionSets.length > 0 && (
          <Box mb={2}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Preview — {questionSets.length} Question Set
              {questionSets.length !== 1 ? 's' : ''}
            </Typography>
            {questionSets.map((qs, i) => (
              <QuestionSetPreview key={i} qs={qs} idx={i} />
            ))}
          </Box>
        )}

        <Box display="flex" gap={1} flexWrap="wrap">
          <Button
            variant="outlined"
            startIcon={<ReplayIcon />}
            onClick={resetAll}
          >
            Upload Different File
          </Button>
          {valid && (
            <Button
              variant="contained"
              color="primary"
              onClick={startImport}
              disabled={!tenantConfig}
            >
              {tenantConfig ? 'Start Import' : 'Loading config…'}
            </Button>
          )}
        </Box>
      </Box>
    );
  };

  const renderImportStep = () => {
    const qsList = validationResult?.questionSets ?? [];
    const done = [...progressMap.values()].filter(
      (p) => p.status === 'done' || p.status === 'failed'
    ).length;
    const total = qsList.length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

    const stepLabel: Record<ImportProgress['status'], string> = {
      pending:           '—',
      creating:          'Creating question set…',
      adding_sections:   'Adding sections & questions…',
      submitting_review: 'Sending for review…',
      done:              'Complete',
      failed:            'Failed',
    };

    return (
      <Box>
        <Box display="flex" alignItems="center" gap={2} mb={1}>
          {isImporting && <CircularProgress size={20} />}
          <Typography variant="body2" color="text.secondary">
            {isImporting
              ? `Importing ${Math.min(done + 1, total)} of ${total}…`
              : 'Import complete — see summary below.'}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={pct}
          sx={{ mb: 3, height: 8, borderRadius: 4 }}
        />

        {qsList.map((qs) => {
          const prog = progressMap.get(qs.name);
          const status = prog?.status ?? 'pending';
          const totalQ = qs.sections.reduce(
            (s, sec) => s + sec.questions.length,
            0
          );

          return (
            <Paper key={qs.name} variant="outlined" sx={{ p: 1.5, mb: 1 }}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
                gap={1}
              >
                <Box>
                  <Typography fontWeight={500}>{qs.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {qs.sections.length} section
                    {qs.sections.length !== 1 ? 's' : ''} · {totalQ} question
                    {totalQ !== 1 ? 's' : ''}
                    {qs.meta.language ? ` · ${qs.meta.language}` : ''}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  {(status === 'creating' ||
                    status === 'adding_sections' ||
                    status === 'submitting_review') && (
                    <CircularProgress size={16} />
                  )}
                  <StatusBadge status={status} />
                </Box>
              </Box>
              {status !== 'pending' &&
                status !== 'done' &&
                status !== 'failed' && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    mt={0.5}
                  >
                    {stepLabel[status]}
                  </Typography>
                )}
            </Paper>
          );
        })}
      </Box>
    );
  };

  const renderSummaryStep = () => {

    return (
      <Box>
        {/* Counts */}
        <Box display="flex" gap={2} mb={3} flexWrap="wrap">
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              flex: '1 1 140px',
              textAlign: 'center',
              borderColor: 'success.main',
            }}
          >
            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 36 }} />
            <Typography variant="h5" fontWeight={700} color="success.main">
              {successCount}
            </Typography>
            <Typography variant="body2">Successfully Imported</Typography>
          </Paper>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              flex: '1 1 140px',
              textAlign: 'center',
              borderColor: failCount > 0 ? 'error.main' : 'divider',
            }}
          >
            <ErrorOutlineIcon
              color={failCount > 0 ? 'error' : 'disabled'}
              sx={{ fontSize: 36 }}
            />
            <Typography
              variant="h5"
              fontWeight={700}
              color={failCount > 0 ? 'error.main' : 'text.disabled'}
            >
              {failCount}
            </Typography>
            <Typography variant="body2">Failed</Typography>
          </Paper>
        </Box>

        {/* Results table */}
        <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Question Set</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Identifier</TableCell>
                <TableCell>Open</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((r) => (
                <TableRow key={r.questionSetName}>
                  <TableCell>{r.questionSetName}</TableCell>
                  <TableCell>
                    {r.success ? (
                      <Chip label="Success" color="success" size="small" />
                    ) : (
                      <Tooltip title={r.error ?? 'Unknown error'} arrow>
                        <Chip label="Failed" color="error" size="small" />
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {r.identifier ?? '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {r.identifier && (
                      <Tooltip title="Open in QuestionSet editor" arrow>
                        <IconButton
                          size="small"
                          onClick={() =>
                            window.open(
                              `${router.basePath}/editor?identifier=${r.identifier}`,
                              '_blank'
                            )
                          }
                        >
                          <OpenInNewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {failCount > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <AlertTitle>Some imports failed</AlertTitle>
            Hover the &quot;Failed&quot; chip to see the error. Fix those rows in your CSV and
            import again.
          </Alert>
        )}

        {successCount > 0 && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successCount} question set{successCount !== 1 ? 's' : ''} sent for review
            successfully. A reviewer will need to approve them before they become live.
          </Alert>
        )}

        <Box display="flex" gap={1} flexWrap="wrap">
          <Button
            variant="outlined"
            startIcon={<ReplayIcon />}
            onClick={resetAll}
          >
            Import Another File
          </Button>
          <Button
            variant="text"
            onClick={() =>
              router.push('/workspace/content/submitted')
            }
          >
            View Submitted Content
          </Button>
        </Box>
      </Box>
    );
  };

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────

  return (
    <>
      {showHeader && <WorkspaceHeader />}
      <Layout selectedKey="bulk-import" onSelect={() => {console.log('hello')}}
      >
        <WorkspaceText />

        <Box
          sx={{
            background: 'linear-gradient(to bottom, white, #F8EFDA)',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: theme.shadows[3],
            minHeight: '60vh',
          }}
          m={3}
        >
          {/* Header */}
          <Box
            display="flex"
            alignItems="flex-start"
            justifyContent="space-between"
            mb={2}
            flexWrap="wrap"
            gap={1}
          >
            <Box>
              <Typography variant="h4" fontSize="18px" fontWeight={700}>
                Bulk Import Question Sets
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                Upload a CSV file to create multiple question sets with sections and
                MCQ questions. Each question set will be sent for review automatically.
              </Typography>
            </Box>
            {activeStep > 0 && activeStep < 3 && !isImporting && (
              <Button
                size="small"
                variant="text"
                startIcon={<ReplayIcon />}
                onClick={resetAll}
              >
                Start Over
              </Button>
            )}
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Stepper */}
          <Stepper activeStep={activeStep} orientation="vertical">
            <Step>
              <StepLabel>Upload CSV</StepLabel>
              <StepContent>{renderUploadStep()}</StepContent>
            </Step>

            <Step>
              <StepLabel
                error={
                  validationResult !== null && !validationResult.valid
                }
                optional={
                  validationResult && !validationResult.valid ? (
                    <Typography variant="caption" color="error">
                      Validation errors found
                    </Typography>
                  ) : null
                }
              >
                Validate &amp; Preview
              </StepLabel>
              <StepContent>{renderValidationStep()}</StepContent>
            </Step>

            <Step>
              <StepLabel>Import Progress</StepLabel>
              <StepContent>{renderImportStep()}</StepContent>
            </Step>

            <Step>
              <StepLabel>Summary</StepLabel>
              <StepContent>{renderSummaryStep()}</StepContent>
            </Step>
          </Stepper>
        </Box>
      </Layout>
    </>
  );
};

export default BulkImportPage;
