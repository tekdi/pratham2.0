'use client';

import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useTranslation } from '@shared-lib';

interface CongratulationsModalProps {
  open: boolean;
  onClose: () => void;
}

const CongratulationsModal: React.FC<CongratulationsModalProps> = ({
  open,
  onClose,
}) => {
  const { t } = useTranslation();
  const lmpDomain = process.env.NEXT_PUBLIC_LMP_DOMAIN 

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          maxWidth: '500px',
          width: '100%',
          padding: 0,
          position: 'relative',
        },
      }}
    >
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
          zIndex: 1,
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Green Circle with Checkmark */}
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: '#4CAF50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <CheckCircleIcon
            sx={{
              fontSize: 50,
              color: '#fff',
            }}
          />
        </Box>

        {/* Title with Emoji */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            fontSize: '24px',
            mb: 2,
            color: '#1F1B13',
          }}
        >
          {t('LEARNER_APP.USER_PROFILE_CARD.CONGRATULATIONS_TITLE', { defaultValue: 'Congratulations! 🎉' })}
        </Typography>

        {/* Message */}
        <Typography
          variant="body1"
          sx={{
            fontSize: '16px',
            color: '#635E57',
            mb: 3,
            lineHeight: 1.6,
          }}
        >
          {t('LEARNER_APP.USER_PROFILE_CARD.CONGRATULATIONS_MESSAGE', {
            defaultValue: 'Congratulations on being associated as a PTM with Pratham. Let\'s get started with your new journey.',
          })}
        </Typography>

        {/* Login Link */}
        <Typography
          variant="body2"
          sx={{
            fontSize: '14px',
            color: '#635E57',
            mb: 3,
          }}
        >
          {t('LEARNER_APP.USER_PROFILE_CARD.TO_LOG_IN', { defaultValue: 'To log in,' })}{' '}
          <Box
            component="a"
            href={lmpDomain}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            sx={{
              color: '#1976d2',
              textDecoration: 'underline',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              '&:hover': {
                color: '#1565c0',
              },
            }}
          >
            {t('LEARNER_APP.USER_PROFILE_CARD.CLICK_HERE', { defaultValue: 'click here' })}
            <OpenInNewIcon sx={{ fontSize: '16px' }} />
          </Box>
        </Typography>

        {/* Tip Box */}
        <Box
          sx={{
            backgroundColor: '#FFF3E0',
            borderRadius: '8px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1.5,
            width: '100%',
            border: '1px solid #FFE0B2',
          }}
        >
          <LightbulbIcon
            sx={{
              color: '#FF9800',
              fontSize: '20px',
              mt: 0.5,
              flexShrink: 0,
            }}
          />
          <Typography
            variant="body2"
            sx={{
              fontSize: '14px',
              color: '#E65100',
              fontWeight: 500,
            }}
          >
            {t('LEARNER_APP.USER_PROFILE_CARD.LOGIN_TIP', { defaultValue: 'Tip: Log in using your ERP ID' })}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CongratulationsModal;
