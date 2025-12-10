'use client';

import React, { Suspense, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Box,
  Typography,
  Divider,
  Tooltip,
} from '@mui/material';
import Layout from '../layout/Layout';
import SubHeader from '../subHeader/SubHeader';
import { usePageViewCount } from '@learner/hooks/usePageViewCount';
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();
 const { pageViews, loading, error } = usePageViewCount(pathname);

  const [totalCount, setTotalCount] = useState<number>(0);
  const [selectedFilter, setSelectedFilter] = useState<any>('');

  // Load selectedFilter from localStorage on component mount
  useEffect(() => {
    const savedFilter = localStorage.getItem('selectedFilter');
    if (savedFilter) {
      setSelectedFilter(savedFilter);
    }
  }, []);

  const handleTotalCountChange = (count: number) => {
    setTotalCount(count);
  };

  // Update localStorage when selectedFilter changes
  const handleFilterChange = (filter: any) => {
    setSelectedFilter(filter);
    localStorage.setItem('selectedFilter', filter);
  };

  console.log(selectedFilter, 'selectedFilter');

  return (
    <Layout>
      <SubHeader
        showFilter={true}
        resourceCount={totalCount}
        getFilter={(e) => handleFilterChange(e)}
      />
      <Box
        sx={{
          backgroundImage: `url('/images/mainpagebig.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          // px: { xs: 2, md: 4 },
          py: '48px',
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
              <Box className='bs-container bs-px-5'>
                <Box
                  sx={{
                    '& .css-17kujh3': {
                      overflowY: 'unset !important',
                    },

                  }}
                >
                  <Content
                    key={`course-${selectedFilter}`}
                    isShowLayout={false}
                    contentTabs={['Course']}
                    pageName="Course"
                    onTotalCountChange={handleTotalCountChange}
                    filters={{
                      limit: 4,
                      filters: {
                        program: 'Experimento India',
                        contentLanguage: [selectedFilter || 'English'],
                      },
                    }}
                    _config={{
                      contentBaseUrl: '/themantic',
                      _grid: {
                        xs: 12,
                        sm: 6,
                        md: 3,
                        lg: 3,
                        xl: 3,
                      },
                      _containerGrid: {
                        spacing: { xs: 2, sm: 2, md: 3 },
                      },
                      default_img: '/images/image_ver.png',
                      _card: {
                        cardComponent: mainCourseCard,
                      },
                    }}
                    hasMoreData={false}
                  />
                
                </Box>
              </Box>
            </Suspense>
          </div>
        </div>
        <Box className='bs-container bs-px-5' sx={{ mt: 8 }}>
          <Box
            sx={{
              backgroundColor: '#fff',
              padding: 3.5,
              position: 'relative',
              zIndex: 1000,
              borderRadius: '0px 6px 6px 6px',
              mt: '110px',
              '& .css-17kujh3': {
                overflowY: 'unset !important',
              },
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
                top: '-46px',
                left: 0,
                p: 1,
                border: '1px solid white',
                borderTopLeftRadius: '0.25rem',
                borderTopRightRadius: '0.25rem',
              }}
            >
              <Typography
                sx={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#000',
                }}
              >
                New Arrivals
              </Typography>
            </Box>
            <Box
              sx={{
                position: 'relative',
                '& .css-4oqe9z': {
                  display: 'none !important',
                  marginBottom: '0 !important',
                },
                '& .css-17kujh3': {
                  overflowY: 'unset !important',
                },
                '& .swiper': {
                  paddingBottom: '20px',
                },
                '& .swiper-slide': {
                  height: 'auto',
                },
              }}
            >
              <Content
                key={`content-${selectedFilter}`}
                isShowLayout={false}
                contentTabs={['content']}
                pageName="content"
                onTotalCountChange={handleTotalCountChange}
                filters={{
                  limit: 8,
                  sort_by: { lastUpdatedOn: 'desc' },
                  filters: {
                    program: 'Experimento India',
                    contentLanguage: [selectedFilter || 'English'],
                  },
                }}
                _config={{
                  contentBaseUrl: '/themantic',
                  isShowInCarousel: true,
                  isHideNavigation: false,
                  _subBox: {
                    sx: {
                      position: 'relative',
                      px: { xs: 0, md: 4 },
                    },
                  },
                  _carousel: {
                    slidesPerView: 1,
                    autoplay: {
                      delay: 3000,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true,
                    },
                    loop: true,
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
        {pageViews && <Box sx={{ 
          fontSize: '16px', 
          color: '#363d47', 
          fontWeight: 500, 
          textAlign: 'center', 
          mt: 4, 
          p: 2, 
          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
          borderRadius: '8px',
          width: 'fit-content',
          mx: 'auto'
        }}>
         Total Visitors: {pageViews}
        </Box>}
        </Box>
      </Box>
    </Layout>
  );
};

export default List;

export const mainCourseCard = (props: any) => (
  <CardComponent
    {...props}
    titleFontSize="16px"
    fontWeight={600}
    minHeight="286px"
    isExplore={false}
    textTransform="uppercase"
    titleColor="black"
    maxTitleLines={1}
  />
);

export const cardHideExplore = (props: any) => (
  <CardComponent
    {...props}
    titleFontSize="16px"
    isExplore={false}
    minHeight="286px"
    textTransform="uppercase"
    fontWeight={600}
    titleColor="black"
    maxTitleLines={2}
  />
);
export const CardComponent = ({
  item,
  default_img,
  handleCardClick,
  isExplore = true,
  titleFontSize,
  fontWeight,
  minHeight,
  textTransform,
  titleColor,
  _card,
  englishTitle,
  maxTitleLines = 2,
}: {
  item: any;
  default_img: any;
  handleCardClick: any;
  isExplore?: boolean;
  titleFontSize?: string;
  fontWeight?: number;
  minHeight?: string;
  textTransform?: string;
  titleColor?: string;
  _card?: any;
  englishTitle?: string;
  maxTitleLines?: number;
}) => {
  // Extract styling props from _card object if they exist
  const finalTitleFontSize = titleFontSize || _card?.titleFontSize;
  const finalFontWeight = fontWeight || _card?.fontWeight;
  const finalMinHeight = minHeight || _card?.minHeight;
  const finalTextTransform = textTransform || _card?.textTransform;
  const finalTitleColor = titleColor || _card?.titleColor;
  const finalMaxTitleLines = maxTitleLines || _card?.maxTitleLines || 2;
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
        minHeight: finalMinHeight || '317px',
        borderRadius: '.25rem',
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
        <Box sx={{ margin: '8px' }}>
          <img
            height={'200px'}
            src={
              item.posterImage || item.appIcon || item.thumbnail || default_img
            }
            alt={item.name || item.title || 'Content'}
            style={{ width: '100%', objectFit: 'cover' }}
          />
        </Box>

        {/* Title */}
        <Tooltip title={item.name || item.title || 'Untitled'} arrow>
          <Typography
            variant="h6"
            sx={{
              fontWeight: finalFontWeight || 400,
              textAlign: 'center',
              fontSize: finalTitleFontSize || '16px',
              letterSpacing: '1px',
              mt: 0.3,
              mb: 0.3,
              display: '-webkit-box',
              WebkitLineClamp: finalMaxTitleLines,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: finalTitleColor || '#212529',
              px: '16px',
              textTransform: finalTextTransform || 'uppercase',
              minHeight: finalMaxTitleLines === 1 ? '28px' : '42px',
              wordBreak: 'break-word',
            }}
          >
            {item.name || item.title || 'Untitled'}
          </Typography>
        </Tooltip>

        <Tooltip title={englishTitle || ''} arrow>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 500,
              textAlign: 'center',
              // fontSize: '14px',
              letterSpacing: '0.5px',
              display: '-webkit-box',
              WebkitLineClamp: finalMaxTitleLines,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: finalTitleColor || '#212529',
              px: '16px',
              textTransform: 'capitalize',
              wordBreak: 'break-word',
              mb: 2,
              minHeight: finalMaxTitleLines === 1 ? '28px' : '42px',
              visibility: englishTitle ? 'visible' : 'hidden',
            }}
          >
            {englishTitle || 'Placeholder'}
          </Typography>
        </Tooltip>

        {/* Explore Button */}

        {isExplore && (
          <>
            <Divider
              sx={{
                mt: 2,
                mb: 2,
                width: '100%',
                borderColor: '#e0e0e0',
                borderWidth: '1px',
              }}
              variant="fullWidth"
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'center',
                px: 2,
                pb: 2,
              }}
            >
              <Box sx={{ fontSize: '18px', color: '#363d47', fontWeight: 500 }}>
                Explore
              </Box>
              <Box>
                <img height={'20px'} src={'/images/arrow.png'} alt="arrow" />
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};
