import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// import VillageSelection from './VillageSelection';
// import { cohortHierarchy } from 'mfes/youthNet/src/utils/app.constant';
// import { getStateBlockDistrictList } from 'mfes/youthNet/src/services/youthNet/Dashboard/VillageServices';
// import DynamicForm from '../../../../../../apps/admin-app-repo/src/components/DynamicForm/DynamicForm';
// import { fetchForm } from '../../../../../../apps/admin-app-repo/src/components/DynamicForm/DynamicFormCallback';
// import { FormContext } from '../../../../../../apps/admin-app-repo/src/components/DynamicForm/DynamicFormConstant';
import { useTranslation } from 'react-i18next';
// import { createUser } from 'mfes/youthNet/src/services/youthNet/Dashboard/UserServices';
import { filterSchema, getUserFullName, toPascalCase } from '@/utils/Helper';
import { sendCredentialService } from '@/services/NotificationService';
import { showToastMessage } from '@/components/Toastify';
// import { filterSchema } from 'mfes/youthNet/src/utils/Helper';
// import useSubmittedButtonStore from 'mfes/youthNet/src/store/useSubmittedButtonStore';
// import VillageSelection from './CohortSelections';
import { fetchForm } from './DynamicFormCallback';
import { FormContext } from './DynamicFormConstant';
import DynamicForm from './DynamicForm';
import CohortSelections from './CohortSelections';
import { createUser } from '@/services/CreateUserService';
import useSubmittedButtonStore from '@/utils/useSharedState';
import {
  getCenterList,
  getStateBlockDistrictList,
} from '@/services/MasterDataService';
type FormSubmitFunctionType = (formData: any, payload: any) => Promise<void>;

