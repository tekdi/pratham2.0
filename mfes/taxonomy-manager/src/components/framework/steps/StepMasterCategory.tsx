import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from 'react';
import { StepMasterCategoryHandle } from '../../../interfaces/MasterCategoryInterface';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import AddIcon from '@mui/icons-material/Add';
import MasterCategoryForm from '../../masterCategory/MasterCategoryForm';
import MasterCategoryList from '../../masterCategory/MasterCategoryList';
import { useMasterCategoryForm } from '../../../hooks/useMasterCategoryForm';

// This component renders a step in the taxonomy management process.
// It displays a list of master categories and a form to create a new master category.
// The component uses a custom hook `useMasterCategoryForm` to manage the form state and handle form submissions. It also provides a method to check if there are unsaved changes in the form.
const StepMasterCategory = forwardRef<StepMasterCategoryHandle, object>(
  (props, ref) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
      form,
      handleFormChange,
      handleFormSubmit,
      formLoading,
      formError,
      formSuccess,
      categories,
      loading,
      error,
    } = useMasterCategoryForm();

    // Close modal when form is successfully submitted
    useEffect(() => {
      if (formSuccess && isModalOpen) {
        const timer = setTimeout(() => {
          setIsModalOpen(false);
        }, 1500); // Close after showing success message briefly
        return () => clearTimeout(timer);
      }
    }, [formSuccess, isModalOpen]);

    useImperativeHandle(ref, () => ({
      hasUnsavedCategoryForm: () => {
        return Object.values(form).some(
          (val) => typeof val === 'string' && val.trim() !== ''
        );
      },
    }));

    const handleOpenModal = () => {
      setIsModalOpen(true);
      // Clear any previous form errors/success when opening modal
      // Note: You might want to add a clearFormMessages function to the hook
    };

    const handleCloseModal = () => {
      if (!formLoading) {
        setIsModalOpen(false);
      }
    };

    const handleFormSubmitWithClose = (e: React.FormEvent) => {
      handleFormSubmit(e);
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
            Master Categories
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3, maxWidth: '80%' }}
          >
            Browse existing master categories or create a new one for your
            taxonomy.
          </Typography>

          {/* Action Button */}
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenModal}
              sx={{
                minWidth: 220,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Create New Master Category
            </Button>
          </Box>
        </Box>

        {/* Categories List */}
        <MasterCategoryList
          categories={categories}
          loading={loading}
          error={error}
        />

        {/* Modal for Master Category Form */}
        <Dialog
          open={isModalOpen}
          onClose={handleCloseModal}
          maxWidth="md"
          fullWidth
          disableEscapeKeyDown={formLoading}
          aria-labelledby="master-category-form-dialog-title"
        >
          <DialogTitle id="master-category-form-dialog-title">
            Create New Master Category
          </DialogTitle>
          <DialogContent>
            <Box pt={1}>
              <MasterCategoryForm
                form={form}
                onChange={handleFormChange}
                onSubmit={handleFormSubmitWithClose}
                loading={formLoading}
                error={formError}
                success={formSuccess}
                hideSubmitButton={true}
              />

              {/* Action Buttons aligned with form */}
              <Box display="flex" gap={2} justifyContent="flex-end" mt={3}>
                <Button onClick={handleCloseModal} disabled={formLoading}>
                  Cancel
                </Button>
                <Button
                  onClick={handleFormSubmitWithClose}
                  variant="contained"
                  color="primary"
                  disabled={formLoading}
                >
                  {formLoading ? 'Creating...' : 'Create Master Category'}
                </Button>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    );
  }
);

StepMasterCategory.displayName = 'StepMasterCategory';

export default StepMasterCategory;
