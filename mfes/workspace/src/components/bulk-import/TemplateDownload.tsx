// ============================================================
// BULK IMPORT — STEP 1: TEMPLATE DOWNLOAD
// ============================================================

import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import {
  Box, Typography, Button, Card, CardContent,
  List, ListItem, ListItemIcon, ListItemText, Divider, Chip, Alert,
  Stack,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface Props {
  onProceed: () => void;
}

// ─── Detect framework from localStorage ──────────────────────

const getCollectionFramework = (): 'pos-framework' | 'scp-framework' => {
  if (typeof window === 'undefined') return 'pos-framework';
  return localStorage.getItem('collectionFramework') === 'scp-framework'
    ? 'scp-framework'
    : 'pos-framework';
};

// ─── Sheet definitions ────────────────────────────────────────

const SHEETS = [
  { icon: <ArticleOutlinedIcon color="primary" />,      name: 'Content',               desc: 'PDF, ZIP, MP4, H5P with Google Drive URLs' },
  { icon: <QuizOutlinedIcon color="primary" />,          name: 'QuestionSets',          desc: 'Question set containers with metadata' },
  { icon: <TableChartOutlinedIcon color="primary" />,    name: 'Questions',             desc: 'MCQ, Arrange, Match, Subjective questions' },
  { icon: <SchoolOutlinedIcon color="primary" />,        name: 'Courses',               desc: 'Course containers' },
  { icon: <TableChartOutlinedIcon color="primary" />,    name: 'CourseChildrenMapping', desc: 'Map content/QS into course units' },
  { icon: <TableChartOutlinedIcon color="primary" />,    name: 'ExistingContentMapping',desc: 'Reference existing platform identifiers' },
  { icon: <TableChartOutlinedIcon color="primary" />,    name: 'LookupData',            desc: 'All dropdown values — do not edit' },
];

const INSTRUCTIONS = [
  'Download the sample template (pre-configured for your framework)',
  'Fill only the sheets you need — Content, QuestionSets, Courses',
  'Use TEMP_CONTENT_1, TEMP_QS_1, TEMP_COURSE_1 format for Temp IDs',
  'Add Google Drive public share links for all content files',
  'Use dropdowns in each column — values are pre-loaded',
  'Use CourseChildrenMapping to link content/QS to courses',
  'Upload the completed file in the next step',
];

// ─── Framework metadata labels ────────────────────────────────

const FRAMEWORK_META: Record<
  string,
  { label: string; colour: string; fields: string[]; categoryFields: string[] }
> = {
  'pos-framework': {
    label: 'POS Framework (Open School)',
    colour: '#E65100',
    fields: ['Subject', 'Domain', 'Sub Domain', 'Medium', 'Grade Level', 'Target Age Group', 'Primary User', 'Language', 'Program'],
    categoryFields: ['Learning Resource', 'Explanation Content', 'Teacher Resource', 'Story', 'Activity', 'Interactive', 'Practice Question Set'],
  },
  'scp-framework': {
    label: 'SCP Framework (Second Chance Program)',
    colour: '#1565C0',
    fields: ['Subject', 'Board', 'Medium', 'Grade Level', 'Course Type', 'Program', 'Language'],
    categoryFields: ['Learning Resource', 'Explanation Content', 'Teacher Resource', 'Study Material', 'Practice Question Set'],
  },
};

// ─── Component ────────────────────────────────────────────────

const TemplateDownload: React.FC<Props> = ({ onProceed }) => {
  const router = useRouter();

  // Read on mount (client-side only)
  const framework = useMemo(() => getCollectionFramework(), []);
  const meta = FRAMEWORK_META[framework] ?? FRAMEWORK_META['pos-framework'];

  // Template API lives in the host admin app (same domain, no basePath prefix).
  // The `t` timestamp param busts the browser's download cache on every visit.
  const fwLabel = framework === 'scp-framework' ? 'SCP' : 'POS';
  const ts = Date.now();
  const templateUrl        = `/api/bulk-import/template?framework=${framework}&type=all&t=${ts}`;
  const contentUrl         = `/api/bulk-import/template?framework=${framework}&type=content&t=${ts}`;
  const questionSetUrl     = `/api/bulk-import/template?framework=${framework}&type=questionset&t=${ts}`;
  const templateFileName        = `Bulk_Import_Template_${fwLabel}.xlsm`;
  const contentFileName         = `Bulk_Import_Template_${fwLabel}_Content.xlsm`;
  const questionSetFileName     = `Bulk_Import_Template_${fwLabel}_QuestionSet.xlsm`;

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Step 1: Download the Import Template
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        The template is generated specifically for your logged-in framework.
        Fill only the sheets you need and upload in the next step.
      </Typography>

      {/* Framework banner */}
      <Alert
        icon={<InfoOutlinedIcon />}
        severity="info"
        sx={{
          mb: 2.5,
          border: `1px solid ${meta.colour}30`,
          '& .MuiAlert-icon': { color: meta.colour },
        }}
      >
        <Box>
          <Typography fontWeight={600} variant="body2" sx={{ color: meta.colour }}>
            {meta.label}
          </Typography>
          <Typography variant="caption" color="text.secondary" component="div" sx={{ mt: 0.5 }}>
            Metadata fields in the template:&nbsp;
            {meta.fields.map((f) => (
              <Chip key={f} label={f} size="small" sx={{ mr: 0.3, mb: 0.3, fontSize: 10, height: 18 }} />
            ))}
          </Typography>
        </Box>
      </Alert>

      {/* Template Download Cards */}
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
        Download template — choose what you need
      </Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ mb: 3 }}>

        {/* Content only */}
        <Card
          variant="outlined"
          sx={{ flex: 1, borderRadius: 2, borderColor: '#E0E0E0', background: '#FAFAFA' }}
        >
          <CardContent sx={{ pb: '12px !important' }}>
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <ArticleOutlinedIcon color="primary" fontSize="small" />
              <Typography fontWeight={600} variant="body2">Content only</Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" display="block" mb={1}>
              PDF, ZIP, MP4, H5P, YouTube · 1 sheet
            </Typography>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              startIcon={<DownloadIcon />}
              href={contentUrl}
              download={contentFileName}
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1.5 }}
            >
              Download
            </Button>
          </CardContent>
        </Card>

        {/* QuestionSet + Questions */}
        <Card
          variant="outlined"
          sx={{ flex: 1, borderRadius: 2, borderColor: '#E0E0E0', background: '#FAFAFA' }}
        >
          <CardContent sx={{ pb: '12px !important' }}>
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <QuizOutlinedIcon color="primary" fontSize="small" />
              <Typography fontWeight={600} variant="body2">QuestionSet + Questions</Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" display="block" mb={1}>
              MCQ, Arrange, Match, Subjective · 2 sheets
            </Typography>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              startIcon={<DownloadIcon />}
              href={questionSetUrl}
              download={questionSetFileName}
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1.5 }}
            >
              Download
            </Button>
          </CardContent>
        </Card>

        {/* Full template */}
        <Card
          variant="outlined"
          sx={{
            flex: 1, borderRadius: 2,
            borderColor: 'primary.main', borderWidth: 1.5,
            background: 'linear-gradient(135deg, #FFF8F0 0%, #FFF3E0 100%)',
          }}
        >
          <CardContent sx={{ pb: '12px !important' }}>
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <TableChartOutlinedIcon color="primary" fontSize="small" />
              <Typography fontWeight={600} variant="body2">Full template</Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" display="block" mb={1}>
              Content + QuestionSets + Courses · 8 sheets
            </Typography>
            <Button
              fullWidth
              variant="contained"
              size="small"
              startIcon={<DownloadIcon />}
              href={templateUrl}
              download={templateFileName}
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1.5 }}
            >
              Download
            </Button>
          </CardContent>
        </Card>
      </Stack>

      {/* Sheets overview */}
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
        What each sheet contains
      </Typography>
      <Box
        display="grid"
        gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }}
        gap={1.2}
        sx={{ mb: 3 }}
      >
        {SHEETS.map((sheet) => (
          <Box
            key={sheet.name}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.2,
              p: 1.2,
              border: '1px solid #E0E0E0',
              borderRadius: 1.5,
              background: '#fff',
            }}
          >
            {sheet.icon}
            <Box>
              <Typography variant="body2" fontWeight={600} fontSize={12}>{sheet.name}</Typography>
              <Typography variant="caption" color="text.secondary" fontSize={11}>{sheet.desc}</Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Instructions */}
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
        How to fill the template
      </Typography>
      <List dense disablePadding>
        {INSTRUCTIONS.map((instr, i) => (
          <ListItem key={i} disableGutters alignItems="flex-start" sx={{ py: 0.4 }}>
            <ListItemIcon sx={{ minWidth: 26, mt: '7px' }}>
              <CheckCircleOutlineIcon sx={{ fontSize: 16, color: 'success.main' }} />
            </ListItemIcon>
            <ListItemText
              primary={instr}
              primaryTypographyProps={{ variant: 'body2', lineHeight: 1.5 }}
            />
          </ListItem>
        ))}
      </List>

      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={onProceed}
          sx={{ textTransform: 'none', fontWeight: 600, px: 4 }}
        >
          I have the template — proceed to Upload
        </Button>
      </Box>
    </Box>
  );
};

export default TemplateDownload;
