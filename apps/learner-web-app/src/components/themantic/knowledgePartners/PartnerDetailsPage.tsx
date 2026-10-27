'use client';

import React, { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';
import SpeakableText from '@shared-lib-v2/lib/textToSpeech/SpeakableText';
import { scaledFontSize } from '@learner/utils/scaledFontSize';
import { getKnowledgePartners } from '@learner/utils/API/KnowledgePartnerService';
import Layout from '../layout/Layout';
import SubHeader from '../subHeader/SubHeader';
import PartnerDetails from './PartnerDetails';
import { KnowledgePartner } from './partnersData';

// Fetches the partner for /themantic/knowledge-partners/[partnerId] and
// renders PartnerDetails, or a loading / error / not-found state
const PartnerDetailsPage = ({ partnerId }: { partnerId: string }) => {
  const [partner, setPartner] = useState<KnowledgePartner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchPartner = async () => {
      setLoading(true);
      setError(false);
      try {
        const partners = await getKnowledgePartners();
        const data = partners.find((item) => item.id === partnerId) ?? null;
        if (!cancelled) setPartner(data);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPartner();
    return () => {
      cancelled = true;
    };
  }, [partnerId]);

  useEffect(() => {
    if (partner) {
      document.title = `${partner.name} | Experimento India`;
    }
  }, [partner]);

  if (!loading && !error && !partner) {
    notFound();
  }

  if (partner) {
    return <PartnerDetails partner={partner} />;
  }

  return (
    <Layout>
      <SubHeader showFilter={false} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
          px: 2,
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <Typography
            sx={{
              fontSize: scaledFontSize(16),
              color: '#555',
              textAlign: 'center',
            }}
          >
            <SpeakableText>
              Unable to load partner details. Please try again later.
            </SpeakableText>
          </Typography>
        )}
      </Box>
    </Layout>
  );
};

export default PartnerDetailsPage;
