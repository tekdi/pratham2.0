import React, { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  IconButton,
  Stack,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';

interface ImageViewerProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  open,
  onClose,
  imageUrl,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    try {
      setIsDownloading(true);

      // Create a canvas element
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Create an image element
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Try to prevent CORS issues

      img.onload = () => {
        // Set canvas dimensions to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image onto canvas
        ctx?.drawImage(img, 0, 0);

        // Convert canvas to data URL
        try {
          const dataUrl = canvas.toDataURL('image/jpeg', 1.0);

          // Create download link
          const link = document.createElement('a');
          link.download = imageUrl.split('/').pop() || 'image.jpg';
          link.href = dataUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (e) {
          console.error('Canvas export error:', e);
          alert('Failed to download image. Please try again.');
        }
        setIsDownloading(false);
      };

      img.onerror = () => {
        console.error('Image load error');
        alert('Failed to download image. Please try again.');
        setIsDownloading(false);
      };

      // Add timestamp to bypass cache
      const timeStamp = new Date().getTime();
      img.src = `${imageUrl}${
        imageUrl.includes('?') ? '&' : '?'
      }t=${timeStamp}`;
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download image. Please try again.');
      setIsDownloading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'rgba(0, 0, 0, 0.9)',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          maxWidth: '95vw',
          maxHeight: '95vh',
          outline: 'none',
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: 1,
            p: 0.5,
          }}
        >
          <Tooltip title="Download">
            <IconButton
              onClick={handleDownload}
              sx={{ color: 'white' }}
              size="large"
              disabled={isDownloading}
            >
              {isDownloading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <DownloadIcon />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title="Close">
            <IconButton onClick={onClose} sx={{ color: 'white' }} size="large">
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Stack>
        <Box
          component="img"
          src={imageUrl}
          alt="Full screen view"
          sx={{
            maxWidth: '100%',
            maxHeight: '95vh',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </Box>
    </Modal>
  );
};

export default ImageViewer;
