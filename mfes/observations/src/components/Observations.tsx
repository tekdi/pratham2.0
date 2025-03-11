import React, { useEffect, useState } from 'react';
import ObservationComponent from './ObservationComponent';
import { fetchQuestion } from '../services/ObservationServices';

const Observations = () => {
  const [questionResponse, setQuestionResponseResponse] = useState<any>(null);
  useEffect(() => {
    localStorage.setItem(
      'token',
      'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJha0d1WG1zVTVxMXhOczZxUkVTWWZkTkRyUWRiZ2ZGekRFMEswRkFDNUVzIn0.eyJleHAiOjE3NDE3NjA1MjAsImlhdCI6MTc0MTY3NDEyMCwianRpIjoiYzYwZTcwMGYtMmFiYy00NmM2LTlkM2ItNzJiYjI2YjdmNTA0IiwiaXNzIjoiaHR0cHM6Ly9xYS1rZXljbG9hay5wcmF0aGFtZGlnaXRhbC5vcmcvYXV0aC9yZWFsbXMvcHJhdGhhbSIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJiOGI4MmRmZS00YjllLTQ4ZjktOGQ3YS05MzFmOTA4MTdmMzYiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJwcmF0aGFtIiwic2Vzc2lvbl9zdGF0ZSI6Ijc4Y2RhMzdhLTRmZjItNDEzNS05ZjIzLWE4YjBiOGVlMGQ3MyIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiLyoiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJkZWZhdWx0LXJvbGVzLXByYXRoYW0iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6InByYXRoYW0tcm9sZSBlbWFpbCBwcm9maWxlIiwic2lkIjoiNzhjZGEzN2EtNGZmMi00MTM1LTlmMjMtYThiMGI4ZWUwZDczIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJuYW1lIjoiVmlzaGFsIG1hbmUiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJ0bHNjcmoyMzcxMjYyIiwiZ2l2ZW5fbmFtZSI6IlZpc2hhbCIsImZhbWlseV9uYW1lIjoibWFuZSJ9.t_37n6XANSh7JUPL1fqWZzA_KNZwNq36jzIxHOoPnC8yI8x4pLCjcSQ380hXaaU8qphKzYjBIWzGXcpDdrIqHX6-4W2HDrpvfF6AsXPqaERz6s7aga3hXfK-FAIlLG3iLps6VIqRBKUBFKtsXI3H2TWpkZSTrqcYfAaIA5LH2Uqo8rk9GO2RSqhG-gXGtwk4CrORkqBZPjGwl97nAsptfUFmU9opBlBSiEsIfBGMttExhSHOMjrUfqLLc6hUT0xjxXvOB-BE25U6JsOv5wB3FxbfUA7X6DC5RjOgUPtxxLMiBlHvSW6VgW2b_zZRU-PI751KBKZnlRh7yy4QBLgwaQ'
    );
    const fetchQuestionsList = async () => {
      try {
        const observationId = '677e6c2e8b8b39e34ab744f5';
        const entityId = '2b185deb-b140-46fc-a423-69ae04632d76';
        if (observationId) {
          const response = await fetchQuestion({ observationId, entityId });
          const combinedData = {
            solution: response.solution,
            assessment: {
              ...response.assessment, // Spread all properties from assessment
            },
          };

          setQuestionResponseResponse(combinedData);
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
