import React, { useState, useEffect } from 'react';
import Loader from '../Loader/Loader';
import { useTranslation } from '@shared-lib';

interface JotFormEmbedWithSubmitProps {
  formId: string;
  queryParams: Record<string, string | number | boolean>; // Dynamic query parameters
  onSubmit?: () => void; // Callback when form is submitted
}

const JotFormEmbedWithSubmit: React.FC<JotFormEmbedWithSubmitProps> = ({
  formId,
  queryParams,
  onSubmit,
}) => {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const queryString = new URLSearchParams(
    Object.entries(queryParams).reduce((acc, [key, value]) => {
      acc[key] = String(value);
      return acc;
    }, {} as Record<string, string>)
  ).toString();

  useEffect(() => {
    // Method 1: Listen for JotForm submission via postMessage
    const handleMessage = (event: MessageEvent) => {
      // console.log('Received postMessage event:', event);
      // console.log('Event origin:', event.origin);
      // console.log('Event data:', event.data);
      // console.log('Event data type:', typeof event.data);

      // Check if message is from JotForm
      if (event.origin.includes('jotform.com')) {
        try {
          let isSubmit = false;

          // Handle string data
          if (typeof event.data === 'string') {
            // console.log('String data received:', event.data);
            // Check various JotForm submit event patterns
            if (
              event.data.includes('formSubmit') ||
              event.data.includes('submit') ||
              event.data.includes('form-submit') ||
              event.data.includes('thankYou')
            ) {
              isSubmit = true;
            }
          }

          // Handle object data
          if (typeof event.data === 'object' && event.data !== null) {
            // console.log('Object data received:', event.data);
            // Try to parse if it's stringified
            const dataObj = event.data;
            if (
              dataObj.action === 'submission-completed' ||
              dataObj.type === 'form.submit' ||
              dataObj.event === 'submit' ||
              dataObj.action === 'thank-you'
            ) {
              isSubmit = true;
            }
          }

          if (isSubmit) {
            // console.log(
            //   'JotForm submission detected via postMessage! Triggering download...'
            // );
            if (onSubmit) {
              onSubmit();
            }
          }
        } catch (error) {
          // console.error('Error processing JotForm message:', error);
        }
      }
    };

    // Method 2: Poll iframe URL for thank you page (fallback)
    const checkIframeUrl = setInterval(() => {
      try {
        if (iframeRef.current) {
          const iframe = iframeRef.current;
          // Try to access the iframe URL (might be blocked by CORS)
          try {
            const iframeUrl = iframe.contentWindow?.location.href;
            // console.log('Current iframe URL:', iframeUrl);

            if (
              iframeUrl &&
              (iframeUrl.includes('thank') || iframeUrl.includes('submit'))
            ) {
              // console.log(
              //   'JotForm submission detected via URL change! Triggering download...'
              // );
              if (onSubmit) {
                onSubmit();
                clearInterval(checkIframeUrl);
              }
            }
          } catch (e) {
            // CORS error is expected, ignore
          }
        }
      } catch (error) {
        // Silently fail
      }
    }, 1000);

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearInterval(checkIframeUrl);
    };
  }, [onSubmit]);

  return (
    <>
      {loading && (
        <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />
      )}
      <iframe
        ref={iframeRef}
        id="jotform-embed"
        title="Download Form"
        src={`${process.env.NEXT_PUBLIC_JOTFORM_URL}/${formId}?${queryString}`}
        style={{
          minWidth: '100%',
          maxWidth: '100%',
          height: '100%',
          border: 'none',
          display: loading ? 'none' : 'block',
        }}
        onLoad={() => setLoading(false)}
        allow="payment"
      ></iframe>
    </>
  );
};

export default JotFormEmbedWithSubmit;
