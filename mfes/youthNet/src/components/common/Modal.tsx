import React from 'react';
import { Box, Dialog, IconButton, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import { ModalProps } from '../../utils/Interface';
import { getThinScrollbarSx } from '../../utils/scrollbarSx';

// Generic dialog shell (header with title/subtitle/close + scrollable body) so feature modals
// only need to supply their own body content instead of re-implementing the Dialog chrome.
const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  subtitle,
  headerExtra,
  maxWidth = 'sm',
  children,
  sx,
}) => {
  const theme = useTheme<any>();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={maxWidth}
      PaperProps={{ sx: [{ borderRadius: 3 }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] }}
    >
      <Box sx={{ p: 2.5, borderBottom: `1px solid ${theme.palette.warning['800']}` }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h2" sx={{ fontSize: '14px', fontWeight: 600 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '11px', mb: 0, fontWeight: 500 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <IconButton size="small" onClick={onClose} sx={{ flexShrink: 0 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
        {headerExtra && <Box sx={{ mt: 1.5 }}>{headerExtra}</Box>}
      </Box>
      <Box sx={{ p: 2.5, maxHeight: '60vh', overflowY: 'auto', ...getThinScrollbarSx(theme) }}>{children}</Box>
    </Dialog>
  );
};

export default Modal;
