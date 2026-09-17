import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Loader from '@shared-lib-v2/DynamicForm/components/Loader';
import Header from '../../components/Header';
import BackHeader from '../../components/youthNet/BackHeader';
import withRole from '../../components/withRole';
import { TENANT_DATA } from '../../utils/app.config';
import { getLoggedInUserRole } from '../../utils/helper';
import { YOUTHNET_USER_ROLE } from '../../components/youthNet/tempConfigs';
import { getBatchById } from '../../services/myTeachingCenter/BatchListService';
import BatchDetailsHeader from '../../components/myTeachingCenter/BatchDetailsHeader';
import LearnerListTable from '../../components/myTeachingCenter/LearnerListTable';
import { MyTeachingCenterBatch } from '../../utils/Interfaces';

// Batch Details — primary content is the Learner List directly, no
// intermediate tabs (spec item 5, deliberately diverging from
// scp-teacher-repo's tab=1/2/3 pattern).
const BatchDetailsPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const batchId = router.query.batchId as string | undefined;

  useEffect(() => {
    if (getLoggedInUserRole() !== YOUTHNET_USER_ROLE.INSTRUCTOR) {
      router.replace('/');
    }
  }, []);

  const [batch, setBatch] = useState<MyTeachingCenterBatch | null>(null);
  const [headerLoaded, setHeaderLoaded] = useState(false);
  // Filled in by LearnerListTable's own fetch (see its onTotalCountChange)
  // instead of a second, duplicate cohortmember/list call here just for a
  // count.
  const [learnerCount, setLearnerCount] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!batchId) return;
    const loadBatch = async () => {
      try {
        setBatch(await getBatchById(batchId));
      } catch (error) {
        // Non-fatal: the Learner List only needs batchId from the URL, so
        // a failed header fetch still lets the page show the table rather
        // than blocking on it.
        console.error('Error loading batch details:', error);
        setBatch(null);
      } finally {
        setHeaderLoaded(true);
      }
    };
    loadBatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchId]);

  return (
    <>
      <Box>
        <Header />
      </Box>
      <Box ml={2}>
        <BackHeader
          headingOne={t('MY_TEACHING_CENTER.BACK_TO_BATCHES')}
          showBackButton
          onBackClick={() => router.push('/my-teaching-center')}
        />
      </Box>

      <Box sx={{ px: 2 }}>
        {!batchId ? null : !headerLoaded ? (
          <Box display="flex" flexDirection="column" alignItems="center" sx={{ py: 4 }}>
            <Loader showBackdrop={false} loadingText={t('COMMON.LOADING')} />
          </Box>
        ) : (
          <>
            {batch && <BatchDetailsHeader batch={{ ...batch, learnerCount }} />}
            <LearnerListTable batchCohortId={batchId} onTotalCountChange={setLearnerCount} />
          </>
        )}
      </Box>
    </>
  );
};

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' };
}

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default withRole(TENANT_DATA.YOUTHNET)(BatchDetailsPage);
