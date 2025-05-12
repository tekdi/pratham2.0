// app/layout.tsx
import './global.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { MuiThemeProviderWithLanguage } from '@learner/assets/theme/MuiThemeProvider';

export const metadata = {
  title: 'Welcome to learner-web-app',
  description:
    'Learner web app is a platform for users to learn and grow by consuming educational content',
  openGraph: {
    title: 'Welcome to learner-web-app',
    description:
      'Learner web app is a platform for users to learn and grow by consuming educational content',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`,
        width: 800,
        height: 600,
      },
    ],
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <MuiThemeProviderWithLanguage>{children}</MuiThemeProviderWithLanguage>
        <ToastContainer />
      </body>
    </html>
  );
}
