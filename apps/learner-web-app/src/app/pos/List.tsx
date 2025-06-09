'use client';
import LearnerCourse from '@learner/components/Content/LearnerCourse';
import Layout from '@learner/components/pos/Layout';
import { useGlobalData } from '@learner/components/Provider/GlobalProvider';
import { SUPPORTED_MIME_TYPES } from '@learner/utils/helper';
import { Grid } from '@mui/material';
import { ContentItem, Loader } from '@shared-lib';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const InfoCard = dynamic(() => import('@InfoCard'), {
  ssr: false,
});

export default function App({
  pagename,
  _infoCard,
  hideStaticFilter,
  _content,
}: Readonly<{
  _infoCard?: any;
  pagename?: any;
  hideStaticFilter?: boolean;
  _content?: any;
}>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    globalData: { filterFramework },
    loading,
  } = useGlobalData();
  const [item, setItem] = useState<any>({});
  const [staticFilter, setStaticFilter] = useState<any>({});

  useEffect(() => {
    if (
      !hideStaticFilter &&
      (pagename?.['SCP'] || pagename?.['Vocational Training'])
    ) {
      const program = searchParams?.get('program')?.split(',');
      setItem({
        ..._infoCard?.item,
        name: `Learning for ${pagename?.[program?.[0] || 'SCP']}`,
        description: _infoCard?.item?.description?.[program?.[0] || 'SCP'],
      });
      if (program?.includes('Vocational Training')) {
        setStaticFilter({
          program: program ?? [],
          se_domains: ['Learning for work'],
        });
      } else {
        setStaticFilter({
          program: program ?? [],
        });
      }
    } else if (!hideStaticFilter) {
      setStaticFilter({
        se_domains: [`Learning for ${pagename}`],
        ...(searchParams?.get('se_subDomains')?.split(',')
          ? {
              se_subDomains: searchParams?.get('se_subDomains')?.split(','),
            }
          : {}),
      });
      setItem(_infoCard?.item || {});
    }
  }, [hideStaticFilter, pagename, _infoCard?.item, searchParams]);

  const handleCardClickLocal = useCallback(
    async (content: ContentItem) => {
      try {
        if (SUPPORTED_MIME_TYPES.includes(content?.mimeType)) {
          router.push(
            `/pos/player/${content?.identifier}?activeLink=${window.location.pathname}`
          );
        } else {
          router.push(
            `/pos/content-details/${content?.identifier}?activeLink=${window.location.pathname}`
          );
        }
      } catch (error) {
        console.error('Failed to handle card click:', error);
      }
    },
    [router]
  );

  if (loading) return <Loader isLoading />;

  return (
    <Layout>
      <InfoCard
        item={{
          name: typeof pagename === 'string' ? `Learning for ${pagename}` : '',
          description:
            'Lorem ipsum dolor sit amet, consectetur dipiscing elit. Ut elit tellus, luctus nec llamcorper mattis, pulvinar dapibus leo. ullamcorper mattis, pulvinar dapibus leo.',
          ...(item || {}),
        }}
        _config={{
          ...(_infoCard?._config || {}),
          _infoCard: {
            default_img:
              typeof pagename === 'object'
                ? `/images/pos_program.jpg`
                : `/images/pos_${pagename?.toLowerCase()}.jpg`,
            isHideStatus: true,
            _textCard: { p: { md: '40px' } },
            _cardMedia: {
              maxHeight: { xs: '180px', sm: '200px', md: '250px' },
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '66px', // Adjust the height as needed
                background: 'linear-gradient(to top, white, transparent)',
              },
            },
            ...(_infoCard?._config?._infoCard || {}),
          },
        }}
      />
      <Grid container>
        <Grid item xs={12}>
          <LearnerCourse
            _content={{
              ..._content,
              filterFramework: filterFramework,
              _config: {
                userIdLocalstorageName: 'did',
                _card: {
                  isHideProgress: true,
                  isHideProgressStatus: true,
                  isWrap: true,
                  _cardMedia: { sx: { height: '153px' } },
                },
              },
              handleCardClick: handleCardClickLocal,
              staticFilter,
            }}
          />
        </Grid>
      </Grid>
    </Layout>
  );
}
