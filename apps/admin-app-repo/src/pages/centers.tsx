// @ts-nocheck
import React, { useState, useEffect } from 'react';
import DynamicForm from '@/components/DynamicForm/DynamicForm';
import Loader from '@/components/Loader';
import { useTranslation } from 'react-i18next';
import { CohortTypes, Status } from '@/utils/app.constant';
import { userList } from '@/services/UserList';
import { Box, Typography } from '@mui/material';
import PaginatedTable from '@/components/PaginatedTable/PaginatedTable';
import { Button } from '@mui/material';
import SimpleModal from '@/components/SimpleModal';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import editIcon from '../../public/images/editIcon.svg';
import deleteIcon from '../../public/images/deleteIcon.svg';
import Image from 'next/image';
import {
  extractMatchingKeys,
  fetchForm,
  searchListData,
} from '@/components/DynamicForm/DynamicFormCallback';
import { FormContext } from '@/components/DynamicForm/DynamicFormConstant';
import AddEditUser from '@/components/EntityForms/AddEditUser/AddEditUser';
import {
  CohortSearchSchema,
  CohortSearchUISchema,
} from '@/constant/Forms/CohortSearch';
import {
  fetchCohortMemberList,
  getCohortList,
} from '@/services/CohortService/cohortService';
import ConfirmationPopup from '@/components/ConfirmationPopup';
import { updateCohort } from '@/services/MasterDataService';

//import { DynamicForm } from '@shared-lib';

