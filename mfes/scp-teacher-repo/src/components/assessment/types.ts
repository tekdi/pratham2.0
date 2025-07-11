export interface UploadOptionsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  uploadedImages?: UploadedImage[];
  onImageUpload?: (image: UploadedImage) => void;
  onImageRemove?: (imageId: string) => void;
  userId?: string;
  questionSetId?: string;
  identifier?: string;
}

export interface UploadedImage {
  id: string;
  url: string;
  previewUrl?: string;
  name: string;
  size?: number;
  uploadedAt: string;
}
