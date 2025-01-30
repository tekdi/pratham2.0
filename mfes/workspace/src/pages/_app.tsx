import { AppProps } from 'next/app';
import Head from 'next/head';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import '../styles/global.css';
import customTheme from '../styles/CustomTheme';

function CustomApp({ Component, pageProps }: AppProps) {
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
