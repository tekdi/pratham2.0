import './global.css';
import { ReactNode } from 'react';
import { Metadata } from 'next';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';

export const metadata: Metadata = {
  title: 'Welcome to login',
  description: 'Generated by create-nx-workspace',
};

export default function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={params.locale}>
      <body>{children}</body>
    </html>
  );
}
