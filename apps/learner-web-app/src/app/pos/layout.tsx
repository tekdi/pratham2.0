import 'react-toastify/dist/ReactToastify.css';
import POSMuiThemeProvider from '@learner/assets/theme/POSMuiThemeProvider';
import { GlobalProvider } from '@learner/components/Provider/GlobalProvider';

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
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <GlobalProvider>
      <POSMuiThemeProvider>{children}</POSMuiThemeProvider>
    </GlobalProvider>
  );
}
