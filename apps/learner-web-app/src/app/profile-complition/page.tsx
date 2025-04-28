'use client';

import React, { useEffect, useState } from 'react';
//build issue fix for  ⨯ useSearchParams() should be wrapped in a suspense boundary at page
import { Suspense } from 'react';
import EditProfile from '@learner/components/EditProfile/EditProfile';
import { useSearchParams } from 'next/navigation';

type UserAccount = {
  name: string;
  username: string;
};
const ProfileComplitionPage = () => {
  const searchParams = useSearchParams();
  const isComplition = searchParams.get('isComplition');
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditProfile completeProfile={isComplition ? true : false} />
    </Suspense>
  );
};

export default ProfileComplitionPage;
