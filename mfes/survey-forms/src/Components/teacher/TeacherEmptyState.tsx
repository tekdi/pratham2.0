import React from 'react';
import NoDataFound from '../NoDataFound/NoDataFound';

interface Props {
  message?: string;
}

const TeacherEmptyState: React.FC<Props> = ({
  message = 'No rows match your filters yet.',
}) => {
  return <NoDataFound message={message} />;
};

export default TeacherEmptyState;
