import React from 'react';
import { Box, Button, Divider, Stack, Typography, useTheme } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import GetAppIcon from '@mui/icons-material/GetApp';
import { useTranslation } from '@shared-lib';

interface RegistrationSuccessCardProps {
  programName: string;
  statusLabel: string;
}

const PLAY_STORE_LINK =
  'https://play.google.com/store/apps/details?id=com.pratham.learning';

const RegistrationSuccessCard: React.FC<RegistrationSuccessCardProps> = ({
  programName,
  statusLabel,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { customColors } = theme.palette;

  return (
    <Box
      sx={{
        bgcolor: customColors.registrationCardBackground,
        borderRadius: 3,
        p: { xs: 2, md: 2.5 },
        mb: 2,
        height: '100%',
        boxShadow:
          '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="flex-start">
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            bgcolor: customColors.registrationCardIconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            mt: '2px',
          }}
        >
          <InfoIcon sx={{ fontSize: '16px', color: '#FFFFFF' }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '16px' }}
          >
            {t('LEARNER_APP.COURSE.REGISTRATION_SUCCESSFUL_TITLE')}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary, mt: 0.5 }}
          >
            {t('LEARNER_APP.COURSE.SECOND_CHANCE_REGISTRATION_MESSAGE')}
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ my: 1.75, borderColor: customColors.registrationDivider }} />

      <Typography
        variant="body2"
        sx={{ color: theme.palette.text.secondary, mt: 1.75, mb: 1.25 }}
      >
        {t('LEARNER_APP.COURSE.PLAYSTORE_DOWNLOAD_MESSAGE').split(
          '{playStoreLink}'
        )[0]}
      </Typography>

      <Button
        href={PLAY_STORE_LINK}
        target="_blank"
        rel="noopener noreferrer"
        variant="outlined"
        startIcon={<GetAppIcon sx={{ fontSize: '18px' }} />}
        size="small"
        disableRipple
        disableElevation
        sx={{
          bgcolor: '#FFFFFF',
          color: theme.palette.secondary.main,
          borderColor: customColors.registrationDivider,
          boxShadow: 'none',
          fontWeight: 600,
          fontSize: '13px',
          textTransform: 'none',
          borderRadius: 5,
          px: 2.25,
          py: 0.75,
          '&:hover': {
            bgcolor: '#FFFFFF',
            borderColor: customColors.registrationDivider,
            boxShadow: 'none',
          },
        }}
      >
        {t('LEARNER_APP.COURSE.PLAY_STORE')}
      </Button>
    </Box>
  );
};

export default RegistrationSuccessCard;
