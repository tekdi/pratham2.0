// @ts-nocheck
import React, { useState } from 'react';
import DynamicForm from '@/components/DynamicForm/DynamicForm';
import Loader from '@/components/Loader';
import { useTranslation } from 'react-i18next';
import { showToastMessage } from '../../Toastify';
import { createUser, updateUser } from '@/services/CreateUserService';
import { firstLetterInUpperCase, getUserFullName } from '@/utils/Helper';
import { sendCredentialService } from '@/services/NotificationService';
import {
  notificationCallback,
  splitUserData,
  telemetryCallbacks,
} from '@/components/DynamicForm/DynamicFormCallback';
import {
  createCohort,
  updateCohortUpdate,
} from '@/services/CohortService/cohortService';

const AddEditUser = ({
  SuccessCallback,
  schema,
  uiSchema,
  editPrefilledFormData,
  isEdit,
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
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [prefilledFormData, setPrefilledFormData] = useState(
    editPrefilledFormData
  );

  const { t } = useTranslation();

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
      'grade'
    ];;
    keysToRemove.forEach((key) => delete schema.properties[key]);
    keysToRemove.forEach((key) => delete uiSchema[key]);
    // console.log('schema', schema);
  } else {
    const keysToRemove = ['password', 'confirm_password']; //TODO: check 'program'
    keysToRemove.forEach((key) => delete schema.properties[key]);
    keysToRemove.forEach((key) => delete uiSchema[key]);
  }

  const FormSubmitFunction = async (formData: any, payload: any) => {
    setPrefilledFormData(formData);
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
    } else {
      //Manually setting userName as a email
      if (isNotificationRequired) {
        payload.username = formData.email;
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

  return (
    <>
      {isLoading ? (
        <>
          <Loader showBackdrop={false} loadingText={t('COMMON.LOADING')} />
        </>
      ) : (
        schema &&
        uiSchema && (
          <DynamicForm
            schema={schema}
            uiSchema={uiSchema}
            t={t}
            FormSubmitFunction={FormSubmitFunction}
            prefilledFormData={prefilledFormData || {}}
            extraFields={isEdit ? extraFieldsUpdate : extraFields}
          />
        )
      )}
    </>
  );
};

export default AddEditUser;
