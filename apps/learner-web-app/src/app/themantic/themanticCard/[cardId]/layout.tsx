import React from 'react';
import { buildMetadata } from '@learner/utils/seo/buildMetadata';

// The page itself is a client component, so its metadata lives here.
export const metadata = buildMetadata({
  title: 'Science Learning Themes',
  description:
    'Explore energy, environment and health learning themes from Experimento India.',
  path: '/themantic',
});

export default function ThematicCardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
