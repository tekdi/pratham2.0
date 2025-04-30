'use client';
import React from 'react';
import Layout from '@learner/components/Layout';
import LearnerCourse from '@learner/components/Content/LearnerCourse';
import SkillCenter from '@learner/components/SkillCenter/SkillCenter';

const App = () => {
  return (
    <Layout>
      <LearnerCourse
        _content={{
          contentTabs: ['courses', 'content'],
          title: 'LEARNER_APP.EXPLORE.EXPLORE_ADDITIONAL_COURSES',
        }}
      />
      <SkillCenter/>
    </Layout>
  );
};

export default App;
