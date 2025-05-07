'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import GlobalStyles from '@mui/material/GlobalStyles';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const slides = [
  {
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    heading: 'Pratham - Shah PraDigi Innovation Centre is selected as one of the winners of the Learning Engineering Tools Competition 2021-22',
    description: `Pratham undertook an exploratory study for children to understand the problem of plastic waste management in rural India. This study is a part of Pratham’s Learning for Life curriculum. In this study, we covered 8400 households, in 700 villages across 70 districts, in 15 states. Findings to be released in July 2022. Click here to sign up for the report.`
  },
  {
    image:
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80',
    heading: 'Digital Learning Expansion 2023',
    description:
      'A new initiative to expand digital learning resources to rural schools. Over 5000 tablets distributed and 200+ workshops conducted.',
    stats: [
      { label: 'TABLETS', value: 5000 },
      { label: 'WORKSHOPS', value: 200 },
      { label: 'SCHOOLS', value: 120 },
    ],
  },
];

const WhatsNewCarousel = () => (
  <Box
    sx={{
      background: '#fff',
      m: '32px auto',
      borderRadius: 2,
    }}
  >
    <GlobalStyles
      styles={{
        '.custom-swiper-bullet': {
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: '#ddd',
          display: 'inline-block',
          margin: '0 4px',
          transition: 'background 0.2s',
          cursor: 'pointer',
        },
        '.custom-swiper-bullet-active': {
          background: '#ffe082',
        },
        '.custom-swiper-pagination': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 12px',
        },
        '.custom-swiper-nav-btn': {
          background: '#fff',
          border: '1px solid #ddd',
          borderRadius: '50%',
          width: 36,
          height: 36,
          fontSize: '1.3rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.2s, border 0.2s',
          cursor: 'pointer',
          '&:hover': {
            background: '#ffe082',
            borderColor: '#ffe082',
          },
        },
      }}
    />
    <Swiper
      modules={[Navigation, Pagination]}
      navigation={{
        nextEl: '.custom-swiper-next',
        prevEl: '.custom-swiper-prev',
      }}
      pagination={{
        clickable: true,
        el: '.custom-swiper-pagination',
        bulletClass: 'custom-swiper-bullet',
        bulletActiveClass: 'custom-swiper-bullet-active',
      }}
      style={{ paddingBottom: 15 }}
    >
      {slides.map((slide, idx) => (
        <SwiperSlide key={idx}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'stretch',
              justifyContent: 'stretch',
            }}
          >
            {/* Image Section */}
            <Box
              sx={{
                position: 'relative',
                flex: 1.2,
                minWidth: 0,
                display: 'flex',
                alignItems: 'stretch',
              }}
            >
              <Box
                component="img"
                src={slide.image}
                alt="slide"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderTopLeftRadius: 2,
                  borderBottomLeftRadius: 2,
                  minHeight: 320,
                  maxHeight: 340,
                  '@media (max-width:900px)': {
                    borderRadius: '12px 12px 0 0',
                    maxHeight: 220,
                    minHeight: 180,
                  },
                }}
              />
            </Box>
            {/* Content Section */}
            <Box
              sx={{
                flex: 1.8,
                background: '#f7f7f7',
                borderTopRightRadius: 2,
                borderBottomRightRadius: 2,
                p: { xs: '24px 16px', md: '32px' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                '@media (max-width:900px)': { borderRadius: '0 0 12px 12px' },
              }}
            >
              <Typography
                sx={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  mb: 2,
                  color: '#222',
                }}
              >
                {slide.heading}
              </Typography>
              <Typography
                sx={{ fontSize: '1rem', color: '#444', lineHeight: 1.6, mb: 3 }}
              >
                {slide.description}
              </Typography>
             
            </Box>
          </Box>
        </SwiperSlide>
      ))}
    </Swiper>
    {/* Custom navigation and pagination controls below Swiper */}
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <IconButton
        className="custom-swiper-prev custom-swiper-nav-btn"
        aria-label="Previous"
        sx={{
          boxShadow: '0px 1px 2px 0px #0000004D',
          background: '#fff',
          borderRadius: '50%',
        }}
      >
        <ArrowBackIosNewIcon fontSize="small" sx={{ color: '#222' }} />
      </IconButton>
      <Box className="custom-swiper-pagination" />
      <IconButton
        className="custom-swiper-next custom-swiper-nav-btn"
        aria-label="Next"
        sx={{
          boxShadow: '0px 1px 2px 0px #0000004D',
          background: '#fff',
          borderRadius: '50%',
        }}
      >
        <ArrowForwardIosIcon fontSize="small" sx={{ color: '#222' }} />
      </IconButton>
    </Box>
  </Box>
);

export default WhatsNewCarousel;
