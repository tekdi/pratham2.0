import { useState } from 'react';
import { useRouter } from 'next/router';
import { useFrameworkFormStore } from '../store/frameworkFormStore';
import type { StepMasterCategoryHandle } from '../interfaces/MasterCategoryInterface';
import type { StepCategoryHandle } from '../interfaces/CategoryInterface';
import type { StepTermsHandle } from '../interfaces/TermInterface';
import type { StepAssociationHandle } from '../interfaces/AssociationInterface';

interface UseStepManagerProps {
  masterCategoryRef: React.RefObject<StepMasterCategoryHandle | null>;
  categoryRef: React.RefObject<StepCategoryHandle | null>;
  termsRef: React.RefObject<StepTermsHandle | null>;
  associationRef: React.RefObject<StepAssociationHandle | null>;
}

export const useStepManager = ({
  masterCategoryRef,
  categoryRef,
  termsRef,
  associationRef,
}: UseStepManagerProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  const { step, setStep, framework, fetchAndUpdateFramework } =
    useFrameworkFormStore();

  // Check for unsaved changes across all steps
  const checkUnsavedChanges = () => {
    if (step === 3 && masterCategoryRef.current?.hasUnsavedCategoryForm()) {
      return true;
    }
    if (step === 4 && categoryRef.current?.hasUnsavedCategories()) {
      return true;
    }
    if (step === 5 && termsRef.current?.hasUnsavedTerms()) {
      return true;
    }
    if (step === 6 && associationRef.current?.hasUnsavedAssociations()) {
      return true;
    }
    return false;
  };

  // Fetch framework data for specific steps
  const fetchFrameworkData = async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    if (!framework?.identifier) {
      return { success: true };
    }

    const result = await fetchAndUpdateFramework();
    if (!result.success) {
      setFetchError(result.error || 'Failed to fetch framework details');
      return { success: false, error: result.error };
    }
    return { success: true };
  };

  // Handle navigation to next step
  const handleNext = async () => {
    setFetchError(null);
    setIsLoading(true);

    try {
      // Check for unsaved changes
      if (checkUnsavedChanges()) {
        setShowUnsavedDialog(true);
        setIsLoading(false);
        return;
      }

      // Handle step-specific logic
      switch (step) {
        case 1:
          // Channel step - no additional logic needed
          break;
        case 2: {
          // Framework step - fetch framework data
          const result2 = await fetchFrameworkData();
          if (!result2.success) {
            setIsLoading(false);
            return;
          }
          break;
        }
        case 3:
          // Master Categories step - no additional logic needed
          break;
        case 4: {
          // Categories step - fetch framework data
          const result4 = await fetchFrameworkData();
          if (!result4.success) {
            setIsLoading(false);
            return;
          }
          break;
        }
        case 5: {
          // Terms step - fetch framework data
          const result5 = await fetchFrameworkData();
          if (!result5.success) {
            setIsLoading(false);
            return;
          }
          break;
        }
        case 6:
          // Association step - no additional logic needed
          break;
        case 7: {
          // View step - fetch framework data and navigate to frameworks page
          const result7 = await fetchFrameworkData();
          if (!result7.success) {
            setIsLoading(false);
            return;
          }
          router.push('/frameworks');
          return;
        }
      }

      // Move to next step if not at the end
      if (step < 7) {
        setStep(step + 1);
      }
    } catch (error) {
      setFetchError('An unexpected error occurred.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle navigation to previous step
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Handle dialog cancellation
  const handleDialogCancel = () => {
    setShowUnsavedDialog(false);
  };

  // Handle dialog confirmation to proceed to next step
  const handleDialogNext = () => {
    setShowUnsavedDialog(false);
    setStep(step + 1);
  };

  return {
    // State
    isLoading,
    fetchError,
    showUnsavedDialog,
    step,

    // Handlers
    handleNext,
    handleBack,
    handleDialogCancel,
    handleDialogNext,

    // Utilities
    checkUnsavedChanges,
  };
};
