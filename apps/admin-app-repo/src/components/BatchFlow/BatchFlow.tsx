// @ts-nocheck
import React, { useEffect, useState } from 'react';
import DynamicForm from '@/components/DynamicForm/DynamicForm';
import Loader from '@/components/Loader';
import { useTranslation } from 'react-i18next';
import { CohortTypes, Status } from '@/utils/app.constant';
import { Box, Typography } from '@mui/material';
import PaginatedTable from '@/components/PaginatedTable/PaginatedTable';
import { Button } from '@mui/material';
import SimpleModal from '@/components/SimpleModal';
import editIcon from '../../../public/images/editIcon.svg';
import deleteIcon from '../../../public/images/deleteIcon.svg';
import Image from 'next/image';
import {
  extractMatchingKeys,
  fetchForm,
  searchListData,
} from '@/components/DynamicForm/DynamicFormCallback';
import { FormContext } from '@/components/DynamicForm/DynamicFormConstant';
import AddEditUser from '@/components/EntityForms/AddEditUser/AddEditUser';
import {
  BatchSearchSchema,
  BatchSearchUISchema,
} from '@/constant/Forms/BatchSearchNew';
import {
  BatchCreateSchema,
  BatchCreateUISchema,
} from '@/constant/Forms/BatchCreate';
import {
  fetchCohortMemberList,
  getCohortList,
} from '@/services/CohortService/cohortService';
import { transformLabel } from '@/utils/Helper';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import CenterLabel from '@/components/Centerlabel';
import CenteredLoader from '@/components/CenteredLoader/CenteredLoader';
import ActiveArchivedLearner from '@/components/ActiveArchivedLearner';
import ConfirmationPopup from '@/components/ConfirmationPopup';
import { updateCohort } from '@/services/MasterDataService';

interface BatchFlowProps {
  initialParentId?: string;
  centerBoards?: string[];
  centerMediums?: string[];
  centerGrades?: string[];
  centerType?: string | null;
}

