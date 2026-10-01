import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import SimpleModal from '@shared-lib-v2/lib/SimpleModal/SimpleModal';
import DynamicForm from '@shared-lib-v2/DynamicForm/components/DynamicForm';
import { showToastMessage } from '@shared-lib-v2/DynamicForm/components/Toastify';
import {
  applySkipAndHide,
  buildRetentionSubmission,
  getReadOnlyUiSchema,
  RetentionFormBundle,
  withCallIntervalLocked,
} from '../../services/retention/RetentionFormService';
import {
  updateCohortMemberStatus,
  isMutationSuccess,
} from '../../services/myTeachingCenter/LearnerListService';
import { RetentionMilestoneKey } from '../../services/retention/retention.config';

interface RetentionModalProps {
  onClose: () => void;
  membershipId: string | number;
  learnerName?: string;
  learnerRow: any;
  milestoneKey: RetentionMilestoneKey;
  milestoneLabel?: string;
  isCompleted: boolean;
  initialFormData: Record<string, any>;
  form: RetentionFormBundle;
  onSaved: () => void;
}

// Same "mounted only while a Follow-Up is actually selected — no `open`
// prop" pattern as PlacementModal.tsx (see its own comment for the full
// reasoning): DynamicForm has no unmount cleanup for its own async prefill
// chain (fetching domain's option list, etc.), so a persistently-mounted
// modal toggling `open` + remounting the inner DynamicForm via a changing
// `key` let a superseded instance's delayed async resolution call back into
// this (still-mounted) component's setState and clobber the correct
// prefilled data — a race that depended on network timing. The caller
// (RetentionLearnerTable) only renders this component at all while a
// Follow-Up box is selected, and computes initialFormData itself (see
// RetentionFormService's extractRetentionFormData /
// getFreshRetentionFormData / buildRetentionSchemaWithKnownValues) — this
// component just renders whatever it's given, exactly like PlacementModal.
const RetentionModal: React.FC<RetentionModalProps> = ({
  onClose,
  membershipId,
  learnerName,
  learnerRow,
  milestoneKey,
  milestoneLabel,
  isCompleted,
  initialFormData,
  form,
  onSaved,
}) => {
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);

  // Called by DynamicForm only after RJSF validation passes (required fields
  // filled, patterns valid) — the Save button submits the form via `form=`.
  const handleSave = async (formData: Record<string, any>) => {
    if (saving) return;
    setSaving(true);
    try {
      const { customFields, allMilestonesCompleted } = buildRetentionSubmission(
        learnerRow,
        milestoneKey,
        formData
      );
      const result = await updateCohortMemberStatus({
        membershipId,
        dynamicBody: { customFields },
      });
      if (!isMutationSuccess(result)) {
        showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
        return;
      }

      if (allMilestonesCompleted && learnerRow?.status !== 'retention_complete') {
        const statusResult = await updateCohortMemberStatus({
          membershipId,
          memberStatus: 'retention_complete',
        });
        if (!isMutationSuccess(statusResult)) {
          showToastMessage(t('RETENTION.STATUS_UPDATE_FAILED'), 'error');
        }
      }

      showToastMessage(t('RETENTION.FOLLOW_UP_SAVED_SUCCESS'), 'success');
      onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  // applySkipAndHide is only safe to precompute for a Completed (read-only,
  // never-changes-again) Follow-Up. DynamicForm's own live handleChange
  // recomputes skip/hide from scratch on every interaction, but only ever
  // *adds* 'ui:widget': 'hidden' onto whatever uiSchema it was first
  // mounted with (see hideFieldsInUISchema — it never removes one). Feeding
  // it an already-hidden uiSchema for the editable case would permanently
  // wedge monthlySalary/reasonForLeavingJob hidden — DynamicForm's own
  // per-interaction recompute could add hides but never take one back. So
  // the editable case is left to start from the untouched uiSchema and
  // rely entirely on DynamicForm's own (correct, unconditional)
  // handleChange logic for every skip/hide toggle, accepting that
  // dependent fields may briefly show before the Coordinator's first
  // interaction with any field.
  const uiSchema = isCompleted
    ? applySkipAndHide(form.schema, getReadOnlyUiSchema(form.schema, form.uiSchema), initialFormData)
    : withCallIntervalLocked(form.uiSchema);

  return (
    <SimpleModal
      open
      onClose={onClose}
      showFooter={true}
      modalTitle={
        isCompleted
          ? t('RETENTION.VIEW_FOLLOW_UP', { milestone: milestoneLabel })
          : t('RETENTION.COMPLETE_FOLLOW_UP', { milestone: milestoneLabel })
      }
      secondaryText={isCompleted ? t('COMMON.CLOSE') : t('COMMON.CANCEL')}
      secondaryActionHandler={onClose}
      // A Completed Follow-Up is read-only — no Save button.
      primaryText={isCompleted ? undefined : t('COMMON.SAVE')}
      primaryDisabled={saving}
      // SimpleModal's primary button is type="submit" form={id} — same
      // wiring as PlacementModal.tsx.
      id="dynamic-form-id"
    >
      {learnerName && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {learnerName}
        </Typography>
      )}
      {/* Stack the Retention Form one field per row. */}
      <Box
        sx={{
          '& .MuiGrid-item': {
            flexBasis: '100% !important',
            maxWidth: '100% !important',
          },
        }}
      >
        <DynamicForm
          schema={form.schema}
          uiSchema={uiSchema}
          // Full-form mode (not isCallSubmitInHandle) so the schema's
          // `required` array is honoured — see PlacementModal.tsx.
          hideSubmit={true}
          FormSubmitFunction={(cleanedData: any) => handleSave(cleanedData)}
          // The Retention Form has an API-driven field (domain) —
          // isReassign makes DynamicForm do an explicit full re-apply
          // of prefilledFormData once rendering is complete (same fix
          // already used for Placement's own Update flow and the SDBV
          // filter bar's State→District cascade).
          isReassign={isCompleted}
          prefilledFormData={initialFormData}
          type="retention"
        />
      </Box>
    </SimpleModal>
  );
};

export default RetentionModal;
