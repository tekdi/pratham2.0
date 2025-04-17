import './global.css';
import { ReactNode } from 'react';
import { Metadata } from 'next';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import customTheme from '../styles/customTheme';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

export const metadata: Metadata = {
  title: 'Welcome to forget password',
  description: 'Generated by create-nx-workspace',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
