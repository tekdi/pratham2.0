'use client';
import React from 'react';
import Layout from '@learner/components/Layout';
import LearnerCourse from '@learner/components/Content/LearnerCourse';
import SkillCenter from '@learner/components/SkillCenter/SkillCenter';
import { gredientStyle } from '@learner/utils/style';

const App = () => {
  return (
    <Layout sx={gredientStyle}>
      <LearnerCourse
        _content={{
          contentTabs: ['courses', 'content'],
          title: 'LEARNER_APP.EXPLORE.EXPLORE_ADDITIONAL_COURSES',
        }}
      />
      <SkillCenter viewAll={true} Limit={3} title={"Skilling Center Near You"} />
    </Layout>
  );
};

export default App;
