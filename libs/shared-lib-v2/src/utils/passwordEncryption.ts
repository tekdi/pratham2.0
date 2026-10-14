// Frontend password encryption (CWE-319 – PS-7444).
// Passwords are encrypted with the backend's RSA public key (RSA-OAEP + SHA-256)
// before they leave the browser; only the backend holds the private key.
// The public key comes from frontend configuration, never from an API.

export const PASSWORD_ENCRYPTION_ERROR = 'PASSWORD_ENCRYPTION_FAILED';

let publicKeyPromise: Promise<CryptoKey> | null = null;

// Must be referenced literally so Next.js inlines it into the client bundle
const getPublicKeyPem = (): string =>
  process.env.NEXT_PUBLIC_PASSWORD_ENCRYPTION_PUBLIC_KEY || '';

const passwordEncryptionError = (message: string) => {
  const error: any = new Error(message);
  error.code = PASSWORD_ENCRYPTION_ERROR;
  return error;
};

const pemToArrayBuffer = (pem: string): ArrayBuffer => {
  const base64 = pem
    .replace(/-----(BEGIN|END) PUBLIC KEY-----/g, '')
    // Env files carry the PEM on one line with "\n" (or "\\n") separators;
    // drop those and any whitespace, keeping only the Base64 body
    .replace(/\\n/g, '')
    .replace(/[^A-Za-z0-9+/=]/g, '');

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = '';
  new Uint8Array(buffer).forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
};

const importPublicKey = (publicKeyPem: string): Promise<CryptoKey> =>
  crypto.subtle.importKey(
    'spki',
    pemToArrayBuffer(publicKeyPem),
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    false,
    ['encrypt']
  );

// The configured key never changes at runtime, so import it once
const getPublicKey = (): Promise<CryptoKey> => {
  if (!publicKeyPromise) {
    publicKeyPromise = importPublicKey(getPublicKeyPem()).catch((error) => {
      publicKeyPromise = null;
      throw error;
    });
  }
  return publicKeyPromise;
};

// Returns the password as Base64 RSA-OAEP ciphertext. Throws (code
// PASSWORD_ENCRYPTION_ERROR) when it cannot be encrypted, so the caller must
// not fall back to sending the plain password.
export const encryptPassword = async (
  password: string | number
): Promise<string> => {
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    // Web Crypto is only available in the browser over HTTPS (or localhost)
    throw passwordEncryptionError('Web Crypto API is not available');
  }
  if (!getPublicKeyPem()) {
    throw passwordEncryptionError(
      'Password encryption public key is not configured'
    );
  }

  try {
    const publicKey = await getPublicKey();
    const encrypted = await crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      publicKey,
      new TextEncoder().encode(String(password))
    );
    return arrayBufferToBase64(encrypted);
  } catch (error: any) {
    // Only the key/crypto failure reason is surfaced, never the password
    throw passwordEncryptionError(
      `Password encryption failed: ${error?.message || error}`
    );
  }
};

// Returns a copy of the payload with its password field encrypted. The original
// object is left untouched because callers reuse the plain password afterwards
// (e.g. in the new-user credentials notification).
export const withEncryptedPassword = async <T extends Record<string, any>>(
  payload: T,
  field: keyof T = 'password'
): Promise<T> => {
  const value = payload?.[field];
  if (value === undefined || value === null || value === '') return payload;
  return { ...payload, [field]: await encryptPassword(value) };
};
