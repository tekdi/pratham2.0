import React, { useState } from 'react';
import { Box, Modal, Typography, Button, IconButton, Radio, RadioGroup, FormControlLabel, FormControl, Select, MenuItem, InputLabel, TextField, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { modalStyles } from '../../styles/modalStyles';

interface AssignBatchModalProps {
  open: boolean;
  onClose: () => void;
  selectedLearners: string[];
  onAssign: (data: { mode: string; center: string; batch: string }) => void;
}

const AssignBatchModal: React.FC<AssignBatchModalProps> = ({
  open,
  onClose,
  selectedLearners,
  onAssign,
}) => {
  const theme = useTheme<any>();
  const [mode, setMode] = useState('in-person');
  const [center, setCenter] = useState('');
  const [batch, setBatch] = useState('');

  const handleAssign = () => {
    if (center && batch) {
      onAssign({ mode, center, batch });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="assign-batch-modal-title"
      aria-describedby="assign-batch-modal-description"
    >
      <Box
        sx={{
          ...modalStyles(theme, '500px'),
          maxWidth: '500px',
          width: '90%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#fff',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            p: 2,
            borderBottom: '1px solid #e0e0e0',
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, fontSize: '20px', color: '#1E1B16', mb: 0.5 }}
            >
              {selectedLearners.length} Learners Selected
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: '14px', color: '#7C766F' }}
            >
              Assign Batch
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ p: 0.5 }}>
            <CloseIcon sx={{ fontSize: 24, color: '#4A4640' }} />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
          {/* Learners Section */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="caption"
              sx={{ fontSize: '12px', color: '#7C766F', display: 'block', mb: 1 }}
            >
              Learners
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: '16px', fontWeight: 600, color: '#1E1B16' }}
            >
              {selectedLearners.join(', ')}
            </Typography>
          </Box>

          {/* Mode of Learning */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="caption"
              sx={{ fontSize: '12px', color: '#7C766F', display: 'block', mb: 1.5 }}
            >
              Mode of Learning
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                row
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                sx={{ gap: 3 }}
              >
                <FormControlLabel
                  value="in-person"
                  control={<Radio sx={{ color: '#1E1B16', '&.Mui-checked': { color: '#1E1B16' } }} />}
                  label="In person"
                  sx={{ '& .MuiFormControlLabel-label': { fontSize: '14px', color: '#1E1B16' } }}
                />
                <FormControlLabel
                  value="remote"
                  control={<Radio sx={{ color: '#1E1B16', '&.Mui-checked': { color: '#1E1B16' } }} />}
                  label="Remote"
                  sx={{ '& .MuiFormControlLabel-label': { fontSize: '14px', color: '#1E1B16' } }}
                />
              </RadioGroup>
            </FormControl>
          </Box>

          {/* Center Dropdown */}
          <Box sx={{ mb: 3 }}>
            <InputLabel
              sx={{
                fontSize: '12px',
                color: '#7C766F',
                mb: 1,
                transform: 'none',
                position: 'static',
              }}
            >
              Center
            </InputLabel>
            <Select
              fullWidth
              value={center}
              onChange={(e) => setCenter(e.target.value)}
              displayEmpty
              sx={{
                borderRadius: '8px',
                '& .MuiSelect-select': {
                  py: 1.5,
                },
              }}
            >
              <MenuItem value="" disabled>
                Select
              </MenuItem>
              <MenuItem value="center1">Center 1</MenuItem>
              <MenuItem value="center2">Center 2</MenuItem>
            </Select>
          </Box>

          {/* Batch Dropdown */}
          <Box sx={{ mb: 2 }}>
            <InputLabel
              sx={{
                fontSize: '12px',
                color: '#7C766F',
                mb: 1,
                transform: 'none',
                position: 'static',
              }}
            >
              Batch
            </InputLabel>
            <Select
              fullWidth
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              displayEmpty
              sx={{
                borderRadius: '8px',
                '& .MuiSelect-select': {
                  py: 1.5,
                },
              }}
            >
              <MenuItem value="" disabled>
                Select
              </MenuItem>
              <MenuItem value="batch1">Batch 1</MenuItem>
              <MenuItem value="batch2">Batch 2</MenuItem>
            </Select>
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleAssign}
            disabled={!center || !batch}
            sx={{
              bgcolor: '#FDBE16',
              color: '#1E1B16',
              fontWeight: 600,
              fontSize: '16px',
              borderRadius: '8px',
              py: 1.5,
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#F5B800',
              },
              '&:disabled': {
                bgcolor: '#e0e0e0',
                color: '#9e9e9e',
              },
            }}
          >
            Assign Batch ({selectedLearners.length} learners)
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AssignBatchModal;

