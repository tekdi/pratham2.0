'use client';
import ContentEnroll from '@content-mfes/components/Content/ContentEnroll';
import Layout from '../layout/Layout';
import SubHeader from '../subHeader/SubHeader';

const ContentDetailsPage = () => {
  return (
    <Layout>
      <SubHeader showFilter={false} />
      <ContentEnroll
        isShowLayout={false}
        _config={{
          contentBaseUrl: '/themantic',
          isEnrollmentRequired: false,
          default_img: '/images/image_ver.png',
          _infoCard: { _cardMedia: { maxHeight: '280px' } },
        }}
      />
    </Layout>
  );
};

export default ContentDetailsPage;
