import React, { useState, useRef } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { UploadOptionsPopupProps, UploadedImage } from './types';
import Camera from './Camera';
import ImageViewer from './ImageViewer';
import { answerSheetSubmissions } from '../../services/AssesmentService';
import {
  uploadFileToS3,
  dataUrlToFile,
} from '../../services/FileUploadService';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const UploadOptionsPopup: React.FC<UploadOptionsPopupProps> = ({
  isOpen,
  onClose,
  uploadedImages = [],
  onImageUpload,
  onImageRemove,
  userId,
  questionSetId,
  identifier,
  onSubmissionSuccess,
}) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isInstructionsExpanded, setIsInstructionsExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toast state
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'error' as 'error' | 'success' | 'warning' | 'info',
  });

  const showToast = (
    message: string,
    severity: 'error' | 'success' | 'warning' | 'info' = 'error'
  ) => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const handleTakePhoto = () => {
    setIsCameraOpen(true);
  };

  const handleChooseFromGallery = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Check if adding new files would exceed the limit
    if (uploadedImages.length + files.length > 4) {
      showToast('You can only upload up to 4 images', 'warning');
      return;
    }

    setIsUploading(true);
    let successCount = 0;
    let totalFiles = 0;

    try {
      // Convert FileList to array for easier processing
      const fileArray = Array.from(files);
      totalFiles = fileArray.length;

      for (const file of fileArray) {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
          showToast('Please select valid image files (jpg, jpeg)', 'error');
          continue;
        }

        // Validate file size (5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
          showToast(`File exceeds 5MB limit. Please select a smaller image.`);
          continue;
        }

        try {
          const foldername = 'AIAssessment';
          const uploadedUrl = await uploadFileToS3(file, foldername);
          if (uploadedUrl) {
            const newImage: UploadedImage = {
              id:
                Date.now().toString() + Math.random().toString(36).substr(2, 9),
              url: uploadedUrl,
              previewUrl: uploadedUrl,
              name: file.name,
              size: file.size,
              uploadedAt: new Date().toISOString(),
            };
            onImageUpload?.(newImage);
            successCount++;
          }
        } catch (error) {
          console.error('Error uploading file:', file.name, error);
          showToast(`Failed to upload ${file.name}`, 'error');
        }
      }

      // Only show success toast if at least one file was uploaded successfully
      if (successCount > 0) {
        showToast('Images uploaded successfully!', 'success');
      }
    } catch (error) {
      console.error('Error uploading files from gallery:', error);
      showToast(
        'Failed to upload images from gallery. Please try again.',
        'error'
      );
    } finally {
      setIsUploading(false);
    }

    // Reset input
    event.target.value = '';
  };

  const handleCameraCapture = async (imageData: string, fileName: string) => {
    // Check if adding new image would exceed the limit
    if (uploadedImages.length >= 4) {
      showToast('You can only upload up to 4 images', 'warning');
      setIsCameraOpen(false);
      return;
    }

    setIsUploading(true);
    try {
      const file = dataUrlToFile(imageData, fileName);

      // Validate file size (5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        showToast(
          `File "${fileName}" exceeds 5MB limit. Please capture a smaller image.`,
          'error'
        );
        setIsCameraOpen(false);
        return;
      }

      const uploadedUrl = await uploadFileToS3(file);
      if (uploadedUrl) {
        const newImage: UploadedImage = {
          id: Date.now().toString(),
          url: uploadedUrl,
          previewUrl: uploadedUrl,
          name: fileName,
          size: file.size,
          uploadedAt: new Date().toISOString(),
        };
        onImageUpload?.(newImage);
        showToast('Photo captured and uploaded successfully!', 'success');
      }
    } catch (error) {
      console.error('Error uploading file from camera:', error);
      showToast(
        'Failed to upload image from camera. Please try again.',
        'error'
      );
    } finally {
      setIsUploading(false);
      setIsCameraOpen(false);
    }
  };

  const handleRemoveImage = (imageId: string) => {
    // Call parent's remove handler if provided
    if (onImageRemove) {
      onImageRemove(imageId);
    }
  };

  const handleStartAIEvaluation = async () => {
    if (!userId || !questionSetId || !identifier) {
      showToast('Missing required parameters for AI evaluation.', 'error');
      return;
    }

    if (uploadedImages.length === 0) {
      showToast(
        'Please upload at least one image before starting AI evaluation.',
        'warning'
      );
      return;
    }

    setIsSubmitting(true);
    const currentUserId = localStorage.getItem('userId') || '';
    try {
      const fileUrls = uploadedImages.map((image) => image.url);

      await answerSheetSubmissions({
        userId,
        questionSetId,
        identifier,
        fileUrls,
        createdBy: currentUserId,
      });

      showToast('Answer sheet submitted successfully!', 'success');
      onClose();
      onSubmissionSuccess?.();
    } catch (error) {
      console.error('Error submitting answer sheet:', error);
      showToast('Failed to submit answer sheet. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
    window.location.reload()
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <>
      <Modal
        open={isOpen}
        onClose={onClose}
        aria-labelledby="upload-options-modal"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '& .MuiModal-backdrop': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <Box
          sx={{
            width: {
              xs: 380,
              sm: 420,
              md: 480,
              lg: 740,
              xl: 800,
            },
            bgcolor: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            outline: 'none',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '90vh',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 24px 16px 24px',
            }}
          >
            <Typography
              sx={{
                fontSize: '20px',
                fontWeight: 600,
                color: '#4D4639',
              }}
            >
              Assessment Sheets
            </Typography>
            <IconButton
              onClick={onClose}
              sx={{
                width: 32,
                height: 32,
                padding: '4px',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <CloseIcon
                sx={{
                  width: 20,
                  height: 20,
                  color: '#4D4639',
                }}
              />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Format Info */}
          <Box sx={{ padding: '0 24px 16px 24px' }}>
            <Typography
              sx={{
                fontSize: '14px',
                color: '#666666',
                fontWeight: 400,
              }}
            >
              * Format: jpg, size: 5 MB Up to 4 images
            </Typography>
          </Box>

          {/* Content */}
          <Box
            sx={{
              padding: '0 24px 24px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              flex: 1,
              overflowY: 'auto',
            }}
          >
            {/* Upload Buttons */}
            <Box
              sx={{
                display: 'flex',
                gap: '16px',
                justifyContent: 'center',
              }}
            >
              {/* Take Photo Button */}
              <Button
                onClick={!isUploading ? handleTakePhoto : undefined}
                disabled={isUploading || uploadedImages.length >= 4}
                variant="outlined"
                startIcon={<PhotoCameraIcon />}
                sx={{
                  minWidth: '140px',
                  height: '48px',
                  border: '1px solid #D0C5B4',
                  borderRadius: '8px',
                  color: '#4D4639',
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '14px',
                  '&:hover': {
                    borderColor: '#4D4639',
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                  '&:disabled': {
                    opacity: 0.6,
                  },
                }}
              >
                {isUploading
                  ? 'Uploading...'
                  : uploadedImages.length >= 4
                    ? 'Max 4 Images'
                    : 'Take A Photo'}
              </Button>

              {/* Upload Photo Button */}
              <Button
                onClick={!isUploading ? handleChooseFromGallery : undefined}
                disabled={isUploading || uploadedImages.length >= 4}
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                sx={{
                  minWidth: '140px',
                  height: '48px',
                  border: '1px solid #D0C5B4',
                  borderRadius: '8px',
                  color: '#4D4639',
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '14px',
                  '&:hover': {
                    borderColor: '#4D4639',
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                  '&:disabled': {
                    opacity: 0.6,
                  },
                }}
              >
                {isUploading
                  ? 'Uploading...'
                  : uploadedImages.length >= 4
                    ? 'Max 4 Images'
                    : 'Upload A Photo'}
              </Button>
            </Box>

            {/* Guidelines Section */}
            <Box
              sx={{
                backgroundColor: '#F8F8F8',
                borderRadius: '8px',
                padding: '16px',
              }}
            >
              <Typography
                sx={{
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: '#4D4639',
                  marginBottom: '8px',
                }}
              >
                • Place the piece of paper on a flat, clean surface
              </Typography>
              <Typography
                sx={{
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: '#4D4639',
                  marginBottom: '8px',
                }}
              >
                • Hold the phone straight above the piece of paper
              </Typography>
              <Typography
                sx={{
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: '#4D4639',
                  marginBottom: '8px',
                }}
              >
                • Ensure good lighting and avoid shadows or glare
              </Typography>
              <Typography
                sx={{
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: '#4D4639',
                  marginBottom: '8px',
                }}
              >
                • Ensure all text is clear and fully visible
              </Typography>

              {isInstructionsExpanded && (
                <>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: '#4D4639',
                      marginBottom: '8px',
                    }}
                  >
                    • Click an image and upload to the portal
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: '#4D4639',
                      marginBottom: '8px',
                    }}
                  >
                    • If the answer sheet has multiple pages, take a picture of
                    each page separately and upload
                  </Typography>
                </>
              )}

              <Button
                onClick={() =>
                  setIsInstructionsExpanded(!isInstructionsExpanded)
                }
                sx={{
                  textTransform: 'none',
                  color: '#FDBE16',
                  fontSize: '14px',
                  fontWeight: 500,
                  padding: 0,
                  minWidth: 'auto',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline',
                  },
                }}
              >
                {isInstructionsExpanded ? 'Read Less' : 'Read More'}
              </Button>
            </Box>

            {/* Uploaded Files List */}
            {uploadedImages.length > 0 && (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '12px',
                }}
              >
                {uploadedImages.map((image) => (
                  <Box
                    key={image.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      border: '1px solid #E0E0E0',
                      borderRadius: '8px',
                      backgroundColor: '#FAFAFA',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        flex: 1,
                        minWidth: 0, // This is crucial for ellipsis to work
                      }}
                      onClick={() => setSelectedImage(image.url)}
                    >
                      <InsertDriveFileIcon
                        sx={{
                          color: '#666666',
                          fontSize: '20px',
                          flexShrink: 0, // Prevent icon from shrinking
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: '14px',
                          color: '#4D4639',
                          fontWeight: 500,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          minWidth: 0, // This is crucial for ellipsis to work
                          flex: 1, // Take remaining space
                        }}
                      >
                        {image.name}
                      </Typography>
                    </Box>
                    <IconButton
                      onClick={() => handleRemoveImage(image.id)}
                      sx={{
                        padding: '4px',
                        '&:hover': {
                          backgroundColor: 'rgba(186, 26, 26, 0.1)',
                        },
                      }}
                    >
                      <DeleteOutlineIcon
                        sx={{
                          color: '#BA1A1A',
                          fontSize: '20px',
                        }}
                      />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Actions */}
          <Box
            sx={{
              padding: '16px 24px 24px 24px',
              borderTop: '1px solid #E0E0E0',
            }}
          >
            <Button
              onClick={handleStartAIEvaluation}
              disabled={
                isSubmitting || isUploading || uploadedImages.length === 0
              }
              variant="contained"
              sx={{
                width: '100%',
                height: '48px',
                backgroundColor: '#FDBE16',
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '16px',
                color: '#4D4639',
                '&:hover': {
                  backgroundColor: '#E6A800',
                },
                '&:disabled': {
                  backgroundColor: '#D0C5B4',
                  color: '#8D8D8D',
                },
              }}
            >
              {isSubmitting
                ? 'Submitting...'
                : isUploading
                  ? 'Uploading Files...'
                  : 'Save and Upload'}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/jpeg,image/jpg"
        multiple
        style={{ display: 'none' }}
      />

      {/* Camera Component */}
      <Camera
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

      {/* Toast Notifications */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

      {/* Image Viewer */}
      {selectedImage && (
        <ImageViewer
          open={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage}
        />
      )}
    </>
  );
};

export default UploadOptionsPopup;
