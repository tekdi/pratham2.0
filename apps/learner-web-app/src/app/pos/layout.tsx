import 'react-toastify/dist/ReactToastify.css';
import POSMuiThemeProvider from '@learner/assets/theme/POSMuiThemeProvider';
import { GlobalProvider } from '@learner/components/Provider/GlobalProvider';
import GoogleAnalyticsTracker from '@learner/components/GoogleAnalyticsTracker/GoogleAnalyticsTracker';

// No metadata export here: each page builds its own via buildMetadata(), so a
// layout-level default would only supply wrong canonical URLs.

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
