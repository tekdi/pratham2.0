'use client';
import React, { useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Layout from './layout/Layout';
import { Box, Container, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import { SearchButton } from './SearchButton';
import { debounce } from 'lodash';
import SpeakableText from '@shared-lib-v2/lib/textToSpeech/SpeakableText';
import SubHeader from './subHeader/SubHeader';
import { CardComponent } from './content/List';
import BreadCrumb from '@content-mfes/components/BreadCrumb';

const Content = dynamic(() => import('@Content'), {
  ssr: false,
});

const SearchPage = () => {
  const [searchValue, setSearchValue] = React.useState('');
  const [submitText, setSubmitText] = React.useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

  React.useEffect(() => {
    const queryParam = searchParams?.get('q') || '';
    setSearchValue(queryParam);
    setSubmitText(queryParam);
  }, [searchParams]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const onSearch = useCallback(
    (value: string) => {
      if (value) {
        router.push('/themantic/search?q=' + encodeURIComponent(value));
      } else {
        router.push('/themantic/search');
      }
      setSubmitText(value);
    },
    [router]
  );

  const contentApp = useMemo(
    () => (
      <Box className='bs-container bs-px-5'>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <BreadCrumb
            breadCrumbs={[
              { label: 'Home', link: '/themantic' },
              { label: 'Search', link: '/themantic/search' },
            ]}
            isShowLastLink
            customPlayerStyle={true}
            customPlayerMarginTop={0}
          />
        </Box>
        <Box
          sx={{
            '& .css-17kujh3': {
              overflowY: 'unset !important',
            },
          }}
        >
          <Box sx={{ mt: 3 }}>
            <Content
              filters={{
                query: submitText,
                filters: {
                  program: 'Experimento India',
                },
              }}
              contentTabs={['content']}
              isShowLayout={false}
              showFilter={false}
              showSearch={false}
              showHelpDesk={false}
              _config={{
                contentBaseUrl: '/themantic',
                _tabs: { variant: 'fullWidth' },
                _card: {
                  isHideProgressStatus: true,
                  isWrap: true,
                  _cardMedia: { sx: { height: '153px' } },
                  cardComponent: CardComponent,
                },
                default_img: '/images/image_ver.png',
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
                noDataText: 'No matching results found.',
                _noData: {
                  sx: {
                    textAlign: 'left',
                    fontSize: '28px',
                    fontWeight: 700,
                    display: 'flex',
                    justifyContent: 'start',
                    minHeight: '5px',
                  },
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    ),
    [submitText]
  );

  return (
    <Layout sx={{ backgroundImage: 'url(/images/mainpagebig.png)' }}>
      <SubHeader showFilter={false} />
      <Box sx={{ p: 4 }}>{contentApp}</Box>
    </Layout>
  );
};

export default SearchPage;
