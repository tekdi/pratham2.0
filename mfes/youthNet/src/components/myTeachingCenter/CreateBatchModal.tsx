import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'next-i18next';
import DynamicForm from '@shared-lib-v2/DynamicForm/components/DynamicForm';
import { showToastMessage } from '@shared-lib-v2/DynamicForm/components/Toastify';
import SimpleModal from '../SimpleModal';
import { L2BatchCreate } from '../../constant/Forms/L2BatchCreate';
import { createBatch, isCreateBatchSuccess } from '../../services/myTeachingCenter/CreateBatchService';
import { TrainerAssignedTaxonomy } from '../../utils/Interfaces';

// Cast to `any` deliberately: the RJSF schema/uiSchema objects get
// field-specific overrides spliced in below (enum/enumNames/ui:disabled/
// formatMinimum), which a strict literal type from L2BatchCreate would
// reject via excess-property checks — same loose typing this dynamic-form
// machinery uses everywhere else in the codebase (e.g. BatchFlow.tsx).
const cloneDeep = (obj: any): any => JSON.parse(JSON.stringify(obj));

interface CreateBatchModalProps {
  open: boolean;
  onClose: () => void;
  // Reused from an existing matching batch's own parentId (see
  // my-teaching-center/index.tsx) — there's no dedicated Center lookup any
  // more, so this is only available once at least one batch already
  // exists for the Trainer's Domain/Skills.
  centerId: string;
  trainerTaxonomy: TrainerAssignedTaxonomy;
  onCreated: () => void;
}

// Same modal chrome as /scp-teacher-repo/centers?tab=1's "Add Batch" (the
// SimpleModal component — identical here, shared component shape) and the
// same Batch-create form (L2BatchCreate, ported into constant/Forms/) that
// apps/admin-app-repo's BatchFlow.tsx already uses for Vocational Training
// batches. Domain and Skills are both prepopulated straight from the
// Trainer's own profile (trainerTaxonomy — confirmed real DOMAIN/SKILLS
// customFields on GET /user/read?fieldvalue=true) and locked/disabled
// whenever there's exactly one value, mirroring BatchFlow.tsx's own
// buildSchemaAndUi() behavior for a single-option field.
const CreateBatchModal: React.FC<CreateBatchModalProps> = ({
  open,
  onClose,
  centerId,
  trainerTaxonomy,
  onCreated,
}) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const schema = cloneDeep(L2BatchCreate.schema);
  const uiSchema = cloneDeep(L2BatchCreate.uiSchema);

  // overrideEnum, mirroring apps/admin-app-repo/BatchFlow.tsx's own helper:
  // drop the framework-taxonomy `api` fetch and restrict each field to the
  // Trainer's own assigned values (both already plain display strings, so
  // enum and enumNames are identical).
  if (schema.properties.domain) {
    delete (schema.properties.domain as any).api;
    schema.properties.domain.items = {
      type: 'string',
      enum: trainerTaxonomy.domains,
      enumNames: trainerTaxonomy.domains,
    };
    if (trainerTaxonomy.domains.length === 1) {
      uiSchema.domain = { ...uiSchema.domain, 'ui:disabled': true };
    }
  }
  if (schema.properties.skills) {
    delete (schema.properties.skills as any).api;
    schema.properties.skills.items = {
      type: 'string',
      enum: trainerTaxonomy.skills,
      enumNames: trainerTaxonomy.skills,
    };
    if (trainerTaxonomy.skills.length === 1) {
      uiSchema.skills = { ...uiSchema.skills, 'ui:disabled': true };
    }
  }

  // Neither date can be in the past — same formatMinimum/minValue injection
  // BatchFlow.tsx applies, since "today" can't be a static schema value.
  const today = new Date().toISOString().slice(0, 10);
  (['startdate', 'enddate'] as const).forEach((key) => {
    if (schema.properties[key]) (schema.properties[key] as any).formatMinimum = today;
    if (uiSchema[key]) {
      uiSchema[key] = {
        ...uiSchema[key],
        'ui:options': { ...uiSchema[key]['ui:options'], minValue: today },
      };
    }
  });

  const prefilledFormData: Record<string, any> = {};
  if (trainerTaxonomy.domains.length === 1) prefilledFormData.domain = [trainerTaxonomy.domains[0]];
  if (trainerTaxonomy.skills.length === 1) prefilledFormData.skills = [trainerTaxonomy.skills[0]];

  const handleSubmit = async () => {
    if (saving) return;
    const domain = formData?.domain?.[0];
    const skill = formData?.skills?.[0];
    // Re-validate against the Trainer's actual taxonomy right before
    // submitting — the dropdowns only ever offer assigned values, but this
    // is the check that still holds even if that were bypassed client-side.
    if (!domain || !trainerTaxonomy.domains.includes(domain)) {
      showToastMessage(t('MY_TEACHING_CENTER.DOMAIN_COURSE_NOT_ASSIGNED'), 'error');
      return;
    }
    if (!skill || !trainerTaxonomy.skills.includes(skill)) {
      showToastMessage(t('MY_TEACHING_CENTER.DOMAIN_COURSE_NOT_ASSIGNED'), 'error');
      return;
    }
    if (!centerId) {
      showToastMessage(t('MY_TEACHING_CENTER.BATCH_CREATE_FAILED'), 'error');
      return;
    }
    if (!formData?.name || !formData?.batch_type || !formData?.startdate || !formData?.enddate) {
      showToastMessage(t('MY_TEACHING_CENTER.BATCH_CREATE_FAILED'), 'error');
      return;
    }

    setSaving(true);
    try {
      const result = await createBatch({ centerId, formData });
      if (!isCreateBatchSuccess(result)) {
        showToastMessage(t('MY_TEACHING_CENTER.BATCH_CREATE_FAILED'), 'error');
        return;
      }
      showToastMessage(t('MY_TEACHING_CENTER.BATCH_CREATED_SUCCESS'), 'success');
      onCreated();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <SimpleModal
      open={open}
      onClose={onClose}
      showFooter
      primaryText={saving ? t('COMMON.LOADING') : t('MY_TEACHING_CENTER.CREATE')}
      secondaryText={t('MY_TEACHING_CENTER.CANCEL')}
      primaryActionHandler={handleSubmit}
      secondaryActionHandler={onClose}
      modalTitle={t('MY_TEACHING_CENTER.CREATE_BATCH_TITLE')}
      id="my-teaching-center-batch-create"
    >
      {/* DynamicForm hardcodes a Grid item xs={12} md={4} lg={3} per field
          whenever isCallSubmitInHandle is true, ignoring any uiSchema grid
          option — forcing full width here at the call site instead of
          touching that shared, widely-used component (same fix already
          used by l2-interested-queue.tsx's CommonSidePanel form). */}
      <Box
        sx={{
          '& .MuiGrid-item': {
            flexBasis: '100% !important',
            maxWidth: '100% !important',
          },
        }}
      >
        <DynamicForm
          schema={schema}
          uiSchema={{ ...uiSchema, 'ui:submitButtonOptions': { norender: true } }}
          SubmitaFunction={(fd: any) => setFormData(fd)}
          isCallSubmitInHandle={true}
          prefilledFormData={prefilledFormData}
          type="my-teaching-center-batch-create"
        />
      </Box>
    </SimpleModal>
  );
};

export default CreateBatchModal;
