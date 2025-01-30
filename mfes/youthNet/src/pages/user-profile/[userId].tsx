import React, { useEffect } from 'react';

const userId = () => {
  const [selfUserId, setSelfUserId] = React.useState<string | null>(null);
  const [userRole, setUserRole] = React.useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userId = localStorage.getItem('userId');
      setSelfUserId(userId);
      const role = localStorage.getItem('role');
      setUserRole(role);
    }
  }, []);

  return <div>{selfUserId}</div>;
};

export default userId;
