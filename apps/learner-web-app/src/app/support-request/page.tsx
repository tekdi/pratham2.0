'use client';
import Header from '../../components/Header/Header';
import AppScriptEmbed from '../../components/AppScriptEmbed/AppScriptEmbed';
import Loader from '../../components/Loader/Loader';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import Layout from '../../components/Layout';
import { useEffect, useState } from 'react';
import { supportRequestAppScriptUrl } from '../../../app.config';
import { useDirection } from '../../utils/hooks/useDirection';
import { useTranslation } from '@shared-lib';

type QueryParams = {
  t?: string;
  deviceInfo?: string;
};

const SupportRequest = () => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const { isRTL } = useDirection();
  const [queryParams, setQueryParams] = useState<QueryParams | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return;
      }

      const {
        userAgent,
        language,
        platform,
        cookieEnabled,
        onLine,
        hardwareConcurrency,
      } = navigator;
      const screenResolution = `${window.screen.width}x${window.screen.height}`;
      const viewportSize = `${window.innerWidth}x${window.innerHeight}`;
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const screenOrientation = screen.orientation?.type || 'Unknown';
      const referrer = window.location.origin;

      // Detect device type
      const deviceType = /Mobile|Android|iPhone|iPad/i.test(userAgent)
        ? 'Mobile'
        : /Tablet/i.test(userAgent)
        ? 'Tablet'
        : 'Desktop';

      // Extract browser name and version
      const browserMatch =
        userAgent.match(
          /(firefox|msie|trident|chrome|safari|edge|opr|edg(?=\/))\/?\s*(\d+)/i
        ) || [];
      const browser = browserMatch[1] || 'Unknown';
      const browserVersion = browserMatch[2] || 'Unknown';

      // Access deviceMemory safely
      const deviceMemory = (navigator as any).deviceMemory || 'Unknown';

      // Format the device-related data into a string
      const deviceInfo = `
        Browser: ${browser} ${browserVersion}
        OS: ${platform}
        Screen Resolution: ${screenResolution}
        Language: ${language}
        Cookies Enabled: ${cookieEnabled}
        Online Status: ${onLine ? 'Online' : 'Offline'}
        Device Type: ${deviceType}
        Hardware Concurrency: ${hardwareConcurrency || 'Unknown'}
        Device Memory: ${deviceMemory}
        Time Zone: ${timeZone}
        Screen Orientation: ${screenOrientation}
        Viewport Size: ${viewportSize}
        Referrer: ${referrer}
      `.trim();

      // Identity is minted server-side from /user/auth, so a value edited in
      // the browser can no longer decide who the support desk thinks you are.
      try {
        const authToken = localStorage.getItem('token');
        if (!authToken) {
          setFailed(true);
          return;
        }
        const response = await fetch('/api/support-token', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tenantId: localStorage.getItem('tenantId') || '',
            academicYearId: localStorage.getItem('academicYearId') || '',
            // ?src=android when opened from the mobile app's web view.
            src: new URLSearchParams(window.location.search).get('src') || '',
          }),
        });
        if (!response.ok) {
          setFailed(true);
          return;
        }
        const { token } = await response.json();
        if (!token) {
          setFailed(true);
          return;
        }
        setQueryParams({ t: token, deviceInfo });
      } catch (error) {
        console.error('Unable to start the support desk session', error);
        setFailed(true);
      }
    };

    run();
  }, []);

  return (
    <>
       <Layout>
      <Box display={'flex'} sx={{ marginBottom: '1.2rem' }}>
        <Box
          onClick={() => {
            window.history.back();
          }}
          ml={'1rem'}
          mb={0}
        >
          <KeyboardBackspaceOutlinedIcon
            cursor={'pointer'}
            sx={{
              color: theme.palette.warning['A200'],
              transform: isRTL ? ' rotate(180deg)' : 'unset',
            }}
          />
        </Box>
        <Box ml={'0.3rem'}>
          <Typography mt={0} variant="h2" color="black">
            {t('COMMON.WE_ARE_HERE_TO_HELP')}
          </Typography>
          <Typography mt={4} variant="h5" marginY={'0.2rem'}>
            {t('COMMON.SUBMIT_YOUR_REQUEST_FOR_ISSUES')}
          </Typography>
        </Box>
      </Box>
      <Box>
        {failed ? (
          <Typography variant="h5" sx={{ p: '1rem' }}>
            {t('COMMON.SUPPORT_DESK_UNAVAILABLE')}
          </Typography>
        ) : queryParams ? (
          // Mounted only once the pass exists, so the iframe loads once.
          <AppScriptEmbed
            scriptUrl={supportRequestAppScriptUrl}
            queryParams={queryParams}
          />
        ) : (
          <Loader showBackdrop={false} loadingText={t('COMMON.LOADING')} />
        )}
      </Box>
      </Layout> 
    </>
  );
};

export default SupportRequest;
