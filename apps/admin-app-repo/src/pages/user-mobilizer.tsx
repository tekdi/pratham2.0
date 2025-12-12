// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import DynamicForm from '@/components/DynamicForm/DynamicForm';
import Loader from '@/components/Loader';
import { useTranslation } from 'react-i18next';
import {
  MobilizerSearchSchema,
  MobilizerUISchema,
} from '../constant/Forms/MobilizerSearch';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { RoleId, RoleName, Status, TenantName } from '@/utils/app.constant';
import { userList } from '@/services/UserList';
import {
  Box,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import PaginatedTable from '@/components/PaginatedTable/PaginatedTable';
import { Button } from '@mui/material';
import SimpleModal from '@/components/SimpleModal';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { deleteUser } from '@/services/UserService';
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
import TenantService from '@/services/TenantService';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import CenteredLoader from '@/components/CenteredLoader/CenteredLoader';
import { extractWorkingLocationVillages, transformLabel } from '@/utils/Helper';
import ResetFiltersButton from '@/components/ResetFiltersButton/ResetFiltersButton';
import restoreIcon from '../../public/images/restore_user.svg';
import { showToastMessage } from '@/components/Toastify';
import ConfirmationPopup from '@/components/ConfirmationPopup';
import EmailSearchUser from '@shared-lib-v2/MapUser/EmailSearchUser';
import CenterListWidget from '@shared-lib-v2/MapUser/CenterListWidget';
import {
  enhanceUiSchemaWithGrid,
  splitUserData,
} from '@shared-lib-v2/DynamicForm/components/DynamicFormCallback';
import { enrollUserTenant } from '@shared-lib-v2/MapUser/MapService';
import axios from 'axios';
import { bulkCreateCohortMembers } from '@/services/CohortService/cohortService';

const Mobilizer = () => {
  const [archiveToActiveOpen, setArchiveToActiveOpen] = useState(false);

  const theme = useTheme<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [schema, setSchema] = useState(MobilizerSearchSchema);
  const [uiSchema, setUiSchema] = useState(MobilizerUISchema);
  const [addSchema, setAddSchema] = useState(null);
  const [addUiSchema, setAddUiSchema] = useState(null);
  const [prefilledState, setPrefilledState] = useState({});
  const [prefilledAddFormData, setPrefilledAddFormData] = useState({});
  const [pageLimit, setPageLimit] = useState<number>(10);
  const [pageOffset, setPageOffset] = useState<number>(0);
  const [prefilledFormData, setPrefilledFormData] = useState({});
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editableUserId, setEditableUserId] = useState('');
  const [state, setState] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { t, i18n } = useTranslation();
  const formRef = useRef(null);

  const [tenantId, setTenantId] = useState('');
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [userID, setUserId] = useState('');

  const searchStoreKey = 'mobilizer';
  const initialFormDataSearch =
    localStorage.getItem(searchStoreKey) &&
    localStorage.getItem(searchStoreKey) != '{}'
      ? JSON.parse(localStorage.getItem(searchStoreKey))
      : localStorage.getItem('stateId')
      ? { state: [localStorage.getItem('stateId')] }
      : {};

  const storedUserData = JSON.parse(localStorage.getItem('adminInfo') || '{}');

  console.log(
    '########### type mobilizer process.env.NEXT_PUBLIC_TEACHER_SBPLAYER',
    process.env.NEXT_PUBLIC_TEACHER_SBPLAYER
  );
  console.log(
    '########### type mobilizer process.env.NEXT_PUBLIC_ADMIN_SBPLAYER',
    process.env.NEXT_PUBLIC_ADMIN_SBPLAYER
  );
  let cleanedUrl = process.env.NEXT_PUBLIC_ADMIN_SBPLAYER?.replace(
    /\/sbplayer$/,
    ''
  );

  const [roleId, setRoleID] = useState('');
  console.log('########### type cleanedUrl', cleanedUrl);

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
          fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${FormContext.mobilizer.context}&contextType=${FormContext.mobilizer.contextType}`,
          header: {},
        },
        {
          fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${FormContext.mobilizer.context}&contextType=${FormContext.mobilizer.contextType}`,
          header: {
            tenantid: TenantService.getTenantId(),
          },
        },
      ]);
      // console.log('responseForm', responseForm);
      let alterSchema = responseForm?.schema;
      let alterUISchema = responseForm?.uiSchema;
      if (alterUISchema?.firstName) {
        alterUISchema.firstName['ui:disabled'] = true;
      }
      if (alterUISchema?.lastName) {
        alterUISchema.lastName['ui:disabled'] = true;
      }
      if (alterUISchema?.dob) {
        alterUISchema.dob['ui:disabled'] = true;
      }
      if (alterUISchema?.email) {
        alterUISchema.email['ui:disabled'] = true;
      }
      if (alterUISchema?.mobile) {
        alterUISchema.mobile['ui:disabled'] = true;
      }

      //bug fix for bakcend multiple times same fields in both form
      let requiredArray = alterSchema?.required;
      if (Array.isArray(requiredArray)) {
        // Remove duplicates from requiredArray
        requiredArray = Array.from(new Set(requiredArray));
      }
      alterSchema.required = requiredArray;

      //set 2 grid layout
      alterUISchema = enhanceUiSchemaWithGrid(alterUISchema);

      console.log('############# debugschema alterUISchema', alterUISchema);
      console.log('############# debugschema alterSchema', alterSchema);

      setAddSchema(alterSchema);
      setAddUiSchema(alterUISchema);
      setTenantId(localStorage.getItem('tenantId'));
    };

    setPrefilledAddFormData(initialFormDataSearch);
    fetchData();

    setRoleID(RoleId.MOBILIZER);
    setTenantId(localStorage.getItem('tenantId'));
  }, []);

  const updatedUiSchema = {
    ...uiSchema,
    'ui:submitButtonOptions': {
      norender: true, // Hide submit button if isHide is true
    },
  };

  const SubmitaFunction = async (formData: any) => {
    if (Object.keys(formData).length > 0) {
      setPrefilledFormData(formData);
      //set prefilled search data on refresh
      localStorage.setItem(searchStoreKey, JSON.stringify(formData));
      await searchData(formData, 0);
    }
  };

  //new variables
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [selectedCenterId, setSelectedCenterId] = useState<
    string | string[] | null
  >(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isMappingInProgress, setIsMappingInProgress] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [cohortResponse, setCohortResponse] = useState<any>(null); // Store full cohort/search API response
  const [catchmentAreaData, setCatchmentAreaData] = useState<any>(null); // Store extracted CATCHMENT_AREA data
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null); // Track selected block

  // Function to check if villages are selected in working_location
  // Returns { isValid: boolean, missingBlocks: Array<{state, district, block}>, isWorkingLocationMissing?: boolean }
  const validateVillagesSelected = (
    userDetails: any
  ): {
    isValid: boolean;
    missingBlocks: Array<{
      stateName: string;
      districtName: string;
      blockName: string;
    }>;
    isWorkingLocationMissing?: boolean;
  } => {
    const missingBlocks: Array<{
      stateName: string;
      districtName: string;
      blockName: string;
    }> = [];

    // Extract working_location from userDetails
    // It can be at top level or inside customFields array
    let workingLocation = userDetails?.working_location;

    // If not at top level, try to find it in customFields
    // working_location has a specific structure: array of objects with stateId, stateName, districts
    if (
      !workingLocation &&
      userDetails?.customFields &&
      Array.isArray(userDetails.customFields)
    ) {
      const workingLocationField = userDetails.customFields.find(
        (field: any) => {
          // Check if the value matches working_location structure
          if (
            field.value &&
            Array.isArray(field.value) &&
            field.value.length > 0
          ) {
            const firstItem = field.value[0];
            // working_location structure: { stateId, stateName, districts: [...] }
            return (
              firstItem &&
              typeof firstItem === 'object' &&
              'stateId' in firstItem &&
              'stateName' in firstItem &&
              'districts' in firstItem
            );
          }
          return false;
        }
      );
      if (workingLocationField?.value) {
        workingLocation = workingLocationField.value;
      }
    }

    if (!workingLocation) {
      console.log(
        'validateVillagesSelected: No working_location found in userDetails or customFields',
        userDetails
      );
      // Return with a flag to indicate working_location is missing entirely
      return {
        isValid: false,
        missingBlocks: [],
        isWorkingLocationMissing: true,
      };
    }
    if (!Array.isArray(workingLocation) || workingLocation.length === 0) {
      console.log(
        'validateVillagesSelected: working_location is not a valid array'
      );
      return {
        isValid: false,
        missingBlocks: [],
        isWorkingLocationMissing: true,
      };
    }

    console.log(
      'validateVillagesSelected: workingLocation',
      JSON.stringify(workingLocation, null, 2)
    );

    let totalBlocks = 0;
    let blocksWithVillages = 0;

    // Check EVERY block - each block must have at least one village selected
    for (const state of workingLocation) {
      if (state.districts && Array.isArray(state.districts)) {
        for (const district of state.districts) {
          if (district.blocks && Array.isArray(district.blocks)) {
            for (const block of district.blocks) {
              totalBlocks++;

              // Check if this block has villages selected
              // Villages can be an array of objects with {id, name} or just empty array
              const hasVillages =
                block.villages &&
                Array.isArray(block.villages) &&
                block.villages.length > 0;

              console.log(
                `Block ${
                  block.name || block.id
                }: hasVillages=${hasVillages}, villages count=${
                  block.villages?.length || 0
                }, villages=`,
                block.villages
              );

              if (hasVillages) {
                blocksWithVillages++;
              } else {
                // This block is missing villages
                missingBlocks.push({
                  stateName: state.stateName || t('MOBILIZER.UNKNOWN_STATE'),
                  districtName:
                    district.districtName || t('MOBILIZER.UNKNOWN_DISTRICT'),
                  blockName: block.name || t('MOBILIZER.UNKNOWN_BLOCK'),
                });
              }
            }
          }
        }
      }
    }

    console.log(
      `validateVillagesSelected: totalBlocks=${totalBlocks}, blocksWithVillages=${blocksWithVillages}, missingBlocks=${missingBlocks.length}`
    );

    console.log('validateVillagesSelected: missingBlocks', missingBlocks);

    return {
      isValid: missingBlocks.length === 0,
      missingBlocks,
    };
  };

  const searchData = async (formData: any, newPage: any) => {
    if (formData) {
      formData = Object.fromEntries(
        Object.entries(formData).filter(
          ([_, value]) => !Array.isArray(value) || value.length > 0
        )
      );
      const staticFilter = {
        role: RoleName.MOBILIZER,
        tenantId: storedUserData.tenantData[0].tenantId,
      };
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
    }
  };

  // Define table columns
  let columns = [
    {
      keys: ['firstName', 'middleName', 'lastName'],
      label: t('MOBILIZER.MOBILIZER_NAME'),
      render: (row: any) =>
        `${transformLabel(row.firstName) || ''} ${
          transformLabel(row.middleName) || ''
        } ${transformLabel(row.lastName) || ''}`.trim(),
    },
    {
      keys: ['gender'],
      label: t('TABLE_TITLE.GENDER') || 'Gender',
      render: (row) => transformLabel(row.gender) || '',
    },
    {
      keys: ['mobile'],
      label: t('TABLE_TITLE.MOBILE') || 'Mobile',
      render: (row) => transformLabel(row.mobile) || '',
    },
    {
      keys: ['STATE', 'DISTRICT', 'BLOCK', 'VILLAGE'],
      label: t('TABLE_TITLE.LOCATION'),
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
    {
      keys: ['working_village'],
      label: t('TABLE_TITLE.WORKING_VILLAGE') || 'Working Village',
      render: (row) => extractWorkingLocationVillages(row) || '',
    },
    {
      key: 'status',
      label: t('TABLE_TITLE.STATUS'),
      render: (row: any) => transformLabel(row.status),
      getStyle: (row: any) => ({
        color: row.status === 'active' ? 'green' : 'red',
      }),
    },
  ];

  const archiveToactive = async () => {
    try {
      const resp = await deleteUser(editableUserId, {
        userData: { status: 'active' },
      });
      setArchiveToActiveOpen(false);
      searchData(prefilledFormData, currentPage);

      showToastMessage(t('MOBILIZER.ACTIVATE_USER_SUCCESS'), 'success');
    } catch (error) {
      console.error('Error updating mobilizer:', error);
    }
  };
  // Define actions
  const actions = [
    // {
    //   icon: (
    //     <Box
    //       sx={{
    //         display: 'flex',
    //         flexDirection: 'column',
    //         alignItems: 'center',
    //         cursor: 'pointer',
    //         // backgroundColor: 'rgb(227, 234, 240)',
    //         justifyContent: 'center',
    //         padding: '10px',
    //       }}
    //       title="Edit State Lead"
    //     >
    //       <Image src={editIcon} alt="" />
    //     </Box>
    //   ),
    //   callback: (row: any) => {
    //     console.log('row:', row);
    //     console.log('AddSchema', addSchema);
    //     console.log('AddUISchema', addUiSchema);
    //     let tempFormData = extractMatchingKeys(row, addSchema);
    //     console.log('tempFormData', tempFormData);
    //     setPrefilledAddFormData(tempFormData);
    //     setIsEdit(true);
    //     setEditableUserId(row?.userId);
    //     handleOpenModal();
    //   },
    //   show: (row) => row.status !== 'archived',
    // },
    // {
    //   icon: (
    //     <Box
    //       sx={{
    //         display: 'flex',
    //         flexDirection: 'column',
    //         alignItems: 'center',
    //         cursor: 'pointer',
    //         // backgroundColor: 'rgb(227, 234, 240)',
    //         justifyContent: 'center',
    //         padding: '10px',
    //       }}
    //       title="Delete State Lead"
    //     >
    //       {' '}
    //       <Image src={deleteIcon} alt="" />
    //     </Box>
    //   ),
    //   callback: async (row: any) => {
    //     console.log('row:', row);
    //     setEditableUserId(row?.userId);
    //     const userId = row?.userId;
    //     const response = await deleteUser(userId, {
    //       userData: {
    //         status: Status.ARCHIVED,
    //       },
    //     });
    //     setPrefilledFormData({});
    //     searchData(prefilledFormData, currentPage);
    //     setOpenModal(false);
    //   },
    //   show: (row) => row.status !== 'archived',
    // },
    // {
    //   icon: (
    //     <Box
    //       sx={{
    //         display: 'flex',
    //         flexDirection: 'column',
    //         alignItems: 'center',
    //         cursor: 'pointer',
    //         // backgroundColor: 'rgb(227, 234, 240)',
    //         justifyContent: 'center',
    //         padding: '10px',
    //       }}
    //       title="Reactivate State Lead"
    //     >
    //       {' '}
    //       <Image src={restoreIcon} alt="" />
    //     </Box>
    //   ),
    //   callback: async (row: any) => {
    //     const findState = row?.customFields.find((item) => {
    //       if (item.label === 'STATE') {
    //         return item;
    //       }
    //     });
    //     setState(findState?.selectedValues[0]?.value);
    //     console.log('row:', findState);
    //     setFirstName(row?.firstName);
    //     setLastName(row?.lastName);
    //     setEditableUserId(row?.userId);
    //     const userId = row?.userId;
    //     // const response = await archiveToactive(userId);
    //     setArchiveToActiveOpen(true);
    //     setPrefilledFormData({});
    //   },
    //   show: (row) => row.status !== 'active',
    // }
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

  const [formStep, setFormStep] = useState(0);

  // Function to fetch cohort list when block is selected
  const fetchCohortListByBlock = async (blockId: string) => {
    if (!blockId) {
      setCohortResponse(null);
      setCatchmentAreaData(null);
      return;
    }

    try {
      const tenantId = localStorage.getItem('tenantId') || '';
      const token = localStorage.getItem('token') || '';
      const academicYearId = localStorage.getItem('academicYearId') || '';

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/cohort/search`,
        {
          limit: 200,
          offset: 0,
          filters: {
            type: 'COHORT',
            block: [blockId],
            status: ['active'],
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            tenantId: tenantId,
            Authorization: `Bearer ${token}`,
            academicyearid: academicYearId,
          },
        }
      );

      // Store the full response
      setCohortResponse(response?.data);
      console.log('############# cohortResponse stored', response?.data);
    } catch (error) {
      console.error('Error fetching cohort list:', error);
      setCohortResponse(null);
      setCatchmentAreaData(null);
    }
  };

  // Function to extract CATCHMENT_AREA from selected center
  const extractCatchmentAreaFromCenter = (centerId: string) => {
    if (!cohortResponse || !centerId) {
      setCatchmentAreaData(null);
      return;
    }

    try {
      const cohortDetails =
        cohortResponse?.result?.results?.cohortDetails || [];
      const selectedCenter = cohortDetails.find(
        (cohort: any) => cohort.cohortId === centerId
      );

      if (selectedCenter) {
        const customFields = selectedCenter.customFields || [];
        const catchmentAreaField = customFields.find(
          (field: any) => field.label === 'CATCHMENT_AREA'
        );

        if (
          catchmentAreaField?.selectedValues &&
          Array.isArray(catchmentAreaField.selectedValues) &&
          catchmentAreaField.selectedValues.length > 0
        ) {
          const extractedCatchmentArea = catchmentAreaField.selectedValues;
          setCatchmentAreaData(extractedCatchmentArea);
          console.log(
            '############# extractedCatchmentArea',
            extractedCatchmentArea
          );
        } else {
          setCatchmentAreaData(null);
          console.log('No CATCHMENT_AREA found in selected center');
        }
      } else {
        setCatchmentAreaData(null);
        console.log('Selected center not found in cohort response');
      }
    } catch (error) {
      console.error('Error extracting catchment area:', error);
      setCatchmentAreaData(null);
    }
  };

  //Add Edit Props
  const extraFieldsUpdate = {};
  const extraFields = {
    tenantCohortRoleMapping: [
      {
        tenantId: TenantService.getTenantId(),
        roleId: RoleId.MOBILIZER,
      },
    ],
    password: Math.floor(10000 + Math.random() * 90000),
  };
  const successUpdateMessage = 'MOBILIZER.MOBILIZER_UPDATED_SUCCESSFULLY';
  const telemetryUpdateKey = 'mobilizer-updated-successfully';
  const failureUpdateMessage = 'MOBILIZER.NOT_ABLE_UPDATE_MOBILIZER';
  const successCreateMessage = 'MOBILIZER.MOBILIZER_CREATED_SUCCESSFULLY';
  const telemetryCreateKey = 'mobilizer-created-successfully';
  const failureCreateMessage = 'MOBILIZER.NOT_ABLE_CREATE_MOBILIZER';
  const notificationKey = 'onMobilizerCreate';
  const notificationMessage = 'MOBILIZER.USER_CREDENTIALS_WILL_BE_SEND_SOON';
  const notificationContext = 'USER';
  useEffect(() => {
    setPrefilledFormData(initialFormDataSearch);
  }, []);
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
              prefilledFormData={prefilledFormData || {}}
            />
          )
        )}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }} mt={4}>
          <ResetFiltersButton
            searchStoreKey="mobilizer"
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
              setPrefilledState({});
              setFormStep(0);
              setSelectedUserId(null);
              setUserDetails(null);
              setSelectedCenterId(null);
              setCohortResponse(null);
              setCatchmentAreaData(null);
              setSelectedBlockId(null);
              setMapModalOpen(true);
            }}
          >
            {t('COMMON.ADD_NEW')}
          </Button>
        </Box>

        {/* <SimpleModal
          open={openModal}
          onClose={handleCloseModal}
          showFooter={true}
          primaryText={isEdit ? t('Update') : t('Create')}
          id="dynamic-form-id"
          modalTitle={
            isEdit
              ? t('STATE_LEADS.UPDATE_STATE_LEAD')
              : t('STATE_LEADS.NEW_STATE_LEAD')
          }
        >
          <AddEditUser
            SuccessCallback={() => {
              setPrefilledFormData(initialFormDataSearch);
              searchData(initialFormDataSearch, 0);
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
            notificationKey={notificationKey}
            notificationMessage={notificationMessage}
            notificationContext={notificationContext}
            hideSubmit={true}
            type={'state-lead'}
          />
        </SimpleModal> */}

        {response != null ? (
          <>
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
                  {t('COMMON.NO_MOBILIZER_FOUND')}
                </Typography>
              </Box>
            )}
          </>
        ) : (
          <CenteredLoader />
        )}

        <ConfirmationPopup
          checked={true}
          open={archiveToActiveOpen}
          onClose={() => setArchiveToActiveOpen(false)}
          title={t('COMMON.ACTIVATE_USER')}
          primary={t('COMMON.ACTIVATE')}
          secondary={t('COMMON.CANCEL')}
          reason={'yes'}
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
              {firstName} {lastName} {t('FORM.WAS_BELONG_TO')}
            </Typography>
            <TextField fullWidth value={state} disabled sx={{ mt: 1 }} />
          </Box>
          <Typography fontWeight="bold">
            {t('FORM.CONFIRM_TO_ACTIVATE')}
          </Typography>
        </ConfirmationPopup>
      </Box>

      {/* Map Modal Dialog */}
      <Dialog
        open={mapModalOpen}
        onClose={(event, reason) => {
          // Prevent closing on backdrop click
          if (reason !== 'backdropClick') {
            setMapModalOpen(false);
            setSelectedCenterId(null); // Reset center selection when dialog closes
            setSelectedUserId(null); // Reset user selection when dialog closes
            setUserDetails(null);
            setCohortResponse(null);
            setCatchmentAreaData(null);
            setSelectedBlockId(null);
            setFormStep(0);
          }
        }}
        maxWidth={false}
        fullWidth={true}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: '100%',
            maxHeight: '100vh',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #eee',
            p: 2,
          }}
        >
          {formStep === 1 ? (
            <Button
              sx={{
                backgroundColor: '#FFC107',
                color: '#000',
                fontFamily: 'Poppins',
                fontWeight: 500,
                fontSize: '14px',
                height: '40px',
                lineHeight: '20px',
                letterSpacing: '0.1px',
                textAlign: 'center',
                verticalAlign: 'middle',
                '&:hover': {
                  backgroundColor: '#ffb300',
                },
                p: 2,
              }}
              startIcon={<ArrowBackIcon />}
              onClick={() => {
                setFormStep(0);
                setSelectedUserId(null);
                setUserDetails(null);
                // Keep center selection and catchment area data when going back
              }}
            >
              {t('COMMON.BACK')}
            </Button>
          ) : (
            <Typography variant="h1" component="div"></Typography>
          )}
          <Typography variant="h1" component="div">
            {t('MOBILIZER.MAP_USER_AS_MOBILIZER')}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={() => {
              setMapModalOpen(false);
              setFormStep(0);
              setSelectedCenterId(null);
              setSelectedUserId(null);
              setUserDetails(null);
              setCohortResponse(null);
              setCatchmentAreaData(null);
              setSelectedBlockId(null);
            }}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, overflowY: 'auto' }}>
          {formStep === 0 && (
            <Box sx={{ mb: 3 }}>
              <CenterListWidget
                value={selectedCenterId}
                onChange={(centerId) => {
                  const centerIdStr = Array.isArray(centerId)
                    ? centerId[0]
                    : centerId;
                  setSelectedCenterId(centerIdStr);
                  console.log('Selected Center ID:', centerIdStr);

                  // Extract CATCHMENT_AREA when center is selected
                  if (centerIdStr) {
                    extractCatchmentAreaFromCenter(centerIdStr);
                  } else {
                    setCatchmentAreaData(null);
                  }
                }}
                label="Select Center"
                required={true}
                multiple={false}
                onBlockChange={(blockId) => {
                  // Handle block change - fetch cohort list and clear previous selections
                  console.log('Block changed to:', blockId);
                  setSelectedBlockId(blockId);
                  setSelectedCenterId(null);
                  setCatchmentAreaData(null);

                  if (blockId) {
                    fetchCohortListByBlock(blockId);
                  } else {
                    setCohortResponse(null);
                    setCatchmentAreaData(null);
                  }
                }}
              />
            </Box>
          )}
          {formStep === 1 && (
            <Box sx={{ mb: 3 }}>
              <EmailSearchUser
                // catchmentArea={catchmentAreaData}
                onUserSelected={(userId) => {
                  setSelectedUserId(userId || null);
                  console.log('Selected User ID:', userId);
                }}
                onUserDetails={async (userDetails) => {
                  console.log('############# userDetails', userDetails);
                  setUserDetails(userDetails);
                  // window.alert('userDetails' + userDetails);
                  // window.alert('selectedUserId' + selectedUserId);
                  if (selectedUserId && userDetails) {
                    // Validate that villages are selected for EVERY block in working_location
                    const validationResult =
                      validateVillagesSelected(userDetails);
                    console.log(
                      '############# validationResult',
                      validationResult
                    );
                    if (!validationResult.isValid) {
                      const missingCount =
                        validationResult.missingBlocks.length;
                      let errorMessage = '';

                      if (missingCount > 0) {
                        // Show first few missing blocks in the error message
                        const firstFew = validationResult.missingBlocks
                          .slice(0, 3)
                          .map(
                            (block) =>
                              `${block.blockName} (${block.districtName}, ${block.stateName})`
                          )
                          .join(', ');

                        if (missingCount > 3) {
                          errorMessage = t(
                            'MOBILIZER.WORKING_LOCATION_REQUIRED_MISSING_VILLAGES',
                            {
                              blocks: firstFew,
                              count: missingCount - 3,
                            }
                          );
                        } else {
                          errorMessage = t(
                            'MOBILIZER.WORKING_LOCATION_REQUIRED_MISSING_VILLAGES_SINGLE',
                            {
                              blocks: firstFew,
                            }
                          );
                        }
                      } else if (validationResult.isWorkingLocationMissing) {
                        // working_location itself is missing or invalid
                        errorMessage = t('MOBILIZER.WORKING_LOCATION_REQUIRED');
                      } else {
                        // No missing blocks but validation failed - this shouldn't happen, but handle it
                        errorMessage = t(
                          'MOBILIZER.WORKING_LOCATION_REQUIRED_AT_LEAST_ONE'
                        );
                      }

                      showToastMessage(errorMessage, 'error');
                      return;
                    }

                    setIsMappingInProgress(true);
                    try {
                      const { userData, customFields } =
                        splitUserData(userDetails);

                      delete userData.email;

                      const object = {
                        userData: userData,
                        customField: customFields,
                      };

                      //update user details
                      const updateUserResponse = await enrollUserTenant({
                        userId: selectedUserId,
                        tenantId: tenantId,
                        roleId: roleId,
                        customField: customFields,
                        userData: userData,
                      });
                      console.log(
                        '######### updatedResponse',
                        updateUserResponse
                      );

                      if (
                        updateUserResponse &&
                        updateUserResponse?.params?.err === null
                      ) {
                        // Ensure selectedCenterId is a string (handle array case)
                        const cohortId = Array.isArray(selectedCenterId)
                          ? selectedCenterId[0]
                          : selectedCenterId;

                        // Call bulkCreateCohortMembers to map user to center
                        if (cohortId && selectedUserId) {
                          try {
                            const cohortMemberResponse =
                              await bulkCreateCohortMembers({
                                userId: [selectedUserId],
                                cohortId: [cohortId],
                              });

                            if (
                              cohortMemberResponse?.responseCode === 201 ||
                              cohortMemberResponse?.params?.err === null
                            ) {
                              console.log(
                                'Successfully mapped user to center:',
                                cohortMemberResponse
                              );
                            } else {
                              console.error(
                                'Error mapping user to center:',
                                cohortMemberResponse
                              );
                            }
                          } catch (cohortError) {
                            console.error(
                              'Error in bulkCreateCohortMembers:',
                              cohortError
                            );
                            // Don't fail the entire flow if cohort mapping fails
                          }
                        }

                        showToastMessage(t(successUpdateMessage), 'success');

                        // Close dialog
                        setMapModalOpen(false);
                        setSelectedCenterId(null);
                        setSelectedUserId(null);
                        setCohortResponse(null);
                        setCatchmentAreaData(null);
                        setSelectedBlockId(null);
                        setFormStep(0);
                        // Refresh the data
                        searchData(prefilledFormData, 0);
                      } else {
                        showToastMessage(t(failureUpdateMessage), 'error');
                      }
                    } catch (error) {
                      console.error('Error creating cohort member:', error);
                      showToastMessage(
                        error?.response?.data?.params?.errmsg ||
                          t(failureCreateMessage),
                        'error'
                      );
                    } finally {
                      setIsMappingInProgress(false);
                    }
                  } else if (!selectedUserId) {
                    showToastMessage(
                      t('MOBILIZER.PLEASE_SEARCH_AND_SELECT_USER'),
                      'error'
                    );
                  }
                }}
                schema={addSchema}
                uiSchema={addUiSchema}
                prefilledState={{}}
                onPrefilledStateChange={(prefilledState) => {
                  setPrefilledState(prefilledState || {});
                }}
                roleId={roleId}
                tenantId={tenantId}
                type="leader"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          {formStep === 0 && (
            <Button
              sx={{
                backgroundColor: '#FFC107',
                color: '#000',
                fontFamily: 'Poppins',
                fontWeight: 500,
                fontSize: '14px',
                height: '40px',
                lineHeight: '20px',
                letterSpacing: '0.1px',
                textAlign: 'center',
                verticalAlign: 'middle',
                '&:hover': {
                  backgroundColor: '#ffb300',
                },
                width: '100%',
              }}
              disabled={!selectedCenterId || isMappingInProgress}
              onClick={() => {
                if (selectedCenterId) {
                  setFormStep(1);
                  localStorage.setItem(
                    'workingLocationCenterId',
                    selectedCenterId
                  );
                } else {
                  showToastMessage('Please select a center', 'error');
                }
              }}
            >
              {t('COMMON.NEXT')}
            </Button>
          )}
          {formStep === 1 && (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              disabled={!selectedUserId || isMappingInProgress}
              form="dynamic-form-id"
              type="submit"
              // onClick={async () => {

              // }}
            >
              {t('COMMON.MAP')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
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

export default Mobilizer;
