import React from 'react';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getTenantInfo } from '@learner/utils/API/ProgramService';
import ProgramDetailClient from './ProgramDetailClient';

// This route matches any single root-level segment, so unknown URLs used to render
// the app shell with HTTP 200 (a soft 404). Validate the name on the server instead.
export default async function Page({ params }: any) {
  const programName = decodeURIComponent(params?.programName ?? '').replace(
    /-/g,
    ' '
  );

  let programs: any[] | null = null;
  try {
    const requestHeaders = headers();
    const host = requestHeaders.get('host');
    const proto = requestHeaders.get('x-forwarded-proto') ?? 'https';
    // Tenants whitelist an exact origin, and production is www while the
    // configured POS domain is not, so try both spellings before giving up.
    const origins = host
      ? [
          `${proto}://${host}`,
          `${proto}://${
            host.startsWith('www.') ? host.slice(4) : `www.${host}`
          }`,
        ]
      : [undefined];

    for (const origin of origins) {
      const res = await getTenantInfo(origin);
      if (Array.isArray(res?.result) && res.result.length) {
        programs = res.result;
        break;
      }
    }
  } catch {
    programs = null;
  }

  // Fail open: only 404 when the API gave us a usable list that lacks this program.
  // An error or an empty list means we cannot tell, so render as before.
  const isKnownProgram = programs?.some(
    (p: any) => p?.name?.toLowerCase() === programName.toLowerCase()
  );
  if (programs?.length && !isKnownProgram) {
    notFound();
  }

  return <ProgramDetailClient />;
}
