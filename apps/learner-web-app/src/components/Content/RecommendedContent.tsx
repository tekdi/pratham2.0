'use client';
import React, { useEffect, useState } from 'react';
import { Box, Skeleton, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@shared-lib';
import { getRecommendedContent } from '@learner/utils/API/recommendationService';
import {
  addExcludeContentId,
  getExcludeContentIds,
  resetExcludeContentIds,
} from '@learner/utils/recommendationExclusion';
import { RecommendedContentItem } from '@learner/utils/Interface';
import RecommendedContentCard from './RecommendedContentCard';

const RECOMMENDATION_COUNT = 5;

const RecommendedContent = ({
  currentContentId,
  courseId,
  unitId,
  contentBaseUrl,
}: {
  currentContentId?: string;
  courseId?: string;
  unitId?: string;
  contentBaseUrl?: string;
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [items, setItems] = useState<RecommendedContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Runs once per content load (mount / currentContentId change) only —
  // this component stays mounted across tab switches (Player.tsx toggles it
  // with display none/block, it never unmounts), so switching tabs back and
  // forth never re-triggers this fetch.
  useEffect(() => {
    if (!currentContentId) return;

    let ignore = false;
    setIsLoading(true);
    setHasError(false);
    setItems([]);

    const isRecommendationJourney =
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('rec') === '1';

    if (!isRecommendationJourney) {
      resetExcludeContentIds();
    }

    const excludeContentIds = getExcludeContentIds().filter(
      (id) => id !== currentContentId
    );

    getRecommendedContent({
      currentContentId,
      excludeContentIds,
      count: RECOMMENDATION_COUNT,
    })
      .then((response) => {
        if (ignore) return;
        setItems(response?.content || []);
      })
      .catch(() => {
        if (ignore) return;
        setHasError(true);
      })
      .finally(() => {
        if (ignore) return;
        setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [currentContentId]);

  const handleOpen = (identifier: string) => {
    if (!currentContentId) return;
    addExcludeContentId(currentContentId);

    // Carry the original returnUrl/activeLink/exitLink through unchanged —
    // Player.tsx reads this same param for its own back-button handling.
    // Re-deriving it from the current (already-encoded) URL on every hop
    // would nest it deeper each time and eventually corrupt it.
    const params = new URLSearchParams();
    params.set('rec', '1');
    // Explicit flag carried through the route so Player.tsx doesn't have to
    // infer POS context from the URL shape alone.
    params.set('isPOSContent', 'true');
    if (typeof window !== 'undefined') {
      const currentParams = new URLSearchParams(window.location.search);
      const existingReturnUrl =
        currentParams.get('returnUrl') ||
        currentParams.get('activeLink') ||
        currentParams.get('exitLink');
      if (existingReturnUrl) {
        params.set('returnUrl', existingReturnUrl);
      }
    }

    // Stay on the same /pos/content/{courseId}/{unitId}/{identifier} route
    // shape used to open the current content, so the recommended content
    // keeps the full POS layout (header, footer, Related/Recommended tabs).
    const href =
      contentBaseUrl && courseId && unitId
        ? `${contentBaseUrl}/${courseId}/${unitId}/${identifier}?${params.toString()}`
        : `/pos/player/${identifier}?${params.toString()}`;
    router.push(href);
  };

  if (isLoading) {
    return (
      <Box>
        {[1, 2, 3].map((key) => (
          <Skeleton
            key={key}
            variant="rounded"
            height={140}
            sx={{ mb: 2, borderRadius: '12px' }}
          />
        ))}
      </Box>
    );
  }

  if (hasError) {
    return (
      <Typography variant="body2" sx={{ color: 'text.secondary', p: 2 }}>
        {t('LEARNER_APP.PLAYER.RECOMMENDATION_ERROR')}
      </Typography>
    );
  }

  if (!items?.length) {
    return (
      <Box sx={{ textAlign: 'center', p: 3 }}>
        <Typography variant="h4" component="div" sx={{ mb: 1 }}>
          📚
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('LEARNER_APP.PLAYER.RECOMMENDATION_EMPTY_STATE')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {items.map((item) => (
        <RecommendedContentCard
          key={item.identifier}
          item={item}
          onOpen={handleOpen}
        />
      ))}
    </Box>
  );
};

export default RecommendedContent;
