'use client';
import React from 'react';
import Layout from '../../components/Layout';
import { LayoutProps } from '@shared-lib';
import LearnerCourse from './LearnerCourse';

interface AppProps {
  _layout?: LayoutProps;
}

const MyComponent: React.FC<AppProps> = () => {
  return (
    <Layout>
      <LearnerCourse />
    </Layout>
  );
};

export default MyComponent;
