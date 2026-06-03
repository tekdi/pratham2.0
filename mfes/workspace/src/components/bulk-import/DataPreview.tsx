// ============================================================
// BULK IMPORT — STEP 3: DATA PREVIEW
// ============================================================

import React, { useState } from 'react';
import {
  Box, Typography, Button, Tabs, Tab, Table, TableHead, TableBody,
  TableRow, TableCell, TableContainer, Chip, Paper,
  Tooltip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { ParsedImportData } from '../../types/bulkImport.types';

interface Props {
  parsedData: ParsedImportData;
  fileName: string;
  onConfirm: () => void;
  onBack: () => void;
}

type TabKey = 'contents' | 'questionSets' | 'questions' | 'courses' | 'mappings';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'contents', label: 'Content' },
  { key: 'questionSets', label: 'Question Sets' },
  { key: 'questions', label: 'Questions' },
  { key: 'courses', label: 'Courses' },
  { key: 'mappings', label: 'Course Mappings' },
];

const truncate = (str: string | undefined, max = 40) =>
  str && str.length > max ? `${str.slice(0, max)}…` : (str || '—');

const DataPreview: React.FC<Props> = ({ parsedData, fileName, onConfirm, onBack }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('contents');

  const counts = {
    contents: parsedData.contents.length,
    questionSets: parsedData.questionSets.length,
    questions: parsedData.questions.length,
    courses: parsedData.courses.length,
    mappings: parsedData.courseChildMappings.length,
  };

  const renderContentTable = () => (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ background: '#F5F5F5' }}>
            {['Temp ID', 'Name', 'Primary Category', 'Framework', 'File Type', 'Drive URL'].map((h) => (
              <TableCell key={h} sx={{ fontWeight: 600, fontSize: 12 }}>{h}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {parsedData.contents.map((row, i) => (
            <TableRow key={i} hover>
              <TableCell><Chip label={row.tempId} size="small" variant="outlined" /></TableCell>
              <TableCell sx={{ fontSize: 12 }}>{truncate(row.name)}</TableCell>
              <TableCell sx={{ fontSize: 12 }}>{row.primaryCategory || '—'}</TableCell>
              <TableCell sx={{ fontSize: 12 }}>{row.framework}</TableCell>
              <TableCell>
                <Chip
                  label={(row.fileType || '?').toUpperCase()}
                  size="small"
                  color={row.fileType === 'pdf' ? 'error' : row.fileType === 'mp4' ? 'info' : 'default'}
                  sx={{ fontSize: 10 }}
                />
              </TableCell>
              <TableCell sx={{ fontSize: 11, color: 'primary.main' }}>
                <Tooltip title={row.driveUrl} placement="top">
                  <span>{truncate(row.driveUrl, 35)}</span>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderQSTable = () => (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ background: '#F5F5F5' }}>
            {['Temp ID', 'Name', 'Primary Category', 'Framework', 'Subject', 'Max Attempts'].map((h) => (
              <TableCell key={h} sx={{ fontWeight: 600, fontSize: 12 }}>{h}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {parsedData.questionSets.map((row, i) => (
            <TableRow key={i} hover>
              <TableCell><Chip label={row.tempId} size="small" variant="outlined" /></TableCell>
              <TableCell sx={{ fontSize: 12 }}>{truncate(row.name)}</TableCell>
              <TableCell sx={{ fontSize: 12 }}>{row.primaryCategory || '—'}</TableCell>
              <TableCell sx={{ fontSize: 12 }}>{row.framework}</TableCell>
              <TableCell sx={{ fontSize: 12 }}>{row.subject || '—'}</TableCell>
              <TableCell sx={{ fontSize: 12 }}>{row.maxAttempts ?? '—'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderQuestionsTable = () => (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ background: '#F5F5F5' }}>
            {['QS Temp ID', 'Section', 'Type', 'Question Text', 'Options', 'Correct Answer'].map((h) => (
              <TableCell key={h} sx={{ fontWeight: 600, fontSize: 12 }}>{h}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {parsedData.questions.map((row, i) => (
            <TableRow key={i} hover>
              <TableCell><Chip label={row.questionSetTempId} size="small" variant="outlined" /></TableCell>
              <TableCell sx={{ fontSize: 12 }}>{row.sectionName || 'Section 1'}</TableCell>
              <TableCell>
                <Chip label={row.questionType} size="small" color="primary" sx={{ fontSize: 10 }} />
              </TableCell>
              <TableCell sx={{ fontSize: 12 }}>{truncate(row.questionText, 50)}</TableCell>
              <TableCell sx={{ fontSize: 11 }}>{truncate(row.options, 30)}</TableCell>
              <TableCell sx={{ fontSize: 12 }}>{row.correctAnswer || '—'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderCoursesTable = () => (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ background: '#F5F5F5' }}>
            {['Temp ID', 'Name', 'Framework', 'Subject', 'Grade Level', 'Author'].map((h) => (
              <TableCell key={h} sx={{ fontWeight: 600, fontSize: 12 }}>{h}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {parsedData.courses.map((row, i) => (
            <TableRow key={i} hover>
              <TableCell><Chip label={row.tempId} size="small" variant="outlined" /></TableCell>
              <TableCell sx={{ fontSize: 12 }}>{truncate(row.name)}</TableCell>
              <TableCell sx={{ fontSize: 12 }}>{row.framework}</TableCell>
              <TableCell sx={{ fontSize: 12 }}>{row.subject || '—'}</TableCell>
              <TableCell sx={{ fontSize: 12 }}>{row.gradeLevel || '—'}</TableCell>
              <TableCell sx={{ fontSize: 12 }}>{row.author || '—'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderMappingsTable = () => (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ background: '#F5F5F5' }}>
            {['Course Temp ID', 'Unit Name', 'Child Ref', 'Child Type', 'Sequence'].map((h) => (
              <TableCell key={h} sx={{ fontWeight: 600, fontSize: 12 }}>{h}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {parsedData.courseChildMappings.map((row, i) => (
            <TableRow key={i} hover>
              <TableCell><Chip label={row.courseTempId} size="small" variant="outlined" /></TableCell>
              <TableCell sx={{ fontSize: 12 }}>{row.unitName}</TableCell>
              <TableCell><Chip label={row.childRef} size="small" color="secondary" sx={{ fontSize: 10 }} /></TableCell>
              <TableCell>
                <Chip
                  label={row.childType}
                  size="small"
                  color={row.childType === 'content' ? 'info' : 'success'}
                  sx={{ fontSize: 10 }}
                />
              </TableCell>
              <TableCell sx={{ fontSize: 12 }}>{row.sequence}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderTable = () => {
    switch (activeTab) {
      case 'contents': return renderContentTable();
      case 'questionSets': return renderQSTable();
      case 'questions': return renderQuestionsTable();
      case 'courses': return renderCoursesTable();
      case 'mappings': return renderMappingsTable();
    }
  };

  const isEmpty = counts[activeTab] === 0;

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Step 3: Preview Parsed Data
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Review the data extracted from <strong>{fileName}</strong>. Verify counts and check for obvious issues before proceeding.
      </Typography>

      {/* Summary chips */}
      <Box display="flex" gap={1} flexWrap="wrap" sx={{ mb: 2 }}>
        {TABS.map((tab) => (
          <Chip
            key={tab.key}
            label={`${tab.label}: ${counts[tab.key]}`}
            size="small"
            variant={counts[tab.key] > 0 ? 'filled' : 'outlined'}
            color={counts[tab.key] > 0 ? 'primary' : 'default'}
          />
        ))}
      </Box>

      {/* Tab navigation */}
      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 1, borderBottom: '1px solid #E0E0E0' }}
      >
        {TABS.map((tab) => (
          <Tab
            key={tab.key}
            value={tab.key}
            label={`${tab.label} (${counts[tab.key]})`}
            sx={{ textTransform: 'none', fontSize: 13 }}
          />
        ))}
      </Tabs>

      {/* Table */}
      <Paper
        variant="outlined"
        sx={{ maxHeight: 340, overflow: 'auto', borderRadius: 1 }}
      >
        {isEmpty ? (
          <Box p={4} textAlign="center">
            <Typography color="text.secondary" variant="body2">
              No data in this sheet
            </Typography>
          </Box>
        ) : (
          renderTable()
        )}
      </Paper>

      {/* Navigation */}
      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ textTransform: 'none' }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={onConfirm}
          sx={{ textTransform: 'none', fontWeight: 600, px: 4 }}
        >
          Validate Data
        </Button>
      </Box>
    </Box>
  );
};

export default DataPreview;
