// app/layout.tsx
import './global.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import MuiThemeProvider, {
  MuiThemeProviderWithLanguage,
} from '@learner/assets/theme/MuiThemeProvider';
import ClientLayout from './ClientLayout';
import GoogleAnalyticsTracker from '@learner/components/GoogleAnalyticsTracker/GoogleAnalyticsTracker';
import { FooterWrapper } from '@learner/components/Footer';
import ChunkReloadGuard from '@shared-lib-v2/lib/ChunkReloadGuard/ChunkReloadGuard';
import { siteConfig } from '@learner/utils/seo/siteConfig';
import { buildMetadata } from '@learner/utils/seo/buildMetadata';
import {
  organizationJsonLd,
  webSiteJsonLd,
} from '@learner/utils/seo/jsonLd';
import JsonLd from '@learner/components/seo/JsonLd';

export const metadata = {
  // metadataBase makes every relative OG/canonical URL absolute; without it
  // they resolved against localhost in production.
  ...(siteConfig.baseUrl ? { metadataBase: new URL(siteConfig.baseUrl) } : {}),
  ...buildMetadata(),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedState = localStorage.getItem('isColorInverted');
                  if (savedState !== null) {
                    const isInverted = JSON.parse(savedState);
                    if (isInverted) {
                      document.documentElement.style.filter = 'invert(1) hue-rotate(180deg)';
                      
                      // Add style for images/videos
                      const style = document.createElement('style');
                      style.id = 'color-inversion-style-initial';
                      style.textContent = \`
                        img, video, iframe, svg, canvas, embed, object {
                          filter: invert(1) hue-rotate(180deg) !important;
                        }
                        [data-no-invert], [data-no-invert] * {
                          filter: invert(1) hue-rotate(180deg) !important;
                        }
                      \`;
                      document.head.appendChild(style);
                    }
                  }
                } catch (e) {
                  // Handle any localStorage errors silently
                }
              })();
            `,
          }}
        />
      </head>
      <body>
          {siteConfig.baseUrl && (
            <JsonLd
              data={[
                organizationJsonLd(),
                webSiteJsonLd(
                  siteConfig.variant === 'pos' ? '/pos/search' : undefined
                ),
              ]}
            />
          )}
          <ChunkReloadGuard />
          <ClientLayout>

          <MuiThemeProviderWithLanguage>
                    <GoogleAnalyticsTracker />

            <MuiThemeProvider>{children}</MuiThemeProvider>
            <FooterWrapper />
          </MuiThemeProviderWithLanguage>
          <ToastContainer />
        </ClientLayout>
        
      </body>
    </html>
  );
}
