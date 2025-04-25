'use client';

import React, { useEffect, useState } from 'react';
type UserAccount = {
  name: string;
  username: string;
};

//build issue fix for  ⨯ useSearchParams() should be wrapped in a suspense boundary at page
import { Suspense } from 'react';
import AccountSelection from './AccountSelection';

const AccountSelectionPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccountSelection />
    </Suspense>
  );
};

export default AccountSelectionPage;
