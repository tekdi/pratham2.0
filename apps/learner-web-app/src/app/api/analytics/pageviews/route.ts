import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
// import serviceAccount from "../../../../utils/service-account";
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
}console.log("Analytics Route Module Loading...");

const PROPERTY_ID = (process.env.GOOGLE_ANALYTICS_PROPERTY_ID || "496861567").replace(/['"]/g, '');

// Lazy initialization function - only called when route is accessed, not at build time
function getAnalyticsClient(): BetaAnalyticsDataClient {
  if (!process.env.GOOGLE_ANALYTICS_PROPERTY_ID) {
    console.warn("GOOGLE_ANALYTICS_PROPERTY_ID is not set, using default.");
  }

  // Validate service account credentials
  if (!serviceAccount.client_email || !serviceAccount.private_key) {
    console.error("Service account validation failed:", {
      hasClientEmail: !!serviceAccount.client_email,
      hasPrivateKey: !!serviceAccount.private_key,
      privateKeyLength: serviceAccount.private_key?.length,
      privateKeyPreview: serviceAccount.private_key?.substring(0, 50),
    });
    throw new Error(
      "Missing GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY environment variables."
    );
  }

  // Validate private key format
  if (!serviceAccount.private_key.includes("BEGIN PRIVATE KEY") && 
      !serviceAccount.private_key.includes("BEGIN RSA PRIVATE KEY")) {
    console.error("Private key format validation failed:", {
      keyPreview: serviceAccount.private_key.substring(0, 100),
    });
    throw new Error("Invalid private key format. Key must be in PEM format.");
  }

  // Debug log for key format (safely)
  const keyLines = serviceAccount.private_key.split('\n');
  console.log('Private key format check:', {
    lineCount: keyLines.length,
    hasHeader: keyLines[0]?.includes('BEGIN PRIVATE KEY'),
    hasFooter: keyLines[keyLines.length - 1]?.includes('END PRIVATE KEY'),
    firstLineLength: keyLines[0]?.length,
    secondLineLength: keyLines[1]?.length, // Should be body content
  });

  try {
    return new BetaAnalyticsDataClient({
      credentials: {
        client_email: serviceAccount.client_email,
        private_key: serviceAccount.private_key,
      },
      projectId: serviceAccount.project_id,
    });
  } catch (error) {
    console.error("Failed to initialize AnalyticsDataClient:", error);
    throw new Error(
      `Failed to initialize Google Analytics client: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    console.log("Analytics Route Handler Called");
    const { searchParams } = new URL(request.url);
    
    // Health check for debugging deployment
    if (searchParams.get("test") === "true") {
      return NextResponse.json({ 
        status: "ok", 
        message: "Analytics route is reachable",
        hasServiceAccount: !!serviceAccount,
        hasClientEmail: !!serviceAccount?.client_email
      });
    }

    const pagePath = searchParams.get("path");
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    if (!pagePath) {
      return NextResponse.json(
        { error: "Query parameter 'path' is required" },
        { status: 400 }
      );
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    let startDate: string;
    let endDate: string;

    if (startDateParam || endDateParam) {
      if (!startDateParam || !endDateParam) {
        return NextResponse.json(
          { error: "Both 'startDate' and 'endDate' are required" },
          { status: 400 }
        );
      }

      if (!dateRegex.test(startDateParam) || !dateRegex.test(endDateParam)) {
        return NextResponse.json(
          { error: "Dates must be in YYYY-MM-DD format" },
          { status: 400 }
        );
      }

      startDate = startDateParam;
      endDate = endDateParam;
    } else {
      const now = new Date();
      const end = now.toISOString().slice(0, 10);
      // Default to start date of 25th December 2024
      startDate = "2024-12-25";
      endDate = end;
    }

    const analyticsDataClient = getAnalyticsClient();
    const [report] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      //dimensions: [{ name: "pagePath" }],
      dimensions: [
        { name: "pagePath" },
        { name: "eventName" },
      ],
    //  metrics: [{ name: "screenPageViews" }],
    metrics: [{ name: "eventCount" }],
 
dimensionFilter: {
  andGroup: {
    expressions: [
      {
        filter: {
          fieldName: "pagePath",
          stringFilter: { matchType: "EXACT", value: pagePath },
        },
      },
      {
        filter: {
          fieldName: "eventName",
          stringFilter: { matchType: "EXACT", value: "page_view" },
        },
      },
    ],
  },
},

      // dimensionFilter: {
      //   filter: {
      //     fieldName: "pagePath",
      //     stringFilter: { matchType: "EXACT", value: pagePath },
      //   },
      // },
      dateRanges: [{ startDate, endDate }],
      limit: 1,
    });

    const rawValue = report.rows?.[0]?.metricValues?.[0]?.value ?? "0";
    const pageViews = Number.parseInt(rawValue, 10) || 0;

    return NextResponse.json({ pageViews });
  } catch (error) {
    let message = "Failed to fetch page views";
    
    if (error instanceof Error) {
      message = error.message;
      
      // Provide more helpful error messages for common issues
      if (error.message.includes("DECODER") || error.message.includes("unsupported")) {
        message = "Authentication error: Invalid service account credentials. Please check your GOOGLE_PRIVATE_KEY format.";
      } else if (error.message.includes("PERMISSION_DENIED")) {
        message = "Permission denied: Service account does not have access to this Google Analytics property.";
      } else if (error.message.includes("UNAUTHENTICATED")) {
        message = "Authentication failed: Invalid service account credentials.";
      }
    }

    console.error("GA4 pageviews API error:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      errorType: error?.constructor?.name,
    });

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
