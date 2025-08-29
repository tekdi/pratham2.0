import React from 'react';
import StepChannel from './steps/StepChannel';
import StepFramework from './steps/StepFramework';
import StepMasterCategory from './steps/StepMasterCategory';
import StepCategory from './steps/StepCategory';
import StepTerms from './steps/StepTerms';
import StepAssociation from './steps/StepAssociation';
import StepView from './steps/StepView';
import type { StepMasterCategoryHandle } from '../../interfaces/MasterCategoryInterface';
import type { StepCategoryHandle } from '../../interfaces/CategoryInterface';
import type { StepTermsHandle } from '../../interfaces/TermInterface';
import type { StepAssociationHandle } from '../../interfaces/AssociationInterface';
import type { Framework } from '../../interfaces/FrameworkInterface';

interface StepRendererProps {
  step: number;
  framework: Partial<Framework> | null;
  masterCategoryRef: React.RefObject<StepMasterCategoryHandle>;
  categoryRef: React.RefObject<StepCategoryHandle>;
  termsRef: React.RefObject<StepTermsHandle>;
  associationRef: React.RefObject<StepAssociationHandle>;
}

// Component responsible for rendering the appropriate step content based on the current step
// Handles all step-specific rendering logic and ref management
const StepRenderer: React.FC<StepRendererProps> = ({
  step,
  framework,
  masterCategoryRef,
  categoryRef,
  termsRef,
  associationRef,
}) => {
  switch (step) {
    case 1:
      return <StepChannel />;
    case 2:
      return <StepFramework />;
    case 3:
      return <StepMasterCategory ref={masterCategoryRef} />;
    case 4:
      return <StepCategory ref={categoryRef} />;
    case 5:
      return <StepTerms ref={termsRef} />;
    case 6:
      return <StepAssociation ref={associationRef} />;
    case 7:
      return framework?.code ? (
        <StepView frameworkCode={framework.code} />
      ) : null;
    default:
      return null;
  }
};

export default StepRenderer;
