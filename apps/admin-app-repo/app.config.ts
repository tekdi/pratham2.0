export const TENANT_ID = (typeof window !== 'undefined' && localStorage.getItem('tenantId')) || ""
if (!TENANT_ID) {
  console.warn('NEXT_PUBLIC_TENANT_ID is not set in the environment variables.');
}
export const TEMPLATE_ID: string = 'cm7nbogii000moc3gth63l863';

export const jotFormId = process.env.NEXT_PUBLIC_JOTFORM_ID || '';
if (!jotFormId) {
  console.warn(
    'NEXT_PUBLIC_JOTFORM_ID is not set in the environment variables.'
  );
}

// Google Apps Script web app URL for the support request form
export const supportRequestAppScriptUrl =
  process.env.NEXT_PUBLIC_SUPPORT_APPSCRIPT_URL || '';
if (!supportRequestAppScriptUrl) {
  console.warn(
    'NEXT_PUBLIC_SUPPORT_APPSCRIPT_URL is not set in the environment variables.'
  );
}
