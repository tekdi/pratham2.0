import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const HomePage = () => {
  const router = useRouter();
  const path = process.env.NEXT_PUBLIC_TAXONOMY_MANAGER;
  useEffect(() => {
    router.push(path || '/'); // Replace with target page URL
  }, []);

  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('showHeader', 'true');
  }
  return <div>Redirecting...</div>;
};

export default HomePage;
