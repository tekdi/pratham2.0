import { AppProps } from 'next/app';
import Head from 'next/head';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import '../styles/global.css';
import customTheme from '../styles/CustomTheme';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function CustomApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const loginUrl: any = process.env.NEXT_PUBLIC_ADMIN_LOGIN_URL;
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && router.pathname !== '/login') {
      window.location.href = loginUrl;
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>Welcome to workspace!</title>
      </Head>
      <main className="app">
        <CssVarsProvider theme={customTheme}>
          <Component {...pageProps} />
        </CssVarsProvider>
      </main>
    </>
  );
}

export default CustomApp;
