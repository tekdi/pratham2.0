import { notFound } from 'next/navigation';
import { absoluteImage, absoluteUrl } from '../seo';
import { buildSeoDescription, buildSeoTitle } from '../seoMeta';
import { fetchContent, hierarchyAPI } from './contentService';

// The content fetchers swallow errors and hand back the rejection, so inspect it
// here. Only a real RESOURCE_NOT_FOUND 404s; transport errors fall through.
const isResourceNotFound = (product: any) => {
  const response = product?.response ?? product?.error?.response;
  return (
    response?.status === 404 ||
    response?.data?.responseCode === 'RESOURCE_NOT_FOUND'
  );
};

export async function getMetadata(
  identifier: any,
  unitId?: any,
  canonicalPath?: string
) {
  let product = { name: '', description: '', appIcon: '', posterImage: '' };
  if (unitId) {
    product = await hierarchyAPI(unitId);
  } else {
    product = await fetchContent(identifier);
  }
  if (isResourceNotFound(product)) {
    notFound();
  }
  // Only the POS routes pass canonicalPath, so the section 4 templates (and the
  // "| Pratham Open School" suffix) apply there and leave other apps untouched.
  const title = canonicalPath ? buildSeoTitle(product) : product?.name;
  const description = canonicalPath
    ? buildSeoDescription(product)
    : product?.description;

  return {
    ...(canonicalPath
      ? { alternates: { canonical: absoluteUrl(canonicalPath) } }
      : {}),
    title,
    description,
    openGraph: {
      title,
      description,
      // og:url mirrors the canonical (audit section 4).
      ...(canonicalPath ? { url: absoluteUrl(canonicalPath) } : {}),
      images: [
        {
          // Item thumbnail when the API has one, else the site banner. Always absolute.
          url: absoluteImage(
            product?.posterImage || product?.appIcon || '/images/image_ver.png'
          ),
          width: 1200,
          height: 630,
          alt: product?.name,
        },
      ],
    },
  };
}
