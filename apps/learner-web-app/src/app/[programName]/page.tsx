import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import axios from 'axios';
import { API_ENDPOINTS } from '@learner/utils/API/EndUrls';
import ProgramDetailClient from './ProgramDetailClient';

// This catch-all used to answer 200 for any unknown path, including
// /robots.txt and /sitemap.xml. Anything with a file extension is never
// a program name.
const looksLikeFile = (value: string) => /\.[a-z0-9]{2,5}$/i.test(value);

async function programExists(programName: string) {
  const headerList = headers();
  const host = headerList.get('host');
  if (!host) return true;

  const isLocal = /^(localhost|127\.0\.0\.1)(:|$)/.test(host);
  const proto =
    headerList.get('x-forwarded-proto') ?? (isLocal ? 'http' : 'https');
  const origin = `${proto}://${host}`;

  const response = await axios.get(API_ENDPOINTS.program);
  const programs = (response?.data?.result ?? [])
    .filter((tenant: any) =>
      tenant?.params?.uiConfig?.enable_domain?.includes(origin)
    )
    .flatMap((tenant: any) => tenant?.children ?? []);

  // No programs for this origin means we cannot judge the name, so don't 404.
  if (programs.length === 0) return true;

  return programs.some(
    (program: any) =>
      program?.name?.toLowerCase() === programName.toLowerCase()
  );
}

export default async function ProgramDetailPage({ params }: any) {
  const raw = decodeURIComponent(params?.programName ?? '');
  if (!raw || looksLikeFile(raw)) notFound();

  let exists = true;
  try {
    exists = await programExists(raw.replace(/-/g, ' '));
  } catch {
    // API unreachable: render the client component rather than 404 a valid page.
    exists = true;
  }

  // Kept outside the try block — notFound() throws, and the catch would eat it.
  if (!exists) notFound();

  return <ProgramDetailClient />;
}
