import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import DynamicForm from '@shared-lib-v2/DynamicForm/components/DynamicForm';
import { extractMatchingKeys } from '@shared-lib-v2/DynamicForm/components/DynamicFormCallback';
import { showToastMessage } from '@shared-lib-v2/DynamicForm/components/Toastify';
import Loader from '@shared-lib-v2/DynamicForm/components/Loader';
import CommonDataTable from '@shared-lib-v2/lib/Table/CommonDataTable';
import CommonSidePanel from '@shared-lib-v2/lib/Drawer/CommonSidePanel';
import Header from '../components/Header';
import BackHeader from '../components/youthNet/BackHeader';
import withRole from '../components/withRole';
import { TENANT_DATA } from '../utils/app.config';
import { getLoggedInUserRole } from '../utils/helper';
import { YOUTHNET_USER_ROLE } from '../components/youthNet/tempConfigs';
import {
  fetchUserList,
  getUserDetails,
  updateUser,
} from '../services/youthNet/Dashboard/UserServices';
import { getCourseNames } from '../services/l2InterestedQueue/getCourseNames';
import {
  L2_INTERESTED_VALUES,
} from '../services/l2InterestedQueue/l2Queue.config';
import {
  getLearnerDomain,
  getLearnerCourseId,
  getLearnerNote,
  getLearnerTaggedByUserId,
  getLearnerInterestedAt,
  getLearnerLocationValue,
  isLearnerTagged,
  buildTagCustomFields,
  buildBatchEnrollCustomFields,
  isUpdateUserSuccess,
  getUpdateUserErrorMessage,
} from '../services/l2InterestedQueue/l2QueueHelpers';
import {
  L2QueueSearchSchema,
  L2QueueSearchUISchema,
} from '../constant/Forms/L2QueueSearchSchema';
import {
  L2QueueAssignSchema,
  L2QueueAssignUISchema,
} from '../constant/Forms/L2QueueAssignSchema';

const PAGE_SIZE = 10;

