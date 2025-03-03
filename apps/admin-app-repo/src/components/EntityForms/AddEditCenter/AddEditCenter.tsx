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
import { createCohort } from '@/services/CohortService/cohortService';
import { TelemetryEventType } from '@/utils/app.constant';
import { telemetryFactory } from '@/utils/telemetry';

//import { DynamicForm } from '@shared-lib';

const AddEditCenter = ({
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
  const extraFields = { type: 'COHORT' };

  const FormSubmitFunction = async (formData: any, payload: any) => {
    setPrefilledFormData(formData);

    try {
      const cohortData = await createCohort(payload, t); // Replacing searchData with createCohort

      if (cohortData && cohortData.success) {
        showToastMessage(t('CENTERS.CENTER_CREATED_SUCCESSFULLY'), 'success');

        const windowUrl = window.location.pathname;
        const cleanedUrl = windowUrl.replace(/^\//, '');
        const env = cleanedUrl.split('/')[0];

        const telemetryInteract = {
          context: {
            env: env,
            cdata: [],
          },
          edata: {
            id: 'center-created-successfully',
            type: TelemetryEventType.CLICK,
            subtype: '',
            pageid: cleanedUrl,
          },
        };

        telemetryFactory.interact(telemetryInteract);
        SuccessCallback();
        // localStorage.removeItem('BMGSData');
      } else {
        showToastMessage(t('CENTER.NOT_ABLE_CREATE_CENTER'), 'error');
      }
    } catch (error) {
      console.error('Error creating cohort:', error);
      showToastMessage(t('CENTER.NOT_ABLE_CREATE_CENTER'), 'error');
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

export default AddEditCenter;