const BatchFlow: React.FC<BatchFlowProps> = ({
  initialParentId,
  centerBoards = [],
  centerMediums = [],
  centerGrades = [],
  centerType = null,
}) => {
  const theme = useTheme<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [schema, setSchema] = useState(BatchSearchSchema);
  const [uiSchema, setUiSchema] = useState(BatchSearchUISchema);
  const [addSchema, setAddSchema] = useState(null);
  const [addUiSchema, setAddUiSchema] = useState(null);
  const [prefilledAddFormData, setPrefilledAddFormData] = useState({});
  const [pageLimit, setPageLimit] = useState<number>(10);
  const [pageOffset, setPageOffset] = useState<number>(0);
  const [prefilledFormData, setPrefilledFormData] = useState({});
  const [response, setResponse] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editableUserId, setEditableUserId] = useState('');
  const [cohortId, setCohortId] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const { t } = useTranslation();
  const initialFormData =
    typeof window !== 'undefined' && localStorage.getItem('stateId')
      ? { state: [localStorage.getItem('stateId')] }
      : {};
  const searchStoreKey = 'batch';
  const initialFormDataSearch =
    typeof window !== 'undefined' &&
    localStorage.getItem(searchStoreKey) &&
    localStorage.getItem(searchStoreKey) != '{}'
      ? JSON.parse(localStorage.getItem(searchStoreKey))
      : typeof window !== 'undefined' && localStorage.getItem('stateId')
      ? { state: [localStorage.getItem('stateId')] }
      : {};

  useEffect(() => {
    if (response?.result?.totalCount !== 0) {
      searchData(prefilledFormData, 0);
    }
  }, [pageLimit]);

  const buildSchemaAndUi = (
    isEditMode: boolean,
    existingValues?: { board?: string[]; medium?: string[]; grade?: string[] }
  ) => {
    let alterSchema = JSON.parse(JSON.stringify(BatchCreateSchema));
    let alterUiSchema = JSON.parse(JSON.stringify(BatchCreateUISchema));

    let requiredArray = alterSchema?.required || [];
    const mustRequired = ['name', 'board', 'medium', 'grade'];
    mustRequired.forEach((item) => {
      if (!requiredArray.includes(item)) {
        requiredArray.push(item);
      }
    });
    alterSchema.required = requiredArray;

    if (alterSchema?.properties?.board) {
      alterSchema.properties.board.maxSelection = 1;
    }
    if (alterSchema?.properties?.medium) {
      alterSchema.properties.medium.maxSelection = 1;
    }
    if (alterSchema?.properties?.grade) {
      alterSchema.properties.grade.maxSelection = 1;
    }

    const overrideEnum = (
      fieldKey: 'board' | 'medium' | 'grade',
      centerVals: string[]
    ) => {
      if (alterSchema?.properties?.[fieldKey]) {
        const currentVals = Array.isArray(centerVals) ? centerVals : [];
        const existing = existingValues?.[fieldKey] || [];
        const merged = Array.from(
          new Set([...(currentVals || []), ...(existing || [])])
        ).filter(Boolean);
        if (merged.length) {
          delete alterSchema.properties[fieldKey].api;
          alterSchema.properties[fieldKey].items = {
            type: 'string',
            enum: merged,
            enumNames: merged,
          };
        }
      }
    };
    overrideEnum('board', centerBoards);
    overrideEnum('medium', centerMediums);
    overrideEnum('grade', centerGrades);

    // Modify batch_type based on centerType
    if (centerType && alterSchema?.properties?.batch_type) {
      if (centerType === 'remote') {
        // For remote center: show "remote" and "hybrid" options
        alterSchema.properties.batch_type.enum = ['remote', 'hybrid'];
        alterSchema.properties.batch_type.enumNames = ['REMOTE', 'HYBRID'];
        alterSchema.properties.batch_type.default = 'remote';
        if (alterUiSchema?.batch_type?.['ui:disabled']) {
          delete alterUiSchema.batch_type['ui:disabled'];
        }
      } else if (centerType === 'regular') {
        // For regular center: show only "regular" option (disabled)
        alterSchema.properties.batch_type.enum = ['regular'];
        alterSchema.properties.batch_type.enumNames = ['REGULAR'];
        alterSchema.properties.batch_type.default = 'regular';
        if (alterUiSchema?.batch_type) {
          alterUiSchema.batch_type['ui:disabled'] = true;
        }
      }
    }

    if (!isEditMode) {
      if (centerBoards?.length === 1 && alterUiSchema?.board) {
        alterUiSchema.board['ui:disabled'] = true;
      }
      if (centerMediums?.length === 1 && alterUiSchema?.medium) {
        alterUiSchema.medium['ui:disabled'] = true;
      }
      if (centerGrades?.length === 1 && alterUiSchema?.grade) {
        alterUiSchema.grade['ui:disabled'] = true;
      }
    } else {
      if (alterUiSchema?.board?.['ui:disabled'])
        delete alterUiSchema.board['ui:disabled'];
      if (alterUiSchema?.medium?.['ui:disabled'])
        delete alterUiSchema.medium['ui:disabled'];
      if (alterUiSchema?.grade?.['ui:disabled'])
        delete alterUiSchema.grade['ui:disabled'];
    }

    setAddSchema(alterSchema);
    setAddUiSchema(alterUiSchema);
  };

  useEffect(() => {
    const fetchData = async () => {
      const savedTenantId =
        typeof window !== 'undefined' ? localStorage.getItem('tenantId') : '';
      setTenantId(savedTenantId);

      buildSchemaAndUi(false);
    };

    // Prefill search data
    const baseSearch = initialFormDataSearch || {};
    const withParent = initialParentId
      ? { ...baseSearch, parentId: [initialParentId] }
      : baseSearch;
    setPrefilledAddFormData(
      initialParentId
        ? { ...initialFormData, parentId: [initialParentId] }
        : initialFormData
    );
    setPrefilledFormData(withParent);
    fetchData();
  }, [initialParentId, centerType, centerBoards, centerMediums, centerGrades]);

  const updatedUiSchema = {
    ...uiSchema,
    'ui:submitButtonOptions': {
      norender: true,
    },
  };

  const SubmitaFunction = async (formData: any) => {
    if (formData && Object.keys(formData).length > 0) {
      // Force parentId filter when provided
      const enforcedFormData = initialParentId
        ? { ...formData, parentId: [initialParentId] }
        : formData;
      setPrefilledFormData(enforcedFormData);
      if (typeof window !== 'undefined') {
        localStorage.setItem(searchStoreKey, JSON.stringify(enforcedFormData));
      }
      await searchData(enforcedFormData, 0);
    }
  };

  const searchData = async (formData: any, newPage: any) => {
    if (formData) {
      formData = Object.fromEntries(
        Object.entries(formData).filter(
          ([_, value]) => !Array.isArray(value) || value.length > 0
        )
      );
      const staticFilter = { type: CohortTypes.BATCH };
      const { sortBy } = formData;
      const staticSort = ['name', sortBy || 'asc'];
      delete formData.state;
      delete formData.district;
      delete formData.block;
      delete formData.village;
      if (initialParentId) {
        formData.parentId = [initialParentId];
      } else if (!formData.parentId) {
        formData.parentId = [];
      }
      await searchListData(
        formData,
        newPage,
        staticFilter,
        pageLimit,
        setPageOffset,
        setCurrentPage,
        setResponse,
        getCohortList,
        staticSort
      );
    }
  };

  const deleteCohort = async () => {
    try {
      const resp = await updateCohort(cohortId, { status: Status.ARCHIVED });
      if (resp?.responseCode === 200) {
        searchData(prefilledFormData, currentPage);
      }
      return resp;
    } catch (error) {
      console.error('Error updating cohort:', error);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Batch Name',
      render: (row: any) => transformLabel(row.name),
    },
    {
      key: 'active_learners',
      label: 'Active Learners',
      render: (row) => (
        <ActiveArchivedLearner cohortId={row?.cohortId} type={Status.ACTIVE} />
      ),
    },
    {
      key: 'archived_learners',
      label: 'Archived Learners',
      render: (row) => (
        <ActiveArchivedLearner
          cohortId={row?.cohortId}
          type={Status.ARCHIVED}
        />
      ),
    },
    {
      key: 'center',
      label: 'Center',
      render: (row) => <CenterLabel parentId={row?.parentId} />,
    },
    {
      key: 'board',
      label: 'Boards',
      render: (row) =>
        transformLabel(
          row.customFields
            .find((field) => field.label === 'BOARD')
            ?.selectedValues?.join(', ')
        ) || '-',
    },
    {
      key: 'medium',
      label: 'Medium',
      render: (row) =>
        transformLabel(
          row.customFields
            .find((field) => field.label === 'MEDIUM')
            ?.selectedValues?.join(', ')
        ) || '-',
    },
    {
      key: 'grade',
      label: 'Grade',
      render: (row) =>
        transformLabel(
          row.customFields
            .find((field) => field.label === 'GRADE')
            ?.selectedValues?.join(', ')
        ) || '-',
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: any) => transformLabel(row?.status),
    },
  ];

  const actions = [
    {
      icon: (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            backgroundColor: 'rgb(227, 234, 240)',
            padding: '10px',
          }}
        >
          <Image src={editIcon} alt="" />
        </Box>
      ),
      callback: (row: any) => {
        const existingValues = {
          board:
            row?.customFields?.find((f: any) => f.label === 'BOARD')
              ?.selectedValues || [],
          medium:
            row?.customFields?.find((f: any) => f.label === 'MEDIUM')
              ?.selectedValues || [],
          grade:
            row?.customFields?.find((f: any) => f.label === 'GRADE')
              ?.selectedValues || [],
        };
        buildSchemaAndUi(true, existingValues);
        let tempFormData = extractMatchingKeys(row, addSchema);
        // Force batch_type to "remote" if centerType is "remote"
        if (centerType === 'remote') {
          tempFormData.batch_type = 'remote';
        }
        setPrefilledAddFormData(tempFormData);
        setIsEdit(true);
        setEditableUserId(row?.cohortId);
        handleOpenModal();
      },
      show: (row) => row.status !== 'archived',
    },
    {
      icon: (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            backgroundColor: 'rgb(227, 234, 240)',
            padding: '10px',
          }}
        >
          {' '}
          <Image src={deleteIcon} alt="" />
        </Box>
      ),
      callback: async (row: any) => {
        setEditableUserId(row?.userId);
        setCohortId(row?.cohortId);

        const data = {
          filters: {
            cohortId: row?.cohortId,
            status: ['active'],
            role: 'Learner',
          },
        };
        const response = await fetchCohortMemberList(data);

        let totalCount = response?.result?.totalCount;
        setTotalCount(totalCount);
        setOpen(true);
        setFirstName(row?.name);
      },
      show: (row) => row.status !== 'archived',
    },
  ];

  const handlePageChange = (newPage: any) => {
    searchData(prefilledFormData, newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: any) => {
    setPageLimit(newRowsPerPage);
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const extraFieldsUpdate = {};
  const extraFields = {
    type: CohortTypes.BATCH,
    parentId: initialParentId || null,
  };
  const successUpdateMessage = 'BATCH.BATCH_UPDATE_SUCCESSFULLY';
  const telemetryUpdateKey = 'batch-updated-successfully';
  const failureUpdateMessage = 'BATCH.BATCH_UPDATE_FAILED';
  const successCreateMessage = 'BATCH.BATCH_CREATED_SUCCESSFULLY';
  const telemetryCreateKey = 'batch-created-successfully';
  const failureCreateMessage = 'BATCH.BATCH_CREATE_FAILED';

  return (
    <>
      <Box display={'flex'} flexDirection={'column'} gap={2}>
        {isLoading ? (
          <Loader showBackdrop={false} loadingText={t('COMMON.LOADING')} />
        ) : (
          schema &&
          uiSchema && (
            <DynamicForm
              schema={schema}
              uiSchema={updatedUiSchema}
              SubmitaFunction={SubmitaFunction}
              isCallSubmitInHandle={true}
              prefilledFormData={prefilledFormData}
            />
          )
        )}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }} mt={4}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            color="primary"
            sx={{
              textTransform: 'none',
              fontSize: '14px',
              color: theme.palette.primary['100'],
              width: '200px',
            }}
            onClick={() => {
              const addPrefill = initialParentId
                ? { ...initialFormData, parentId: [initialParentId] }
                : initialFormData;
              const prefillWithBMGS: any = { ...addPrefill };
              if (centerBoards?.length === 1)
                prefillWithBMGS.board = [centerBoards[0]];
              if (centerMediums?.length === 1)
                prefillWithBMGS.medium = [centerMediums[0]];
              if (centerGrades?.length === 1)
                prefillWithBMGS.grade = [centerGrades[0]];

              // Prefill batch_type for remote center
              if (centerType === 'remote') {
                prefillWithBMGS.batch_type = 'remote';
              }

              buildSchemaAndUi(false);

              setPrefilledAddFormData(prefillWithBMGS);
              setIsEdit(false);
              setEditableUserId('');
              handleOpenModal();
            }}
          >
            {t('COMMON.ADD_NEW')}{' '}
          </Button>
        </Box>

        <SimpleModal
          open={openModal}
          onClose={handleCloseModal}
          showFooter={true}
          primaryText={isEdit ? t('Update') : t('Create')}
          id="dynamic-form-id"
          modalTitle={isEdit ? t('BATCH.UPDATE_BATCH') : t('BATCH.NEW_BATCH')}
        >
          <AddEditUser
            SuccessCallback={() => {
              // reset filters and reload
              const reloadPrefill = initialParentId
                ? {
                    ...(initialFormDataSearch || {}),
                    parentId: [initialParentId],
                  }
                : initialFormDataSearch || {};
              setPrefilledFormData(reloadPrefill);
              searchData(reloadPrefill, 0);
              setOpenModal(false);
            }}
            schema={addSchema}
            uiSchema={addUiSchema}
            editPrefilledFormData={prefilledAddFormData}
            isEdit={isEdit}
            editableUserId={editableUserId}
            UpdateSuccessCallback={() => {
              setPrefilledFormData(prefilledFormData);
              searchData(prefilledFormData, currentPage);
              setOpenModal(false);
            }}
            extraFields={extraFields}
            extraFieldsUpdate={extraFieldsUpdate}
            successUpdateMessage={successUpdateMessage}
            telemetryUpdateKey={telemetryUpdateKey}
            failureUpdateMessage={failureUpdateMessage}
            successCreateMessage={successCreateMessage}
            telemetryCreateKey={telemetryCreateKey}
            failureCreateMessage={failureCreateMessage}
            isNotificationRequired={false}
            hideSubmit={true}
            type="batch"
          />
        </SimpleModal>

        {response != null ? (
          <>
            {response &&
            response?.result?.results?.cohortDetails?.length > 0 ? (
              <Box sx={{ mt: 1 }}>
                <PaginatedTable
                  count={response?.result?.count}
                  data={response?.result?.results?.cohortDetails}
                  columns={columns}
                  actions={actions}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  defaultPage={currentPage}
                  defaultRowsPerPage={pageLimit}
                />
              </Box>
            ) : (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="20vh"
              >
                <Typography marginTop="10px" textAlign={'center'}>
                  {t('BATCH.NO_BATCH_FOUND')}
                </Typography>
              </Box>
            )}
          </>
        ) : (
          <CenteredLoader />
        )}
      </Box>
      {totalCount > 0 ? (
        <ConfirmationPopup
          open={open}
          onClose={() => setOpen(false)}
          title={`You can't delete the batch because it has ${totalCount} Active Learners`}
          secondary={'Cancel'}
        />
      ) : (
        <ConfirmationPopup
          open={open}
          onClose={() => setOpen(false)}
          title={`Are you sure you want to delete ${firstName} batch?`}
          centerPrimary={t('COMMON.YES')}
          secondary={t('COMMON.CANCEL')}
          onClickPrimary={deleteCohort}
        />
      )}
    </>
  );
};

export default BatchFlow;
