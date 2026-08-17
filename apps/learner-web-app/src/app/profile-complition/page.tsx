'use client';

import React, { Suspense } from 'react';
import EditProfile from '@learner/components/EditProfile/EditProfile';
import { useSearchParams } from 'next/navigation';

const ProfileComplitionInner = () => {
  const searchParams = useSearchParams();
  const isComplition = searchParams.get('isComplition');
  // The Android app opens this route with screen=edit | screen=complete. Web never sends it,
  // so when `screen` is absent the existing isComplition behaviour is unchanged.
  const screen = searchParams.get('screen');
  const completeProfile = screen
    ? screen === 'complete'
    : Boolean(isComplition);
  return <EditProfile completeProfile={completeProfile} />;
};

const ProfileComplitionPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileComplitionInner />
    </Suspense>
  );
};

export default ProfileComplitionPage;
