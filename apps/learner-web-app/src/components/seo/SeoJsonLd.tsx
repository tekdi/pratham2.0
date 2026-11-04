// Server component on purpose: unlike SeoSsrContent this must stay in the DOM
// after hydration, since Google reads structured data from the rendered page too.
export default function SeoJsonLd({ items }: { items?: (object | null)[] }) {
  const nodes = (items ?? []).filter(Boolean);
  if (!nodes.length) return null;

  return (
    <>
      {nodes.map((node, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
        />
      ))}
    </>
  );
}
