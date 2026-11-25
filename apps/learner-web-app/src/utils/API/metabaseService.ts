import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { absoluteUrl, siteFromHeaders, SITE_URL } from '../seo';
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

// The fetchers return the rejection instead of throwing, and an AxiosError has a
// string `name`, so a transport failure would otherwise become the page title
// ("AxiosError | Pratham Open School"). A real item always carries an identifier.
const isRealContent = (product: any) =>
  !!product &&
  !(product instanceof Error) &&
  !product.isAxiosError &&
  !product.error &&
  typeof product.name === 'string' &&
  !!product.identifier;

// Taken from the path rather than the host, so it stays correct on dev and QA
// where the host does not identify the site.
const brandFor = (canonicalPath?: string) =>
  canonicalPath?.startsWith('/themantic')
    ? 'Experimento India'
    : 'Pratham Open School';

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

  // A transport error (timeout, 5xx, DNS) is not a 404, so fall back to plain site
  // metadata rather than publishing the error object as the title.
  if (!isRealContent(product)) {
    product = { name: '', description: '', appIcon: '', posterImage: '' };
  }

  // Only routes that pass canonicalPath get the templated title, canonical and
  // absolute OG image; other apps sharing this helper are left untouched.
  if (!canonicalPath) {
    return {
      title: product?.name,
      description: product?.description,
      openGraph: {
        title: product?.name,
        description: product?.description,
        images: [
          {
            url:
              product?.posterImage ||
              product?.appIcon ||
              '/images/image_ver.png',
            alt: product?.name,
          },
        ],
      },
    };
  }

  const brand = brandFor(canonicalPath);
  const title = buildSeoTitle(product, brand);
  const description = buildSeoDescription(product, brand);
  const origin = siteFromHeaders(headers())?.origin ?? SITE_URL;
  const canonical = absoluteUrl(canonicalPath, origin);

  // og:image must be absolute; an already-absolute CDN URL passes through.
  const image = product?.posterImage || product?.appIcon;
  const ogImage =
    image && /^https?:\/\//i.test(image)
      ? image
      : absoluteUrl(image || '/images/image_ver.png', origin);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      // No width/height: content thumbnails are not 1200x630, and a declared size
      // that does not match the file makes Slack drop the preview image.
      images: [{ url: ogImage, alt: product?.name }],
    },
    // Without this the page inherits the site-wide banner instead of the item image.
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}
