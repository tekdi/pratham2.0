// @ts-nocheck
import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Divider,
} from '@mui/material';
import Loader from '@/components/Loader';
import DynamicForm from '@/components/DynamicForm/DynamicForm';
import _ from 'lodash';
import axios from 'axios';
import { API_ENDPOINTS } from '@/utils/API/APIEndpoints';
import CenteredLoader from '@/components/CenteredLoader/CenteredLoader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { createUser, updateUser } from '@/services/CreateUserService';
import {
  getReassignPayload,
  getUserFullName,
  isBlockDifferent,
  isBlockSetDifferent,
  isCenterDifferent,
  isVillageDifferent,
  toPascalCase,
} from '@/utils/Helper';
import { sendCredentialService } from '@/services/NotificationService';
import { showToastMessage } from '@/components/Toastify';
import {
  notificationCallback,
  splitUserData,
  telemetryCallbacks,
} from '../DynamicFormCallback';
import { getCohortList } from '@/services/GetCohortList';
import {
  bulkCreateCohortMembers,
  updateReassignUser,
} from '@/services/CohortService/cohortService';
import useNotification from '@/hooks/useNotification';
import VillageSelection from '@/components/MentorForm/VillageSelection';
import VillageBlockSelector from './VillageBlockSelector';
import { getStateBlockDistrictList } from '@/services/MasterDataService';
import { Role } from '@/utils/app.constant';
const MentorForm = ({
  t,
  SuccessCallback,
  schema,
  uiSchema,
  editPrefilledFormData,
  isEdit,
  isReassign,
  UpdateSuccessCallback,
  extraFields,
  extraFieldsUpdate,
  type,
  hideSubmit,
  setButtonShow,
  successCreateMessage,
  failureCreateMessage,
  editableUserId,
  successUpdateMessage,
  telemetryUpdateKey,
  failureUpdateMessage,
  notificationContext,
  notificationKey,
  notificationMessage,
  telemetryCreateKey,
  sdbvFieldData,
  blockVillageMap,
  blockReassignmentNotificationKey,
  villageReassignmentNotificationKey,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [alteredSchema, setAlteredSchema] = useState<any>(null);
  const [alteredSchemaCB, setAlteredSchemaCB] = useState<any>(null);
  const [alteredUiSchema, setAlteredUiSchema] = useState<any>(null);

  const [prefilledFormData, setPrefilledFormData] = useState(
    editPrefilledFormData
  );
  const [originalPrefilledFormData, setOriginalPrefilledFormData] = useState(
    editPrefilledFormData
  );
  const [showNextForm, setShowNextForm] = useState<boolean>(false);
  const [blocks, setBlocks] = useState<any>([]);

  const [blockId, setBlockId] = useState([]);
  const [districtId, setDistrictId] = useState([]);
  const [stateId, setStateId] = useState([]);

  // const [selectedCenterBatches, setSelectedCenterBatches] = useState(null);

  const [isChangeForm, setIsChangeForm] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedVillages, setSelectedVillages] =
    useState<Record<string, string[]>>(blockVillageMap);
  const [totalVillageCount, setTotalVillageCount] = useState(0);
  const [districtName, setDistrictName] = useState<any>('');

  const { getNotification } = useNotification();
  const userRole = localStorage.getItem('roleName');

  const [autoSkipInProgress, setAutoSkipInProgress] = useState(false);
  const autoSkipTriggered = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      let isEditSchema = _.cloneDeep(schema);
      let isEditSchemaCB = _.cloneDeep(schema);
      let isEditUiSchema = _.cloneDeep(uiSchema);

      if (localStorage.getItem('stateId')) {
        // console.log('##########isEditUiSchema', isEditUiSchema);
        // ✅ Add `ui:disabled` to the `state` field
        if (isEditUiSchema?.state) {
          isEditUiSchema.state['ui:disabled'] = true;
        }
      }

      console.log('######## filteredKeys start', isReassign);
      if (isEdit) {
        console.log('########### debug issue ', isEditUiSchema);
        let keysToRemove = ['state', 'district'];

        keysToRemove.forEach((key) => delete isEditSchema.properties[key]);
        keysToRemove.forEach((key) => delete isEditUiSchema[key]);
        //also remove from required if present
        isEditSchema.required = isEditSchema.required.filter(
          (key) => !keysToRemove.includes(key)
        );
        // console.log('isEditSchema', JSON.stringify(isEditSchema));
      } else if (isReassign) {
        console.log('######## filteredKeys isReassign');
        if (isEditUiSchema?.firstName) {
          isEditUiSchema.firstName['ui:widget'] = 'hidden';
        }

        if (userRole === Role.ADMIN) {
          if (isEditUiSchema?.district) {
            isEditUiSchema.district['ui:disabled'] = true;
          }
        }

        const keysToHave = ['state', 'district', 'firstName'];
        const properties = isEditSchema.properties;

        const keysToRemove = Object.keys(properties).filter(
          (key) => !keysToHave.includes(key)
        );

        // Remove from schema and UI schema
        keysToRemove.forEach((key) => delete isEditSchema.properties[key]);
        keysToRemove.forEach((key) => delete isEditUiSchema[key]);

        // Remove from required array
        isEditSchema.required = isEditSchema.required.filter(
          (key) => !keysToRemove.includes(key)
        );

        // Remove from ui:order
        if (Array.isArray(isEditUiSchema['ui:order'])) {
          isEditUiSchema['ui:order'] = isEditUiSchema['ui:order'].filter(
            (key) => !keysToRemove.includes(key)
          );
        }

        // // 🛠️ Instead of filtering, clone and delete
        // const updatedFormData = { ...prefilledFormData };
        // keysToRemove.forEach((key) => delete updatedFormData[key]);

        console.log(
          '######## filteredKeys updatedFormData>>',
          prefilledFormData
        );
        setPrefilledFormData(prefilledFormData);
        setIsChangeForm((prev) => !prev);
      }

      // else {
      //   const keysToRemove = [];
      //   keysToRemove.forEach((key) => delete isEditSchema?.properties[key]);
      //   keysToRemove.forEach((key) => delete isEditUiSchema[key]);
      //   //also remove from required if present
      //   isEditSchema.required = isEditSchema.required.filter(
      //     (key) => !keysToRemove.includes(key)
      //   );
      //   // console.log('isEditSchema', JSON.stringify(isEditSchema));

      //   //create another for sending center and batch
      //   const keysToRemoveCB = ['password', 'confirm_password', 'program'];
      //   keysToRemoveCB.forEach((key) => delete isEditSchemaCB?.properties[key]);
      // }
      setAlteredSchema(isEditSchema);
      setAlteredSchemaCB(isEditSchemaCB);
      setAlteredUiSchema(isEditUiSchema);
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Only run if reassign case, and not already triggered
    if (
      isReassign === true &&
      alteredSchema &&
      alteredUiSchema &&
      !autoSkipTriggered.current
    ) {
      autoSkipTriggered.current = true;
      setAutoSkipInProgress(true);
      // Use transformFormData to get the payload
      const payload = transformFormData(
        prefilledFormData || {},
        alteredSchema,
        isEdit ? extraFieldsUpdate : extraFields
      );
      // Call StepperFormSubmitFunction and then stop loader
      Promise.resolve(
        StepperFormSubmitFunction(prefilledFormData || {}, payload)
      ).finally(() => {
        setAutoSkipInProgress(false);
      });
    }
  }, [alteredSchema, alteredUiSchema, isReassign]);

  // const flresponsetotl = async (response: any[]) => {
  //   console.log('###### responsedebug flresponsetotl', response);
  //   const uniqueParentIds = Array.from(
  //     new Set(
  //       response
  //         .filter((item) => item.cohortMemberStatus === 'active')
  //         .map((item) => item.parentId)
  //     )
  //   );
  //   console.log('###### responsedebug uniqueParentIds', uniqueParentIds);

  //   const fetchParentData = async (parentId: string) => {
  //     try {
  //       const url = API_ENDPOINTS.cohortSearch;
  //       const header = {
  //         tenantId: localStorage.getItem('tenantId') || '',
  //         Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
  //         academicyearid: localStorage.getItem('academicYearId') || '',
  //       };

  //       const response = await fetch(url, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           ...header,
  //         },
  //         body: JSON.stringify({
  //           limit: 200,
  //           offset: 0,
  //           filters: {
  //             status: ['active'],
  //             cohortId: parentId,
  //           },
  //         }),
  //       });

  //       const data = await response.json();
  //       const cohortDetails = data?.result?.results?.cohortDetails || [];

  //       // Remove customFields if needed
  //       const filteredBatch = cohortDetails
  //         .filter((item) => item.status === 'active')
  //         .map(({ customFields, ...rest }) => rest);

  //       return filteredBatch;
  //     } catch (error) {
  //       console.error(`Error fetching data for parentId ${parentId}:`, error);
  //       return [];
  //     }
  //   };

  //   const getAllParentData = async (parentIds: string[]) => {
  //     const results = await Promise.all(
  //       parentIds.map((id) => fetchParentData(id))
  //     );
  //     return results.flat(); // flatten nested arrays
  //   };

  //   // Now fetch and attach children
  //   const parentData = await getAllParentData(uniqueParentIds);

  //   const updatedCohorts = parentData.map((cohort) => {
  //     const children = response.filter(
  //       (child) =>
  //         child.parentId === cohort.cohortId &&
  //         child.cohortMemberStatus == 'active'
  //     );

  //     return {
  //       ...cohort,
  //       childData: children,
  //     };
  //   });

  //   console.log('###### responsedebug updatedCohorts', updatedCohorts);
  //   const transformCohortData = (cohorts) => {
  //     const transform = (item) => {
  //       const { name, cohortName, status, cohortStatus, childData, ...rest } =
  //         item;

  //       const updated = {
  //         ...rest,
  //         name: cohortName ?? name,
  //         cohortName: name ?? cohortName,
  //         status: cohortStatus ?? status,
  //         cohortStatus: status ?? cohortStatus,
  //         childData: childData?.map(transform) || [],
  //       };

  //       return updated;
  //     };

  //     return cohorts.map(transform);
  //   };

  //   // Usage
  //   const transformedData = transformCohortData(updatedCohorts);
  //   console.log('###### responsedebug transformedData', transformedData);

  //   return transformedData;
  // };

  const StepperFormSubmitFunction = async (formData: any, payload: any) => {
    if (isEdit) {
      try {
        const { userData, customFields } = splitUserData(payload);
        // update email and username if email changed
        if (userData?.email) {
          if (editPrefilledFormData?.email == userData?.email) {
            delete userData?.email;
          } else {
            userData.username = userData?.email;
          }
        }
        console.log('userData', userData);
        console.log('customFields', customFields);
        const object = {
          userData: userData,
          // customFields: customFields,
        };
        const updateUserResponse = await updateUser(editableUserId, object);
        // console.log('updatedResponse', updateUserResponse);

        if (
          updateUserResponse &&
          updateUserResponse?.data?.params?.err === null
        ) {
          // getNotification(editableUserId, profileUpdateNotificationKey);
          showToastMessage(t(successUpdateMessage), 'success');
          telemetryCallbacks(telemetryUpdateKey);

          UpdateSuccessCallback();
          // localStorage.removeItem('BMGSData');
        } else {
          // console.error('Error update user:', error);
          showToastMessage(t(failureUpdateMessage), 'error');
        }
      } catch (error) {
        console.error('Error update user:', error);
        showToastMessage(t(failureUpdateMessage), 'error');
      }
    } else {
      // const isEqual =
      //   blockId.length === formData?.block.length &&
      //   blockId.every((val, i) => val === formData?.block[i]);
      // if (!isEqual) {
      //   setSelectedCenterBatches(null);
      // }
      // setBlockId(formData?.block);
      setDistrictId(formData?.district);
      setStateId(formData?.state);
      console.log('############ new formdata', formData);
      setPrefilledFormData(formData);
      setShowNextForm(true);
      setButtonShow(false);
      if (
        editPrefilledFormData?.district[0] !== formData?.district[0] ||
        editPrefilledFormData?.state[0] !== formData?.state[0]
      ) {
        setTotalVillageCount(0);
        setSelectedVillages([]);
      }
    }
  };
  // const onCloseNextForm = (cohortdata) => {
  //   console.log('########## cohortdata', cohortdata);
  //   setSelectedCenterBatches(cohortdata);
  //   setShowNextForm(false);
  //   setButtonShow(true);
  // };

  useEffect(() => {
    if (districtId && districtId.length > 0) {
      fetchBlockList();
    }
  }, [districtId]);

  /*
  prefilled value type
  [
    {
      cohortId: '88cf0da0-8a10-41ad-b927-459f4d3a5945',
      name: 'nighoj',
      childData: [
        {
          cohortId: '6ccd597e-51d8-4f4b-b9c8-f0469075a0b4',
          name: 'matheran',
        },
      ],
    },
  ]
  */
  //load block list
  const fetchBlockList = async () => {
    const districtResponse = await getStateBlockDistrictList({
      controllingfieldfk: stateId,
      fieldName: 'district',
    });
    // setDistrictName(districtResult?.selectedValues?.[0]?.value);
    const transformedData = districtResponse?.result?.values?.map(
      (item: any) => ({
        id: item?.value,
        name: item?.district_name,
      })
    );
    const getDistrictNameById = (id: number): string | undefined => {
      const district = transformedData?.find((item) => item.id === id);
      return district?.name;
    };
    const districtsName = getDistrictNameById(parseInt(districtId[0]));
    setDistrictName(districtsName || ''); // Set district name for display
    console.log('########>>>', districtsName);
    //write logic to fetch block list
    const blockResponse = await getStateBlockDistrictList({
      controllingfieldfk: districtId,
      fieldName: 'block',
    });

    const transformedBlockData = blockResponse?.result?.values?.map(
      (item: any) => ({
        id: item?.value,
        name: item?.label,
      })
    );
    setBlocks(transformedBlockData);
  };

  function transformFormData(
    formData: Record<string, any>,
    schema: any,
    extraFields: Record<string, any> = {} // Optional root-level custom fields
  ) {
    const transformedData: Record<string, any> = {
      ...extraFields, // Add optional root-level custom fields dynamically
      customFields: [],
    };

    for (const key in formData) {
      if (schema.properties[key]) {
        const fieldSchema = schema.properties[key];

        if (fieldSchema.coreField === 0 && fieldSchema.fieldId) {
          // Use fieldId for custom fields
          transformedData.customFields.push({
            fieldId: fieldSchema.fieldId,
            value: formData[key] || '',
          });
        } else {
          // Use the field name for core fields
          transformedData[key] = formData[key] || '';
        }
      }
    }

    return transformedData;
  }
  const handleVillageSelection = (blockId: string, villages: string[]) => {
    setSelectedVillages((prev) => ({
      ...prev,
      [blockId]: villages,
    }));
  };
  // console.log('selectedVillage', selectedVillages); //get count from here
  useEffect(() => {
    const count = Object.values(selectedVillages).reduce(
      (sum, arr) => sum + arr.length,
      0
    );
    setTotalVillageCount(count);
    console.log('SelectedVillages@@@', selectedVillages);
  }, [selectedVillages]);

  const handleBackToForm = () => {
    setShowNextForm(false);
    setButtonShow(true);
  };

  const handleBack = () => setSelectedBlock(null);
  const handleFinish = async () => {
    if (isReassign === true) {
      const assignedVillages = Object.entries(selectedVillages).map(
        ([blockId, villageIds]) => ({
          blockId,
          villageIds,
        })
      );
      const customFields = mapToCustomFields(assignedVillages, sdbvFieldData);
      console.log(
        '######## debug issue facilitator transformedFormData',
        customFields
      );
      const payload = { customFields: customFields };

      // Check for block change (using blockVillageMap and selectedVillages)
      const toSendBlockChangeNotification = isBlockSetDifferent(
        blockVillageMap,
        selectedVillages
      );
      // Check for village change
      const toSendVillageChangeNotification = isVillageDifferent(
        blockVillageMap,
        selectedVillages
      );

      try {
        console.log('payload', payload);
        const reassignmentPayload = {
          ...payload,
          userData: {
            firstName: editPrefilledFormData.firstName,
          },
        };
        const resp = await updateReassignUser(
          editableUserId,
          reassignmentPayload
        );
        if (resp) {
          showToastMessage(t(successUpdateMessage), 'success');
          // Send notification if block is changed
          if (
            toSendBlockChangeNotification &&
            typeof blockReassignmentNotificationKey !== 'undefined'
          ) {
            getNotification(editableUserId, blockReassignmentNotificationKey);
          }

          // Send notification if village is changed
          if (
            toSendVillageChangeNotification &&
            typeof villageReassignmentNotificationKey !== 'undefined'
          ) {
            getNotification(editableUserId, villageReassignmentNotificationKey);
          }
          telemetryCallbacks(telemetryUpdateKey);
          UpdateSuccessCallback();
        } else {
          // console.error('Error reassigning user:', error);
          showToastMessage(t(failureUpdateMessage), 'error');
        }
      } catch (error) {
        console.error('Error reassigning user:', error);
        showToastMessage(t(failureUpdateMessage), 'error');
      }
    } else {
      try {
        const assignedVillages = Object.entries(selectedVillages).map(
          ([blockId, villageIds]) => ({
            blockId,
            villageIds,
          })
        );
        const customFields = mapToCustomFields(assignedVillages, sdbvFieldData);
        console.log('customFields', customFields);
        let tenantCohortRoleMapping = [];
        tenantCohortRoleMapping[0] = {
          tenantId: localStorage.getItem('tenantId'),
          roleId: 'a5f1dbc9-2ad4-442c-b762-0e3fc1f6c6da',
        };
        const { state, district, ...cleanedPayload } = prefilledFormData;
        const payload = cleanedPayload;
        payload.tenantCohortRoleMapping = tenantCohortRoleMapping;
        payload.customFields = customFields;
        payload.username = prefilledFormData.email;
        const randomNum = Math.floor(10000 + Math.random() * 90000).toString();
        payload.password = randomNum;
        const responseUserData = await createUser(payload);
        if (responseUserData?.userData) {
          let creatorName;

          if (typeof window !== 'undefined' && window.localStorage) {
            creatorName = getUserFullName();
          }
          let replacements: { [key: string]: string };
          const key = 'onMentorCreate';
          const context = 'USER';
          const isQueue = false;

          replacements = {};
          if (creatorName) {
            replacements = {
              '{FirstName}': toPascalCase(payload?.firstName),
              '{UserName}': payload?.email,
              '{Password}': payload?.password,
              '{appUrl}':
                (process.env.NEXT_PUBLIC_TEACHER_APP_URL as string) || '', //TODO: check url
            };
          }

          const sendTo = {
            receipients: [payload?.email],
          };
          if (Object.keys(replacements).length !== 0 && sendTo) {
            const response = await sendCredentialService({
              isQueue,
              context,
              key,
              replacements,
              email: sendTo,
            });
            if (
              response?.email?.data[0]?.result ===
              'Email notification sent successfully'
            ) {
              SuccessCallback();
              showToastMessage(
                t('MENTOR.MENTOR_CREATED_SUCCESSFULLY'),
                'success'
              );
              setButtonShow(true);
            } else {
              console.log(' not checked');
              SuccessCallback();
              showToastMessage(t('MENTOR.MENTOR_CREATED'), 'success');
            }
            setButtonShow(true);
          }
        }
      } catch (error: any) {
        if (error?.response?.data?.params?.err === 'User already exist.') {
          showToastMessage(error?.response?.data?.params?.err, 'error');
        } else {
          SuccessCallback();
        }
      }
    }
    setTotalVillageCount(0);
  };

  const mapToCustomFields = (blockVillageData: any, fieldMapping: any) => {
    // let userDataString = localStorage.getItem('userData');
    // let userData: any = userDataString ? JSON.parse(userDataString) : null;
    // const districtResult = userData.customFields.find(
    //   (item: any) => item.label === cohortHierarchy.DISTRICT
    // );
    // const stateResult = userData.customFields.find(
    //   (item: any) => item.label === cohortHierarchy.STATE
    // );
    return [
      {
        fieldId: fieldMapping.properties.block.fieldId,
        value: blockVillageData.map((item: any) => parseInt(item.blockId)),
      },
      {
        fieldId: fieldMapping.properties.village.fieldId,
        value: blockVillageData.flatMap((item: any) => item.villageIds),
      },
      {
        fieldId: fieldMapping.properties.state.fieldId,
        value: stateId,
      },
      {
        fieldId: fieldMapping.properties.district.fieldId,
        value: districtId,
      },
    ];
  };

  if (selectedBlock) {
    return (
      <VillageBlockSelector
        blockId={selectedBlock.id}
        blockName={selectedBlock.name}
        onBack={handleBack}
        selectedVillages={selectedVillages[selectedBlock.id] || []}
        onSelectionChange={(villages: any) =>
          handleVillageSelection(selectedBlock.id, villages)
        }
        isReassign={isReassign}
      />
    );
  }

  return (
    <>
      {isLoading || autoSkipInProgress ? (
        <Loader showBackdrop={false} loadingText={t('COMMON.LOADING')} />
      ) : (
        alteredSchema &&
        alteredUiSchema && (
          <>
            {showNextForm ? (
              blocks ? (
                <Box display="flex" flexDirection="column">
                  {isReassign ? null : (
                    <Button
                      variant="text"
                      color="primary"
                      onClick={handleBackToForm}
                    >
                      {t('MENTOR.BACK_TO_FORM')}
                    </Button>
                  )}
                  <Typography
                    sx={{
                      fontSize: '14px',
                      color: '#1F1B13',
                      fontWeight: '400',
                    }}
                  >
                    {t('MENTOR.ASSIGN_VILLAGES_FROM_BLOCKS')}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      color: '#1F1B13',
                      fontWeight: '400',
                    }}
                    color="textSecondary"
                    gutterBottom
                  >
                    {t('MENTOR.ASSIGN_VILLAGES_FINISH')}
                  </Typography>

                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontSize: '14px',
                      color: '#7C766F',
                      fontWeight: '400',
                    }}
                    mt={2}
                  >
                    {districtName} {t('MENTOR.DISTRICTS')} (
                    {t('MENTOR.SELECTED_VILLAGE_COUNT', {
                      totalVillageCount: totalVillageCount,
                    })}
                    )
                  </Typography>

                  <Box
                  // display="grid"
                  // gridTemplateColumns="repeat(2, 1fr)"
                  // gap={2}
                  >
                    {blocks.map(({ id, name }: any) => (
                      <Box
                        key={id}
                        sx={{
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mt: 2,
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          padding: '10px',
                        }}
                        onClick={() => setSelectedBlock({ id, name })}
                      >
                        <Box>
                          <Typography
                            sx={{
                              color: '#1F1B13',
                              fontWeight: '400',
                              fontSize: '16px',
                            }}
                            variant="h6"
                          >
                            {name}
                          </Typography>
                          <Typography
                            sx={{
                              color: '#635E57',
                              fontWeight: '400',
                              fontSize: '14px',
                            }}
                            color="text.secondary"
                          >
                            {selectedVillages[id]?.length || 0}{' '}
                            {t('MENTOR.VILLAGES_SELECTED')}
                          </Typography>
                        </Box>
                        <IconButton>
                          <ArrowForwardIosIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>

                  <Box display="flex" justifyContent="space-between" mt={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleFinish}
                      disabled={Object.values(selectedVillages).every(
                        (villages) => villages.length === 0
                      )}
                      sx={{ width: '100%' }}
                    >
                      {t('MENTOR.FINISH_ASSIGN')}
                    </Button>
                  </Box>
                </Box>
              ) : (
                <CenteredLoader />
              )
            ) : (
              <DynamicForm
                // key={isChangeForm ? 'dynamicform' : 'defaultform'}
                schema={alteredSchema}
                uiSchema={alteredUiSchema}
                t={t}
                FormSubmitFunction={StepperFormSubmitFunction}
                prefilledFormData={prefilledFormData || {}}
                extraFields={isEdit ? extraFieldsUpdate : extraFields}
                hideSubmit={hideSubmit}
              />
            )}
          </>
        )
      )}
    </>
  );
};

export default MentorForm;
