import React from 'react';
import { Box, Button, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface BottomActionBarProps {
  selectedCount: number;
  onCancel: () => void;
  onAssignBatch: () => void;
  onMoreOptions?: () => void;
  showMoreOptions?: boolean;
}

const BottomActionBar: React.FC<BottomActionBarProps> = ({ 
  selectedCount, 
  onCancel, 
  onAssignBatch,
  onMoreOptions,
  showMoreOptions = true
}) => {
  if (selectedCount === 0) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: '#4A4640',
        zIndex: 100,
        boxShadow: '0px -2px 8px rgba(0,0,0,0.2)',
        width: '100%',
        px: { xs: 2, sm: 3 },
        py: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxSizing: 'border-box'
      }}
    >
        {/* Learner Count - Left Side */}
        <Box
  sx={{
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    marginRight: '16px',
    flexShrink: 0   // 🔥 prevents disappearing
  }}
>
  {selectedCount} {selectedCount === 1 ? 'learner' : 'learners'}
</Box>

        {/* Action Buttons - Right Side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        
        <Button
          variant="outlined"
          onClick={onCancel}
          sx={{
            borderRadius: '100px',
            borderColor: '#7C766F',
            color: '#fff',
            textTransform: 'none',
            fontSize: '14px',
            px: 2,
            minWidth: 'auto',
            whiteSpace: 'nowrap',
            '&:hover': {
              borderColor: '#9E9E9E',
              bgcolor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onAssignBatch}
          sx={{
            borderRadius: '100px',
            bgcolor: '#FDBE16',
            color: '#1E1B16',
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 600,
            px: 2,
            minWidth: 'auto',
            whiteSpace: 'nowrap',
            '&:hover': {
              bgcolor: '#F5B800',
            },
          }}
        >
          Assign Batch
        </Button>
        {showMoreOptions && (
          <IconButton
            onClick={onMoreOptions}
            sx={{
              color: '#fff',
              p: 1,
              flexShrink: 0,
            }}
          >
            <MoreVertIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default BottomActionBar;
