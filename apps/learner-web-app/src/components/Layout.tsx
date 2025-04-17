'use client';

import React from 'react';
import { LayoutProps, Layout } from '@shared-lib';
import { AccountBox, Explore, Home, Summarize } from '@mui/icons-material';

const defaultNavLinks = [
  {
    title: 'L1 Courses',
    icon: Home,
    to: console.log,
    isActive: true,
  },
  {
    title: 'Explore',
    icon: Explore,
    to: console.log,
  },
  {
    title: 'Surveys',
    icon: Summarize,
    to: console.log,
  },
  {
    title: 'Profile',
    icon: AccountBox,
    to: console.log,
  },
];
const App: React.FC<LayoutProps> = ({ children, ...props }) => {
  return (
    <Layout
      onlyHideElements={['footer']}
      _topAppBar={{ navLinks: defaultNavLinks, _navLinkBox: { gap: 5 } }}
      {...props}
    >
      {children}
    </Layout>
  );
};

export default App;
