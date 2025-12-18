import React, { useState, useEffect } from 'react';
import { Box, Modal, Typography, Button, IconButton, TextField, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(initialDate || today);
  const [note, setNote] = useState(initialNote || '');

  useEffect(() => {
    if (open) {
      setDate(initialDate || today);
      setNote(initialNote || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

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
  type="date"
  value={date}
  onChange={(e) => setDate(e.target.value)}
  inputProps={{
    max: today, // ⛔ prevent future dates
  }}
  InputProps={{
    disableUnderline: true,
  }}
  sx={{
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
    },
    '& input::-webkit-calendar-picker-indicator': {
      cursor: 'pointer',
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

