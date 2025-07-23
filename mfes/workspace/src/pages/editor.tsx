import React from 'react';
import { QuestionSet } from '@shared-lib';
import { updateAIQuestionSet } from '@workspace/services/ContentService';
const Editor = () => {
  const onEvent = async (event: any) => {
    if (event.detail?.action === 'publishContent') {
      await updateAIQuestionSet(event.detail?.identifier);
    }
  };
  return <QuestionSet onEvent={onEvent} />;
};

export default Editor;
