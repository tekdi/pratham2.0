export const tenantId =
  typeof window !== 'undefined' && localStorage.getItem('tenantId');

if (!tenantId && typeof window !== 'undefined') {
  console.warn(
    'NEXT_PUBLIC_TENANT_ID is not set in the environment variables.'
  );
}

export const CONTEXT_TYPE_LABELS: Record<string, string> = {
  self: 'Self',
  learner: 'Learner',
  center: 'Center',
  teacher: 'Teacher',
  none: 'General',
};