interface StepperFormProps {
  showAssignmentScreen: boolean;
  setShowAssignmentScreen: React.Dispatch<React.SetStateAction<boolean>>;
  formData: any;
  setFormData: any;
  FormSubmitFunction: (formData: any, payload: any) => Promise<void>;
  onClose: any;
  parentResult?: any;
  role?: string;
  parentId?: any;
  stateId?: any;
  districtId?: any;
  blockId?: any;
  villageId?: any;
  selectedChildLabel?: string;
  parentLabel?: string;
  assignmentMessage?: string;
  assignmentChildmessage?: string;
  hideSubmit?: boolean
}
const StepperForm: React.FC<StepperFormProps> = ({
  showAssignmentScreen,
  setShowAssignmentScreen,
  FormSubmitFunction,
  formData,
  setFormData,
  onClose,
  parentResult,
  parentId,
  stateId,
  blockId,
  districtId,
  villageId,
  selectedChildLabel,
  parentLabel,
  assignmentChildmessage,
  assignmentMessage,
  role,
  hideSubmit
}) => {
  const [selectedChild, setSelectedChild] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [selectedVillages, setSelectedVillages] = useState<
    Record<string, string[]>
  >({});
  const [childData, setChildData] = useState<any>([]);
  const [parentName, setParentName] = useState<any>('');
  //const [formData, setFormData] = useState<any>();
  const [sdbvFieldData, setSdbvFieldData] = useState<any>();
  const setSubmittedButtonStatus = useSubmittedButtonStore(
    (state: any) => state.setSubmittedButtonStatus
  );
  const submittedButtonStatus = useSubmittedButtonStore(
    (state: any) => state.submittedButtonStatus
  );
  const [addSchema, setAddSchema] = useState(null);
  const [addUiSchema, setAddUiSchema] = useState(null);
  const [fieldIds, setFieldIds] = useState({});

  // const [showAssignmentScreen, setShowAssignmentScreen] = useState(false); // New state to toggle views

  const { t } = useTranslation();

  const handleVillageSelection = (blockId: string, villages: string[]) => {
    setSelectedVillages((prev) => ({
      ...prev,
      [blockId]: villages,
    }));
  };

  const handleBackToForm = () => setShowAssignmentScreen(false); // Back to form screen

  const handleBack = () => setSelectedChild(null);

  const handleFinish = async () => {
    try {
      console.log(formData);
      console.log(sdbvFieldData);
      // console.log()
      // let assignedObject;
      // if(role=== 'mentor')
      // {

      // }
      console.log(selectedVillages);
      const assignedObject = Object.entries(selectedVillages).map(
        ([parentId, childId]) => ({
          parentId,
          childId,
        })
      );
      let customFields: any = []; // Initialize as an empty array

      if (role === 'mentor') {
        customFields = mapToCustomFields(assignedObject, sdbvFieldData) || []; // Ensure it’s always an array
      }

      console.log('customFields', customFields);
      console.log(fieldIds);

      const existFieldIds = new Map(
        customFields.map((item: any) => [item.fieldId, item])
      );

      // Add missing field IDs with values from payload or empty array if not found
      {
        Object.entries(fieldIds).forEach(([key, fieldId]) => {
          const existingField: any = existFieldIds.get(fieldId);

          if (existingField) {
            if (formData[key]) {
              existingField.value = formData[key];
            }
          } else {
            // If missing, add with value from payload or empty array
            customFields.push({ fieldId, value: formData[key] || [] });
            delete formData[key];
          }
        });
      }
      console.log(customFields);
      let tenantCohortRoleMapping: any = [];
      tenantCohortRoleMapping[0] = {
        tenantId: localStorage.getItem('tenantId'),
        roleId: 'a5f1dbc9-2ad4-442c-b762-0e3fc1f6c6da',
      };
      if (role === 'facilitator' && assignedObject[0]) {
        const cohortId = assignedObject[0].childId; // Accessing the first object in the array
        tenantCohortRoleMapping[0].cohortId = cohortId;
      }
      console.log(assignedObject);
      const payload = formData;
      payload.tenantCohortRoleMapping = tenantCohortRoleMapping;
      payload.customFields = customFields;
      if (payload.batch) {
        const cohortIds = payload.batch;
        // payload.tenantCohortRoleMapping.push(cohortIds);
        payload.tenantCohortRoleMapping[0]['cohortIds'] = cohortIds;

        delete payload.batch;
        delete payload.center;
      }
      payload.username = formData.email;
      const randomNum = Math.floor(10000 + Math.random() * 90000).toString();
      payload.password = randomNum;
      console.log(payload);
      const responseUserData = await createUser(payload);
      if (responseUserData?.userData) {
        let creatorName;

        if (typeof window !== 'undefined' && window.localStorage) {
          creatorName = getUserFullName();
        }
        let replacements: { [key: string]: string };
        const key =
          role === 'mentor' ? 'onMentorCreate' : 'onFacilitatorCreated';
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
            //  onClose();

            showToastMessage(
              t('MENTOR.MENTOR_CREATED_SUCCESSFULLY'),
              'success'
            );
            setSubmittedButtonStatus(true);
          } else {
            console.log(' not checked');
            //   onClose();
            showToastMessage(t('MENTOR.MENTOR_CREATED'), 'success');
          }
          setSubmittedButtonStatus(!submittedButtonStatus);
        }
      }
    } catch (error: any) {
      if (error?.response?.data?.params?.err === 'User already exist.') {
        showToastMessage(error?.response?.data?.params?.err, 'error');
      } else {
        //  onClose();
        console.log(error);
      }
    }
  };

  // Example usage:
  // const schemaObj = {
  //   /* Your given schema and uiSchema here */
  // };

  const mapToCustomFields = (Data: any, fieldMapping: any) => {
    // let userDataString = localStorage.getItem('userData');
    // let userData: any = userDataString ? JSON.parse(userDataString) : null;
    // // const districtResult = userData.customFields.find(
    // //   (item: any) => item.label === cohortHierarchy.DISTRICT
    // // );
    // const stateResult = userData.customFields.find(
    //   (item: any) => item.label === cohortHierarchy.STATE
    // );
    console.log(Data);
    console.log(fieldMapping);
    if (role === 'mentor')
      return [
        {
          fieldId: fieldMapping.block.fieldId,
          value: Data.map((item: any) => parseInt(item.parentId)),
        },
        {
          fieldId: fieldMapping.village.fieldId,
          value: Data.flatMap((item: any) => item.childId),
        },
        // {
        //   fieldId: fieldMapping.state.fieldId,
        //   value: [stateResult?.selectedValues[0]?.id],
        // },
        // {
        //   fieldId: fieldMapping.district.fieldId,
        // //  value: [parentResult?.selectedValues[0]?.id],
        //         value: [parentId],

        // },
      ];

    return [
      {
        fieldId: fieldMapping.center.fieldId,
        value: Data.map((item: any) => parseInt(item.parentId)),
      },
      {
        fieldId: fieldMapping.batch.fieldId,
        value: Data.flatMap((item: any) => item.childId),
      },
      // {
      //   fieldId: fieldMapping.state.fieldId,
      //   value: [stateResult?.selectedValues[0]?.id],
      // },
      // {
      //   fieldId: fieldMapping.district.fieldId,
      // //  value: [parentResult?.selectedValues[0]?.id],
      //         value: [parentId],

      // },
    ];
  };

  useEffect(() => {
    const getData = async () => {
      try {
        if (role === 'mentor') {
          let userDataString = localStorage.getItem('userData');
          let userData: any = userDataString
            ? JSON.parse(userDataString)
            : null;
          // const parentResult = userData.customFields.find(
          //   (item: any) => item.label === cohortHierarchy.DISTRICT
          // );
          console.log(parentResult);
          setParentName('district_name');
          const transformedData = parentResult?.selectedValues?.map(
            (item: any) => ({
              id: item?.id,
              name: item?.value,
            })
          );

          const controllingfieldfk: any = [parentId];
          const fieldName = 'block';
          const blockResponse = await getStateBlockDistrictList({
            controllingfieldfk,
            fieldName,
          });

          const transformedBlockData = blockResponse?.result?.values?.map(
            (item: any) => ({
              id: item?.value,
              name: item?.label,
            })
          );
          setChildData(transformedBlockData);
        } else {
          const getCentersObject = {
            limit: 0,
            offset: 0,
            filters: {
              type: 'COHORT',
              status: ['active'],
              // state: [stateId],
              // district: [districtId],
              // block: [blockId],
              village: [villageId],
              // "name": selected[0]
            },
          };
          const r = await getCenterList(getCentersObject);
          console.log(r?.result?.results?.cohortDetails);
          const transformedcenterData = r?.result?.results?.cohortDetails?.map(
            (item: any) => ({
              id: item?.cohortId,
              name: item?.name,
            })
          );
          setChildData(transformedcenterData);
        }
      } catch (e) {
        console.log(e);
      }
    };

    if (parentId) getData();
  }, [parentId]);
  function extractLocationFieldIds(schemaData: any) {
    if (!schemaData || !schemaData.schema || !schemaData.schema.properties) {
      console.error('Invalid schema structure');
      return {};
    }

    const { properties } = schemaData.schema;
    const locationFields = ['state', 'district', 'block', 'village'];
    let fieldIds: any = {};

    locationFields.forEach((field) => {
      if (properties[field] && properties[field].fieldId) {
        fieldIds[field] = properties[field].fieldId;
      }
    });

    return fieldIds;
  }
  useEffect(() => {
    const fetchData = async () => {
      const responseForm: any = await fetchForm([
        {
          fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${FormContext.mentor.context}&contextType=${FormContext.mentor.contextType}`,
          header: {},
        },
        {
          fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${FormContext.mentor.context}&contextType=${FormContext.mentor.contextType}`,
          header: { tenantid: localStorage.getItem('tenantId') },
        },
      ]);
      console.log('responseForm', responseForm);
      console.log(extractLocationFieldIds(responseForm));
      setFieldIds(extractLocationFieldIds(responseForm));
      const { newSchema, extractedFields } = filterSchema(responseForm, role);

      setAddSchema(newSchema?.schema);
      const updatedUiSchema = {
        ...newSchema?.uiSchema,
        'ui:submitButtonOptions': {
          norender: true,
        },
      };
      setAddUiSchema(updatedUiSchema);
      setSdbvFieldData(extractedFields);
    };

    fetchData();
  }, []);

  if (selectedChild) {
    return (
      <CohortSelections
        parentId={selectedChild.id}
        ParentName={selectedChild.name}
        onBack={handleBack}
        selectedVillages={selectedVillages[selectedChild.id] || []}
        onSelectionChange={(villages: any) =>
          handleVillageSelection(selectedChild.id, villages)
        }
        role={role}
        districtId={districtId}
        stateId={stateId}
        blockId={blockId}
        villageId={villageId}
      />
    );
  }
  // Show DynamicForm first, then Assignment UI after submission
  return (
    <>
      {!showAssignmentScreen ? (
        addSchema &&
        addUiSchema && (
          <DynamicForm
            schema={addSchema}
            uiSchema={addUiSchema}
            FormSubmitFunction={FormSubmitFunction}
            prefilledFormData={formData || {}}
            hideSubmit={hideSubmit}
          />
        )
      ) : (
        <Box display="flex" flexDirection="column" p={3}>
          <Button variant="text" color="primary" onClick={handleBackToForm}>
            {t('MENTOR.BACK_TO_FORM')}
          </Button>
          <Typography variant="h5" fontWeight="bold">
            {assignmentMessage}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {assignmentChildmessage}
          </Typography>

          <Typography variant="subtitle1" fontWeight="bold" mt={2}>
            {parentName} {parentLabel}
          </Typography>

          <Box
            display="grid"
            gridTemplateColumns="repeat(2, 1fr)"
            gap={2}
            mt={2}
          >
            {childData?.map(({ id, name }: any) => (
              <Card
                key={id}
                sx={{
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                }}
                onClick={() => setSelectedChild({ id, name })}
              >
                <CardContent>
                  <Typography variant="h6">{name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {selectedVillages[id]?.length || 0} {selectedChildLabel}
                  </Typography>
                </CardContent>
                <IconButton>
                  <ArrowForwardIosIcon fontSize="small" />
                </IconButton>
              </Card>
            ))}
          </Box>

          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleFinish}
              disabled={Object.values(selectedVillages).every(
                (villages) => villages.length === 0
              )}
            >
              {t('MENTOR.FINISH_ASSIGN')}
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
};

export default StepperForm;
