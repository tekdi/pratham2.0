import { Box, Button, Typography, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';
import { Loader, useTranslation } from '@shared-lib'; // Updated import

export const CompleteProfileBanner = () => {
  const router = useRouter();
  const { t } = useTranslation(); // Initialize translation function

  const handleCompleteProfileClick = () => {
    router.push('/profile-complition?isComplition=true');
  };

  return (
    <Paper
      elevation={2}
      sx={{
        backgroundColor: '#FFE08A', // light yellow
        padding: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 2,
        gap: 1,
      }}
    >
      <Typography
        variant="body1"
        sx={{
          fontWeight: 500,
          fontSize: { md: 14, xs: 12 },
        }}
      >
        {t('LEARNER_APP.COMPLETE_PROFILE_BANNER.MESSAGE')}
        {/* Internationalized message */}
      </Typography>
      <Button
        onClick={handleCompleteProfileClick}
        variant="contained"
        sx={{
          minWidth: '144px',
          backgroundColor: '#FFC400', // yellow button
          color: '#000',
          fontWeight: { xs: '400', sm: '400', md: '600' },
          paddingX: 3,
          paddingY: 1,
          borderRadius: 5,
          fontSize: 14,
          lineHeight: 1.43,
          letterSpacing: '0.25px',
          textAlign: 'center',
          verticalAlign: 'middle',
          padding: '10px 12px',
          boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
          '&:hover': {
            backgroundColor: '#FFB300', // darker on hover
          },
        }}
      >
        {t('LEARNER_APP.COMPLETE_PROFILE_BANNER.BUTTON')}
        {/* Internationalized button text */}
      </Button>
    </Paper>
  );
};
