'use client';
import React from 'react';
import Layout from '../../components/Layout';
import LearnerCourse from '../content/LearnerCourse';

const App = () => {
  return (
    <Layout>
      <LearnerCourse
        _content={{
          contentTabs: ['courses', 'content'],
          title: 'LEARNER_APP.EXPLORE.EXPLORE_ADDITIONAL_COURSES',
        }}
      />
    </Layout>
  );
};

export default App;
