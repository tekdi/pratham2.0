'use client';

import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Paper,
  Stack,
  Chip,
  Alert,
  Container,
  useTheme,
} from '@mui/material';
import { useColorInversion } from '../../context/ColorInversionContext';
import AccessibilityOptions from '../../components/AccessibilityOptions/AccessibilityOptions';

export default function ColorInversionDemo() {
  const theme = useTheme();
  const { isColorInverted } = useColorInversion();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <AccessibilityOptions />

      <Stack spacing={4}>
        {/* Header Section */}
        <Box>
          <Typography
            variant="h1"
            sx={{
              color: theme.palette.primary.main,
              mb: 2,
            }}
          >
            Color Inversion Demo Page
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.primary,
              mb: 1,
            }}
          >
            This page demonstrates how to use theme colors correctly with the
            color inversion feature.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
            }}
          >
            Current color inversion status:{' '}
            {isColorInverted ? 'Enabled' : 'Disabled'}
          </Typography>
        </Box>

        {/* Color Palette Demo */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: theme.palette.primary.main,
              mb: 3,
            }}
          >
            Theme Color Palette
          </Typography>

          <Stack spacing={3}>
            {/* Primary Colors */}
            <Box>
              <Typography
                variant="h3"
                sx={{
                  color: theme.palette.text.primary,
                  mb: 2,
                }}
              >
                Primary Colors
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Chip
                  label={`Primary Main: ${theme.palette.primary.main}`}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                  }}
                />
                <Chip
                  label={`Primary Light: ${theme.palette.primary.light}`}
                  sx={{
                    backgroundColor: theme.palette.primary.light,
                    color: theme.palette.primary.contrastText,
                  }}
                />
              </Stack>
            </Box>

            {/* Secondary Colors */}
            <Box>
              <Typography
                variant="h3"
                sx={{
                  color: theme.palette.text.primary,
                  mb: 2,
                }}
              >
                Secondary Colors
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Chip
                  label={`Secondary Main: ${theme.palette.secondary.main}`}
                  sx={{
                    backgroundColor: theme.palette.secondary.main,
                    color: theme.palette.secondary.contrastText,
                  }}
                />
                <Chip
                  label={`Secondary Light: ${theme.palette.secondary.light}`}
                  sx={{
                    backgroundColor: theme.palette.secondary.light,
                    color: theme.palette.secondary.contrastText,
                  }}
                />
              </Stack>
            </Box>

            {/* Status Colors */}
            <Box>
              <Typography
                variant="h3"
                sx={{
                  color: theme.palette.text.primary,
                  mb: 2,
                }}
              >
                Status Colors
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Chip
                  label={`Success: ${theme.palette.success.main}`}
                  sx={{
                    backgroundColor: theme.palette.success.main,
                    color: theme.palette.success.contrastText,
                  }}
                />
                <Chip
                  label={`Error: ${theme.palette.error.main}`}
                  sx={{
                    backgroundColor: theme.palette.error.main,
                    color: '#FFFFFF',
                  }}
                />
                <Chip
                  label={`Info: ${theme.palette.info.main}`}
                  sx={{
                    backgroundColor: theme.palette.info.main,
                    color: theme.palette.info.contrastText,
                  }}
                />
              </Stack>
            </Box>

            {/* Custom Colors */}
            <Box>
              <Typography
                variant="h3"
                sx={{
                  color: theme.palette.text.primary,
                  mb: 2,
                }}
              >
                Custom Colors
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Chip
                  label={`Warning A200: ${theme.palette.customColors.warningA200}`}
                  sx={{
                    backgroundColor: theme.palette.customColors.warningA200,
                    color: theme.palette.customColors.warningA400,
                  }}
                />
                <Chip
                  label={`Warning 800: ${theme.palette.customColors.warning800}`}
                  sx={{
                    backgroundColor: theme.palette.customColors.warning800,
                    color: theme.palette.customColors.warningA200,
                  }}
                />
              </Stack>
            </Box>
          </Stack>
        </Paper>

        {/* Interactive Components */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: theme.palette.primary.main,
              mb: 3,
            }}
          >
            Interactive Components
          </Typography>

          <Stack spacing={3}>
            {/* Buttons */}
            <Box>
              <Typography
                variant="h3"
                sx={{
                  color: theme.palette.text.primary,
                  mb: 2,
                }}
              >
                Buttons
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    color: theme.palette.primary.contrastText,
                  }}
                >
                  Primary Button
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{
                    color: theme.palette.secondary.main,
                    borderColor: theme.palette.secondary.main,
                  }}
                >
                  Secondary Button
                </Button>
                <Button
                  variant="text"
                  sx={{
                    color: theme.palette.info.main,
                  }}
                >
                  Text Button
                </Button>
              </Stack>
            </Box>

            {/* Cards */}
            <Box>
              <Typography
                variant="h3"
                sx={{
                  color: theme.palette.text.primary,
                  mb: 2,
                }}
              >
                Cards
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Card sx={{ minWidth: 275 }}>
                  <CardContent>
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{
                        color: theme.palette.primary.main,
                      }}
                    >
                      Sample Card
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                      }}
                    >
                      This card demonstrates proper use of theme colors.
                    </Typography>
                  </CardContent>
                </Card>
              </Stack>
            </Box>

            {/* Alerts */}
            <Box>
              <Typography
                variant="h3"
                sx={{
                  color: theme.palette.text.primary,
                  mb: 2,
                }}
              >
                Alerts
              </Typography>
              <Stack spacing={2}>
                <Alert severity="success">
                  This is a success alert with theme colors!
                </Alert>
                <Alert severity="info">
                  This is an info alert with theme colors!
                </Alert>
                <Alert severity="warning">
                  This is a warning alert with theme colors!
                </Alert>
                <Alert severity="error">
                  This is an error alert with theme colors!
                </Alert>
              </Stack>
            </Box>
          </Stack>
        </Paper>

        {/* Code Examples */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: theme.palette.primary.main,
              mb: 3,
            }}
          >
            Code Examples
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.primary,
              mb: 2,
            }}
          >
            Here's how to use theme colors correctly in your components:
          </Typography>

          <Box
            component="pre"
            sx={{
              backgroundColor: theme.palette.customColors.warning800,
              color: theme.palette.customColors.warningA200,
              p: 2,
              borderRadius: 1,
              overflow: 'auto',
              fontSize: '0.875rem',
              fontFamily: 'monospace',
            }}
          >
            {`// Import useTheme hook
import { useTheme } from '@mui/material';

function MyComponent() {
  const theme = useTheme();
  
  return (
    <Typography 
      sx={{ 
        color: theme.palette.primary.main 
      }}
    >
      Text with primary color
    </Typography>
  );
}`}
          </Box>

          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.primary,
              mt: 3,
              mb: 1,
            }}
          >
            Examples for using custom theme colors:
          </Typography>

          <Box
            component="pre"
            sx={{
              backgroundColor: theme.palette.customColors.warning800,
              color: theme.palette.customColors.warningA200,
              p: 2,
              borderRadius: 1,
              overflow: 'auto',
              fontSize: '0.875rem',
              fontFamily: 'monospace',
            }}
          >
            {`// Using properly typed custom colors
const theme = useTheme();

// Standard theme colors
color: theme.palette.primary.main
color: theme.palette.text.primary
backgroundColor: theme.palette.background.paper

// Custom colors (now properly typed)
color: theme.palette.customColors.warningA200
backgroundColor: theme.palette.customColors.warning800
color: theme.palette.customColors.primary100`}
          </Box>
        </Paper>
      </Stack>
    </Container>
  );
}
