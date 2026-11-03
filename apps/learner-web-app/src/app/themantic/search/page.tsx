import { buildMetadata } from '@learner/utils/seo/buildMetadata';
import SearchClient from './SearchClient';

// Canonical ignores the ?q= and filter params so every search combination
// does not become its own indexable URL.
export const metadata = buildMetadata({
  title: 'Search Science Courses & Experiments',
  description:
    'Search free science courses and experiments on energy, environment and health from Experimento India.',
  path: '/themantic/search',
});

export default function ThematicSearchPage() {
  return <SearchClient />;
}
