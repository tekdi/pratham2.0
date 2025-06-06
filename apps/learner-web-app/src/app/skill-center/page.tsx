'use client';
import React, { useState } from 'react';
import { gredientStyle } from '@learner/utils/style';
import Layout from '@learner/components/Layout';
import { Box } from '@mui/material';
import SkillCenter from '@learner/components/SkillCenter/SkillCenter';

const SkillCenterPage = () => {
  const [visibleCenters, setVisibleCenters] = useState<any>([]);

  return (
    <Layout sx={gredientStyle}>
      <Box sx={{ py: 2 }}>
        <SkillCenter
          title={'Skilling Centers'}
          isNavigateBack={true}
          isPadding={true}
          viewAll={true}
          visibleCenters={visibleCenters}
          setVisibleCenters={setVisibleCenters}
          hideFilter={false}
        />
      </Box>
    </Layout>
  );
};

export default SkillCenterPage;
