import { Box, Button, Typography, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';

export const CompleteProfileBanner = () => {
  const router = useRouter();
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
        Complete your profile so we can guide you better on your learning
        journey
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
        Complete Profile
      </Button>
    </Paper>
  );
};
