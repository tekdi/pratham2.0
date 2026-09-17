import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Button, TextField, InputAdornment, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Clear, Search } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { showToastMessage } from '@shared-lib-v2/DynamicForm/components/Toastify';
import Header from '../../components/Header';
import BackHeader from '../../components/youthNet/BackHeader';
import NoDataFound from '../../components/common/NoDataFound';
import withRole from '../../components/withRole';
import { TENANT_DATA } from '../../utils/app.config';
import { getLoggedInUserRole } from '../../utils/helper';
import { YOUTHNET_USER_ROLE } from '../../components/youthNet/tempConfigs';
import { getTrainerTaxonomy } from '../../services/myTeachingCenter/TrainerTaxonomyService';
import { getMyTeachingCenterBatches } from '../../services/myTeachingCenter/BatchListService';
import BatchList from '../../components/myTeachingCenter/BatchList';
import CreateBatchModal from '../../components/myTeachingCenter/CreateBatchModal';
import { MyTeachingCenterBatch, TrainerAssignedTaxonomy } from '../../utils/Interfaces';

// Same page layout/design as /scp-teacher-repo/centers?tab=1 (search +
// "Add New" button above a BatchList grid) — no new visual design, just the
// Domain/Skills-scoped data behind it. No Center dropdown/concept at all:
// the Trainer's own Domain/Skills (from their profile) are the only scope,
// not a specific Center.
const MyTeachingCenterPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme<any>();

  useEffect(() => {
    if (getLoggedInUserRole() !== YOUTHNET_USER_ROLE.INSTRUCTOR) {
      router.replace('/');
    }
  }, []);

  const [taxonomy, setTaxonomy] = useState<TrainerAssignedTaxonomy>({ domains: [], skills: [] });
  const [batches, setBatches] = useState<MyTeachingCenterBatch[] | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  const loadBatches = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setBatches([]);
      return;
    }
    try {
      const trainerTaxonomy = await getTrainerTaxonomy(userId);
      setTaxonomy(trainerTaxonomy);
      const list = await getMyTeachingCenterBatches(trainerTaxonomy.domains, trainerTaxonomy.skills);
      setBatches(list);
    } catch (error) {
      console.error('Error loading My Teaching Center batches:', error);
      showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
      setBatches([]);
    }
  };

  useEffect(() => {
    loadBatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredBatches = useMemo(() => {
    if (!batches) return [];
    if (!searchInput.trim()) return batches;
    const query = searchInput.trim().toLowerCase();
    return batches.filter((batch) => batch.name?.toLowerCase().includes(query));
  }, [batches, searchInput]);

  const hasTaxonomy = taxonomy.domains.length > 0 && taxonomy.skills.length > 0;
  // Create Batch reuses an existing matching batch's own parentId (there's
  // no dedicated Center lookup any more) — so it's only offered once at
  // least one batch already exists for the Trainer's Domain/Skills.
  const centerId = batches?.[0]?.centerId;
  const canCreateBatch = hasTaxonomy && !!centerId;

  return (
    <>
      <Box>
        <Header />
      </Box>
      <Box ml={2}>
        <BackHeader headingOne={t('MY_TEACHING_CENTER.PAGE_TITLE')} />
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 2,
          px: 2,
          mb: 2,
          mt: 2,
          flexWrap: 'wrap',
        }}
      >
        <TextField
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder={t('COMMON.SEARCH')}
          variant="outlined"
          size="medium"
          sx={{
            width: { xs: '100%', sm: '400px', md: '450px' },
            height: '48px',
            backgroundColor: theme?.palette?.warning?.A700,
            color: theme?.palette?.warning?.A200,
            borderRadius: '40px',
            pl: 2,
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            '& .MuiOutlinedInput-root': { paddingRight: '8px', borderRadius: '40px', boxShadow: 'none' },
            '& .MuiInputBase-input': { color: theme?.palette?.warning?.A200 },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {searchInput ? (
                  <IconButton onClick={() => setSearchInput('')} edge="end" sx={{ color: theme.palette.warning['A200'] }}>
                    <Clear sx={{ color: theme?.palette?.warning?.['300'] }} />
                  </IconButton>
                ) : (
                  <Search sx={{ color: theme?.palette?.warning?.['300'] }} />
                )}
              </InputAdornment>
            ),
          }}
        />
        {canCreateBatch && (
          <Button
            sx={{
              mt: 1.2,
              border: '1px solid #1E1B16',
              borderRadius: '100px',
              height: '40px',
              px: '16px',
              color: theme.palette.error.contrastText,
              alignSelf: 'flex-start',
            }}
            endIcon={<AddIcon />}
            onClick={() => setCreateOpen(true)}
          >
            {t('MY_TEACHING_CENTER.CREATE_BATCH')}
          </Button>
        )}
      </Box>

      <Box>
        {batches == null ? (
          <Typography sx={{ px: 2 }}>{t('COMMON.LOADING')}</Typography>
        ) : !hasTaxonomy ? (
          <Typography sx={{ px: 2 }} color="text.secondary">
            {t('MY_TEACHING_CENTER.NO_DOMAIN_SKILLS_ASSIGNED')}
          </Typography>
        ) : filteredBatches.length > 0 ? (
          <BatchList
            batches={filteredBatches}
            router={router}
            theme={theme}
            onBatchClick={(batch) => router.push(`/my-teaching-center/${batch.cohortId}`)}
          />
        ) : (
          <NoDataFound title="MY_TEACHING_CENTER.NO_BATCHES_FOUND" />
        )}
      </Box>

      {canCreateBatch && centerId && (
        <CreateBatchModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          centerId={centerId}
          trainerTaxonomy={taxonomy}
          onCreated={loadBatches}
        />
      )}
    </>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default withRole(TENANT_DATA.YOUTHNET)(MyTeachingCenterPage);
