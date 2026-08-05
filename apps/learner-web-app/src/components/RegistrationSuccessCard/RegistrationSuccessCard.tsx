import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import GetAppIcon from '@mui/icons-material/GetApp';
import { useTranslation } from '@shared-lib';
import { useSharedAccordionState } from '@learner/utils/hooks/useSharedAccordionState';

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
  const [isOpen, setIsOpen] = useSharedAccordionState();

  const downloadAppText = t('LEARNER_APP.COURSE.PLAYSTORE_DOWNLOAD_MESSAGE').split(
    '{playStoreLink}'
  )[0];

  const icon = (
    <Box
      sx={{
        width: 22,
        height: 22,
        borderRadius: '50%',
        bgcolor: customColors.registrationCardIconBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <InfoIcon sx={{ fontSize: '14px', color: '#FFFFFF' }} />
    </Box>
  );

  const description = (
    <Typography
      variant="body2"
      sx={{ color: theme.palette.text.secondary, fontSize: '12px' }}
    >
      {t('LEARNER_APP.COURSE.SECOND_CHANCE_REGISTRATION_MESSAGE')}{' '}
      {downloadAppText}
    </Typography>
  );

  const playStoreButton = (
    <Button
      href={PLAY_STORE_LINK}
      target="_blank"
      rel="noopener noreferrer"
      variant="contained"
      color="primary"
      startIcon={<GetAppIcon sx={{ fontSize: '18px' }} />}
      sx={{
        minWidth: { xs: 'auto', sm: '120px' },
        fontWeight: 500,
        fontSize: '12px',
        lineHeight: '20px',
        letterSpacing: '0.1px',
        whiteSpace: 'nowrap',
        px: { xs: 2, sm: 3 },
        py: 1,
        m: '0 !important',
        boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
        flexShrink: 0,
      }}
    >
      {t('LEARNER_APP.COURSE.PLAY_STORE')}
    </Button>
  );

  return (
    <Accordion
      expanded={isOpen}
      onChange={(_event, expanded) => setIsOpen(expanded)}
      disableGutters
      elevation={0}
      sx={{
        bgcolor: customColors.registrationCardBackground,
        borderRadius: '12px !important',
        width: '100%',
        flexGrow: 1,
        boxSizing: 'border-box',
        boxShadow:
          '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        '&:before': { display: 'none' },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          px: { xs: 1.5, md: 2 },
          minHeight: 'auto',
          '& .MuiAccordionSummary-content': {
            my: 1,
            alignItems: 'center',
          },
        }}
      >
        <Stack direction="row" alignItems="center" gap={1}>
          {icon}
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '14px' }}
          >
            {t('LEARNER_APP.COURSE.REGISTRATION_SUCCESSFUL_TITLE')}
          </Typography>
        </Stack>
      </AccordionSummary>

      <AccordionDetails sx={{ px: { xs: 1.5, md: 2 }, pt: 0, pb: { xs: 1.5, md: 2 } }}>
        {/* Mobile layout: description, then button below */}
        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
          <Box sx={{ mb: 1.25 }}>{description}</Box>
          {playStoreButton}
        </Box>

        {/* Desktop layout: description + button, single row */}
        <Stack
          direction="row"
          alignItems="center"
          gap={1.5}
          sx={{ display: { xs: 'none', sm: 'flex' } }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>{description}</Box>
          {playStoreButton}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default RegistrationSuccessCard;
