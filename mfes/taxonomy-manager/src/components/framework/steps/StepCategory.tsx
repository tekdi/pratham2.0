import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import AddIcon from '@mui/icons-material/Add';
import { useFrameworkFormStore } from '../../../store/frameworkFormStore';
import SortableDataTable, { ColumnDefinition } from '../../SortableDataTable';
import CategoryForm from '../../category/CategoryForm';
import PendingCategoriesSection from '../../category/PendingCategoriesSection';
import BatchCreationModal from '../BatchCreationModal';
import BatchStatusList from '../BatchStatusList';
import { useStepCategory } from '../../../hooks/useStepCategory';
import type {
  StepCategoryHandle,
  Category,
} from '../../../interfaces/CategoryInterface';

const StepCategory = forwardRef<StepCategoryHandle, object>((props, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = useFrameworkFormStore((state) => state.categories);
  const setCategories = useFrameworkFormStore((state) => state.setCategories);
  const framework = useFrameworkFormStore((state) => state.framework);

  const {
    form,
    error,
    success,
    pendingCategories,
    batchStatus,
    modalOpen,
    modalStatuses,
    currentModalIndex,
    handleFormChange,
    handleAddCategory,
    handleBatchCreate,
    handleRetry,
    hasUnsavedCategories,
    handleDeletePendingCategory,
  } = useStepCategory(categories, setCategories, framework);

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
    hasUnsavedCategories: () => {
      const formHasUnsavedData = Object.values(form).some(
        (val) => typeof val === 'string' && val.trim() !== ''
      );
      return hasUnsavedCategories() || formHasUnsavedData || isModalOpen;
    },
  }));

  // Define columns for the category table
  const categoryColumns: ColumnDefinition<Category>[] = [
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
      key: 'description',
      label: 'Description',
      sortable: true,
      render: (value) => (value as string) || '—',
    },
  ];

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFormSubmitWithClose = (e: React.FormEvent) => {
    handleAddCategory(e);
  };

  // Wrapper function to handle type compatibility
  const handleCategoryFormChange = (
    e:
      | { target: { name: string; value: string } }
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // Convert the new FormChangeEvent type to the format expected by useStepCategory hook
    handleFormChange(e as React.ChangeEvent<HTMLInputElement>);
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
          Categories
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, maxWidth: '80%' }}
        >
          These are the available categories for this framework.
        </Typography>

        {/* Action Button */}
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenModal}
            sx={{
              minWidth: 200,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Add New Category
          </Button>
        </Box>
      </Box>

      {/* Categories List */}
      <SortableDataTable<Category>
        data={categories.filter((category) => category.status === 'Live')}
        columns={categoryColumns}
        searchable={true}
        searchPlaceholder="Search categories..."
        searchableFields={['name', 'code', 'description']}
        rowsPerPage={5}
        emptyStateMessage="No categories available."
        getRowKey={(row) => row.identifier}
      />

      {/* Pending categories section */}
      <PendingCategoriesSection
        pendingCategories={pendingCategories}
        onCreate={handleBatchCreate}
        onDelete={handleDeletePendingCategory}
      />

      {/* Modal for Category Form */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        aria-labelledby="category-form-dialog-title"
      >
        <DialogTitle id="category-form-dialog-title">
          Add New Category
        </DialogTitle>
        <DialogContent>
          <Box pt={1}>
            <CategoryForm
              form={form}
              onChange={handleCategoryFormChange}
              onSubmit={handleFormSubmitWithClose}
              error={error}
              success={success}
              isEditMode={false}
            />

            {/* Action Buttons aligned with form */}
            <Box display="flex" gap={2} justifyContent="flex-end" mt={3}>
              <Button onClick={handleCloseModal}>Cancel</Button>
              <Button
                onClick={handleFormSubmitWithClose}
                variant="contained"
                color="primary"
              >
                Add Category
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Modal for batch creation progress */}
      <BatchCreationModal
        open={modalOpen}
        title="Creating Categories"
        items={
          pendingCategories as unknown as {
            [key: string]: unknown;
            name: string;
            code: string;
          }[]
        }
        statuses={modalStatuses}
        currentIndex={currentModalIndex}
        getItemLabel={(item) => item.name as string}
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
        typeLabel="Category"
        getItemLabel={(item) => item.name as string}
      />
    </Box>
  );
});
StepCategory.displayName = 'StepCategory';
export default StepCategory;
