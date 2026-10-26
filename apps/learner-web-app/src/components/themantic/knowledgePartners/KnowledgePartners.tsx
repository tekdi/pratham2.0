'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress, IconButton, Typography } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SpeakableText from '@shared-lib-v2/lib/textToSpeech/SpeakableText';
import { scaledFontSize } from '@learner/utils/scaledFontSize';
import PartnerCard from './PartnerCard';
import { KnowledgePartner } from './partnersData';
import { getKnowledgePartners } from '@learner/utils/API/KnowledgePartnerService';

const navButtonSx = {
  bgcolor: 'white',
  borderRadius: '16px',
  position: 'absolute',
  top: 'calc(50% - 20px)',
  zIndex: 2,
  transform: 'translateY(-50%)',
  color: 'primary.main',
  '&:hover': { bgcolor: 'white' },
  '&.swiper-button-disabled': { opacity: 0.4 },
};

const KnowledgePartners = () => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const [partners, setPartners] = useState<KnowledgePartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchPartners = async () => {
      try {
        const data = await getKnowledgePartners();
        if (!cancelled) setPartners(data);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPartners();
    return () => {
      cancelled = true;
    };
  }, []);

  let statusMessage: string | null = null;
  if (error) {
    statusMessage =
      'Unable to load knowledge partners. Please try again later.';
  } else if (!loading && partners.length === 0) {
    statusMessage = 'No knowledge partners available.';
  }

  return (
    <Box
      id="knowledge-partners"
      sx={{
        backgroundColor: '#fff',
        p: { xs: 2, md: 3.5 },
        position: 'relative',
        borderRadius: '0px 6px 6px 6px',
        mt: '110px',
      }}
    >
      <Box
        sx={{
          backgroundColor: '#FFC107',
          width: 'fit-content',
          position: 'absolute',
          top: '-46px',
          left: 0,
          p: 1,
          border: '1px solid white',
          borderTopLeftRadius: '0.25rem',
          borderTopRightRadius: '0.25rem',
        }}
      >
        <Typography
          component="h2"
          sx={{ fontSize: scaledFontSize(20), fontWeight: 600, color: '#000' }}
        >
          <SpeakableText>Knowledge Partners</SpeakableText>
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : statusMessage ? (
        <Typography
          sx={{
            fontSize: scaledFontSize(16),
            color: '#555',
            textAlign: 'center',
            py: 6,
          }}
        >
          <SpeakableText>{statusMessage}</SpeakableText>
        </Typography>
      ) : (
        <>
          <Box sx={{ position: 'relative', px: { xs: 3.5, md: 7 } }}>
            <IconButton
              ref={prevRef}
              aria-label="Previous partners"
              sx={{ ...navButtonSx, left: { xs: -12, md: 16 } }}
            >
              <ArrowBackIcon />
            </IconButton>
            <IconButton
              ref={nextRef}
              aria-label="Next partners"
              sx={{ ...navButtonSx, right: { xs: -12, md: 16 } }}
            >
              <ArrowForwardIcon />
            </IconButton>

            <Box
              sx={{
                '& .swiper': { py: '8px' },
                '& .swiper-slide': { height: 'auto' },
              }}
            >
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={16}
                slidesPerView={1}
                rewind
                watchOverflow={false}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
                pagination={{ el: paginationRef.current, clickable: true }}
                onBeforeInit={(swiper: any) => {
                  swiper.params.navigation.prevEl = prevRef.current;
                  swiper.params.navigation.nextEl = nextRef.current;
                  swiper.params.pagination.el = paginationRef.current;
                }}
                // The carousel is much narrower than the window on this page,
                // so size slides from its own width to keep cards readable
                breakpointsBase="container"
                breakpoints={{
                  400: { slidesPerView: 2 },
                  640: { slidesPerView: 3 },
                  840: { slidesPerView: 4 },
                  1040: { slidesPerView: 5 },
                }}
              >
                {partners.map((partner) => (
                  <SwiperSlide key={partner.id}>
                    <PartnerCard partner={partner} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>
          </Box>

          <Box
            ref={paginationRef}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              mt: 3,
              '& .swiper-pagination-bullet': {
                width: '8px',
                height: '8px',
                m: '0 !important',
                backgroundColor: '#D0D4DA',
                opacity: 1,
              },
              '& .swiper-pagination-bullet-active': {
                backgroundColor: 'primary.main',
              },
            }}
          />
        </>
      )}
    </Box>
  );
};

export default KnowledgePartners;
