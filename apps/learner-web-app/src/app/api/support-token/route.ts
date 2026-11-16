import { createHmac, randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Handoff pass for the Apps Script support desk. Identity comes from
// /user/auth, never from the browser, so it cannot be forged in DevTools.
const TOKEN_TTL_SECONDS = 60;

type Tenant = {
  tenantId?: string;
  tenantName?: string;
  tenantStatus?: string;
};

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

export async function POST(request: NextRequest) {
  const secret = process.env.SUPPORT_JWT_SECRET;
  if (!secret) {
    console.error('SUPPORT_JWT_SECRET is not set in the environment variables.');
    return NextResponse.json({ error: 'not_configured' }, { status: 500 });
  }

  const authorization = request.headers.get('authorization') || '';
  if (!authorization.toLowerCase().startsWith('bearer ')) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const middleware = process.env.NEXT_PUBLIC_MIDDLEWARE_URL;
  if (!middleware) {
    console.error('NEXT_PUBLIC_MIDDLEWARE_URL is not set.');
    return NextResponse.json({ error: 'not_configured' }, { status: 500 });
  }

  let requestedTenantId = '';
  let academicYearId = '';
  try {
    const body = await request.json();
    requestedTenantId = String(body?.tenantId || '');
    academicYearId = String(body?.academicYearId || '');
  } catch (error) {
    requestedTenantId = '';
  }

  let user: AuthUser;
  try {
    // The middleware decides who this token belongs to; the browser has no say.
    const response = await fetch(`${middleware}/user/auth`, {
      headers: { Authorization: authorization },
      cache: 'no-store',
    });
    if (!response.ok) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
    const body = await response.json();
    user = body?.result ?? {};
  } catch (error) {
    console.error('support-token: /user/auth lookup failed', error);
    return NextResponse.json({ error: 'auth_lookup_failed' }, { status: 502 });
  }

  if (!user?.userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  // Optional enrichment: state, phone and email live on the full profile.
  // A failure here must not stop the learner reaching the support desk.
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
      iat: now,
      exp: now + TOKEN_TTL_SECONDS,
      jti: randomUUID(),
    })
  );
  const signingInput = `${header}.${payload}`;

  return NextResponse.json(
    {
      token: `${signingInput}.${sign(signingInput, secret)}`,
      expiresIn: TOKEN_TTL_SECONDS,
    },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
