import dynamic from 'next/dynamic';

const Search = dynamic(() => import('@learner/components/themantic/Search'), {
  ssr: false,
});

// Search result pages must not be indexed, but their links should still be
// followed so crawlers can reach the content behind them.
export function generateMetadata({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = (searchParams?.q ?? '').trim();

  return {
    title: query
      ? `Search results for "${query}" | Experimento India`
      : 'Search | Experimento India',
    robots: { index: false, follow: true },
  };
}

export default function ThemanticSearchPage() {
  return (
    <div className="thematic-page">
      <Search />
    </div>
  );
}
