'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { Box, Tooltip, Typography } from '@mui/material';
import SpeakableText from '@shared-lib-v2/lib/textToSpeech/SpeakableText';
import { scaledFontSize } from '@learner/utils/scaledFontSize';
import { KNOWLEDGE_PARTNERS_BASE_URL, KnowledgePartner } from './partnersData';

// Card shell, image area and hover match the New Arrivals CardComponent
const PartnerCard = ({ partner }: { partner: KnowledgePartner }) => {
  const nameRef = useRef<HTMLParagraphElement>(null);
  const [showFullName, setShowFullName] = useState(false);

  // Only offer the full-name tooltip when the single-line name is cut off
  const handleNameTooltipOpen = () => {
    const el = nameRef.current;
    setShowFullName(!!el && el.scrollWidth > el.clientWidth);
  };

  return (
    <Box
      component={Link}
      href={`${KNOWLEDGE_PARTNERS_BASE_URL}/${partner.id}`}
      sx={{
        backgroundColor: '#fff',
        position: 'relative',
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out',
        boxShadow: '0 0.15rem 1.75rem 0 rgba(33, 40, 50, 0.15)',
        border: '1px solid rgba(0, 0, 0, .125)',
        minHeight: '286px',
        borderRadius: '.25rem',
        textDecoration: 'none',
        color: 'inherit',
        display: 'block',
        '&:hover': {
          transform: 'scale(1.07)',
        },
      }}
    >
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box sx={{ margin: '8px', width: 'calc(100% - 16px)' }}>
          {partner.image && (
            <img
              src={partner.image}
              alt={partner.name}
              style={{
                display: 'block',
                width: '100%',
                height: '200px',
                objectFit: 'contain',
              }}
            />
          )}
        </Box>

        <Tooltip
          title={partner.name}
          arrow
          open={showFullName}
          onOpen={handleNameTooltipOpen}
          onClose={() => setShowFullName(false)}
          componentsProps={{
            tooltip: { sx: { marginTop: '0px !important' } },
          }}
        >
          <Typography
            ref={nameRef}
            noWrap
            sx={{
              mt: 0.3,
              mb: 0.3,
              px: '16px',
              maxWidth: '100%',
              boxSizing: 'border-box',
              fontSize: scaledFontSize(16),
              lineHeight: '22px',
              fontWeight: 600,
              color: 'black',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            <SpeakableText text={partner.name}>{partner.name}</SpeakableText>
          </Typography>
        </Tooltip>

        <Typography
          sx={{
            fontSize: scaledFontSize(12),
            color: 'rgb(75, 85, 99)',
            textAlign: 'center',
            lineHeight: 1.4,
            letterSpacing: '0.5px',
            px: '16px',
            mb: 2,
            minHeight: '34px',
            wordBreak: 'break-word',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          <SpeakableText text={partner.partnerType}>
            {partner.partnerType}
          </SpeakableText>
        </Typography>
      </Box>
    </Box>
  );
};

export default PartnerCard;
