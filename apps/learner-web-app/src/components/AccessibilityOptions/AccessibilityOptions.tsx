import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import TextFormatIcon from '@mui/icons-material/TextFormat';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import MicIcon from '@mui/icons-material/Mic';
import InvertColorsIcon from '@mui/icons-material/InvertColors';
import LinkIcon from '@mui/icons-material/Link';
import { Stack, Divider, Paper } from '@mui/material';
import AccessibleIcon from '@mui/icons-material/Accessible';
import { useFontSize } from '../../context/FontSizeContext';

export default function AccessibilityOptions() {
  const [open, setOpen] = React.useState(false);
  const { increaseFontSize, decreaseFontSize, resetFontSize, fontSize } =
    useFontSize();

  // Update CSS variable when fontSize changes
  React.useEffect(() => {
    document.documentElement.style.setProperty(
      '--font-size-scale',
      fontSize.toString()
    );
  }, [fontSize]);

  const toggleDrawer =
    (openState: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setOpen(openState);
    };

  return (
    <div>
      <IconButton
        onClick={toggleDrawer(true)}
        aria-label="Accessibility Options"
        sx={{
          bgcolor: '#f5f3e7',
          borderRadius: 1,
          padding: 1,
          '&:hover': { bgcolor: '#ebe7d9' },
          position: 'absolute',
          right: 8,
          top: 150,
        }}
      >
        <AccessibleIcon sx={{ color: '#000' }} />
      </IconButton>
      <SwipeableDrawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        PaperProps={{
          sx: {
            height: 'auto',
            maxHeight: '95vh',
            marginTop: '152px',
            borderRadius: '16px 0 0 16px',
            width: '552px',
          },
        }}
        BackdropProps={{
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.3)' },
        }}
      >
        <Paper
          elevation={0}
          sx={{ width: 'auto', padding: 2, maxWidth: '600px' }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6">Accessibility Options</Typography>
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                onClick={increaseFontSize}
                sx={{
                  flex: 1,
                  justifyContent: 'flex-start',
                  py: 1.5,
                  borderRadius: 2,
                  bgcolor: '#f5f5f5',
                }}
              >
                <Typography variant="subtitle1">Increase Font Size</Typography>
              </Button>

              <Button
                variant="outlined"
                color="primary"
                startIcon={<RemoveIcon />}
                onClick={decreaseFontSize}
                sx={{
                  flex: 1,
                  justifyContent: 'flex-start',
                  py: 1.5,
                  borderRadius: 2,
                  bgcolor: '#f5f5f5',
                }}
              >
                <Typography variant="subtitle1">Decrease Font Size</Typography>
              </Button>
            </Stack>

            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<RecordVoiceOverIcon />}
                sx={{
                  flex: 1,
                  justifyContent: 'flex-start',
                  py: 1.5,
                  borderRadius: 2,
                  bgcolor: '#f5f5f5',
                }}
              >
                <Typography variant="subtitle1">Text to Speech</Typography>
              </Button>

              <Button
                variant="contained"
                color="primary"
                startIcon={<MicIcon />}
                sx={{
                  flex: 1,
                  justifyContent: 'flex-start',
                  py: 1.5,
                  borderRadius: 2,
                  bgcolor: '#FFBF00',
                }}
              >
                <Typography variant="subtitle1">Speech to Text</Typography>
              </Button>
            </Stack>

            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<InvertColorsIcon />}
                sx={{
                  flex: 1,
                  justifyContent: 'flex-start',
                  py: 1.5,
                  borderRadius: 2,
                  bgcolor: '#f5f5f5',
                }}
              >
                <Typography variant="subtitle1">Invert Colours</Typography>
              </Button>

              <Button
                variant="contained"
                color="primary"
                startIcon={<LinkIcon />}
                sx={{
                  flex: 1,
                  justifyContent: 'flex-start',
                  py: 1.5,
                  borderRadius: 2,
                  bgcolor: '#FFBF00',
                }}
              >
                <Typography variant="subtitle1">Underline links</Typography>
              </Button>
            </Stack>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="text" color="primary" onClick={resetFontSize}>
              Clear Selection
            </Button>
          </Box>
        </Paper>
      </SwipeableDrawer>
    </div>
  );
}
