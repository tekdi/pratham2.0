const STORAGE_KEY = '_pk_a7f3d9e1';
const TTL_MS = 10 * 60 * 1000; // 10 minutes

interface VerifiedMobilePayload {
  mobile: string;
}

// Key lives only in memory (never persisted) so a hard refresh makes any
// previously stored ciphertext undecryptable — correctly falling back to
// an empty, editable mobile field, same as TTL expiry.
//
// NOTE: this only keeps the mobile number out of the sessionStorage
// inspector. It is NOT proof of verification for the backend — the key
// and these functions are loaded in the page's own JS, so anyone with
// devtools console access can call getVerifiedMobile() directly. The
// account-create endpoint must independently validate that the mobile was
// OTP-verified (see backend requirement in PS-XXXX).
let cryptoKeyPromise: Promise<CryptoKey> | null = null;

const getKey = (): Promise<CryptoKey> => {
  if (!cryptoKeyPromise) {
    cryptoKeyPromise = crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }
  return cryptoKeyPromise;
};

const toBase64 = (buf: ArrayBuffer | Uint8Array<ArrayBuffer>): string => {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const fromBase64 = (b64: string): Uint8Array<ArrayBuffer> => {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

export const setVerifiedMobile = async (
  data: VerifiedMobilePayload
): Promise<void> => {
  if (typeof window === 'undefined') return;
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(
    JSON.stringify({ ...data, expiresAt: Date.now() + TTL_MS })
  );
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  );
  sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ iv: toBase64(iv), data: toBase64(ciphertext) })
  );
};

export const getVerifiedMobile = async (): Promise<VerifiedMobilePayload | null> => {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const { iv, data } = JSON.parse(raw);
    const key = await getKey();
    const plainBuf = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: fromBase64(iv) },
      key,
      fromBase64(data)
    );
    const parsed = JSON.parse(new TextDecoder().decode(plainBuf));
    if (!parsed?.mobile || !parsed?.expiresAt || Date.now() > parsed.expiresAt) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return { mobile: parsed.mobile };
  } catch {
    // Wrong/missing key (e.g. after a hard refresh) or corrupt data.
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const clearVerifiedMobile = (): void => {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(STORAGE_KEY);
  cryptoKeyPromise = null;
};
