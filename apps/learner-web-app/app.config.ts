export const tenantId =
  typeof window !== 'undefined' && localStorage.getItem('tenantId');

if (!tenantId && typeof window !== 'undefined') {
  console.warn(
    'NEXT_PUBLIC_TENANT_ID is not set in the environment variables.'
  );
}
export const jotFormId = process.env.NEXT_PUBLIC_JOTFORM_ID || '';
if (!jotFormId) {
  console.warn(
    'NEXT_PUBLIC_JOTFORM_ID is not set in the environment variables.'
  );
}

// JotForm ID for content download form
export const CONTENT_DOWNLOAD_JOTFORM_ID =
  process.env.NEXT_PUBLIC_CONTENT_DOWNLOAD_JOTFORM_ID || '';
if (!CONTENT_DOWNLOAD_JOTFORM_ID) {
  console.warn(
    'NEXT_PUBLIC_CONTENT_DOWNLOAD_JOTFORM_ID is not set in the environment variables.'
  );
}
