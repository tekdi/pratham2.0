'use client';
import LearnerCourse from '@learner/components/Content/LearnerCourse';
import Layout from '@learner/components/pos/Layout';
import { useGlobalData } from '@learner/components/Provider/GlobalProvider';
import { SUPPORTED_MIME_TYPES } from '@learner/utils/helper';
import { Height } from '@mui/icons-material';
import { Grid } from '@mui/material';
import { ContentItem, Loader } from '@shared-lib';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

const InfoCard = dynamic(() => import('@InfoCard'), {
  ssr: false,
});

export default function App({ pagename }: { pagename: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    globalData: { filterFramework },
    loading,
  } = useGlobalData();

  const handleCardClickLocal = useCallback(
    async (content: ContentItem) => {
      try {
        if (SUPPORTED_MIME_TYPES.includes(content?.mimeType)) {
          return null;
        } else {
          router.push(`/pos/content-details/${content?.identifier}`);
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
          name: `Learning for ${pagename}`,
          description:
            'Lorem ipsum dolor sit amet, consectetur dipiscing elit. Ut elit tellus, luctus nec llamcorper mattis, pulvinar dapibus leo. ullamcorper mattis, pulvinar dapibus leo.',
        }}
        _config={{
          default_img: `/images/pos_${pagename?.toLowerCase()}.jpg`,
          _infoCard: {
            isHideStatus: true,
            _textCard: { p: '40px' },
            _cardMedia: { maxHeight: '250px' },
            _card: {
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
          },
        }}
      />
      <Grid container>
        <Grid item xs={12}>
          <LearnerCourse
            _content={{
              filterFramework: filterFramework,
              _config: {
                userIdLocalstorageName: 'did',
                _card: {
                  isHideProgress: true,
                  isWrap: true,
                  _cardMedia: { sx: { height: '153px' } },
                },
              },
              handleCardClick: handleCardClickLocal,
              staticFilter: {
                se_domains: [`Learning for ${pagename}`],
                ...(searchParams?.get('se_subDomains')?.split(',')
                  ? {
                      se_subDomains: searchParams
                        ?.get('se_subDomains')
                        ?.split(','),
                    }
                  : {}),
              },
            }}
          />
        </Grid>
      </Grid>
    </Layout>
  );
}
