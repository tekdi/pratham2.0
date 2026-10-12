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
import { CategoryCard, VtAssessmentShell } from '@learner/components/VtAssessment';

interface CategoryRow {
  type: string;
  status?: string;
  percentage?: number | string;
}

const AssessmentCategoryList: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [categories, setCategories] = useState<CategoryRow[] | null>(null);
  const [hasError, setHasError] = useState(false);

  const loadCategories = useCallback(async (assessmentIds: string[]) => {
    const userId =
      typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

    // No assessment attached to the batch → "No data found", and no search call.
    if (!assessmentIds.length || !userId) {
      setCategories([]);
      return;
    }

    setHasError(false);
    try {
      const questionSets = (await getAssessmentsByIds(
        assessmentIds
      )) as VtQuestionSet[];
      const groups = groupByAssessmentType(questionSets);

      const rows = await Promise.all(
        groups.map(async ({ type, items }) => {
          const ids = items.map(getQuestionSetId).filter(Boolean);
          const summary = await getAssessmentStatusSummary({
            userId: [userId],
            courseId: ids,
            unitId: ids,
            contentId: ids,
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
      console.error('Assessment: failed to load categories', error);
      setHasError(true);
      setCategories([]);
    }
  }, []);

  return (
    <VtAssessmentShell title={t('LEARNER_APP.VT_ASSESSMENT.TITLE')}>
      {({ assessmentIds }) => (
        <CategoryListBody
          assessmentIds={assessmentIds}
          categories={categories}
          hasError={hasError}
          onLoad={loadCategories}
          onSelect={(type) =>
            router.push(`/assessment/${encodeURIComponent(type)}`)
          }
        />
      )}
    </VtAssessmentShell>
  );
};

const CategoryListBody: React.FC<{
  assessmentIds: string[];
  categories: CategoryRow[] | null;
  hasError: boolean;
  onLoad: (ids: string[]) => void;
  onSelect: (type: string) => void;
}> = ({ assessmentIds, categories, hasError, onLoad, onSelect }) => {
  const { t } = useTranslation();

  // Keyed on the id list, not the batch object: the eligibility hook re-polls
  // every 3 seconds and hands back a fresh object each time, which would
  // otherwise re-run this fetch on every tick.
  const assessmentIdsKey = assessmentIds.join(',');
  useEffect(() => {
    onLoad(assessmentIdsKey ? assessmentIdsKey.split(',') : []);
  }, [assessmentIdsKey, onLoad]);

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
          onClick={() => onSelect(category.type)}
        />
      ))}
    </Box>
  );
};

export default AssessmentCategoryList;
