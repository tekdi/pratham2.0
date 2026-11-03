import { buildMetadata } from '../seo/buildMetadata';
import { getContent, getHierarchy } from '../seo/contentData';

type MetadataOptions = {
  /** Path on this site, used for the canonical URL. */
  path?: string;
  type?: 'website' | 'article' | 'video.other';
  noindex?: boolean;
};

export async function getMetadata(
  identifier: any,
  unitId?: any,
  options: MetadataOptions = {}
) {
  // Cached, so the page body can reuse the same response for JSON-LD.
  const product = unitId
    ? await getHierarchy(unitId)
    : await getContent(identifier);

  return buildMetadata({
    title: product?.name,
    description: product?.description,
    image: product?.posterImage || product?.appIcon,
    ...options,
  });
}
