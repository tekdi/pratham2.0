import React, { useState, useRef } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  LinearProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Close as CloseIcon,
  PhotoCamera as PhotoCameraIcon,
  PhotoLibrary as PhotoLibraryIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  Visibility as VisibilityIcon,
  RefreshOutlined as RefreshIcon,
} from '@mui/icons-material';
import { UploadOptionsPopupProps, UploadedImage } from './types';
import Camera from './Camera';

// Simulated S3 upload function - replace with actual implementation
const uploadToS3 = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (onProgress) {
        onProgress(progress);
      }
      if (progress >= 100) {
        clearInterval(interval);
        // Return a mock S3 URL
        resolve(
          `https://s3-bucket.amazonaws.com/uploads/${file.name}_${Date.now()}`
        );
      }
    }, 100);
  });
};

const UploadOptionsPopup: React.FC<UploadOptionsPopupProps> = ({
  isOpen,
  onClose,
  uploadedImages = [],
  onReupload,
  onViewImages,
  onDownload,
  onImageUpload,
  title = 'Upload Options',
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  allowedFormats = ['image/jpeg', 'image/png', 'image/gif'],
}) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    const errors: string[] = [];

    // Validate files
    Array.from(files).forEach((file) => {
      if (!allowedFormats.includes(file.type)) {
        errors.push(
          `${file.name}: Invalid format. Allowed: ${allowedFormats.join(', ')}`
        );
        return;
      }
      if (file.size > maxFileSize) {
        errors.push(
          `${file.name}: File too large. Max size: ${(
            maxFileSize /
            (1024 * 1024)
          ).toFixed(1)}MB`
        );
        return;
      }
      validFiles.push(file);
    });

    if (errors.length > 0) {
      setErrorMessage(errors.join('\n'));
      return;
    }

    // Upload valid files
    for (const file of validFiles) {
      const fileId = `${file.name}_${Date.now()}`;
      setUploadingFiles((prev) => [...prev, fileId]);

      try {
        const url = await uploadToS3(file, (progress) => {
          setUploadProgress((prev) => ({ ...prev, [fileId]: progress }));
        });

        const newImage: UploadedImage = {
          id: fileId,
          url: url,
          previewUrl: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
          uploadedAt: new Date().toISOString(),
        };

        if (onImageUpload) {
          onImageUpload(newImage);
        }

        setSuccessMessage(`${file.name} uploaded successfully!`);
      } catch (error) {
        setErrorMessage(`Failed to upload ${file.name}`);
      } finally {
        setUploadingFiles((prev) => prev.filter((id) => id !== fileId));
        setUploadProgress((prev) => {
          const newProgress = { ...prev };
          delete newProgress[fileId];
          return newProgress;
        });
      }
    }
  };

  const handleCameraCapture = async (imageData: string, fileName: string) => {
    try {
      // Convert base64 to blob
      const response = await fetch(imageData);
      const blob = await response.blob();
      const file = new File([blob], fileName, { type: 'image/jpeg' });

      const fileId = `camera_${Date.now()}`;
      setUploadingFiles((prev) => [...prev, fileId]);

      const url = await uploadToS3(file, (progress) => {
        setUploadProgress((prev) => ({ ...prev, [fileId]: progress }));
      });

      const newImage: UploadedImage = {
        id: fileId,
        url: url,
        previewUrl: imageData,
        name: fileName,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      };

      if (onImageUpload) {
        onImageUpload(newImage);
      }

      setSuccessMessage('Photo captured and uploaded successfully!');
    } catch (error) {
      setErrorMessage('Failed to upload captured photo');
    } finally {
      setUploadingFiles((prev) =>
        prev.filter((id) => id.startsWith('camera_'))
      );
      setIsCameraOpen(false);
    }
  };

  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <Modal
        open={isOpen}
        onClose={onClose}
        aria-labelledby="upload-options-modal-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Paper
          sx={{
            width: '100%',
            maxWidth: 800,
            maxHeight: '90vh',
            overflow: 'auto',
            borderRadius: '16px',
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 3,
              borderBottom: '1px solid #E5E5E5',
            }}
          >
            <Typography
              id="upload-options-modal-title"
              variant="h5"
              sx={{
                fontWeight: 600,
                color: '#1A1A1A',
              }}
            >
              {title}
            </Typography>
            <IconButton
              onClick={onClose}
              sx={{
                color: '#666',
                '&:hover': {
                  backgroundColor: '#F5F5F5',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Upload Options */}
          <Box sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 500,
                color: '#1A1A1A',
              }}
            >
              Add New Images
            </Typography>

            <Grid container spacing={2} sx={{ mb: 4 }}>
              {/* Camera Option */}
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<PhotoCameraIcon />}
                  onClick={() => setIsCameraOpen(true)}
                  sx={{
                    height: '80px',
                    borderColor: '#FDBE16',
                    color: '#4D4639',
                    borderWidth: '2px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: 500,
                    '&:hover': {
                      borderColor: '#FDBE16',
                      backgroundColor: '#FFF8E1',
                      borderWidth: '2px',
                    },
                  }}
                >
                  Take Photo
                </Button>
              </Grid>

              {/* Gallery Option */}
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<PhotoLibraryIcon />}
                  onClick={handleGalleryClick}
                  sx={{
                    height: '80px',
                    borderColor: '#FDBE16',
                    color: '#4D4639',
                    borderWidth: '2px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: 500,
                    '&:hover': {
                      borderColor: '#FDBE16',
                      backgroundColor: '#FFF8E1',
                      borderWidth: '2px',
                    },
                  }}
                >
                  Choose from Gallery
                </Button>
              </Grid>
            </Grid>

            {/* Upload Progress */}
            {uploadingFiles.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: '#666' }}>
                  Uploading files...
                </Typography>
                {uploadingFiles.map((fileId) => (
                  <Box key={fileId} sx={{ mb: 1 }}>
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}
                    >
                      <CloudUploadIcon
                        sx={{ mr: 1, fontSize: 16, color: '#666' }}
                      />
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        {fileId.split('_')[0]}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={uploadProgress[fileId] || 0}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: '#F5F5F5',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#FDBE16',
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>
            )}

            {/* Uploaded Images */}
            {uploadedImages.length > 0 && (
              <>
                <Divider sx={{ my: 3 }} />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 500,
                      color: '#1A1A1A',
                    }}
                  >
                    Uploaded Images ({uploadedImages.length})
                  </Typography>
                  {uploadedImages.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {onViewImages && (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => onViewImages()}
                          sx={{
                            borderColor: '#E5E5E5',
                            color: '#666',
                            '&:hover': {
                              borderColor: '#FDBE16',
                              color: '#4D4639',
                            },
                          }}
                        >
                          View All
                        </Button>
                      )}
                      {onDownload && (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<DownloadIcon />}
                          onClick={() => onDownload()}
                          sx={{
                            borderColor: '#E5E5E5',
                            color: '#666',
                            '&:hover': {
                              borderColor: '#FDBE16',
                              color: '#4D4639',
                            },
                          }}
                        >
                          Download All
                        </Button>
                      )}
                    </Box>
                  )}
                </Box>

                <Grid container spacing={2}>
                  {uploadedImages.map((image) => (
                    <Grid item xs={12} sm={6} md={4} key={image.id}>
                      <Card
                        sx={{
                          borderRadius: '12px',
                          overflow: 'hidden',
                          border: '1px solid #E5E5E5',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          },
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="140"
                          image={image.previewUrl || image.url}
                          alt={image.name}
                          sx={{
                            objectFit: 'cover',
                          }}
                        />
                        <CardContent sx={{ p: 2 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 500,
                              mb: 1,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {image.name}
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              mb: 1,
                            }}
                          >
                            <Chip
                              label={formatFileSize(image.size)}
                              size="small"
                              sx={{
                                backgroundColor: '#F5F5F5',
                                color: '#666',
                                fontSize: '12px',
                              }}
                            />
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#999',
                              display: 'block',
                            }}
                          >
                            {formatDate(image.uploadedAt)}
                          </Typography>
                        </CardContent>
                        <CardActions sx={{ p: 2, pt: 0 }}>
                          <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                            <Button
                              size="small"
                              startIcon={<VisibilityIcon />}
                              onClick={() => window.open(image.url, '_blank')}
                              sx={{
                                color: '#666',
                                '&:hover': {
                                  color: '#4D4639',
                                  backgroundColor: '#FFF8E1',
                                },
                              }}
                            >
                              View
                            </Button>
                            <Button
                              size="small"
                              startIcon={<DownloadIcon />}
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = image.url;
                                link.download = image.name;
                                link.click();
                              }}
                              sx={{
                                color: '#666',
                                '&:hover': {
                                  color: '#4D4639',
                                  backgroundColor: '#FFF8E1',
                                },
                              }}
                            >
                              Download
                            </Button>
                          </Box>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                {onReupload && (
                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Button
                      variant="outlined"
                      startIcon={<RefreshIcon />}
                      onClick={onReupload}
                      sx={{
                        borderColor: '#FDBE16',
                        color: '#4D4639',
                        '&:hover': {
                          borderColor: '#FDBE16',
                          backgroundColor: '#FFF8E1',
                        },
                      }}
                    >
                      Re-upload Images
                    </Button>
                  </Box>
                )}
              </>
            )}

            {uploadedImages.length === 0 && uploadingFiles.length === 0 && (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 4,
                  color: '#999',
                }}
              >
                <CloudUploadIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                <Typography variant="body1">No images uploaded yet</Typography>
                <Typography variant="body2">
                  Use the options above to add images
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Modal>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={allowedFormats.join(',')}
        style={{ display: 'none' }}
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      {/* Camera Modal */}
      <Camera
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSuccessMessage('')}
          severity="success"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setErrorMessage('')}
          severity="error"
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UploadOptionsPopup;
