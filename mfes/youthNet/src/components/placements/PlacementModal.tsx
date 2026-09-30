import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import SimpleModal from '@shared-lib-v2/lib/SimpleModal/SimpleModal';
import DynamicForm from '@shared-lib-v2/DynamicForm/components/DynamicForm';
import { showToastMessage } from '@shared-lib-v2/DynamicForm/components/Toastify';
import {
  buildPlacementCustomFields,
  PlacementFormBundle,
} from '../../services/placements/PlacementFormService';
import {
  updateCohortMemberStatus,
  isMutationSuccess,
} from '../../services/myTeachingCenter/LearnerListService';

interface PlacementModalProps {
  onClose: () => void;
  membershipId: string | number;
  learnerName?: string;
  isUpdate: boolean;
  initialFormData: Record<string, any>;
  form: PlacementFormBundle;
  onSaved: () => void;
}

// Placement Form is fetched from the backend (form/read?context=PLACEMENT&
// contextType=PLACEMENT — see PlacementFormService) and rendered with
// DynamicForm inside SimpleModal (same pattern as admin-app AddEditPlacementPropertyModal).
//
// The caller (PlacementLearnerTable) only renders this component AT ALL
// while a row is selected for Place/Update — there is no `open` prop here,
// this component IS the open state. That matters: DynamicForm has no
// unmount cleanup for its own async prefill chain (fetching Domain/State/
// Placement Property options, resolving dependent District options, etc.),
// so an earlier attempt that kept one persistent <PlacementModal> mounted
// and only toggled an `open` prop + remounted the inner <DynamicForm> via a
// changing `key` still let a superseded DynamicForm instance's straggling
// async resolution call back into this (still-mounted) component's setState
// and clobber the correct data — a race whose outcome depended on network
// timing (reliably fine on a warm connection right after placing someone,
// unreliable after a full reload's cold connection). Fully unmounting this
// whole component between opens (see PlacementLearnerTable) means a stale
// instance's delayed callback lands on a component that's genuinely gone —
// React no-ops it — instead of a component that merely looks new via `key`.
const PlacementModal: React.FC<PlacementModalProps> = ({
  onClose,
  membershipId,
  learnerName,
  isUpdate,
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
      const customFields = buildPlacementCustomFields(form.schema, formData);
      const result = await updateCohortMemberStatus({
        membershipId,
        memberStatus: 'placed',
        dynamicBody: { customFields },
      });
      if (!isMutationSuccess(result)) {
        showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
        return;
      }
      showToastMessage(
        isUpdate
          ? t('PLACEMENTS.PLACEMENT_UPDATED_SUCCESS')
          : t('PLACEMENTS.PLACEMENT_SAVED_SUCCESS'),
        'success'
      );
      onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <SimpleModal
      open
      onClose={onClose}
      showFooter={true}
      modalTitle={isUpdate ? t('PLACEMENTS.UPDATE_PLACEMENT') : t('PLACEMENTS.PLACE_STUDENT')}
      secondaryText={t('COMMON.CANCEL')}
      secondaryActionHandler={onClose}
      primaryText={t('COMMON.SAVE')}
      primaryDisabled={saving}
      // SimpleModal's primary button is type="submit" form={id}, so Save
      // submits DynamicForm (default id "dynamic-form-id") and RJSF
      // validation runs before FormSubmitFunction is called.
      id="dynamic-form-id"
    >
      {learnerName && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {learnerName}
        </Typography>
      )}
      {/* Stack the Placement Form one field per row. */}
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
          uiSchema={form.uiSchema}
          // Full-form mode (not isCallSubmitInHandle): the per-field
          // mode renders each field as its own <Form> without the
          // schema's `required` array, so required fields got no
          // asterisk and no validation.
          hideSubmit={true}
          FormSubmitFunction={(cleanedData: any) => handleSave(cleanedData)}
          // The Placement Form has dependent-API fields (district
          // depends on state) — isReassign makes DynamicForm do an
          // explicit full re-apply of prefilledFormData once rendering
          // is complete (same fix already used for the SDBV filter
          // bar's own State→District cascade).
          isReassign={isUpdate}
          prefilledFormData={initialFormData}
          type="placement"
        />
      </Box>
    </SimpleModal>
  );
};

export default PlacementModal;
