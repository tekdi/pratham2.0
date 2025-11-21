'use client';

import React, { useEffect, useState } from 'react';
//build issue fix for  ⨯ useSearchParams() should be wrapped in a suspense boundary at page
import { Suspense } from 'react';
import RegisterUser from './RegisterUser';
import Layout from '../../components/Layout';
import Header from '@learner/components/Header/Header';
import RegisterationFlow from './RegisterationFlow';

type UserAccount = {
  name: string;
  username: string;
};
const registrationPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterationFlow />
    </Suspense>
  );
};

export default registrationPage;
