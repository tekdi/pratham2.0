'use client';

import React from 'react';
import Footer from '../footer/Footer';
import Header from '../header/Header';
import AccessibilityOptions from '../../AccessibilityOptions/AccessibilityOptions';

function Layout({ children, sx }: { children: React.ReactNode; sx?: any }) {
  return (
    <div style={sx}>
      <Header />
      <AccessibilityOptions />
      {children}
      <Footer />
    </div>
  );
}

export default Layout;
