import React, { ReactNode } from 'react';
import { Box, Button, IconButton, Modal, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface GenericModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onSave?: () => void;
  showActions?: boolean;
  maxWidth?: string | number;
  saveButtonText?: string;
  cancelButtonText?: string;
  disableSaveButton?: boolean;
}

const GenericModal: React.FC<GenericModalProps> = ({
  open,
  onClose,
  title,
  children,
  onSave,
  showActions = true,
  maxWidth = '400px',
  saveButtonText = 'Save',
  cancelButtonText = 'Cancel',
  disableSaveButton = false,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          borderRadius: '8px',
          boxShadow: 24,
          maxWidth: maxWidth,
          width: '100%',
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
            borderBottom: '1px solid',
            borderColor: 'divider',
            p: 2,
          }}
        >
          <Typography variant="h6" component="h2" id="modal-title">
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

        {/* Content */}
        <Box sx={{ p: 3 }}>{children}</Box>

        {/* Actions */}
        {showActions && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 1,
              borderTop: '1px solid',
              borderColor: 'divider',
              p: 2,
            }}
          >
            <Button
              variant="outlined"
              sx={{
                width: '100%',
              }}
              onClick={onClose}
            >
              {cancelButtonText}
            </Button>
            {onSave && (
              <Button
                variant="contained"
                onClick={onSave}
                disabled={disableSaveButton}
                sx={{
                  width: '100%',
                }}
              >
                {saveButtonText}
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default GenericModal;
