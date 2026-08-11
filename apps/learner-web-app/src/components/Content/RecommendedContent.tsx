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

const RecommendedContent = ({ currentContentId }: { currentContentId?: string }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [items, setItems] = useState<RecommendedContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

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

    const params = new URLSearchParams();
    params.set('rec', '1');
    if (typeof window !== 'undefined') {
      params.set('returnUrl', window.location.pathname + window.location.search);
    }
    router.push(`/player/${identifier}?${params.toString()}`);
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
