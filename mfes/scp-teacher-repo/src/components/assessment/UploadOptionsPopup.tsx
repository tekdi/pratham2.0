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
import FilterIcon from '@mui/icons-material/Filter';
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
  const [isInstructionsExpanded, setIsInstructionsExpanded] = useState(true);
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
          showToast(`File ${file.name} exceeds 5MB limit`, 'error');
          continue;
        }

        try {
          const uploadedUrl = await uploadFileToS3(file);
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
    setIsUploading(true);
    try {
      const file = dataUrlToFile(imageData, fileName);
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
    try {
      const fileUrls = uploadedImages.map((image) => image.url);

      await answerSheetSubmissions({
        userId,
        questionSetId,
        identifier,
        fileUrls,
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
              xs: 340,
              sm: 350,
              md: 400,
              lg: 450,
              xl: 520,
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
              padding: '12px 12px 12px 16px',
            }}
          >
            <Box sx={{ padding: '12px 0px 0px' }}>
              <Typography
                sx={{
                  color: '#4D4639',
                }}
              >
                Submit Answers for AI Evaluation
              </Typography>
            </Box>
            <Box
              sx={{
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  borderRadius: '100px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconButton
                  onClick={onClose}
                  sx={{
                    width: 40,
                    height: 40,
                    padding: '8px',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <CloseIcon
                    sx={{
                      width: 24,
                      height: 24,
                      color: '#4D4639',
                    }}
                  />
                </IconButton>
              </Box>
            </Box>
          </Box>

          {/* Divider */}
          <Divider
            sx={{
              borderColor: '#D0C5B4',
              borderWidth: '1px',
            }}
          />

          {/* Content */}
          <Box
            sx={{
              padding: '24px 16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              width: '100%',
              minHeight: 472,
              height: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                width: '100%',
              }}
            >
              {/* Upload Options */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  width: '100%',
                }}
              >
                {/* Upload Buttons */}
                <Box
                  sx={{
                    display: 'flex',
                    gap: {
                      xs: '16px',
                      sm: '20px',
                      md: '24px',
                    },
                    width: '100%',
                    justifyContent: 'center',
                  }}
                >
                  {/* Take Photo Button */}
                  <Box
                    onClick={!isUploading ? handleTakePhoto : undefined}
                    sx={{
                      width: 140,
                      height: 104,
                      border: '1px solid #D0C5B4',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '10px 24px 10px 16px',
                      cursor: isUploading ? 'not-allowed' : 'pointer',
                      opacity: isUploading ? 0.6 : 1,
                      '&:hover': {
                        backgroundColor: !isUploading
                          ? 'rgba(0, 0, 0, 0.04)'
                          : 'transparent',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <PhotoCameraIcon
                        sx={{
                          width: 26.67,
                          height: 24,
                          color: '#1C1B1F',
                        }}
                      />
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '20px',
                        letterSpacing: '0.1px',
                        textAlign: 'center',
                        color: '#7C766F',
                      }}
                    >
                      {isUploading ? 'Uploading...' : 'Take Photo'}
                    </Typography>
                  </Box>

                  {/* Choose from Gallery Button */}
                  <Box
                    onClick={!isUploading ? handleChooseFromGallery : undefined}
                    sx={{
                      width: 140,
                      height: 104,
                      border: '1px solid #D0C5B4',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '10px 24px 10px 16px',
                      cursor: isUploading ? 'not-allowed' : 'pointer',
                      opacity: isUploading ? 0.6 : 1,
                      '&:hover': {
                        backgroundColor: !isUploading
                          ? 'rgba(0, 0, 0, 0.04)'
                          : 'transparent',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <FilterIcon
                        sx={{
                          width: 26.67,
                          height: 26.67,
                          color: '#1C1B1F',
                        }}
                      />
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '20px',
                        letterSpacing: '0.1px',
                        textAlign: 'center',
                        color: '#7C766F',
                      }}
                    >
                      {isUploading ? 'Uploading...' : 'Choose from Gallery'}
                    </Typography>
                  </Box>
                </Box>

                {/* Format Info */}
                <Typography
                  sx={{
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: '0.25px',
                    textAlign: 'center',
                    color: '#5F5E5E',
                  }}
                >
                  Format: jpg, size: 50 MB{'\n'}
                  Up to 4 images
                </Typography>

                {/* Submission Instructions Accordion */}
                <Box
                  sx={{
                    backgroundColor: '#FFF8E1',
                    borderRadius: '12px',
                    padding: '16px',
                    width: '100%',
                  }}
                >
                  <Box
                    onClick={() =>
                      setIsInstructionsExpanded(!isInstructionsExpanded)
                    }
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      marginBottom: isInstructionsExpanded ? '12px' : 0,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: '14px',
                        lineHeight: '20px',
                        color: '#4D4639',
                      }}
                    >
                      SUBMISSION INSTRUCTIONS:
                    </Typography>
                    {isInstructionsExpanded ? (
                      <ExpandLessIcon
                        sx={{
                          color: '#4D4639',
                          fontSize: '20px',
                        }}
                      />
                    ) : (
                      <ExpandMoreIcon
                        sx={{
                          color: '#4D4639',
                          fontSize: '20px',
                        }}
                      />
                    )}
                  </Box>

                  {isInstructionsExpanded && (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '14px',
                          lineHeight: '20px',
                          color: '#4D4639',
                          '&::before': {
                            content: '"• "',
                            fontWeight: 'bold',
                          },
                        }}
                      >
                        Place the piece of paper on a flat, clean surface
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          lineHeight: '20px',
                          color: '#4D4639',
                          '&::before': {
                            content: '"• "',
                            fontWeight: 'bold',
                          },
                        }}
                      >
                        Hold the phone straight above the piece of paper
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          lineHeight: '20px',
                          color: '#4D4639',
                          '&::before': {
                            content: '"• "',
                            fontWeight: 'bold',
                          },
                        }}
                      >
                        Ensure good lighting and avoid shadows or glare
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          lineHeight: '20px',
                          color: '#4D4639',
                          '&::before': {
                            content: '"• "',
                            fontWeight: 'bold',
                          },
                        }}
                      >
                        Ensure all text is clear and fully visible
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          lineHeight: '20px',
                          color: '#4D4639',
                          '&::before': {
                            content: '"• "',
                            fontWeight: 'bold',
                          },
                        }}
                      >
                        Click an image and upload to the portal
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          lineHeight: '20px',
                          color: '#4D4639',
                          '&::before': {
                            content: '"• "',
                            fontWeight: 'bold',
                          },
                        }}
                      >
                        If the answer sheet has multiple pages, take a picture
                        of each page separately and upload
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Uploaded Images List */}
                {uploadedImages.length > 0 && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      width: '100%',
                    }}
                  >
                    {uploadedImages.map((image) => (
                      <Box
                        key={image.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '16px',
                          padding: '16px',
                          border: '1px solid #DBDBDB',
                          borderRadius: '16px',
                          width: '100%',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                          }}
                          onClick={() => setSelectedImage(image.url)}
                        >
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: '4px',
                              backgroundImage: `url(${
                                image.previewUrl || image.url
                              })`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              cursor: 'pointer',
                              '&:hover': {
                                opacity: 0.8,
                              },
                            }}
                          />
                          <Typography
                            sx={{
                              fontFamily: 'Poppins',
                              fontWeight: 500,
                              fontSize: '14px',
                              lineHeight: '1.43em',
                              letterSpacing: '0.1px',
                              color: '#1F1B13',
                              maxWidth: '180px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {image.name}
                          </Typography>
                        </Box>
                        <IconButton
                          onClick={() => handleRemoveImage(image.id)}
                          sx={{
                            padding: 0,
                            '&:hover': {
                              backgroundColor: 'transparent',
                              opacity: 0.8,
                            },
                          }}
                        >
                          <DeleteOutlineIcon
                            sx={{
                              color: '#BA1A1A',
                              fontSize: '25px',
                            }}
                          />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          {/* Actions */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}
          >
            {/* Horizontal Divider */}
            <Divider
              sx={{
                width: '100%',
                borderColor: '#D0C5B4',
                borderWidth: '1px',
              }}
            />
            {/* Button Container */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '16px 24px',
                width: '100%',
              }}
            >
              <Button
                onClick={handleStartAIEvaluation}
                disabled={
                  isSubmitting || isUploading || uploadedImages.length === 0
                }
                sx={{
                  width: 288,
                  height: 40,
                  backgroundColor:
                    uploadedImages.length > 0 && !isUploading
                      ? '#FDBE16'
                      : '#D0C5B4',
                  borderRadius: '100px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '10px 24px',
                  '&:hover': {
                    backgroundColor:
                      uploadedImages.length > 0 && !isUploading
                        ? '#FDBE16'
                        : '#D0C5B4',
                    opacity:
                      uploadedImages.length > 0 && !isUploading ? 0.9 : 1,
                  },
                  '&:active': {
                    backgroundColor:
                      uploadedImages.length > 0 && !isUploading
                        ? '#FDBE16'
                        : '#D0C5B4',
                    opacity:
                      uploadedImages.length > 0 && !isUploading ? 0.8 : 1,
                  },
                  '&:disabled': {
                    backgroundColor: '#D0C5B4',
                    cursor: 'not-allowed',
                  },
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: '0.1px',
                    color:
                      uploadedImages.length > 0 && !isUploading
                        ? '#4D4639'
                        : '#8D8D8D',
                    textTransform: 'none',
                  }}
                >
                  {isSubmitting
                    ? 'Submitting...'
                    : isUploading
                    ? 'Uploading Files...'
                    : 'Submit for Review'}
                </Typography>
              </Button>
            </Box>
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
