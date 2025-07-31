import React from 'react';
import './themantic.css';
import ThematicMuiThemeProvider, {
  ThematicMuiThemeProviderWithLanguage,
} from './theme/ThematicMuiThemeProvider';
import GoogleAnalyticsTracker from '@learner/components/GoogleAnalyticsTracker/GoogleAnalyticsTracker';

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
