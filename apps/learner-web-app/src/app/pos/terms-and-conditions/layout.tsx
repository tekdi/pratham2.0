import React from 'react';
import { buildMetadata } from '@learner/utils/seo/buildMetadata';

// The page itself is a client component, so its metadata lives here.
export const metadata = buildMetadata({
  title: 'Terms and Conditions',
  description:
    'Terms and conditions for using Pratham Open School and its free learning content.',
  path: '/pos/terms-and-conditions',
});

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
