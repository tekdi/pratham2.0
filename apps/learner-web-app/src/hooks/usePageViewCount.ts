"use client";

import { useEffect, useState } from "react";

type PageViewResponse = {
  pageViews?: number;
  error?: string;
};

// Pass a specific path to get views for that page, or omit (pass null/undefined)
// to get the total page_view count across ALL pages.
export function usePageViewCount(path?: string | null) {
  const [pageViews, setPageViews] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchPageViews = async () => {
      setLoading(true);
      setError(null);

      try {
        const baseUrl = `${process.env.NEXT_PUBLIC_LEARNER_SBPLAYER?.replace("/sbplayer", "")}/api/analytics/pageviews`;
        // If a path is provided, filter by that page; otherwise fetch the grand total
        const url = path
          ? `${baseUrl}?path=${encodeURIComponent(path)}`
          : baseUrl;

        const response = await fetch(url);
        
         
        const data: PageViewResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to fetch page views");
        }

        if (!cancelled) {
          setPageViews(data.pageViews ?? 0);
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Unexpected error";
          setError(message);
          setPageViews(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchPageViews();

    return () => {
      cancelled = true;
    };
  }, [path]);

  return { pageViews, loading, error };
}

