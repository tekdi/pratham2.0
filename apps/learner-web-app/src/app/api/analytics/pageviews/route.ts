import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import serviceAccount from "../../../../../service-account";

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
    const { searchParams } = new URL(request.url);
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


