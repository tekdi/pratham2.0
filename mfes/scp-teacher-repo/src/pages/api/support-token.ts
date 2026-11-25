import { createHmac, randomUUID } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';

// Handoff pass for the Apps Script support desk. Identity comes from
// /user/auth, never from the browser, so it cannot be forged in DevTools.
const TOKEN_TTL_SECONDS = 60;

type Tenant = { tenantId?: string; tenantName?: string };

type AuthUser = {
  userId?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  tenantData?: Tenant[];
};

const b64url = (input: string) => Buffer.from(input).toString('base64url');

const sign = (signingInput: string, secret: string) =>
  createHmac('sha256', secret).update(signingInput).digest('base64url');

/** Only a programme the user is actually enrolled in can end up on a ticket. */
const resolveProgram = (user: AuthUser, requestedTenantId: string) => {
  const tenants = Array.isArray(user?.tenantData) ? user.tenantData : [];
  const match = tenants.find((x) => x?.tenantId === requestedTenantId);
  return (match ?? tenants[0])?.tenantName || '';
};

/** customFields vary: matched on label or name, value held in selectedValues or value. */
const customFieldValue = (fields: any, label: string) => {
  if (!Array.isArray(fields)) return '';
  const wanted = label.toLowerCase();
  const field = fields.find(
    (f: any) =>
      String(f?.label ?? '').toLowerCase() === wanted ||
      String(f?.name ?? '').toLowerCase() === wanted
  );
  if (!field) return '';
  const selected = Array.isArray(field.selectedValues)
    ? field.selectedValues[0]
    : field.selectedValues ?? field.value;
  if (!selected) return '';
  if (typeof selected === 'string') return selected;
  return String(selected?.value ?? selected?.name ?? selected?.label ?? '');
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const secret = process.env.SUPPORT_JWT_SECRET;
  if (!secret) {
    console.error('SUPPORT_JWT_SECRET is not set in the environment variables.');
    return res.status(500).json({ error: 'not_configured' });
  }

  const authorization = req.headers.authorization || '';
  if (!authorization.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const middleware = process.env.NEXT_PUBLIC_MIDDLEWARE_URL;
  if (!middleware) {
    console.error('NEXT_PUBLIC_MIDDLEWARE_URL is not set.');
    return res.status(500).json({ error: 'not_configured' });
  }

  const requestedTenantId = String(req.body?.tenantId || '');
  const academicYearId = String(req.body?.academicYearId || '');

  let user: AuthUser;
  try {
    // The middleware decides who this token belongs to; the browser has no say.
    const response = await fetch(`${middleware}/user/auth`, {
      headers: { Authorization: authorization },
      cache: 'no-store',
    });
    if (!response.ok) {
      return res.status(401).json({ error: 'unauthorized' });
    }
    const body = await response.json();
    user = body?.result ?? {};
  } catch (error) {
    console.error('support-token: /user/auth lookup failed', error);
    return res.status(502).json({ error: 'auth_lookup_failed' });
  }

  if (!user?.userId) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  // Optional enrichment: state, phone and email live on the full profile.
  // A failure here must not stop the user reaching the support desk.
  let profile: any = {};
  try {
    const response = await fetch(
      // Both spellings: the codebase uses `fieldvalue`, ProfileService `fieldValue`.
      `${middleware}/user/read/${user.userId}?fieldvalue=true&fieldValue=true`,
      {
        // /user/read rejects the request without these; the app's axios
        // interceptor adds them to every call.
        headers: {
          Authorization: authorization,
          ...(requestedTenantId ? { tenantid: requestedTenantId } : {}),
          ...(academicYearId ? { academicyearid: academicYearId } : {}),
        },
        cache: 'no-store',
      }
    );
    if (response.ok) {
      profile = (await response.json())?.result?.userData ?? {};
    }
  } catch (error) {
    console.error('support-token: /user/read lookup failed', error);
  }

  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = b64url(
    JSON.stringify({
      sub: user.userId,
      un: user.username || '',
      nm:
        [user.firstName, user.lastName].filter(Boolean).join(' ') ||
        [profile?.firstName, profile?.lastName].filter(Boolean).join(' '),
      em: user.email || profile?.email || '',
      ph: user.mobile || profile?.mobile || '',
      pg: resolveProgram(user, requestedTenantId),
      st: customFieldValue(profile?.customFields, 'STATE'),
      ap: 'LMP', // App name shown on the ticket; fixed per portal.
      iat: now,
      exp: now + TOKEN_TTL_SECONDS,
      jti: randomUUID(),
    })
  );
  const signingInput = `${header}.${payload}`;

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({
    token: `${signingInput}.${sign(signingInput, secret)}`,
    expiresIn: TOKEN_TTL_SECONDS,
  });
}
