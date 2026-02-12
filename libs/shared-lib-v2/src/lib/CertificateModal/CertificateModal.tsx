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
  open: any;
  setOpen: any;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificateId,
  open,
  setOpen,
}) => {
  const [certificateHtml, setCertificateHtml] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [certificateSite, setCertificateSite] = useState('');
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
          templateId: localStorage.getItem('templtateId') || '',
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
  }, [certificateId, open]);

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

  const CertificatePage: React.FC<{ htmlContent: string; onLoad: () => void }> = ({
    htmlContent,
    onLoad,
  }) => {
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
            .main-container {
              width: 100% !important;
              min-width: 100% !important;
              padding: 10px !important;
              overflow-x: hidden !important;
              display: flex !important;
              justify-content: center !important;
              align-items: flex-start !important;
            }
            .scale-container {
              max-width: 100% !important;
              margin: 0 auto !important;
              display: flex !important;
              justify-content: center !important;
              position: relative !important;
              left: 0 !important;
              right: 0 !important;
            }
            div[style*="font-family"], 
            .certificate-container {
              max-width: 100%;
              margin: 0 auto;
            }
          </style>
          <script>
            window.addEventListener('load', function() {
              const container = document.querySelector('.scale-container');
              if (container) {
                const scale = Math.min((window.innerWidth - 20) / 1100, 1);
                container.style.transform = 'scale(' + scale + ')';
                container.style.transformOrigin = 'center top';
              }
            });
            
            window.addEventListener('resize', function() {
              const container = document.querySelector('.scale-container');
              if (container) {
                const scale = Math.min((window.innerWidth - 20) / 1100, 1);
                container.style.transform = 'scale(' + scale + ')';
              }
            });
          </script>
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
    setCertificateSite(dataUri);

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

      const response = await downloadCertificate({
        credentialId: certificateId,
        templateId: localStorage.getItem('templtateId') || '',
      });

      if (!response) throw new Error('No response from server');

      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate_${certificateId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
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