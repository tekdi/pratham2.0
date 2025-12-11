import React from 'react';
import AssessmentResultPDF, {
  AssessmentResultPDFProps,
} from './AssessmentResultPDF';

const ManualAssessmentResultPDF: React.FC<AssessmentResultPDFProps> = (
  props
) => {
  return (
    <AssessmentResultPDF
      {...props}
      titleOverride="Manual Assessment Report"
    />
  );
};

export default ManualAssessmentResultPDF;

