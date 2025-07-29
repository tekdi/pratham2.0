import QuestionSetEditor from '@questionSet';

export const QuestionSet = (props: { onEvent?: (event: any) => void }) => {
  return <QuestionSetEditor onEvent={props.onEvent} />;
};

export default QuestionSet;