const L2InterestedQueuePage = () => {
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    if (getLoggedInUserRole() !== YOUTHNET_USER_ROLE.INSTRUCTOR) {
      router.replace('/');
    }
  }, []);

  const [uiSchema, setUiSchema] = useState(L2QueueSearchUISchema);
  const [prefilledFormData, setPrefilledFormData] = useState<any>({ status: 'all' });
  const [currentPage, setCurrentPage] = useState(0);
  const [response, setResponse] = useState<any>(null);

  const [selectedRowsMap, setSelectedRowsMap] = useState<Record<string, any>>({});
  const [courseNameMap, setCourseNameMap] = useState<Record<string, string>>({});
  const [taggedByNameMap, setTaggedByNameMap] = useState<Record<string, string>>({});

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerLearners, setDrawerLearners] = useState<any[]>([]);
  const [assignFormData, setAssignFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const rows: any[] = response?.getUserDetails || [];

  const visibleRows = useMemo(() => {
    if (prefilledFormData?.status === 'tagged' && !prefilledFormData?.taggedDomain?.[0]) {
      return rows.filter((row) => isLearnerTagged(row));
    }
    if (prefilledFormData?.status === 'untagged') {
      return rows.filter((row) => !isLearnerTagged(row));
    }
    return rows;
  }, [rows, prefilledFormData?.status, prefilledFormData?.taggedDomain]);

  const searchData = async (formData: any, newPage: number) => {
    const cleaned: Record<string, any> = Object.fromEntries(
      Object.entries(formData || {}).filter(
        ([, value]) => !Array.isArray(value) || value.length > 0
      )
    );
    const filters: any = {
      role: 'Learner',
      l2_interested: L2_INTERESTED_VALUES.INTERESTED,
    };
    if (cleaned.state?.[0]) filters.states = cleaned.state[0];
    if (cleaned.district?.length) filters.district = cleaned.district;
    if (cleaned.block?.length) filters.block = cleaned.block;
    if (cleaned.village?.length) filters.village = cleaned.village;
    if (cleaned.name) filters.name = cleaned.name;
    if (cleaned.status === 'tagged' && cleaned.taggedDomain?.[0]) {
      filters.domain = cleaned.taggedDomain[0];
    }
    if (cleaned.status === 'tagged' && cleaned.taggedCourse?.length) {
      filters.courses = cleaned.taggedCourse;
    }

    setCurrentPage(newPage);
    const resp = await fetchUserList({
      limit: PAGE_SIZE,
      offset: newPage * PAGE_SIZE,
      sort: ['createdAt', 'desc'],
      filters,
    });
    // fetchUserList() returns undefined on a non-404 API/network error
    // (it swallows the error internally) — without this check the page
    // would sit on "Loading..." forever with no indication anything failed.
    if (!resp) {
      showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
      setResponse({ totalCount: 0, getUserDetails: [] });
      return;
    }
    setResponse(resp);
  };

  const SubmitaFunction = async (formData: any) => {
    const wantTagged = formData?.status === 'tagged';
    const isHidden = (uiSchema as any)?.taggedDomain?.['ui:widget'] === 'hidden';
    if (wantTagged === isHidden) {
      setUiSchema((prev: any) => ({
        ...prev,
        taggedDomain: {
          ...prev.taggedDomain,
          'ui:widget': wantTagged ? 'AutoCompleteMultiSelectWidget' : 'hidden',
        },
        taggedCourse: {
          ...prev.taggedCourse,
          'ui:widget': wantTagged ? 'AutoCompleteMultiSelectWidget' : 'hidden',
        },
      }));
    }
    setPrefilledFormData(formData);
    await searchData(formData, 0);
  };

  const handleClearAll = () => {
    setUiSchema(L2QueueSearchUISchema);
    setPrefilledFormData({ status: 'all' });
    searchData({ status: 'all' }, 0);
  };

  useEffect(() => {
    searchData(prefilledFormData, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Resolve course-id -> name for the "Assigned Domain & Course" column.
  useEffect(() => {
    const courseIds = Array.from(
      new Set(rows.map((row) => getLearnerCourseId(row)).filter(Boolean))
    ) as string[];
    const idsToResolve = courseIds.filter((id) => !courseNameMap[id]);
    if (idsToResolve.length === 0) return;
    getCourseNames(idsToResolve).then((courses) => {
      const resolved = courses.reduce((acc: Record<string, string>, c) => {
        acc[c.identifier] = c.name;
        return acc;
      }, {});
      if (Object.keys(resolved).length > 0) {
        setCourseNameMap((prev) => ({ ...prev, ...resolved }));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  // Resolve "tagged by" userId -> display name.
  useEffect(() => {
    const taggerIds = Array.from(
      new Set(rows.map((row) => getLearnerTaggedByUserId(row)).filter(Boolean))
    ) as string[];
    const idsToResolve = taggerIds.filter((id) => !taggedByNameMap[id]);
    idsToResolve.forEach(async (id) => {
      try {
        const info = await getUserDetails(id, true);
        const name = info?.userData?.name || info?.userData?.firstName;
        if (name) setTaggedByNameMap((prev) => ({ ...prev, [id]: name }));
      } catch (error) {
        console.error('Error resolving tagged-by name:', error);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  const handleToggleRow = (userId: string, checked: boolean) => {
    setSelectedRowsMap((prev) => {
      const next = { ...prev };
      if (checked) {
        const row = rows.find((r) => r.userId === userId);
        if (row) next[userId] = row;
      } else {
        delete next[userId];
      }
      return next;
    });
  };

  const handleToggleAll = (rowIds: string[], checked: boolean) => {
    setSelectedRowsMap((prev) => {
      const next = { ...prev };
      rowIds.forEach((id) => {
        if (checked) {
          const row = rows.find((r) => r.userId === id);
          if (row) next[id] = row;
        } else {
          delete next[id];
        }
      });
      return next;
    });
  };

  const clearSelection = () => setSelectedRowsMap({});
  const selectedRows = Object.values(selectedRowsMap);
  const selectedRowIds = useMemo(() => new Set(Object.keys(selectedRowsMap)), [selectedRowsMap]);

  const bulkAction = useMemo(() => {
    if (selectedRows.length === 0) return null;
    if (selectedRows.some((row: any) => !isLearnerTagged(row))) return 'none';
    const combos = new Set(
      selectedRows.map((row: any) => `${getLearnerDomain(row)}::${getLearnerCourseId(row)}`)
    );
    return combos.size === 1 ? 'assign' : 'review';
  }, [selectedRows]);

  const refreshCurrentPage = () => {
    searchData(prefilledFormData, currentPage);
  };

  const openDrawer = (learners: any[]) => {
    setDrawerLearners(learners);
    if (learners.length === 1 && isLearnerTagged(learners[0])) {
      setAssignFormData(extractMatchingKeys(learners[0], L2QueueAssignSchema));
    } else {
      setAssignFormData({});
    }
    setDrawerOpen(true);
  };

  const handleBulkAssignToBatch = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const customFields = buildBatchEnrollCustomFields();
      const results = await Promise.all(
        selectedRows.map((row: any) => updateUser(row.userId, { customFields }))
      );
      const failed = results.find((r) => !isUpdateUserSuccess(r));
      if (failed) {
        showToastMessage(getUpdateUserErrorMessage(failed) || t('COMMON.SOMETHING_WENT_WRONG'), 'error');
        return;
      }
      showToastMessage(t('L2_QUEUE.BATCH_ASSIGN_SUCCESS'), 'success');
      clearSelection();
      refreshCurrentPage();
    } catch (error) {
      showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const canSaveDrawer = !!assignFormData?.domain?.[0] && !!assignFormData?.course?.[0];

  const handleSaveTagsOnly = async () => {
    if (!canSaveDrawer || saving) return;
    setSaving(true);
    try {
      const customFields = buildTagCustomFields(
        assignFormData.domain[0],
        assignFormData.course[0],
        assignFormData.note
      );
      const results = await Promise.all(
        drawerLearners.map((learner) => updateUser(learner.userId, { customFields }))
      );
      const failed = results.find((r) => !isUpdateUserSuccess(r));
      if (failed) {
        showToastMessage(getUpdateUserErrorMessage(failed) || t('COMMON.SOMETHING_WENT_WRONG'), 'error');
        return;
      }
      showToastMessage(t('L2_QUEUE.TAGS_SAVED_SUCCESS'), 'success');
      setDrawerOpen(false);
      clearSelection();
      refreshCurrentPage();
    } catch (error) {
      showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAssignToBatch = async () => {
    if (!canSaveDrawer || saving) return;
    setSaving(true);
    try {
      const customFields = [
        ...buildTagCustomFields(assignFormData.domain[0], assignFormData.course[0], assignFormData.note),
        ...buildBatchEnrollCustomFields(),
      ];
      const results = await Promise.all(
        drawerLearners.map((learner) => updateUser(learner.userId, { customFields }))
      );
      const failed = results.find((r) => !isUpdateUserSuccess(r));
      if (failed) {
        showToastMessage(getUpdateUserErrorMessage(failed) || t('COMMON.SOMETHING_WENT_WRONG'), 'error');
        return;
      }
      showToastMessage(t('L2_QUEUE.BATCH_ASSIGN_SUCCESS'), 'success');
      setDrawerOpen(false);
      clearSelection();
      refreshCurrentPage();
    } catch (error) {
      showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      key: 'learner',
      label: t('L2_QUEUE.LEARNER'),
      render: (row: any) => (
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {row?.name || row?.firstName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row?.enrollmentId}
          </Typography>
        </Box>
      ),
    },
    {
      key: 'state',
      label: t('L2_QUEUE.STATE'),
      render: (row: any) => getLearnerLocationValue(row, 'STATE'),
    },
    {
      key: 'district',
      label: t('L2_QUEUE.DISTRICT'),
      render: (row: any) => getLearnerLocationValue(row, 'DISTRICT'),
    },
    {
      key: 'block',
      label: t('L2_QUEUE.BLOCK'),
      render: (row: any) => getLearnerLocationValue(row, 'BLOCK'),
    },
    {
      key: 'village',
      label: t('L2_QUEUE.VILLAGE'),
      render: (row: any) => getLearnerLocationValue(row, 'VILLAGE'),
    },
    {
      key: 'interestedAt',
      label: t('L2_QUEUE.INTERESTED_DATE'),
      render: (row: any) => {
        const value = getLearnerInterestedAt(row);
        return value ? new Date(value).toLocaleString() : '-';
      },
    },
    {
      key: 'assigned',
      label: t('L2_QUEUE.ASSIGNED_DOMAIN_COURSE'),
      render: (row: any) => {
        const domain = getLearnerDomain(row);
        const courseId = getLearnerCourseId(row);
        if (!domain || !courseId) return '—';
        const courseName = courseNameMap[courseId] || courseId;
        const taggerId = getLearnerTaggedByUserId(row);
        const taggerName = taggerId ? taggedByNameMap[taggerId] : null;
        return (
          <Box>
            <Typography variant="body2">
              {domain} › {courseName}
            </Typography>
            {taggerName && (
              <Typography variant="caption" color="text.secondary">
                {t('L2_QUEUE.TAGGED_BY', { name: taggerName })}
              </Typography>
            )}
          </Box>
        );
      },
    },
    {
      key: 'contact',
      label: t('L2_QUEUE.CONTACT'),
      render: (row: any) => row?.mobile || '-',
    },
    {
      key: 'status',
      label: t('L2_QUEUE.STATUS'),
      render: (row: any) => (
        <Chip
          size="small"
          label={
            isLearnerTagged(row) ? t('L2_QUEUE.STATUS_TAGGED') : t('L2_QUEUE.STATUS_INTERESTED')
          }
          color={isLearnerTagged(row) ? 'success' : 'default'}
        />
      ),
    },
    {
      key: 'action',
      label: t('L2_QUEUE.ACTION'),
      render: (row: any) => (
        <Button size="small" variant="outlined" onClick={() => openDrawer([row])}>
          {isLearnerTagged(row) ? t('L2_QUEUE.REVIEW') : t('L2_QUEUE.INTERACT')}
        </Button>
      ),
    },
  ];

  return (
    <>
      <Box>
        <Header />
      </Box>
      <Box ml={2}>
        <BackHeader
          headingOne={t('L2_QUEUE.PAGE_TITLE')}
          headingTwo={t('L2_QUEUE.PAGE_SUBTITLE')}
        />
      </Box>

      <Box display="flex" flexDirection="column" gap={2} sx={{ px: 2 }}>
        <DynamicForm
          schema={L2QueueSearchSchema}
          uiSchema={{
            ...uiSchema,
            'ui:submitButtonOptions': { norender: true },
          }}
          SubmitaFunction={SubmitaFunction}
          isCallSubmitInHandle={true}
          prefilledFormData={prefilledFormData}
          type="l2-interested-queue"
        />
        <Box>
          <Button size="small" onClick={handleClearAll}>
            {t('L2_QUEUE.CLEAR_ALL')}
          </Button>
        </Box>

        {selectedRows.length > 0 && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{ p: 1.5, border: '1px solid #eee', borderRadius: 2, bgcolor: '#FAFAFA' }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="body2">
                {t('L2_QUEUE.LEARNERS_SELECTED', { count: selectedRows.length })}
              </Typography>
              {bulkAction === 'assign' && (
                <Button
                  variant="contained"
                  size="small"
                  disabled={saving}
                  onClick={handleBulkAssignToBatch}
                >
                  {t('L2_QUEUE.ASSIGN_TO_BATCH')}
                </Button>
              )}
              {bulkAction === 'review' && (
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => openDrawer(selectedRows as any[])}
                >
                  {t('L2_QUEUE.REVIEW')}
                </Button>
              )}
            </Box>
            <Button size="small" onClick={clearSelection}>
              {t('L2_QUEUE.CLEAR_SELECTION')}
            </Button>
          </Box>
        )}

        {response != null ? (
          <CommonDataTable
            columns={columns}
            rows={visibleRows}
            selectable
            getRowId={(row: any) => row.userId}
            selectedIds={selectedRowIds}
            onToggleRow={handleToggleRow}
            onToggleAll={handleToggleAll}
            page={currentPage + 1}
            pageSize={PAGE_SIZE}
            totalCount={response?.totalCount || 0}
            onPageChange={(page: number) => searchData(prefilledFormData, page - 1)}
            emptyMessage={t('L2_QUEUE.NO_LEARNERS_FOUND')}
          />
        ) : (
          <Loader showBackdrop={false} loadingText={t('COMMON.LOADING')} />
        )}
      </Box>

      <CommonSidePanel
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={t('L2_QUEUE.REVIEW_ASSIGN_INTEREST')}
        footer={
          <Box display="flex" flexDirection="column" gap={1}>
            <Button
              variant="contained"
              color="primary"
              disabled={!canSaveDrawer || saving}
              onClick={handleSaveTagsOnly}
            >
              {t('L2_QUEUE.SAVE_TAGS_ONLY')}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              disabled={!canSaveDrawer || saving}
              onClick={handleAssignToBatch}
            >
              {t('L2_QUEUE.ASSIGN_TO_BATCH')}
            </Button>
          </Box>
        }
      >
        {drawerLearners.length > 1 ? (
          <Box sx={{ border: '1px solid #ddd', borderRadius: 2, p: 1.5, mb: 2 }}>
            <Typography fontWeight="bold">
              {t('L2_QUEUE.LEARNERS_SELECTED', { count: drawerLearners.length })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {drawerLearners.map((l) => l?.name || l?.firstName).filter(Boolean).join(', ')}
            </Typography>
          </Box>
        ) : (
          drawerLearners[0] && (
            <Box sx={{ border: '1px solid #ddd', borderRadius: 2, p: 1.5, mb: 2 }}>
              <Typography fontWeight="bold">
                {drawerLearners[0]?.name || drawerLearners[0]?.firstName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {drawerLearners[0]?.enrollmentId}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {[
                  getLearnerLocationValue(drawerLearners[0], 'VILLAGE'),
                  getLearnerLocationValue(drawerLearners[0], 'BLOCK'),
                  getLearnerLocationValue(drawerLearners[0], 'DISTRICT'),
                  getLearnerLocationValue(drawerLearners[0], 'STATE'),
                ]
                  .filter((v) => v && v !== '-')
                  .join(', ')}
              </Typography>
              <Typography variant="body2">{drawerLearners[0]?.mobile}</Typography>
            </Box>
          )
        )}

        <DynamicForm
          schema={L2QueueAssignSchema}
          uiSchema={{ ...L2QueueAssignUISchema, 'ui:submitButtonOptions': { norender: true } }}
          SubmitaFunction={(formData: any) => setAssignFormData(formData)}
          isCallSubmitInHandle={true}
          prefilledFormData={assignFormData}
          type="l2-interested-queue-assign"
        />
      </CommonSidePanel>
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

export default withRole(TENANT_DATA.YOUTHNET)(L2InterestedQueuePage);
