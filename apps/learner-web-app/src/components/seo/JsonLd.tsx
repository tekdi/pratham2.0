import React from 'react';

// Escaping '<' stops a stray "</script>" inside API-supplied text from
// breaking out of the tag.
const serialize = (data: unknown) =>
  JSON.stringify(data).replace(/</g, '\\u003c');

export default function JsonLd({ data }: { data: unknown | unknown[] }) {
  const blocks = Array.isArray(data) ? data : [data];

  return (
    <>
      {blocks.filter(Boolean).map((block, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serialize(block) }}
        />
      ))}
    </>
  );
}
