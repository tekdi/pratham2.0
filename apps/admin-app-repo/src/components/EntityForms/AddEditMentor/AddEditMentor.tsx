// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import Form from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import axios from 'axios';
import DynamicForm from '@/components/DynamicForm/DynamicForm';
import { setSeconds } from 'date-fns';
import Loader from '@/components/Loader';
import { GenerateSchemaAndUiSchema } from '@/components/GeneratedSchemas';
import { useTranslation } from 'react-i18next';
import { showToastMessage } from '../../Toastify';
import { TelemetryEventType } from '@/utils/app.constant';
import { telemetryFactory } from '@/utils/telemetry';
import { createUser } from '@/services/CreateUserService';

//import { DynamicForm } from '@shared-lib';

const AddEditMentor = ({
  SuccessCallback,
  schema,
  uiSchema,
  editPrefilledFormData,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [prefilledFormData, setPrefilledFormData] = useState(
    editPrefilledFormData
  );

  const { t, i18n } = useTranslation();
  const extraFields = {
    tenantCohortRoleMapping: [
      {
        tenantId: '6c8b810a-66c2-4f0d-8c0c-c025415a4414',
        roleId: 'a5f1dbc9-2ad4-442c-b762-0e3fc1f6c6da',
      },
    ],
    username: 'youthnetmentor',
    password: '98765',
  };

  const FormSubmitFunction = async (formData: any, payload: any) => {
    setPrefilledFormData(formData);
    //Manually setting userName as a email
    payload.username = formData.email;

    try {
      const mentorData = await createUser(payload, t);

      if (mentorData && mentorData.success) {
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
      } else {
        showToastMessage(t('MENTOR.NOT_ABLE_CREATE_MENTOR'), 'error');
      }
    } catch (error) {
      console.error('Error creating mentor:', error);
      showToastMessage(t('MENTOR.NOT_ABLE_CREATE_MENTOR'), 'error');
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
            extraFields={extraFields}
          />
        )
      )}
    </>
  );
};

export default AddEditMentor;
