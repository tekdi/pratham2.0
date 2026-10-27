import { notFound } from 'next/navigation';
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

export async function getMetadata(identifier: any, unitId?: any) {
  let product = { name: '', description: '', appIcon: '', posterImage: '' };
  if (unitId) {
    product = await hierarchyAPI(unitId);
  } else {
    product = await fetchContent(identifier);
  }
  if (isResourceNotFound(product)) {
    notFound();
  }
  return {
    title: product?.name,
    description: product?.description,
    openGraph: {
      title: product?.name,
      description: product?.description,
      images: [
        {
          url:
            product?.posterImage || product?.appIcon || '/images/image_ver.png',
          width: 1200,
          height: 630,
          alt: product?.name,
        },
      ],
    },
  };
}
