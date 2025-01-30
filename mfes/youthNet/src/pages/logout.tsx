import dynamic from 'next/dynamic';
import React from 'react';

const Logout = dynamic(() => import('@logout'), {
  ssr: false,
});

const logout = () => {
  const handleLogoutSuccess = (response: string) => {
    console.log(response);
  };

  return <Logout onLogoutSuccess={handleLogoutSuccess} />;
};

export default logout;
