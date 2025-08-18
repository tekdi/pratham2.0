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
