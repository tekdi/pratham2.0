'use client';

import React, { useEffect, useState } from 'react';
import ObservationComponent from '../ObservationComponent';
import { fetchQuestion } from '../../services/ObservationServices';

interface ObservationsProps {
  observationId?: string; // Define the correct type here based on your data structure
  entityId?: string;
}

const Observations: React.FC<ObservationsProps> = ({
  observationId,
  entityId,
}) => {
  const [questionResponse, setQuestionResponse] = useState<any>(null);
  console.log({ observationId, entityId });

  useEffect(() => {
    const fetchQuestionsList = async () => {
      try {
        if (observationId) {
          const response = await fetchQuestion({ observationId, entityId });
          const combinedData = {
            solution: response.solution,
            assessment: {
              ...response.assessment,
            },
          };

          setQuestionResponse(combinedData);
        }
      } catch (error) {
        console.error('Error fetching cohort list', error);
      }
    };

    fetchQuestionsList();
  }, []);

  return (
    <div>
      <ObservationComponent
        observationQuestions={questionResponse}
        observationName="Testing Testing"
      />
    </div>
  );
};

export default Observations;
