import 'react-toastify/dist/ReactToastify.css';
import POSMuiThemeProvider from '@learner/assets/theme/POSMuiThemeProvider';
import { GlobalProvider } from '@learner/components/Provider/GlobalProvider';
import GoogleAnalyticsTracker from '@learner/components/GoogleAnalyticsTracker/GoogleAnalyticsTracker';

// Fallback for POS pages that define no metadata of their own. Deliberately sets
// no canonical: child pages must declare their own, or they would all claim this one.
const SITE_NAME = 'Pratham Open School';
const FALLBACK_DESCRIPTION =
  'Pratham Open School offers free, downloadable videos, games, reading material and stories in 15 languages for ages 1 to 18+, designed to support self-led learning and group learning through activities and projects.';

export const metadata = {
  title: SITE_NAME,
  description: FALLBACK_DESCRIPTION,
  openGraph: {
    title: SITE_NAME,
    description: FALLBACK_DESCRIPTION,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_IN',
    // Absolute: social crawlers cannot resolve a relative path.
    images: [
      { url: 'https://www.prathamopenschool.org/images/home-page-banner.png' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: FALLBACK_DESCRIPTION,
    images: ['https://www.prathamopenschool.org/images/home-page-banner.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <GlobalProvider>
      <POSMuiThemeProvider>
        <GoogleAnalyticsTracker />
        {children}
      </POSMuiThemeProvider>
    </GlobalProvider>
  );
}
