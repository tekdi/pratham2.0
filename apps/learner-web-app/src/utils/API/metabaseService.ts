import { fetchContent } from './contentService';

export async function getMetadata(identifier: any) {
  const product = await fetchContent(identifier);
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [
        {
          url: product.posterImage,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
  };
}
