'use client';

import { useEffect, useState } from 'react';
import type { SeoBlockData } from '@learner/utils/API/seoContent';

// The POS pages load their UI with dynamic(..., { ssr: false }), so the server sent
// almost no HTML. This renders the page's heading, description, breadcrumb and first
// page of links into the server response, then steps aside once the real UI mounts.
export default function SeoSsrContent({ data }: { data: SeoBlockData | null }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  if (!data || hydrated) return null;

  const { heading, description, breadcrumbs, links } = data;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
      {breadcrumbs?.length ? (
        <nav aria-label="breadcrumb">
          <ol style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', listStyle: 'none', padding: 0 }}>
            {breadcrumbs.map((crumb) => (
              <li key={crumb.href}>
                <a href={crumb.href}>{crumb.name}</a>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <h1>{heading}</h1>

      {description ? <p>{description}</p> : null}

      {links?.length ? (
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.name}</a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
