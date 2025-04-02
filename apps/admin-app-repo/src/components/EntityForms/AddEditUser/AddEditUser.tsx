// @ts-nocheck
import React, { useState } from 'react';
import DynamicForm from '@/components/DynamicForm/DynamicForm';
import Loader from '@/components/Loader';
import { useTranslation } from 'react-i18next';
import { showToastMessage } from '../../Toastify';
import { createUser, updateUser } from '@/services/CreateUserService';
import {
  firstLetterInUpperCase,
  getReassignPayload,
  getUserFullName,
} from '@/utils/Helper';
import { sendCredentialService } from '@/services/NotificationService';
import {
  notificationCallback,
  splitUserData,
  telemetryCallbacks,
} from '@/components/DynamicForm/DynamicFormCallback';
import {
  bulkCreateCohortMembers,
  createCohort,
  updateCohortUpdate,
  updateReassignUser,
} from '@/services/CohortService/cohortService';
import { CohortTypes, RoleId } from '@/utils/app.constant';
import _ from 'lodash';
import StepperForm from '@/components/DynamicForm/StepperForm';
import CohortManager from '@/utils/CohortManager';
const AddEditUser = ({
  SuccessCallback,
  schema,
  uiSchema,
  editPrefilledFormData,
  isEdit = false,
  isReassign = false,
  editableUserId,
  UpdateSuccessCallback,
  extraFields,
  extraFieldsUpdate,
  successUpdateMessage,
  telemetryUpdateKey,
  failureUpdateMessage,
  successCreateMessage,
  telemetryCreateKey,
  failureCreateMessage,
  notificationKey,
  notificationMessage,
  notificationContext,
  isNotificationRequired = true,
  blockFieldId,
  districtFieldId,
  isExtraFields = true,
  villageFieldId,
  centerFieldId,
  type,
}) => {
  
  const [isLoading, setIsLoading] = useState(false);
  const [showAssignmentScreen, setShowAssignmentScreen] =
  useState<boolean>(false);
  const [formData, setFormData] = useState<any>();
  const [districtId, setDistrictId] = useState<any>();
  const [prefilledFormData, setPrefilledFormData] = useState(
    editPrefilledFormData
  );
  console.log(editPrefilledFormData, 'editPrefilledFormData');

  const { t } = useTranslation();
  let isEditSchema = _.cloneDeep(schema);
  let isEditUiSchema = _.cloneDeep(uiSchema);
  //  let isEditSchema = (schema);
  // let isEditUiSchema = (uiSchema);

  if (localStorage.getItem('stateId')) {
    // console.log('##########uiSchema', uiSchema);
    // ✅ Add `ui:disabled` to the `state` field
    if (uiSchema?.state) {
      uiSchema.state['ui:disabled'] = true;
    }
  }

  if (isEdit) {
    const keysToRemove = [
      'state',
      'district',
      'block',
      'village',
      'password',
      'confirm_password',
      'board',
      'medium',
      'parentId',
      'batch',
      'grade',
      'center',
    ];
    keysToRemove.forEach((key) => delete isEditSchema.properties[key]);
    keysToRemove.forEach((key) => delete isEditUiSchema[key]);
    console.log('schema', schema);
  } else if (isReassign) {
    const keysToHave = [
      'state',
      'district',
      'block',
      ...(isExtraFields ? ['village', 'center', 'batch'] : []),
    ];
    isEditSchema = {
      type: 'object',
      properties: keysToHave.reduce((obj, key) => {
        if (schema.properties[key]) {
          obj[key] = schema.properties[key];
        }
        return obj;
      }, {}),
    };
    isEditUiSchema = keysToHave.reduce((obj, key) => {
      if (uiSchema[key]) {
        obj[key] = uiSchema[key];
      }
      return obj;
    }, {});
  } else {
    const keysToRemove = ['password', 'confirm_password', 'program'];
    keysToRemove.forEach((key) => delete schema?.properties[key]);
    keysToRemove.forEach((key) => delete uiSchema[key]);
  }

  const FormSubmitFunction = async (formData: any, payload: any) => {
    setPrefilledFormData(formData);
    console.log(formData, 'formdata');
    console.log(payload, 'payload');

    if (isEdit) {
      if (isNotificationRequired) {
        try {
          const { userData, customFields } = splitUserData(payload);
          delete userData?.email;
          // console.log('userData', userData);
          // console.log('customFields', customFields);
          const object = {
            userData: userData,
            customFields: customFields,
          };
          const updateUserResponse = await updateUser(editableUserId, object);
          // console.log('updatedResponse', updateUserResponse);

          if (
            updateUserResponse &&
            updateUserResponse?.data?.params?.err === null
          ) {
            showToastMessage(t(successUpdateMessage), 'success');
            telemetryCallbacks(telemetryUpdateKey);

            UpdateSuccessCallback();
            // localStorage.removeItem('BMGSData');
          } else {
            console.error('Error update user:', error);
            showToastMessage(t(failureUpdateMessage), 'error');
          }
        } catch (error) {
          console.error('Error update user:', error);
          showToastMessage(t(failureUpdateMessage), 'error');
        }
      } else {
        const userId = localStorage.getItem('userId');
        const updatedPayload = {
          ...payload,
          updatedBy: userId,
        };

        const resp = await updateCohortUpdate(editableUserId, updatedPayload);
        if (resp) {
          showToastMessage(t(successUpdateMessage), 'success');
          telemetryCallbacks(telemetryUpdateKey);

          UpdateSuccessCallback();
        } else {
          console.error('Error update user:', error);
          showToastMessage(t(failureUpdateMessage), 'error');
        }
      }
    } else if (isReassign) {
      try {
        // console.log('new', formData?.batch);
        // console.log(editPrefilledFormData?.batch, 'old');
        delete payload?.batch;
        console.log('payload', payload);
        const reassignmentPayload = {
          ...payload,
          ...(type === 'team-leader' && {
            automaticMember: {
              value: true,
              fieldId: blockFieldId,
              fieldName: 'BLOCK',
            },
          }),
          userData: {
            firstName: formData.firstName,
          },
        };
        const resp = await updateReassignUser(
          editableUserId,
          reassignmentPayload
        );
        if (resp) {
          showToastMessage(t(successUpdateMessage), 'success');
          telemetryCallbacks(telemetryUpdateKey);
          UpdateSuccessCallback();
        } else {
          console.error('Error reassigning user:', error);
          showToastMessage(t(failureUpdateMessage), 'error');
        }
        if (type !== 'team-leader') {
          const cohortIdPayload = getReassignPayload(
            editPrefilledFormData.batch,
            formData.batch
          );
          const res = await bulkCreateCohortMembers({
            userId: [editableUserId],
            cohortId: cohortIdPayload.cohortId,
            removeCohortId: cohortIdPayload.removedIds,
          });
        }
      } catch (error) {
        console.error('Error reassigning user:', error);
        showToastMessage(t(failureUpdateMessage), 'error');
      }
    } else {
      if (isNotificationRequired) {
        if (
          Array.isArray(payload.tenantCohortRoleMapping) &&
          payload.tenantCohortRoleMapping[0] &&
          payload.tenantCohortRoleMapping[0]['roleId'] !== RoleId.STUDENT
        ) {
          payload.username = formData.email;
        }
      }
      if (
        Array.isArray(payload.tenantCohortRoleMapping) &&
        payload.tenantCohortRoleMapping[0] &&
        payload.tenantCohortRoleMapping[0]['roleId'] === RoleId.TEAM_LEADER &&
        localStorage.getItem('program') === 'Second Chance Program'
      ) {
        payload.automaticMember = {
          value: true,
          fieldName: 'Block',
          fieldId: blockFieldId,
        };
      }

      if (payload.batch) {
        const cohortIds = payload.batch;
        // payload.tenantCohortRoleMapping.push(cohortIds);
        payload.tenantCohortRoleMapping[0]['cohortIds'] = cohortIds;

        delete payload.batch;
        // delete payload.center;
      }
      try {
        if (isNotificationRequired) {
          const responseUserData = await createUser(payload, t);

          if (responseUserData?.userData?.userId) {
            showToastMessage(t(successCreateMessage), 'success');

            telemetryCallbacks(telemetryCreateKey);
            SuccessCallback();

            // Send Notification with credentials to user
            try {
              await notificationCallback(
                successCreateMessage,
                notificationContext,
                notificationKey,
                payload,
                t,
                notificationMessage
              );
            } catch (notificationError) {
              console.error('Notification failed:', notificationError);
              // No failure toast here to prevent duplicate messages
            }
          } else {
            showToastMessage(t(failureCreateMessage), 'error');
          }
        } else {
          if (payload.type === CohortTypes.BATCH) delete payload.customFields;
          // payload.delete(customFields)
          const centerCreation = await createCohort(payload);
          console.log('centerCreatedResponse: ', centerCreation);
          if (centerCreation) {
            showToastMessage(t(successCreateMessage), 'success');
            telemetryCallbacks(telemetryCreateKey);
            SuccessCallback();
          } else {
            showToastMessage(t(failureCreateMessage), 'error');
          }
        }
      } catch (error) {
        console.error('Error creating user:', error);
        showToastMessage(t(failureCreateMessage), 'error');
      }
    }
  };

  const StepperFormSubmitFunction = async (formData: any, payload: any) => {
    setDistrictId(formData?.district);
    console.log(formData);
    console.log(uiSchema);
    console.log(payload);
    console.log(schema);
    //schema?.properties?.district
    setFormData(formData);
    setShowAssignmentScreen(true);
  };
  const onClose = () => {
    // setOpenDelete(false);
    //   setOpenReassignDistrict(false);
    //   setOpenReassignVillage(false);
    //   setAddNew(false);
    //   setCount(0);
    setShowAssignmentScreen(false);
    setFormData({});
    SuccessCallback();
  };
  return (
    // <>
    //   {isLoading ? (
    //     <>
    //       <Loader showBackdrop={false} loadingText={t('COMMON.LOADING')} />
    //     </>
    //   ) : (
    //     schema &&
    //     uiSchema && (
    //       <DynamicForm
    //         schema={isEdit ? isEditSchema : schema}
    //         uiSchema={isEdit ? isEditUiSchema : uiSchema}
    //         t={t}
    //         FormSubmitFunction={FormSubmitFunction}
    //         prefilledFormData={prefilledFormData || {}}
    //         extraFields={isEdit ? extraFieldsUpdate : extraFields}
    //       />
    //     )
    //   )}
    // </>
    <>
      {isLoading ? (
        <Loader showBackdrop={false} loadingText={t('COMMON.LOADING')} />
      ) : isEdit ? (
        // When editing, show DynamicForm regardless of role
        <DynamicForm
          schema={isEdit ? isEditSchema : schema}
          uiSchema={isEdit ? isEditUiSchema : uiSchema}
          t={t}
          FormSubmitFunction={FormSubmitFunction}
          prefilledFormData={prefilledFormData || {}}
          extraFields={extraFieldsUpdate}
        />
      ) : type === 'facilitator' ? (
        // When role is facilitator and not editing, show StepperForm with facilitator-specific props
        <StepperForm
          FormSubmitFunction={StepperFormSubmitFunction}
          setShowAssignmentScreen={setShowAssignmentScreen}
          showAssignmentScreen={showAssignmentScreen}
          formData={formData}
          setFormData={setFormData}
          onClose={onClose}
          parenResult={{}}
          parentId={formData?.district}
          stateId={formData?.state[0]}
          districtId={formData?.district[0]}
          blockId={formData?.block[0]}
          villageId={formData?.village[0]}
          // facilitatorProp="yourFacilitatorValue"
          role={type}
          // add any additional prop(s) for facilitator
        />
      ) : type === 'mentor' ? (
        <StepperForm
          FormSubmitFunction={StepperFormSubmitFunction}
          setShowAssignmentScreen={setShowAssignmentScreen}
          showAssignmentScreen={showAssignmentScreen}
          formData={formData}
          setFormData={setFormData}
          onClose={onClose}
          parenResult={{}}
          parentId={formData?.district}
          stateId={formData?.state[0]}
          districtId={formData?.district[0]}
          //mentorProp="yourMentorValue" // add any additional prop(s) for mentor
          role={type}
        />
      ) : (
        <DynamicForm
          schema={isEdit || isReassign ? isEditSchema : schema}
          uiSchema={isEdit || isReassign ? isEditUiSchema : uiSchema}
          t={t}
          FormSubmitFunction={FormSubmitFunction}
          prefilledFormData={prefilledFormData || {}}
          extraFields={isEdit || isReassign ? extraFieldsUpdate : extraFields}
        />
      )}
    </>
  );
};

export default AddEditUser;
