import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Modal, Box, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';

interface CameraProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageData: string, fileName: string) => void;
}

const Camera: React.FC<CameraProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>(
    'environment'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const startCamera = useCallback(async () => {
    if (!videoRef.current) {
      console.log('Video ref not ready, retrying...');
      setTimeout(() => startCamera(), 100);
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setIsVideoPlaying(false);

      // Stop any existing stream first
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      console.log('Requesting camera access with facingMode:', facingMode);

      const constraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );
      console.log('Camera stream obtained:', mediaStream);

      const video = videoRef.current;
      if (video) {
        video.srcObject = mediaStream;

        const handleLoadedMetadata = () => {
          console.log('Video metadata loaded');
          video
            .play()
            .then(() => {
              console.log('Video is playing');
              setIsVideoPlaying(true);
              setIsLoading(false);
            })
            .catch((playError) => {
              console.error('Error playing video:', playError);
              setError('Failed to start video playback');
              setIsLoading(false);
            });
        };

        const handleError = (e: any) => {
          console.error('Video error:', e);
          setError('Video playback error');
          setIsLoading(false);
        };

        // Clean up existing listeners
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('error', handleError);

        // Add new listeners
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('error', handleError);

        // If metadata is already loaded, trigger manually
        if (video.readyState >= 1) {
          handleLoadedMetadata();
        }
      }

      setStream(mediaStream);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setError(
        'Unable to access camera. Please check permissions and try again.'
      );
      setIsLoading(false);
    }
  }, [facingMode, stream]);

  const stopCamera = useCallback(() => {
    console.log('Stopping camera');
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
        console.log('Stopped track:', track.kind);
      });
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStream(null);
    setIsVideoPlaying(false);
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current && stream && isVideoPlaying) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context && video.videoWidth > 0 && video.videoHeight > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        const fileName = `captured_image_${Date.now()}.jpg`;

        console.log('Photo captured:', fileName);
        onCapture(imageData, fileName);
        handleClose();
      } else {
        console.log('Video not ready:', {
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
        });
        setError('Camera not ready for capture');
      }
    }
  }, [onCapture, stream, isVideoPlaying]);

  const switchCamera = useCallback(() => {
    console.log('Switching camera from', facingMode);
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newFacingMode);
  }, [facingMode]);

  const handleClose = useCallback(() => {
    stopCamera();
    setError('');
    onClose();
  }, [stopCamera, onClose]);

  // Effect to handle modal open/close
  useEffect(() => {
    if (isOpen) {
      console.log('Camera modal opened');
      // Small delay to ensure ref is set
      setTimeout(() => startCamera(), 100);
    } else {
      console.log('Camera modal closed');
      stopCamera();
      setError('');
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  // Effect to handle camera switching
  useEffect(() => {
    if (isOpen && facingMode && videoRef.current) {
      console.log('Facingmode changed to:', facingMode);
      startCamera();
    }
  }, [facingMode]);

  if (!isOpen) return null;

  const isVideoReady = stream && isVideoPlaying && !isLoading && !error;

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="camera-modal-title"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& .MuiModal-backdrop': {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          maxWidth: '800px',
          maxHeight: '600px',
          bgcolor: '#000',
          borderRadius: { xs: 0, md: '12px' },
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px',
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 100%)',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              fontWeight: 500,
            }}
          >
            Take Photo
          </Typography>
          <IconButton
            onClick={handleClose}
            sx={{
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Camera View */}
        <Box
          sx={{
            flex: 1,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#000',
            minHeight: '400px',
          }}
        >
          {/* Loading State */}
          {isLoading && (
            <Typography
              sx={{
                color: 'white',
                fontSize: '18px',
                position: 'absolute',
                zIndex: 1,
              }}
            >
              Loading camera...
            </Typography>
          )}

          {/* Error State */}
          {error && (
            <Box sx={{ textAlign: 'center', position: 'absolute', zIndex: 1 }}>
              <Typography sx={{ color: 'white', fontSize: '18px', mb: 2 }}>
                {error}
              </Typography>
              <Button
                onClick={startCamera}
                variant="outlined"
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: '#FDBE16',
                    color: '#FDBE16',
                  },
                }}
              >
                Try Again
              </Button>
            </Box>
          )}

          {/* Video Element - Always rendered but visibility controlled by CSS */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: isVideoPlaying ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          />

          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </Box>

        {/* Controls */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px',
            background:
              'linear-gradient(0deg, rgba(0,0,0,0.6) 0%, transparent 100%)',
            gap: 4,
          }}
        >
          {/* Switch Camera Button */}
          <IconButton
            onClick={switchCamera}
            disabled={!isVideoReady}
            sx={{
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              width: '56px',
              height: '56px',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&:disabled': {
                color: 'rgba(255, 255, 255, 0.5)',
              },
            }}
          >
            <FlipCameraAndroidIcon />
          </IconButton>

          {/* Capture Button */}
          <Button
            onClick={capturePhoto}
            disabled={!isVideoReady}
            sx={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              minWidth: 'unset',
              backgroundColor: isVideoReady
                ? '#FDBE16'
                : 'rgba(253, 190, 22, 0.5)',
              border: '4px solid white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                backgroundColor: isVideoReady
                  ? '#FDBE16'
                  : 'rgba(253, 190, 22, 0.5)',
                transform: isVideoReady ? 'scale(1.05)' : 'none',
              },
              '&:disabled': {
                backgroundColor: 'rgba(253, 190, 22, 0.5)',
                border: '4px solid rgba(255, 255, 255, 0.5)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <PhotoCameraIcon
              sx={{
                color: '#4D4639',
                fontSize: '32px',
              }}
            />
          </Button>

          {/* Placeholder for symmetry */}
          <Box sx={{ width: '56px', height: '56px' }} />
        </Box>
      </Box>
    </Modal>
  );
};

export default Camera;

