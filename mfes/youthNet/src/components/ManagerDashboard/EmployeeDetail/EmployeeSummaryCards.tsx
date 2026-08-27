import React from 'react';
import { Grid } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { EmployeeProgressCategorySummary, EmployeeSummaryCardsProps } from '../../../utils/Interface';
import EmployeeSummaryCard from './EmployeeSummaryCard';

// Mandatory/Non-mandatory breakdown line for the Completed / In Progress cards — shown as a mixed
// count only once both categories are actually represented, otherwise falls back to the single
// "Mandatory courses" wording the design uses when a category is empty.
const getCategorySubtitle = (
  category: EmployeeProgressCategorySummary,
  t: (key: string, options?: Record<string, unknown>) => string
): string => {
  if (category.mandatory > 0 && category.nonMandatory > 0) {
    return t('MANAGER_OVERVIEW.MIXED_COURSES_SUBTITLE', {
      mandatory: category.mandatory,
      nonMandatory: category.nonMandatory,
    });
  }
  if (category.nonMandatory > 0 && category.mandatory === 0) {
    return t('MANAGER_OVERVIEW.NON_MANDATORY');
  }
  return t('MANAGER_OVERVIEW.MANDATORY_COURSES_SUBTITLE');
};

const EmployeeSummaryCards: React.FC<EmployeeSummaryCardsProps> = ({ summary }) => {
  const { t } = useTranslation();
  const { certificatesIssued, completed, inProgress, highAttemptCourses } = summary;

  return (
    <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: { xs: 1.5, sm: 2 } }}>
      <Grid item xs={12} sm={6} md={3}>
        <EmployeeSummaryCard
          title={t('MANAGER_OVERVIEW.CERTIFICATES_ISSUED_TITLE')}
          value={certificatesIssued.total}
          subtitle={t('MANAGER_OVERVIEW.CERTIFICATES_ISSUED_SUBTITLE', {
            mandatory: certificatesIssued.mandatory,
            nonMandatory: certificatesIssued.nonMandatory,
          })}
          colorToken="certificateIssued"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <EmployeeSummaryCard
          title={t('MANAGER_OVERVIEW.COMPLETED_QUIZ_PENDING_TITLE')}
          value={completed.total}
          subtitle={getCategorySubtitle(completed, t)}
          colorToken="completed"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <EmployeeSummaryCard
          title={t('MANAGER_OVERVIEW.IN_PROGRESS_TITLE')}
          value={inProgress.total}
          subtitle={getCategorySubtitle(inProgress, t)}
          colorToken="inProgress"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <EmployeeSummaryCard
          title={t('MANAGER_OVERVIEW.HIGH_ATTEMPT_COURSES_TITLE')}
          value={highAttemptCourses.total}
          subtitle={
            highAttemptCourses.total > 0
              ? t('MANAGER_OVERVIEW.HIGH_ATTEMPT_COURSES_SUBTITLE', { count: highAttemptCourses.highestAttempt })
              : t('MANAGER_OVERVIEW.NONE')
          }
          colorToken="highAttempts"
        />
      </Grid>
    </Grid>
  );
};

export default EmployeeSummaryCards;
