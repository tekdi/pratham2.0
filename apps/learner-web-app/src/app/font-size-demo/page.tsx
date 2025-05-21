'use client';
import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import AccessibilityOptions from '@learner/components/AccessibilityOptions/AccessibilityOptions';
import { useFontSizeEffect } from '../../context/useFontSizeEffect';
import '../../context/FontSize.css';

export default function FontSizeDemo() {
  // Apply font size effect
  useFontSizeEffect();

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <AccessibilityOptions />
      <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h3" gutterBottom>
          Font Size Demo Page
        </Typography>
        <Typography variant="body1" paragraph>
          This page demonstrates the font size adjustment functionality. Use the
          accessibility options to increase or decrease font size.
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Typography Variants
          </Typography>

          <Typography variant="h1" gutterBottom>
            H1 - Main Heading
          </Typography>

          <Typography variant="h2" gutterBottom>
            H2 - Section Heading
          </Typography>

          <Typography variant="h3" gutterBottom>
            H3 - Subsection Heading
          </Typography>

          <Typography variant="h4" gutterBottom>
            H4 - Card Title
          </Typography>

          <Typography variant="h5" gutterBottom>
            H5 - Small Title
          </Typography>

          <Typography variant="h6" gutterBottom>
            H6 - Label
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            Subtitle 1 - Slightly emphasized text
          </Typography>

          <Typography variant="subtitle2" gutterBottom>
            Subtitle 2 - Secondary emphasized text
          </Typography>

          <Typography variant="body1" gutterBottom>
            Body 1 - Default paragraph text. This is the standard text style
            used for most content.
          </Typography>

          <Typography variant="body2" gutterBottom>
            Body 2 - Smaller paragraph text, used for less important
            information.
          </Typography>

          <Typography variant="button" display="block" gutterBottom>
            Button Text
          </Typography>

          <Typography variant="caption" display="block" gutterBottom>
            Caption - Very small text for annotations
          </Typography>

          <Typography variant="overline" display="block" gutterBottom>
            OVERLINE - ALL CAPS SMALL TEXT
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
