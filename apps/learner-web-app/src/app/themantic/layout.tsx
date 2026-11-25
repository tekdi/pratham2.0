import React from 'react';
import './themantic.css';
import ThematicMuiThemeProvider, {
  ThematicMuiThemeProviderWithLanguage,
} from './theme/ThematicMuiThemeProvider';
import GoogleAnalyticsTracker from '@learner/components/GoogleAnalyticsTracker/GoogleAnalyticsTracker';

// Fallback for Experimento pages that define no metadata of their own. Deliberately
// sets no canonical: child pages must declare their own, or they would all claim this one.
const SITE_NAME = 'Experimento India';
const FALLBACK_DESCRIPTION =
  'Experimento India is a part of Project Jigyaasa. Free hands-on science courses on energy, environment and health.';
const FALLBACK_IMAGE =
  'https://experimentoindia.prathamopenschool.org/images/image_ver.png';

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
    images: [{ url: FALLBACK_IMAGE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: FALLBACK_DESCRIPTION,
    images: [FALLBACK_IMAGE],
  },
};

export default function ThematicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThematicMuiThemeProviderWithLanguage>
      <GoogleAnalyticsTracker />
      <ThematicMuiThemeProvider>{children}</ThematicMuiThemeProvider>
    </ThematicMuiThemeProviderWithLanguage>
  );
}
