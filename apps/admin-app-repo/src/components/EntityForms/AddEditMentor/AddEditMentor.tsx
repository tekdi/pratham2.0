// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import Form from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import axios from 'axios';
import DynamicForm from '@/components/DynamicForm/DynamicForm';
import Loader from '@/components/Loader';
import { useTranslation } from 'react-i18next';
import { showToastMessage } from '../../Toastify';
import { TelemetryEventType } from '@/utils/app.constant';
import { telemetryFactory } from '@/utils/telemetry';
import { createUser, updateUser } from '@/services/CreateUserService';
import { firstLetterInUpperCase, getUserFullName } from '@/utils/Helper';
import { sendCredentialService } from '@/services/NotificationService';

//import { DynamicForm } from '@shared-lib';

const AddEditMentor = ({
  SuccessCallback,
  schema,
  uiSchema,
  editPrefilledFormData,
  isEdit,
  editableUserId,
  UpdateSuccessCallback,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [prefilledFormData, setPrefilledFormData] = useState(
    editPrefilledFormData
  );

  const { t, i18n } = useTranslation();
  const extraFieldsUpdate = {};
  const extraFields = {
    tenantCohortRoleMapping: [
      {
        tenantId: '6c8b810a-66c2-4f0d-8c0c-c025415a4414',
        roleId: 'a5f1dbc9-2ad4-442c-b762-0e3fc1f6c6da',
      },
    ],
    username: 'youthnetmentor',
    password: Math.floor(10000 + Math.random() * 90000),
  };

  const FormSubmitFunction = async (formData: any, payload: any) => {
    setPrefilledFormData(formData);
    if (isEdit) {
      try {
        // console.log('Payload!!!!', payload);
        const splitUserData = (payload) => {
          const { customFields, ...userData } = payload;
          return { userData, customFields };
        };
        const { userData, customFields } = splitUserData(payload);
        delete userData?.email;
        // console.log('userData!!!!', userData);
        // console.log('customFields!!!!', customFields);
        const object = {
          userData: userData,
          customFields: customFields,
        };
        const updateUserResponse = await updateUser(editableUserId, object);
        // console.log('updatedResponse@@@@@', updateUserResponse);

        if (
          updateUserResponse &&
          updateUserResponse?.data?.params?.err === null
        ) {
          showToastMessage(t('MENTOR.MENTOR_UPDATED_SUCCESSFULLY'), 'success');

          const windowUrl = window.location.pathname;
          const cleanedUrl = windowUrl.replace(/^\//, '');
          const env = cleanedUrl.split('/')[0];

          const telemetryInteract = {
            context: {
              env: env,
              cdata: [],
            },
            edata: {
              id: 'youthnet-mentor-updated-successfully',
              type: TelemetryEventType.CLICK,
              subtype: '',
              pageid: cleanedUrl,
            },
          };

          telemetryFactory.interact(telemetryInteract);
          UpdateSuccessCallback();
          // localStorage.removeItem('BMGSData');
        } else {
          showToastMessage(t('MENTOR.NOT_ABLE_UPDATE_MENTOR'), 'error');
        }
      } catch (error) {
        console.error('Error update mentor:', error);
        showToastMessage(t('MENTOR.NOT_ABLE_UPDATE_MENTOR'), 'error');
      }
    } else {
      //Manually setting userName as a email
      payload.username = formData.email;

      try {
        const mentorData = await createUser(payload, t);

        if (mentorData && mentorData?.userData?.userId) {
          showToastMessage(t('MENTOR.MENTOR_CREATED_SUCCESSFULLY'), 'success');

          const windowUrl = window.location.pathname;
          const cleanedUrl = windowUrl.replace(/^\//, '');
          const env = cleanedUrl.split('/')[0];

          const telemetryInteract = {
            context: {
              env: env,
              cdata: [],
            },
            edata: {
              id: 'youthnet-mentor-created-successfully',
              type: TelemetryEventType.CLICK,
              subtype: '',
              pageid: cleanedUrl,
            },
          };

          telemetryFactory.interact(telemetryInteract);
          SuccessCallback();
          // localStorage.removeItem('BMGSData');

          //Send Notification with credentials to user

          const messageKey = 'MENTORS.MENTOR_CREATED_SUCCESSFULLY';
          const isQueue = false;
          const context = 'USER';
          let creatorName;
          const key = 'onMentorCreate';
          if (typeof window !== 'undefined' && window.localStorage) {
            creatorName = getUserFullName();
          }
          let replacements: { [key: string]: string };
          replacements = {};
          if (creatorName) {
            replacements = {
              '{FirstName}': firstLetterInUpperCase(payload?.firstName),
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
              showToastMessage(t(messageKey), 'success');
            } else {
              const messageKey = 'MENTOR.USER_CREDENTIALS_WILL_BE_SEND_SOON';

              showToastMessage(t(messageKey), 'success');
            }
          } else {
            showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
          }
        } else {
          showToastMessage(t('MENTOR.NOT_ABLE_CREATE_MENTOR'), 'error');
        }
      } catch (error) {
        console.error('Error creating mentor:', error);
        showToastMessage(t('MENTOR.NOT_ABLE_CREATE_MENTOR'), 'error');
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <>
          <Loader />
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

export default AddEditMentor;
