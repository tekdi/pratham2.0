"use client";

import { useEffect, useState } from "react";

type PageViewResponse = {
  pageViews?: number;
  error?: string;
};

export function usePageViewCount(path: string | null | undefined) {
  const [pageViews, setPageViews] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!path) return undefined;

    let cancelled = false;

    const fetchPageViews = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_LEARNER_SBPLAYER?.replace("/sbplayer", "")}/api/analytics/pageviews?path=${encodeURIComponent(path)}`
        );
        
         
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

