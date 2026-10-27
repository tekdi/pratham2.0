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

  const { heading, description, breadcrumbs, links, pagination } = data;

  // A short window around the current page plus first/last, so a crawler can walk
  // the whole pillar without any one page emitting hundreds of links.
  const pageLinks: number[] = [];
  if (pagination && pagination.totalPages > 1) {
    const { page, totalPages } = pagination;
    for (let n = Math.max(1, page - 2); n <= Math.min(totalPages, page + 2); n++) {
      pageLinks.push(n);
    }
    if (!pageLinks.includes(1)) pageLinks.unshift(1);
    if (!pageLinks.includes(totalPages)) pageLinks.push(totalPages);
  }

  const pageHref = (n: number) =>
    n <= 1 ? pagination?.basePath ?? '' : `${pagination?.basePath}?page=${n}`;

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

      {pageLinks.length > 1 && pagination ? (
        <nav aria-label="pagination">
          <ol style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', listStyle: 'none', padding: 0 }}>
            {pagination.page > 1 ? (
              <li>
                <a href={pageHref(pagination.page - 1)} rel="prev">
                  Previous
                </a>
              </li>
            ) : null}
            {pageLinks.map((n) => (
              <li key={n}>
                <a href={pageHref(n)} aria-current={n === pagination.page ? 'page' : undefined}>
                  {n}
                </a>
              </li>
            ))}
            {pagination.page < pagination.totalPages ? (
              <li>
                <a href={pageHref(pagination.page + 1)} rel="next">
                  Next
                </a>
              </li>
            ) : null}
          </ol>
        </nav>
      ) : null}
    </div>
  );
}
