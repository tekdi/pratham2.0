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
    xs: '95vw', 
    sm: '90vw', 
    md: '85vw', 
    lg: '100vw',
    '@media (orientation: landscape)': '100vw'
  },
  height: {
    xs: '90vh',
    '@media (orientation: landscape)': '95vh'
  },
  maxHeight: '95vh',
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
  // certificateId = 'did:rcw:20f5fe82-4912-401a-a33a-09b46413b9cf'; // temporaory hardcoded
  const handleCloseCertificate = async () => {};
  const [certificateHtml, setCertificateHtml] = useState('');
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [certificateSite, setCertificateSite] = useState('');
  const [deviceType, setDeviceType] = useState<'mobile' | 'desktop'>('desktop');

  useEffect(() => {
    const fetchCertificate = async () => {
      if (!certificateId) return;

      try {
        const response = await renderCertificate({
          credentialId: certificateId,
          templateId: localStorage.getItem('templtateId') || '',
        });
        setCertificateHtml(response);
        //setShowCertificate(true);
      } catch (e) {
        // if (selectedRowData.courseStatus === Status.ISSUED) {
        //   showToastMessage(t('CERTIFICATES.RENDER_CERTIFICATE_FAILED'), 'error');
        // }
      }
    };

    fetchCertificate();
  }, [certificateId]);

  useEffect(() => {
    const detectDeviceType = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileUserAgent = /mobile|android|touch|webos|iphone|ipad|ipod/i.test(userAgent);
      const isMobileScreen = window.innerWidth <= 768;
      
      // Consider both user agent and screen size for better detection
      if (isMobileUserAgent || isMobileScreen) {
        setDeviceType('mobile');
      } else {
        setDeviceType('desktop');
      }
    };

    // Initial detection
    detectDeviceType();

    // Add listeners for resize and orientation change
    const handleResize = () => {
      detectDeviceType();
    };

    const handleOrientationChange = () => {
      // Small delay to ensure dimensions are updated after orientation change
      setTimeout(detectDeviceType, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    // Cleanup listeners
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  const CertificatePage: React.FC<{ htmlContent: string }> = ({
    htmlContent,
  }) => {
    // Different behavior for mobile vs desktop
    const responsiveHtml = deviceType === 'mobile' ? `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=1024, initial-scale=0.5, maximum-scale=2.0, user-scalable=yes">
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: Arial, sans-serif;
              min-width: 800px;
              width: 100%;
              box-sizing: border-box;
              background: white;
            }
            * {
              box-sizing: border-box;
            }
            
            /* Force desktop-like layout for mobile */
            body {
              min-width: 800px;
              transform-origin: top left;
              zoom: 0.8;
            }
            
            /* Ensure certificate content is centered and properly sized */
            div[style*="font-family"], 
            .certificate-container {
              max-width: 100%;
              margin: 0 auto;
            }
          </style>
          <script>
            window.addEventListener('load', function() {
              // Auto-adjust scale for mobile devices
              const scale = Math.min(window.innerWidth / 850, 1);
              document.body.style.transform = 'scale(' + scale + ')';
              document.body.style.transformOrigin = 'top left';
              document.body.style.width = (100 / scale) + '%';
            });
          </script>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    ` : `
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
      <Box sx={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex',
        overflow: deviceType === 'mobile' ? 'auto' : 'hidden'
      }}>
        <iframe
          key={deviceType}
          src={dataUri}
          style={{
            width: '100%',
            height: deviceType === 'mobile' ? '1000px' : 
                   (window.innerHeight > window.innerWidth ? '1200px' : '80vh'),
            minHeight: '600px',
            border: 'none',
            backgroundColor: 'white'
          }}
        />
      </Box>
    );
  };
  const handleViewCertificate = async (rowData: any) => {
    try {
      const response = await renderCertificate({
        credentialId: rowData.certificateId,
        templateId: localStorage.getItem('templtateId') || '',
      });
      // setCertificateHtml(response);
      // setShowCertificate(true);
    } catch (e) {
      // if (selectedRowData.courseStatus === Status.ISSUED) {
      //   showToastMessage(t('CERTIFICATES.RENDER_CERTIFICATE_FAILED'), 'error');
      // }
    }
  };
  const detectBrowser = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    return {
      isIOS: /iphone|ipad|ipod/.test(userAgent),
      isSafari: /safari/.test(userAgent) && !/chrome/.test(userAgent),
      isAndroid: /android/.test(userAgent),
      isChrome: /chrome/.test(userAgent),
      isMobile: /mobile|android|touch|webos|iphone|ipad|ipod/.test(userAgent)
    };
  };

  const downloadForDesktop = async (blob: Blob) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate_${certificateId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const downloadForMobile = async (blob: Blob) => {
    const browser = detectBrowser();
    
    // For iOS Safari - open in new tab since download attribute doesn't work
    if (browser.isIOS || browser.isSafari) {
      const url = window.URL.createObjectURL(blob);
      const newWindow = window.open(url, '_blank');
      
      if (!newWindow) {
        // Fallback: show instructions to user
        alert('Please long-press the certificate and select "Save to Files" or "Share" to download');
        window.location.href = url;
      }
      
      // Clean up after a delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 5000);
      
      return;
    }

    // For Android Chrome - try direct download first
    if (browser.isAndroid && browser.isChrome) {
      try {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `certificate_${certificateId}.pdf`;
        
        // Ensure the link is visible and clickable
        a.style.display = 'block';
        a.style.visibility = 'visible';
        
        document.body.appendChild(a);
        
        // Use setTimeout to ensure the click happens after the element is added
        setTimeout(() => {
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 100);
        
        return;
      } catch (error) {
        console.log('Direct download failed, trying alternative method:', error);
      }
    }

    // Fallback for other mobile browsers - use Web Share API if available
    if (navigator.share) {
      try {
        const file = new File([blob], `certificate_${certificateId}.pdf`, {
          type: 'application/pdf',
        });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Certificate of Completion',
            text: 'Your certificate is ready to download',
            files: [file],
          });
          return;
        }
      } catch (error) {
        console.log('Web Share API failed:', error);
      }
    }

    // Final fallback - open blob URL in new tab/window
    const url = window.URL.createObjectURL(blob);
    const newWindow = window.open(url, '_blank');
    
    if (!newWindow) {
      // If popup is blocked, navigate to the blob URL
      window.location.href = url;
    }
    
    // Show user instructions
    setTimeout(() => {
      alert('Certificate opened in new tab/window. Please use your browser\'s download or share options to save it.');
      window.URL.revokeObjectURL(url);
    }, 1000);
  };

  const onDownloadCertificate = async () => {
    try {
      if (typeof window !== 'undefined') {
        const windowUrl = window.location.pathname;
        const cleanedUrl = windowUrl.replace(/^\//, '');
        const env = cleanedUrl.split('/')[0];
        const telemetryInteract = {
          context: {
            env: env,
            cdata: [],
          },
          edata: {
            id: 'clicked on download certificate:',
            type: "CLICK",
            subtype: '',
            pageid: cleanedUrl,
            program: localStorage.getItem('userProgram') || '',
            certificateId: certificateId,
          },
        };
        telemetryFactory.interact(telemetryInteract);
      }

      const response = await downloadCertificate({
        credentialId: certificateId,
        templateId: localStorage.getItem('templtateId') || '',
      });

      if (!response) {
        throw new Error('No response from server');
      }

      const blob = new Blob([response], { type: 'application/pdf' });

      // Use different download strategies based on device
      if (deviceType === 'mobile') {
        await downloadForMobile(blob);
      } else {
        await downloadForDesktop(blob);
      }

      // showToastMessage(
      //   t('CERTIFICATES.DOWNLOAD_CERTIFICATE_SUCCESSFULLY'),
      //   'success'
      // );
    } catch (e) {
      // if (rowData.courseStatus === Status.ISSUED)
      {
        // showToastMessage(t('CERTIFICATES.RENDER_CERTIFICATE_FAILED'), 'error');
      }
      console.error('Error downloading certificate:', e);
    }
  };
  // const [open, setOpen] = useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const onDownload = () => {
    console.log('Download clicked');
  };

  const onClose = () => {
    console.log('Close clicked');
  };

  // const onShare = () => {
  //   console.log('Share clicked');
  // };
  const onShare = async () => {
    try {
      const response = await downloadCertificate({
        credentialId: certificateId,
        templateId: localStorage.getItem('templtateId') || '',
      });

      const blob = new Blob([response], { type: 'application/pdf' });
      const file = new File([blob], `certificate_${certificateId}.pdf`, {
        type: 'application/pdf',
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Certificate of Completion',
          text: 'Here is your certificate!',
          files: [file],
        });
      } else {
        // fallback
        //   const url = window.URL.createObjectURL(blob);
        //   await navigator.clipboard.writeText(url);
        //   alert('Link to certificate copied! Direct sharing not supported.');
        //
        setShowShareOptions(true);
      }
    } catch (error) {
      console.error('Sharing failed:', error);
      alert('Unable to share certificate.');
    }
  };
  const handleNativeShare = async () => {
    setShowShareOptions(false);
    try {
      const response = await downloadCertificate({
        credentialId: certificateId,
        templateId: localStorage.getItem('templtateId') || '',
      });

      const blob = new Blob([response], { type: 'application/pdf' });
      const file = new File([blob], `certificate_${certificateId}.pdf`, {
        type: 'application/pdf',
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Certificate',
          text: 'Here is your certificate!',
          files: [file],
        });
      } else {
        alert('Your browser does not support file sharing.');
      }
    } catch (error) {
      console.error('Native sharing failed:', error);
      alert('Unable to share.');
    }
  };
  const shareViaEmail = async () => {
    try {
      // Fetching the certificate PDF
      const response = await downloadCertificate({
        credentialId: certificateId,
        templateId: localStorage.getItem('templtateId') || '',
      });

      const blob = new Blob([response], { type: 'application/pdf' });
      const file = new File([blob], `certificate_${certificateId}.pdf`, {
        type: 'application/pdf',
      });

      // Create a downloadable URL for the PDF
      const fileUrl = URL.createObjectURL(file);

      // Generate a mailto link with the PDF link as the body
      const subject = encodeURIComponent('Certificate of Completion');
      const body = encodeURIComponent(`Here is your certificate: ${fileUrl}`);

      window.open(`mailto:?subject=${subject}&body=${body}`);
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Unable to share certificate via email.');
    }
  };

  const handleCopyLink = async () => {
    setShowShareOptions(false);
    const url = `https://example.com/certificate/${certificateId}`;
    await navigator.clipboard.writeText(url);
    alert('Certificate link copied to clipboard!');
  };

  const handleShareWhatsApp = () => {
    setShowShareOptions(false);
    const url = `https://example.com/certificate/${certificateId}`;
    const whatsappUrl = `https://wa.me/?text=Check%20this%20certificate:%20${encodeURIComponent(
      url
    )}`;
    window.open(whatsappUrl, '_blank');
  };

  //   const certificateHtml = `
  //   <div style="font-family: 'Segoe UI', sans-serif; text-align: center; padding: 40px; background: linear-gradient(to bottom, #fff, #f9f9f9); border: 2px solid #0b3d91; border-radius: 12px; width: 600px; margin: auto;">
  //     <h1 style="color: #0b3d91; margin-bottom: 0;">CERTIFICATE</h1>
  //     <h2 style="color: #1565c0; margin-top: 5px;">OF COMPLETION</h2>
  //     <p style="margin-top: 40px; font-size: 18px;">This Certificate is presented to</p>
  //     <h2 style="color: #8b0000; font-family: cursive; margin: 16px 0;">Lorem Ipsum Dola</h2>
  //     <hr style="width: 60%; margin: 20px auto; border: 1px solid #ccc;" />
  //     <p style="font-size: 14px; color: #555;">
  //       on the occasion of Lorem Ipsum Dolor held on 00th November 2023 at the Lorem Ipsum Dolor
  //     </p>

  //     <div style="display: flex; justify-content: space-between; margin-top: 60px; padding: 0 40px;">
  //       <div>
  //         <div style="border-top: 1px solid #000; width: 120px; margin: auto;"></div>
  //         <p style="margin: 5px 0;">Principal</p>
  //       </div>
  //       <div>
  //         <div style="border-top: 1px solid #000; width: 120px; margin: auto;"></div>
  //         <p style="margin: 5px 0;">Director</p>
  //       </div>
  //     </div>

  //     <div style="position: absolute; bottom: 20px; left: 20px;">
  //       <div style="width: 60px; height: 60px; border-radius: 50%; background: radial-gradient(circle, #1976d2, #0b3d91); border: 4px solid gold;"></div>
  //     </div>
  //   </div>
  // `;

  return (
    <>
      {/* <Button variant="contained" onClick={handleOpen}>
        Open Modal
      </Button> */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            ...style,
            overflow: 'auto',
            // display: 'flex',
            // flexDirection: 'column',
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h2">Certificate</Typography>
            <Stack direction="row" spacing={1}>
              <Tooltip title="Download">
                <IconButton onClick={onDownloadCertificate}>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
              {deviceType === 'mobile' && (
                <Tooltip title="Share">
                  <IconButton onClick={onShare}>
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

          <Box sx={{ 
            maxHeight: { xs: '80vh', '@media (orientation: landscape)': '85vh' }, 
            overflowY: 'auto',
            flex: 1
          }}>
            <CertificatePage 
              key={`${deviceType}-${certificateId}`}
              htmlContent={certificateHtml} 
            />
          </Box>
        </Box>
      </Modal>
      {/* <Dialog
        open={showShareOptions}
        onClose={() => setShowShareOptions(false)}
      >
        <DialogTitle>Select Share Option</DialogTitle>
        <DialogContent>
          <List>
            <ListItemButton onClick={shareViaEmail}>
              <ListItemText primary="Share via Email" />
            </ListItemButton>
            <ListItemButton onClick={handleCopyLink}>
              <ListItemText primary="Copy Link" />
            </ListItemButton>
            <ListItemButton onClick={handleShareWhatsApp}>
              <ListItemText primary="WhatsApp" />
            </ListItemButton>
          </List>
        </DialogContent>
      </Dialog> */}
    </>
  );
};
export default CertificateModal;
