import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  Box,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AssociationDetailsModal from '../AssociationDetailsModal';
import { useAssociationModal } from '../../../hooks/useAssociationModal';
import AssociationTable from '../../association/AssociationTable';
import TermSelector from '../../association/TermSelector';
import CategorySelector from '../../association/CategorySelector';
import TermChecklist from '../../association/TermChecklist';
import AssociationActions from '../../association/AssociationActions';
import { useStepAssociation } from '../../../hooks/useStepAssociation';
import type { StepAssociationHandle } from '../../../interfaces/AssociationInterface';
import type { Term } from '../../../interfaces/TermInterface';
import CircularProgress from '@mui/material/CircularProgress';

const StepAssociation = forwardRef<StepAssociationHandle>((props, ref) => {
  // Association modal state
  const { modalProps } = useAssociationModal();

  // Association form modal state
  const [isAssociationFormOpen, setIsAssociationFormOpen] = useState(false);

  // Add success notification for association form
  const [associationFormSuccess, setAssociationFormSuccess] = useState(false);

  // Add state to track if we're in edit mode
  const [isEditMode, setIsEditMode] = useState(false);

  // Use the main hook for all state and logic (including modal)
  const {
    // State
    categoriesWithTerms,
    selectedCategoryCode,
    selectedCategory,
    selectedTermCode,
    selectedTerm,
    availableCategories,
    selectedAvailableCategoryCode,
    selectedAvailableCategory,
    termsInAvailableCategory,
    checkedTermCodes,
    workingAssociationsList,
    allTermsWithAssociations,
    batchLoading,
    batchResults,
    modalOpen,
    modalData,

    // Handlers
    handleCategoryChange,
    handleTermChange,
    handleAvailableCategoryClick,
    handleToggleTerm,
    handleSaveAssociations,
    handleBatchSaveAssociations,
    handleChipClick,
    handleCloseModal,
    setWorkingAssociationsList, // <-- add this to the hook if not present
    handleRetryBatchRequests,
    // Delete association modal state and handlers
    handleEditAssociation,
    resetFormState,
  } = useStepAssociation();

  // Selection state for preview table
  const [selectedPreviewIds, setSelectedPreviewIds] = useState<string[]>([]);

  // Selection handlers
  const handleSelectPreviewRow = (id: string) => {
    setSelectedPreviewIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const handleSelectAllPreview = (checked: boolean) => {
    setSelectedPreviewIds(
      checked ? workingAssociationsList.map((a) => a.identifier) : []
    );
  };

  // Clear selected associations only
  const handleClearSelectedAssociations = () => {
    setWorkingAssociationsList(
      workingAssociationsList.filter(
        (a) => !selectedPreviewIds.includes(a.identifier)
      )
    );
    setSelectedPreviewIds([]);
  };

  // Modal state for batch results
  const [batchModalOpen, setBatchModalOpen] = useState(false);

  // Open modal when batchLoading or batchResults changes
  React.useEffect(() => {
    if (batchLoading || batchResults) {
      setBatchModalOpen(true);
    }
  }, [batchLoading, batchResults]);

  // Retry failed requests
  const handleRetry = () => {
    if (!batchResults) return;
    const failedInputs = batchResults
      .filter((r) => r.error)
      .map((r) => r.input);
    if (failedInputs.length > 0) {
      handleRetryBatchRequests(failedInputs);
    }
  };

  // Handle modal close and reset states
  const handleCloseAssociationForm = () => {
    setIsAssociationFormOpen(false);
    setAssociationFormSuccess(false);
    setIsEditMode(false);
    // Always reset form state when closing modal to ensure clean slate
    resetFormState();
  };

  // Handle add to preview - just clear checked terms, don't close modal (unless in edit mode)
  const handleAddToPreview = () => {
    handleSaveAssociations();

    if (isEditMode) {
      // In edit mode, show success and close modal after brief delay
      setAssociationFormSuccess(true);
      setTimeout(() => {
        handleCloseAssociationForm();
      }, 1000);
    } else {
      // In create mode, just show success briefly and keep modal open
      setAssociationFormSuccess(true);
      setTimeout(() => {
        setAssociationFormSuccess(false);
      }, 2000);
    }
  };

  // Handle edit association - setup form state and open modal
  const handleEditAssociationWithModal = (
    term: Term & { categoryCode?: string; categoryName?: string }
  ) => {
    handleEditAssociation(term);
    setIsEditMode(true);
    setIsAssociationFormOpen(true);
  };

  useImperativeHandle(
    ref,
    () => ({
      hasUnsavedAssociations: () =>
        workingAssociationsList.length > 0 || isAssociationFormOpen,
      clearWorkingAssociations: () => setWorkingAssociationsList([]),
    }),
    [workingAssociationsList, setWorkingAssociationsList, isAssociationFormOpen]
  );

  // Extract the nested ternary into a clear variable
  const getButtonText = () => {
    if (associationFormSuccess) {
      return isEditMode ? 'Updated!' : 'Added to Preview!';
    }
    return isEditMode ? 'Update Associations' : 'Add to Preview';
  };

  return (
    <Box>
      {/* Header Section */}
      <Box mb={4}>
        <Typography
          variant="subtitle1"
          fontWeight={700}
          gutterBottom
          sx={{
            textTransform: 'uppercase',
            color: 'text.secondary',
            fontSize: 15,
            letterSpacing: 0.5,
          }}
        >
          Term Associations
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, maxWidth: '80%' }}
        >
          Create associations between terms from different categories.
        </Typography>

        {/* Action Button */}
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {
              setIsEditMode(false);
              setIsAssociationFormOpen(true);
            }}
            disabled={categoriesWithTerms.length === 0}
            sx={{
              minWidth: 200,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Create Association
          </Button>
        </Box>
      </Box>

      {/* Warning for insufficient categories */}
      {categoriesWithTerms.length === 0 && (
        <Alert
          severity="warning"
          sx={{ display: 'flex', alignItems: 'center', mb: 4 }}
        >
          <WarningAmberIcon fontSize="small" sx={{ mr: 1 }} />
          You need to create terms in multiple categories before creating
          associations.
        </Alert>
      )}

      {/* Existing Associations Section */}
      {allTermsWithAssociations.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <AssociationTable
            associations={allTermsWithAssociations}
            categories={categoriesWithTerms}
            onChipClick={handleChipClick}
            title="Existing Associations"
            showEditAction={true}
            showDeleteAction={false}
            onEdit={handleEditAssociationWithModal}
          />
          <AssociationDetailsModal {...modalProps} />
        </Box>
      )}

      {/* Association Preview - Only show if there are associations lined up */}
      {workingAssociationsList.length > 0 && (
        <>
          <Box sx={{ mt: 4 }}>
            <AssociationTable
              associations={workingAssociationsList}
              categories={categoriesWithTerms}
              onChipClick={handleChipClick}
              title="Preview Associations"
              showSelection
              selectedIds={selectedPreviewIds}
              onSelectRow={handleSelectPreviewRow}
              onSelectAll={handleSelectAllPreview}
            />
          </Box>

          {/* Association Actions */}
          <AssociationActions
            onClearAll={handleClearSelectedAssociations}
            onSaveAssociations={handleBatchSaveAssociations}
            canClearAll={selectedPreviewIds.length > 0}
            canSaveAssociations={
              checkedTermCodes.length > 0 || workingAssociationsList.length > 0
            }
            batchLoading={batchLoading}
          />
        </>
      )}

      {/* Association Details Modal */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Typography variant="h2" component="div">
            Associations for{' '}
            <Box
              component="span"
              sx={{ fontWeight: 600, color: 'primary.main' }}
            >
              {modalData.term?.name}
            </Box>{' '}
            in{' '}
            <Box
              component="span"
              sx={{ fontWeight: 600, color: 'primary.main' }}
            >
              {modalData.assocCategory?.name}
            </Box>
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            {modalData.assocTerms.length === 0 ? (
              <Typography color="text.secondary">
                No associated terms in this category.
              </Typography>
            ) : (
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                {modalData.assocTerms.map((assoc) => (
                  <Typography
                    component="li"
                    key={assoc.code}
                    sx={{ mb: 0.5, fontSize: 16 }}
                  >
                    {assoc.name}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>

      {/* Association Form Modal */}
      <Dialog
        open={isAssociationFormOpen}
        onClose={handleCloseAssociationForm}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0px 2px 8px rgba(0,0,0,0.06)',
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h2" component="div">
            {isEditMode ? 'Edit Term Associations' : 'Create Term Associations'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ p: 2 }}>
            {/* Form Content */}
            <Box
              sx={{
                display: 'grid',
                gap: 4,
                gridTemplateColumns: '1fr 1fr 1fr',
              }}
            >
              {/* Column 1: Select source term */}
              <TermSelector
                categoriesWithTerms={categoriesWithTerms}
                selectedCategoryCode={selectedCategoryCode}
                selectedTermCode={selectedTermCode}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                onTermChange={handleTermChange}
              />

              {/* Column 2: Select available category */}
              <CategorySelector
                availableCategories={availableCategories}
                selectedAvailableCategoryCode={selectedAvailableCategoryCode}
                onCategoryClick={handleAvailableCategoryClick}
              />

              {/* Column 3: Select terms to associate */}
              <TermChecklist
                selectedAvailableCategory={selectedAvailableCategory}
                termsInAvailableCategory={termsInAvailableCategory}
                checkedTermCodes={checkedTermCodes}
                selectedTerm={selectedTerm}
                onToggleTerm={handleToggleTerm}
              />
            </Box>

            {/* Action Buttons */}
            <Box display="flex" gap={2} justifyContent="flex-end" mt={4}>
              <Button onClick={handleCloseAssociationForm} variant="outlined">
                Cancel
              </Button>
              <Button
                onClick={handleAddToPreview}
                variant="contained"
                color="primary"
                disabled={checkedTermCodes.length === 0}
              >
                {getButtonText()}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Batch Result Modal */}
      <Dialog
        open={batchModalOpen}
        onClose={() => setBatchModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Batch Save Results</DialogTitle>
        <DialogContent>
          {batchLoading && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                py: 4,
              }}
            >
              <CircularProgress sx={{ mb: 2 }} />
              <Typography>Saving associations...</Typography>
            </Box>
          )}
          {!batchLoading && batchResults && (
            <>
              <Typography sx={{ mb: 2 }}>
                {batchResults.filter((r) => r.result).length} succeeded,{' '}
                {batchResults.filter((r) => r.error).length} failed
              </Typography>
              <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: 8 }}>Term</th>
                      <th style={{ textAlign: 'left', padding: 8 }}>
                        Category
                      </th>
                      <th style={{ textAlign: 'left', padding: 8 }}>
                        Associations
                      </th>
                      <th style={{ textAlign: 'left', padding: 8 }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batchResults.map((r) => (
                      <tr
                        key={`${r.input.fromTermCode}-${r.input.categoryCode}`}
                        style={{ background: r.error ? '#ffeaea' : '#eaffea' }}
                      >
                        <td style={{ padding: 8 }}>{r.input.fromTermCode}</td>
                        <td style={{ padding: 8 }}>{r.input.categoryCode}</td>
                        <td style={{ padding: 8 }}>
                          {r.input.associations
                            .map((a) => a.identifier)
                            .join(', ')}
                        </td>
                        <td style={{ padding: 8 }}>
                          {r.result ? (
                            <span style={{ color: 'green' }}>Success</span>
                          ) : (
                            <span style={{ color: 'red' }}>
                              {r.error?.message ?? 'Failed'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
              {batchResults.some((r) => r.error) && (
                <Button
                  onClick={handleRetry}
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Retry Failed
                </Button>
              )}
            </>
          )}
        </DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Button
            onClick={() => setBatchModalOpen(false)}
            color="primary"
            variant="outlined"
          >
            Close
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
});

StepAssociation.displayName = 'StepAssociation';

export default StepAssociation;
