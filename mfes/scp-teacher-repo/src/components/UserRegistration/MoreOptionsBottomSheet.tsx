import React from 'react';
import { Box, Drawer, Typography, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { useTranslation } from 'next-i18next';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface MoreOptionsBottomSheetProps {
  open: boolean;
  onClose: () => void;
  selectedCount: number;
  onNotInterested?: () => void;
  onMayJoinNextYear?: () => void;
}

const MoreOptionsBottomSheet: React.FC<MoreOptionsBottomSheetProps> = ({
  open,
  onClose,
  selectedCount,
  onNotInterested,
  onMayJoinNextYear,
}) => {
  const { t } = useTranslation();
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          maxHeight: '80vh',
        },
      }}
    >
      <Box sx={{ width: '100%', bgcolor: '#fff' }}>
        {/* Draggable Handle */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pt: 2,
            pb: 1,
          }}
        >
          <Box
            sx={{
              width: '40px',
              height: '4px',
              bgcolor: '#D0C5B4',
              borderRadius: '2px',
            }}
          />
        </Box>

        {/* Header - Learner Count */}
        <Box sx={{ px: 2, pb: 2 }}>
          <Typography
            sx={{
              fontSize: '14px',
              color: '#7C766F',
              fontWeight: 400,
            }}
          >
            {selectedCount} {selectedCount === 1 ? t('USER_REGISTRATION.LEARNER') : t('USER_REGISTRATION.LEARNERS')}
          </Typography>
        </Box>

        {/* Options List */}
        <Box>
          {/* Not interested to join */}
          <ListItemButton
            onClick={() => {
              onNotInterested?.();
              // onClose(); // Let the handler close it
            }}
            sx={{
              px: 2,
              py: 2,
              '&:hover': {
                bgcolor: '#f5f5f5',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: '40px' }}>
              <Box
                sx={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PersonOutlineIcon sx={{ fontSize: 24, color: '#4A4640' }} />
                <CloseIcon
                  sx={{
                    position: 'absolute',
                    fontSize: 14,
                    color: '#4A4640',
                    top: '-4px',
                    right: '-6px',
                    bgcolor: '#fff',
                    borderRadius: '50%',
                  }}
                />
              </Box>
            </ListItemIcon>
            <ListItemText
              primary={t('USER_REGISTRATION.NOT_INTERESTED_TO_JOIN')}
              primaryTypographyProps={{
                fontSize: '16px',
                fontWeight: 400,
                color: '#1E1B16',
              }}
            />
          </ListItemButton>

          <Divider sx={{ bgcolor: '#D0C5B4', mx: 2 }} />

          {/* Interested, may join next year */}
          <ListItemButton
            onClick={() => {
              onMayJoinNextYear?.();
              // onClose(); // Let the handler close it
            }}
            sx={{
              px: 2,
              py: 2,
              '&:hover': {
                bgcolor: '#f5f5f5',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: '40px' }}>
              <Box
                sx={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PersonOutlineIcon sx={{ fontSize: 24, color: '#4A4640' }} />
                <ErrorOutlineIcon
                  sx={{
                    position: 'absolute',
                    fontSize: 14,
                    color: '#4A4640',
                    top: '-4px',
                    right: '-6px',
                    bgcolor: '#fff',
                    borderRadius: '50%',
                  }}
                />
              </Box>
            </ListItemIcon>
            <ListItemText
              primary={t('USER_REGISTRATION.INTERESTED_MAY_JOIN_NEXT_YEAR')}
              primaryTypographyProps={{
                fontSize: '16px',
                fontWeight: 400,
                color: '#1E1B16',
              }}
            />
          </ListItemButton>

          <Divider sx={{ bgcolor: '#D0C5B4', mx: 2 }} />
        </Box>
      </Box>
    </Drawer>
  );
};

export default MoreOptionsBottomSheet;

