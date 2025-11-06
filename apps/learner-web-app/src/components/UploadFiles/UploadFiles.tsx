import React, { useEffect, useRef, useState } from 'react';
import { Box, IconButton, Typography, useMediaQuery } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import CloseIcon from '@mui/icons-material/Close';

export interface CarouselImage {
  id: string;
  url: string;
  name?: string;
}

interface UploadFilesProps {
  images: CarouselImage[];
  initialIndex?: number;
}

const UploadFiles: React.FC<UploadFilesProps> = ({
  images,
  initialIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    setCurrentIndex(Math.min(initialIndex, Math.max(images.length - 1, 0)));
  }, [initialIndex, images.length]);

  const current = images[currentIndex];

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const requestFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if ((el as any).webkitRequestFullscreen) {
      (el as any).webkitRequestFullscreen();
    } else if ((el as any).msRequestFullscreen) {
      (el as any).msRequestFullscreen();
    }
    setIsFullscreen(true);
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    }
    setIsFullscreen(false);
  };

  useEffect(() => {
    const onChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{
        // width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {isFullscreen && (
        <IconButton
          aria-label="Close fullscreen"
          onClick={exitFullscreen}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
            bgcolor: 'rgba(0,0,0,0.4)',
            color: '#fff',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' },
          }}
        >
          <CloseIcon />
        </IconButton>
      )}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pt: 0,
          px: isMobile ? 1 : 2,
          pb: isMobile ? 1 : 1,
          height: '40vh',
        }}
      >
        {current ? (
          <Box
            component="img"
            src={current.url}
            alt={current.name || 'uploaded'}
            sx={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              borderRadius: 1,
            }}
          />
        ) : (
          <Typography variant="body2" color="text.secondary">
            No images
          </Typography>
        )}
      </Box>

      {/* Controls */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: isMobile ? 1 : 2,
          pb: isMobile ? 1 : 2,
        }}
      >
        <IconButton
          onClick={goPrev}
          disabled={images.length <= 1}
          aria-label="Previous image"
        >
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="body2" color="text.secondary" pt={1.5}>
          {images.length > 0
            ? `${currentIndex + 1} / ${images.length}`
            : '0 / 0'}
        </Typography>
        <IconButton
          onClick={goNext}
          disabled={images.length <= 1}
          aria-label="Next image"
        >
          <ChevronRightIcon />
        </IconButton>

        <Box sx={{ width: isMobile ? 12 : 24 }} />

        {!isFullscreen ? (
          <IconButton
            onClick={requestFullscreen}
            aria-label="Zoom in (fullscreen)"
            title="Zoom-In to view on fullscreen"
          >
            <ZoomInIcon />
          </IconButton>
        ) : (
          <IconButton
            onClick={exitFullscreen}
            aria-label="Zoom out (exit fullscreen)"
          >
            <ZoomOutIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default UploadFiles;

