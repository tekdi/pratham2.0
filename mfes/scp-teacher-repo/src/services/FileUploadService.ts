export interface UploadedFile {
  id: string;
  url: string;
  previewUrl: string;
  name: string;
  size?: number;
  uploadedAt: string;
}

/**
 * Upload file to S3 using presigned URL
 * @param file - The file to upload
 * @param fileName - The name for the file
 * @returns Promise with uploaded file data
 */
export const uploadFileToS3 = async (file: File): Promise<any> => {
  console.log(file);
  try {
    const extension = file.name.split('.').pop()?.toLowerCase();
    const fileName = file.name.split('.')[0];

    // Step 1: Get Presigned URL
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/presigned-url?filename=${fileName}&foldername=cohort&fileType=.${extension}`
    );
    const presignedData = await res.json();

    const { url, fields } = presignedData.result;

    // Step 2: Prepare form data
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    formData.append('file', file);

    // Step 3: Upload to S3
    const uploadRes = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!uploadRes.ok) throw new Error('Upload failed');

    // Step 4: Construct the uploaded file URL
    const uploadedUrl = `${url}${fields.key}`;
    return uploadedUrl;
  } catch (err) {
    console.error('Upload failed:', err);
    alert('File upload failed. Please try again.');
    return '';
  }
};

/**
 * Convert data URL (from camera) to File object
 * @param dataUrl - The data URL from camera capture
 * @param fileName - The name for the file
 * @returns File object
 */
export const dataUrlToFile = (dataUrl: string, fileName: string): File => {
  const arr = dataUrl.split(',');

  if (arr.length < 2 || !arr[0] || !arr[1]) {
    throw new Error('Invalid data URL format');
  }

  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const base64Data = arr[1];

  const bstr = atob(base64Data);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, { type: mime });
};
