export const CLOUD_STORAGE_URL = process.env.NEXT_PUBLIC_CLOUD_STORAGE_URL || "";
if (!CLOUD_STORAGE_URL) {
  console.warn('NEXT_PUBLIC_CLOUD_STORAGE_URL is not set in the environment variables.');
}
