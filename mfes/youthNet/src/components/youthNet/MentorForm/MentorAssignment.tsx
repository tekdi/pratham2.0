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
import VillageSelection from './VillageSelection';
import { cohortHierarchy } from 'mfes/youthNet/src/utils/app.constant';
import { getStateBlockDistrictList } from 'mfes/youthNet/src/services/youthNet/Dashboard/VillageServices';
import DynamicForm from '../../../../../../apps/admin-app-repo/src/components/DynamicForm/DynamicForm';
import { fetchForm } from '../../../../../../apps/admin-app-repo/src/components/DynamicForm/DynamicFormCallback';
import { FormContext } from '../../../../../../apps/admin-app-repo/src/components/DynamicForm/DynamicFormConstant';
import { useTranslation } from 'react-i18next';
import { createUser } from 'mfes/youthNet/src/services/youthNet/Dashboard/UserServices';
import { showToastMessage } from '@/components/Toastify';
import { getUserFullName, toPascalCase } from '@/utils/Helper';
import { sendCredentialService } from '@/services/NotificationService';

const MentorAssignment = () => {
  const [selectedBlock, setSelectedBlock] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedVillages, setSelectedVillages] = useState<
    Record<string, string[]>
  >({});
  const [blocks, setBlocks] = useState<any>([]);
  const [districtName, setDistrictName] = useState<any>('');
  const [formData, setFormData] = useState<any>();
  const [sdbvFieldData, setSdbvFieldData] = useState<any>();

  const [addSchema, setAddSchema] = useState(null);
  const [addUiSchema, setAddUiSchema] = useState(null);
  const [showAssignmentScreen, setShowAssignmentScreen] = useState(false); // New state to toggle views

  const { t } = useTranslation();

  const handleVillageSelection = (blockId: string, villages: string[]) => {
    setSelectedVillages((prev) => ({
      ...prev,
      [blockId]: villages,
    }));
  };

  const FormSubmitFunction = async (formData: any, payload: any) => {
    console.log('Form Submitted');
    setFormData(formData);
    setShowAssignmentScreen(true); // Show the assignment UI after form submission
  };

  const handleBackToForm = () => setShowAssignmentScreen(false); // Back to form screen

  const handleBack = () => setSelectedBlock(null);

  const handleFinish = async () => {
    try {
      const assignedVillages = Object.entries(selectedVillages).map(
        ([blockId, villageIds]) => ({
          blockId,
          villageIds,
        })
      );
      const customFields = mapToCustomFields(assignedVillages, sdbvFieldData);
      console.log('customFields', customFields);
      const tenantCohortRoleMapping = {
        tenantId: localStorage.getItem('tenantId'),
        roleId: 'a5f1dbc9-2ad4-442c-b762-0e3fc1f6c6da',
      };
      const payload = formData;
      payload.tenantCohortRoleMapping = tenantCohortRoleMapping;
      payload.customFields = customFields;
      payload.username = formData.email;
      const randomNum = Math.floor(10000 + Math.random() * 90000).toString();
      payload.password = randomNum;
      console.log(payload);
      const responseUserData = await createUser(payload);
      if (responseUserData) {
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
          if (response?.result[0]?.data[0]?.status === 'success') {
            showToastMessage(
              t('MENTOR.MENTOR_CREATED_SUCCESSFULLY'),
              'success'
            );
          }
        }
      }
    } catch (e) {
      showToastMessage(t('MENTOR.MENTOR_CREATED_FAILED'), 'error');

      console.log(e);
    }
  };

  function filterSchema(schemaObj: any) {
    const locationFields = ['state', 'district', 'block', 'village'];

    // Extract location fields separately
    const extractedFields: any = {};
    locationFields.forEach((field) => {
      if (schemaObj.schema.properties[field]) {
        extractedFields[field] = {
          title: schemaObj.schema.properties[field].title,
          fieldId: schemaObj.schema.properties[field].fieldId,
          field_type: schemaObj.schema.properties[field].field_type,
          maxSelection: schemaObj.schema.properties[field].maxSelection,
          isMultiSelect: schemaObj.schema.properties[field].isMultiSelect,
          'ui:widget': schemaObj.uiSchema[field]?.['ui:widget'] || 'select',
        };
      }
    });

    // Create a new schema object without location fields
    const newSchema = JSON.parse(JSON.stringify(schemaObj)); // Deep copy
    locationFields.forEach((field) => {
      delete newSchema.schema.properties[field];
      delete newSchema.uiSchema[field];
    });

    return { newSchema, extractedFields };
  }

  // Example usage:
  // const schemaObj = {
  //   /* Your given schema and uiSchema here */
  // };

  const mapToCustomFields = (blockVillageData: any, fieldMapping: any) => {
    let userDataString = localStorage.getItem('userData');
    let userData: any = userDataString ? JSON.parse(userDataString) : null;
    const districtResult = userData.customFields.find(
      (item: any) => item.label === cohortHierarchy.DISTRICT
    );
    const stateResult = userData.customFields.find(
      (item: any) => item.label === cohortHierarchy.STATE
    );
    return [
      {
        fieldId: fieldMapping.block.fieldId,
        value: blockVillageData.map((item: any) => parseInt(item.blockId)),
      },
      {
        fieldId: fieldMapping.village.fieldId,
        value: blockVillageData.flatMap((item: any) => item.villageIds),
      },
      {
        fieldId: fieldMapping.state.fieldId,
        value: [stateResult?.selectedValues[0]?.id],
      },
      {
        fieldId: fieldMapping.district.fieldId,
        value: [districtResult?.selectedValues[0]?.id],
      },
    ];
  };

  useEffect(() => {
    const getData = async () => {
      let userDataString = localStorage.getItem('userData');
      let userData: any = userDataString ? JSON.parse(userDataString) : null;
      const districtResult = userData.customFields.find(
        (item: any) => item.label === cohortHierarchy.DISTRICT
      );
      setDistrictName(districtResult?.selectedValues[0]?.value);
      const transformedData = districtResult?.selectedValues?.map(
        (item: any) => ({
          id: item?.id,
          name: item?.value,
        })
      );

      const controllingfieldfk = [transformedData[0]?.id?.toString()];
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
      setBlocks(transformedBlockData);
    };
    getData();
  }, []);

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
      const { newSchema, extractedFields } = filterSchema(responseForm);

      console.log('Filtered Schema (Without Location Fields):', newSchema);
      console.log('Extracted Location Fields:', extractedFields);
      setAddSchema(newSchema?.schema);
      setAddUiSchema(newSchema?.uiSchema);
      setSdbvFieldData(extractedFields);
    };

    fetchData();
  }, []);

  // Show VillageSelection if a block is selected
  if (selectedBlock) {
    return (
      <VillageSelection
        blockId={selectedBlock.id}
        blockName={selectedBlock.name}
        onBack={handleBack}
        selectedVillages={selectedVillages[selectedBlock.id] || []}
        onSelectionChange={(villages: any) =>
          handleVillageSelection(selectedBlock.id, villages)
        }
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
            submitButtonName="Next"
          />
        )
      ) : (
        <Box display="flex" flexDirection="column" p={3}>
          <Button variant="text" color="primary" onClick={handleBackToForm}>
            Back to Form
          </Button>
          <Typography variant="h5" fontWeight="bold">
            Assign Villages from Blocks
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            You can complete this later at your own pace. However, the villages
            will only be assigned once you click on ‘Finish.’
          </Typography>

          <Typography variant="subtitle1" fontWeight="bold" mt={2}>
            {districtName} District
          </Typography>

          <Box
            display="grid"
            gridTemplateColumns="repeat(2, 1fr)"
            gap={2}
            mt={2}
          >
            {blocks.map(({ id, name }: any) => (
              <Card
                key={id}
                sx={{
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                }}
                onClick={() => setSelectedBlock({ id, name })}
              >
                <CardContent>
                  <Typography variant="h6">{name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {selectedVillages[id]?.length || 0} villages selected
                  </Typography>
                </CardContent>
                <IconButton>
                  <ArrowForwardIosIcon fontSize="small" />
                </IconButton>
              </Card>
            ))}
          </Box>

          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button variant="contained" color="primary" onClick={handleFinish}>
              Finish & Assign
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
};

export default MentorAssignment;
