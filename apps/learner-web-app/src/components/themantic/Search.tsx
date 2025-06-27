'use client';
import React, { useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Layout from './layout/Layout';
import { Box, Container, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import { SearchButton } from './SearchButton';
import { debounce } from 'lodash';
import SpeakableText from '@shared-lib-v2/lib/textToSpeech/SpeakableText';
import SubHeader from './subHeader/SubHeader';

const Content = dynamic(() => import('@Content'), {
  ssr: false,
});

const SearchPage = () => {
  const [searchValue, setSearchValue] = React.useState('');
  const [submitText, setSubmitText] = React.useState('');
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const queryParam = searchParams?.get('q') || '';
    setSearchValue(queryParam);
    setSubmitText(queryParam);
  }, [searchParams]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const onSearch = useCallback((value: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('q', value);
    window.history.replaceState({}, '', url.toString());
    setSubmitText(value);
  }, []);

  const contentApp = useMemo(
    () => (
      <Container maxWidth="lg">
        <Content
          filters={{
            query: submitText,
          }}
          contentTabs={['content']}
          isShowLayout={false}
          showFilter={false}
          showSearch={false}
          showHelpDesk={false}
          _config={{
            contentBaseUrl: '/pos',
            _tabs: { variant: 'fullWidth' },
            _card: {
              isHideProgressStatus: true,
              isWrap: true,
              _cardMedia: { sx: { height: '153px' } },
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
          }}
        />
      </Container>
    ),
    [submitText]
  );

  return (
    <Layout sx={{ backgroundImage: 'url(/images/energy-background.png)' }}>
      <SubHeader showFilter={false} />
      <Box sx={{ p: 4 }}>{contentApp}</Box>
    </Layout>
  );
};

export default SearchPage;