const Centers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [schema, setSchema] = useState(CohortSearchSchema);
  const [uiSchema, setUiSchema] = useState(CohortSearchUISchema);
  const [addSchema, setAddSchema] = useState(null);
  const [addUiSchema, setAddUiSchema] = useState(null);
  const [prefilledAddFormData, setPrefilledAddFormData] = useState({});
  const [pageLimit, setPageLimit] = useState<number>(10);
  const [pageOffset, setPageOffset] = useState<number>(0);
  const [prefilledFormData, setPrefilledFormData] = useState({});
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editableUserId, setEditableUserId] = useState('');
  const [cohortId, setCohortId] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [totalCount, setTotalCount] = useState();

  const { t, i18n } = useTranslation();
  const initialFormData = localStorage.getItem('stateId')
    ? { state: localStorage.getItem('stateId') }
    : {};

  useEffect(() => {
    if (response?.result?.totalCount !== 0) {
      searchData(prefilledFormData, 0);
    }
  }, [pageLimit]);
  useEffect(() => {
    // Fetch form schema from API and set it in state.
    const fetchData = async () => {
      const savedTenantId = localStorage.getItem('tenantId');
      setTenantId(savedTenantId);

      const responseForm = await fetchForm([
        {
          fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${FormContext.cohort.context}&contextType=${FormContext.cohort.contextType}`,
          header: {},
        },
        {
          fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${FormContext.cohort.context}&contextType=${FormContext.cohort.contextType}`,
          header: {
            tenantid: savedTenantId,
          },
        },
      ]);
      console.log('responseForm', responseForm);
      setAddSchema(responseForm?.schema);
      setAddUiSchema(responseForm?.uiSchema);
    };

    setPrefilledAddFormData(initialFormData);
    setPrefilledFormData(initialFormData);
    fetchData();
  }, []);

  const updatedUiSchema = {
    ...uiSchema,
    'ui:submitButtonOptions': {
      norender: true, // Hide submit button if isHide is true
    },
  };

  const SubmitaFunction = async (formData: any) => {
    setPrefilledFormData(formData);
    await searchData(formData, 0);
  };

  const searchData = async (formData: any, newPage: any) => {
    const staticFilter = { type: CohortTypes.COHORT, status: [Status.ACTIVE] };
    const { sortBy } = formData;
    const staticSort = ['name', sortBy || 'asc'];
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
  };

  // delete center logic

  const deleteCohort = async () => {
    const data = {
      filters: {
        cohortId: cohortId,
      },
      status: ['active'],
    };
    const response = await fetchCohortMemberList(data);

    setTotalCount(response?.result);

    try {
      // const resp = await updateCohort(cohortId, { status: Status.ARCHIVED });
      if (resp?.responseCode === 200) {
        setResponse((prev) => ({
          ...prev,
          result: {
            ...prev?.results,
            cohortDetails: prev?.results?.cohortDetails?.filter(
              (item) => item?.cohortId !== cohortId
            ),
          },
        }));
        console.log('Cohort successfully archived.');
      } else {
        console.error('Failed to archive cohort:', resp);
      }

      return resp;
    } catch (error) {
      console.error('Error updating cohort:', error);
    }
  };

  // Define table columns

  const columns = [
    { key: 'name', label: 'Center Name' },
    {
      key: 'address',
      label: 'Address',
      render: (row) =>
        row.customFields.find((field) => field.label === 'ADDRESS')
          ?.selectedValues || '-',
    },
    {
      key: 'state',
      label: 'State',
      render: (row) =>
        row.customFields.find((field) => field.label === 'STATE')
          ?.selectedValues[0]?.value || '-',
    },
    {
      key: 'district',
      label: 'District',
      render: (row) =>
        row.customFields.find((field) => field.label === 'DISTRICT')
          ?.selectedValues[0]?.value || '-',
    },
    {
      key: 'block',
      label: 'Block',
      render: (row) =>
        row.customFields.find((field) => field.label === 'BLOCK')
          ?.selectedValues[0]?.value || '-',
    },
    {
      key: 'village',
      label: 'Village',
      render: (row) =>
        row.customFields.find((field) => field.label === 'VILLAGE')
          ?.selectedValues[0]?.value || '-',
    },
    {
      key: 'board',
      label: 'Boards',
      render: (row) =>
        row.customFields.find((field) => field.label === 'BOARD')
          ?.selectedValues[0] || '-',
    },
    {
      key: 'medium',
      label: 'Medium',
      render: (row) =>
        row.customFields.find((field) => field.label === 'MEDIUM')
          ?.selectedValues[0] || '-',
    },
  ];

  // Define actions
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
        console.log('row:', row);
        console.log('AddSchema', addSchema);
        console.log('AddUISchema', addUiSchema);

        let tempFormData = extractMatchingKeys(row, addSchema);
        // console.log('tempFormData', tempFormData);
        setPrefilledAddFormData(tempFormData);
        setIsEdit(true);
        setEditableUserId(row?.cohortId);
        handleOpenModal();
      },
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
        console.log('row:', row);
        setEditableUserId(row?.userId);
        setCohortId(row?.cohortId);
        // const memberStatus = Status.ARCHIVED;
        // const statusReason = '';
        // const membershipId = row?.userId;

        //Call delete cohort api

        // const response = await updateCohortMemberStatus({
        //   memberStatus,
        //   statusReason,
        //   membershipId,
        // });
        // setPrefilledFormData({});
        // searchData(prefilledFormData, currentPage);
        // setOpenModal(false);
        setOpen(true);
        setFirstName(row?.name);
      },
    },
  ];

  // Pagination handlers
  const handlePageChange = (newPage: any) => {
    console.log('Page changed to:', newPage);
    searchData(prefilledFormData, newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: any) => {
    console.log('Rows per page changed to:', newRowsPerPage);
    setPageLimit(newRowsPerPage);
  };

  const handleOpenModal = () => setOpenModal(true);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  //Add Edit Props
  const extraFieldsUpdate = {};
  const extraFields = {
    type: CohortTypes.COHORT,
  };
  const successUpdateMessage = 'CENTERS.CENTER_UPDATE_SUCCESSFULLY';
  const telemetryUpdateKey = 'center-updated-successfully';
  const failureUpdateMessage = 'CENTERS.CENTER_UPDATE_FAILED';
  const successCreateMessage = 'CENTERS.CENTER_CREATED';
  const telemetryCreateKey = 'center-created-successfully';
  const failureCreateMessage = 'CENTERS.CENTER_UPDATE_FAILED';

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
            color="primary"
            onClick={() => {
              setPrefilledAddFormData(initialFormData);
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
          showFooter={false}
          modalTitle={
            isEdit ? t('COMMON.UPDATE_CENTER') : t('CENTERS.NEW_CENTER')
          }
        >
          <AddEditUser
            SuccessCallback={() => {
              setPrefilledFormData({});
              searchData({}, 0);
              setOpenModal(false);
            }}
            schema={addSchema}
            uiSchema={addUiSchema}
            editPrefilledFormData={prefilledAddFormData}
            isEdit={isEdit}
            editableUserId={editableUserId}
            UpdateSuccessCallback={() => {
              setPrefilledFormData({});
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
          />
        </SimpleModal>

        {response && response?.result?.results?.cohortDetails?.length > 0 ? (
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
              {t('COMMON.NO_CENTER_FOUND')}
            </Typography>
          </Box>
        )}
      </Box>
      {totalCount > 0 ? (
        <ConfirmationPopup
          open={open}
          onClose={() => setOpen(false)}
          title={`You can't delete the center because it has ${totalCount} Active Learners`}
          secondary={'Cancel'}
        />
      ) : (
       
      <ConfirmationPopup
        open={open}
        onClose={() => setOpen(false)}
        title={`Are you sure you want to delete ${firstName} center?`}
        centerPrimary={t('COMMON.YES')}
        secondary={t('COMMON.CANCEL')}
        onClickPrimary={deleteCohort}
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

export default Centers;
