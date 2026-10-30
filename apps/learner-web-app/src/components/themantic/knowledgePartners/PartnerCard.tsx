'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { Box, Tooltip, Typography } from '@mui/material';
import SpeakableText from '@shared-lib-v2/lib/textToSpeech/SpeakableText';
import { scaledFontSize } from '@learner/utils/scaledFontSize';
import PartnerImage from './PartnerImage';
import { KNOWLEDGE_PARTNERS_BASE_URL, KnowledgePartner } from './partnersData';

const PartnerCard = ({ partner }: { partner: KnowledgePartner }) => {
  const nameRef = useRef<HTMLParagraphElement>(null);
  const [showFullName, setShowFullName] = useState(false);

  // Only offer the full-name tooltip when the 2-line clamp actually cut the name
  const handleNameTooltipOpen = () => {
    const el = nameRef.current;
    setShowFullName(!!el && el.scrollHeight > el.clientHeight);
  };

  return (
    <Box
      component={Link}
      href={`${KNOWLEDGE_PARTNERS_BASE_URL}/${partner.id}`}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '240px',
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
      <PartnerImage partner={partner} sx={{ height: '130px', flexShrink: 0 }} />
      <Tooltip
        title={partner.name}
        arrow
        placement="top"
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: '#fff',
              color: '#000',
              border: '1px solid rgba(0, 0, 0, .125)',
              borderRadius: '4px',
              boxShadow: '0 0.15rem 0.6rem 0 rgba(33, 40, 50, 0.1)',
              fontSize: scaledFontSize(10),
              fontWeight: 500,
              lineHeight: 1.4,
              px: 0.5,
              py: 0.5,
              maxWidth: 210,
              textAlign: 'center',
              marginBottom: '5px !important',
            },
          },
          arrow: {
            sx: {
              color: '#fff',
              '&::before': { border: '1px solid rgba(0, 0, 0, .125)' },
            },
          },
        }}
        open={showFullName}
        onOpen={handleNameTooltipOpen}
        onClose={() => setShowFullName(false)}
      >
        <Typography
          ref={nameRef}
          sx={{
            mt: 2,
            flexShrink: 0,
            fontSize: `${scaledFontSize(16)} !important`,
            lineHeight: '20px !important',
            fontWeight: '600 !important',
            color: '#000',
            textAlign: 'center',
            textTransform: 'uppercase !important',
            letterSpacing: '0.5px',
            overflowWrap: 'break-word',
            hyphens: 'auto',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          <SpeakableText text={partner.name}>{partner.name}</SpeakableText>
        </Typography>
      </Tooltip>
      <Typography
        sx={{
          mt: 0.75,
          fontSize: `${scaledFontSize(12)} !important`,
          color: 'rgb(75, 85, 99) !important',
          textAlign: 'center',
          lineHeight: 1.4,
        }}
      >
        <SpeakableText text={partner.partnerType}>
          {partner.partnerType}
        </SpeakableText>
      </Typography>
    </Box>
  );
};

export default PartnerCard;
