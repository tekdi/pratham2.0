'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import Header from '@learner/components/Header/Header';
const HomePage = () => {
  return (
    <Box
      height="100vh"
      width="100vw"
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      <Header />
    </Box>
  );
};

export default HomePage;
