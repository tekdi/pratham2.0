import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import type { BatchCreationModalProps } from '../../interfaces/BaseInterface';

// Status icon mapping
const STATUS_ICONS = {
  success: <CheckCircleIcon color="success" fontSize="small" />,
  failed: <CancelIcon color="error" fontSize="small" />,
  pending: <CircularProgress size={18} />,
} as const;

// Helper function to determine status and render appropriate icon
const getStatusIcon = (
  itemStatus: string | undefined,
  itemIndex: number,
  currentIndex: number
) => {
  // Show pending status only for the current item being processed
  if (itemStatus === 'pending' && itemIndex === currentIndex) {
    return STATUS_ICONS.pending;
  }

  // Return the appropriate icon for other statuses
  if (itemStatus && itemStatus in STATUS_ICONS) {
    return STATUS_ICONS[itemStatus as keyof typeof STATUS_ICONS];
  }

  return null;
};

const BatchCreationModal: React.FC<BatchCreationModalProps> = ({
  open,
  title,
  items,
  statuses,
  currentIndex,
  getItemLabel,
}) => {
  return (
    <Dialog open={open} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <List>
          {items.map((item, idx) => (
            <ListItem
              key={item.code + idx}
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Typography variant="body2" sx={{ flex: 1 }}>
                {getItemLabel ? getItemLabel(item) : `${item.name}`}
              </Typography>
              {getStatusIcon(statuses[idx]?.status, idx, currentIndex)}
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default BatchCreationModal;
