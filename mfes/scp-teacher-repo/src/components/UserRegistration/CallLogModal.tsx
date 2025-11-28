import React, { useState } from 'react';
import { Box, Modal, Typography, Button, IconButton, TextField, InputAdornment, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { modalStyles } from '../../styles/modalStyles';

interface CallLogModalProps {
  open: boolean;
  onClose: () => void;
  learnerName: string;
  onSave: (data: { date: string; note: string }) => void;
  initialDate?: string;
  initialNote?: string;
}

const CallLogModal: React.FC<CallLogModalProps> = ({
  open,
  onClose,
  learnerName,
  onSave,
  initialDate,
  initialNote,
}) => {
  const theme = useTheme<any>();
  const [date, setDate] = useState(initialDate || '');
  const [note, setNote] = useState(initialNote || '');

  const handleSave = () => {
    if (date && note) {
      onSave({ date, note });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="call-log-modal-title"
      aria-describedby="call-log-modal-description"
    >
      <Box
        sx={{
          ...modalStyles(theme, '500px'),
          maxWidth: '500px',
          width: '90%',
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
              sx={{ fontWeight: 600, fontSize: '18px', color: '#1E1B16', mb: 0.5 }}
            >
              {learnerName}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: '14px', color: '#7C766F' }}
            >
              Call log
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ p: 0.5 }}>
            <CloseIcon sx={{ fontSize: 24, color: '#4A4640' }} />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ p: 2 }}>
          {/* Date of Call */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="caption"
              sx={{ fontSize: '12px', color: '#7C766F', display: 'block', mb: 1 }}
            >
              Date of Call
            </Typography>
            <TextField
              fullWidth
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="18 Mar, 2025"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <CalendarTodayIcon sx={{ color: '#0D599E', cursor: 'pointer' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />
          </Box>

          {/* Note */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              sx={{ fontSize: '12px', color: '#7C766F', display: 'block', mb: 1 }}
            >
              Note
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter note..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleSave}
            disabled={!date || !note}
            sx={{
              bgcolor: '#FDBE16',
              color: '#1E1B16',
              fontWeight: 600,
              fontSize: '16px',
              borderRadius: '100px',
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
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CallLogModal;

