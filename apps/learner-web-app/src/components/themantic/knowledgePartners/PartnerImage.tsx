'use client';

import React from 'react';
import { Box } from '@mui/material';
import { KnowledgePartner } from './partnersData';

// Grey box showing the partner's photo/logo, scaled to fit without cropping
const PartnerImage = ({
  partner,
  sx,
}: {
  partner: KnowledgePartner;
  sx?: any;
}) => (
  <Box
    sx={{
      backgroundColor: '#F4F5F7',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      overflow: 'hidden',
      px: 1.5,
      ...sx,
    }}
  >
    {partner.image && (
      <img
        src={partner.image}
        alt={partner.name}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    )}
  </Box>
);

export default PartnerImage;
