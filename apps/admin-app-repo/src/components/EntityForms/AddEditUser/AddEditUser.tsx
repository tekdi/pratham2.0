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
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [prefilledFormData, setPrefilledFormData] = useState(
    editPrefilledFormData
  );

  const { t } = useTranslation();

  const FormSubmitFunction = async (formData: any, payload: any) => {
    setPrefilledFormData(formData);
    if (isEdit) {
      try {
        // console.log('Payload', payload);
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
      //Manually setting userName as a email
      payload.username = formData.email;

      try {
        const responseUserData = await createUser(payload, t);

        if (responseUserData && responseUserData?.userData?.userId) {
          showToastMessage(t(successCreateMessage), 'success');

          telemetryCallbacks(telemetryCreateKey);
          SuccessCallback();

          //Send Notification with credentials to user

          await notificationCallback(
            successCreateMessage,
            notificationContext,
            notificationKey,
            payload,
            t,
            notificationMessage
          );
        } else {
          showToastMessage(t(failureCreateMessage), 'error');
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
