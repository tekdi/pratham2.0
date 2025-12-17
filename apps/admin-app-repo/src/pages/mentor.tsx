// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import DynamicForm from '@/components/DynamicForm/DynamicForm';
import Loader from '@/components/Loader';
import { useTranslation } from 'react-i18next';
import {
  MentorSearchSchema,
  MentorSearchUISchema,
} from '../constant/Forms/MentorSearch';
import { Role, RoleId, Status } from '@/utils/app.constant';
import { userList } from '@/services/UserList';
import {
  Box,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material';
import PaginatedTable from '@/components/PaginatedTable/PaginatedTable';
import { Button } from '@mui/material';
import SimpleModal from '@/components/SimpleModal';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { updateCohortMemberStatus } from '@/services/CohortService/cohortService';
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
import ConfirmationPopup from '@/components/ConfirmationPopup';
import DeleteDetails from '@/components/DeleteDetails';
import { deleteUser } from '@/services/UserService';
import { transformLabel } from '@/utils/Helper';
import { getCohortList } from '@/services/GetCohortList';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import AddIcon from '@mui/icons-material/Add';
import ResetFiltersButton from '@/components/ResetFiltersButton/ResetFiltersButton';
import MentorForm from '@/components/DynamicForm/MentorForm/MentorForm';
import { modifiedSchema } from 'mfes/youthNet/src/utils/Helper';
import apartment from '../../public/images/apartment.svg';
import { getStateBlockDistrictList } from '@/services/MasterDataService';
import restoreIcon from '../../public/images/restore_user.svg';
import { showToastMessage } from '@/components/Toastify';

const Mentor = () => {
  const theme = useTheme<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [schema, setSchema] = useState(MentorSearchSchema);
  const [uiSchema, setUiSchema] = useState(MentorSearchUISchema);
  const [addSchema, setAddSchema] = useState(null);
  const [addUiSchema, setAddUiSchema] = useState(null);
  const [originalSchema, setOriginalSchema] = useState(null);
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
  const [roleId, setRoleID] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [userID, setUserId] = useState('');
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    village: '',
  });
  const [reason, setReason] = useState('');
  const [memberShipID, setMemberShipID] = useState('');
  const [blockVillageMap, setBlockVillageMap] = useState<
    Record<number, number[]>
  >({});
  const [buttonShow, setButtonShowState] = useState(true);
  const [isReassign, setIsReassign] = useState(false);
  const formRef = useRef(null);
  const { t, i18n } = useTranslation();
  const [archiveToActiveOpen, setArchiveToActiveOpen] = useState(false);

  const initialFormData = localStorage.getItem('stateId')
    ? { state: [localStorage.getItem('stateId')] }
    : {};

  const searchStoreKey = 'mentor';
  const initialFormDataSearch =
    localStorage.getItem(searchStoreKey) &&
    localStorage.getItem(searchStoreKey) != '{}'
      ? JSON.parse(localStorage.getItem(searchStoreKey))
      : localStorage.getItem('stateId')
      ? { state: [localStorage.getItem('stateId')] }
      : {};

  console.log('prefilledFormData!!!', prefilledFormData);

  useEffect(() => {
    if (response?.result?.totalCount !== 0) {
      searchData(prefilledFormData, 0);
    }
  }, [pageLimit]);
  useEffect(() => {
    // Fetch form schema from API and set it in state.
    const fetchData = async () => {
      const responseForm = await fetchForm([
        {
          fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${FormContext.mentor.context}&contextType=${FormContext.mentor.contextType}`,
          header: {},
        },
        {
          fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${FormContext.mentor.context}&contextType=${FormContext.mentor.contextType}`,
          header: {
            tenantid: localStorage.getItem('tenantId'),
          },
        },
      ]);
      console.log('responseForm', responseForm);
      const { newSchema, extractedFields } = modifiedSchema(responseForm);
      setAddSchema(newSchema?.schema);
      setAddUiSchema(newSchema?.uiSchema);
      setOriginalSchema(responseForm?.schema);
    };

    setPrefilledAddFormData(initialFormData);
    setPrefilledFormData(initialFormDataSearch);
    setRoleID(RoleId.TEACHER);
    setTenantId(localStorage.getItem('tenantId'));
    fetchData();
  }, []);

  const updatedUiSchema = {
    ...uiSchema,
    'ui:submitButtonOptions': {
      norender: true, // Hide submit button if isHide is true
    },
  };

  const router = useRouter();

  const SubmitaFunction = async (formData: any) => {
    setPrefilledFormData(formData);
    //set prefilled search data on refresh
    localStorage.setItem(searchStoreKey, JSON.stringify(formData));
    await searchData(formData, 0);
  };

  const searchData = async (formData: any, newPage: any) => {
    formData = Object.fromEntries(
      Object.entries(formData).filter(
        ([_, value]) => !Array.isArray(value) || value.length > 0
      )
    );
    const staticFilter = {
      role: 'Instructor',
    //  status: 'active',
      tenantId: localStorage.getItem('tenantId'),
    };
    if (localStorage.getItem('roleName') === Role.ADMIN) {
      staticFilter.state = [localStorage.getItem('stateId')];
    }
    const { sortBy } = formData;
    const staticSort = ['firstName', sortBy || 'asc'];
    await searchListData(
      formData,
      newPage,
      staticFilter,
      pageLimit,
      setPageOffset,
      setCurrentPage,
      setResponse,
      userList,
      staticSort
    );
  };

  // Define table columns
  const columns = [
    {
      keys: ['firstName', 'middleName', 'lastName'],
      label: 'Mentor Name',
      render: (row: any) =>
        `${transformLabel(row.firstName) || ''} ${
          transformLabel(row.middleName) || ''
        } ${transformLabel(row.lastName) || ''}`.trim(),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: any) => transformLabel(row.status),
      getStyle: (row: any) => ({
        color: row.status === 'active' ? 'green' : 'red',
      }),
    },
    {
      keys: ['gender'],
      label: 'Gender',
      render: (row) => transformLabel(row.gender) || '',
    },
    {
      keys: ['mobile'],
      label: 'Mobile',
      render: (row) => transformLabel(row.mobile) || '',
    },
    // {
    //   key: 'STATE',
    //   label: 'State',
    //   render: (row) => {
    //     const state =
    //       row.customFields.find((field) => field.label === 'STATE')
    //         ?.selectedValues[0]?.value || '-';
    //     return `${state}`;
    //   },
    // },
    {
      keys: ['STATE', 'DISTRICT', 'BLOCK', 'VILLAGE'],
      label: 'Location (State / District / Block/ Village)',
      render: (row: any) => {
        const state =
          transformLabel(
            row.customFields.find(
              (field: { label: string }) => field.label === 'STATE'
            )?.selectedValues?.[0]?.value
          ) || '';
        const district =
          transformLabel(
            row.customFields.find(
              (field: { label: string }) => field.label === 'DISTRICT'
            )?.selectedValues?.[0]?.value
          ) || '';
        const block =
          transformLabel(
            row.customFields.find(
              (field: { label: string }) => field.label === 'BLOCK'
            )?.selectedValues?.[0]?.value
          ) || '';
        const village =
          transformLabel(
            row.customFields.find(
              (field: { label: string }) => field.label === 'VILLAGE'
            )?.selectedValues?.[0]?.value
          ) || '';
        return `${state == '' ? '' : `${state}`}${
          district == '' ? '' : `, ${district}`
        }${block == '' ? '' : `, ${block}`}${
          village == '' ? '' : `, ${village}`
        }`;
      },
    },
  ];

  const userDelete = async () => {
    try {
      let membershipId = null;

      // Attempt to get the cohort list
      try {
        const userCohortResp = await getCohortList(userID);
        if (userCohortResp?.result?.cohortData?.length) {
          membershipId = userCohortResp.result.cohortData[0].cohortMembershipId;
        } else {
          console.warn('No cohort data found for the user.');
        }
      } catch (error) {
        console.error('Failed to fetch cohort list:', error);
      }

      // Attempt to update cohort member status only if we got a valid membershipId
      if (membershipId) {
        try {
          const updateResponse = await updateCohortMemberStatus({
            memberStatus: 'archived',
            statusReason: reason,
            membershipId: membershipId,
          });

          if (updateResponse?.responseCode !== 200) {
            console.error(
              'Failed to archive user from center:',
              updateResponse
            );
          } else {
            console.log('User successfully archived from center.');
          }
        } catch (error) {
          console.error('Error archiving user from center:', error);
        }
      }

      // Always attempt to delete the user
      console.log('Proceeding to self-delete...');
      const resp = await deleteUser(userID, {
        userData: { reason: reason, status: 'archived' },
      });

      if (resp?.responseCode === 200) {
        setResponse((prev) => ({
          ...prev,
          result: {
            ...prev?.result,
            getUserDetails: prev?.result?.getUserDetails?.filter(
              (item) => item?.userId !== userID
            ),
          },
        }));
        console.log('Team leader successfully archived.');
      } else {
        console.error('Failed to archive team leader:', resp);
      }

      return resp;
    } catch (error) {
      console.error('Error updating team leader:', error);
    }
  };
 const archiveToactive = async () => {
    try {
      let membershipIds = null;

      // Attempt to get the cohort list
      try {
        const userCohortResp = await getCohortList(userID);
        if (userCohortResp?.result?.length) {
          membershipIds = userCohortResp?.result?.map(
            (item) => item.cohortMembershipId
          );
        } else {
          console.warn('No cohort data found for the user.');
        }
      } catch (error) {
        console.error('Failed to fetch cohort list:', error);
      }

      // Attempt to update cohort member status only if we got a valid membershipId
      if (membershipIds && Array.isArray(membershipIds)) {
        for (const membershipId of membershipIds) {
          try {
            const updateResponse = await updateCohortMemberStatus({
              memberStatus: 'active',
           //   statusReason: reason,
              membershipId,
            });

            if (updateResponse?.responseCode !== 200) {
              console.error(
                `Failed to archive user with membershipId ${membershipId}:`,
                updateResponse
              );
            } else {
              console.log(
                `User with membershipId ${membershipId} successfully archived.`
              );
            }
          } catch (error) {
            console.error(
              `Error archiving user with membershipId ${membershipId}:`,
              error
            );
          }
        }
      }

      // Always attempt to delete the user
      console.log('Proceeding to self-delete...');
      const resp = await deleteUser(userID, {
        userData: { status: 'active' },
      });
                        showToastMessage(t("LEARNERS.ACTIVATE_USER_SUCCESS"), "success");


      if (resp?.responseCode === 200) {
        // setResponse((prev) => ({
        //   ...prev,
        //   result: {
        //     ...prev?.result,
        //     getUserDetails: prev?.result?.getUserDetails?.filter(
        //       (item) => item?.userId !== userID
        //     ),
        //   },
        // }));
        searchData(prefilledFormData, currentPage);
        
        console.log('learner successfully aactive.');
      } else {
        console.error('Failed to archive team leader:', resp);
      }

      return resp;
    } catch (error) {
      console.error('Error updating team leader:', error);
    }
  };
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
        setIsReassign(false);
        setEditableUserId(row?.userId);
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
      callback: async (row) => {
        const findVillage = row?.customFields.find((item) => {
          if (item.label === 'VILLAGE') {
            return item;
          }
        });
        setOpen(true);
        setUserId(row?.userId);

        setUserData({
          firstName: row?.firstName || '',
          lastName: row?.lastName || '',
          village: findVillage?.selectedValues?.[0]?.value || '',
        });
      },
               show: (row) => row.status !== 'archived'

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
          <Image src={apartment} alt="" />
        </Box>
      ),
      callback: async (row) => {
        // console.log('row:', row);
        let tempFormData = extractMatchingKeys(row, addSchema);
        let blockIds = [];
        let villageIds = [];
        row?.customFields?.forEach((field) => {
          if (field.label === 'BLOCK') {
            blockIds = field.selectedValues.map((item) => item.id);
          }
          if (field.label === 'VILLAGE') {
            villageIds = field.selectedValues.map((item) => item.id);
          }
        });
        // console.log('blockIds', blockIds);
        // console.log('villageIds', villageIds);
        // console.log('tempFormData>>>>', tempFormData);
        const getVillageMapByBlock = async () => {
          const result: Record<number, number[]> = {};

          for (const blockId of blockIds) {
            console.log('Processing blockId:', blockId); // Debug log

            if (!blockId) continue;

            try {
              const villageResponse = await getStateBlockDistrictList({
                controllingfieldfk: [blockId],
                fieldName: 'village',
              });

              const villages = villageResponse?.result?.values || [];

              const matchedVillages = villages
                .filter((item: any) => villageIds.includes(item?.value))
                .map((item: any) => item?.value);

              if (matchedVillages.length > 0) {
                result[blockId] = matchedVillages;
              }
            } catch (error) {
              console.error(
                `Error fetching villages for blockId ${blockId}:`,
                error
              );
            }
          }
          return result;
        };

        // Call the function
        const villageMap = await getVillageMapByBlock();
        // console.log('Final block-village map:', villageMap);
        setBlockVillageMap(villageMap);
        setPrefilledAddFormData(tempFormData);
        setIsEdit(false);
        setIsReassign(true);
        setButtonShow(true);
        setEditableUserId(row?.userId);
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
              <Image src={restoreIcon} alt="" />{' '}
            </Box>
          ),
          callback: async (row) => {
            const findVillage = row?.customFields.find((item) => {
              if (item.label === 'VILLAGE') {
                return item;
              }
            });
    
            // console.log('row:', row?.customFields[2].selectedValues[0].value);
            setEditableUserId(row?.userId);
    
            setArchiveToActiveOpen(true);
    
            setUserId(row?.userId);
    
            setUserData({
              firstName: row?.firstName || '',
              lastName: row?.lastName || '',
              village: findVillage?.selectedValues?.[0]?.value || '',
            });
            // setReason('');
            // setChecked(false);
          },
          show: (row) => row.status !== 'active',
        }
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
    setIsReassign(false);
    setIsEdit(false);
    setButtonShow(true);
  };

  //Add Edit Props
  const extraFieldsUpdate = {};
  const extraFields = {
    tenantCohortRoleMapping: [
      {
        tenantId: tenantId,
        roleId: roleId,
      },
    ],
    username: 'youthnetmentor',
    password: Math.floor(10000 + Math.random() * 90000),
  };
  const successUpdateMessage = 'MENTORS.MENTOR_UPDATED_SUCCESSFULLY';
  const telemetryUpdateKey = 'youthnet-mentor-updated-successfully';
  const failureUpdateMessage = 'MENTORS.NOT_ABLE_UPDATE_MENTOR';
  const successCreateMessage = 'MENTORS.MENTOR_CREATED_SUCCESSFULLY';
  const telemetryCreateKey = 'youthnet-mentor-created-successfully';
  const failureCreateMessage = 'MENTORS.NOT_ABLE_CREATE_MENTOR';
  const notificationKey = 'onMentorCreate';
  const notificationMessage = 'MENTORS.USER_CREDENTIALS_WILL_BE_SEND_SOON';
  const notificationContext = 'USER';
  const stateReassignmentNotificationKey = 'onMentorStateReassign';
  const districtReassignmentNotificationKey = 'onMentorReassign';
  const blockReassignmentNotificationKey = 'onMentorBlockReassign';
  const villageReassignmentNotificationKey = 'onMentorVillageReassign';

  const setButtonShow = (status) => {
    console.log('########## changed', status);
    setButtonShowState(status);
  };

  return (
    <>
      <Box display={'flex'} flexDirection={'column'} gap={2}>
        {isLoading ? (
          <Loader showBackdrop={false} loadingText={t('COMMON.LOADING')} />
        ) : (
          schema &&
          uiSchema && (
            <DynamicForm
              ref={formRef}
              schema={schema}
              uiSchema={updatedUiSchema}
              SubmitaFunction={SubmitaFunction}
              isCallSubmitInHandle={true}
              prefilledFormData={prefilledFormData}
            />
          )
        )}
        <Box
          sx={{ display: 'flex', justifyContent: 'flex-end' }}
          gap={2}
          mt={4}
        >
          <ResetFiltersButton
            searchStoreKey="mentor"
            formRef={formRef}
            SubmitaFunction={SubmitaFunction}
            setPrefilledFormData={setPrefilledFormData}
          />

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
              setPrefilledAddFormData(initialFormData);
              setIsEdit(false);
              setIsReassign(false);
              setEditableUserId('');
              handleOpenModal();
            }}
          >
            {t('COMMON.ADD_NEW')}
          </Button>
        </Box>

        <SimpleModal
          open={openModal}
          onClose={handleCloseModal}
          showFooter={buttonShow}
          primaryText={isEdit ? t('Update') : t('Next')}
          id="dynamic-form-id"
          modalTitle={
            isEdit
              ? t('MENTORS.UPDATE_MENTOR')
              : isReassign
              ? t('MENTORS.RE_ASSIGN_MENTOR')
              : t('MENTORS.NEW_MENTOR')
          }
        >
          <MentorForm
            t={t}
            SuccessCallback={() => {
              setPrefilledFormData(initialFormDataSearch);
              searchData(initialFormDataSearch, 0);
              setOpenModal(false);
            }}
            schema={addSchema}
            uiSchema={addUiSchema}
            editPrefilledFormData={prefilledAddFormData}
            isEdit={isEdit}
            isReassign={isReassign}
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
            notificationKey={notificationKey}
            notificationMessage={notificationMessage}
            notificationContext={notificationContext}
            type="mentor"
            hideSubmit={true}
            setButtonShow={setButtonShow}
            sdbvFieldData={originalSchema}
            blockVillageMap={isReassign ? blockVillageMap : {}}
            // isSteeper={true}
            stateReassignmentNotificationKey={stateReassignmentNotificationKey}
            districtReassignmentNotificationKey={
              districtReassignmentNotificationKey
            }
            blockReassignmentNotificationKey={blockReassignmentNotificationKey}
            villageReassignmentNotificationKey={
              villageReassignmentNotificationKey
            }
          />
        </SimpleModal>

        {response && response?.result?.getUserDetails ? (
          <Box sx={{ mt: 1 }}>
            <PaginatedTable
              count={response?.result?.totalCount}
              data={response?.result?.getUserDetails}
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
              {t('COMMON.NO_MENTOR_FOUND')}
            </Typography>
          </Box>
        )}
      </Box>
      <ConfirmationPopup
        checked={checked}
        open={open}
        onClose={() => setOpen(false)}
        title={t('COMMON.DELETE_USER')}
        primary={t('COMMON.DELETE_USER_WITH_REASON')}
        secondary={t('COMMON.CANCEL')}
        reason={reason}
        onClickPrimary={userDelete}
      >
        <DeleteDetails
          firstName={userData.firstName}
          lastName={userData.lastName}
          village={userData.village}
          checked={checked}
          setChecked={setChecked}
          reason={reason}
          setReason={setReason}
        />
      </ConfirmationPopup>
      <ConfirmationPopup
              checked={true}
              open={archiveToActiveOpen}
              onClose={() => setArchiveToActiveOpen(false)}
              title={t('COMMON.ACTIVATE_USER')}
              primary={t('COMMON.ACTIVATE')}
              secondary={t('COMMON.CANCEL')}
              reason={"yes"}
              onClickPrimary={archiveToactive}
            >
              <Box
                      sx={{
                        border: '1px solid #ddd',
                        borderRadius: 2,
                        mb: 2,
                        p: 1,
                      }}
                    >
                      <Typography>
                        { userData.firstName } { userData.lastName } {t("FORM.WAS_BELONG_TO")}
                      </Typography>
                      <TextField fullWidth value={userData.village} disabled sx={{ mt: 1 }} />
                    </Box>
               <Typography fontWeight="bold">
                         {t("FORM.CONFIRM_TO_ACTIVATE")}  
      
                      </Typography>
      
       </ConfirmationPopup>
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

export default Mentor;
