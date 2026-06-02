// ============================================================
// BULK IMPORT — STEP 2: FILE UPLOAD
// ============================================================

import React, { useCallback, useState } from 'react';
import {
  Box, Typography, Button, LinearProgress, Alert,
} from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface Props {
  onFileAccepted: (file: File) => void;
  isParsing: boolean;
  onBack: () => void;
}

const ACCEPT_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-excel', // .xls
];

const MAX_FILE_SIZE_MB = 50;

const FileUpload: React.FC<Props> = ({ onFileAccepted, isParsing, onBack }) => {
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const validateAndAccept = useCallback(
    (file: File) => {
      setFileError(null);

      const isValidType =
        file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
      if (!isValidType) {
        setFileError('Only .xlsx or .xls files are accepted');
        return;
      }

      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > MAX_FILE_SIZE_MB) {
        setFileError(`File size must be under ${MAX_FILE_SIZE_MB} MB`);
        return;
      }

      setSelectedFile(file);
      onFileAccepted(file);
    },
    [onFileAccepted]
  );

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };
  const handleDragLeave = () => setDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndAccept(file);
  };

  // Click-to-upload handler
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndAccept(file);
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Step 2: Upload Filled Template
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Upload the Excel file you downloaded and filled. Supported formats: .xlsx, .xls
      </Typography>

      {/* Drop zone */}
      <Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          border: dragging
            ? '2px dashed var(--mui-palette-primary-main)'
            : '2px dashed #BDBDBD',
          borderRadius: 2,
          p: { xs: 3, md: 6 },
          textAlign: 'center',
          background: dragging ? '#FFF8F0' : '#FAFAFA',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          mb: 2,
          position: 'relative',
        }}
        onClick={() => document.getElementById('bulk-import-file-input')?.click()}
      >
        <input
          id="bulk-import-file-input"
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />

        {selectedFile ? (
          <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
            <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main' }} />
            <Typography fontWeight={600}>{selectedFile.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </Typography>
            {!isParsing && (
              <Typography variant="caption" color="primary">
                Click to choose a different file
              </Typography>
            )}
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" alignItems="center" gap={1.5}>
            <CloudUploadOutlinedIcon sx={{ fontSize: 56, color: '#BDBDBD' }} />
            <Typography variant="subtitle1" fontWeight={600} color="text.primary">
              Drag & drop your Excel file here
            </Typography>
            <Typography variant="body2" color="text.secondary">
              or click to browse files
            </Typography>
            <Button
              variant="outlined"
              startIcon={<InsertDriveFileOutlinedIcon />}
              sx={{ textTransform: 'none', mt: 1 }}
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById('bulk-import-file-input')?.click();
              }}
            >
              Browse File
            </Button>
            <Typography variant="caption" color="text.secondary">
              Supported: .xlsx, .xls · Max size: {MAX_FILE_SIZE_MB} MB
            </Typography>
          </Box>
        )}
      </Box>

      {/* Error */}
      {fileError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {fileError}
        </Alert>
      )}

      {/* Parsing progress */}
      {isParsing && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Parsing Excel file...
          </Typography>
          <LinearProgress />
        </Box>
      )}

      {/* Navigation */}
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ textTransform: 'none' }}
          disabled={isParsing}
        >
          Back
        </Button>
      </Box>
    </Box>
  );
};

export default FileUpload;
