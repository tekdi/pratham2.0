export const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || "";
if (!TENANT_ID) {
  console.warn('NEXT_PUBLIC_TENANT_ID is not set in the environment variables.');
}
export const TEMPLATE_ID: string = 'cm74egxc0000aoc3gqp2p4fvk';

export const jotFormId = process.env.NEXT_PUBLIC_JOTFORM_ID || '';
if (!jotFormId) {
  console.warn(
    'NEXT_PUBLIC_JOTFORM_ID is not set in the environment variables.'
  );
}
