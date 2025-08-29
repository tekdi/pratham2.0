import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DialogActions from '@mui/material/DialogActions';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import { useFrameworkFormStore } from '../../../store/frameworkFormStore';
import SortableDataTable, { ColumnDefinition } from '../../SortableDataTable';
import TermForm from '../../term/TermForm';
import PendingTermsSection from '../../term/PendingTermsSection';
import BatchCreationModal from '../BatchCreationModal';
import BatchStatusList from '../BatchStatusList';
import { getAllTermsFromCategories } from '../../../services/categoryService';
import { deleteTerm } from '../../../services/termService';
import { batchCreateTermAssociations } from '../../../services/associationService';
import { useEditTerm } from '../../../hooks/useEditTerm';
import { useStepTerms } from '../../../hooks/useStepTerms';
import type { StepTermsHandle } from '../../../interfaces/TermInterface';
import type { BatchAssociationCreateInput } from '../../../services/associationService';

const StepTerms = forwardRef<StepTermsHandle, object>((props, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [termToDelete, setTermToDelete] = useState<Record<
    string,
    unknown
  > | null>(null);

  // Cascading deletion state
  const [cascadingUpdateLoading, setCascadingUpdateLoading] = useState(false);
  const [cascadingResults, setCascadingResults] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);

  const categories = useFrameworkFormStore((state) => state.categories);
  const setCategories = useFrameworkFormStore((state) => state.setCategories);
  const framework = useFrameworkFormStore((state) => state.framework);
  const channel = useFrameworkFormStore((state) => state.channel);

  const {
    form,
    setForm,
    error,
    setError,
    success,
    setSuccess,
    pendingTerms,
    batchStatus,
    modalOpen,
    modalStatuses,
    currentModalIndex,
    handleFormChange,
    handleAddTerm,
    handleBatchCreate,
    handleRetry,
    handleDeletePendingTerm,
  } = useStepTerms(categories, setCategories, framework);

  // Close modal when form is successfully submitted
  useEffect(() => {
    if (success && isModalOpen) {
      const timer = setTimeout(() => {
        setIsModalOpen(false);
      }, 1500); // Close after showing success message briefly
      return () => clearTimeout(timer);
    }
  }, [success, isModalOpen]);

  useImperativeHandle(ref, () => ({
    hasUnsavedTerms: () => pendingTerms.length > 0 || isEditMode || isModalOpen,
  }));

  const { isEditMode, handleEditTerm, handleCancelEdit, handleUpdateTerm } =
    useEditTerm({
      categories,
      setCategories,
      framework,
      channel,
      form: {
        name: form.name,
        code: form.code,
        description: form.description,
        label: form.label,
        selectedCategory: form.selectedCategory,
      },
      setForm: (newForm) => {
        setForm({
          ...newForm,
          selectedCategory: newForm.selectedCategory,
        });
      },
      setError,
      setSuccess,
    });

  // Get all terms from all categories (only Live terms)
  const allTerms = getAllTermsFromCategories(categories).filter(
    (term) => term.status === 'Live'
  );

  // Define columns for the terms table
  const termColumns: ColumnDefinition<
    Record<string, unknown> & {
      categoryName: string;
      categoryCode: string;
    }
  >[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
    },
    {
      key: 'code',
      label: 'Code',
      sortable: true,
    },
    {
      key: 'categoryName',
      label: 'Category',
      sortable: true,
      render: (value, row) =>
        (value as string) ||
        categories.find((cat) => cat.code === row.categoryCode)?.name ||
        row.categoryCode ||
        '—',
    },
    {
      key: 'description',
      label: 'Description',
      sortable: true,
      render: (value) => (value as string) || '—',
    },
    {
      key: 'identifier',
      label: 'Actions',
      sortable: false,
      render: (value, row) => (
        <Box display="flex" gap={1}>
          <IconButton
            size="small"
            onClick={() => {
              handleEditTerm(row);
              setIsModalOpen(true);
            }}
            aria-label="Edit term"
            title="Edit Term"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => {
              setTermToDelete(row);
              setDeleteModalOpen(true);
            }}
            aria-label="Delete term"
            title="Delete Term"
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isEditMode) {
      handleCancelEdit();
    }
    setIsModalOpen(false);
  };

  const handleFormSubmitWithClose = (e: React.FormEvent) => {
    if (isEditMode) {
      handleUpdateTerm(e);
    } else {
      handleAddTerm(e);
    }
  };

  // Wrapper function to handle type compatibility
  const handleTermFormChange = (
    e:
      | { target: { name: string; value: string } }
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // Convert the new FormChangeEvent type to the format expected by useStepTerms hook
    handleFormChange(e as React.ChangeEvent<HTMLInputElement>);
  };

  // Function to find terms that have associations with the term being deleted
  const findAffectedTerms = (
    deletedTermCode: string
  ): Array<
    Record<string, unknown> & { categoryName: string; categoryCode: string }
  > => {
    const allTerms = getAllTermsFromCategories(categories);
    return allTerms.filter((term) => {
      const associations = term.associations as
        | Array<{ code: string; identifier: string }>
        | undefined;
      return associations?.some(
        (assoc: { code: string }) => assoc.code === deletedTermCode
      );
    });
  };

  // Function to handle cascading association updates
  const handleCascadingAssociationUpdates = async (
    deletedTermCode: string
  ): Promise<void> => {
    const affected = findAffectedTerms(deletedTermCode);

    if (affected.length === 0) {
      setCascadingResults({ success: 0, failed: 0, errors: [] });
      return;
    }

    setCascadingUpdateLoading(true);

    // Build batch updates for all affected terms
    const batchUpdates: BatchAssociationCreateInput[] = affected.map((term) => {
      // Filter out the deleted term from associations
      const associations = term.associations as
        | Array<{ code: string; identifier: string }>
        | undefined;
      const updatedAssociations = (associations || [])
        .filter(
          (assoc: { code: string; identifier: string }) =>
            assoc.code !== deletedTermCode
        )
        .map((assoc: { identifier: string }) => ({
          identifier: assoc.identifier,
        }));

      return {
        fromTermCode: term.code as string,
        frameworkCode: framework?.code || '',
        categoryCode: term.categoryCode || (term.category as string) || '',
        associations: updatedAssociations,
      };
    });

    try {
      const results = await batchCreateTermAssociations(
        batchUpdates,
        channel?.identifier
      );

      // Count success and failures
      const successCount = results.filter((r) => r.result).length;
      const failedCount = results.filter((r) => r.error).length;
      const errors = results
        .filter((r) => r.error)
        .map(
          (r) =>
            `${r.input.fromTermCode}: ${r.error?.message || 'Unknown error'}`
        );

      setCascadingResults({
        success: successCount,
        failed: failedCount,
        errors,
      });

      // Refresh framework data after a delay if any updates succeeded
      if (successCount > 0) {
        setTimeout(async () => {
          try {
            const { fetchAndUpdateFramework } =
              useFrameworkFormStore.getState();
            await fetchAndUpdateFramework();
          } catch (error) {
            console.error('Failed to refresh framework data:', error);
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Cascading update error:', error);
      setCascadingResults({
        success: 0,
        failed: affected.length,
        errors: [
          `Failed to update associations: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`,
        ],
      });
    } finally {
      setCascadingUpdateLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (termToDelete) {
      setDeleteLoading(true);
      setCascadingResults(null); // Reset cascading results

      try {
        const result = await deleteTerm(
          termToDelete.code as string,
          framework?.identifier as string,
          termToDelete.categoryCode as string,
          channel?.identifier as string
        );

        if (result.success) {
          // Handle cascading association updates first
          await handleCascadingAssociationUpdates(termToDelete.code as string);

          // Remove the term from the local state by updating categories
          const updatedCategories = categories.map((category) => {
            if (category.code === termToDelete.categoryCode) {
              return {
                ...category,
                terms:
                  category.terms?.filter(
                    (term) => term.code !== termToDelete.code
                  ) || [],
              };
            }
            return category;
          });

          setCategories(updatedCategories);
          setSuccess('Term deleted successfully');

          // Clear success message after a delay
          setTimeout(() => setSuccess(null), 3000);
        } else {
          setError(result.message);

          // Clear error message after a delay
          setTimeout(() => setError(null), 5000);
        }
      } catch (error) {
        console.error('Delete term error:', error);
        setError('Failed to delete term. Please try again.');

        // Clear error message after a delay
        setTimeout(() => setError(null), 5000);
      } finally {
        setDeleteLoading(false);
        setDeleteModalOpen(false);
        setTermToDelete(null);
        setCascadingResults(null);
        setCascadingUpdateLoading(false);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setTermToDelete(null);
    setCascadingResults(null);
    setCascadingUpdateLoading(false);
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
          Terms
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, maxWidth: '80%' }}
        >
          Create terms for the categories in this framework.
        </Typography>

        {/* Action Button */}
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenModal}
            sx={{
              minWidth: 180,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Add New Term
          </Button>
        </Box>
      </Box>

      {/* Terms List */}
      <SortableDataTable<
        Record<string, unknown> & {
          categoryName: string;
          categoryCode: string;
        }
      >
        data={allTerms}
        columns={termColumns}
        searchable={true}
        searchPlaceholder="Search terms..."
        searchableFields={[
          'name',
          'code',
          'description',
          'categoryName',
          'categoryCode',
        ]}
        rowsPerPage={5}
        emptyStateMessage="No terms available."
        getRowKey={(row) => row.identifier as string}
      />

      {/* Pending terms section */}
      <PendingTermsSection
        pendingTerms={pendingTerms}
        onCreate={handleBatchCreate}
        onDelete={handleDeletePendingTerm}
      />

      {/* Modal for Term Form */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        aria-labelledby="term-form-dialog-title"
      >
        <DialogTitle id="term-form-dialog-title">
          {isEditMode ? 'Edit Term' : 'Add New Term'}
        </DialogTitle>
        <DialogContent>
          <Box pt={1}>
            <TermForm
              form={form}
              categories={categories.map((cat) => ({
                code: cat.code,
                name: cat.name,
              }))}
              onChange={handleTermFormChange}
              onSubmit={handleFormSubmitWithClose}
              error={error}
              success={success}
              isEditMode={isEditMode}
            />

            {/* Action Buttons aligned with form */}
            <Box display="flex" gap={2} justifyContent="flex-end" mt={3}>
              <Button onClick={handleCloseModal}>Cancel</Button>
              <Button
                onClick={handleFormSubmitWithClose}
                variant="contained"
                color="primary"
              >
                {isEditMode ? 'Update Term' : 'Add Term'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Modal for batch creation progress */}
      <BatchCreationModal
        open={modalOpen}
        title="Creating Terms"
        items={
          pendingTerms as unknown as Array<{
            name: string;
            code: string;
            [key: string]: unknown;
          }>
        }
        statuses={modalStatuses}
        currentIndex={currentModalIndex}
        getItemLabel={(item) =>
          `${item.name as string} (${item.categoryCode as string})`
        }
      />
      {/* Batch status results */}
      <BatchStatusList
        title="Creation Results"
        items={
          batchStatus as unknown as {
            [key: string]: unknown;
            name: string;
            code: string;
          }[]
        }
        statuses={batchStatus}
        onRetry={handleRetry}
        typeLabel="Term"
        getItemLabel={(item) =>
          `${item.name as string} in ${item.categoryCode as string}`
        }
      />

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        maxWidth="md"
        fullWidth
        aria-labelledby="delete-term-dialog-title"
      >
        <DialogTitle id="delete-term-dialog-title">Delete Term</DialogTitle>
        <DialogContent>
          <Typography color="error.main" sx={{ mb: 2 }}>
            Are you sure you want to delete the term{' '}
            <span style={{ fontWeight: 600 }}>
              {termToDelete?.name as string}
            </span>{' '}
            ? This action cannot be undone.
          </Typography>

          {/* Show affected terms before deletion */}
          {termToDelete &&
            !deleteLoading &&
            !cascadingResults &&
            (() => {
              const affected = findAffectedTerms(termToDelete.code as string);
              if (affected.length > 0) {
                return (
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      bgcolor: 'warning.light',
                      borderRadius: 1,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 1, fontWeight: 600 }}
                    >
                      ⚠️ Impact: This term is associated with {affected.length}{' '}
                      other term(s)
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      These associations will be automatically removed:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {affected.map((term) => (
                        <Chip
                          key={`${term.categoryCode}-${term.code as string}`}
                          label={`${term.name as string} (${
                            term.categoryCode
                          })`}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                );
              }
              return null;
            })()}

          {/* Show progress during deletion */}
          {deleteLoading && (
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <CircularProgress size={20} />
              <Typography>
                {cascadingUpdateLoading
                  ? 'Updating associated terms...'
                  : 'Deleting term...'}
              </Typography>
            </Box>
          )}

          {/* Show cascading results */}
          {cascadingResults && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Association Update Results:
              </Typography>
              <Typography variant="body2" color="success.main">
                ✓ {cascadingResults.success} associations updated successfully
              </Typography>
              {cascadingResults.failed > 0 && (
                <>
                  <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
                    ✗ {cascadingResults.failed} associations failed to update
                  </Typography>
                  {cascadingResults.errors.length > 0 && (
                    <Box sx={{ mt: 1, maxHeight: 100, overflow: 'auto' }}>
                      {cascadingResults.errors.map((error) => (
                        <Typography
                          key={error}
                          variant="caption"
                          color="error.main"
                          sx={{ display: 'block', fontSize: '0.75rem' }}
                        >
                          {error}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});
StepTerms.displayName = 'StepTerms';
export default StepTerms;
