import React, { Suspense } from 'react';
import PartnerDetailsPage from '@learner/components/themantic/knowledgePartners/PartnerDetailsPage';

// The partner-specific title is set client-side once the API responds
export const metadata = {
  title: 'Experimento India',
};

const Page = ({ params }: any) => (
  <div className="thematic-page">
    <Suspense fallback={<div>Loading...</div>}>
      <PartnerDetailsPage partnerId={params?.partnerId} />
    </Suspense>
  </div>
);

export default Page;
