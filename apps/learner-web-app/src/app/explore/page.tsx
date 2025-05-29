'use client';
import React from 'react';
import Layout from '@learner/components/Layout';
import LearnerCourse from '@learner/components/Content/LearnerCourse';
import SkillCenter from '@learner/components/SkillCenter/SkillCenter';
import { gredientStyle } from '@learner/utils/style';
import { Box } from '@mui/material';

const App = () => {
  return (
    <Layout sx={gredientStyle}>
      <LearnerCourse
        title={'LEARNER_APP.EXPLORE.EXPLORE_ADDITIONAL_COURSES'}
        _content={{
          onlyFields: ['contentLanguage', 'se_subDomains', 'se_subjects'],
          isOpenColapsed: ['contentLanguage', 'se_subDomains', 'se_subjects'],
          contentTabs: ['courses', 'content'],
        }}
      />
      <Box
        sx={{
          background: '#fff',
          py: 2,
        }}
      >
        <SkillCenter
          viewAll={false}
          Limit={3}
          title={'Skilling Center Near You'}
        />
      </Box>
    </Layout>
  );
};

export default App;
