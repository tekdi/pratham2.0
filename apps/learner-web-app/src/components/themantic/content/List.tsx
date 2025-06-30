'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import HomeCards from '@learner/app/themantic/HomeCards/HomeCards';
import { Box, Container, Card, CardContent, Typography } from '@mui/material';
import Layout from '../layout/Layout';
import SubHeader from '../subHeader/SubHeader';

// Dynamic import of Content component with SSR disabled
const Content = dynamic(() => import('@Content'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-4">
      Loading content...
    </div>
  ),
});

interface ListProps {
  items?: any[];
  title?: string;
  className?: string;
}

const List: React.FC<ListProps> = ({
  items = [],
  // title = 'Content List',
  className = '',
}) => {
  return (
    <Layout>
      <SubHeader showFilter={true} />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundImage: `url('/images/mainpagebig.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: { xs: 2, md: 4 },
          py: 4,
        }}
      >
        <div className={`list-container ${className}`}>
          {/* <h2 className="text-xl font-semibold mb-4">{title}</h2> */}

          <div className="content-wrapper">
            <Suspense
              fallback={
                <div className="flex items-center justify-center p-8">
                  Loading...
                </div>
              }
            >
              <Container maxWidth="lg">
                <Content
                  isShowLayout={false}
                  contentTabs={['Course']}
                  pageName="Course"
                  filters={{
                    limit: 3,
                    filters: {
                      program: 'Experimento India',
                    },
                  }}
                  _config={{
                    contentBaseUrl: '/themantic',
                    _grid: {
                      xs: 12,
                      sm: 6,
                      md: 4,
                      lg: 4,
                      xl: 4,
                    },
                    _containerGrid: {
                      spacing: { xs: 6, sm: 6, md: 6 },
                    },
                    default_img: '/images/image_ver.png',
                    _card: {
                      cardComponent: CardComponent,
                    },
                  }}
                  hasMoreData={false}
                />
              </Container>
            </Suspense>
          </div>
        </div>
        <Container maxWidth="lg" sx={{ mt: 8 }}>
          <Box
            sx={{
              backgroundColor: '#fff',
              padding: 2,
              position: 'relative',
              zIndex: 1000,
              borderRadius: '0px 6px 6px 6px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#FFC107',
                width: 'fit-content',
                position: 'absolute',
                top: '-40px',
                left: 0,
                p: 1,
                border: '1px solid white',
                borderTopLeftRadius: '0.25rem',
                borderTopRightRadius: '0.25rem',
              }}
            >
              <Typography
                sx={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#000',
                }}
              >
                New Arrivals
              </Typography>
            </Box>
            <Box>
              <Content
                isShowLayout={false}
                contentTabs={['content']}
                pageName="content"
                filters={{
                  limit: 3,
                  sort_by: { lastUpdatedOn: 'desc' },
                  filters: {
                    program: 'Experimento India',
                  },
                }}
                _config={{
                  contentBaseUrl: '/themantic',
                  _grid: {
                    xs: 12,
                    sm: 6,
                    md: 4,
                    lg: 4,
                    xl: 4,
                  },
                  _containerGrid: {
                    spacing: { xs: 6, sm: 6, md: 6 },
                  },
                  default_img: '/images/image_ver.png',
                  _card: {
                    cardComponent: cardHideExplore,
                  },
                }}
                hasMoreData={false}
              />
            </Box>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

export default List;

export const cardHideExplore = (props: any) => (
  <CardComponent {...props} isExplore={false} />
);
export const CardComponent = ({
  item,
  default_img,
  handleCardClick,
  isExplore = true,
}: {
  item: any;
  default_img: any;
  handleCardClick: any;
  isExplore?: boolean;
}) => {
  console.log(item, 'shreays');

  const onClick = (id: string) => {
    if (handleCardClick) {
      handleCardClick(id);
    }
  };

  return (
    <Box
      onClick={() => onClick(item)}
      sx={{
        backgroundColor: '#fff',
        position: 'relative',
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out',
        boxShadow: '0 0.15rem 1.75rem 0 rgba(33, 40, 50, 0.15)',
        border: '1px solid rgba(0, 0, 0, .125)',
        borderRadius: '.25rem',
        '&:hover': {
          transform: 'scale(1.02)',
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
          padding: 3,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box sx={{ margin: '8px' }}>
          <img
            height={'200px'}
            src={item.posterImage || item.thumbnail || default_img}
            alt={item.name || item.title || 'Content'}
            style={{ width: '100%', objectFit: 'cover' }}
          />
        </Box>

        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#2C3E50',
            fontSize: '18px',
            letterSpacing: '1px',
            lineHeight: 1.2,
            mt: 2,
            mb: 2,
          }}
        >
          {item.name || item.title || 'Untitled'}
        </Typography>

        {/* Explore Button */}
        {isExplore && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              alignItems: 'center',
            }}
          >
            <Box sx={{ fontSize: '16px', color: '#363d47', fontWeight: 600 }}>
              Explore
            </Box>
            <Box>
              <img height={'20px'} src={'/images/arrow.png'} alt="arrow" />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};
