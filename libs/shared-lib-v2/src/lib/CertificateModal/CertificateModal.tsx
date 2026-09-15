// @ts-nocheck
'use client';
import React, { useEffect, useState } from 'react';
import { CheckboxProps } from '@mui/material/Checkbox';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Stack,
  Tooltip,
  CircularProgress,
  Backdrop,
} from '@mui/material';

import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import ShareIcon from '@mui/icons-material/Share';
import {
  downloadCertificate,
  renderCertificate,
} from '../../utils/CertificateService/coursesCertificates';
// @ts-ignore
import { telemetryFactory } from '../../DynamicForm/utils/telemetry';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { 
    xs: '90vw', 
    sm: '85vw', 
    md: '80vw', 
    lg: '85vw',
    '@media (orientation: landscape)': '90vw'
  },
  height: {
    xs: '99vh',
    '@media (orientation: landscape)': '99vh'
  },
  maxWidth: '99vw',
  maxHeight: '99vh',
  bgcolor: 'background.paper',
  borderRadius: { xs: 2, '@media (orientation: landscape)': 0 },
  boxShadow: 24,
  p: { xs: 2, sm: 3, '@media (orientation: landscape)': 1 },
  display: 'flex',
  flexDirection: 'column',
};

interface CommonCheckboxProps extends CheckboxProps {
  label: string;
  required?: boolean;
  disabled?: boolean;
}

interface CertificateModalProps {
  certificateId?: string;
  // Course-level template from the hierarchy response. Takes priority over the
  // tenant-wide template in localStorage so a course can override it.
  certificateTemplate?: string;
  open: any;
  setOpen: any;
}

