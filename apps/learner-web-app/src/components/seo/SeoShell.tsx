import React from 'react';

export type ShellLink = { name: string; path: string };

/**
 * Server-rendered version of a listing or content page: a real heading,
 * description and plain <a> links, so crawlers get text and an internal
 * link graph. Shown until the interactive widget mounts.
 */
export default function SeoShell({
  title,
  description,
  crumbs = [],
  items = [],
  itemsLabel,
}: {
  title?: string;
  description?: string;
  crumbs?: ShellLink[];
  items?: ShellLink[];
  itemsLabel?: string;
}) {
  if (!title) return null;

  return (
    <div className="seo-shell">
      {crumbs.length > 1 && (
        <nav aria-label="Breadcrumb">
          <ol className="seo-shell__crumbs">
            {crumbs.map((crumb, index) => (
              <li key={crumb.path}>
                {index === crumbs.length - 1 ? (
                  <span>{crumb.name}</span>
                ) : (
                  <a href={crumb.path}>{crumb.name}</a>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <h1 className="seo-shell__title">{title}</h1>
      {description && <p className="seo-shell__description">{description}</p>}

      {items.length > 0 && (
        <>
          {itemsLabel && <h2 className="seo-shell__subtitle">{itemsLabel}</h2>}
          <ul className="seo-shell__items">
            {items.map((item) => (
              <li key={item.path}>
                <a href={item.path}>{item.name}</a>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
