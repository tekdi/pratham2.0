'use client';
import LearnerCourse from '@learner/components/Content/LearnerCourse';
import Layout from '@learner/components/pos/Layout';
import { Grid } from '@mui/material';
import dynamic from 'next/dynamic';

const InfoCard = dynamic(() => import('@InfoCard'), {
  ssr: false,
});
export default function PosSchoolsPage() {
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
            _content={{ staticFilter: { se_domains: ['Learning for School'] } }}
          />
        </Grid>
      </Grid>
    </Layout>
  );
}
