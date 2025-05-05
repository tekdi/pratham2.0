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
      }}
    >
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        {t('LEARNER_APP.COMPLETE_PROFILE_BANNER.MESSAGE')}{' '}
        {/* Internationalized message */}
      </Typography>
      <Button
        onClick={handleCompleteProfileClick}
        variant="contained"
        sx={{
          backgroundColor: '#FFC400', // yellow button
          color: '#000',
          fontWeight: 600,
          paddingX: 3,
          paddingY: 1,
          borderRadius: 5,
          boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
          '&:hover': {
            backgroundColor: '#FFB300', // darker on hover
          },
        }}
      >
        {t('LEARNER_APP.COMPLETE_PROFILE_BANNER.BUTTON')}{' '}
        {/* Internationalized button text */}
      </Button>
    </Paper>
  );
};