const CertificatePage: React.FC<{
  htmlContent: string;
  deviceType: 'mobile' | 'desktop';
  onLoad: () => void;
}> = ({ htmlContent, deviceType, onLoad }) => {
  const responsiveHtml =
    deviceType === 'mobile'
      ? `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=2.0, user-scalable=yes">
        <style>
          html, body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            background: white;
            overflow-x: hidden;
          }
          * {
            box-sizing: border-box;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `
      : `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            width: 100%;
            box-sizing: border-box;
            background: white;
          }
          * {
            box-sizing: border-box;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `;

  const encodedHtml = encodeURIComponent(responsiveHtml);
  const dataUri = `data:text/html;charset=utf-8,${encodedHtml}`;

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        minWidth: 0,
        minHeight: 0,
        display: 'block',
        overflow: 'visible',
      }}
    >
      <iframe
        key={deviceType}
        src={dataUri}
        title="Certificate"
        onLoad={onLoad}
        scrolling="auto"
        style={{
          width: '100%',
          height: '100%',
          minWidth: '100%',
          minHeight: '100%',
          border: 'none',
          backgroundColor: 'white',
          display: 'block',
          boxSizing: 'border-box',
        }}
      />
    </Box>
  );
};

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificateId,
  certificateTemplate,
  open,
  setOpen,
}) => {
  const getTemplateId = () =>
    certificateTemplate || localStorage.getItem('templtateId') || '';
  const [certificateHtml, setCertificateHtml] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [deviceType, setDeviceType] = useState<'mobile' | 'desktop'>('desktop');

  useEffect(() => {
    const fetchCertificate = async () => {
      if (!certificateId || !open) {
        setCertificateHtml('');
        setIsLoading(false);
        setIsIframeLoaded(false);
        return;
      }

      setIsLoading(true);
      setIsIframeLoaded(false);
      setCertificateHtml('');

      try {
        const response = await renderCertificate({
          credentialId: certificateId,
          templateId: getTemplateId(),
        });
        setCertificateHtml(response);
      } catch (e) {
        setCertificateHtml('');
        setIsIframeLoaded(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificate();
  }, [certificateId, certificateTemplate, open]);

  useEffect(() => {
    const detectDeviceType = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileUserAgent = /mobile|android|touch|webos|iphone|ipad|ipod/i.test(userAgent);
      const isMobileScreen = window.innerWidth <= 768;

      if (isMobileUserAgent || isMobileScreen) {
        setDeviceType('mobile');
      } else {
        setDeviceType('desktop');
      }
    };

    detectDeviceType();

    window.addEventListener('resize', detectDeviceType);
    window.addEventListener('orientationchange', detectDeviceType);

    return () => {
      window.removeEventListener('resize', detectDeviceType);
      window.removeEventListener('orientationchange', detectDeviceType);
    };
  }, []);

  const onDownloadCertificate = async () => {
    try {
      if (typeof window !== 'undefined') {
        const windowUrl = window.location.pathname;
        const cleanedUrl = windowUrl.replace(/^\//, '');
        const env = cleanedUrl.split('/')[0];
        const telemetryInteract = {
          context: { env, cdata: [] },
          edata: {
            id: 'clicked on download certificate:',
            type: 'CLICK',
            pageid: cleanedUrl,
            program: localStorage.getItem('userProgram') || '',
            certificateId,
          },
        };
        telemetryFactory.interact(telemetryInteract);
      }
      const htmlContent = certificateHtml || await renderCertificate({
        credentialId: certificateId,
        templateId: getTemplateId(),
      });

      if (!htmlContent) throw new Error('No response from server');

      // dom-to-image-more uses SVG foreignObject rendering — the browser's own CSS engine
      // handles clip-path, gradients, fonts, and all CSS features exactly as displayed.
      const domtoimage = (await import('dom-to-image-more')).default;
      const { default: jsPDF } = await import('jspdf');

      // Render the full HTML document in an isolated iframe so all CSS is applied correctly
      const iframe = document.createElement('iframe');
      iframe.style.cssText = 'position:fixed;top:-10000px;left:0;width:1300px;height:900px;border:none;';
      document.body.appendChild(iframe);

      try {
        await new Promise<void>((resolve, reject) => {
          iframe.onload = () => resolve();
          iframe.onerror = () => reject(new Error('Certificate iframe failed to load'));
          iframe.srcdoc = htmlContent;
        });

        // Allow time for fonts and CSS rendering to fully settle
        await new Promise((resolve) => setTimeout(resolve, 600));

        const certDoc = iframe.contentDocument as Document;
        // Prefer the innermost content box. `.scale-container`/`.viewport-frame` wrappers
        // center themselves via `transform: translate(-50%, -50%)`, which shifts the
        // rendered content off-canvas when captured in isolation — querySelector with a
        // grouped selector matches by document order, not by the order listed here, so
        // that ancestor can win over the safe inner box if not checked explicitly first.
        const pageEl = (certDoc.querySelector('.certificate-container') ||
          certDoc.querySelector('.certificate') ||
          certDoc.querySelector('.page') ||
          certDoc.querySelector('.scale-container')) as HTMLElement;
        if (!pageEl) throw new Error('Certificate .page element not found');

        const dataUrl = await domtoimage.toJpeg(pageEl, {
          quality: 0.98,
          scale: 2,
        });

        const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        const pageW = pdf.internal.pageSize.getWidth();
        const pageH = pdf.internal.pageSize.getHeight();
        // The aspect ratio must come from the rasterised bitmap, never from the
        // element's scroll box. dom-to-image renders the *layout* box, so any
        // template whose children overflow it (e.g. a deliberately over-tall,
        // clipped icon strip) reports a larger scrollHeight — jsPDF would then
        // draw the bitmap into a wrongly-proportioned rectangle, stretching the
        // certificate and letterboxing it on the wrong axis. scrollWidth/Height
        // are also rounded integers that exclude borders, so they can never be
        // exact; the bitmap's own dimensions always are.
        const bitmap = new Image();
        bitmap.src = dataUrl;
        await new Promise<void>((resolve, reject) => {
          bitmap.onload = () => resolve();
          bitmap.onerror = () => reject(new Error('Certificate image failed to decode'));
        });
        const aspect = bitmap.naturalHeight / bitmap.naturalWidth;

        let imgW = pageW;
        let imgH = imgW * aspect;
        if (imgH > pageH) {
          imgH = pageH;
          imgW = imgH / aspect;
        }
        const xOffset = (pageW - imgW) / 2;
        const yOffset = (pageH - imgH) / 2;
        pdf.addImage(dataUrl, 'JPEG', xOffset, yOffset, imgW, imgH);
        pdf.save(`certificate_${certificateId}.pdf`);
      } finally {
        document.body.removeChild(iframe);
      }
    } catch (e) {
      console.error('Error downloading certificate:', e);
    }
  };

  const handleClose = () => setOpen(false);

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            ...style,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            boxSizing: 'border-box',
          }}
        >
          {/* Top Bar */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h2">Certificate</Typography>
            <Stack direction="row" spacing={1}>
              <Tooltip title="Download">
                <IconButton onClick={onDownloadCertificate}>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
              {deviceType === 'mobile' && (
                <Tooltip title="Share">
                  <IconButton>
                    <ShareIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Close">
                <IconButton onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          {/* Certificate Content */}
          <Box
            sx={{
              flex: 1,
              position: 'relative',
              width: '100%',
              maxWidth: '100%',
              minHeight: 0,
              overflow: 'hidden',
              backgroundColor: 'background.paper',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
            }}
          >
            {/* ✅ Fixed Loader */}
            {(isLoading || !certificateHtml || !isIframeLoaded) && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  zIndex: 2000,
                }}
              >
                <CircularProgress size={60} thickness={4} />
              </Box>
            )}

            {certificateHtml && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  opacity: isIframeLoaded ? 1 : 0,
                  transition: 'opacity 0.3s ease-in-out',
                  width: '100%',
                  height: '100%',
                  maxWidth: '100%',
                  maxHeight: '100%',
                  zIndex: isIframeLoaded ? 1 : 0,
                  overflow: 'auto',
                  WebkitOverflowScrolling: 'touch',
                  boxSizing: 'border-box',
                  '&::-webkit-scrollbar': {
                    width: '12px',
                    height: '12px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#888',
                    borderRadius: '6px',
                    '&:hover': {
                      background: '#555',
                    },
                  },
                }}
              >
                <CertificatePage
                  key={`${deviceType}-${certificateId}`}
                  htmlContent={certificateHtml}
                  deviceType={deviceType}
                  onLoad={() => setIsIframeLoaded(true)}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default CertificateModal;