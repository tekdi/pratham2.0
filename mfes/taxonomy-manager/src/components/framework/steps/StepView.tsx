import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Framework } from '../../../interfaces/FrameworkInterface';
import AssociationDetailsModal from '../AssociationDetailsModal';
import FrameworkDisplay from '../FrameworkDisplay';
import { useAssociationModal } from '../../../hooks/useAssociationModal';
import type { Category } from '../../../interfaces/CategoryInterface';
import frameworkService from '../../../services/frameworkService';

// StepView expects the framework code as a prop (from the stepper context or parent)
interface StepViewProps {
  frameworkCode: string;
}

const StepView: React.FC<StepViewProps> = ({ frameworkCode }) => {
  const [framework, setFramework] = useState<Framework | null>(null);
  const [categories, setCategories] = useState<Category[] | undefined>(
    undefined
  );
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);
  const { handleBadgeClick, modalProps } = useAssociationModal();

  useEffect(() => {
    let isMounted = true;
    setLocalLoading(true);
    setLocalError(null);
    setFramework(null);
    setCategories(undefined);
    frameworkService
      .getFrameworkById(frameworkCode)
      .then((fw) => {
        if (isMounted) {
          setFramework(fw);
          setCategories(fw.categories);
          setLocalLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setLocalError(
            err instanceof Error ? err.message : 'Failed to fetch framework'
          );
          setLocalLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [frameworkCode]);

  if (localLoading)
    return <Box sx={{ textAlign: 'center', py: 8 }}>Loading...</Box>;
  if (localError)
    return (
      <Box sx={{ textAlign: 'center', color: 'error.main', py: 8 }}>
        {localError}
      </Box>
    );
  if (!framework || typeof framework !== 'object')
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        No framework data available.
      </Box>
    );

  // Prepare framework with categories for FrameworkDisplay
  const frameworkWithCategories = {
    ...framework,
    categories: categories ?? framework.categories,
  };

  return (
    <>
      <FrameworkDisplay
        framework={frameworkWithCategories}
        onBadgeClick={handleBadgeClick}
      />
      {/* Association Details Modal */}
      <AssociationDetailsModal {...modalProps} />
    </>
  );
};

export default StepView;
