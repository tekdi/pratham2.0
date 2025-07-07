export interface UploadedImage {
  id: string;
  url: string;
  previewUrl?: string;
  name: string;
  size: number;
  uploadedAt: string;
}

export interface UploadOptionsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  uploadedImages?: UploadedImage[];
  onReupload?: () => void;
  onViewImages?: () => void;
  onDownload?: () => void;
  onImageUpload?: (image: UploadedImage) => void;
  title?: string;
  maxFileSize?: number;
  allowedFormats?: string[];
}

export interface ImagePreviewProps {
  image: UploadedImage;
  onClick: () => void;
}
