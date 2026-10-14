'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Box, Skeleton, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@shared-lib';
import {
  getAssessmentsByIds,
  getAssessmentStatusSummary,
} from '@learner/utils/API/AssesmentService';
import {
  getQuestionSetId,
  groupByAssessmentType,
  VtQuestionSet,
} from '@learner/utils/helpers/vtAssessmentHelpers';
import CategoryCard from './CategoryCard';

interface CategoryRow {
  type: string;
  status?: string;
  percentage?: number | string;
}

/**
 * Assessment tab of /l2-courses: the categories (Pre Test, Post Test, …) built
 * from the question sets attached to the learner's batch.
 */
const AssessmentCategoryList: React.FC<{ assessmentIds: string[] }> = ({
  assessmentIds,
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [categories, setCategories] = useState<CategoryRow[] | null>(null);
  const [hasError, setHasError] = useState(false);

  // Keyed on the id list, not the batch object: the eligibility hook re-polls
  // every 3 seconds and hands back a fresh object each time, which would
  // otherwise re-run this fetch on every tick.
  const assessmentIdsKey = assessmentIds.join(',');

  const load = useCallback(async () => {
    const userId =
      typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    const ids = assessmentIdsKey ? assessmentIdsKey.split(',') : [];

    // No assessment attached to the batch → "No data found", and no search call.
    if (!ids.length || !userId) {
      setCategories([]);
      return;
    }

    setHasError(false);
    try {
      const questionSets = (await getAssessmentsByIds(ids)) as VtQuestionSet[];
      const groups = groupByAssessmentType(questionSets);

      const rows = await Promise.all(
        groups.map(async ({ type, items }) => {
          const categoryIds = items.map(getQuestionSetId).filter(Boolean);
          const summary = await getAssessmentStatusSummary({
            userId: [userId],
            courseId: categoryIds,
            unitId: categoryIds,
            contentId: categoryIds,
          });
          return {
            type,
            status: summary?.[0]?.status as string | undefined,
            percentage: summary?.[0]?.percentage,
          };
        })
      );
      setCategories(rows);
    } catch (error) {
      console.error('AssessmentCategoryList: failed to load categories', error);
      setHasError(true);
      setCategories([]);
    }
  }, [assessmentIdsKey]);

  useEffect(() => {
    load();
  }, [load]);

  if (categories === null) {
    return (
      <Box>
        {[0, 1, 2].map((index) => (
          <Skeleton
            key={index}
            variant="rounded"
            height={76}
            sx={{ mb: 1.5, borderRadius: '8px' }}
          />
        ))}
      </Box>
    );
  }

  if (hasError) {
    return (
      <Typography sx={{ color: '#7C766F' }}>
        {t('LEARNER_APP.VT_ASSESSMENT.LOAD_ERROR')}
      </Typography>
    );
  }

  if (categories.length === 0) {
    return (
      <Typography sx={{ color: '#7C766F' }}>
        {t('LEARNER_APP.VT_ASSESSMENT.NO_DATA_FOUND')}
      </Typography>
    );
  }

  return (
    <Box>
      {categories.map((category) => (
        <CategoryCard
          key={category.type}
          type={category.type}
          status={category.status}
          percentage={category.percentage}
          onClick={() =>
            router.push(`/l2-courses/${encodeURIComponent(category.type)}`)
          }
        />
      ))}
    </Box>
  );
};

export default AssessmentCategoryList;
