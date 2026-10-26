'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Typography } from '@mui/material';
import SpeakableText from '@shared-lib-v2/lib/textToSpeech/SpeakableText';
import { scaledFontSize } from '@learner/utils/scaledFontSize';
import PartnerImage from './PartnerImage';
import { KNOWLEDGE_PARTNERS_BASE_URL, KnowledgePartner } from './partnersData';

const PartnerCard = ({ partner }: { partner: KnowledgePartner }) => (
  <Box
    component={Link}
    href={`${KNOWLEDGE_PARTNERS_BASE_URL}/${partner.id}`}
    sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '260px',
      boxSizing: 'border-box',
      p: '10px',
      pb: 3,
      backgroundColor: '#fff',
      border: '1px solid rgba(0, 0, 0, .125)',
      borderRadius: '.25rem',
      boxShadow: '0 0.15rem 0.6rem 0 rgba(33, 40, 50, 0.1)',
      textDecoration: 'none',
      color: 'inherit',
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 0.15rem 1.75rem 0 rgba(33, 40, 50, 0.15)',
      },
    }}
  >
    <PartnerImage
      partner={partner}
      sx={{ height: '130px', flexShrink: 0 }}
    />
    <Typography
      sx={{
        mt: 2,
        fontSize: `${scaledFontSize(16)} !important`,
        lineHeight: '20px !important',
        fontWeight: '600 !important',
        color: '#000',
        textAlign: 'center',
        textTransform: 'uppercase !important',
        letterSpacing: '0.5px',
        overflowWrap: 'break-word',
        hyphens: 'auto',
      }}
    >
      <SpeakableText text={partner.name}>{partner.name}</SpeakableText>
    </Typography>
    <Typography
      sx={{
        mt: 0.75,
        fontSize: `${scaledFontSize(12)} !important`,
        color: 'rgb(75, 85, 99) !important',
        textAlign: 'center',
        lineHeight: 1.4,
      }}
    >
      <SpeakableText text={partner.role}>{partner.role}</SpeakableText>
    </Typography>
  </Box>
);

export default PartnerCard;
