import 'react-toastify/dist/ReactToastify.css';
import POSMuiThemeProvider from '@learner/assets/theme/POSMuiThemeProvider';
import { GlobalProvider } from '@learner/components/Provider/GlobalProvider';
import { absoluteImage } from '@learner/utils/seo';

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
        url: absoluteImage('/logo.png'),
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
    // The root layout already mounts GoogleAnalyticsTracker, and it wraps this
    // one; a second instance sent a duplicate page_view on every POS navigation.
    <GlobalProvider>
      <POSMuiThemeProvider>{children}</POSMuiThemeProvider>
    </GlobalProvider>
  );
}
