import React from 'react';
import Button from '@mui/material/Button';
import { ArrowRight as ArrowRightIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useFrameworkFormStore } from '../../store/frameworkFormStore';
import { publishFrameworkAfterBatchOperation } from '../../utils/HelperService';

interface StepperButtonProps {
  step: number;
  isLoading: boolean;
  channel?: { code?: string } | null;
  framework?: { code?: string; identifier?: string } | null;
  onNext: () => void;
  stepsLength: number;
}

const StepperButton: React.FC<StepperButtonProps> = ({
  step,
  isLoading,
  channel,
  framework,
  onNext,
  stepsLength,
}) => {
  const router = useRouter();

  // Helper function to determine button text
  const getButtonText = () => {
    if (isLoading) return 'Loading...';
    if (step < stepsLength) return 'Continue';
    return 'View All Frameworks';
  };

  // Helper function to determine if end icon should be shown
  const shouldShowEndIcon = () => {
    return step < stepsLength;
  };

  // Helper function to determine if button should be disabled
  const isButtonDisabled = () => {
    if (isLoading) return true;
    if (step === 1 && !channel?.code) return true;
    if (step === 2 && !framework?.identifier) return true;
    return false;
  };

  switch (step) {
    case 6:
      return (
        <Button
          onClick={async () => {
            if (framework?.code) {
              await publishFrameworkAfterBatchOperation(
                framework.code,
                'association publish'
              );
            }
            onNext();
          }}
          disabled={isLoading}
          endIcon={<ArrowRightIcon fontSize="small" />}
          variant="contained"
          color="primary"
          sx={{ minWidth: 160, fontWeight: 600 }}
        >
          {isLoading ? 'Loading...' : 'View Framework'}
        </Button>
      );
    case 7:
      return (
        <Button
          onClick={async () => {
            const handleRouteChange = () => {
              useFrameworkFormStore.getState().reset();
              router.events.off('routeChangeComplete', handleRouteChange);
            };
            router.events.on('routeChangeComplete', handleRouteChange);
            await router.push('/frameworks');
          }}
          disabled={isLoading}
          variant="contained"
          color="primary"
          sx={{ minWidth: 160, fontWeight: 600 }}
        >
          View All Frameworks
        </Button>
      );
    default:
      return (
        <Button
          onClick={onNext}
          disabled={isButtonDisabled()}
          endIcon={
            shouldShowEndIcon() ? (
              <ArrowRightIcon fontSize="small" />
            ) : undefined
          }
          variant="contained"
          color="primary"
          sx={{ minWidth: 160, fontWeight: 600 }}
        >
          {getButtonText()}
        </Button>
      );
  }
};

export default StepperButton;
