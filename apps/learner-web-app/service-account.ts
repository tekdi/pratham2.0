// Prefer a single base64-encoded JSON blob when available to avoid newline issues.
// Fallback to individual env vars if the blob is not provided.
interface ServiceAccountConfig {
  type?: string;
  project_id?: string;
  private_key_id?: string;
  private_key?: string;
  client_email?: string;
  client_id?: string;
  auth_uri?: string;
  token_uri?: string;
  auth_provider_x509_cert_url?: string;
  client_x509_cert_url?: string;
  universe_domain?: string;
}

let decodedFromB64: ServiceAccountConfig | null = null;

if (process.env.GOOGLE_SERVICE_ACCOUNT_B64) {
  try {
    decodedFromB64 = JSON.parse(
      Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_B64, "base64").toString(
        "utf8"
      )
    );
  } catch (error) {
    console.error("Failed to decode GOOGLE_SERVICE_ACCOUNT_B64:", error);
  }
}

// Helper function to properly format private key
function formatPrivateKey(key: string | undefined): string | undefined {
  if (!key) return undefined;
  
  // First, handle the case where the key might be wrapped in quotes
  let formatted = key.replace(/^"|"$/g, '');

  // If it's already properly formatted (has newlines), just return it
  if (formatted.includes('\n') && formatted.includes('-----BEGIN PRIVATE KEY-----')) {
     return formatted;
  }

  // Handle literal "\n" strings (common in .env files)
  if (formatted.includes('\\n')) {
    formatted = formatted.replace(/\\n/g, '\n');
  } else {
    // If no newlines and no literal "\n", it might be a single line string
    // Try to insert newlines around headers if they exist but are on the same line
    formatted = formatted
      .replace('-----BEGIN PRIVATE KEY-----', '-----BEGIN PRIVATE KEY-----\n')
      .replace('-----END PRIVATE KEY-----', '\n-----END PRIVATE KEY-----');
      
    // If the body is still one long string, we might need to chunk it (PEM format usually requires 64 char lines)
    // However, Node's crypto usually handles single-line bodies if headers are correct.
    // Let's at least ensure headers are on their own lines.
  }
  
  // Remove any extra whitespace but preserve the structure
  formatted = formatted.trim();
  
  return formatted;
}

const serviceAccount = decodedFromB64 ?? {
  type: process.env.GOOGLE_TYPE,
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: formatPrivateKey(process.env.GOOGLE_PRIVATE_KEY),
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: process.env.GOOGLE_AUTH_URI,
  token_uri: process.env.GOOGLE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
  universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN,
};

// Ensure private_key is properly formatted even if decoded from base64
if (serviceAccount.private_key && typeof serviceAccount.private_key === "string") {
  serviceAccount.private_key = formatPrivateKey(serviceAccount.private_key);
}

export default serviceAccount;

