'use client';
import LearnerCourse from '@learner/components/Content/LearnerCourse';
import Layout from '@learner/components/pos/Layout';
import { Grid } from '@mui/material';
import { ContentItem } from '@shared-lib';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

const SUPPORTED_MIME_TYPES = [
  'application/vnd.ekstep.ecml-archive',
  'application/vnd.ekstep.html-archive',
  'application/vnd.ekstep.h5p-archive',
  'application/pdf',
  'video/mp4',
  'video/webm',
  'application/epub',
  'video/x-youtube',
  'application/vnd.sunbird.questionset',
];
const InfoCard = dynamic(() => import('@InfoCard'), {
  ssr: false,
});
export default function PosSchoolsPage() {
  const router = useRouter();
  const handleCardClickLocal = useCallback(
    async (content: ContentItem) => {
      try {
        if (SUPPORTED_MIME_TYPES.includes(content?.mimeType)) {
          return null;
        } else {
          router.push(`/pos/content/${content?.identifier}`);
        }
      } catch (error) {
        console.error('Failed to handle card click:', error);
      }
    },
    [router]
  );
  return (
    <Layout>
      <InfoCard
        item={{
          name: 'Learning for School',
          description:
            'Lorem ipsum dolor sit amet, consectetur dipiscing elit. Ut elit tellus, luctus nec llamcorper mattis, pulvinar dapibus leo. ullamcorper mattis, pulvinar dapibus leo.',
        }}
        _config={{
          default_img: '/images/pos_shool.jpg',
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
              handleCardClick: handleCardClickLocal,
              staticFilter: { se_domains: ['Learning for School'] },
            }}
          />
        </Grid>
      </Grid>
    </Layout>
  );
}
