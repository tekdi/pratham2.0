import dynamic from 'next/dynamic';

import Header from '@/components/Header';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const ReloadPage: React.FC = () => {
  const router = useRouter();

  router.back();

  return <h1>Reload</h1>;
};

// export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
//   return {
//     paths: [], //indicates that no page needs be created at build time
//     fallback: 'blocking', //indicates the type of fallback
//   };
// };

export default ReloadPage;
