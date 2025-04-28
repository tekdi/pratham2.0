'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import Header from '@learner/components/Header/Header';
import UserProfileCard from '@learner/components/UserProfileCard/UserProfileCard';
import Layout from '../../components/Layout';
const ProfilePage = () => {
  return (
    <Layout>
      {/* <Header /> */}
      <UserProfileCard />
    </Layout>
  );
};

export default ProfilePage;
