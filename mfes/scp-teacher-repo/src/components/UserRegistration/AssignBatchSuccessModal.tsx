import React from 'react';
import { Box, Modal, Typography, Button, IconButton, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { modalStyles } from '../../styles/modalStyles';

interface AssignBatchSuccessModalProps {
  open: boolean;
  onClose: () => void;
  learnerName?: string;
  batchName: string;
}

const AssignBatchSuccessModal: React.FC<AssignBatchSuccessModalProps> = ({
  open,
  onClose,
  learnerName,
  batchName,
}) => {
  const theme = useTheme<any>();
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="success-modal-title"
      aria-describedby="success-modal-description"
    >
      <Box
        sx={{
          ...modalStyles(theme, '400px'),
          maxWidth: '400px',
          width: '90%',
          bgcolor: '#fff',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderBottom: '1px solid #e0e0e0',
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, fontSize: '18px', color: '#1E1B16' }}
            >
              {learnerName || 'Learner'}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: '14px', color: '#7C766F', mt: 0.5 }}
            >
              Assign Batch
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ p: 0.5 }}>
            <CloseIcon sx={{ fontSize: 24, color: '#4A4640' }} />
          </IconButton>
        </Box>

        {/* Content */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 4,
            textAlign: 'center',
          }}
        >
          <CheckCircleIcon
            sx={{
              fontSize: 80,
              color: '#2E7D32',
              mb: 2,
            }}
          />
          <Typography
            variant="body1"
            sx={{ fontSize: '16px', color: '#4A4640', mb: 1 }}
          >
            Learner(s) have been assigned
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontSize: '16px', color: '#4A4640', mb: 1 }}
          >
            and moved to the batch
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontSize: '16px', color: '#1E1B16', fontWeight: 600 }}
          >
            "{batchName}"
          </Typography>
        </Box>

        {/* Footer */}
        <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
          <Button
            fullWidth
            variant="contained"
            onClick={onClose}
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
            }}
          >
            Okay
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AssignBatchSuccessModal;

