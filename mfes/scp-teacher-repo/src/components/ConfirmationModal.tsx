import React from 'react';
import {
  Box,
  Button,
  Divider,
  IconButton,
  Modal,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Yes, Approve',
  cancelText = 'No, Cancel',
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="confirmation-modal-title"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          borderRadius: '8px',
          boxShadow: 24,
          maxWidth: '400px',
          width: '90%',
          p: 0,
          outline: 'none',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            pb: 2,
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            id="confirmation-modal-title"
            sx={{
              fontSize: '16px',
              fontWeight: 500,
            }}
          >
            {title}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            size="small"
            sx={{
              color: 'text.secondary',
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        {/* Content */}
        <Box>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              mb: 3,
              p: 2,
              pt: 1,
            }}
          >
            {message}
          </Typography>

          {/* Actions */}
          <Divider />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 1,
              p: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                textTransform: 'none',
                borderColor: 'grey.300',
                color: 'text.primary',
              }}
            >
              {cancelText}
            </Button>
            <Button
              variant="contained"
              onClick={onConfirm}
              sx={{
                textTransform: 'none',
                bgcolor: '#FFB800',
                '&:hover': {
                  bgcolor: '#E6A600',
                },
              }}
            >
              {confirmText}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;
